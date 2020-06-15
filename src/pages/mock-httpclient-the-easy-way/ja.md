---
title: MoqでHttpClientとIHttpClientFactoryをモックする簡単な方法
date: 2018-12-02 17:59 -0400
---

HttpClientを直にモックすることが難しいのは[よく知られています](https://github.com/dotnet/corefx/issues/1624)。これについてブログ投稿がもう多いですが解決法は一般にモックできられる何らかのラッパーを作るかHttpClientのために特別にテスティングライブラリを使うことですけど、前者はよく望ましくなくて、後者はHTTPリクエストだけのために別のモックシステムに切り替えることが必要で、あのシステムの方が柔軟ではないか他のモックと一緒に不味そうですかもしれない

ここで私はHttpClientにもMoqを使える方法を示しています、そして拡張メソッドの助けを借りてたくさんのボイラプレートなしでそうする

<!-- end -->

## バニラなMoqで

HttpClientはただHttpMessageHandlerのラッパーです。HttpClientで送ったリクエストがついにハンドラの唯一の`SendAsync`いうメソッド中に通ります。 実はHttpClientのあまり知られていないフィーチャーです、リクエストパイプラインのミドルウェアするDelegatingHandler（委任してるハンドラ）を作れますから（[例はこちら](https://docs.microsoft.com/ja-jp/aspnet/web-api/overview/advanced/http-message-handlers)、でもクラシックなASP.NETの文脈です）

バーチャルなメソッドがないHttpClientよりハンドラをモックするの方がいいですが、残念ながらHttpMessageHandlerが[インタフェースを実装しない](https://source.dot.net/#System.Net.Http/System/Net/Http/HttpMessageHandler.cs)し、`SendAsync`というメソッドがprotectedです：

```csharp
protected internal abstract Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken);
```

幸いにMoqは[protectedなメソッドをモックする方](https://github.com/Moq/moq4/wiki/Quickstart#miscellaneous)を備えるし、virtualじゃないけれどabstractだからモックが実装できます。普通の方法（文字列として名前を渡さなくてラムダとIntelliSense）でこのメソッドを対象するには同じメソッドがあるダミーのインタフェースを作るの必要があります。それでこのように使えます：

```csharp
var handler = new Mock<HttpMessageHandler>();
var client = new HttpClient(handler, false);

handler.Protected().As<IHttpMessageHandler>()
    .Setup(x => x.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()));
```

[内部的に](https://github.com/moq/moq4/blob/v4.10.0/src/Moq/Protected/ProtectedAsMock.cs#L184)Moqは本物のクラスの対象されたメソッドをリフレクションで取り出して、普通にアクセスできないメソッドを呼び出すように**エクスプレッションを書き換える**

これはもう多くのコードになっているけど。しかもインタフェースを作らなければならなかった。複数のテストプロジェクトがあったら、すべてがあのインタフェースのコピーか共通プロジェクトの参照の必要があります

特定のリクエストをマッチしてレスポンスを返すのはもっと煩雑になる：

```csharp
handler.Protected().As<IHttpMessageHandler>()
    .Setup(x => x.SendAsync(
        It.Is<HttpRequestMessage>(r =>
            r.Method == HttpMethod.Get &&
            r.RequestUri == new Uri($"{BaseUrl}/api/stuff")),
        It.IsAny<CancellationToken>()))
    .ReturnsAsync(new HttpResponseMessage()
    {
        Content = new StringContent("stuff")
    });
```

綺麗な解決法ではないことが当たり前でしょう。Moqとの唯一の選択肢であればおそらくHttpClientを扱うことを簡単にする別のライブラリを調べる。しかし、MoqがHttpClientをモックできることを裏付けたし、上のコードが長いけれど、簡単にする方法があります

## 簡単な方法

私はこれを簡単にするように拡張メソッドのセットを書いてしまいました。上のコードはこれになる：

```csharp
var handler = new Mock<HttpMessageHandler>();
var client = handler.CreateClient();

handler.SetupRequest(HttpMethod.Get, $"{BaseUrl}/api/stuff")
    .ReturnsResponse("stuff");
```

拡張は2つグループに分けられます：

- リクエストのヘルパー： **SetupRequest**、**SetupRequestSequence**、**VerifyRequest**（と相当の「AnyRequest」、つまりすべて）
- レスポンスのヘルパー： **ReturnsResponse**（StringContent、ByteArrayContent、StreamContent、またはステータスコードだけを送ったりヘッダーを設定したりすることを簡単にするいろいろのオーバーロードがある）

すべてのリクエストのヘルパーは同じオーバーロードがあります。任意のHTTPメソッド、URLかUri、と述語を受け取りますから、**ヘッダーやJSONの本体やURLの部分**でもリクエストをマッチできます

```csharp
handler
    .SetupRequest(HttpMethod.Post, url, async request =>
    {
        // このセットアップは予期された (expected) IDがあるリクエストのみをマッチする
        var json = await request.Content.ReadAsStringAsync();
        var model = JsonConvert.DeserializeObject<Model>();
        return model.Id == expected.Id;
    })
    .ReturnsResponse(HttpStatusCode.Created);
```

`SetupRequest()`は[`InSequence()`もサポートされます](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/test/Moq.Contrib.HttpClient.Test/SequenceExtensionsTests.cs)。これは必ず順にマッチするコールの順序をセットアップします。後者は実は`Protected()`と一緒に使われることができない（執筆時点）けど、ProtectedAsMockが内部的にするのようにprotectedのメソッドを呼び出すように[エクスプレッションツリーを書き換えり](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/src/Moq.Contrib.HttpClient/MockHttpMessageHandlerExtensions.cs#L96-L148)によってここで可能になります

ライブラリは[NuGetで](https://www.nuget.org/packages/Moq.Contrib.HttpClient/)利用可能です。詳細な例と使用方法は[GitHubのリードミーを見てください](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/README.ja.md)

### 舞台裏：Moqのカスタムマッチャーを活用する

Moqは様々な場合のためのいくつかの違うSetupというメソッドがあります。Verifyと一緒に、全部は関数呼び出し（この場合、リクエスト）をマッチするためのエクスプレッションを受け取ります。重複コードを回避のために、すべてのリクエストのヘルパーは「カスタムマッチャー」の単一セットに委ねます

このフィーチャーは[クイックスタート](https://github.com/Moq/moq4/wiki/Quickstart#advanced-features)の「Advanced Features」の下に少し述べた：`Match.Create()`を述語と呼び出すメソッドによって再利用可能な引数マッチャーを作れるし、それは`It.Is()`の代わりとして使えます。[文書化はこちら](http://www.nudoq.org/#!/Packages/Moq/Moq/Match\(T\))（`[Matcher]`という属性の参照を無視して、それ以来すたれたから）

ここで使われるマッチャーの例：

```csharp
public static HttpRequestMessage Is(HttpMethod method, Uri requestUri, Predicate<HttpRequestMessage> match)
{
    if (match == null)
        throw new ArgumentNullException(nameof(match));

    return Match.Create(
        r => r.Method == method && r.RequestUri == requestUri && match(r),
        () => Is(method, requestUri, match));
}
```

リクエストのヘルパーは単にすべてのカスタムマッチャーのメソッドシグネチャを鏡して、パラメータをマッチャーに渡します：

```csharp
public static ISetup<HttpMessageHandler, Task<HttpResponseMessage>> SetupRequest(
    this Mock<HttpMessageHandler> handler, HttpMethod method, Uri requestUri, Predicate<HttpRequestMessage> match)
    => handler.Setup(x => x.SendAsync(RequestMatcher.Is(method, requestUri, match), It.IsAny<CancellationToken>()));
```

これらのすべてが予測可能な形がありますから、この重複と矛盾の可能性を回避のために、リクエストのヘルパーは[T4テンプレート](https://docs.microsoft.com/ja-jp/visualstudio/modeling/code-generation-and-t4-text-templates)によって生成される

### IHttpClientFactoryは？

HttpClientについて投稿を読んでいたら、`using`中に入れないことをおそらくもう知ってる、それは[アプリがソケットを平らげているのにつながりますから](https://aspnetmonsters.com/2016/08/2016-08-27-httpclientwrong/)。普通の忠告は単一HttpClientを再利用することだけどこれはDNSの変更に反応しないというマイナスがあります。だから、ASP.NET Coreは新しい[IHttpClientFactory](https://docs.microsoft.com/ja-jp/aspnet/core/fundamentals/http-requests)を導入します。文書化は、

> - 論理的な`HttpClient`インスタンスの呼称と設定のため一元的な場所を備える \[...]
> - `HttpClient`のライフタイムを手動で管理するときに発生する一般的なDNSの問題を回避のために基礎となる`HttpClientMessageHandler`インスタンスのプーリングとライフタイムを管理する
> - ファクトリーで作られたクライアントで送ったリクエストの設定できられるログ経験（`ILogger`で）を追加する

と言います（自分の翻訳）

ボーナスとして、上記のHttpClientのミドルウェアをプラグインする能力を[もっととっつきやすいにする](https://docs.microsoft.com/ja-jp/aspnet/core/fundamentals/http-requests#outgoing-request-middleware)（例えば、再試行と失敗を自動的に処理するために[Polly](https://github.com/App-vNext/Polly#polly)を使う）

利用法次第では、コンストラクタが単にIHttpClientFactoryによって注入したHttpClientを受け取るかもしれない。コンストラクタはファクトリーそのものを受け取れば、これは同じようにモックされる：

```csharp
var handler = new Mock<HttpMessageHandler>();
var factory = handler.CreateClientFactory();
```

このファクトリーはクラスに渡せる、それとも[AutoMockerによって注入](https://github.com/moq/Moq.AutoMocker)できる、そして`factory.CreateClient()`を呼び出すコードがモックなハンドラを使うクライアントを受けます

名前付きクライアントも設定できます、デフォルトを無効にする：

```csharp
Mock.Get(factory).Setup(x => x.CreateClient("api"))
    .Returns(() =>
    {
        var client = handler.CreateClient();
        client.BaseAddress = ApiBaseUrl;
        return client;
    });
```

&nbsp;

これまで読んでくれてありがとう。[完全な用例と使用方法はGitHubにあります](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/README.ja.md)。これが役立つならば私に教えてください

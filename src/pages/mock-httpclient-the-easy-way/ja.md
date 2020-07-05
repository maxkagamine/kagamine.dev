---
title: MoqでHttpClientとIHttpClientFactoryをモックする簡単な方法
date: 2018-12-02T17:59-0400
slug: httpclient-mock-kantan-na-houhou
---

HttpClientを直にモックすることが難しいのは[よく知られている](https://github.com/dotnet/corefx/issues/1624)。一般の解決法は何かのラッパーを作って代わりにそれをモックすること（コードを乱雑しても）またはHttpClient固有のテスティングライブラリを使うこと（しかしHTTP呼び出しのために別のモックシステムに切り替える必要があるし他のモックとうまく合わないかも）

この投稿で私はHttpClientにもMoqを使用する方法を示しています。拡張メソッドの助けではHTTPリクエストをモックすることがサービスメソッドをモックするように簡単になれます

<!-- end -->

## バニラなMoqで

HttpClientはただHttpMessageHandlerをラップするヘルパーメソッドのセットです。リクエストは最後にハンドラの唯一の`SendAsync`メソッド中に通る。ちなみにこれはHttpClientのあまり知られていないフィーチャーです。リクエストパイプラインのミドルウェアとして機能するDelegatingHandler（委任してるハンドラ）を作ることができる（[このページが説明する](https://docs.microsoft.com/ja-jp/aspnet/web-api/overview/advanced/http-message-handlers)、文脈が古いASP.NETだけど）

バーチャルなメソッドのないHttpClientではなく、ハンドラをモックしよう。でも、HttpMessageHandlerが[インタフェースを実装しない](https://source.dot.net/#System.Net.Http/System/Net/Http/HttpMessageHandler.cs)し、`SendAsync`メソッドがprotectedです：

```csharp
protected internal abstract Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken);
```

幸いにMoqは[protectedなメソッドをモックする方](https://github.com/Moq/moq4/wiki/Quickstart#miscellaneous)が備わってて、abstractなのでモックが実装できる。通常の方法でこのメソッドを対象するために（つまり文字列として名前を渡さなくてラムダやIntelliSenseで）同じメソッドがあるダミーのインタフェースを作る必要がある。このように使う：

```csharp
var handler = new Mock<HttpMessageHandler>();
var client = new HttpClient(handler, false);

handler.Protected().As<IHttpMessageHandler>() // 私たちのダミーインタフェース
    .Setup(x => x.SendAsync(
        It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()));
```

[内部的に](https://github.com/moq/moq4/blob/v4.10.0/src/Moq/Protected/ProtectedAsMock.cs#L184-L190)はMoqが本物のクラスの対象されたメソッドをリフレクションで取り出して、普通にアクセスできないメソッドを呼び出すように**エクスプレッションを書き換える**

もう多くのコードになり始めているし、さらに悪いことにインタフェースを作らないといけなかった。複数のテストプロジェクトがあったら、それぞれのはあのインタフェースのコピーか共通プロジェクトの参照が必要です

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

言うまでもなく、あまりきれいな解決法じゃない。選択肢がこれしかなければおそらくHttpClientを扱うことをもっと簡単にするために他のライブラリを探す

しかし、私たちはMoqがHttpClientをモックできることを証明したから、必要なことは簡単にする拡張メソッドを書くことだけ。想像したかもしれませんが、私はまさにそれをした

## 簡単な方法

[拡張メソッド](https://docs.microsoft.com/ja-jp/dotnet/csharp/programming-guide/classes-and-structs/extension-methods)で既存のクラスとインタフェースに機能を追加することがC#のすごいことの一つです。上の怪物が次のように書き換える：

```csharp
var handler = new Mock<HttpMessageHandler>();
var client = handler.CreateClient();

handler.SetupRequest(HttpMethod.Get, $"{BaseUrl}/api/stuff")
    .ReturnsResponse("stuff");
```

[Moq.Contrib.HttpClient](https://github.com/maxkagamine/Moq.Contrib.HttpClient)はヘルパーの2つのセットを導入する：

- リクエストのヘルパー： **SetupRequest**、**SetupRequestSequence**、**VerifyRequest** （と相当のAnyRequest）
- レスポンスのヘルパー： **ReturnsResponse**（StringContent、ByteArrayContent、StreamContent、またはステータスコードだけを送ることを簡単にするいろいろのオーバーロードがある）

リクエストのヘルパーはすべて同じオーバーロードがある。任意のHTTPメソッド、URLかUri、述語を受け取る。述語は正確なURLではなく、URLの部分とかヘッダーとかJSONの本体とかでリクエストをマッチできる：

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

普通に必要がないけど、`SetupRequest()`は必ず順にマッチするコールの順序をセットアップする[`InSequence()`もサポートする](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/test/Moq.Contrib.HttpClient.Test/SequenceExtensionsTests.cs)。実装はちょっと面白い：執筆時点、Moqが実は`Protected()`と`InSequence()`を一緒にサポートしないけど、ProtectedAsMockが内部的にするようにprotectedのメソッドを呼び出すように[エクスプレッションツリーを書き換えり](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/src/Moq.Contrib.HttpClient/MockHttpMessageHandlerExtensions.cs#L96-L148)によってここで可能になる

[NuGetで](https://www.nuget.org/packages/Moq.Contrib.HttpClient/)入手可能です。詳細な使用方法は[GitHubのリードミー](https://github.com/maxkagamine/Moq.Contrib.HttpClient)を見てください。特に、実際にどう見えるかをつかむためにはユニットテストを見る価値がある

### 舞台裏：Moqのカスタムマッチャーを活用する

Moqはさまざまな場合のためのいくつかの違うSetupメソッドがある。Verifyとも、すべてが関数呼び出し（この場合、リクエスト）をマッチするための[エクスプレッション](https://docs.microsoft.com/ja-jp/dotnet/csharp/programming-guide/concepts/expression-trees/)を受け取る。重複をを避けるために、リクエストのヘルパーはすべてカスタムマッチャーの単一のセットに委ねている

カスタムマッチャーはMoqの[クイックスタート](https://github.com/Moq/moq4/wiki/Quickstart#advanced-features)で「Advanced Features」の下に手短に触れられた：`Match.Create()`を述語と呼び出すメソッドを作ると、再利用可能な引数マッチャーを作って、`It.Is()`の代わりに使うことができる。[文書化はこちらです](http://www.nudoq.org/#!/Packages/Moq/Moq/Match\(T\))（`[Matcher]`という属性の参照を無視して。廃たれたしもういらない）

ここで使われているマッチャーの例：

```csharp
public static HttpRequestMessage Is(HttpMethod method, Uri requestUri, Predicate<HttpRequestMessage> match)
{
    if (match == null)
        throw new ArgumentNullException(nameof(match));

    return Match.Create(
        r => r.Method == method && r.RequestUri == requestUri && match(r),
        () => Is(method, requestUri, match)); // 最後のパラメータが失敗メッセージのみに使用される
}
```

カスタムの`RequestMatcher.Is()`メソッドがそれで`It.Is()`と同じように使われるし、`Match.Create(r => ...)`の述語がtrueを返すとマッチする

リクエストのヘルパーは単にすべてのカスタムマッチャーのメソッドシグネチャを鏡して、自分のパラメータをマッチャーに渡す：

```csharp
public static ISetup<HttpMessageHandler, Task<HttpResponseMessage>> SetupRequest(
    this Mock<HttpMessageHandler> handler, HttpMethod method, Uri requestUri, Predicate<HttpRequestMessage> match)
    => handler.Setup(x => x.SendAsync(RequestMatcher.Is(method, requestUri, match), It.IsAny<CancellationToken>()));
```

予測可能な形になるから、重複と矛盾の可能性を避けるためにリクエストのヘルパーは[T4テンプレート](https://docs.microsoft.com/ja-jp/visualstudio/modeling/code-generation-and-t4-text-templates)によって生成される。（2020年更新：自分のプロジェクトでこんなことをしたければ、[ソースジェネレータ](https://devblogs.microsoft.com/dotnet/introducing-c-source-generators/)をチェック！）

## IHttpClientFactoryは？

HttpClientはIDisposableなので`using`中によく入れられてしまう。でも直感に反して、これは間違うし、[ソケットを使い果たしていることにつながる可能性があるんです](https://aspnetmonsters.com/2016/08/2016-08-27-httpclientwrong/)。一般の忠告は単一のHttpClientを再利用することだけどそうしたらDNSの変更に反応しない

この問題を軽減するように、ASP.NET Coreが[IHttpClientFactory](https://docs.microsoft.com/ja-jp/aspnet/core/fundamentals/http-requests)を導入する。文書化を翻訳します：

> - 論理的な`HttpClient`インスタンスの呼称と設定のため一の元的な場所を備える \[...]
> - `HttpClient`のライフタイムを手動で管理するときに発生する一般的なDNSの問題を回避のために基礎となる`HttpClientMessageHandler`インスタンスのプーリングとライフタイムを管理する
> - ファクトリーで作られたクライアントで送ったリクエストの設定できられるログ経験（`ILogger`で）を追加する

ボーナスとして、これが上で述べて[ミドルウェアをプラグインするHttpClientの能力](https://docs.microsoft.com/ja-jp/aspnet/core/fundamentals/http-requests#outgoing-request-middleware)をもっととっつきやすいにする。例えば、再試行と失敗を自動的に処理するために[Polly](https://github.com/App-vNext/Polly#polly)を使うこと

利用法次第、コンストラクタが単にIHttpClientFactoryによって注入したHttpClientを受け取るかもしれない。その場合はテストが違わない。コンストラクタがファクトリーそのものを受け取る場合は、同じようにモックできる：

```csharp
var handler = new Mock<HttpMessageHandler>();
var factory = handler.CreateClientFactory();
```

このファクトリーはクラスに渡されたり[AutoMockerによって注入されたり](https://github.com/moq/Moq.AutoMocker)できる。`factory.CreateClient()`を呼び出すコードがモックなハンドラを使うクライアントを受ける

`CreateClientFactory()`という拡張メソッドはディフォルトのクライエントを返すようにセットアップされたモックを返す。[名前付きクライアント](https://docs.microsoft.com/ja-jp/aspnet/core/fundamentals/http-requests?view=aspnetcore-3.1#named-clients)を使っている場合は次のようにセットアップを追加できる：

```csharp
Mock.Get(factory).Setup(x => x.CreateClient("api"))
    .Returns(() =>
    {
        var client = handler.CreateClient();
        client.BaseAddress = ApiBaseUrl;
        return client;
    });
```

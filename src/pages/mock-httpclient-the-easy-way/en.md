---
title: Mocking HttpClient & IHttpClientFactory with Moq (the easy way)
date: 2018-12-01 13:17 -0400
---

Mocking HttpClient directly is [notoriously difficult](https://github.com/dotnet/corefx/issues/1624). There are a number of blog posts about this already, but the solution has generally been to either create a wrapper of some form to mock instead or use an HttpClient-specific testing library. The former is typically undesirable, however, and the latter requires switching to a separate mocking system for HTTP calls which may be less flexible or awkward in conjunction with other mocks.

Here I'll show how we can use Moq for HttpClient as well, and with the help of extension methods, do so without any excessive boilerplate.

<!-- end -->

## HttpClient with vanilla Moq

HttpClient itself is merely a wrapper around an HttpMessageHandler; all requests ultimately go through the handler's sole `SendAsync` method. This is actually a rather powerful yet little-known feature of HttpClient in that it allows one to create a DelegatingHandler which acts as middleware around the request pipeline ([several examples here](https://docs.microsoft.com/en-us/aspnet/web-api/overview/advanced/http-message-handlers), albeit in the context of classic ASP.NET).

Rather than mock HttpClient itself (whose methods are not virtual anyway), we would mock its handler. Unfortunately, not only does HttpMessageHandler [not implement an interface](https://source.dot.net/#System.Net.Http/System/Net/Http/HttpMessageHandler.cs), but the `SendAsync` method is protected:

```csharp
protected internal abstract Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken);
```

Luckily, Moq provides a way of [mocking protected methods](https://github.com/Moq/moq4/wiki/Quickstart#miscellaneous), and while it's not virtual, it _is_ abstract, so the mock can implement it. In order to target this method in a setup the usual way, with a lambda and IntelliSense as opposed to by passing its name as a string, we need to create a dummy interface that contains the same method, which we use like so:

```csharp
var handler = new Mock<HttpMessageHandler>();
var client = new HttpClient(handler, false);

handler.Protected().As<IHttpMessageHandler>()
    .Setup(x => x.SendAsync(It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()));
```

[Under the hood](https://github.com/moq/moq4/blob/v4.10.0/src/Moq/Protected/ProtectedAsMock.cs#L184), Moq uses reflection to retrieve the target method on the real class and then _rewrites the expression_ to call the otherwise-inaccessible method.

This is already turning into a lot of code, though, and in addition we've had to create an interface. If we had multiple test projects, each one would need a copy of that interface or a reference to a common project.

Matching specific requests and then returning a response becomes even more cumbersome:

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

Needless to say this is not a very clean solution, and if this were our only option with Moq, we might look for a different library to make dealing with HttpClient easier. That said, we have proven that Moq is capable of mocking HttpClient, and while the above is exceedingly verbose, it can be simplified.

## The easy way

I wrote a set of extension methods to make this easier. The above code now becomes:

```csharp
var handler = new Mock<HttpMessageHandler>();
var client = handler.CreateClient();

handler.SetupRequest(HttpMethod.Get, $"{BaseUrl}/api/stuff")
    .ReturnsResponse("stuff");
```

The extensions are divided into two groups:

- Request helpers: **SetupRequest**, **SetupRequestSequence**, and **VerifyRequest** (and corresponding "AnyRequest").
- Response helpers, i.e. **ReturnsResponse**, which has various overloads to simplify sending a StringContent, ByteArrayContent, StreamContent, or just a status code, and optionally setting response headers.

The request helpers all have the same overloads, taking an optional method, URL (or Uri), and/or a predicate, allowing for matching requests in any way necessary, including by **headers, JSON body, and partial URLs**:

```csharp
handler
    .SetupRequest(HttpMethod.Post, url, async request =>
    {
        // This setup will only match calls with the expected id
        var json = await request.Content.ReadAsStringAsync();
        var model = JsonConvert.DeserializeObject<Model>();
        return model.Id == expected.Id;
    })
    .ReturnsResponse(HttpStatusCode.Created);
```

`SetupRequest()` also [works with `InSequence()`](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/test/Moq.Contrib.HttpClient.Test/SequenceExtensionsTests.cs) which sets up a chain of calls that must be made in order. The latter is not actually usable together with `Protected()`, at time of writing, but is made possible here by [rewriting the expression tree](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/src/Moq.Contrib.HttpClient/MockHttpMessageHandlerExtensions.cs#L96-L148) to call the protected method similar to what ProtectedAsMock does internally as mentioned above.

The library is available [on NuGet](https://www.nuget.org/packages/Moq.Contrib.HttpClient/). Please see the [readme on GitHub for more detailed usage and examples](https://github.com/maxkagamine/Moq.Contrib.HttpClient).

### Behind the scenes: leveraging Moq's custom matchers

Moq has several different Setup methods for various cases which, along with Verify, all take an expression to match an invocation (in this case a request). To avoid duplication, the request helpers all defer to a single set of custom matchers.

This is feature mentioned briefly in the [Quickstart](https://github.com/Moq/moq4/wiki/Quickstart#advanced-features) under "Advanced Features": one can create reusable argument matchers using a method that calls `Match.Create()` with a predicate, which can then be used in place of `It.Is()`. [Documentation here](http://www.nudoq.org/#!/Packages/Moq/Moq/Match\(T\)) (disregard any reference to the `[Matcher]` attribute; this has since been deprecated and is no longer needed).

An example matcher used here is:

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

The request helpers can then simply mirror all of the custom matchers' method signatures and pass their parameters through to the matcher:

```csharp
public static ISetup<HttpMessageHandler, Task<HttpResponseMessage>> SetupRequest(
    this Mock<HttpMessageHandler> handler, HttpMethod method, Uri requestUri, Predicate<HttpRequestMessage> match)
    => handler.Setup(x => x.SendAsync(RequestMatcher.Is(method, requestUri, match), It.IsAny<CancellationToken>()));
```

All of these end up with a predictable form, so to avoid even this amount of duplication and possible discrepancies, the request helpers are generated using a [T4 template](https://docs.microsoft.com/en-us/visualstudio/modeling/code-generation-and-t4-text-templates). <!--[Scripty](https://github.com/daveaglick/Scripty/), which uses Roslyn CSX scripts for code generation as an alternative to the old-school [T4 templates](https://docs.microsoft.com/en-us/visualstudio/modeling/code-generation-and-t4-text-templates).-->

### What about IHttpClientFactory?

If you've been reading articles on HttpClient, you may already know to not wrap the client in a `using`, as this [can lead to the application eating up sockets](https://aspnetmonsters.com/2016/08/2016-08-27-httpclientwrong/). The standard advice is to reuse a single HttpClient, but this has the drawback of not responding to DNS changes. To alleviate this, ASP.NET Core introduces a new [IHttpClientFactory](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests) which, to quote the docs:

> - Provides a central location for naming and configuring logical `HttpClient` instances \[...]
> - Manages the pooling and lifetime of underlying `HttpClientMessageHandler` instances to avoid common DNS problems that occur when manually managing `HttpClient` lifetimes.
> - Adds a configurable logging experience (via `ILogger`) for all requests sent through clients created by the factory.

As a bonus, it also [makes more accessible](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests#outgoing-request-middleware) HttpClient's ability to plug in middleware, mentioned above &mdash; for example, using [Polly](https://github.com/App-vNext/Polly#polly) to automatically handle retries and failures.

Depending on the usage, your constructors may simply take an HttpClient injected via IHttpClientFactory. If the constructor takes the factory itself instead, this can be mocked the same way:

```csharp
var handler = new Mock<HttpMessageHandler>();
var factory = handler.CreateClientFactory();
```

The factory can then be passed into the class or [injected via AutoMocker](https://github.com/moq/Moq.AutoMocker), and code calling `factory.CreateClient()` will receive clients backed by the mock handler.

Named clients can be configured as well, overriding the default:

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

Thanks for reading this far. [Full examples & usage on GitHub](https://github.com/maxkagamine/Moq.Contrib.HttpClient); please let me know if you find this useful.

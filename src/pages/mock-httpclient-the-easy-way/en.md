---
title: Mocking HttpClient & IHttpClientFactory with Moq (the easy way)
date: 2018-12-01T13:17-0400
---

Mocking HttpClient directly is [notoriously difficult](https://github.com/dotnet/corefx/issues/1624). The solution has generally been to either create a wrapper of some form to mock instead (at the cost of cluttering the code) or use an HttpClient-specific testing library (which requires switching to a separate mocking system for HTTP calls and may not fit well alongside other mocks).

Here I'll show how we can use Moq with HttpClient as well. With the help of extension methods, mocking HTTP requests can be just as easy as mocking a service method.

<!-- end -->

## HttpClient with vanilla Moq

HttpClient itself is merely a set of helpers wrapping an HttpMessageHandler; all requests ultimately go through the handler's sole `SendAsync` method. Incidentally, this is a rather powerful yet little-known feature of HttpClient, as it allows for creating a DelegatingHandler that acts as middleware around the request pipeline ([this page explains](https://docs.microsoft.com/en-us/aspnet/web-api/overview/advanced/http-message-handlers), albeit in the context of classic ASP.NET).

Rather than mock HttpClient itself (whose methods are not virtual anyway), we would mock its handler. Unfortunately, not only does HttpMessageHandler [not implement an interface](https://source.dot.net/#System.Net.Http/System/Net/Http/HttpMessageHandler.cs), but the `SendAsync` method is protected:

```csharp
protected internal abstract Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken);
```

Luckily, Moq provides a way of [mocking protected methods](https://github.com/Moq/moq4/wiki/Quickstart#miscellaneous), and since it's abstract, the mock can implement it. In order to target this method in a setup the usual way, though -- with a lambda and IntelliSense as opposed to passing its name as a string -- we need to create a dummy interface that contains the same method, which we use like so:

```csharp
var handler = new Mock<HttpMessageHandler>();
var client = new HttpClient(handler, false);

handler.Protected().As<IHttpMessageHandler>() // Our dummy interface
    .Setup(x => x.SendAsync(
        It.IsAny<HttpRequestMessage>(), It.IsAny<CancellationToken>()));
```

[Under the hood](https://github.com/moq/moq4/blob/v4.10.0/src/Moq/Protected/ProtectedAsMock.cs#L184-L190), Moq uses reflection to retrieve the target method on the real class and then _rewrites the expression_ to call the otherwise-inaccessible method.

This is starting to turn into a lot of code already, though, and to make matters worse we've had to create an interface. If we had multiple test projects, each one would need a copy of that interface or a reference to a common project.

Matching specific requests and returning a response is even more cumbersome:

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

Needless to say this is not a very clean solution, and if this were our only option, we might look for a different library besides Moq to make dealing with HttpClient easier.

However, we have proven that Moq _is_ capable of mocking HttpClient, so all we need to do is write some extension methods to simplify it. Which, as you may have guessed, is precisely what I've done.

## The easy way

One of the awesome things about C# is being able to add functionality to existing classes & interfaces by way of [extension methods](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods). The above monstrosity can thus be rewritten as:

```csharp
var handler = new Mock<HttpMessageHandler>();
var client = handler.CreateClient();

handler.SetupRequest(HttpMethod.Get, $"{BaseUrl}/api/stuff")
    .ReturnsResponse("stuff");
```

[Moq.Contrib.HttpClient](https://github.com/maxkagamine/Moq.Contrib.HttpClient) introduces two sets of helpers:

- Request helpers: **SetupRequest**, **SetupRequestSequence**, and **VerifyRequest** (and corresponding "AnyRequest").
- Response helpers: **ReturnsResponse**, with various overloads to simplify sending a StringContent, ByteArrayContent, StreamContent, or just a status code.

The request helpers all have the same overloads, taking an optional method, URL (or Uri), and/or a predicate. The predicate is useful for matching requests by query params, headers, JSON body, and so on rather than by exact URL:

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

`SetupRequest()` also [works with `InSequence()`](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/test/Moq.Contrib.HttpClient.Test/SequenceExtensionsTests.cs) which sets up a chain of calls that must be made in order (although this usually isn't necesasry). The way this is implemented is a bit interesting: at time of writing, Moq doesn't actually support both `InSequence()` and `Protected()` together; it's made possible here by [rewriting the expression tree](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/src/Moq.Contrib.HttpClient/MockHttpMessageHandlerExtensions.cs#L96-L148) to call the protected method, similar to what ProtectedAsMock does internally.

Grab it [on NuGet](https://www.nuget.org/packages/Moq.Contrib.HttpClient/) and check out [the readme on GitHub](https://github.com/maxkagamine/Moq.Contrib.HttpClient) for more detailed usage. The unit tests in particular are worth looking at to get a feel for how it works in practice.

### Behind the scenes: leveraging Moq's custom matchers

Moq has several different Setup methods for various cases which, along with Verify, all take an [expression](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/expression-trees/) to match an invocation (in this case a request). To avoid duplication, the request helpers all defer to a single set of custom matchers.

Custom matchers are mentioned briefly in Moq's [Quickstart](https://github.com/Moq/moq4/wiki/Quickstart#advanced-features) under "Advanced Features": one can create reusable argument matchers using a method that calls `Match.Create()` with a predicate, which can then be used in place of `It.Is()`. [Documentation here](http://www.nudoq.org/#!/Packages/Moq/Moq/Match\(T\)) (disregard any reference to the `[Matcher]` attribute; this has since been deprecated and is no longer needed).

An example matcher used here is:

```csharp
public static HttpRequestMessage Is(HttpMethod method, Uri requestUri, Predicate<HttpRequestMessage> match)
{
    if (match == null)
        throw new ArgumentNullException(nameof(match));

    return Match.Create(
        r => r.Method == method && r.RequestUri == requestUri && match(r),
        () => Is(method, requestUri, match)); // The last param is just for failure messages
}
```

This custom `RequestMatcher.Is()` method can then be used just like `It.Is()` and will match if the `Match.Create(r => ...)` predicate returns true.

The request helpers can then simply mirror all of the custom matchers' method signatures and pass their parameters through to the matcher:

```csharp
public static ISetup<HttpMessageHandler, Task<HttpResponseMessage>> SetupRequest(
    this Mock<HttpMessageHandler> handler, HttpMethod method, Uri requestUri, Predicate<HttpRequestMessage> match)
    => handler.Setup(x => x.SendAsync(RequestMatcher.Is(method, requestUri, match), It.IsAny<CancellationToken>()));
```

All of these end up with a predictable form, so to avoid duplication and possible discrepancies, the request helpers are generated using a [T4 template](https://docs.microsoft.com/en-us/visualstudio/modeling/code-generation-and-t4-text-templates) which you can see [here](https://github.com/maxkagamine/Moq.Contrib.HttpClient/blob/master/src/Moq.Contrib.HttpClient/RequestExtensions.tt). (2020 update: If you're looking to do something like this in your own project, check out [source generators](https://devblogs.microsoft.com/dotnet/introducing-c-source-generators/) instead!)

## What about IHttpClientFactory?

It's common to see HttpClient wrapped in a `using` since it's IDisposable, but this is, rather counterintuitively, incorrect and [can lead to the application eating up sockets](https://aspnetmonsters.com/2016/08/2016-08-27-httpclientwrong/). The standard advice is to reuse a single HttpClient, yet this has the drawback of not responding to DNS changes.

To alleviate this, ASP.NET Core introduces an [IHttpClientFactory](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests) which, to quote the docs:

> - Provides a central location for naming and configuring logical `HttpClient` instances \[...]
> - Manages the pooling and lifetime of underlying `HttpClientMessageHandler` instances to avoid common DNS problems that occur when manually managing `HttpClient` lifetimes.
> - Adds a configurable logging experience (via `ILogger`) for all requests sent through clients created by the factory.

As a bonus, it also makes HttpClient's [ability to plug in middleware](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests#outgoing-request-middleware), mentioned above, more accessible -- for example, using [Polly](https://github.com/App-vNext/Polly#polly) to automatically handle retries and failures.

Depending on the usage, your constructors may simply take an HttpClient injected via IHttpClientFactory, in which case the tests don't need to do anything different. If the constructor takes the factory itself instead, this can be mocked the same way:

```csharp
var handler = new Mock<HttpMessageHandler>();
var factory = handler.CreateClientFactory();
```

The factory can then be passed into the class or [injected via AutoMocker](https://github.com/moq/Moq.AutoMocker), and code calling `factory.CreateClient()` will receive clients backed by the mock handler.

The `CreateClientFactory()` extension method returns a mock that's already set up to return a default client. If you're using [named clients](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/http-requests?view=aspnetcore-3.1#named-clients), a setup can be added like so:

```csharp
Mock.Get(factory).Setup(x => x.CreateClient("api"))
    .Returns(() =>
    {
        var client = handler.CreateClient();
        client.BaseAddress = ApiBaseUrl;
        return client;
    });
```

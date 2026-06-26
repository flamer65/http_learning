# ⚡ Lesson 18: HTTP Caching Implementation

In Lesson 12, we learned the theory behind HTTP caching. Now, we'll write Express middleware to put it into action!

## 🧠 Setting Cache-Control Headers

The `Cache-Control` header is the boss of caching. 

- `public`: Anyone can cache this (CDN, proxies, browsers).
- `private`: Only the user's browser can cache this (user-specific data).
- `no-cache`: Must check with the server before using the cached copy.
- `no-store`: Absolutely NO caching allowed (highly sensitive data).
- `max-age=X`: Cache is fresh for X seconds.
- `s-maxage=X`: Shared cache (CDN) is fresh for X seconds.
- `stale-while-revalidate=X`: Serve stale content while fetching fresh content in the background.

## 🤝 Conditional Requests & ETags

Instead of resending a huge JSON payload, the server can say *"Hey, your version is still up to date!"*

1. **ETag (Entity Tag)**: A hash of the content (e.g., `"12345"`).
2. **Client**: Sends `If-None-Match: "12345"`.
3. **Server**: Checks if the content hash is still `"12345"`.
4. If yes, server responds with `304 Not Modified` and an EMPTY body! 🚀

## 🕒 Last-Modified

Similar to ETags, but uses timestamps:
1. **Server**: Sends `Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT`
2. **Client**: Sends `If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT`
3. **Server**: Checks if it was modified since then. If not -> `304 Not Modified`.

## 🎭 The Vary Header

If your server sends different responses for the same URL based on a header (like `Accept-Encoding: gzip`), you MUST include `Vary: Accept-Encoding`. This tells the cache to keep separate copies!

## 🧪 Your Task
Implement the caching middleware in `exercises/src/middleware/cache.ts` and apply it to the routes to make the tests pass!

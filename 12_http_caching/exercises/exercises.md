# 🏋️ Chapter 12 Exercises: HTTP Caching

Test your understanding of HTTP caching — from header basics to real-world system design decisions.

---

## Exercise 1: Cache-Control Decoder Ring 🔍

**Difficulty: ⭐ Beginner**

For each `Cache-Control` value below, explain in plain English what it means. Who can cache it? For how long? What happens when it expires?

**a)** `Cache-Control: public, max-age=86400`

```
Your answer: Can be Cached by CDN, proxy, browsers is cached for 86400 seconds


```

**b)** `Cache-Control: private, no-cache`

```
Your answer: Can only be Cached by the Browsers Only and Cache it but revalidate on calls


```

**c)** `Cache-Control: no-store`

```
Your answer: do store this not to be stored not by the public or private, sensitive


```

**d)** `Cache-Control: public, max-age=31536000, immutable`

```
Your answer: Can be cached by the CDN, proxy and Browsers, with max life of 365 days (year) and not to reivalidated, the version Url


```

**e)** `Cache-Control: max-age=300, s-maxage=3600, stale-while-revalidate=60`

```
Your answer:  the browser should check the again after 300 sec and the CDN should hold it till 3600 sec and check again, should use the old version after expire but in background should check for the new one if its changed or not and should update or download resource change


```

**f)** `Cache-Control: private, max-age=0, must-revalidate`

```
Your answer: only browsers, must revalidate the request should be sent and again and again


```

---

## Exercise 2: Pick the Right Strategy 🎯

**Difficulty: ⭐⭐ Intermediate**

For each resource below, write the ideal `Cache-Control` header value and explain your reasoning. Consider: Who sees this? How often does it change? What happens if it's stale?

**a)** A user's profile page (`/dashboard`) that shows their name, email, and recent activity.

```
Cache-Control: private, no-cache
Reasoning: not to be shared public, if this is public CDN or proxy will show this to the user B the data of User A and should be cached again after


```

**b)** A versioned JavaScript bundle: `app.8f3a2b1c.js`

```
Cache-Control: public, max-age=31536000, immutable
Reasoning: the URl-encoding versioned URL the file type has hash done by vite, webkit save the URl and when anything changes directed to the new url and the old one is still saved


```

**c)** A public REST API endpoint that returns the current weather for a city: `GET /api/weather?city=london`

```
Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=60
Reasoning:


```

**d)** A bank's account balance API: `GET /api/account/balance`

```
Cache-Control: no-store
Reasoning: senstive data should not be cached by any CDN server and the, if cached with browser it will show old balance, after transactions


```

**e)** A company's logo image (`/images/logo.png`) that changes maybe once a year but keeps the same filename.

```
Cache-Control: public, max-age=86400
Reasoning: public as this can be stored in the proxy or the CDN for 1 day, can be updated after year, checking after 1 day can have change


```

**f)** A real-time stock price ticker: `GET /api/stocks/AAPL/price`

```
Cache-Control: no-store
Reasoning: real time price tracking as cannot wait for seconds on the stock price


```

---

## Exercise 3: Conditional Request Hands-On 🔬

**Difficulty: ⭐⭐ Intermediate**

Use `curl` to practice conditional requests with ETags. Run each command and record the HTTP status code you receive.

### Part A: ETag Matching

```bash
# Step 1: Get the ETag for this resource
curl -sI https://httpbin.org/etag/exercise-test | grep -i etag
```

**ETag value received:**

```
Your answer: exercise-test

```

```bash
# Step 2: Send a conditional request WITH the correct ETag
curl -s -o /dev/null -w "%{http_code}" \
  -H 'If-None-Match: "exercise-test"' \
  https://httpbin.org/etag/exercise-test
```

**Status code received:**

```
Your answer: 304

```

**Why did you get this status code?**

```
Your answer: as the content version has not change. the Etag is the version when anything for the given resource changes the Etag fingerprint changes

```

```bash
# Step 3: Send a conditional request with a WRONG ETag
curl -s -o /dev/null -w "%{http_code}" \
  -H 'If-None-Match: "totally-wrong-etag"' \
  https://httpbin.org/etag/exercise-test
```

**Status code received:**

```
Your answer:200

```

**Why is it different from Step 2?**

```
Your answer: as the original Etag is different the serve as based on the etag sees the difference and sends the data

```

### Part B: Inspect Real-World Cache Headers

Run these commands and record the caching strategy each site uses:

```bash
# GitHub API
curl -sI https://api.github.com | grep -i 'cache-control\|etag\|vary'
```

**GitHub's caching strategy:**

```
Your answer: cache-control: public, max-age=60, s-maxage=60  | vary: Accept,Accept-Encoding, Accept, X-Requested-With


```

```bash
# A CDN-hosted library
curl -sI https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js | grep -i 'cache-control\|etag\|vary'
```

**jsDelivr's caching strategy:**

```
Your answer:  cache-control: public, max-age=31536000, s-maxage=31536000, immutable
etag: W/"11d37-roVLBAJduLf0j91t7fQed+rkQ5Q"
vary: Accept-Encoding

```

**Which site caches more aggressively? Why does that make sense?**

```
Your answer: So the jsDelivr caches more agresslivy as the time period is a year and immutable meaning not to be changed and the no revalidate


```

---

## Exercise 4: Spot the Caching Bug 🐛

**Difficulty: ⭐⭐⭐ Advanced**

Each scenario below has a caching misconfiguration. Identify the problem, explain what would go wrong, and provide the corrected `Cache-Control` header.

**Scenario A:**
A shopping site returns the user's cart with:

```
Cache-Control: public, max-age=3600
```

**What's the bug?**

```
Your answer: private, maxage

```

**What could go wrong?**

```
Your answer: user A cart can be viewd by the user B and user can add new thing one after other it will only show old data

```

**Corrected header:**

```
Your answer: no-store

```

---

**Scenario B:**
A developer wants to prevent caching of a login page and uses:

```
Cache-Control: no-cache
```

**What's the bug?**

```
Your answer: public, no-cache

```

**What would actually happen?**

```
Your answer:not prvoided the private and can be stored by the proxy and cdn and were as no-cache caches it but ask for the revalidate

```

**Corrected header:**

```
Your answer: no-store

```

---

**Scenario C:**
A site serves compressed (gzip) responses but doesn't include a `Vary` header. The CDN is caching responses.

**What's the bug?**

```
Your answer: no Vary

```

**What could go wrong?**

```
Your answer: will only cache the gzip version and provide this for the different encodings

```

**What header should be added?**

```
Your answer: Vary: accept-encoding

```

---

**Scenario D:**
A site uses this for their main CSS file (`styles.css`):

```
Cache-Control: public, max-age=31536000, immutable
```

When they update the CSS, they deploy the new file with the same filename `styles.css`.

**What's the bug?**

```
Your answer: same file name

```

**How should they fix their deployment?**

```
Your answer: the file name should have hash value like styles.abc456#.css after every new build so every time HTml is revalidated should have new style sheet pointing

```

---

**Scenario E:**
An API returns user-specific recommendations with:

```
Cache-Control: public, max-age=300
Vary: Cookie
```

**What's the problem?**

```
Your answer: public  and vary: Cookie

```

**What's a better approach?**

```
Your answer: should not be private as user specific and Cookie not cachable
Cache-Control: private, max-age=300
```

---

## Exercise 5: Cache Invalidation Thought Experiment 🧠

**Difficulty: ⭐⭐⭐ Advanced**

You're building an e-commerce product page. The page shows:

- Product name and description (changes rarely)
- Product price (can change several times a day)
- Product reviews (user-generated, added unpredictably)
- "In stock" status (changes in real-time as people buy)

Your architecture:

```
Users → CDN (Cloudflare) → App Server → PostgreSQL Database
                                      → Redis Cache
```

**Question A:** What caching strategy would you use for each piece of data? Fill in the table:

| Data                     | Cache-Control Header                         | Redis TTL | CDN Cache? | Reasoning                                                              |
| ------------------------ | -------------------------------------------- | --------- | ---------- | ---------------------------------------------------------------------- |
| Product name/description | public max-age=month                         | month     | yes        | public and store more time and check after exp or purged changes       |
| Product price            | public,max-age=60                            | 300sec    | yes        | stores it for 1 min and the redis for 5min and cdn purged price change |
| Product reviews          | public,max-age=300,stale-while-revalidate=60 | 300s      | yes        | Cdn stores and purge when changed                                      |
| Stock status             | no-store.                                    | no        | no         | live stream no need for the caching                                    |

**Question B:** A product's price changes from $99 to $79 (flash sale). Describe step-by-step how each cache layer would handle this:

```
Step 1 (Database): update the price

Step 2 (Redis): update with new TTl of 300sec and old entry is deleted

Step 3 (CDN): the CDN time will be purge to update the price and save again for 60 sec if the previuos 60 sec are over or not

Step 4 (Browser): will update after the 60 sec

How long until ALL users see $79? atleast 60 sec

```

**Question C:** What's the trade-off between short TTLs (fresher data) and long TTLs (better performance)? How would you decide the right TTL for the product price?

```
Your answer: based on the that the price change is frequent so keeping the it shorter is better and the owner whant to have sale at particular time the redis update can be usefull

So when there is sale we can use the redis del + cdn purge to update faster and where as when stable give the redis 1 hour TTL

```

**Question D:** Someone suggests using WebSockets to push price updates to all connected users in real-time, bypassing the cache entirely for price. What are the pros and cons?

```
Pros: immedeate update


Cons: case 1: Persistent Contection through (100,000) Websocket is expensive maintianing regualr HTTp connections, get data, disconnect
case 2: user losses wifi (internet) connection, the message need to be queued when ever the user is connected able to dliever the message, also have HTTP polling.
case 3: DOESN'T HELP NEW VISITORS
  A user who just opened the page still loads it via HTTP.
  You need both WebSockets (for live updates) AND caching
  (for initial page load). One doesn't replace the other.

Your recommendation: A fallback system for the HTTP polling, were as queueing of the messages when any user not having internet after connection get the price

```

---

## Exercise 6: System Design — CDN Caching Architecture 🏗️

**Difficulty: ⭐⭐⭐⭐ Expert**

You're designing the caching architecture for a news website that gets 50 million page views per day. The site has:

- A homepage that updates every few minutes with new stories
- Individual article pages (content rarely changes after publication, but comment counts update)
- Static assets (images, CSS, JS)
- A personalized "recommended articles" sidebar
- An API that returns trending topics (updated every 5 minutes)

**Part A: Draw or describe the caching architecture.** What caches at each layer?

```
public, max-age= 60 for every edge server and user
 stale-while-revalidate=60 every edge server and user makes request to the main server behind the scenes and showing stale 60 sec
Your architecture:
                    ┌──── Edge Server (Tokyo)
                    │     [Cached Copy]
                    │
User (Japan) ──────-┤
homepage            │
                    ├──── Edge Server (Thailand)
                    │     [Cached Copy]
                    │
                    ├──── Edge Server (London)
                    │     [Cached Copy]
                    │
                    └──── Origin Server (Inida)
                          [Source of Truth]
```

```

**Part B:** Fill in the caching strategy for each resource:

| Resource             | Cache-Control       | Vary?                          | Cache Busting?| Notes |
|----------------------|---------------------|--------------------------------|---------------|-----------------------------------------|
| Homepage HTML        |public,max-age=60    | Accept-Encoding,Accept-Language| NO            | after 60 sec fetch from source of truth |
| Article HTML         |public,s-w-r=60s,ETag| Accept-Encoding,Accept-Language| no, TTl       | hompage updates -> new article update
| CSS/JS bundles       |public,immutable,max-age=(year)| Accept-Encoding      | yes           | homapage updates -> new version update  |
| Personalized sidebar |private,s-w-r=60s.   | _                              | no            | article change -> sidebar change.       |
| Trending topics API  |public,max-age=300   |Accept-Encoding,Accept-Language | no.           | as after 5min the API updates           |

**Part C:** Your homepage gets 10,000 requests per second. Without CDN caching, your origin servers would need to handle all 10,000 rps. If you cache the homepage for 30 seconds on the CDN:

1. How many requests per second hit your origin server? (Assume 50 CDN edge servers, each caches independently)

```

Your calculation:
require Edge CDN / number of seconds each CDN = 50 / 30 = 1.67 rps

```

2. What's the worst-case staleness a user could experience?

```

Your answer: when the Origin updated the homepage and the CDN's updated the before that this will be about the 30 sec the user will have stale load

```

3. How would you handle "breaking news" that needs to appear immediately?

```

Your answer:
Option 1: CDN Cache Purge (best)
When editor publishes "Breaking News", your CMS
automatically calls Cloudflare's API:
POST https://api.cloudflare.com/purge
→ All 50 edge servers delete their cached homepage
→ Next visitor triggers a fresh fetch from origin
→ Breaking news visible within seconds

Option 2: Surrogate/Cache Tags
Tag every homepage response with: Cache-Tag: homepage
On breaking news: purge all responses tagged "homepage"
→ Same effect as purge, but works across thousands of URLs at once

Option 3: Reduce homepage TTL during "alert mode"
Normally: max-age=30
When breaking news detected: max-age=5 (dynamically lowered)
→ Staleness reduced to 5s max automatically

```

**Part D:** A junior developer deploys a CSS change but forgets to update the content hash. Users are complaining the site looks broken. What happened, and how do you fix it immediately?

```

What happened: the developer changed the css and didn't update the hash the CDN serves the old css for the new HTML so it appears broken

Immediate fix: new for the new css file

Long-term prevention:
Build tool auto-generates hashes (Layer 1)
CI/CD verifies hashes before deploy (Layer 2)
Team policy: no manual deploys (Layer 3)

```

---

## 🏆 Bonus Challenge

Open your browser's Developer Tools (Network tab) and visit 3 different websites. For each one:

1. Find a resource with a long `max-age`
2. Find a resource with `no-cache` or `no-store`
3. Find a resource with an `ETag`
4. Check if any resources return `304 Not Modified` on reload

Record your findings:

```

Website 1: GitHub.com (homepage)
Long cache: NONE — cache-control: max-age=0, private, must-revalidate
GitHub's homepage is user-specific (your repos, notifications)
→ no CDN caching, always revalidate
No-cache/no-store: max-age=0 + must-revalidate = effectively "always ask server"
ETag: W/"07bc4cd29ccb35cd919fd270679b0515" ← YES
304 on reload?: YES — sends If-None-Match with ETag on every visit

Website 2: jsDelivr CDN (react.production.min.js)
Long cache: public, max-age=31536000, immutable = 1 YEAR ← aggressive!
age: 6511819s = this copy has been cached for ~75 days!
No-cache/no-store: NONE — it trusts the hash completely
ETag: W/"29f1-mAiaM9DPL6Sz4bqbfuubi6Csgqc"
304 on reload?: NO — "immutable" tells browser: never even ask

Website 3: BBC News (bbc.com)
Long cache: max-age=30 — only 30 seconds! News changes constantly
Strategy: public, stale-while-revalidate=30, stale-if-error=90
"Serve stale while refreshing in background"
ETag: "fk2gzif1h5apzp" ← YES
CDN: belfrage-cache-status: HIT (BBC's own CDN called Belfrage)
via: Fastly → GTM → Belfrage → Varnish — 4 cache layers!
304 on reload?: YES — ETag means efficient revalidation

```

---

*Great work! Caching is one of those topics where understanding the theory directly impacts real-world performance. Every website you build from now on will benefit from what you've learned here. 🚀*
```

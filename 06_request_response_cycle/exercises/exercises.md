# Exercises — Request & Response Cycle

## Exercise 1: Trace the Full Cycle

Run this command and break down what you see:

```bash
curl -v https://httpbin.org/get 2>&1
```

Identify and write down each phase:

### DNS Resolution
```
IP Address resolved to:  Connected to httpbin.org (44.216.249.42) port 443
```

### TCP Handshake
```
Did you see "Connected to..."? What IP and port? Connected to httpbin.org (44.216.249.42) port 443
```

```

### TLS Handshake
```
TLS version: TLSv1.2
Certificate subject: CN=httpbin.org
```

### HTTP Request Sent
```
Method: [:method: GET]
Path: [:path: /get]
HTTP Version: using HTTP/2
Headers sent (list 3):
  1.  > Accept: */*
  2. > Host: httpbin.org
  3. > User-Agent: curl/8.7.1
```

### HTTP Response Received
```
Status Code: HTTP/2 200 
Content-Type:  application/json
Headers received (list 3):
  1. 
  2. 
  3. 
date: Tue, 26 May 2026 10:11:18 GMT
< content-type: application/json
< content-length: 256
< server: gunicorn/19.9.0
< access-control-allow-origin: *
< access-control-allow-credentials: true
```

---

## Exercise 2: Timing Breakdown


curl -w "\n--- Timing ---\nDNS Lookup:    %{time_namelookup}s\nTCP Connect:   %{time_connect}s\nTLS Handshake: %{time_appconnect}s\nFirst Byte:    %{time_starttransfer}s\nTotal Time:    %{time_total}s\nDownload Size: %{size_download} bytes\n" \ -o /dev/null -s https://www.google.com


Record the timing:
DNS Lookup:    0.092953s
TCP Connect:   0.119911s
TLS Handshake: 0.157686s
First Byte:    0.583168s
Total Time:    0.667997s
Download Size: 82931 bytes
```
DNS Lookup:    ___s
TCP Connect:   ___s
TLS Handshake: ___s
First Byte:    ___s
Total Time:    ___s
Download Size: ___ bytes
```

**Questions:**
- Which phase took the longest? → First byte
- Why might DNS be slow sometimes? → DNS chain lookup
- What is "Time to First Byte" (TTFB)? → browser is waiting for the first byte of a response

Now try with a different site:
```bash
curl -w "\nDNS: %{time_namelookup}s | TCP: %{time_connect}s | TLS: %{time_appconnect}s | Total: %{time_total}s\n" \ -o /dev/null -s https://httpbin.org/get
```

Compare the timings:
```
Google:  DNS: ___s | TCP: ___s | TLS: ___s | Total: ___s
DNS: 0.004526s | TCP: 0.052106s | TLS: 0.087490s | Total: 0.759208s
httpbin: DNS: ___s | TCP: ___s | TLS: ___s | Total: ___s
DNS: 0.033469s | TCP: 0.352949s | TLS: 1.016830s | Total: 3.219928s

Which was faster? Why?
google was faster  the reason might be the Tls
```

---

## Exercise 3: Multiple Requests for One Page

Open Chrome DevTools → Network tab → visit `https://httpbin.org`

**Tasks:**
- [ ] How many HTTP requests were made for this one page? 12
- [ ] List the types of resources loaded (HTML, CSS, JS, images, fonts): html, stylesheet,svg+xml, 
- [ ] Which request took the longest? 1.72s for the  https://httpbin.org/spec.json
- [ ] What was the total data transferred?c137kb transfered

```
Total requests: 12
Resource types: html, stylesheet,svg+xml,
Longest request: 1.72s
Total data:  137kb transfered
```

---

## Exercise 4: Draw the Cycle

In your own words, draw or write out the complete HTTP request-response cycle for this URL: `https://api.github.com/users/torvalds`

```
Step 1 (DNS): 36.81ms lookup

Step 2 (TCP): 164.86ms for the initial connection

Step 3 (TLS): 94.34ms for the ssl 

Step 4 (Request): sent 0.44ms

Step 5 (Server): 331.31ms

Step 6 (Response): 1.96ms for content download

```

Now verify with curl:
```bash
curl -v https://api.github.com/users/torvalds 2>&1 | head -30
```

---

## Exercise 5: Keep-Alive vs New Connection

```bash
# Make 3 requests reusing the connection (HTTP/1.1 default)
curl -v https://httpbin.org/get https://httpbin.org/headers https://httpbin.org/ip 2>&1 | grep -i "connected\|re-using"
```

**Questions:**
- Did curl reuse the connection? → yes 
- How can you tell? → 
* Connected to httpbin.org (54.235.97.46) port 443
* Re-using existing connection with host httpbin.org
* Re-using existing connection with host httpbin.org

---

## Exercise 6: HTTP vs HTTPS Timing

Compare the time it takes with and without TLS:

```bash
# HTTP (no TLS)
curl -w "Total: %{time_total}s\n" -o /dev/null -s http://httpbin.org/get
Total: 0.001318s
# HTTPS (with TLS)
curl -w "Total: %{time_total}s\n" -o /dev/null -s https://httpbin.org/get
Total: 0.270860s
```

```
HTTP time:  ___s  Total: 0.001318s
HTTPS time: ___s. Total: 0.270860s
Difference: ___s. 0.269542

Why is HTTPS slower?
due to the tls configration
```

---

✅ **Done with exercises?** Mark `06 — Request & Response Cycle` as complete in the main [README.md](../README.md)!

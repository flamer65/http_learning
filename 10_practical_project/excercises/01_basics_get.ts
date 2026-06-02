import type { get } from "node:http";
import https from "node:https";

const url = "https://httpbin.org/get";

// https.get(url, (res) =>{
//     let data = "";
//     res.on("data", (chunk) =>{
//         data += chunk
//     })

//     res.on("end", () =>{
//         console.log("status Code:", res.statusCode)
//         console.log("Headers:", res.headers)

//         const parseData = JSON.parse(data);
//         console.log("Response Body:", parseData)
//     })
// }).on("error", (err) =>{
//     console.log("Error making request:", err.message)
// })
// const options = {
//     hostname: 'httpbin.org',
//     path: "/headers",
//     method: 'GET',
//     headers: {
//         'Accept': 'application/json'
//     }
// }
// const req = https.request(options, (res) =>{
//    let data = "";
//    res.on("data", (chunk) =>{
//     data += chunk
//    })

//    res.on("end", () =>{
//     console.log("Status Code:", res.statusCode);
//     console.log("Headers:", res.headers)
//     const parseData = JSON.parse(data);
//     console.log("Response Body:", parseData)
//    })
// }).on("error", (err) =>{
//     console.log("Error making requests: ", err.message)
// })

// req.end()

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function httpResponse(
    method: HttpMethod,
    url: string,
    headers?: Record<string, string>,
    body: any = null,
) {
    return new Promise<{ statusCode?: number; headers: any; body: any }>(
        (resolve, reject) => {
            const parsedUrl = new URL(url);
            const options = {
                hostname: parsedUrl.hostname,
                path: parsedUrl.pathname + parsedUrl.search,
                method: method, // <-- We just pass the string 'POST' or 'GET' right here!
                headers: headers,
            };
            const req = https.request(options, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                    data += chunk;
                });
                res.on("end", () => {
                    try {
                        // If data is not empty, try to parse it as JSON
                        if (data) {
                            data = JSON.parse(data);
                        }
                    } catch (err) {
                        // If it fails (because it's HTML or plain text), we do nothing!
                        // parsedBody will just remain the raw string.
                    }
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: data,
                    });
                });
            });

            req.on("error", (err) => {
                reject(err);
            });
            req.end();
        },
    );
}

await httpResponse("GET", "https://httpbin.org/get");
await httpResponse("POST", "https://httpbin.org/post", {}, { name: "Naman" });
await httpResponse(
    "PUT",
    "https://httpbin.org/put",
    {},
    { name: "Naman", updated: true },
);
await httpResponse("DELETE", "https://httpbin.org/delete");

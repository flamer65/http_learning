import https from "node:https";
import { httpResponse } from "./01_basics_get";
type HttpMethod =  'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const method = process.argv[2] as HttpMethod;
const url = process.argv[3] as string;
const bodyStr = process.argv[4];

const body = bodyStr ? JSON.parse(bodyStr) : null;
const header = {}
const start = performance.now()
const { statusCode, headers, body: responseBody } = await httpResponse(method, url, header, body)
const end = performance.now()
console.log(`Time taken: ${(end - start).toFixed(2)}ms`)

if (statusCode! >= 200 && statusCode! < 300) {
    console.log(`\x1b[32mStatus: ${statusCode}\x1b[0m`); // Prints green!
} else if (statusCode! >= 400 && statusCode! < 500) {
    console.log(`\x1b[33mStatus: ${statusCode}\x1b[0m`); // Prints yellow!
} else if (statusCode! >= 500) {
    console.log(`\x1b[31mStatus: ${statusCode}\x1b[0m`); // Prints red!
}else if (statusCode! >= 300 && statusCode! < 400) {
    const newUrl = headers.location;
    console.log(`Redirecting to ${newUrl}...`);
    // Run the function again with the new URL!
   const res = await  httpResponse(method, newUrl, header, body);
   console.log("Headers:", res.headers);
   console.log("Body:", res.body);
}
console.log("Headers:", headers);
console.log("Body:", responseBody);




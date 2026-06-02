
endpoints=("200" "201" "204" "301" "400" "401" "403" "404" "500")

for code in "${endpoints[@]}"; do
    result=$(curl -s -o /dev/null -w "%{http_code}" "https://httpbin.org/status/$code")
    echo "Expected: $code | Got: $result"
done
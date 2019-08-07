# REQUEST-LOOP

```Options based on request-promise-native, request-promise, request```
Auto retry request (default up to 10 times) when error

```npm install 0x0a0d/request-loop```

```js
const Request = require('request-loop');
const request = Request.defaults({
    headers: {
        key: 'Should show with key'
    }
});

request.get('https://wtfismyip.com/headers', {
    headers: {
        'key-trap': 'Should show with key-trap'
    }
}).then(body=>console.log(body)).catch(console.error);
```

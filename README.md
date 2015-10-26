# lfActivityStream
Livefyre Activity Stream api

### Usage

``` javascript

const lfActivityStream = require('lfActivityStream');

let client = new lfActivityStream(network, key);
let lastEventId = 1234;

client
	.makeRequest(lastEventId)
	.then((response) => {
		console.log(response.body);
	}, (error) => {
		console.log(error.body);
	});
	
```


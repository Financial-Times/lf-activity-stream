# lfActivityStream
Livefyre Activity Stream API

### Usage

``` javascript

const lfActivityStream = require('lfActivityStream');

let client = new lfActivityStream(network, key);
let eventId = 1234;

client
	.setOptions({
		interval: 15
	})
	.makeRequest(eventId, (error, data, lastEventId) => {
		console.log('[lastEventId]\n' + lastEventId);
		console.log('[data]\n', data);
	});
	
```


import util from 'util';
import jwt from 'jwt-simple';
import request from 'request';
import livefyre from 'livefyre';
import config from './config';

class lfActivityStreamClient {
	constructor(lfNetwork, lfNetworkSecret) {

		if (!lfNetwork) {
			throw new Error('No network provided!');
		}
		if (!lfNetworkSecret) {
			throw new Error('No network secret provided!');
		}

		this.config = config;
		this.authToken = null;
		this.lfNetwork = lfNetwork;
		this.lfNetworkSecret = lfNetworkSecret;
		this.network = livefyre.getNetwork(this.lfNetwork, this.lfNetworkSecret);
		this.networkUrn = this.network.getUrn();
	}
	url() {
		return [
			this.config.protocol,
			util.format(this.config.endpoint, this.network.getNetworkName())
		].join('');
	}
	token(expires) {

		if (this.authToken) {
			return this.authToken;
		}

		if (!expires || new Date().getTime() >= expires) {
			expires = new Date(new Date().getTime() + 60 * 60 * 1000).getTime();
		}

		let authData = {
			iss: this.networkUrn,
			aud: this.networkUrn,
			sub: this.networkUrn,
			scope: this.config.authScope,
			exp: expires
		};

		this.authToken = jwt.encode(authData, this.lfNetworkSecret);
		return this.authToken;
	}
	requestOptions(eventId) {
		return {
			url: this.url(),
			qs: {resource: this.networkUrn, since: eventId},
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + this.token()
			}
		};
	}
	makeRequest(eventId, cb) {
		if ( cb && typeof cb == 'function') {
			return request(this.requestOptions(eventId), (error, response, body) => {
				if (error || response.statusCode !== 200) {
					return cb(error || body, response);
				}
				return cb(null, response, body);
			});
		}
		return new Promise((resolve, reject) => {
			request(this.requestOptions(eventId), (error, response, body) => {
				if (error || response.statusCode !== 200) {
					return reject({body: error || body, response});
				}
				return resolve({response, body});
			});
		});
	}
}

export default lfActivityStreamClient;

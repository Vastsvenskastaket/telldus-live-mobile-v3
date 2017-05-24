/**
 * Copyright 2016-present Telldus Technologies AB.
 *
 * This file is part of the Telldus Live! app.
 *
 * Telldus Live! app is free : you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Telldus Live! app is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Telldus Live! app.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @providesModule Actions/Websockets
 */

'use strict';

import { v4 } from 'react-native-uuid';
import TelldusWebsocket from '../Lib/Socket';

import { processWebsocketMessageForSensor } from 'Actions/Sensors';
import { processWebsocketMessageForDevice } from 'Actions/Devices';

import formatTime from '../Lib/formatTime';

import LiveApi from 'LiveApi';

// TODO: expose websocket lib via Provider component, so that it is bound and so that we have access to store

// TODO: move connection lookup to redux state
const websocketConnections = {};

// TODO: move sessionId to redux state
const sessionId = v4();
export const authenticateSession = () => (dispatch, getState) => {
	const payload = {
		url: `/user/authenticateSession?session=${sessionId}`,
		requestParams: {
			method: 'GET',
		},
	};
	return LiveApi(payload).then(response => dispatch({
		type: 'RECEIVED_AUTHENTICATE_SESSION_RESPONSE',
		payload: {
			...payload,
			...response,
		},
	}
	));
};

export const setupGatewayConnection = (gatewayId, websocketUrl) => dispatch => {
	const websocket = new TelldusWebsocket(gatewayId, websocketUrl);
	websocketConnections[gatewayId] = {
		url: websocketUrl,
		websocket: websocket,
	};

	websocket.onopen = () => {
		const formattedTime = formatTime(new Date());
		const message = `websocket_opened @ ${formattedTime} (gateway ${gatewayId})`;
		try {
			console.groupCollapsed(message);
			console.groupEnd();
		} catch (e) {
			console.log(message);
		}
		authoriseWebsocket(gatewayId);

		addWebsocketFilter(gatewayId, 'device', 'added');
		addWebsocketFilter(gatewayId, 'device', 'removed');
		addWebsocketFilter(gatewayId, 'device', 'failSetState');
		addWebsocketFilter(gatewayId, 'device', 'setState');

		addWebsocketFilter(gatewayId, 'sensor', 'added');
		addWebsocketFilter(gatewayId, 'sensor', 'removed');
		addWebsocketFilter(gatewayId, 'sensor', 'setName');
		addWebsocketFilter(gatewayId, 'sensor', 'setPower');
		addWebsocketFilter(gatewayId, 'sensor', 'value');

		addWebsocketFilter(gatewayId, 'zwave', 'removeNodeFromNetwork');
		addWebsocketFilter(gatewayId, 'zwave', 'removeNodeFromNetworkStartTimeout');
		addWebsocketFilter(gatewayId, 'zwave', 'addNodeToNetwork');
		addWebsocketFilter(gatewayId, 'zwave', 'addNodeToNetworkStartTimeout');
		addWebsocketFilter(gatewayId, 'zwave', 'interviewDone');
		addWebsocketFilter(gatewayId, 'zwave', 'nodeInfo');

		dispatch({
			type: 'GATEWAY_WEBSOCKET_OPEN',
			gatewayId,
		});
	};

	websocket.onmessage = (msg) => {
		const formattedTime = formatTime(new Date());
		const title_prefix = `websocket_message @ ${formattedTime} (from gateway ${gatewayId})`;
		let title = '';
		let message = '';
		try {
			message = JSON.parse(msg.data);
		} catch (e) {
			message = msg.data;
			title = ` ${msg.data}`;
		}

		if (message === 'validconnection') {
			message = {
				module: 'websocket_connection',
				action: 'connected',
			};
			title = ` ${message.module}:${message.action}`;
		} else if (message === 'nothere') {
			message = {
				module: 'websocket_connection',
				action: 'wrong_server',
			};
			title = ` ${message.module}:${message.action}`;
		} else if (message === 'error') {
			message = {
				module: 'websocket_connection',
				action: 'unknown_error',
			};
			title = ` ${message.module}:${message.action}`;
		}

		if (message.module && message.action) {
			title = ` ${message.module}:${message.action}`;

			switch (message.module) {
				case 'device':
					dispatch(processWebsocketMessageForDevice(message.action, message.data));
					break;
				case 'sensor':
					dispatch(processWebsocketMessageForSensor(message.action, message.data));
					break;
				case 'zwave':

					break;
				default:
			}
		}
		try {
			console.groupCollapsed(title_prefix + title);
			console.log(message);
			console.groupEnd();
		} catch (e) {
			console.log(message);
		}
	};

	websocket.onerror = (e) => {
		const formattedTime = formatTime(new Date());
		const message = `websocket_error @ ${formattedTime} (gateway ${gatewayId})`;
		try {
			console.groupCollapsed(message);
			console.log(e);
			console.groupEnd();
		} catch (error) {
			console.log(message, error);
		}
	};

	websocket.onclose = () => {
		const formattedTime = formatTime(new Date());
		const message = `websocket_closed @ ${formattedTime} (gateway ${gatewayId})`;
		try {
			console.groupCollapsed(message);
			console.groupEnd();
		} catch (e) {
			console.log(message);
		}

		dispatch({
			type: 'GATEWAY_WEBSOCKET_CLOSED',
			gatewayId,
		});
	};
};

function authoriseWebsocket(gatewayId) {
	sendMessage(gatewayId, `{"module":"auth","action":"auth","data":{"sessionid":"${sessionId}","clientId":"${gatewayId}"}}`);
}

function addWebsocketFilter(gatewayId, module, action) {
	sendMessage(gatewayId, `{"module":"filter","action":"accept","data":{"module":"${module}","action":"${action}"}}`);
}

function sendMessage(gatewayId, message) {
	if (!websocketConnections[gatewayId] || !websocketConnections[gatewayId].websocket) {
		return console.error('trying to send message for unknown gateway', {
			gatewayId,
			message,
		});
	}
	const formattedTime = formatTime(new Date());
	const title_prefix = `sending websocket_message @ ${formattedTime} (for gateway ${gatewayId})`;
	try {
		console.groupCollapsed(title_prefix);
		console.log(message);
		console.groupEnd();
	} catch (e) {
		console.log(message);
	}
	websocketConnections[gatewayId].websocket.send(message);
}

export function closeAllConnections() {
	Object.keys(websocketConnections).forEach(_gatewayId => {
		const websocketConnection = websocketConnections[_gatewayId];
		if (websocketConnection.websocket) {
			websocketConnection.websocket.destroy();
		}
		delete websocketConnections[_gatewayId];
	});
}
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
 */

// @flow

'use strict';
import { format } from 'url';

import {LiveApi} from '../Lib/LiveApi';
import type { ThunkAction, Action } from './Types';

// Gateways actions that are shared by both Web and Mobile.
import { actions } from 'live-shared-data';
const { Gateways } = actions;


function getTokenForLocalControl(id: string, publicKey: string): ThunkAction {
	return (dispatch: Function, getState: Function): Promise<any> => {
		let formData = new FormData();
		formData.append('id', id);
		formData.append('publicKey', publicKey);
		const url = format({
			pathname: '/client/requestLocalKey',
		});
		const payload = {
			url,
			requestParams: {
				method: 'POST',
				body: formData,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		};
		return LiveApi(payload).then((response: Object): Object => {
			if (response && response.uuid) {
				dispatch(localControlSuccess(id, response.uuid));
				return response;
			}
			throw response;
		}).catch((err: Object) => {
			dispatch(localControlError(id));
			throw err;
		});
	};
}

const localControlSuccess = (gatewayId: string, uuid: string): Action => {
	return {
		type: 'GATEWAY_API_LOCAL_CONTROL_TOKEN_SUCCESS',
		payload: {
			gatewayId,
			uuid,
		},
	};
};

const localControlError = (gatewayId: string): Action => {
	return {
		type: 'GATEWAY_API_LOCAL_CONTROL_TOKEN_ERROR',
		payload: {
			gatewayId,
		},
	};
};

module.exports = {
	...Gateways,
	getTokenForLocalControl,
};

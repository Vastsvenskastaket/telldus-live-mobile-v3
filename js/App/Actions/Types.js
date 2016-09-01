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
 */

'use strict';

export type Action =
	  { type: 'LOGGED_IN' }
	| { type: 'RECEIVED_ACCESS_TOKEN', accessToken: Object }
	| { type: 'RECEIVED_USER_PROFILE', userProfile: Object }
	| { type: 'RECEIVED_DEVICES', devices: Object }
	| { type: 'RECEIVED_GATEWAYS', gateways: Object }
	| { type: 'RECEIVED_SENSORS', sensors: Object }
	| { type: 'LOGGED_OUT' }
	| { type: 'SWITCH_TAB', tab: 'dashboardTab' | 'devicesTab' | 'sensorsTab' | 'schedulerTab' | 'locationsTab' }
	| { type: 'ERROR', message: Object }
	;

export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type PromiseAction = Promise<Action>;
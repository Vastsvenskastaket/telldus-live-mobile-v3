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
 * @providesModule Reducers_Schedule
 */

// @flow

'use strict';

import type { Action } from 'Actions_Types';

const initialState = {
	id: 0,
	deviceId: 0,
	method: 0,
	methodValue: 0,
	type: '',
	hour: 0,
	minute: 0,
	offset: 0,
	randomInterval: 0,
	active: true,
	weekdays: [],
};

export type Schedule = {
	id: number,
	deviceId: number,
	method: number,
	methodValue: number,
	type: string,
	hour: number,
	minute: number,
	offset: number,
	randomInterval: number,
	active: boolean,
	weekdays: number[],
};

export default function scheduleReducer(state: Schedule = initialState, action: Action): Schedule {
	switch (action.type) {
		case 'SCHEDULE_SELECT_DEVICE':
			return {
				...state,
				id: 0,
				deviceId: action.payload.deviceId,
			};

		case 'SCHEDULE_SELECT_ACTION':
			return {
				...state,
				method: action.payload.method,
				methodValue: action.payload.methodValue,
			};

		case 'SCHEDULE_RESET':
			return initialState;

		case 'SCHEDULE_SELECT_TIME':
			return {
				...state,
				type: action.payload.type,
				...action.payload.time,
			};

		case 'SCHEDULE_SELECT_DAYS':
			return {
				...state,
				weekdays: action.payload.weekdays,
			};

		case 'SCHEDULE_EDIT':
			return action.payload.schedule;

		case 'SCHEDULE_SET_ACTIVE_STATE':
			return {
				...state,
				active: action.payload.active,
			};

		default:
			return state;
	}
}

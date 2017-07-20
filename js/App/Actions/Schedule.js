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
 * @providesModule Actions_Schedule
 */

// @flow

'use strict';

import type { Action } from './Types';

type Time = {
	hour?: number,
	minute?: number,
	offset?: number,
	randomInterval?: number,
};

const selectDevice = (deviceId: number): Action => ({
	type: 'SCHEDULE_SELECT_DEVICE',
	payload: {
		deviceId,
	},
});

const selectAction = (method: number, methodValue: number = 0): Action => ({
	type: 'SCHEDULE_SELECT_ACTION',
	payload: {
		method,
		methodValue,
	},
});

const selectTime = (type: string, time: Time): Action => ({
	type: 'SCHEDULE_SELECT_TIME',
	payload: {
		type,
		time,
	},
});

const selectDays = (weekdays: number[]): Action => ({
	type: 'SCHEDULE_SELECT_DAYS',
	payload: {
		weekdays,
	},
});

const reset = (): Action => ({
	type: 'SCHEDULE_EDIT_RESET',
});

module.exports = {
	selectDevice,
	selectAction,
	selectTime,
	selectDays,
	reset,
};
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

// @flow

'use strict';

import TelldusLocalStorage from '../Lib/LocalStorage';


export function storeDeviceHistory(data: Object): Promise<any> {
	let localStorage = new TelldusLocalStorage();
	return localStorage.storeDeviceHistory(data);
}

export function getDeviceHistory(id: number): Promise<any> {
	let localStorage = new TelldusLocalStorage();
	return localStorage.getDeviceHistory(id);
}

export function getLatestTimestamp(type: string, id: number): Promise<any> {
	let localStorage = new TelldusLocalStorage();
	return localStorage.getLatestTimestamp(type, id);
}

export function closeDatabase() {
	let localStorage = new TelldusLocalStorage();
	localStorage.closeDatabase();
}

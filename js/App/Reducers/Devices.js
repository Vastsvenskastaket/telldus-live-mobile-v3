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

import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import reduce from 'lodash/reduce';
import partition from 'lodash/partition';
import isEmpty from 'lodash/isEmpty';

function prepareSectionRow(paramOne: Array<any> | Object, gateways: Array<any> | Object): Array<any> {
	let result = groupBy(paramOne, (items: Object): Array<any> => {
		let gateway = gateways[items.clientId];
		items.isOnline = gateway.online;
		return gateway && gateway.name;
	});
	result = reduce(result, (acc: Array<any>, next: Object, index: number): Array<any> => {
		acc.push({
			key: index,
			data: next,
		});
		return acc;
	}, []);
	return result;
}

export function parseDevicesForListView(devices: Object = {}, gateways: Object = {}): Object {
	let visibleList = [], hiddenList = [];
	let isGatwaysEmpty = isEmpty(gateways);
	let isDevicesEmpty = isEmpty(devices);
	if (!isGatwaysEmpty && !isDevicesEmpty) {
		let orderedList = orderBy(devices, [(device: Object): any => {
			let { name } = device;
			return name ? name.toLowerCase() : null;
		}], ['asc']);
		let [hidden, visible] = partition(orderedList, (device: Object): Object => {
			return device.ignored;
		});
		visibleList = prepareSectionRow(visible, gateways);
		hiddenList = prepareSectionRow(hidden, gateways);
	}
	return { visibleList, hiddenList };
}

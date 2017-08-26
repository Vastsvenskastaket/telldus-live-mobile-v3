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

import type { Action } from 'Actions_Types';
import { REHYDRATE } from 'redux-persist/constants';

export type State = {
	openModal: boolean,
	data: Object,
}
const initialState = {
	openModal: false,
	data: {},
};

export default function reduceModal(state: State = initialState, action: Action): State {
	switch (action.type) {
		case REHYDRATE:
			return initialState;

		case 'REQUEST_MODAL_OPEN':
			return {
				...state,
				openModal: true,
				data: action.payload.data,
			};

		case 'REQUEST_MODAL_CLOSE':
			return initialState;

		default:
			return state;
	}

}

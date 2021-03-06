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
 *
 */

// @flow

'use strict';

import React from 'react';

import {
	View,
	Text,
	IconTelldus,
} from '../../../../BaseComponents';

import Theme from '../../../Theme';

class LabelBox extends View {
	render(): Object {
		let { containerStyle, label, children, showIcon, appLayout } = this.props;
		const styles = this.getStyle(appLayout);

		return (
			<View style={[styles.container, containerStyle]}>
				{!!label &&
					<Text style={styles.label}>
						{label}
					</Text>
				}
				{!!showIcon &&
					<IconTelldus icon={'location'} size={30} color={'#A59F9A'} style={styles.icon}/>
				}
				{!!children && children}
			</View>
		);
	}

	getStyle(appLayout: Object): Object {

		return {
			container: {
				flexDirection: 'column',
				backgroundColor: '#fff',
				marginTop: 15,
				padding: 10,
				alignItems: 'flex-start',
				justifyContent: 'center',
				...Theme.Core.shadow,
				borderRadius: 2,
			},
			label: {
				color: '#e26901',
				fontSize: 15,
				paddingLeft: 2,
			},
			icon: {
				position: 'absolute',
				top: 40,
				left: 8,
			},
		};
	}
}

export default LabelBox;

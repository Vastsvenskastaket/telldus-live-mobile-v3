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

import React, { PropTypes } from 'react';
import { Text, View } from 'react-native';
import Theme from 'Theme';

type DefaultProps = {
	color: string,
	bgColor: string,
};

type Props = {
	icon: string,
	size: number,
	color?: string,
	bgColor?: string,
	style?: Object,
};

export default class BlockIcon extends View<DefaultProps, Props, null> {

	static propTypes = {
		icon: PropTypes.string.isRequired,
		size: PropTypes.number.isRequired,
		color: PropTypes.string,
		bgColor: PropTypes.string,
		style: View.propTypes.style,
	};

	static defaultProps = {
		color: '#fff',
		bgColor: Theme.Core.brandPrimary,
	};

	render() {
		const { style, bgColor, icon } = this.props;
		const defaultStyle = this._getDefaultStyle();

		return (
			<View style={[defaultStyle.container, style, { backgroundColor: bgColor }]}>
				<Text style={defaultStyle.icon}>
					{icon}
				</Text>
			</View>
		);
	}

	_getDefaultStyle = (): Object => {
		const { size, color } = this.props;

		return {
			container: {
				alignItems: 'center',
				justifyContent: 'center',
			},
			icon: {
				fontFamily: Theme.Core.fonts.telldusIconFont,
				color,
				fontSize: size,
			},
		};
	};
}

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
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import Theme from 'Theme';
import getDeviceWidth from '../App/Lib/getDeviceWidth';

type DefaultProps = {
	tabs: boolean,
	iconSize: number,
	paddingRight: number,
};

type Props = {
	onPress: Function,
	imageSource: number,
	tabs: boolean,
	iconSize: number,
	paddingRight: number,
};

export default class FloatingButton extends View<DefaultProps, Props, null> {

	static propTypes = {
		onPress: PropTypes.func.isRequired,
		imageSource: PropTypes.number.isRequired,
		tabs: PropTypes.bool,
		iconSize: PropTypes.number,
		paddingRight: PropTypes.number,
	};

	static defaultProps = {
		tabs: false,
		iconSize: getDeviceWidth() * 0.056,
		paddingRight: 0,
	};

	render() {
		const { container, button, icon } = this._getStyle();

		const { onPress, imageSource } = this.props;

		return (
			<TouchableOpacity style={container} onPress={onPress}>
				<View style={button}>
					<Image source={imageSource} style={icon} resizeMode="contain"/>
				</View>
			</TouchableOpacity>
		);
	}

	_getStyle = (): Object => {
		const { shadow: themeShadow, brandSecondary } = Theme.Core;
		const deviceWidth = getDeviceWidth();

		const { tabs, iconSize, paddingRight } = this.props;

		const isIOSTabs = Platform.OS === 'ios' && tabs;

		const buttonSize = deviceWidth * 0.134666667;
		const offsetBottom = deviceWidth * 0.046666667 + (isIOSTabs ? 50 : 0);
		const offsetRight = deviceWidth * 0.034666667 - paddingRight;

		const shadow = Object.assign({}, themeShadow, {
			shadowOpacity: 0.5,
			shadowOffset: {
				...themeShadow.shadowOffset,
				height: 2,
			},
		});

		return {
			container: {
				backgroundColor: brandSecondary,
				borderRadius: buttonSize / 2,
				position: 'absolute',
				height: buttonSize,
				width: buttonSize,
				bottom: offsetBottom,
				right: offsetRight,
				...shadow,
			},
			button: {
				flex: 1,
				alignItems: 'center',
				justifyContent: 'center',
			},
			icon: {
				width: iconSize,
				height: iconSize,
			},
		};
	};

}
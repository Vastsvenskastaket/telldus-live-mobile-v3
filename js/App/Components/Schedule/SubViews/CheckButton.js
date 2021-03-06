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

import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Text, View } from '../../../../BaseComponents';
import Theme from '../../../Theme';
import i18n from '../../../Translations/common';

type Props = {
	children: string,
	onPress: Function,
	disabled: boolean,
	appLayout: Object,
	intl: Object,
};

export default class CheckButton extends View<null, Props, null> {

	static propTypes = {
		children: PropTypes.string.isRequired,
		onPress: PropTypes.func.isRequired,
		disabled: PropTypes.bool.isRequired,
	};

	render(): React$Element<any> {
		const { children, onPress, disabled, appLayout, intl } = this.props;
		const { container, button, text } = this._getStyle(appLayout);
		const accessibilityLabel = `${children}, ${intl.formatMessage(i18n.defaultDescriptionButton)}`;

		return (
			<TouchableOpacity style={container} onPress={onPress} disabled={disabled} accessibilityLabel={accessibilityLabel}>
				<View style={button}>
					<Text style={text}>
						{children.toUpperCase()}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	_getStyle = (appLayout: Object): Object => {
		const { disabled } = this.props;
		const { shadow: themeShadow, fonts, brandSecondary, inactiveGray } = Theme.Core;
		const { height, width } = appLayout;
		const isPortrait = height > width;
		const deviceWidth = isPortrait ? width : height;

		const borderRadius = 100;
		const backgroundColor = disabled ? inactiveGray : brandSecondary;
		const shadow = disabled ? {} : Object.assign({}, themeShadow, {
			shadowOpacity: 0.5,
			shadowOffset: {
				...themeShadow.shadowOffset,
				height: 2,
			},
		});

		return {
			container: {
				backgroundColor,
				height: deviceWidth * 0.128,
				width: deviceWidth * 0.373333333,
				...shadow,
				borderRadius,
			},
			button: {
				flex: 1,
				backgroundColor,
				borderRadius,
				overflow: 'hidden',
				justifyContent: 'center',
				alignItems: 'center',
			},
			text: {
				color: '#fff',
				fontFamily: fonts.robotoRegular,
				fontSize: deviceWidth * 0.037333333,
			},
		};
	};

}

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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import View from './View';
import Theme from '../App/Theme';
import Platform from 'Platform';

type DefaultProps = {
	importantForAccessibility: string,
};

type Props = {
	children?: any,
	row?: Object,
	onPress?: (row?: Object) => void,
	layout?: 'row' | 'column',
	style?: any,
	containerStyle?: any,
	appLayout: Object,
	importantForAccessibility?: string,
	accessibilityLabel?: string,
};

class Row extends Component<Props, null> {
	props: Props;

	static propTypes = {
		children: PropTypes.node,
		row: PropTypes.object,
		onPress: PropTypes.func,
		layout: PropTypes.oneOf(['row', 'column']),
		style: PropTypes.object,
		containerStyle: PropTypes.any,
	};

	static defaultProps: DefaultProps = {
		importantForAccessibility: 'no',
	};

	onPress = () => {
		const { row, onPress } = this.props;
		if (onPress) {
			if (row) {
				onPress(row);
			} else {
				onPress();
			}
		}
	};

	render(): Object {
		const { children, onPress, style, containerStyle, importantForAccessibility, accessibilityLabel } = this.props;
		const defaultStyle = this._getDefaultStyle();

		return (
			<TouchableOpacity
				accessible={false}
				onPress={this.onPress}
				style={[defaultStyle.container, containerStyle]}
				outlineProvider="bounds"
				disabled={!onPress}
				importantForAccessibility={importantForAccessibility}
				accessibilityLabel={accessibilityLabel}
			>
				<View style={[defaultStyle.wrapper, style]}>
					{children}
				</View>
			</TouchableOpacity>
		);
	}

	_getDefaultStyle = (): Object => {
		const { borderRadiusRow } = Theme.Core;
		const { layout, appLayout } = this.props;
		const { height, width } = appLayout;
		const isPortrait = height > width;
		const deviceWidth = isPortrait ? width : height;

		const backgroundColor = '#fff';

		return {
			container: {
				backgroundColor,
				flexDirection: 'row',
				marginBottom: deviceWidth * 0.006666667,
				height: deviceWidth * 0.209333333,
				...Theme.Core.shadow,
				borderRadius: borderRadiusRow,
			},
			wrapper: {
				backgroundColor,
				flex: 1,
				flexDirection: layout,
				alignItems: layout === 'row' ? 'center' : 'flex-start',
				overflow: Platform.OS === 'android' ? 'visible' : 'hidden',
				borderRadius: borderRadiusRow,
			},
		};
	};

}

function mapStateToProps(state: Object, ownProps: Object): Object {
	return {
		appLayout: state.App.layout,
	};
}

module.exports = connect(mapStateToProps, null)(Row);


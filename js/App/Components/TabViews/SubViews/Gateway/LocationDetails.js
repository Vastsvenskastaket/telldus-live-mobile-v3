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
import { connect } from 'react-redux';
import { Text, View } from '../../../../../BaseComponents';
import { StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import Theme from '../../../../Theme';
import {
	getRelativeDimensions,
} from '../../../../Lib';
type Props = {
	title?: any,
	image: string,
	H1: string,
	H2: string,
	style: any,
	onPress?: Function,
	appLayout: Object,
	accessible?: boolean,
	info?: Object,
	imageStyle?: number | Object | Array<any>,
	descriptionContainerStyle?: number | Object | Array<any>,
	h1Style?: number | Object | Array<any>,
	h2Style?: number | Object | Array<any>,
};

type State = {
};

class LocationDetails extends View {
	props: Props;
	state: State;

	onPress: () => void;

	constructor(props: Props) {
		super(props);
		this.state = {
		};

		this.onPress = this.onPress.bind(this);
	}

	onPress() {
		if (this.props.onPress) {
			if (typeof this.props.onPress === 'function') {
				this.props.onPress();
			} else {
				console.warn('Invalid Prop Passed : onPress expects a Function.');
			}
		}
	}

	render(): Object {

		let { title, H1, H2, image, style, appLayout, accessible, info,
			imageStyle, descriptionContainerStyle, h1Style, h2Style, onPress } = this.props;

		let {
			locationTextContainer,
			locationImage,
			textHSH,
			textLocation,
		} = this.getStyle(appLayout);

		return (
			<View style={[styles.shadow, styles.container, style]}>
				{!!title && (
					<Text style={[textLocation, {marginLeft: 10}]}>
						{title}
					</Text>)
				}
				<View style={styles.imageHeaderContainer}>
					<Image style={[locationImage, imageStyle]} source={{ uri: image, isStatic: true }} />
					<TouchableWithoutFeedback disabled={!onPress} onPress={this.onPress} accessible={accessible}>
						<View style={[locationTextContainer, descriptionContainerStyle]}>
							<Text numberOfLines={1} style={[textHSH, h1Style]}>
								{!!H1 && H1}
							</Text>
							<Text numberOfLines={1} style={[textLocation, h2Style]}>
								{!!H2 && H2}
							</Text>
							{info && (
								info
							)}
						</View>
					</TouchableWithoutFeedback>
				</View>
			</View>
		);
	}

	getStyle(appLayout: Object): Object {
		const height = appLayout.height;
		const width = appLayout.width;
		let isPortrait = height > width;

		return {
			locationTextContainer: {
				height: isPortrait ? height * 0.16 : width * 0.16,
				width: width * 0.58,
				marginRight: width * 0.15,
				justifyContent: 'center',
				alignItems: 'flex-start',
			},
			locationImage: {
				width: isPortrait ? width * 0.22 : height * 0.22,
				height: isPortrait ? height * 0.12 : width * 0.12,
				alignSelf: 'flex-start',
				resizeMode: 'contain',
			},
			textLocation: {
				color: '#A59F9A',
				fontSize: 14,
			},
			textHSH: {
				color: '#F06F0C',
				fontSize: 19,
			},
		};
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		backgroundColor: '#fff',
		paddingHorizontal: 10,
		paddingVertical: 10,
		marginVertical: 10,
		justifyContent: 'center',
	},
	imageHeaderContainer: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexDirection: 'row',
	},
	shadow: {
		borderRadius: 2,
		...Theme.Core.shadow,
	},
});

function mapStateToProps(store: Object): Object {
	return {
		appLayout: getRelativeDimensions(store.App.layout),
	};
}

module.exports = connect(mapStateToProps, null)(LocationDetails);

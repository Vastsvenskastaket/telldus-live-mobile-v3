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
import { Dimensions } from 'react-native';
import Slider from 'react-native-slider';
import { View, Text, FloatingButton } from 'BaseComponents';
import Theme from 'Theme';

type Props = {
	navigation: Object,
	actions: Object,
	onDidMount: (string, string, ?Object) => void,
	paddingRight: number,
};

type State = {
	methodValue: number,
};

class ActionDim extends View {

	props: Props;
	state: State;

	getStyles: () => Object;
	setMethodValue: (number) => void;
	selectAction: () => void;

	static propTypes = {
		navigation: PropTypes.object,
		actions: PropTypes.object,
		onDidMount: PropTypes.func,
		paddingRight: PropTypes.number,
	};

	constructor(props) {
		super(props);

		this.h1 = '2. Action';
		this.h2 = 'Choose an action to execute';
		this.infoButton = {
			tmp: true, // TODO: fill with real fields
		};

		this.maximumValue = 255;
		this.initialValue = this.maximumValue / 2;

		this.sliderColor = Theme.Core.brandSecondary;

		this.sliderConfig = {
			minimumValue: 0,
			maximumValue: this.maximumValue,
			value: this.initialValue,
			onValueChange: this.setMethodValue,
			minimumTrackTintColor: this.sliderColor,
		};

		this.state = {
			methodValue: this.initialValue,
		};
	}

	componentDidMount() {
		const { h1, h2, infoButton } = this;
		this.props.onDidMount(h1, h2, infoButton);
	}

	getStyles = () => {
		this.deviceWidth = Dimensions.get('window').width;

		const thumbSize = this.deviceWidth * 0.066666667;
		const padding = this.deviceWidth * 0.066666667;

		return {
			container: {
				flex: 1,
				flexDirection: 'row',
				alignItems: 'flex-start',
			},
			row: {
				flex: 1,
				backgroundColor: '#fff',
				borderRadius: 2,
				elevation: 2,
				shadowColor: '#000',
				shadowRadius: 2,
				shadowOpacity: 0.23,
				shadowOffset: {
					width: 0,
					height: 1,
				},
				paddingHorizontal: padding,
				paddingBottom: padding,
				paddingTop: this.deviceWidth * 0.026666667,
			},
			caption: {
				fontSize: this.deviceWidth * 0.032,
				marginBottom: this.deviceWidth * 0.092,
				textAlign: 'center',
			},
			slider: {
				track: {
					borderRadius: 0,
					height: this.deviceWidth * 0.010666667,
				},
				thumb: {
					backgroundColor: this.sliderColor,
					borderRadius: thumbSize / 2,
					height: thumbSize,
					width: thumbSize,
				},
			},
		};
	};

	setMethodValue = methodValue => {
		this.setState({ methodValue });
	};

	selectAction = () => {
		const { actions, navigation } = this.props;
		actions.selectAction(16, this.state.methodValue);
		navigation.navigate('Time');
	};

	render() {
		const { container, row, caption, slider } = this.getStyles();

		const dimValue = Math.round(this.state.methodValue / this.maximumValue * 100);

		return (
			<View style={container}>
				<View style={row}>
					<Text style={caption}>
						{`Set Dim value (${dimValue}%)`}
					</Text>
					<Slider
						{...this.sliderConfig}
						trackStyle={slider.track}
						thumbStyle={slider.thumb}
					/>
				</View>
				<FloatingButton
					onPress={this.selectAction}
					imageSource={require('./img/right-arrow-key.png')}
					iconSize={this.deviceWidth * 0.041333333}
					paddingRight={this.props.paddingRight}
				/>
			</View>
		);
	}
}

module.exports = ActionDim;
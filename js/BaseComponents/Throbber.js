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
import {Animated, StyleSheet} from 'react-native';

import View from './View';
import IconTelldus from './IconTelldus';
import Theme from 'Theme';
const AnimatedIconTelldus = Animated.createAnimatedComponent(IconTelldus);

type Props = {
	throbberContainerStyle?: number | Object | Array<any>,
	throbberStyle?: number | Object | Array<any>,
	throbSpeed?: number,
};

export default class Throbber extends Component {
	props: Props;

	animatedValue: Object;
	nextAnimatedValue: number;
	startThrob: () => void;

	static defaultProps = {
		throbSpeed: 30,
	}

	constructor(props: Props) {
		super(props);
		this.animatedValue = new Animated.Value(0);
		this.nextAnimatedValue = 0;
	}

	componentDidMount() {
		this.startThrob();
	}

	startThrob() {
		this.nextAnimatedValue += 100;
		Animated.timing(this.animatedValue, {
			toValue: this.nextAnimatedValue,
			duration: this.props.throbSpeed,
		}).start((event: Object) => {
			if (event.finished) {
				this.startThrob();
			}
		});
	}

	render(): Object {
		let {
			throbberContainerStyle,
			throbberStyle,
		} = this.props;

		let interpolatedValue = this.animatedValue.interpolate({
			inputRange: [this.nextAnimatedValue, this.nextAnimatedValue + 100],
			outputRange: ['0deg', '45deg'],
		});

		return (
			<View style={[styles.throbberContainer, throbberContainerStyle]}>
				<AnimatedIconTelldus icon="loading" style={[styles.throbber, throbberStyle, {
					transform: [{
						rotate: interpolatedValue,
					}],
				},
				]}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	throbberContainer: {
		position: 'absolute',
		alignItems: 'center',
	},
	throbber: {
		fontSize: 25,
		color: Theme.Core.brandSecondary,
	},
});

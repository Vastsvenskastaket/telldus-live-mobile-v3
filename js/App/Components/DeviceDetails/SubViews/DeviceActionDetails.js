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
import { StyleSheet, Dimensions } from 'react-native';

import { View } from '../../../../BaseComponents';
import {
	BellButton,
	OnButton,
	OffButton,
} from '../../TabViews/SubViews';
import SliderDetails from './SliderDetails';
import UpButton from '../../TabViews/SubViews/Navigational/UpButton';
import DownButton from '../../TabViews/SubViews/Navigational/DownButton';
import StopButton from '../../TabViews/SubViews/Navigational/StopButton';

import Theme from '../../../Theme';
const deviceWidth = Dimensions.get('window').width;
const outerPadding = (deviceWidth * 0.02233) * 2;
const buttonPadding = 10;
const bodyPadding = buttonPadding * 1.5;

type Props = {
	device: Object,
	intl: Object,
    isGatewayActive: boolean,
    appLayout: Object,
};

class DeviceActionDetails extends View {
	props: Props;

	constructor(props: Props) {
		super(props);
	}

	render(): Object {
		const { device, intl, isGatewayActive, appLayout } = this.props;
		const {
			TURNON,
			TURNOFF,
			BELL,
			DIM,
			UP,
			DOWN,
			STOP,
		} = device.supportedMethods;
		const buttons = [];
		const { buttonStyle, buttonsContainer } = this.getStyles(appLayout);

		if (UP) {
			buttons.push(
				<UpButton {...device} intl={intl} isGatewayActive={isGatewayActive}
					iconSize={45} supportedMethod={UP}/>
			);
		}

		if (DOWN) {
			buttons.push(
				<DownButton {...device} intl={intl} isGatewayActive={isGatewayActive}
					iconSize={45} supportedMethod={DOWN}/>
			);
		}

		if (STOP) {
			buttons.push(
				<StopButton {...device} intl={intl} isGatewayActive={isGatewayActive}
					iconSize={20} supportedMethod={STOP}/>
			);
		}

		if (TURNOFF) {
			buttons.push(
				<OffButton {...device} intl={intl} isGatewayActive={isGatewayActive}/>
			);
		}

		if (TURNON) {
			buttons.push(
				<OnButton {...device} intl={intl} isGatewayActive={isGatewayActive}/>
			);
		}

		if (BELL) {
			buttons.push(
				<BellButton device={device} intl={intl} isGatewayActive={isGatewayActive}/>
			);
		}

		const newButtonStyle = buttons.length > 4 ? buttonStyle : {...buttonStyle, flex: 1};

		return (
			<View style={[styles.container, styles.shadow]}>
				{DIM && (
					<SliderDetails device={device} intl={intl} isGatewayActive={isGatewayActive}/>
				)}
				<View style={{flex: 1, alignItems: 'stretch'}}>
					<View style={buttonsContainer}>
						{
							React.Children.map(buttons, (button: Object): Object | null => {
								if (React.isValidElement(button)) {
									return React.cloneElement(button, {style: newButtonStyle});
								}
								return null;
							})
						}
					</View>
				</View>
			</View>
		);
	}

	getStyles(appLayout: Object): Object {
		const { width } = appLayout;
		return {
			buttonsContainer: {
				flex: 1,
				flexDirection: 'row',
				flexWrap: 'wrap',
				alignItems: 'center',
				justifyContent: 'space-between',
			},
			buttonStyle: {
				minWidth: (width - outerPadding - (buttonPadding * 3) - (bodyPadding * 2)) / 4,
				justifyContent: 'center',
				alignItems: 'center',
				height: Theme.Core.rowHeight,
				marginLeft: buttonPadding,
				marginTop: buttonPadding,
				...Theme.Core.shadow,
			},
		};
	}
}

DeviceActionDetails.propTypes = {
	device: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'stretch',
		justifyContent: 'center',
		backgroundColor: '#fff',
		marginTop: 20,
		paddingTop: bodyPadding - 10,
		paddingBottom: bodyPadding,
		paddingLeft: bodyPadding - buttonPadding,
		paddingRight: bodyPadding,
	},
	shadow: {
		borderRadius: 2,
		...Theme.Core.shadow,
	},
});

module.exports = DeviceActionDetails;

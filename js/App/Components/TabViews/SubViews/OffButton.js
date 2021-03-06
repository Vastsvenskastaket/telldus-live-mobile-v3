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
import { connect } from 'react-redux';
import { View, IconTelldus } from '../../../../BaseComponents';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { deviceSetState, requestDeviceAction } from '../../../Actions/Devices';
import ButtonLoadingIndicator from './ButtonLoadingIndicator';

import i18n from '../../../Translations/common';
import Theme from '../../../Theme';

type Props = {
	requestDeviceAction: (id: number, command: number, value?: number) => void,
	deviceSetState: (id: number, command: number) => void,
	intl: Object,
	name: string,
	isGatewayActive: boolean,
	style: Object | number | Array<any>,
	iconStyle: Object | number | Array<any>,
	methodRequested: string,
	isInState: string,
	enabled: boolean,
	command: number,
	id: number,
};

class OffButton extends View {
	props: Props;

	onPress: () => void;

	constructor(props: Props) {
		super(props);
		this.onPress = this.onPress.bind(this);
		this.animationInterval = null;

		this.labelOffButton = `${props.intl.formatMessage(i18n.off)} ${props.intl.formatMessage(i18n.button)}`;
	}

	onPress() {
		this.props.requestDeviceAction(this.props.id, this.props.command);
		this.props.deviceSetState(this.props.id, this.props.command);
	}

	render(): Object {
		let { isInState, enabled, methodRequested, name, isGatewayActive, iconStyle } = this.props;
		let accessibilityLabel = `${this.labelOffButton}, ${name}`;
		let buttonStyle = !isGatewayActive ?
			(isInState === 'TURNOFF' ? styles.offline : styles.disabled) : (isInState === 'TURNOFF' ? styles.enabled : styles.disabled);
		let iconColor = !isGatewayActive ?
			(isInState === 'TURNOFF' ? '#fff' : '#a2a2a2') : (isInState === 'TURNOFF' ? '#fff' : Theme.Core.brandPrimary);

		return (
			<TouchableOpacity
				disabled={!enabled}
				onPress={this.onPress}
				style={[this.props.style, buttonStyle]}
				accessibilityLabel={accessibilityLabel}>
				<IconTelldus icon="off" style={StyleSheet.flatten([Theme.Styles.deviceActionIcon, iconStyle])} color={iconColor}/>
				{
					methodRequested === 'TURNOFF' ?
						<ButtonLoadingIndicator style={styles.dot} />
						:
						null
				}
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	enabled: {
		backgroundColor: Theme.Core.brandPrimary,
	},
	disabled: {
		backgroundColor: '#eeeeee',
	},
	offline: {
		backgroundColor: '#a2a2a2',
	},
	textEnabled: {
		color: '#fff',
	},
	textDisabled: {
		color: Theme.Core.brandPrimary,
	},
	button: {
		justifyContent: 'center',
		alignItems: 'stretch',
	},
	buttonText: {
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	dot: {
		zIndex: 3,
		position: 'absolute',
		top: 3,
		left: 3,
	},
});

OffButton.propTypes = {
	id: PropTypes.number,
	isInState: PropTypes.string,
	enabled: PropTypes.bool,
	fontSize: PropTypes.number,
	methodRequested: PropTypes.string,
	command: PropTypes.number,
};

OffButton.defaultProps = {
	enabled: true,
	command: 2,
};

function mapDispatchToProps(dispatch: Function): Object {
	return {
		deviceSetState: (id: number, command: number, value?: number) => {
			dispatch(deviceSetState(id, command, value));
		},
		requestDeviceAction: (id: number, command: number) => {
			dispatch(requestDeviceAction(id, command));
		},
		dispatch,
	};
}

module.exports = connect(null, mapDispatchToProps)(OffButton);

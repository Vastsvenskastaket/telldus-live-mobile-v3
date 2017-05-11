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

'use strict';

import React from 'react';
import { connect } from 'react-redux';

import { RoundedCornerShadowView, Text, View } from 'BaseComponents';
import { StyleSheet, TouchableOpacity, Slider } from 'react-native';
import DeviceDetailModal from './DeviceDetailModal';

import { turnOn, turnOff, learn} from 'Actions/Devices';
import { setDimmerValue, updateDimmerValue } from 'Actions/Dimmer';

const ToggleButton = ({device, onTurnOn, onTurnOff}) => (
    <RoundedCornerShadowView style={styles.toggleContainer}>
        <TouchableOpacity
            style={[styles.toggleButton, {
	backgroundColor: device.isInState === 'TURNOFF' ? 'white' : '#eeeeee',
}]}
            onPress={onTurnOff}>
            <Text style={{
	fontSize: 16,
	color: device.isInState === 'TURNOFF' ? 'red' : '#9e9e9e'}}>
                {'Off'}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={[styles.toggleButton, {
	backgroundColor: device.isInState !== 'TURNOFF' ? 'white' : '#eeeeee',
}]}
            onPress={onTurnOn}>
            <Text style={{
	fontSize: 16,
	color: device.isInState !== 'TURNOFF' ? '#2c7e38' : '#9e9e9e'}}>
                {'On'}
            </Text>
        </TouchableOpacity>
    </RoundedCornerShadowView>
);

const LearnButton = ({device, onLearn}) => (
    <RoundedCornerShadowView style={{
	height: 36,
	marginHorizontal: 8,
	marginVertical: 8,
	justifyContent: 'center',
	alignItems: 'center'}}>
        <TouchableOpacity onPress={onLearn}>
            <Text style={{fontSize: 16, color: 'orange'}}>
                {'Learn'}
            </Text>
        </TouchableOpacity>
    </RoundedCornerShadowView>
);

class DimmerDeviceDetailModal extends View {

	constructor(props) {
		super(props);
		const device = this.props.store.devices.find(item => item.id === this.props.deviceId);

		const dimmerValue = this.getDimmerValue(device);

		this.state = {
			dimmerValue,
		};
		this.sliding = false;
		this.onTurnOn = this.onTurnOn.bind(this);
		this.onTurnOff = this.onTurnOff.bind(this);
		this.onLearn = this.onLearn.bind(this);
		this.onValueChange = this.onValueChange.bind(this);
		this.onSlidingComplete = this.onSlidingComplete.bind(this);
	}

	getDimmerValue(device) {
		if (device !== null && device.value !== null) {
			if (device.isInState === 'TURNON') {
				return 100;
			} else if (device.isInState === 'TURNOFF') {
				return 0;
			} else if (device.isInState === 'DIM') {
				return Math.round(device.value * 100.0 / 255);
			}
		}
	}

	onTurnOn() {
		this.props.onTurnOn(this.props.deviceId);
	}

	onTurnOff() {
		this.props.onTurnOff(this.props.deviceId);
	}

	onLearn() {
		this.props.onLearn(this.props.deviceId);
	}

	onValueChange(value) {
		this.setState({dimmerValue: value});
		this.sliding = true;
	}

	onSlidingComplete(value) {
		this.props.onDim(this.props.deviceId, 255 * value / 100.0);
		this.sliding = false;
	}

    // TODO: Fix a bug which make slider's value is being changed after sliding complete
	render() {
		const device = this.props.store.devices.find(item => item.id === this.props.deviceId);

		let hasToggleButton = false;
		let hasLearnButton = false;
		let hasSlider = false;

		let toggleButton = null;
		let learnButton = null;
		let slider = null;

		const sliderValue = this.sliding ? this.state.dimmerValue : this.getDimmerValue(device);

		if (device) {
			const { TURNON, TURNOFF, LEARN, DIM } = device.supportedMethods;
			hasToggleButton = TURNON || TURNOFF;
			hasLearnButton = LEARN;
			hasSlider = DIM;
		}

		if (hasToggleButton) {
			toggleButton = <ToggleButton device={device} onTurnOn={this.onTurnOn} onTurnOff={this.onTurnOff} />;
		}

		if (hasLearnButton) {
			learnButton = <LearnButton device={device} onLearn={this.onLearn} />;
		}

		if (hasSlider) {
			slider = <Slider minimumValue={0} maximumValue={100} step={1} value={sliderValue}
                    style={{marginHorizontal: 8, marginVertical: 8}}
                    onValueChange={this.onValueChange}
                    onSlidingComplete={this.onSlidingComplete}/>;
		}

		return (
            <DeviceDetailModal
                isVisible={this.props.isVisible}
                onCloseSelected={this.props.onCloseSelected}
                deviceId={this.props.deviceId}>
                <Text style={styles.textDimmingLevel}>
                    {'Dimming level: ' + sliderValue + '%'}
                </Text>
                {slider}
                {toggleButton}
                {learnButton}
            </DeviceDetailModal>
		);
	}

}

DimmerDeviceDetailModal.propTypes = {
	onCloseSelected: React.PropTypes.func.isRequired,
	deviceId: React.PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
	textDimmingLevel: {
		color: '#1a355b',
		fontSize: 14,
		marginTop: 12,
		marginLeft: 8,
	},
	toggleContainer: {
		flexDirection: 'row',
		height: 36,
		marginHorizontal: 8,
		marginVertical: 16,
	},
	toggleButton: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

function select(store) {
	return { store };
}

function actions(dispatch) {
	return {
		onTurnOn: (id) => dispatch(turnOn(id)),
		onTurnOff: (id) => dispatch(turnOff(id)),
		onLearn: (id) => dispatch(learn(id)),
		onDimmerSlide: (id, value) => dispatch(setDimmerValue(id, value)),
		onDim: (id, value) => dispatch(updateDimmerValue(id, value)),
	};
}

module.exports = connect(select, actions)(DimmerDeviceDetailModal);

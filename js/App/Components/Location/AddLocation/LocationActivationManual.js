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
 *
 *
 */

// @flow

'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { TextInput, Keyboard } from 'react-native';
import { defineMessages, intlShape } from 'react-intl';
import { announceForAccessibility } from 'react-native-accessibility';
import { isIphoneX } from 'react-native-iphone-x-helper';

import {View, FormattedMessage, FloatingButton} from '../../../../BaseComponents';
import LabelBox from '../Common/LabelBox';

import i18n from '../../../Translations/common';
const messages = defineMessages({
	label: {
		id: 'addNewLocation.activateManual.label',
		defaultMessage: 'Activation Code',
		description: 'Label for the field Location Manual Activate Field',
	},
	headerOne: {
		id: 'addNewLocation.activateManual.headerOne',
		defaultMessage: 'Select Location',
		description: 'Main header for the Location Manual Activate Screen',
	},
	headerTwo: {
		id: 'addNewLocation.activateManual.headerTwo',
		defaultMessage: 'Enter Activation Code',
		description: 'Secondary header for the Location Manual Activate Screen',
	},
	invalidActivationCode: {
		id: 'addNewLocation.activateManual.invalidActivationCode',
		defaultMessage: 'The activation code you entered is invalid. Please check that it is entered correctly.',
		description: 'Local Validation text when Activation Code is Invalid',
	},
	bodyContent: {
		id: 'addNewLocation.activateManual.bodyContent',
		defaultMessage: 'Activate your TellStick by typing the activation code. The activation code ' +
		'is written on the label on the bottom of your TellStick.',
		description: 'The body content for the Location Manual Activate Screen',
	},
	messageAlreadyActivated: {
		id: 'addNewLocation.activateManual.messageAlreadyActivated',
		defaultMessage: 'This Gateway has already been activated.',
		description: 'The Dialogue message when the gateway is already activated',
	},
});
type Props = {
	navigation: Object,
	dispatch: Function,
	onDidMount: Function,
	actions: Object,
	intl: intlShape.isRequired,
	appLayout: Object,
	screenReaderEnabled: boolean,
	currentScreen: string,
	dialogueOpen: boolean,
	currentScreen: string,
};

class LocationActivationManual extends View {
	props: Props;

	onActivationCodeChange: (string) => void;
	onActivationCodeSubmit: () => void;

	keyboardDidShow: () => void;
	keyboardDidHide: () => void;

	constructor(props: Props) {
		super(props);
		this.state = {
			activationCode: '',
			isKeyboardShown: false,
			isLoading: false,
		};

		let { formatMessage } = props.intl;

		this.h1 = `1. ${formatMessage(messages.headerOne)}`;
		this.h2 = formatMessage(messages.headerTwo);
		this.label = formatMessage(messages.label);

		this.invalidActivationCode = formatMessage(messages.invalidActivationCode);

		this.labelMessageToAnnounce = `${formatMessage(i18n.screen)} ${this.h1}. ${this.h2}`;
		this.messageAlreadyActivated = formatMessage(messages.messageAlreadyActivated);

		this.onActivationCodeChange = this.onActivationCodeChange.bind(this);
		this.onActivationCodeSubmit = this.onActivationCodeSubmit.bind(this);

		this.keyboardDidShow = this.keyboardDidShow.bind(this);
		this.keyboardDidHide = this.keyboardDidHide.bind(this);
	}

	componentDidMount() {
		const { h1, h2 } = this;
		this.props.onDidMount(h1, h2);
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

		let { screenReaderEnabled } = this.props;
		if (screenReaderEnabled) {
			announceForAccessibility(this.labelMessageToAnnounce);
		}
	}

	componentWillReceiveProps(nextProps: Object) {
		let { screenReaderEnabled, currentScreen } = nextProps;
		let shouldAnnounce = currentScreen === 'LocationActivationManual' && this.props.currentScreen !== 'LocationActivationManual';
		if (screenReaderEnabled && shouldAnnounce) {
			announceForAccessibility(this.labelMessageToAnnounce);
		}
	}

	keyboardDidShow() {
		this.setState({
			isKeyboardShown: true,
		});
	}

	keyboardDidHide() {
		this.setState({
			isKeyboardShown: false,
		});
	}

	shouldComponentUpdate(nextProps: Object, nextState: Object): boolean {
		return nextProps.currentScreen === 'LocationActivationManual';
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	onActivationCodeChange(activationCode: string) {
		this.setState({
			activationCode,
		});
	}

	onActivationCodeSubmit() {
		if (this.state.isKeyboardShown) {
			Keyboard.dismiss();
		}
		if (this.state.activationCode.length === 10) {
			this.setState({
				isLoading: true,
			});
			let param = {code: this.state.activationCode};
			this.props.actions.getGatewayInfo(param, 'timezone').then((response: Object) => {
				if (response && response.activated === false) {
					let clientInfo = {
						clientId: response.id,
						uuid: response.uuid,
						type: response.type,
						timezone: response.timezone,
						autoDetected: true,
					};
					this.props.navigation.navigate('LocationName', {clientInfo});
				} else if (response && response.activated === true) {
					this.props.actions.showModal(this.messageAlreadyActivated, 'ERROR');
				} else {
					this.props.actions.showModal(response, 'ERROR');
				}
				this.setState({
					isLoading: false,
				});
			}).catch((error: Object) => {
				let message = error.message ? (error.message === 'Invalid activation code' ? this.invalidActivationCode : error.message) :
					error.error ? error.error : 'Unknown Error';
				this.props.actions.showModal(message, 'ERROR');
				this.setState({
					isLoading: false,
				});
			});
		} else {
			this.props.actions.showModal(this.invalidActivationCode, 'ERROR');
		}
	}

	render(): Object {
		let { appLayout, dialogueOpen, currentScreen } = this.props;
		const styles = this.getStyle(appLayout);

		let importantForAccessibility = !dialogueOpen && currentScreen === 'LocationActivationManual' ? 'no' : 'no-hide-descendants';

		return (
			<View style={{flex: 1}} importantForAccessibility={importantForAccessibility}>
				<LabelBox
					containerStyle={{marginBottom: 10}}
					label={this.label}
					showIcon={true}
					appLayout={appLayout}>
					<TextInput
						style={styles.textField}
						onChangeText={this.onActivationCodeChange}
						autoCapitalize="characters"
						autoCorrect={false}
						autoFocus={true}
						underlineColorAndroid="#e26901"
						defaultValue={this.state.activationCode}
					/>
					<FormattedMessage style={styles.textBody} {...messages.bodyContent}/>
				</LabelBox>
				<FloatingButton
					buttonStyle={styles.buttonStyle}
					onPress={this.onActivationCodeSubmit}
					imageSource={this.state.isLoading ? false : require('../../TabViews/img/right-arrow-key.png')}
					showThrobber={this.state.isLoading}
				/>
			</View>
		);
	}

	getStyle(appLayout: Object): Object {
		const { height, width } = appLayout;
		const isPortrait = height > width;
		const padding = isIphoneX() ? (!isPortrait ? width * 0.1585 : width * 0.11) : width * 0.15;

		return {
			textBody: {
				color: '#A59F9A',
				marginTop: 10,
				textAlign: 'left',
				fontSize: isPortrait ? Math.floor(width * 0.042) : Math.floor(height * 0.042),
				paddingLeft: 2,
			},
			textField: {
				height: 50,
				width: width - padding,
				paddingLeft: 35,
				color: '#A59F9A',
				fontSize: isPortrait ? Math.floor(width * 0.06) : Math.floor(height * 0.06),
			},
			locationIcon: {
				position: 'absolute',
				top: 35,
				left: 8,
			},
			buttonStyle: {
				right: isPortrait ? width * 0.053333333 : height * 0.053333333,
				elevation: 10,
			},
		};
	}
}

function mapDispatchToProps(dispatch: Function): Object {
	return {
		dispatch,
	};
}

export default connect(null, mapDispatchToProps)(LocationActivationManual);

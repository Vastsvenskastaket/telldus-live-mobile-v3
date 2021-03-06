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
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { defineMessages, intlShape, injectIntl } from 'react-intl';

import { FormattedMessage, View, DialogueBox, SafeAreaView } from '../../../BaseComponents';
import {FormContainerComponent, RegisterForm} from './SubViews';

import i18n from './../../Translations/common';
const messages = defineMessages({
	createAccount: {
		id: 'user.createAccount',
		defaultMessage: 'Create Account',
		description: 'Header for the create account screen',
	},
	alreadyHaveAccount: {
		id: 'user.alreadyHaveAccount',
		defaultMessage: 'I already have an account',
		description: 'Message to show on the create account screen',
	},
});

type Props = {
	navigation: Object,
	dispatch: Function,
	validationMessage: string,
	showModal: boolean,
	registeredCredential: any,
	intl: intlShape.isRequired,
	validationMessageHeader: string,
	appLayout: Object,
};

class RegisterScreen extends View {

	props: Props;

	goBackToLogin: () => void;
	closeModal: () => void;

	constructor(props: Props) {
		super(props);

		this.goBackToLogin = this.goBackToLogin.bind(this);
		this.closeModal = this.closeModal.bind(this);

		let { formatMessage } = props.intl;

		this.alreadyHaveAccount = formatMessage(messages.alreadyHaveAccount);

		this.labelLink = formatMessage(i18n.labelLink);
		this.labelButtondefaultDescription = formatMessage(i18n.defaultDescriptionButton);

		this.labelAlreadyHaveAccount = `${this.labelLink} ${this.alreadyHaveAccount} ${this.labelButtondefaultDescription}`;
	}

	closeModal() {
		this.props.dispatch({
			type: 'REQUEST_MODAL_CLOSE',
		});
	}

	goBackToLogin() {
		this.closeModal();
		this.props.navigation.navigate('Login');
	}

	componentWillReceiveProps(nextProps: Object) {
		if (nextProps.registeredCredential && nextProps.screenProps.currentScreen !== 'Welcome') {
			nextProps.navigation.navigate('Welcome');
		}
	}

	shouldComponentUpdate(nextProps: Object, nextState: Object): boolean {
		if (nextProps.navigation.state.routeName !== nextProps.screenProps.currentScreen) {
			return false;
		}
		return true;
	}

	render(): Object {
		let { showModal, validationMessage, validationMessageHeader, appLayout } = this.props;
		let styles = this.getStyles(appLayout);

		return (
			<SafeAreaView>
				<FormContainerComponent headerText={this.props.intl.formatMessage(messages.createAccount)} formContainerStyle={styles.formContainer}>
					<RegisterForm appLayout={appLayout} dialogueOpen={this.props.showModal}/>
					<TouchableOpacity style={{height: 25}}
						onPress={this.goBackToLogin}
						accessibilityLabel={this.labelAlreadyHaveAccount}>
						<FormattedMessage {...messages.alreadyHaveAccount} style={styles.accountExist}/>
					</TouchableOpacity>
					<DialogueBox
						showDialogue={showModal}
						text={validationMessage}
						header={validationMessageHeader}
						showPositive={true}
						showNegative={false}
						onPressPositive={this.closeModal}/>
				</FormContainerComponent>
			</SafeAreaView>
		);
	}

	getStyles(appLayout: Object): Object {
		const width = appLayout.width;

		return {
			accountExist: {
				marginTop: 10,
				color: '#bbb',
			},
			formContainer: {
				width: width,
			},
		};
	}
}

function mapDispatchToProps(dispatch: Function): Object {
	return {
		dispatch,
	};
}

function mapStateToProps(store: Object): Object {
	return {
		validationMessage: store.modal.data,
		validationMessageHeader: store.modal.extras,
		showModal: store.modal.openModal,
		registeredCredential: store.user.registeredCredential,
		appLayout: store.App.layout,
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(RegisterScreen));

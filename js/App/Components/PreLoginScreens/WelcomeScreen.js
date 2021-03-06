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
import { defineMessages, intlShape, injectIntl } from 'react-intl';

import { FormattedMessage, View, Text, TouchableButton, SafeAreaView } from '../../../BaseComponents';
import { FormContainerComponent } from './SubViews';

const messages = defineMessages({
	welcomeHeader: {
		id: 'user.welcome',
		defaultMessage: 'Welcome to Telldus',
	},
	welcomeButton: {
		id: 'button.welcome',
		defaultMessage: 'GOT IT',
	},
	accountCreated: {
		id: 'user.accountCreated',
		defaultMessage: 'Your account is created and you will now be logged in.',
	},
	confirmMessage: {
		id: 'user.confirmMessage',
		defaultMessage: 'An email is sent to you with a link to confirm your account. Please confirm your account within 24 hours, otherwise the account will be deleted.',
	},
});

type Props = {
	accessToken: Object,
	onPressOK: Function,
	registeredCredential: any,
	intl: intlShape.isRequired,
	appLayout: Object,
};

class WelcomeScreen extends View {

	props: Props;

	onPressOK: (string) => void;

	constructor(props: Props) {
		super(props);
		this.onPressOK = this.onPressOK.bind(this);
	}

	onPressOK() {
		this.props.onPressOK(this.props.registeredCredential);
	}

	render(): Object {
		let { appLayout } = this.props;
		let styles = this.getStyles(appLayout);

		return (
			<SafeAreaView>
				<FormContainerComponent headerText={this.props.intl.formatMessage(messages.welcomeHeader)} formContainerStyle={styles.formContainer}>
					<Text style={styles.textBody}><FormattedMessage {...messages.accountCreated} style={styles.textBody}/></Text>
					<Text style={styles.textBody}><FormattedMessage {...messages.confirmMessage} style={styles.textBody}/></Text>
					<TouchableButton
						style={{marginTop: 20}}
						onPress={this.onPressOK}
						text={messages.welcomeButton}
					/>
				</FormContainerComponent>
			</SafeAreaView>
		);
	}

	getStyles(appLayout: Object): Object {
		const height = appLayout.height;
		const width = appLayout.width;
		let isPortrait = height > width;

		return {
			textBody: {
				color: '#ffffff80',
				marginTop: 20,
				textAlign: 'center',
				fontSize: isPortrait ? Math.floor(width * 0.04) : Math.floor(height * 0.04),
			},
		};
	}
}

function mapStateToProps(store: Object): Object {
	return {
		registeredCredential: store.user.registeredCredential,
		appLayout: store.App.layout,
	};
}

function mapDispatchToProps(dispatch: Function): Object {
	return {
		onPressOK: (accessToken: string) => {
			dispatch({
				type: 'RECEIVED_ACCESS_TOKEN',
				accessToken,
			});
		},
	};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(injectIntl(WelcomeScreen));

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
import { Linking, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { defineMessages, intlShape, injectIntl } from 'react-intl';
import Hyperlink from 'react-native-hyperlink';

import Theme from 'Theme';
import Banner from './Banner';
import {
	View,
	Text,
	FormattedMessage,
	ScreenContainer,
	StyleSheet,
	Dimensions,
	Image,
	Icon,
	TouchableButton,
} from 'BaseComponents';

const deviceWidth = Dimensions.get('window').width;

const messages = defineMessages({
	banner: {
		id: 'addNewLocation.success.banner',
		defaultMessage: 'Congratulations',
		description: 'Main Banner Text for the add location success Screen',
	},
	bannerSub: {
		id: 'addNewLocation.success.bannerSub',
		defaultMessage: 'Location added successfully',
		description: 'Secondary Banner Text for the add location success Screen',
	},
	messageTitle: {
		id: 'addNewLocation.success.messageTitle',
		defaultMessage: 'Welcome to your smart home',
		description: 'Message Title for the add location success Screen',
	},
	messageBodyParaOne: {
		id: 'addNewLocation.success.messageBodyParaOne',
		defaultMessage: 'You have now taken the first step towards your smart home! ' +
		'Now you can start adding devices, view sensors, schedule devices and events and much more.',
		description: 'Message Body for the add location success Screen Para One',
	},
	messageBodyParaTwo: {
		id: 'addNewLocation.success.messageBodyParaTwo',
		defaultMessage: 'If you want help or would like to learn tips and tricks on how to setup your smart home you ' +
		'can view our guides on',
		description: 'Message Body for the add location success Screen Para two',
	},
	continue: {
		id: 'button.success.continue',
		defaultMessage: 'CONTINUE',
		description: 'Button Text',
	},
});

type Props = {
	intl: intlShape.isRequired,
}

type State = {
}

class Success extends View<void, Props, State> {

	onPressHelp: () => void;
	onPressContinue: () => void;

	constructor(props: Props) {
		super(props);
		this.link = 'http://live.telldus.com/help/guides';
		this.onPressHelp = this.onPressHelp.bind(this);
		this.onPressContinue = this.onPressContinue.bind(this);
	}

	onPressContinue() {
	}

	onPressHelp() {
		let url = this.link;
		Linking.canOpenURL(url).then(supported => {
			if (!supported) {
			  console.log(`Can't handle url: ${url}`);
			} else {
			  return Linking.openURL(url);
			}
		  }).catch(err => console.error('An error occurred', err));
	}

	render() {
		let bannerProps = {
			prefix: '3. ',
			bannerMain: messages.banner,
			bannerSub: messages.bannerSub,
		};
		let BannerComponent = Banner(bannerProps);

		return (
			<ScreenContainer banner={BannerComponent}>
				<ScrollView>
					<View style={[styles.itemsContainer, styles.shadow]}>
						<View style={styles.imageTitleContainer}>
							<Image resizeMode="contain" style={styles.imageLocation} source={{uri: 'icon_location_telldus_center_01', isStatic: true}} />
							<Icon name="check-circle" size={44} style={styles.iconCheck} color={Theme.Core.brandSuccess}/>
							<FormattedMessage {...messages.messageTitle} style={styles.messageTitle} postfix={'!'}/>
						</View>
						<Hyperlink linkDefault={true} linkStyle={{color: '#e26901', fontSize: 14}}>
							<Text>
								<FormattedMessage {...messages.messageBodyParaOne} style={styles.messageBody}/>
								{'\n\n'}
								<FormattedMessage {...messages.messageBodyParaTwo} style={styles.messageBody}/>
								{` ${this.link}`}
							</Text>
						</Hyperlink>
					</View>
					<TouchableButton
						text={this.props.intl.formatMessage(messages.continue)}
						onPress={this.onPressContinue}
						style={styles.button}
					/>
				</ScrollView>
			</ScreenContainer>
		);
	}
}

const styles = StyleSheet.create({
	itemsContainer: {
		flexDirection: 'column',
		backgroundColor: '#fff',
		marginTop: 20,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 20,
		paddingTop: 20,
		alignItems: 'flex-start',
		width: (deviceWidth - 20),
	},
	shadow: {
		borderRadius: 4,
		backgroundColor: '#fff',
		shadowColor: '#000000',
		shadowOffset: {
			width: 0,
			height: 0,
		},
		shadowRadius: 1,
		shadowOpacity: 1.0,
		elevation: 2,
	},
	imageLocation: {
		width: (deviceWidth * 0.3) - 20,
		height: 80,
		alignItems: 'flex-start',
	},
	imageTitleContainer: {
		flexDirection: 'row',
	},
	iconCheck: {
		position: 'absolute',
		left: 40,
	},
	messageTitle: {
		color: '#00000099',
		paddingLeft: 20,
		paddingRight: 10,
		width: (deviceWidth * 0.7) - 20,
		fontSize: 24,
		flexWrap: 'wrap',
	},
	messageBody: {
		color: '#A59F9A',
		fontSize: 14,
	},
	button: {
		alignSelf: 'center',
		marginTop: 20,
		marginBottom: 10,
	},
});

export default connect()(injectIntl(Success));

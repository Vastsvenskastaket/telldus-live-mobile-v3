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
import typeof { Children as Children} from 'react';
import { KeyboardAvoidingView, ScrollView } from 'react-native';

import { BackgroundImage, View, Image, H1 } from '../../../../BaseComponents';
import StyleSheet from 'StyleSheet';

type Props = {
	headerText: string,
	children: Children,
	formContainerStyle?: number | Object,
};

const FormContainerComponent = (props: Props): React$Element<any> => (
	<BackgroundImage source={require('./../img/home5.jpg')} style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
		<ScrollView
			keyboardDismissMode= "interactive">
			<KeyboardAvoidingView behavior="padding" contentContainerStyle={{paddingTop: 20, justifyContent: 'center'}}>
				<View style={{alignItems: 'center', justifyContent: 'center'}}>
					<Image
						source={require('./../img/telldusLogoBlack.png')}
						style={{
							marginTop: 60,
							marginBottom: 60,
						}}
					/>
				</View>
				<View style={[styles.container, props.formContainerStyle]} >
					<H1 style={{
						margin: 10,
						color: '#ffffff80',
						textAlign: 'center',
					}}>
						{props.headerText}
					</H1>
					{props.children}
				</View>
			</KeyboardAvoidingView>
		</ScrollView>
	</BackgroundImage>
);

export default FormContainerComponent;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#00000099',
		padding: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
});


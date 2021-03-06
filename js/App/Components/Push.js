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
 */

'use strict';

const DeviceInfo = require('react-native-device-info');
const PushNotification = require('react-native-push-notification');
import { Alert, Platform } from 'react-native';
import { pushSenderId, pushServiceId } from '../../Config';
import { registerPushToken } from '../Actions/User';

const Push = {
	configure: (store) => {
		PushNotification.configure({

			// Called when Token is generated
			onRegister: function (data) {
				if ((!store.pushToken) || (store.pushToken !== data.token) || (!store.pushTokenRegistered)) {
					// stores fcm token in the server
					store.dispatch(registerPushToken(data.token, DeviceInfo.getDeviceName(), DeviceInfo.getModel(), DeviceInfo.getManufacturer(), DeviceInfo.getSystemVersion(), DeviceInfo.getUniqueID(), pushServiceId));
					store.dispatch({ type: 'RECEIVED_PUSH_TOKEN', pushToken: data.token });
				}
			},

			// Called when a remote or local notification is opened or received
			onNotification: function (notification) {
				if (notification.foreground && !notification.userInteraction) {
					Push.createLocalNotification(notification);
				}
			},

			// GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
			senderID: pushSenderId,

			// Should the initial notification be popped automatically
			// default: true
			popInitialNotification: true,

			/**
				* (optional) default: true
				* - Specified if permissions (ios) and token (android and ios) will requested or not,
				* - if not, you must call PushNotificationsHandler.requestPermissions() later
				*/
			requestPermissions: true,
		});
	},
	createLocalNotification: (data) => {
		if (Platform.OS === 'ios') {
			// On iOS, if the app is in foreground the local notification is not shown.
			// We use normal alert instead
			Alert.alert('Telldus Live!', data.message);
		} else {
			PushNotification.localNotification({
				id: data.id, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
				autoCancel: true, // (optional) default: true
				largeIcon: 'ic_launcher', // (optional) default: "ic_launcher"
				smallIcon: 'ic_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher"

				title: 'Telldus Live!', // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
				message: data.message, // (required)
				playSound: true, // (optional) default: true
				soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
			});
		}
	},
};

module.exports = Push;

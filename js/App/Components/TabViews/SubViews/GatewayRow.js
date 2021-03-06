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

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';

import { View, Image } from '../../../../BaseComponents';
import DeviceLocationDetail from '../../DeviceDetails/SubViews/DeviceLocationDetail';

import getLocationImageUrl from '../../../Lib/getLocationImageUrl';
import Status from './Gateway/Status';

type Props = {
    location: Object,
    stackNavigator: Object,
	appLayout: Object,
	intl: Object,
};

type State = {
};

class GatewayRow extends PureComponent<Props, State> {
	props: Props;
	state: State;

	onPressGateway: () => void;

	constructor(props: Props) {
		super(props);

		this.onPressGateway = this.onPressGateway.bind(this);
	}

	onPressGateway() {
		let { location } = this.props;
		this.props.stackNavigator.navigate('LocationDetails', {location, renderRootHeader: true});
	}

	getLocationStatus(online: boolean, websocketOnline: boolean): Object {
		return (
			<Status online={online} websocketOnline={websocketOnline} intl={this.props.intl} />
		);
	}


	render(): Object {
		let { location, appLayout } = this.props;
		let { name, type, online, websocketOnline } = location;
		let { height, width } = appLayout;
		let isPortrait = height > width;
		let rowWidth = isIphoneX() ? (isPortrait ? width - 20 : width - 125 ) : width - 20;
		let rowHeight = isPortrait ? height * 0.13 : width * 0.13;

		let info = this.getLocationStatus(online, websocketOnline);

		let locationImageUrl = getLocationImageUrl(type);
		let locationData = {
			image: locationImageUrl,
			H1: name,
			H2: type,
			info,
		};

		let styles = this.getStyles(appLayout);

		return (
			<View style={styles.rowItemsCover}>
				<Image source={require('../../TabViews/img/right-arrow-key.png')} tintColor="#A59F9A90" style={styles.arrow}/>
				<DeviceLocationDetail {...locationData}
					style={{
						width: rowWidth,
						height: rowHeight,
						marginVertical: 5,
					}}
					onPress={this.onPressGateway}/>
			</View>
		);
	}

	getStyles(appLayout: Object): Object {
		return {
			rowItemsCover: {
				flexDirection: 'column',
				alignItems: 'center',
			},
			arrow: {
				position: 'absolute',
				zIndex: 1,
				tintColor: '#A59F9A90',
				right: 25,
				top: '40%',
				height: 28,
				width: 12,
			},
		};
	}
}

function mapStateToProps(state: Object, props: Object): Object {
	return {
		appLayout: state.App.layout,
	};
}

export default connect(mapStateToProps, null)(GatewayRow);

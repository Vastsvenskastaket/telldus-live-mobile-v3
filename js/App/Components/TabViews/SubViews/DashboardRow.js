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

import { View } from '../../../../BaseComponents';
import ShowMoreButton from './Device/ShowMoreButton';
import MultiActionModal from './Device/MultiActionModal';
import DashboardShadowTile from './DashboardShadowTile';
import DimmerDashboardTile from './DimmerDashboardTile';
import NavigationalDashboardTile from './NavigationalDashboardTile';
import BellDashboardTile from './BellDashboardTile';
import ToggleDashboardTile from './ToggleDashboardTile';

import { getLabelDevice, getPowerConsumed } from '../../../Lib';
import Theme from '../../../Theme';
import i18n from '../../../Translations/common';

type Props = {
    item: Object,
    tileWidth: number,
    intl: Object,
    powerConsumed?: number,
    appLayout: Object,
    setScrollEnabled: (boolean) => void,
    isGatewayActive: boolean,
    style: Object,
};

type State = {
    showMoreActions: boolean,
};

class DashboardRow extends View {

props: Props;
state: State;

onPressMore: () => void;
closeMoreActions: () => void;
getButtonsInfo: (item: Object, styles: Object) => Object;

state: State = {
	showMoreActions: false,
};

constructor(props: Props) {
	super(props);

	this.onPressMore = this.onPressMore.bind(this);
	this.closeMoreActions = this.closeMoreActions.bind(this);
}

getButtonsInfo(item: Object, styles: Object): Object {
	let { supportedMethods, isInState } = item, buttons = [], buttonsInfo = [];
	let { tileWidth, setScrollEnabled, isGatewayActive } = this.props;
	const {
		TURNON,
		TURNOFF,
		BELL,
		DIM,
		UP,
		DOWN,
		STOP,
	} = supportedMethods;

	if (BELL) {
		const iconContainerStyle = !isGatewayActive ? styles.itemIconContainerOffline : styles.itemIconContainerOn;

		buttons.unshift(<BellDashboardTile key={4} {...this.props} containerStyle={[styles.buttonsContainerStyle, {width: tileWidth}]}/>);
		buttonsInfo.unshift({
			iconContainerStyle: iconContainerStyle,
			iconsName: 'bell',
		});
	}

	if (UP || DOWN || STOP) {
		const showStopButton = !TURNON && !TURNOFF && !BELL && !DIM;
		const width = showStopButton ? tileWidth : tileWidth * (2 / 3);
		const iconContainerStyle = !isGatewayActive ? styles.itemIconContainerOffline :
			(isInState === 'STOP' ? styles.itemIconContainerOff : styles.itemIconContainerOn);

		buttons.unshift(<NavigationalDashboardTile key={1} {...this.props} containerStyle={[styles.buttonsContainerStyle, {width}]}
			showStopButton={showStopButton}/>);
		buttonsInfo.unshift({
			iconContainerStyle: iconContainerStyle,
			iconsName: 'curtain',
		});
	}

	if (DIM) {
		const showSlider = !BELL && !UP && !DOWN && !STOP;
		const width = showSlider ? tileWidth : tileWidth * (2 / 3);
		const iconContainerStyle = !isGatewayActive ? styles.itemIconContainerOffline :
			(isInState === 'TURNOFF' ? styles.itemIconContainerOff : styles.itemIconContainerOn);

		buttons.unshift(<DimmerDashboardTile key={2} {...this.props} containerStyle={[styles.buttonsContainerStyle, {width}]}
			showSlider={showSlider} setScrollEnabled={setScrollEnabled}/>);
		buttonsInfo.unshift({
			iconContainerStyle: iconContainerStyle,
			iconsName: 'device-alt',
		});
	}

	if ((TURNON || TURNOFF) && !DIM) {
		const showMoreButtons = BELL || UP || DOWN || STOP;
		const width = !showMoreButtons ? tileWidth : tileWidth * (2 / 3);
		const iconContainerStyle = !isGatewayActive ? styles.itemIconContainerOffline :
			(isInState === 'TURNOFF' ? styles.itemIconContainerOff : styles.itemIconContainerOn);

		buttons.unshift(<ToggleDashboardTile key={3} {...this.props} containerStyle={[styles.buttonsContainerStyle, {width}]}/>);
		buttonsInfo.unshift({
			iconContainerStyle: iconContainerStyle,
			iconsName: 'device-alt',
		});
	}

	if (!TURNON && !TURNOFF && !BELL && !DIM && !UP && !DOWN && !STOP) {
		const iconContainerStyle = !isGatewayActive ? styles.itemIconContainerOffline :
			(isInState === 'TURNOFF' ? styles.itemIconContainerOff : styles.itemIconContainerOn);

		buttons.unshift(<ToggleDashboardTile key={5} {...this.props} containerStyle={[styles.buttonsContainerStyle, {width: tileWidth}]}/>);
		buttonsInfo.unshift({
			iconContainerStyle: iconContainerStyle,
			iconsName: 'device-alt',
		});
	}

	return { buttons, buttonsInfo };
}

render(): Object {
	const { item, tileWidth, intl, powerConsumed, appLayout } = this.props;
	const { showMoreActions } = this.state;
	const { name, isInState } = item;
	const deviceName = name ? name : intl.formatMessage(i18n.noName);

	const info = powerConsumed ? `${intl.formatNumber(powerConsumed, {maximumFractionDigits: 1})} W` : null;
	const styles = this.getStyles(appLayout, tileWidth);
	const { buttons, buttonsInfo } = this.getButtonsInfo(item, styles);
	const { iconContainerStyle, iconsName } = buttonsInfo[0];
	const accessibilityLabel = getLabelDevice(intl.formatMessage, item);

	return (
		<DashboardShadowTile
			isEnabled={isInState === 'TURNON' || isInState === 'DIM'}
			name={deviceName}
			info={info}
			icon={iconsName}
			iconStyle={{
				color: '#fff',
				fontSize: tileWidth / 5.2,
			}}
			iconContainerStyle={[iconContainerStyle, {
				width: tileWidth / 4.8,
				height: tileWidth / 4.8,
				borderRadius: tileWidth / 9.6,
				alignItems: 'center',
				justifyContent: 'center',
			}]}
			type={'device'}
			tileWidth={tileWidth}
			accessibilityLabel={accessibilityLabel}
			formatMessage={intl.formatMessage}
			style={[this.props.style, { width: tileWidth, height: tileWidth }]}>
			<View style={[styles.buttonsContainerStyle, {width: tileWidth}]}>
				{buttons.length === 1 ?
					buttons[0]
					:
					[
						buttons[0],
						<ShowMoreButton onPress={this.onPressMore} style={styles.moreButtonStyle} dotStyle={styles.dotStyle} name={name} buttons={buttons} key={6} intl={intl}/>,
					]
				}
			</View>
			{
				buttons.length !== 1 && (
					<MultiActionModal
						showModal={showMoreActions}
						buttons={buttons}
						name={deviceName}
						closeModal={this.closeMoreActions}
					/>
				)}
		</DashboardShadowTile>
	);
}

onPressMore() {
	this.setState({
		showMoreActions: true,
	});
}

closeMoreActions() {
	this.setState({
		showMoreActions: false,
	});
}

getStyles(appLayout: Object, tileWidth: number): Object {
	return {
		buttonsContainerStyle: {
			height: tileWidth * 0.4,
			flexDirection: 'row',
			justifyContent: 'center',
		},
		moreButtonStyle: {
			width: tileWidth / 3,
			height: tileWidth * 0.4,
			backgroundColor: '#eeeeee',
		},
		dotStyle: {
			width: tileWidth * 0.05,
			height: tileWidth * 0.05,
			borderRadius: tileWidth * 0.025,
		},
		itemIconContainerOn: {
			backgroundColor: Theme.Core.brandSecondary,
		},
		itemIconContainerOff: {
			backgroundColor: Theme.Core.brandPrimary,
		},
		itemIconContainerOffline: {
			backgroundColor: Theme.Core.offlineColor,
		},
	};
}
}

function mapStateToProps(store: Object, ownProps: Object): Object {
	let powerConsumed = getPowerConsumed(store.sensors.byId, ownProps.item.clientDeviceId);
	return {
		appLayout: store.App.layout,
		powerConsumed,
	};
}

module.exports = connect(mapStateToProps, null)(DashboardRow);

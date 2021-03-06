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

// @flow

'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { defineMessages } from 'react-intl';
import { intlShape, injectIntl } from 'react-intl';
import { announceForAccessibility } from 'react-native-accessibility';

import { View, Header } from '../../../BaseComponents';

import DrawerLayoutAndroid from 'DrawerLayoutAndroid';

import { SettingsDetailModal } from '../DetailViews';
import TabBar from './TabBar';
import i18n from '../../Translations/common';
import { getUserProfile } from '../../Reducers/User';
import { syncWithServer, switchTab, addNewGateway, showToast } from '../../Actions';
import TabViews from './index';
import { TabNavigator } from 'react-navigation';
import Drawer from '../Drawer/Drawer';
import { getDrawerWidth } from '../../Lib';

const messages = defineMessages({
	menuIcon: {
		id: 'accessibilityLabel.menuIcon',
		defaultMessage: 'Menu',
	},
	messageCloseMenu: {
		id: 'accessibilityLabel.messageCloseMenu',
		defaultMessage: 'swipe left, using three fingers to close',
	},
	starIconShowDevices: {
		id: 'accessibilityLabel.starIconShowDevices',
		defaultMessage: 'Show, add to dashboard marker, for all devices',
	},
	starIconHideDevices: {
		id: 'accessibilityLabel.starIconHideDevices',
		defaultMessage: 'Hide, add to dashboard marker, for all devices',
	},
	starIconShowSensors: {
		id: 'accessibilityLabel.starIconShowSensors',
		defaultMessage: 'Show, add to dashboard marker, for all sensors',
	},
	starIconHideSensors: {
		id: 'accessibilityLabel.starIconHideSensors',
		defaultMessage: 'Hide, add to dashboard marker, for all sensors',
	},
});

const RouteConfigs = {
	Dashboard: {
		screen: TabViews.Dashboard,
	},
	Devices: {
		screen: TabViews.Devices,
	},
	Sensors: {
		screen: TabViews.Sensors,
	},
	Scheduler: {
		screen: TabViews.Scheduler,
	},
};

const TabNavigatorConfig = {
	initialRouteName: 'Dashboard',
	swipeEnabled: false,
	lazy: true,
	animationEnabled: true,
	tabBarComponent: TabBar,
	tabBarPosition: 'top',
	tabBarOptions: {
		activeTintColor: '#fff',
		indicatorStyle: {
			backgroundColor: '#fff',
		},
		scrollEnabled: true,
	},
};

const Tabs = TabNavigator(RouteConfigs, TabNavigatorConfig);

type Props = {
	intl: intlShape.isRequired,
	dashboard: Object,
	tab: string,
	userProfile: Object,
	isAppActive: boolean,
	gateways: Object,
	syncGateways: () => void,
	onTabSelect: (string) => void,
	dispatch: Function,
	stackNavigator: Object,
	addNewLocation: () => void,
	screenReaderEnabled: boolean,
};

type State = {
	settings: boolean,
	starIcon: Object,
};

class TabsView extends View {
	props: Props;
	state: State;

	renderNavigationView: () => Object;
	onOpenSetting: () => void;
	onCloseSetting: () => void;
	onTabSelect: (string) => void;
	onRequestChangeTab: (number) => void;
	openDrawer: () => void;
	onNavigationStateChange: (Object, Object) => void;
	addNewLocation: () => void;
	onPressGateway: (Object) => void;

	constructor(props: Props) {
		super(props);

		let { formatMessage } = props.intl;

		this.labelButton = formatMessage(i18n.button);
		this.labelButtondefaultDescription = formatMessage(i18n.defaultDescriptionButton);

		this.menuIcon = `${formatMessage(messages.menuIcon)} ${this.labelButton}. ${this.labelButtondefaultDescription}`;
		this.starIconShowDevices = `${formatMessage(messages.starIconShowDevices)}. ${this.labelButtondefaultDescription}`;
		this.starIconHideDevices = `${formatMessage(messages.starIconHideDevices)}. ${this.labelButtondefaultDescription}`;
		this.starIconShowSensors = `${formatMessage(messages.starIconShowSensors)}. ${this.labelButtondefaultDescription}`;
		this.starIconHideSensors = `${formatMessage(messages.starIconHideSensors)}. ${this.labelButtondefaultDescription}`;
		this.messageCloseMenu = `${formatMessage(messages.messageCloseMenu)}`;

		this.networkFailed = `${formatMessage(i18n.networkFailed)}.`;
		this.addNewLocationFailed = `${formatMessage(i18n.addNewLocationFailed)}`;

		this.menuButton = {
			icon: {
				name: 'bars',
				size: 22,
				color: '#fff',
				style: null,
				iconStyle: null,
			},
			onPress: this.openDrawer,
			accessibilityLabel: '',
		};

		this.state = {
			drawer: false,
			settings: false,
			routeName: 'Dashboard',
			addingNewLocation: false,
		};

		this.renderNavigationView = this.renderNavigationView.bind(this);
		this.onOpenSetting = this.onOpenSetting.bind(this);
		this.onCloseSetting = this.onCloseSetting.bind(this);
		this.onCloseDrawer = this.onCloseDrawer.bind(this);
		this.onOpenDrawer = this.onOpenDrawer.bind(this);
		this.onTabSelect = this.onTabSelect.bind(this);
		this.onRequestChangeTab = this.onRequestChangeTab.bind(this);
		this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
		this.addNewLocation = this.addNewLocation.bind(this);
		this.onPressGateway = this.onPressGateway.bind(this);
	}

	componentWillReceiveProps(nextProps: Object) {
		if (nextProps.gateways.allIds.length === 0 && !this.state.addingNewLocation && nextProps.gateways.toActivate.checkIfGatewaysEmpty) {
			this.addNewLocation();
		}
	}

	shouldComponentUpdate(nextProps: Object, nextState: Object): boolean {
		return nextProps.screenProps.currentScreen === 'Tabs';
	}

	addNewLocation() {
		this.props.addNewLocation()
			.then((response: Object) => {
				if (response.client) {
					this.props.stackNavigator.navigate('AddLocation', {clients: response.client, renderRootHeader: true});
					this.setState({
						addingNewLocation: true,
					});
				}
			}).catch((error: Object) => {
				let message = error.message && error.message === 'Network request failed' ? this.networkFailed : this.addNewLocationFailed;
				this.props.dispatch(showToast(message));
			});
	}

	onTabSelect(tab: string) {
		if (this.props.tab !== tab) {
			this.props.onTabSelect(tab);
			if (this.refs.drawer) {
				this.refs.drawer.closeDrawer();
			}
		}
	}

	onOpenSetting() {
		this.setState({ settings: true });
	}

	onCloseSetting() {
		this.setState({ settings: false });
	}

	onOpenDrawer() {
		this.setState({ drawer: true });
		if (this.props.screenReaderEnabled) {
			announceForAccessibility(this.messageCloseMenu);
		}
	}

	onCloseDrawer() {
		this.setState({ drawer: false });
	}

	onPressGateway(location: Object) {
		this.props.stackNavigator.navigate('LocationDetails', {location, renderRootHeader: true});
	}

	onRequestChangeTab(index: number) {
		this.setState({ index });
		const tabNames = ['dashboardTab', 'devicesTab', 'sensorsTab', 'schedulerTab'];
		this.onTabSelect(tabNames[index]);
	}

	onNavigationStateChange(prevState: Object, currentState: Object) {
		const index = currentState.index;

		this.setState({ routeName: currentState.routes[index].routeName });
		this.onRequestChangeTab(index);
	}

	openDrawer = () => {
		this.refs.drawer.openDrawer();
		this.props.syncGateways();
	};

	renderNavigationView(): Object {
		let { appLayout } = this.props;

		return <Drawer
			gateways={this.props.gateways}
			addNewLocation={this.addNewLocation}
			userProfile={this.props.userProfile}
			theme={this.getTheme()}
			onOpenSetting={this.onOpenSetting}
			appLayout={appLayout}
			isOpen={this.state.drawer}
			onPressGateway={this.onPressGateway}
		/>;
	}

	makeLeftButton = (styles: Object): any => {
		this.menuButton.icon.style = styles.menuButtonStyle;
		this.menuButton.icon.iconStyle = styles.menuIconStyle;
		this.menuButton.icon.size = styles.buttonSize > 22 ? styles.buttonSize : 22;
		this.menuButton.accessibilityLabel = this.menuIcon;

		return this.state.drawer ? null : this.menuButton;
	};

	render(): Object {
		let { appLayout, stackNavigator } = this.props;
		let { routeName } = this.state;
		let { currentScreen } = this.props.screenProps;
		let isPortrait = appLayout.height > appLayout.width;
		let deviceWidth = isPortrait ? appLayout.width : appLayout.height;
		let styles = this.getStyles(appLayout);

		let screenProps = {
			stackNavigator,
			currentTab: routeName,
			currentScreen,
		};

		const leftButton = this.makeLeftButton(styles);
		const drawerWidth = getDrawerWidth(deviceWidth);

		// TODO: Refactor: Split this code to smaller components
		return (
			<DrawerLayoutAndroid
				ref="drawer"
				drawerWidth={drawerWidth}
				drawerPosition={DrawerLayoutAndroid.positions.Left}
				renderNavigationView={this.renderNavigationView}
				drawerBackgroundColor={'transparent'}
				onDrawerOpen={this.onOpenDrawer}
				onDrawerClose={this.onCloseDrawer}
			>
				<View style={{flex: 1}} >
					<Header style={styles.header} logoStyle={styles.logoStyle} leftButton={leftButton}/>
					<View style={styles.container}>
						<Tabs screenProps={{...screenProps, intl: this.props.intl}} onNavigationStateChange={this.onNavigationStateChange}/>
						{
							this.state.settings ? (
								<SettingsDetailModal isVisible={true} onClose={this.onCloseSetting}/>
							) : null
						}
					</View>
				</View>
			</DrawerLayoutAndroid>
		);
	}

	getStyles(appLayout: Object): Object {
		const height = appLayout.height;
		const width = appLayout.width;
		let isPortrait = height > width;
		let deviceHeight = isPortrait ? height : width;

		return {
			header: isPortrait ? {
				height: deviceHeight * 0.05,
				alignItems: 'flex-end',
			} : {
				transform: [{rotateZ: '-90deg'}],
				position: 'absolute',
				left: -deviceHeight * 0.4444,
				top: deviceHeight * 0.4444,
				width: deviceHeight,
				height: deviceHeight * 0.1111,
			},
			container: {
				flex: 1,
				marginLeft: isPortrait ? 0 : deviceHeight * 0.11,
			},
			buttonSize: isPortrait ? Math.floor(width * 0.04) : Math.floor(height * 0.04),
			menuButtonStyle: isPortrait ? null : {
				position: 'absolute',
				left: undefined,
				right: 50,
				top: deviceHeight * 0.03666,
				paddingTop: 0,
				paddingHorizontal: 0,
			},
			starButtonStyle: isPortrait ? null : {
				position: 'absolute',
				right: height - 50,
				top: deviceHeight * 0.03666,
				paddingTop: 0,
				paddingHorizontal: 0,
			},
			menuIconStyle: isPortrait ? null : {
				transform: [{rotateZ: '90deg'}],
			},
			logoStyle: isPortrait ? null : {
				position: 'absolute',
				left: deviceHeight * 0.6255,
				top: deviceHeight * 0.0400,
			},
		};
	}
}

function mapStateToProps(store: Object, ownprops: Object): Object {
	return {
		stackNavigator: ownprops.navigation,
		tab: store.navigation.tab,
		userProfile: getUserProfile(store),
		dashboard: store.dashboard,
		gateways: store.gateways,
		isAppActive: store.App.active,
		appLayout: store.App.layout,
		screenReaderEnabled: store.App.screenReaderEnabled,
		editModeDevicesTab: store.tabs.editModeDevicesTab,
		editModeSensorsTab: store.tabs.editModeSensorsTab,
	};
}

function mapDispatchToProps(dispatch: Function): Object {
	return {
		syncGateways: () => {
			dispatch(syncWithServer('gatewaysTab'));
		},
		onTabSelect: (tab: string) => {
			dispatch(syncWithServer(tab));
			dispatch(switchTab(tab));
		},
		addNewLocation: (): Function => {
			return dispatch(addNewGateway());
		},
		dispatch,
	};
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(injectIntl(TabsView));

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
import PropTypes from 'prop-types';
import { BackHandler, ScrollView, KeyboardAvoidingView } from 'react-native';
import { intlShape, injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { View, DialogueBox, Text, BlockIcon } from '../../../../BaseComponents';
import LocationPoster from '../Common/LocationPoster';

import * as modalActions from '../../../Actions/Modal';
import * as gatewayActions from '../../../Actions/Gateways';
import * as appDataActions from '../../../Actions/AppData';

import { messages as commonMessages } from '../Common/messages';
import i18n from '../../../Translations/common';
import Theme from '../../../Theme';

type Props = {
	navigation: Object,
	children: Object,
	actions?: Object,
	screenProps: Object,
	intl: intlShape.isRequired,
	showModal: boolean,
	validationMessage: any,
	appLayout: Object,
};

type State = {
	h1: string,
	h2: string,
	infoButton: null | Object,
	loading: boolean,
};

export interface ScheduleProps {
	navigation: Object,
	actions: Object,
	onDidMount: (h1: string, h2: string, infoButton: ?Object) => void,
}

const CustomPosterHeader = ({name, styles}: Object): Object => {
	return (
		<View style={styles.posterCover}>
			<BlockIcon icon={'location'} style={styles.posterIcon} containerStyle={styles.posterIconContainer}/>
			<Text style={styles.posterText}>
				{name}
			</Text>
		</View>
	);
};

class LocationDetailsContainer extends View<null, Props, State> {

	handleBackPress: () => void;
	onConfirmRemoveLocation: () => void;
	closeModal: () => void;

	static propTypes = {
		navigation: PropTypes.object.isRequired,
		children: PropTypes.object.isRequired,
		actions: PropTypes.objectOf(PropTypes.func),
		screenProps: PropTypes.object,
		showModal: PropTypes.bool,
		validationMessage: PropTypes.any,
	};

	state = {
		h1: '',
		h2: '',
		infoButton: null,
	};

	constructor(props: Props) {
		super(props);

		this.backButton = {
			back: true,
			onPress: this.goBack,
		};

		let { formatMessage } = props.intl;
		this.labelDelete = formatMessage(i18n.delete).toUpperCase();
		this.labelModalheaderOnDel = `${formatMessage(i18n.delete)} ${formatMessage(i18n.location)}?`;
		this.onRemoveLocationError = `${formatMessage(commonMessages.failureRemoveLocation)}, ${formatMessage(i18n.please).toLowerCase()} ${formatMessage(i18n.tryAgain)}.`;

		this.closeModal = this.closeModal.bind(this);
		this.handleBackPress = this.handleBackPress.bind(this);
		this.onConfirmRemoveLocation = this.onConfirmRemoveLocation.bind(this);
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress(): boolean {
		let {navigation, screenProps} = this.props;
		if (screenProps.currentScreen === 'Details') {
			screenProps.rootNavigator.goBack();
			return true;
		}
		navigation.dispatch({ type: 'Navigation/BACK'});
		return true;
	}


	shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
		const isStateEqual = _.isEqual(this.state, nextState);
		const isPropsEqual = _.isEqual(this.props, nextProps);
		return !(isStateEqual && isPropsEqual);
	}

	onChildDidMount = (h1: string, h2: string, infoButton?: Object | null = null) => {
		this.setState({
			h1,
			h2,
			infoButton,
		});
	};

	closeModal = () => {
		this.props.actions.hideModal();
	};

	onConfirmRemoveLocation() {
		let { actions, screenProps } = this.props;
		let { location } = screenProps.rootNavigator.state.params;
		this.closeModal();
		actions.removeGateway(location.id).then((res: Object) => {
			actions.getAppData();
			actions.getGateways();
			screenProps.rootNavigator.goBack();
		}).catch(() => {
			actions.showModal(this.onRemoveLocationError);
		});
	}

	getModalData(extras: any): Object {
		if (extras === 'DELETE_LOCATION') {
			return {
				modalHeader: this.labelModalheaderOnDel,
				positiveText: this.labelDelete,
				showNegative: true,
				onPressPositive: this.onConfirmRemoveLocation,
				onPressNegative: this.closeModal,
			};
		}
		return {
			modalHeader: null,
			positiveText: null,
			showNegative: false,
			onPressPositive: this.closeModal,
			onPressNegative: null,
		};
	}

	render(): Object {
		const { children, navigation, actions, screenProps, intl,
			showModal, appLayout, validationMessage, modalExtras } = this.props;
		const { h1, h2, infoButton } = this.state;
		const styles = this.getStyle(appLayout);
		const { modalHeader, positiveText, showNegative, onPressPositive, onPressNegative } = this.getModalData(modalExtras);
		const { params } = screenProps.rootNavigator.state;

		let { width, height } = appLayout;
		let deviceWidth = height > width ? width : height;
		let padding = screenProps.currentScreen === 'Details' ? width * 0.027777 : deviceWidth * 0.027777;
		let paddingHorizontal = screenProps.currentScreen === 'EditTimeZoneCity' || screenProps.currentScreen === 'EditTimeZoneContinent' ? 0 : padding;
		let showPosterHeader = screenProps.currentScreen === 'Details' ? false : true;
		let customPosterHeader = screenProps.currentScreen === 'Details' ? <CustomPosterHeader {...params.location} styles={styles}/> : null;

		return (
			<View>
				<View style={{
					flex: 1,
					opacity: 1,
					alignItems: 'center',
				}}>

					<ScrollView style={{flex: 1}} keyboardShouldPersistTaps={'always'} contentContainerStyle={{flexGrow: 1}}>
						<KeyboardAvoidingView behavior="padding" style={{flex: 1}} contentContainerStyle={{ justifyContent: 'center'}}>
							<LocationPoster h1={h1} h2={h2} infoButton={infoButton}
								screenProps={screenProps} intl={intl} navigation={navigation}
								showHeader={showPosterHeader} customHeader={customPosterHeader}/>
							<View style={[styles.style, {paddingHorizontal}]}>
								{React.cloneElement(
									children,
									{
										onDidMount: this.onChildDidMount,
										navigation,
										actions,
										intl,
										...screenProps,
										dialogueOpen: showModal,
										containerWidth: width - (2 * paddingHorizontal),
									},
								)}
							</View>
						</KeyboardAvoidingView>
					</ScrollView>
					<DialogueBox
						dialogueContainerStyle={{elevation: 0}}
						header={modalHeader}
						showDialogue={showModal}
						text={validationMessage}
						showPositive={true}
						showNegative={showNegative}
						positiveText={positiveText}
						onPressPositive={onPressPositive}
						onPressNegative={onPressNegative}/>
				</View>
			</View>
		);
	}

	getStyle(appLayout: Object): Object {
		const { height, width } = appLayout;
		const isPortrait = height > width;
		const posterHeight = isPortrait ? width * 0.333333333 : height * 0.333333333;

		return {
			style: {
				flex: 1,
				// alignItems: 'center',
				// justifyContent: 'center',
			},
			infoButtonContainer: {
				position: 'relative',
				right: 0,
				bottom: 0,
			},
			posterCover: {
				flex: 1,
				position: 'absolute',
				alignItems: 'center',
				justifyContent: 'center',
				left: 0,
				top: 0,
				bottom: 0,
				right: 0,
			},
			posterText: {
				fontSize: 14,
				color: '#fff',
				marginTop: 5,
			},
			posterIconContainer: {
				backgroundColor: '#fff',
				height: posterHeight * 0.5,
				width: posterHeight * 0.5,
				borderRadius: posterHeight * 0.25,
				alignItems: 'center',
				justifyContent: 'center',
			},
			posterIcon: {
				fontSize: posterHeight * 0.35,
				color: Theme.Core.brandSecondary,
			},
		};
	}
}

const mapStateToProps = (store: Object): Object => (
	{
		showModal: store.modal.openModal,
		validationMessage: store.modal.data,
		modalExtras: store.modal.extras,
		appLayout: store.App.layout,
	}
);

const mapDispatchToProps = (dispatch: Function): Object => (
	{
		actions: {
			...bindActionCreators({...modalActions, ...gatewayActions, ...appDataActions}, dispatch),
		},
	}
);

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(LocationDetailsContainer));

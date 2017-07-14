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

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import _ from 'lodash';
import { Header, Text, View } from 'BaseComponents';
import Poster from './SubViews/Poster';

import * as scheduleActions from 'Actions_Schedule';
import { getDevices } from 'Actions_Devices';

type Props = {
	navigation: Object,
	children: Object,
	reset?: Function,
	schedule?: Object,
};

type State = {
	h1: string,
	h2: string,
	infoButton: null | Object,
};

export interface ScheduleProps {
	navigation: Object;
	actions: Object;
	onDidMount: (h1: string, h2: string, infoButton: ?Object) => void;
}

class ScheduleScreen extends View<null, Props, State> {

	static propTypes = {
		navigation: PropTypes.object.isRequired,
		children: PropTypes.object.isRequired,
		reset: PropTypes.func,
		schedule: PropTypes.object,
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
	}

	shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
		const isStateEqual = _.isEqual(this.state, nextState);
		const isPropsEqual = _.isEqual(this.props, nextProps);
		return !(isStateEqual && isPropsEqual);
	}

	goBack = () => {
		const { navigation, actions } = this.props;

		if (this._isDeviceTab()) {
			actions.reset();
		}

		navigation.goBack(null);
	};

	onChildDidMount = (h1: string, h2: string, infoButton?: Object | null = null): void => {
		this.setState({
			h1,
			h2,
			infoButton
		});
	};

	render() {
		const { children, navigation, actions } = this.props;
		const { h1, h2, infoButton } = this.state;
		const style = this._getStyle();
		console.log(this.props.schedule);

		return (
			<View>
				<Header leftButton={this.backButton}/>
				<Poster h1={h1} h2={h2} infoButton={infoButton}/>
				<View style={style}>
					{React.cloneElement(
						children,
						{
							onDidMount: this.onChildDidMount,
							navigation,
							actions,
							reset: this._isDeviceTab() ? this.goBack : null,
							paddingRight: style.paddingHorizontal,
						}
					)}
				</View>
			</View>
		);
	}

	_getStyle = (): Object => {
		const deviceWidth = this._getDeviceWidth();
		const padding = deviceWidth * 0.033333333;

		return {
			flex: 1,
			paddingHorizontal: padding,
			paddingTop: padding,
		};
	};

	_getDeviceWidth = (): number => {
		return Dimensions.get('window').width;
	};

	_isDeviceTab = (): boolean => {
		return this.props.navigation.state.routeName === 'Device';
	};

}

const mapStateToProps = ({ schedule }) => ({
	schedule,
});

const mapDispatchToProps = dispatch => ({
	actions: {
		...bindActionCreators(scheduleActions, dispatch),
		getDevices: () => dispatch(getDevices()),
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen);

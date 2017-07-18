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
import { connect } from 'react-redux';
import { List, ListDataSource, View } from 'BaseComponents';
import { ScheduleProps } from './ScheduleScreen';
import Row from './SubViews/Row';
import Title from './SubViews/Title';
import Description from './SubViews/Description';
import TextRowWrapper from './SubViews/TextRowWrapper';
import BlockIcon from './SubViews/BlockIcon';

interface Props extends ScheduleProps {
	devices: Object,
	reset: () => void,
}

type State = {
	dataSource: Object,
};

class Device extends View<void, Props, State> {

	static propTypes = {
		navigation: PropTypes.object,
		actions: PropTypes.object,
		devices: PropTypes.object,
		onDidMount: PropTypes.func,
		reset: PropTypes.func,
	};

	state = {
		dataSource: new ListDataSource({
			rowHasChanged: (r1: Object, r2: Object): boolean => r1 !== r2,
		}).cloneWithRows(this.props.devices.byId),
	};

	constructor(props: Props) {
		super(props);

		this.h1 = '1. Device';
		this.h2 = 'Choose a device';
	}

	componentDidMount() {
		const { actions, onDidMount, navigation, reset } = this.props;

		if (navigation.state.params && navigation.state.params.reset) {
			return reset();
		}

		actions.getDevices();
		onDidMount(this.h1, this.h2);
	}

	onRefresh = () => {
		this.props.actions.getDevices();
	};

	selectDevice = (row: Object) => {
		const { actions, navigation } = this.props;
		actions.selectDevice(row.id);
		navigation.navigate('Action');
	};

	render() {
		return (
			<List
				dataSource={this.state.dataSource}
				renderRow={this._renderRow}
				onRefresh={this.onRefresh}
			/>
		);
	}

	_renderRow = (row: Object): Object => {
		return (
			<Row onPress={this.selectDevice} layout="row">
				<BlockIcon icon="device-alt" size={56}/>
				<TextRowWrapper>
					<Title>{row.name}</Title>
					<Description>Fibaro Plug 2</Description>
				</TextRowWrapper>
			</Row>
		);
	};

}

type mapStateToPropsType = {
	devices: Object,
};

const mapStateToProps = ({ devices }: mapStateToPropsType): Object => (
	{
		devices,
	}
);

export default connect(mapStateToProps)(Device);

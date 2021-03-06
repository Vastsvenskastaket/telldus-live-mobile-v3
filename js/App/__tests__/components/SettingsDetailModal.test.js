import React from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { shallow, mockStore } from '../../../Utils/TelldusTestSuite';

import SettingsDetailModal from '../../Components/DetailViews/SettingsDetailModal';
import { logoutFromTelldus } from '../../Actions';
import { registerPushToken, unregisterPushToken } from '../../Actions/User';

describe('<SettingsDetailModal />', () => {

	let wrapper, store;
	beforeEach(()=>{
		 store = mockStore({});
		wrapper = shallow(
			<Provider store={store}>
				<IntlProvider>
					<SettingsDetailModal />
				</IntlProvider>
			</Provider>
		);
		expect(wrapper).toBeTruthy();
	});

	it('should shallow SettingsDetailModal', () => {
		expect(wrapper.find(SettingsDetailModal).length).toBe(1);
		const screen = wrapper.props().children.type.displayName;
		expect(screen).toEqual('Connect(InjectIntl(SettingsDetailModal))');
	});

	it(' check logoutFromTelldus action on dispatching ', () => {
		const data = [{ type: 'LOGGED_OUT' }];
		store.dispatch(logoutFromTelldus());
		let action = store.getActions();
		expect(action).toEqual(data);
	});

	it(' check registerPushToken action on dispatching ', () => {
		const data = [];
		store.dispatch(registerPushToken());
		let action = store.getActions();
		expect(action).toEqual(data);
	});

	it(' check unregisterPushToken action on dispatching ', () => {
		const data = [];
		store.dispatch(unregisterPushToken('tellldus'));
		let action = store.getActions();
		expect(action).toEqual(data);
	});

});

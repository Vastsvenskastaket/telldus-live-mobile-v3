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
 * @providesModule TabViews/SubViews
 */

'use strict';

import ToggleDashboardTile from './ToggleDashboardTile';
import SensorDashboardTile from './SensorDashboardTile';
import SensorDashboardTileSlide from './SensorDashboardTileSlide';
import DeviceRow from './DeviceRow';
import DeviceRowHidden from './DeviceRowHidden';
import SensorRow from './SensorRow';
import SensorRowHidden from './SensorRowHidden';
import DashboardShadowTile from './DashboardShadowTile';
import BellDashboardTile from './BellDashboardTile';
import GenericDashboardTile from './GenericDashboardTile';
import NavigationalDashboardTile from './NavigationalDashboardTile';
import DimmerDashboardTile from './DimmerDashboardTile';
import DimmerPopup from './DimmerPopup';
import DimmerProgressBar from './DimmerProgressBar';
import DeviceHeader from './DeviceHeader';
import ToggleButton from './ToggleButton';
import BellButton from './BellButton';
import NavigationalButton from './NavigationalButton';
import DimmingButton from './DimmingButton';
import JobRow from './JobRow';

module.exports = {
	DeviceRow: DeviceRow,
	DeviceRowHidden: DeviceRowHidden,
	ToggleDashboardTile: ToggleDashboardTile,
	DeviceHeader: DeviceHeader,
	SensorDashboardTile: SensorDashboardTile,
	SensorDashboardTileSlide: SensorDashboardTileSlide,
	SensorRow: SensorRow,
	SensorRowHidden: SensorRowHidden,
	DashboardShadowTile: DashboardShadowTile,
	BellDashboardTile: BellDashboardTile,
	GenericDashboardTile: GenericDashboardTile,
	NavigationalDashboardTile: NavigationalDashboardTile,
	DimmerDashboardTile: DimmerDashboardTile,
	DimmerPopup: DimmerPopup,
	DimmerProgressBar: DimmerProgressBar,
	ToggleButton: ToggleButton,
	BellButton: BellButton,
	NavigationalButton: NavigationalButton,
	DimmingButton: DimmingButton,
	JobRow: JobRow,
};
import React, {Fragment} from 'react';
import Header from '../Header/Header';
import Bow from '../Bow/Bow';
import Circles from '../Circles/Circles';

export default class App extends React.Component {

	render() {
		return (
			<Fragment>
				<Header/>
				<Bow/>
				<Circles/>
			</Fragment>
		)
	}
}

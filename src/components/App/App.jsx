import React from 'react';
import test from '../../libraries/test';
import withStyles from 'decorators/withStyles';
import styles from './App.css';
import _ from 'lodash';

@withStyles(styles)
class App extends React.Component {
	render() {
		test();
		return(
			<h3> Hello World</h3>
		);
	}
}

export default App;
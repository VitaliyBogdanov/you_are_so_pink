import React from 'react';

export default class Bow extends React.Component {

	render() {
		return (
			<button className="bow" id="bowButton" onClick={this.changeBackground}>
				<img src="logo.svg" alt=""/>
			</button>
		)
	}

	changeBackground() {
		let body = document.body;
		body.classList.toggle('isBlack');
		window.dispatchEvent(new CustomEvent("changeBackground"));
	}
}

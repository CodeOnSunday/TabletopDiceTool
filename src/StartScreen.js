import React from 'react';

class StartScreen extends React.Component {
    constructor(props) {
        super(props);
        this.rollCallback = props.startscreen_roll_callback;
        this.state = {
            number_of_dice: null
        };
    }

    onRoll() {
        this.rollCallback(this.state.number_of_dice);
    }

    onNumberChange(event) {
        this.state.number_of_dice = event.target.value;
        this.setState(this.state);
    }

    render() {
        return (
            <div>
                <div>Input dice count:</div>
                <input type="number" value={this.state.number_of_dice} onChange={this.onNumberChange.bind(this)}></input>
                <button onClick={this.onRoll.bind(this)}>Roll!</button>
            </div>
        );
    }
}

export default StartScreen;
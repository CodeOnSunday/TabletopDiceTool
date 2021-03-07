import React from 'react';
import './App.css';
import StartScreen from './StartScreen.js'
import DiceScreen from './DiceScreen.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show_start_screen: true
    };
  }

  startscreenRollCallback(dice_count) {
    this.state.show_start_screen = false;
    this.state.dice_count = dice_count;
    this.setState(this.state);
  }

  backHomeCallback() {
    this.state.show_start_screen = true;
    this.setState(this.state);
  }

  render() {
    return (
      <div className="App">
        { this.state.show_start_screen && 
          <StartScreen startscreen_roll_callback={this.startscreenRollCallback.bind(this)}></StartScreen>
        }
        { !this.state.show_start_screen && 
          <DiceScreen dice_count={this.state.dice_count} backHomeCallback={ this.backHomeCallback.bind(this) }></DiceScreen>
        }
      </div>
    );
  }
} 

export default App;

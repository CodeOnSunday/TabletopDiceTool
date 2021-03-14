import React, { useEffect, useState } from 'react';
import './App.css';
import StartScreen from './StartScreen.js'
import DiceScreen from './DiceScreen.js'
import { Box, createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff4400'
    },
    secondary: {
      main: '#0044ff'
    }
  }
})

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show_start_screen: true,
      height: window.innerHeight,
      width: window.innerWidth
    };

    window.addEventListener('resize', () => {
      this.setState({
        height: window.innerHeight,
        width: window.innerWidth
      })
    });
  }

  startscreenRollCallback(dice_count) {
    this.setState({
      show_start_screen: false,
      dice_count: dice_count
    });
  }

  backHomeCallback() {
    this.setState({
      show_start_screen: true
    });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Grid 
          container 
          className="App" 
          justify="center" 
          alignItems="center"
          style={{
            height: this.state.height,
            width: this.state.width
          }}
        >
          { this.state.show_start_screen && 
            <StartScreen startscreen_roll_callback={this.startscreenRollCallback.bind(this)}></StartScreen>
          }
          { !this.state.show_start_screen && 
            <DiceScreen dice_count={this.state.dice_count} backHomeCallback={ this.backHomeCallback.bind(this) }></DiceScreen>
          }
        </Grid>
      </ThemeProvider>
    );
  }
} 

export default App;

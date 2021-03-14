import React from 'react';
import { Box, Button, TextField } from '@material-ui/core';

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
        this.setState({
            number_of_dice: event.target.value
        });
    }

    onKeyUp(e) {
        if(e.key === "Enter") {
            this.onRoll();
        }
    }

    render() {
        return (
            <Box>
                {/* <input type="number" value={this.state.number_of_dice} onChange={this.onNumberChange.bind(this)}></input> */}

                <TextField 
                    variant="outlined" 
                    label="Dice" 
                    type="number"
                    value={ this.state.number_of_dice }
                    onChange={ this.onNumberChange.bind(this) }
                    onKeyUp={ this.onKeyUp.bind(this) }
                    InputProps={{ 
                        endAdornment: <Button 
                            variant="text" 
                            style={{
                                marginLeft: 5
                            }} 
                            onClick={this.onRoll.bind(this)}
                        >Roll!</Button>
                    }}
                ></TextField>
                {/* <Button variant="contained" onClick={this.onRoll.bind(this)}>Roll!</Button> */}
            </Box>
        );
    }
}

export default StartScreen;
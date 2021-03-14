import React from 'react';
import Dice from './Dice.js';
import './DiceScreen.scss';

import Button from '@material-ui/core/Button';
import { Box, Container, Grid } from '@material-ui/core';

class DiceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rolls: [],
            current_roll: 0
        };
        this.state.rolls = this.initialRoll(props.dice_count);

        this.backHomeCallback = props.backHomeCallback;
    }

    randInt() {
        let dice = Math.floor(Math.random() * 6) + 1;
        return dice;
    }

    initialRoll(dice_count) {
        let new_dice = new Dice();
        
        for(let i=0;i<dice_count;i++) {
            new_dice.addValue(this.randInt());
        }

        let new_list = [...this.state.rolls, new_dice];

        this.setState({
            rolls: new_list
        });

        return new_list;
    }

    reroll() {
        let new_dice = this.state.rolls[this.state.current_roll];
        let dice_count = 0;
        for(let i=1;i<=6;i++) {
            if(new_dice.isSelected(i)){
                dice_count += new_dice.getValueNum(i);
                new_dice.setValue(i);
            }
        }

        if(dice_count === 0) return;

        new_dice.addLevel();

        for(let i=0;i<dice_count;i++) {
            new_dice.addValue(this.randInt());
        }

        new_dice.resetSelected();

        this.setState({
            rolls: this.state.rolls
        });
    }

    toggleSelected(value, event) {
        if(event.buttons === 1) {
            let dice = this.state.rolls[this.state.current_roll];
            dice.toggleSelected(value);
            this.setState({
                rolls: this.state.rolls
            });
        }
    }

    next() {
        if(this.state.current_roll === this.state.rolls.length - 1) {
            let dice = this.state.rolls[this.state.current_roll];
            let dice_count = 0;
            for(let i=1;i<=6;i++) {
                if(dice.isSelected(i)){
                    dice_count += dice.getValueNum(i);
                }
            }

            if(dice_count === 0){ 
                return;
            }

            this.initialRoll(dice_count);
        }
        this.setState({
            current_roll: this.state.current_roll + 1
        });
    }

    priv() {
        if(this.state.current_roll === 0) {
            this.backHomeCallback();
        }else{
            this.setState({
                current_roll: this.state.current_roll - 1
            });
        }
    }

    explode() {
        let dice = this.state.rolls[this.state.current_roll];
        for(let i=1;i<=6;i++) {
            if(dice.isSelected(i)){
                dice.toggleExplode(i);
            }
        }
        dice.resetSelected();

        this.setState({
            rolls: this.state.rolls
        });
    }

    getSelectedDiceCount() {
        let dice = this.state.rolls[this.state.current_roll];
        let dice_count = 0;
        if(dice !== undefined) {
            for(let i=1;i<=6;i++) {
                if(dice.isSelected(i)){
                    dice_count += dice.getValueNum(i);
                }
            }
        }
        return dice_count;
    }

    render() {
        let dice = this.state.rolls[this.state.current_roll];
        let is_first = this.state.current_roll === 0;
        let is_last = this.state.current_roll === (this.state.rolls.length - 1);
        let prev_button = {
            text: is_first ? "Home" : "Prev"
        };
        let reroll_button = {
            disabled: is_last ? false : true
        };
        let explode_button = {
            disabled: is_last ? false : true
        };
        let next_button = {
            text: is_last ? "Roll!" : "Next"
        };

        let dice_lines = [6,5,4,3,2,1].map((value, idx) => {
            let top_class = false;
            if(value < 6 && dice !== undefined && (dice.isSelected(value + 1) !== dice.isSelected(value))) {
                top_class = true;
            }
            let bot_class = false;
            if(value > 1 && dice !== undefined && (dice.isSelected(value - 1) !== dice.isSelected(value))) {
                bot_class = true;
            }
            let selected_class = false;
            if(dice !== undefined) {
                if(dice.isSelected(value)) {
                    selected_class = true;
                }
            }

            return {
                additional_class_name: [
                    (top_class ? 'diceTop diceTopMid' : ''),
                    (bot_class ? 'diceBot diceBotMid' : ''),
                    (value === 6 ? 'diceTop' : ''),
                    (value === 1 ? 'diceBot' : '')
                ],
                on_mouse_event: dice !== undefined && is_last ? this.toggleSelected.bind(this, value) : () => {},
                text: dice !== undefined ? dice.getValueStr(value) : "-",
                label: value,
                selected: selected_class,
                color: (selected_class ? 'primary.main': 'secondary.main'),
                value: dice !== undefined ? dice.getValueNum(value) : 0
            };
        });
        let dice_groups = [];
        let dice_group_current_value = 0;
        let dice_group_size = 0;
        dice_lines.forEach( (line, idx) => {
            if(idx > 0){
                if(dice_lines[idx - 1].selected !== line.selected){
                    dice_groups.push({
                        size: dice_group_size,
                        value: dice_group_current_value,
                        selected: dice_lines[idx - 1].selected
                    });
                    dice_group_size = 0;
                    dice_group_current_value = 0;
                }
            }
            dice_group_current_value += line.value;
            dice_group_size += 1;
        });
        dice_groups.push({
            size: dice_group_size,
            value: dice_group_current_value,
            selected: dice_lines[5].selected
        });

        return (
            <Container>
                Roll #{ this.state.current_roll + 1 }
                <div className="spacer"></div>
                <Grid container direction="row">
                    <Grid item direction="column" className="diceCol1">
                        {
                            dice_lines.map( (desc) => {
                                return (
                                    <Box 
                                        className={ "diceLine " + desc.additional_class_name.join(" ") } 
                                        color= { desc.color }
                                        onMouseDown={ desc.on_mouse_event } 
                                        onMouseEnter={ desc.on_mouse_event }>
                                            <div className='diceLabel'>{ desc.label }:</div>
                                            <div className='diceValue'>{ desc.text }</div>
                                    </Box>
                                );
                            })
                        }
                    </Grid>
                    <Grid item direction="column" className="diceCol2">
                        {
                            dice_groups.map( (desc) => {
                                return (
                                    <Grid 
                                        item
                                        className="diceAnotation"
                                        style={{
                                            height: (desc.size / 6 * 100) + "%"
                                        }}
                                    >
                                        { desc.value }
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </Grid>
                <div className="spacer"></div>
                <Button variant="contained" className="diceButton" onClick={ this.priv.bind(this) }>{ prev_button.text }</Button>
                <Button variant="contained" className="diceButton" onClick={ this.reroll.bind(this) } disabled={ reroll_button.disabled } >Reroll</Button>
                <Button variant="contained" className="diceButton" onClick={ this.explode.bind(this) } disabled={ explode_button.disabled} >Explode</Button>
                <Button variant="contained" className="diceButton" onClick={ this.next.bind(this) }>{ next_button.text }</Button>
            </Container>
        );
    }
}

export default DiceScreen;
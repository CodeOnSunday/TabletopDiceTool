import React from 'react';
import Dice from './Dice.js';
import './DiceScreen.css';

class DiceScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rolls: [],
            current_roll: 0
        };
        this.resetSelected();
        this.initialRoll(props.dice_count);

        this.backHomeCallback = props.backHomeCallback;
    }

    resetSelected() {
        this.state.selected_values = {
            6: false,
            5: false,
            4: false,
            3: false,
            2: false,
            1: false
        };
        this.setState(this.state);
    }

    randInt() {
        let dice = Math.floor(Math.random() * 6) + 1;
        console.log(dice);
        return dice;
    }

    initialRoll(dice_count) {
        let new_dice = new Dice();
        this.state.rolls.push(new_dice);
        
        for(let i=0;i<dice_count;i++) {
            new_dice.addValue(this.randInt());
        }

        this.setState(this.state);
    }

    reroll() {
        let dice = this.state.rolls[this.state.current_roll];
        let dice_count = 0;
        for(let i=1;i<=6;i++) {
            if(this.state.selected_values[i]){
                dice_count += dice.getValueNum(i);
                dice.setValue(i);
            }
        }

        if(dice_count == 0) return;

        dice.addLevel();

        for(let i=0;i<dice_count;i++) {
            dice.addValue(this.randInt());
        }

        this.resetSelected();
        this.setState(this.state);
    }

    toggleSelected(value, event) {
        if(event.buttons == 1) {
            this.state.selected_values[value] = !this.state.selected_values[value];
            this.setState(this.state);
        }
    }

    next() {
        if(this.state.current_roll == this.state.rolls.length - 1) {
            let dice = this.state.rolls[this.state.current_roll];
            let dice_count = 0;
            for(let i=1;i<=6;i++) {
                if(this.state.selected_values[i]){
                    dice_count += dice.getValueNum(i);
                }
            }

            if(dice_count == 0){ 
                return;
            }

            this.initialRoll(dice_count);
        }
        this.state.current_roll += 1;
        this.setState(this.state);
        this.resetSelected();
    }

    priv() {
        if(this.state.current_roll == 0) {
            this.backHomeCallback();
        }else{
            this.state.current_roll -= 1;
            this.setState(this.state);
        }
        this.resetSelected();
    }

    explode() {
        let dice = this.state.rolls[this.state.current_roll];
        for(let i=1;i<=6;i++) {
            if(this.state.selected_values[i]){
                dice.toggleExplode(i);
            }
        }
        this.resetSelected();
    }

    getSelectedDiceCount() {
        let dice = this.state.rolls[this.state.current_roll];
        let dice_count = 0;
        for(let i=1;i<=6;i++) {
            if(this.state.selected_values[i]){
                dice_count += dice.getValueNum(i);
            }
        }
        return dice_count;
    }

    render() {
        let dice = this.state.rolls[this.state.current_roll];
        let prev_text = this.state.current_roll == 0 ? "Home" : "Prev";
        let next_text = this.state.current_roll == (this.state.rolls.length - 1) ? "Roll" : "Next";
        let is_disabled = this.state.current_roll != (this.state.rolls.length - 1);
        let class_for_dice = [6,5,4,3,2,1].map((number) => {
            return this.state.selected_values[number] ? 'diceLine diceSelected' : 'diceLine'
        });
        return (
            <div>
                Roll #{ this.state.current_roll + 1 } ({ this.getSelectedDiceCount() }/{ dice.getSum() } dice):
                { [6,5,4,3,2,1].map((number, idx) =>
                    <div className={ class_for_dice[idx] } onMouseDown={ this.toggleSelected.bind(this, number) } onMouseEnter={ this.toggleSelected.bind(this, number) }><div className='diceLabel'>{number}:</div> <div  className='diceValue'>{ dice.getValueStr(number) }</div></div>
                ) }
                <button onClick={ this.priv.bind(this) }>{ prev_text }</button>
                <button onClick={ this.reroll.bind(this) } disabled={ is_disabled }>Reroll</button>
                <button onClick={ this.explode.bind(this) } disabled={ is_disabled }>Explode</button>
                <button onClick={ this.next.bind(this) }>{ next_text }</button>
            </div>
        )
    }
}

export default DiceScreen;
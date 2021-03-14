class Dice {
    constructor() {
        this.reset();
    }

    reset() {
        this.dice_values = [];
        this.addLevel();

        this.explode = {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false
        };

        this.selected = {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false
        };
    }

    addValue(value, count=1) {
        this.dice_values[this.dice_values.length - 1][value] += count;
    }

    setValue(value, new_count=0) {
        this.dice_values[this.dice_values.length - 1][value] = new_count;
    }

    addLevel() {
        this.dice_values.push({
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0
        });
    }

    toggleSelected(value) {
        this.selected[value] = !this.selected[value];
    }

    isSelected(value) {
        return this.selected[value];
    }

    resetSelected() {
        this.selected = {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false
        };
    }

    getValueStr(value) {
        let ret_str = '';
        let first = true;
        this.dice_values.forEach((values) => {
            if(!first){
                ret_str += '+';
            }
            ret_str += String(values[value]);
            first = false;
        });
        if(this.explode[value]) {
            ret_str += ' *2';
        }
        return ret_str;
    }

    getSum() {
        return [1,2,3,4,5,6].map((number) => {
            return this.getValueNum(number);
        }).reduce((a,b) => {
            return a + b;
        });
    }

    getValueNum(value) {
        let ret_val = 0;
        this.dice_values.forEach((values) => {
            ret_val += values[value];
        });
        if(this.explode[value]) {
            ret_val *= 2;
        }
        return ret_val;
    }

    setExplode(value, explode=true) {
        this.explode[value] = explode;
    }

    toggleExplode(value) {
        this.explode[value] = !this.explode[value];
    }
}

export default Dice;
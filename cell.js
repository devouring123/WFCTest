class Cell {
    constructor(value) {
        this.collapsed = false;
        if (value instanceof Array){
            this.options = value;
        }else {
            this.options = new Array(value).fill(0).map((_, i) => i);
            // this.options = [];
            // for (let i = 0; i < value; i++) {
            //     this.options[i] = i;
            // }
        }
    }
    setPos(i, j){
        this.pos = [i, j];
    }
}



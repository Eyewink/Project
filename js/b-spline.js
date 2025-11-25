var letters;
(function (letters) {
    letters[letters["A"] = 0] = "A";
    letters[letters["B"] = 1] = "B";
    letters[letters["C"] = 2] = "C";
    letters[letters["D"] = 3] = "D";
    letters[letters["E"] = 4] = "E";
    letters[letters["F"] = 5] = "F";
    letters[letters["G"] = 6] = "G";
    letters[letters["H"] = 7] = "H";
    letters[letters["I"] = 8] = "I";
    letters[letters["J"] = 9] = "J";
    letters[letters["K"] = 10] = "K";
    letters[letters["L"] = 11] = "L";
    letters[letters["M"] = 12] = "M";
    letters[letters["N"] = 13] = "N";
    letters[letters["O"] = 14] = "O";
    letters[letters["P"] = 15] = "P";
    letters[letters["Q"] = 16] = "Q";
    letters[letters["R"] = 17] = "R";
    letters[letters["S"] = 18] = "S";
    letters[letters["T"] = 19] = "T";
    letters[letters["U"] = 20] = "U";
    letters[letters["V"] = 21] = "V";
    letters[letters["W"] = 22] = "W";
    letters[letters["X"] = 23] = "X";
    letters[letters["Y"] = 24] = "Y";
    letters[letters["Z"] = 25] = "Z";
})(letters || (letters = {}));
export default class B_Spline {
    constructor(target) {
        this._data = [];
        this._delta = 0;
        this._start = { x: 0, y: 0 };
        this.dot_counter = 0;
        this._text_num = 0;
        this.clear = () => {
            var _a;
            const rect = this._target.getBoundingClientRect();
            (_a = this._target.getContext('2d')) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, rect.width, rect.height);
            this._delta = 0;
        };
        this.init = () => {
            this.reset();
            this._target.addEventListener('click', (e) => {
                const rect = this._target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.userClick({ x: x, y: y });
            });
        };
        this.addPoint = (_x, _y) => {
            const rect = this._target.getBoundingClientRect();
            let __x = _x || rect.width * Math.random();
            let __y = _y || rect.height * Math.random();
            return {
                x: __x,
                y: __y
            };
        };
        this.drawDot = (dot, text, font) => {
            let ctx = this._target.getContext('2d');
            if (text !== undefined) {
                ctx.font = font || '13px Arial';
                ctx.fillStyle = '#333';
                ctx.fillText(text, dot.x, dot.y - 5);
            }
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.arc(dot.x, dot.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        };
        this.userClick = (dot) => {
            this._delta = 0;
            this._data.push(dot);
            this.dot_counter += 1;
            this.drawDot(this._data[this.dot_counter], letters[this.dot_counter % 26] + (Math.floor((this.dot_counter + 1) / 26)).toString());
            this.drawLine(this._data[this.dot_counter], this._data[this.dot_counter - 1], 0.5, 'rgba(0,0,0,.5)');
        };
        this.drawLine = (start, end, lineWidth, strokeStyle) => {
            let ctx = this._target.getContext('2d');
            ctx.beginPath();
            ctx.lineWidth = lineWidth || 1;
            ctx.strokeStyle = strokeStyle || 'rgba(51, 102, 255, 1)';
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        };
        this.animate = () => {
            if (this._delta > 1) {
                this.dot_counter += 1;
                if (this.dot_counter > this._data.length - 1) {
                    var dot = this.addPoint();
                    this._data.push(dot);
                    this.drawDot(this._data[this.dot_counter], letters[this.dot_counter % 26] + (Math.floor((this.dot_counter + 1) / 26)).toString());
                    this.drawLine(this._data[this.dot_counter], this._data[this.dot_counter - 1], 0.5, 'rgba(0,0,0,.5)');
                }
                this._delta = 0;
            }
            this._delta += 0.01;
            this.animation = requestAnimationFrame(this.animate);
        };
        this.reset = () => {
            cancelAnimationFrame(this.animation);
            this.clear();
            this.dot_counter = 0;
            this._data = [];
            var dot = this.addPoint();
            this._data.push(dot);
            this._start = this._data[0];
            this.drawDot(this._data[0], letters[0] + JSON.stringify(this._text_num));
            this.animation = requestAnimationFrame(this.animate);
        };
        this._target = target;
        this.init();
    }
}

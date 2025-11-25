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
export default class Bspline {
    constructor(target) {
        this._type = 'simple';
        this._data = [];
        this._delta = 0;
        this._offset = 0;
        this._start = { x: 0, y: 0 };
        this._userClickCouner = 0;
        this._autoConstract = false;
        this._clear = () => {
            var _a;
            const rect = this._target.getBoundingClientRect();
            (_a = this._target.getContext('2d')) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, rect.width, rect.height);
            this._delta = 0;
            this._offset = 0;
        };
        this._reset = () => {
            this._clear();
            cancelAnimationFrame(this.animation);
            this._data = [];
            for (let i = 0; i < 4; i++) {
                let dot = this._addPoint();
                this._data.push(dot);
            }
            this._reDraw();
        };
        this.init = () => {
            this._reset();
            this._target.addEventListener('click', (e) => {
                const rect = this._target.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this._userClick({ x: x, y: y });
            });
        };
        this._addPoint = (_x, _y) => {
            const rect = this._target.getBoundingClientRect();
            return {
                x: _x || rect.width * Math.random(),
                y: _y || rect.height * Math.random()
            };
        };
        this._drawLine = (start, end, lineWidth, strokeStyle) => {
            let ctx = this._target.getContext('2d');
            ctx.beginPath();
            ctx.lineWidth = lineWidth || 1;
            ctx.strokeStyle = strokeStyle || 'rgba(51, 102, 255, 1)';
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        };
        this._drawSub = (dot, text) => {
            let ctx = this._target.getContext('2d');
            ctx.font = `9px Arial`;
            ctx.fillStyle = '#999';
            ctx.fillText(text, dot.x + 10, dot.y - 5);
        };
        this._drawDot = (dot, text, font) => {
            let ctx = this._target.getContext('2d');
            if (text !== undefined) {
                ctx.font = font || '13px Arial';
                ctx.fillStyle = '#333';
                ctx.textBaseline = 'bottom';
                ctx.fillText(text, dot.x, dot.y - 5);
            }
            if (this._type == 'complex') {
                this._drawSub(dot, String(Math.floor(this._data.length / 27)));
            }
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.arc(dot.x, dot.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        };
        this._reDraw = () => {
            for (var i = 0; i < this._data.length; i++) {
                if (i > 0) {
                    this._drawLine(this._data[i - 1], this._data[i], .5, 'rgba(0,0,0,.5)');
                }
                this._drawDot(this._data[i], letters[i]);
            }
            if (this._data.length == 4) {
                this._start = this._calc(this._data[0], this._data[1], this._data[2], this._data[3], 0);
                this.animation = requestAnimationFrame(this._animate);
            }
        };
        this._userClick = (dot) => {
            switch (this._type) {
                case 'simple':
                    cancelAnimationFrame(this.animation);
                    if (this._userClickCouner == 0) {
                        this._data = [];
                    }
                    this._data.push(dot);
                    this._clear();
                    this._reDraw();
                    this._userClickCouner = (this._userClickCouner + 1) % 4;
                    break;
                case 'complex':
                    this._data.push(dot);
                    let length = this._data.length - 1;
                    this._drawLine(this._data[length - 1], this._data[length], .5, 'rgba(0,0,0,.5)');
                    this._drawDot(this._data[length], letters[length % 26]);
                    if (!this.animation) {
                        this.animation = requestAnimationFrame(this._animate);
                    }
                    break;
                default:
                    break;
            }
        };
        this._calc = (p1, p2, p3, p4, t) => {
            let m1 = Math.pow((1 - t), 3) / 6;
            let m2 = (3 * Math.pow(t, 3) - 6 * Math.pow(t, 2) + 4) / 6;
            let m3 = (-3 * Math.pow(t, 3) + 3 * Math.pow(t, 2) + 3 * t + 1) / 6;
            let m4 = Math.pow(t, 3) / 6;
            return {
                x: m1 * p1.x + m2 * p2.x + m3 * p3.x + m4 * p4.x,
                y: m1 * p1.y + m2 * p2.y + m3 * p3.y + m4 * p4.y
            };
        };
        this._animate = () => {
            var result = this._calc(this._data[this._offset], this._data[this._offset + 1], this._data[this._offset + 2], this._data[this._offset + 3], this._delta);
            this._drawLine(this._start, result, 2);
            this._start = result;
            if (this._delta > 1) {
                switch (this._type) {
                    case 'simple':
                        cancelAnimationFrame(this.animation);
                        break;
                    case 'complex':
                        if (this._offset == this._data.length - 4 && this._autoConstract) {
                            let dot = this._addPoint();
                            this._data.push(dot);
                            let length = this._data.length - 1;
                            this._drawLine(this._data[length - 1], this._data[length], .5, 'rgba(0,0,0,.5)');
                            this._drawDot(this._data[length], letters[length % 26]);
                        }
                        if (this._offset < this._data.length - 4) {
                            this._offset++;
                            this._delta = 0;
                            this.animation = requestAnimationFrame(this._animate);
                        }
                        else {
                            cancelAnimationFrame(this.animation);
                            this._offset++;
                            this._delta = 0;
                            this.animation = null;
                        }
                        break;
                    default:
                        break;
                }
            }
            else {
                this._delta += 0.01;
                this.animation = requestAnimationFrame(this._animate);
            }
        };
        this.changeType = (type) => {
            switch (type) {
                case 'simple':
                    this._type = type;
                    this._userClickCouner = 0;
                    this._reset();
                    break;
                case 'complex':
                    this._type = type;
                    this.redraw();
                    break;
                default:
                    break;
            }
        };
        this.redraw = () => {
            this._clear();
            this._start = this._calc(this._data[0], this._data[1], this._data[2], this._data[3], 0);
            this._reDraw();
        };
        this.toggleSupport = () => {
            this._autoConstract = !this._autoConstract;
        };
        this.reset = () => {
            this._reset();
        };
        this._target = target;
        this.init();
    }
}

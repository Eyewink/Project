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
export default class Bezie {
    constructor(target) {
        this._dots = 11;
        this._data = [];
        this._support = true;
        this._delta = 0;
        this._start = { x: 0, y: 0 };
        this._userClickCouner = 0;
        this._clear = () => {
            var _a;
            const rect = this._target.getBoundingClientRect();
            (_a = this._target.getContext('2d')) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, rect.width, rect.height);
            this._delta = 0;
        };
        this._reset = () => {
            this._clear();
            this._data = [];
            for (var i = 0; i < this._dots; i++) {
                var dot = this._addPoint();
                this._data.push(dot);
            }
            this._start = this._data[0];
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
        this._drawDot = (dot, text, font) => {
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
        this._reDraw = () => {
            for (var i = 0; i < this._data.length; i++) {
                if (i > 0) {
                    this._drawLine(this._data[i - 1], this._data[i], .5, 'rgba(0,0,0,.5)');
                }
                this._drawDot(this._data[i], letters[i]);
            }
            if (this._data.length == this._dots) {
                this.animation = requestAnimationFrame(this._animate);
            }
        };
        this._userClick = (dot) => {
            cancelAnimationFrame(this.animation);
            if (this._userClickCouner == 0) {
                this._data = [];
                this._start = dot;
            }
            this._data.push(dot);
            this._clear();
            this._reDraw();
            this._userClickCouner = (this._userClickCouner + 1) % this._dots;
        };
        this._calc = (start, end, t) => {
            return {
                x: start.x + (end.x - start.x) * t,
                y: start.y + (end.y - start.y) * t
            };
        };
        this._alg = (data, delta) => {
            if (data.length === 1) {
                return data[0];
            }
            let _result = [];
            for (var i = 0; i < data.length - 1; i++) {
                _result.push(this._calc(data[i], data[i + 1], delta));
            }
            return this._alg(_result, delta);
        };
        this._animate = () => {
            // switch (this._dots) {
            // 	case 4:
            // 		var p1 = this._calc(this._data[0], this._data[1], this._delta);
            // 		var p2 = this._calc(this._data[1], this._data[2], this._delta);
            // 		var p3 = this._calc(this._data[2], this._data[3], this._delta);
            // 		var q1 = this._calc(p1,p2,this._delta);
            // 		var q2 = this._calc(p2,p3,this._delta);
            // 		var result = this._calc(q1,q2,this._delta);
            // 		if(this._support) {
            // 			this._drawLine(p1,p2,.5,'rgba(102,255,102,.2)');
            // 			this._drawLine(p2,p3,.5,'rgba(102,255,102,.2)');
            // 			this._drawLine(q1,q2,.5,'rgba(255,102,102,.4)');
            // 		}
            // 		this._drawLine(this._start, result, 2);
            // 		this._start = result;
            // 		break;
            // 	case 3: {
            // 		var p1 = this._calc(this._data[0], this._data[1], this._delta);
            // 		var p2 = this._calc(this._data[1], this._data[2], this._delta);
            // 		var result = this._calc(p1,p2,this._delta);
            // 		if(this._support) {
            // 			this._drawLine(p1,p2,.5,'rgba(102,255,102,.2)');
            // 		}
            // 		this._drawLine(this._start, result, 2);
            // 		this._start = result;
            // 		break;         
            // 	}
            // 	default:
            // 		break;
            // }
            var result = this._alg(this._data, this._delta);
            this._drawLine(this._start, result, 2);
            this._start = result;
            if (this._delta > 1) {
                cancelAnimationFrame(this.animation);
            }
            else {
                this._delta += 0.01;
                this.animation = requestAnimationFrame(this._animate);
            }
        };
        this.changeType = (type) => {
            switch (type) {
                case 3:
                    this._dots = type;
                    this._reset();
                    break;
                case 4:
                    this._dots = type;
                    this._reset();
                    break;
                default:
                    break;
            }
        };
        this.redraw = () => {
            this._clear();
            this._start = this._data[0];
            this._reDraw();
        };
        this.toggleSupport = () => {
            this._support = !this._support;
            this._clear();
            this._start = this._data[0];
            this._reDraw();
        };
        this.reset = () => {
            this._reset();
        };
        this._target = target;
        this.init();
    }
}

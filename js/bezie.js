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
var colors;
(function (colors) {
    colors[colors["121,0,201"] = 0] = "121,0,201";
    colors[colors["255,158,100"] = 1] = "255,158,100";
    colors[colors["83,219,138"] = 2] = "83,219,138";
    colors[colors["221,66,245"] = 3] = "221,66,245";
    colors[colors["143,158,255"] = 4] = "143,158,255";
    colors[colors["255, 241, 0"] = 5] = "255, 241, 0";
    colors[colors["255, 140, 0"] = 6] = "255, 140, 0";
    colors[colors["155, 17, 35"] = 7] = "155, 17, 35";
    colors[colors["104, 33, 122"] = 8] = "104, 33, 122";
    colors[colors["186, 216, 10"] = 9] = "186, 216, 10";
})(colors || (colors = {}));
export default class Bezie {
    constructor(target) {
        this._dots = 3;
        this._data = [];
        this._complex = false;
        this._delta = 0;
        this._start = { x: 0, y: 0 };
        this._storage = [];
        this._userClickCouner = 0;
        this._speed = 100;
        this._clear = () => {
            var _a;
            const rect = this._target.getBoundingClientRect();
            (_a = this._target.getContext('2d')) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, rect.width, rect.height);
        };
        this._reset = () => {
            this._clear();
            this._delta = 0;
            this._storage = [];
            cancelAnimationFrame(this.animation);
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
            const ctx = this._target.getContext('2d');
            ctx.beginPath();
            ctx.lineWidth = lineWidth || 1;
            ctx.strokeStyle = strokeStyle || 'rgba(51, 102, 255, 1)';
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        };
        this._drawDot = (dot, text, font, color) => {
            let ctx = this._target.getContext('2d');
            if (text !== undefined) {
                ctx.font = font || '13px Arial';
                ctx.fillStyle = '#333';
                ctx.fillText(text, dot.x, dot.y - 5);
            }
            ctx.beginPath();
            ctx.fillStyle = color || 'red';
            ctx.arc(dot.x, dot.y, 2, 0, 2 * Math.PI);
            ctx.fill();
        };
        this._fill = (color = '#111') => {
            let ctx = this._target.getContext('2d');
            const rect = this._target.getBoundingClientRect();
            ctx.rect(0, 0, rect.width, rect.height);
            ctx.fillStyle = color;
            ctx.fill();
        };
        this._blur = (radius = 3) => {
            let ctx = this._target.getContext('2d');
            ctx.filter = `blur(${radius}px)`;
            ctx.drawImage(this._target, 0, 0);
            ctx.filter = 'none';
        };
        this._drawChords = () => {
            for (var i = 0; i < this._data.length; i++) {
                if (i > 0) {
                    this._drawLine(this._data[i - 1], this._data[i], .5, 'rgba(0,0,0,.5)');
                }
                this._drawDot(this._data[i], letters[i]);
            }
        };
        this._reDraw = () => {
            this._drawChords();
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
            this._delta = 0;
            this._storage = [];
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
            if (data.length == 1) {
                return data[0];
            }
            let _result = [];
            for (var i = 0; i < data.length - 1; i++) {
                _result.push(this._calc(data[i], data[i + 1], delta));
            }
            let _alpha = (this._complex) ? .1 : 1;
            for (var i = 1; i < _result.length; i++) {
                this._drawLine(_result[i - 1], _result[i], .5, `rgba(${colors[_result.length % 5]}, ${_alpha})`);
            }
            if (!this._complex && _result.length > 1) {
                for (var j = 0; j < _result.length; j++) {
                    this._drawDot(_result[j], '', undefined, `rgb(${colors[_result.length % 5]})`);
                }
            }
            return this._alg(_result, delta);
        };
        this._animate = () => {
            if (!this._complex) {
                this._clear();
                this._drawChords();
            }
            var result = this._alg(this._data, this._delta);
            this._storage.push(result);
            if (this._complex) {
                this._drawLine(this._start, result, 2);
                this._start = result;
            }
            else {
                for (var i = 0; i < this._storage.length - 1; i++) {
                    this._drawLine(this._storage[i], this._storage[i + 1], 2);
                }
            }
            if (this._delta > 1) {
                cancelAnimationFrame(this.animation);
                if (!this._complex) {
                    this._clear();
                    this._drawChords();
                }
                for (var i = 0; i < this._storage.length - 1; i++) {
                    this._drawLine(this._storage[i], this._storage[i + 1], 2);
                }
            }
            else {
                this._delta += (1 / (300 - this._speed * 2));
                this.animation = requestAnimationFrame(this._animate);
            }
        };
        this._demo_alg = (data, delta) => {
            let _result = [];
            for (var i = 0; i < data.length - 1; i++) {
                _result.push(this._calc(data[i], data[i + 1], delta));
            }
            if (_result.length > 1) {
                if (_result.length < this._data.length - 1) {
                    for (var i = 1; i < _result.length; i++) {
                        this._drawLine(_result[i - 1], _result[i], .5, `rgba(${colors[_result.length % 10]}, .2)`);
                    }
                }
                this._demo_alg(_result, delta);
            }
        };
        this._demo_animate = () => {
            // this._blur();
            this._demo_alg(this._data, this._delta);
            if (this._delta > .8) {
                cancelAnimationFrame(this.animation);
            }
            else {
                this._delta += 0.005;
                this.animation = requestAnimationFrame(this._demo_animate);
            }
        };
        this._demo_start = () => {
            this._clear();
            // this._fill();
            this._delta = 0.2;
            this._dots = 5 + Math.floor(12 * Math.random());
            this._data = [];
            for (var i = 0; i < this._dots; i++) {
                var dot = this._addPoint();
                this._data.push(dot);
            }
            this.animation = requestAnimationFrame(this._demo_animate);
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
            this._delta = 0;
            this._storage = [];
            this._start = this._data[0];
            this._reDraw();
        };
        this.toggleSupport = () => {
            this._complex = !this._complex;
            this._clear();
            this._delta = 0;
            this._storage = [];
            this._start = this._data[0];
            this._reDraw();
        };
        this.changeDegree = (degree) => {
            this._dots = Math.max(2, degree);
            this._clear();
            this._delta = 0;
            this._storage = [];
            this._reset();
        };
        this.reset = () => {
            this._reset();
        };
        this.demo = () => {
            this._demo_start();
            clearInterval(this._demo_interval);
            this._demo_interval = setInterval(this._demo_start, 4500);
        };
        this.stop = () => {
            clearInterval(this._demo_interval);
        };
        this.clear = () => {
            cancelAnimationFrame(this.animation);
            this._clear();
        };
        this.setSpeed = (value) => {
            value = Math.max(Math.min(value, 100), 0);
            this._speed = value;
        };
        this._target = target;
        this.init();
    }
}

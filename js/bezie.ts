import type { Dot } from "./types";
enum letters {
	A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z
}

enum colors {
	'121,0,201',
	'255,158,100',
	'83,219,138',
	'221,66,245',
	'143,158,255',
}

export default class Bezie {
	private _target: HTMLCanvasElement;
	private _dots:number = 3;
	private _data:Dot[] = [];
	private _complex:Boolean = false;

	private _delta:number = 0;
	private _start:Dot = { x:0, y:0 };
	private _storage:Dot[] = [];

	private _userClickCouner: number = 0;

	private animation: any;

	constructor (target:HTMLCanvasElement) {
		this._target = target;
		this.init();
	}

	private _clear = ():void => {
		const rect = this._target.getBoundingClientRect();
		this._target.getContext('2d')?.clearRect(0,0,rect.width,rect.height);
	}

	private _reset = ():void => {
		this._clear();
		this._delta = 0;
		this._storage = [];

		this._data = [];
		for(var i=0; i<this._dots; i++) {
			var dot = this._addPoint();
			this._data.push(dot);
		}

		this._start = this._data[0];
		this._reDraw();
	}

	private init = ():void => {
		this._reset();

		this._target.addEventListener('click', (e) => {
			const rect = this._target.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			this._userClick({x:x, y:y});
		});
	}

	private _addPoint = (_x?:number, _y?:number):Dot => {
		const rect = this._target.getBoundingClientRect();
		return { 
			x: _x || rect.width * Math.random(), 
			y: _y || rect.height * Math.random() 
		}
	}

	private _drawLine = (start:Dot, end:Dot, lineWidth?:number, strokeStyle?:string) => {
		let ctx = this._target.getContext('2d') as CanvasRenderingContext2D;
		ctx.beginPath();
		ctx.lineWidth = lineWidth || 1;
		ctx.strokeStyle = strokeStyle || 'rgba(51, 102, 255, 1)';
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
	}

	private _drawDot = (dot:Dot, text?:string, font?:string, color?:string) => {
		let ctx = this._target.getContext('2d') as CanvasRenderingContext2D;
		if(text !== undefined) {
			ctx.font = font || '13px Arial';
			ctx.fillStyle = '#333';
			ctx.fillText(text, dot.x, dot.y - 5);
		}
		ctx.beginPath();
		ctx.fillStyle = color || 'red';
		ctx.arc(dot.x, dot.y, 2, 0 , 2*Math.PI);
		ctx.fill();
	}

	private _drawChords = ():void => {
		for (var i=0 ; i < this._data.length; i++) {
			if (i>0) {
				this._drawLine(this._data[i-1], this._data[i],.5,'rgba(0,0,0,.5)');
			}
			this._drawDot(this._data[i], letters[i]);
		}
	}

	private _reDraw = () => {
		this._drawChords();		
		if (this._data.length == this._dots) {
			this.animation = requestAnimationFrame(this._animate);
		}
	}

	private _userClick = (dot:Dot) => {
		
		cancelAnimationFrame(this.animation);

		if(this._userClickCouner == 0) {
			this._data = [];
			this._start = dot;
		}

		this._data.push(dot);
		this._clear();
		this._delta = 0;
		this._storage = [];
		this._reDraw();
		this._userClickCouner = (this._userClickCouner + 1) % this._dots;
	}

	private _calc = (start:Dot, end:Dot, t:number):Dot => {
		return {
			x: start.x + (end.x - start.x) * t,
			y: start.y + (end.y - start.y) * t
		}
	}

	private _alg = (data:Dot[], delta:number):Dot => {
		if(data.length == 1) {
			return data[0];
		}

		let _result:Dot[] = [];
		for(var i=0; i < data.length-1; i++) {
			_result.push(this._calc(data[i], data[i+1],delta));
		}

		let _alpha = (this._complex) ? .1 : 1;

		for (var i=1 ; i < _result.length; i++) {
			this._drawLine(_result[i-1], _result[i],.5,`rgba(${colors[_result.length%5]}, ${_alpha})`);
		}

		if(!this._complex) {
			for(var j = 0; j < _result.length ; j++) {
				this._drawDot(_result[j], '', undefined, `rgb(${colors[_result.length%5]})`);
			}
		}

		return this._alg(_result, delta);
	}

	private _animate = () => {

		if (!this._complex) {
			this._clear();
			this._drawChords();

		}

		var result:Dot = this._alg(this._data, this._delta);
		
		if(this._complex) {
			this._drawLine(this._start, result, 2);
			this._start = result;
		} else {
			this._storage.push(result);
			for(var i = 0; i< this._storage.length - 1; i++) {
				this._drawLine(this._storage[i], this._storage[i+1], 2);
			}
		}

		if (this._delta > 1) {
			cancelAnimationFrame(this.animation);
			if(!this._complex) {
				this._clear();
				this._drawChords();
				for(var i = 0; i< this._storage.length - 1; i++) {
					this._drawLine(this._storage[i], this._storage[i+1], 2);
				}
			}
		} else {
			this._delta += 0.01;
			this.animation = requestAnimationFrame(this._animate);
		}
	}

	public changeType = (type:number) => {
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
	}

	public redraw = () => {
		this._clear();
		this._delta = 0;
		this._storage = [];
		this._start = this._data[0];
		this._reDraw();
	}

	public toggleSupport = () => {
		this._complex = !this._complex;
		this._clear();
		this._delta = 0;
		this._storage = [];
		this._start = this._data[0];
		this._reDraw();
	}

	public changeDegree = (degree:number) => {
		this._dots = Math.max(2, degree);
		this._clear();
		this._delta = 0;
		this._storage = [];
		this._reset();
	}

	public reset = () => {
	 	this._reset();
	}
}
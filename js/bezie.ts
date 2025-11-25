import type { Dot } from "./types";
enum letters {
	A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z
}

export default class Bezie {
	private _target: HTMLCanvasElement;
	private _dots:number = 3;
	private _data:Dot[] = [];
	private _support:Boolean = true;

	private _delta:number = 0;
	private _start:Dot = { x:0, y:0 };

	private _userClickCouner: number = 0;

	private animation: any;

	constructor (target:HTMLCanvasElement) {
		this._target = target;
		this.init();
	}

	private _clear = ():void => {
		const rect = this._target.getBoundingClientRect();
		this._target.getContext('2d')?.clearRect(0,0,rect.width,rect.height);
		this._delta = 0;
	}

	private _reset = ():void => {
		this._clear();

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

	private _drawDot = (dot:Dot, text?:string, font?:string) => {
		let ctx = this._target.getContext('2d') as CanvasRenderingContext2D;
		if(text !== undefined) {
			ctx.font = font || '13px Arial';
			ctx.fillStyle = '#333';
			ctx.fillText(text, dot.x, dot.y - 5);
		}
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.arc(dot.x, dot.y, 2, 0 , 2*Math.PI);
		ctx.fill();
	}

	private _reDraw = () => {
		for (var i=0 ; i < this._data.length; i++) {
			if (i>0) {
				this._drawLine(this._data[i-1], this._data[i],.5,'rgba(0,0,0,.5)');
			}
			this._drawDot(this._data[i], letters[i]);
		}

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
		this._reDraw();
		this._userClickCouner = (this._userClickCouner + 1) % this._dots;
	}

	private _calc = (start:Dot, end:Dot, t:number):Dot => {
		return {
			x: start.x + (end.x - start.x) * t,
			y: start.y + (end.y - start.y) * t
		}
	}

	private _animate = () => {
		switch (this._dots) {
			case 4:
				var p1 = this._calc(this._data[0], this._data[1], this._delta);
				var p2 = this._calc(this._data[1], this._data[2], this._delta);
				var p3 = this._calc(this._data[2], this._data[3], this._delta);
				var q1 = this._calc(p1,p2,this._delta);
				var q2 = this._calc(p2,p3,this._delta);
				var result = this._calc(q1,q2,this._delta);

				if(this._support) {
					this._drawLine(p1,p2,.5,'rgba(102,255,102,.2)');
					this._drawLine(p2,p3,.5,'rgba(102,255,102,.2)');
					this._drawLine(q1,q2,.5,'rgba(255,102,102,.4)');
				}
				this._drawLine(this._start, result, 2);
				this._start = result;
				break;

			case 3: {
				var p1 = this._calc(this._data[0], this._data[1], this._delta);
				var p2 = this._calc(this._data[1], this._data[2], this._delta);
				var result = this._calc(p1,p2,this._delta);

				if(this._support) {
					this._drawLine(p1,p2,.5,'rgba(102,255,102,.2)');
				}
				this._drawLine(this._start, result, 2);
				this._start = result;
				break;         
			}

			default:
				break;
		}

		if (this._delta > 1) {
			cancelAnimationFrame(this.animation);
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
		this._start = this._data[0];
		this._reDraw();
	}

	public toggleSupport = () => {
		this._support = !this._support;
		this._clear();
		this._start = this._data[0];
		this._reDraw();
	}

	public reset = () => {
	 	this._reset();
	}
}
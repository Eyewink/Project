import type { Dot } from "./types";
enum letters {
	A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z
}

export default class Bspline {
	private _target: HTMLCanvasElement;
	private _type:string = 'simple';
	private _data:Dot[] = [];

	private _delta:number = 0;
	private _offset:number = 0;
	private _start:Dot = { x:0, y:0 };

	private _userClickCouner: number = 0;
	private _autoConstract:boolean = false;

	private animation: any;
	private _speed:number = 100;

	
	constructor (target:HTMLCanvasElement) {
		this._target = target;
		this.init();
	}

	private _clear = ():void => {
		const rect = this._target.getBoundingClientRect();
		this._target.getContext('2d')?.clearRect(0,0,rect.width,rect.height);
		this._delta = 0;
		this._offset = 0;
	}

	private _reset = ():void => {
		this._clear();
		cancelAnimationFrame(this.animation);

		this._data = [];
		for(let i=0; i < 4; i++) {
			let dot = this._addPoint();
			this._data.push(dot);
		}

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

	private _drawSub = (dot:Dot, text:string) => {
		let ctx = this._target.getContext('2d') as CanvasRenderingContext2D;
		ctx.font = `9px Arial`;
		ctx.fillStyle = '#999';
		ctx.fillText(text, dot.x + 10, dot.y - 5);
	}

	private _drawDot = (dot:Dot, text?:string, font?:string) => {
		let ctx = this._target.getContext('2d') as CanvasRenderingContext2D;
		if(text !== undefined) {
			ctx.font = font || '13px Arial';
			ctx.fillStyle = '#333';
			ctx.textBaseline = 'bottom';
			ctx.fillText(text, dot.x, dot.y - 5);
		}
		if(this._type == 'complex') {
			this._drawSub(dot, String(Math.floor(this._data.length / 27)))
		}
		ctx.beginPath();
		ctx.fillStyle = 'red';
		ctx.arc(dot.x, dot.y, 2, 0 , 2*Math.PI);
		ctx.fill();
	}

	private _reDraw = () => {
		for (var i=0 ; i < this._data.length; i++) {
			if (i > 0) {
				this._drawLine(this._data[i-1], this._data[i],.5,'rgba(0,0,0,.5)');
			}
			this._drawDot(this._data[i], letters[i]);
		}

		if (this._data.length == 4) {
			this._start = this._calc(this._data[0], this._data[1], this._data[2], this._data[3], 0);
			this.animation = requestAnimationFrame(this._animate);
		}
	}

	private _userClick = (dot:Dot) => {
		switch (this._type) {
			case 'simple':
				cancelAnimationFrame(this.animation);

				if(this._userClickCouner == 0) {
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
				this._drawLine(this._data[length-1], this._data[length],.5,'rgba(0,0,0,.5)');
				this._drawDot(this._data[length], letters[length % 26]);
				
				if(!this.animation) {
					this.animation = requestAnimationFrame(this._animate);
				}
				break;
			default:
				break;
		}
		
	}

	private _calc = (p1:Dot, p2:Dot, p3:Dot, p4:Dot,  t:number):Dot => {
		let m1 = (1 - t) ** 3 / 6;
		let m2 = (3 * t ** 3 - 6 * t ** 2 + 4) / 6;
		let m3 = (-3 * t ** 3 + 3 * t ** 2 + 3 * t + 1) / 6;
		let m4 = t ** 3 / 6;
		
		return {
			x: m1 * p1.x +  m2 * p2.x +  m3 * p3.x +  m4 * p4.x,
			y: m1 * p1.y +  m2 * p2.y +  m3 * p3.y +  m4 * p4.y
		}
	}

	private _animate = () => {

		var result = this._calc(this._data[this._offset], this._data[this._offset+1], this._data[this._offset+2], this._data[this._offset+3], this._delta);

		this._drawLine(this._start, result, 2);
		this._start = result;

		if (this._delta > 1) {
			switch (this._type) {
				case 'simple':
					cancelAnimationFrame(this.animation);
					break;
				case 'complex':
					if(this._offset == this._data.length - 4 && this._autoConstract) {
						let dot = this._addPoint();
						this._data.push(dot);
						
						let length = this._data.length - 1;
						this._drawLine(this._data[length-1], this._data[length],.5,'rgba(0,0,0,.5)');
						this._drawDot(this._data[length], letters[length % 26]);
					}
					
					if(this._offset < this._data.length - 4) {
						this._offset++;
						this._delta = 0;
						this.animation = requestAnimationFrame(this._animate);
					} else {
						cancelAnimationFrame(this.animation);
						this._offset++;
						this._delta = 0;
						this.animation = null;
					}
					break;
				default:
					break;
			}
		} else {
			this._delta += 1 / (200 - this._speed);
			this.animation = requestAnimationFrame(this._animate);
		}
	}

	public get_next_dot = ():Dot =>{
		this._delta+=0.01
		if(this._delta>=1){
			this._delta = 0;
			let dot = this._addPoint();
			this._data.push(dot);
			this._data.shift();
		}
		return this._calc(this._data[0], this._data[1], this._data[2], this._data[3], this._delta);
	}



	public changeType = (type:string) => {
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
	}
	public redraw = () => {
		this._clear();
		this._start = this._calc(this._data[0], this._data[1], this._data[2], this._data[3], 0);
		this._reDraw();
	}

	public toggleSupport = () => {
		this._autoConstract = !this._autoConstract;
	}

	public reset = () => {
	 	this._reset();
	}

	public clear = () => {
		cancelAnimationFrame(this.animation);
		this._clear();
	}

	public setSpeed = (value:number) => {
		value = Math.max(Math.min(value, 100), 0);
		this._speed = value;
	}
}
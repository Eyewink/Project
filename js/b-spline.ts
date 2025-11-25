import type { Dot } from "./types";
enum letters {
    A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z
}

export default class B_Spline{
    private _target: HTMLCanvasElement;
    private _data:Dot[] = [];
    private _delta:number = 0;
    private _start:Dot = { x:0, y:0 };
    private dot_counter:number = 0;
    private _text_num:number = 0;
    private animation: any;

    constructor (target:HTMLCanvasElement) {
        this._target = target;
        this.init();
    }

    private clear = ():void => {
        const rect = this._target.getBoundingClientRect();
        this._target.getContext('2d')?.clearRect(0,0,rect.width,rect.height);
        this._delta = 0;
    }

    private init = ():void => {
        this.reset();

        this._target.addEventListener('click', (e) => {
            const rect = this._target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.userClick({x:x, y:y});
        });
    }

    private addPoint = (_x?:number, _y?:number):Dot => {
        
        const rect = this._target.getBoundingClientRect();
        let __x = _x || rect.width * Math.random();
        let __y = _y || rect.height * Math.random();
        
        return { 
            x: __x,
            y: __y
        }
    }

    private drawDot = (dot:Dot, text?:string, font?:string) => {
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

    private userClick = (dot:Dot) => {
        this._delta = 0;
        this._data.push(dot);
        this.dot_counter += 1;
        this.drawDot(this._data[this.dot_counter],letters[this.dot_counter%26]+(Math.floor((this.dot_counter+1)/26)).toString());
        this.drawLine(this._data[this.dot_counter],this._data[this.dot_counter-1],0.5,'rgba(0,0,0,.5)')
    }
    private drawLine = (start:Dot, end:Dot, lineWidth?:number, strokeStyle?:string) => {
        let ctx = this._target.getContext('2d') as CanvasRenderingContext2D;
        ctx.beginPath();
        ctx.lineWidth = lineWidth || 1;
        ctx.strokeStyle = strokeStyle || 'rgba(51, 102, 255, 1)';
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }

    private animate = () => {
        if (this._delta > 1) {
            this.dot_counter += 1;
            if (this.dot_counter > this._data.length-1){
                var dot = this.addPoint();
                this._data.push(dot);
                this.drawDot(this._data[this.dot_counter],letters[this.dot_counter%26]+(Math.floor((this.dot_counter+1)/26)).toString());
                this.drawLine(this._data[this.dot_counter],this._data[this.dot_counter-1],0.5,'rgba(0,0,0,.5)')
            }

            this._delta = 0;
        }
        this._delta += 0.01;
        this.animation = requestAnimationFrame(this.animate);
    }

    public reset = ():void => {
        cancelAnimationFrame(this.animation);
        this.clear();

        this.dot_counter = 0;
        this._data = [];

        var dot = this.addPoint();
        this._data.push(dot);
        
        this._start = this._data[0];
        this.drawDot(this._data[0],letters[0]+JSON.stringify(this._text_num))
        this.animation = requestAnimationFrame(this.animate);
    }

}
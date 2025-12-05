import Bezie from './bezie.js';
import Bspline from './bspline.js';
import { Dot } from './types.js';

var init = ():void => {
	const canvas_bezie = document.getElementById('bezie') as HTMLCanvasElement;
	const canvas_bezie_demo = document.getElementById('bezie_demo') as HTMLCanvasElement;
	const canvas_bspline = document.getElementById('bspline') as HTMLCanvasElement;
	const canvas_bspline_demo = document.getElementById('bspline_demo') as HTMLCanvasElement;
	const bezie = new Bezie(canvas_bezie);
	const bezie_demo = new Bezie(canvas_bezie_demo);
	const bspline = new Bspline(canvas_bspline);
	const bspline_demo = new Bspline(canvas_bspline_demo);
	
	const parent = document.querySelector('body > section');
	
	let _width:any;
	function resizeCanvas() {
		if(parent?.clientWidth != _width) {
			_width = parent?.clientWidth;
			if (canvas_bezie !== null) canvas_bezie.width = (_width || 1000) - 2;
			if (canvas_bspline !== null) canvas_bspline.width = (_width || 1000) - 2;
			if (canvas_bezie_demo !== null) {
				canvas_bezie_demo.width = window.innerWidth;
				canvas_bezie_demo.height = window.innerHeight;
			}
			if(canvas_bspline_demo !== null) {
				canvas_bspline_demo.width = window.innerWidth;
				canvas_bspline_demo.height = window.innerHeight;
			}
			bezie.redraw();
			bspline.reset();
		}
	}

	bezie.reset();
	bspline.reset();
	bezie_demo.toggleSupport();
	bspline_demo.stop();

	resizeCanvas();

	window.addEventListener('resize', resizeCanvas);

	document.querySelector('input[name="bezie_degree"]')?.addEventListener('input', function(e) {
		const input = e.target as HTMLInputElement;
  		const value = input.value.replace(/\D/g, '');
		const numb = Math.min(17, parseInt(value));
    	input.value = numb.toString();
		bezie.changeDegree(parseInt(input?.value) + 1);
	});

	document.querySelector('#bezie_redraw_btn')?.addEventListener('click', function(e) {
		bezie.redraw();
	});

	document.querySelector('#bezie_reset_btn')?.addEventListener('click', function(e) {
		bezie.reset();
	});
	
	document.querySelector('#bezie_speed')?.addEventListener('input',function(e){
		const input = e.target as HTMLInputElement;
		bezie.setSpeed(parseInt(input?.value));
	});

	document.querySelector('#bezie_demo_btn')?.addEventListener('click', function(e) {
		document.querySelector('.bezie_demo')?.classList.add('visible');
		bezie_demo.demo();
	});

	document.querySelector('.bezie_demo')?.addEventListener('click', function(e) {
		document.querySelector('.bezie_demo')?.classList.remove('visible');
		bezie_demo.stop();
	});

	document.querySelectorAll('input[name="bspline_type"]').forEach(radio => {
		radio.addEventListener('change', function(e:Event) {
			let value = (e.target as HTMLInputElement).value;
			bspline.changeType(value);
		});
	});

	document.querySelector('#bspline_reset_btn')?.addEventListener('click', function(e) {
        bspline.reset();
    });

	document.querySelector('#bspline_auto_btn')?.addEventListener('click', function(e) {
		bspline.toggleSupport();
	});

	document.querySelector('#bspline_speed')?.addEventListener('input',function(e){
		const input = e.target as HTMLInputElement;
		bspline.setSpeed(parseInt(input?.value));
	});

	var bspline_animation: any;
	var bspline_coordinates:Dot[] = []
	const elements = Array.from(document.querySelectorAll<HTMLElement>('.kite_image'));

	for(var i = 0; i < elements.length * 4 + 1; i++) {
		bspline_coordinates.push(bspline_demo.get_next_dot());
	}

	document.querySelector('#bspline_demo_btn')?.addEventListener('click', function(e) {
		document.querySelector('.bspline_demo')?.classList.add('visible');
		bspline_animation = requestAnimationFrame(_bspline_animate);
	});
	
	document.querySelector('.bspline_demo')?.addEventListener('click', function(e) {
		document.querySelector('.bspline_demo')?.classList.remove('visible');
		cancelAnimationFrame(bspline_animation);
	});

	function _bspline_animate () {
		bspline_coordinates.push(bspline_demo.get_next_dot());
		bspline_coordinates.shift();
		elements.forEach((element, index) => {
			const coord = bspline_coordinates[index * 4 + 1];
			const prevPoint = bspline_coordinates[index * 4];

			element.style.left = `${coord.x}px`;
			element.style.top = `${coord.y}px`;
			const img = element.querySelector('img') as HTMLImageElement;
			if (prevPoint) {
				const dx = coord.x - prevPoint.x;
				const dy = coord.y - prevPoint.y;
				const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
				img.style.transform = `rotate(${angle}deg)`;
			}
		});
	
		bspline_animation = requestAnimationFrame(_bspline_animate)
	}
}

//document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', init);



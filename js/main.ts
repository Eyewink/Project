import Bezie from './bezie.js';
import Bspline from './bspline.js';

var init = ():void => {
	const canvas_bezie = document.getElementById('bezie') as HTMLCanvasElement;
	const canvas_bezie_demo = document.getElementById('bezie_demo') as HTMLCanvasElement;
	const canvas_bspline = document.getElementById('bspline') as HTMLCanvasElement;

	const bezie = new Bezie(canvas_bezie);
	const bezie_demo = new Bezie(canvas_bezie_demo);
	const bspline = new Bspline(canvas_bspline);

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
			bezie.redraw();
			bspline.reset();
		}
	}

	bezie.reset();
	bspline.reset();
	bezie_demo.toggleSupport();

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

	document.querySelector('#bezie_support_btn')?.addEventListener('click', function(e) {
		bezie.toggleSupport();
	});
	

	document.querySelector('#bezie_demo_btn')?.addEventListener('click', function(e) {
		document.querySelector('.demo')?.classList.add('visible');
		bezie_demo.demo();
	});
	document.querySelector('#bezie_speed')?.addEventListener('input',function(e){
		const input = e.target as HTMLInputElement;
		bezie.speed = parseInt(input?.value);
	});
	document.querySelector('#bezie_clear')?.addEventListener('click', function(e) {
		bezie.clear();
	});
	document.querySelector('.demo')?.addEventListener('click', function(e) {
		document.querySelector('.demo')?.classList.remove('visible');
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
		bspline.speed = parseInt(input?.value);
	});
	document.querySelector('#bspline_clear')?.addEventListener('click', function(e) {
		bspline.clear();
	});
}

//document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', init);
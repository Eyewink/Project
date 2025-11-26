import Bezie from './bezie.js';
import Bspline from './bspline.js';

var init = ():void => {
	const canvas_bezie = document.getElementById('bezie') as HTMLCanvasElement;
	const canvas_bezie2 = document.getElementById('bezie2') as HTMLCanvasElement;
	const canvas_bspline = document.getElementById('bspline') as HTMLCanvasElement;

	const bezie = new Bezie(canvas_bezie);
	const bezie2 = new Bezie(canvas_bezie2);
	bezie2.changeDegree(8);
	const bspline = new Bspline(canvas_bspline);

	const parent = document.querySelector('body > section');
	
	let _width:any = 0;
	function resizeCanvas() {
		if(parent?.clientWidth != _width) {
			_width = parent?.clientWidth;
			if (canvas_bezie !== null) canvas_bezie.width = (_width || 1000) - 2;
			if (canvas_bezie2 !== null) canvas_bezie2.width = (_width || 1000) - 2;
			if (canvas_bspline !== null) canvas_bspline.width = (_width || 1000) - 2;
			bezie.redraw();
			bezie2.redraw();
			bspline.reset();
		}
	}

	bezie.reset();
	bezie2.reset();
	bspline.reset();

	resizeCanvas();

	window.addEventListener('resize', resizeCanvas);

	document.querySelectorAll('input[name="bezie_type"]').forEach(radio => {
		radio.addEventListener('change', function(e:Event) {
			let value = (e.target as HTMLInputElement).value;
			bezie.changeType(parseInt(value));
		});
	});

	document.querySelectorAll('input[name="bspline_type"]').forEach(radio => {
		radio.addEventListener('change', function(e:Event) {
			let value = (e.target as HTMLInputElement).value;
			bspline.changeType(value);
		});
	});

	document.querySelector('input[name="bezie_Degree"]')?.addEventListener('input', function(e) {
		const input = e.target as HTMLInputElement;
  		const value = input.value.replace(/\D/g, '');
		const numb = Math.min(17, parseInt(value));
    	input.value = numb.toString();
		bezie2.changeDegree(parseInt(input?.value) + 1);
	});

	document.querySelector('#bezie_redraw')?.addEventListener('click', function(e) {
		bezie.redraw();
	});

	document.querySelector('#bezie2_redraw')?.addEventListener('click', function(e) {
		bezie2.redraw();
	});

	document.querySelector('#bezie_support')?.addEventListener('click', function(e) {
		bezie.toggleSupport();
	});

	document.querySelector('#bspline_redraw')?.addEventListener('click', function(e) {
        bspline.reset();
    });

	document.querySelector('#bspline_auto')?.addEventListener('click', function(e) {
		bspline.toggleSupport();
	});

}

document.addEventListener('DOMContentLoaded', init);
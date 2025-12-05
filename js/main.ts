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
	const bspline_demo = new Bspline(canvas_bspline);
	const elements = Array.from(document.querySelectorAll<HTMLElement>('.kite_image'));

	const parent = document.querySelector('body > section');
	var bspline_animation: any;
	var coordinates:Dot[] = []
	
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
	for(let i = 0;i<52;i++){
		coordinates.push(bspline_demo.get_next_dot());
	}
	bezie.reset();
	bspline.reset();
	bezie_demo.toggleSupport();
	bspline_demo.reset();
	bspline_demo.clear();
	resizeCanvas();


	elements.forEach((element, index) => {
		const targetIndex = index*4;
		const coord = coordinates[targetIndex];
		element.style.left = `${coord.x}px`;
		element.style.top = `${coord.y}px`;
		element.style.transform = 'translate(-50%, -50%)';})
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

	// document.querySelector('#bezie_support_btn')?.addEventListener('click', function(e) {
	// 	bezie.toggleSupport();
	// });
	
	document.querySelector('#bezie_demo_btn')?.addEventListener('click', function(e) {
		document.querySelector('.bezie_demo')?.classList.add('visible');
		bezie_demo.demo();
	});

	document.querySelector('#bezie_speed')?.addEventListener('input',function(e){
		const input = e.target as HTMLInputElement;
		bezie.setSpeed(parseInt(input?.value));
	});
	// document.querySelector('#bezie_clear')?.addEventListener('click', function(e) {
	// 	bezie.clear();
	// });

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

	// document.querySelector('#bspline_clear')?.addEventListener('click', function(e) {
	// 	bspline.clear();
	// });


	document.querySelector('#bspline_demo_btn')?.addEventListener('click', function(e) {
		document.querySelector('.bspline_demo')?.classList.add('visible');
		bspline_animation = requestAnimationFrame(_bspline_animate);
	});
	
	document.querySelector('.bspline_demo')?.addEventListener('click', function(e) {
		document.querySelector('.bspline_demo')?.classList.remove('visible');
		cancelAnimationFrame(bspline_animation);
	});
	function _bspline_animate(){
		coordinates.push(bspline_demo.get_next_dot());
		coordinates.shift();
		elements.forEach((element, index) => {
			const targetIndex = index*4;
			const coord = coordinates[targetIndex];
			const next_coord = coordinates[index+1];

			element.style.left = `${coord.x}px`;
			element.style.top = `${coord.y}px`;
			element.style.transform = 'translate(-50%, -50%)';
			const img = element.querySelector<HTMLImageElement>('img');
			if (next_coord) {
				const dx = next_coord.x - coord.x;
				const dy = next_coord.y - coord.y;

				// Вычисляем угол в градусах
				let angle = Math.atan2(dy, dx) * (180 / Math.PI);
				angle -= 90;

				img.style.transform = `rotate(${angle}deg)`;
				} else {
				const prevPoint = coordinates[index-1];
				if (prevPoint) {
					const dx = coord.x - prevPoint.x;
					const dy = coord.y - prevPoint.y;
					const angle = Math.atan2(dy, dx) * (180 / Math.PI);
					img.style.transform = `rotate(${angle}deg)`;}
      }
		}
		
		
	);
	bspline_animation = requestAnimationFrame(_bspline_animate)

	}
}

//document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', init);



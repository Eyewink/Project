import Bezie from './bezie.js';
import Bspline from './bspline.js';
var init = () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const canvas_bezie = document.getElementById('bezie');
    const canvas_bezie_demo = document.getElementById('bezie_demo');
    const canvas_bspline = document.getElementById('bspline');
    const canvas_bspline_demo = document.getElementById('bspline_demo');
    const bezie = new Bezie(canvas_bezie);
    const bezie_demo = new Bezie(canvas_bezie_demo);
    const bspline = new Bspline(canvas_bspline);
    const bspline_demo = new Bspline(canvas_bspline);
    const elements = Array.from(document.querySelectorAll('.kite_image'));
    const parent = document.querySelector('body > section');
    var bspline_animation;
    var coordinates = [];
    let _width;
    function resizeCanvas() {
        if ((parent === null || parent === void 0 ? void 0 : parent.clientWidth) != _width) {
            _width = parent === null || parent === void 0 ? void 0 : parent.clientWidth;
            if (canvas_bezie !== null)
                canvas_bezie.width = (_width || 1000) - 2;
            if (canvas_bspline !== null)
                canvas_bspline.width = (_width || 1000) - 2;
            if (canvas_bezie_demo !== null) {
                canvas_bezie_demo.width = window.innerWidth;
                canvas_bezie_demo.height = window.innerHeight;
            }
            bezie.redraw();
            bspline.reset();
        }
    }
    for (let i = 0; i < 52; i++) {
        coordinates.push(bspline_demo.get_next_dot());
    }
    bezie.reset();
    bspline.reset();
    bezie_demo.toggleSupport();
    bspline_demo.reset();
    bspline_demo.clear();
    resizeCanvas();
    elements.forEach((element, index) => {
        const targetIndex = index * 4;
        const coord = coordinates[targetIndex];
        element.style.left = `${coord.x}px`;
        element.style.top = `${coord.y}px`;
        element.style.transform = 'translate(-50%, -50%)';
    });
    window.addEventListener('resize', resizeCanvas);
    (_a = document.querySelector('input[name="bezie_degree"]')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', function (e) {
        const input = e.target;
        const value = input.value.replace(/\D/g, '');
        const numb = Math.min(17, parseInt(value));
        input.value = numb.toString();
        bezie.changeDegree(parseInt(input === null || input === void 0 ? void 0 : input.value) + 1);
    });
    (_b = document.querySelector('#bezie_redraw_btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (e) {
        bezie.redraw();
    });
    (_c = document.querySelector('#bezie_reset_btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (e) {
        bezie.reset();
    });
    // document.querySelector('#bezie_support_btn')?.addEventListener('click', function(e) {
    // 	bezie.toggleSupport();
    // });
    (_d = document.querySelector('#bezie_demo_btn')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function (e) {
        var _a;
        (_a = document.querySelector('.bezie_demo')) === null || _a === void 0 ? void 0 : _a.classList.add('visible');
        bezie_demo.demo();
    });
    (_e = document.querySelector('#bezie_speed')) === null || _e === void 0 ? void 0 : _e.addEventListener('input', function (e) {
        const input = e.target;
        bezie.setSpeed(parseInt(input === null || input === void 0 ? void 0 : input.value));
    });
    // document.querySelector('#bezie_clear')?.addEventListener('click', function(e) {
    // 	bezie.clear();
    // });
    (_f = document.querySelector('.bezie_demo')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', function (e) {
        var _a;
        (_a = document.querySelector('.bezie_demo')) === null || _a === void 0 ? void 0 : _a.classList.remove('visible');
        bezie_demo.stop();
    });
    document.querySelectorAll('input[name="bspline_type"]').forEach(radio => {
        radio.addEventListener('change', function (e) {
            let value = e.target.value;
            bspline.changeType(value);
        });
    });
    (_g = document.querySelector('#bspline_reset_btn')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', function (e) {
        bspline.reset();
    });
    (_h = document.querySelector('#bspline_auto_btn')) === null || _h === void 0 ? void 0 : _h.addEventListener('click', function (e) {
        bspline.toggleSupport();
    });
    (_j = document.querySelector('#bspline_speed')) === null || _j === void 0 ? void 0 : _j.addEventListener('input', function (e) {
        const input = e.target;
        bspline.setSpeed(parseInt(input === null || input === void 0 ? void 0 : input.value));
    });
    // document.querySelector('#bspline_clear')?.addEventListener('click', function(e) {
    // 	bspline.clear();
    // });
    (_k = document.querySelector('#bspline_demo_btn')) === null || _k === void 0 ? void 0 : _k.addEventListener('click', function (e) {
        var _a;
        (_a = document.querySelector('.bspline_demo')) === null || _a === void 0 ? void 0 : _a.classList.add('visible');
        bspline_animation = requestAnimationFrame(_bspline_animate);
    });
    (_l = document.querySelector('.bspline_demo')) === null || _l === void 0 ? void 0 : _l.addEventListener('click', function (e) {
        var _a;
        (_a = document.querySelector('.bspline_demo')) === null || _a === void 0 ? void 0 : _a.classList.remove('visible');
        cancelAnimationFrame(bspline_animation);
    });
    function _bspline_animate() {
        coordinates.push(bspline_demo.get_next_dot());
        coordinates.shift();
        elements.forEach((element, index) => {
            const targetIndex = index * 4;
            const coord = coordinates[targetIndex];
            const next_coord = coordinates[index + 1];
            element.style.left = `${coord.x}px`;
            element.style.top = `${coord.y}px`;
            element.style.transform = 'translate(-50%, -50%)';
            const img = element.querySelector('img');
            if (next_coord) {
                const dx = next_coord.x - coord.x;
                const dy = next_coord.y - coord.y;
                // Вычисляем угол в градусах
                let angle = Math.atan2(dy, dx) * (180 / Math.PI);
                angle -= 90;
                img.style.transform = `rotate(${angle}deg)`;
            }
            else {
                const prevPoint = coordinates[index - 1];
                if (prevPoint) {
                    const dx = coord.x - prevPoint.x;
                    const dy = coord.y - prevPoint.y;
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                    img.style.transform = `rotate(${angle}deg)`;
                }
            }
        });
        bspline_animation = requestAnimationFrame(_bspline_animate);
    }
};
//document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', init);

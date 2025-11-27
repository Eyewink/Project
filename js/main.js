import Bezie from './bezie.js';
import Bspline from './bspline.js';
var init = () => {
    var _a, _b, _c, _d, _e, _f;
    const canvas_bezie = document.getElementById('bezie');
    const canvas_bspline = document.getElementById('bspline');
    const bezie = new Bezie(canvas_bezie);
    const bspline = new Bspline(canvas_bspline);
    const parent = document.querySelector('body > section');
    let _width;
    function resizeCanvas() {
        if ((parent === null || parent === void 0 ? void 0 : parent.clientWidth) != _width) {
            _width = parent === null || parent === void 0 ? void 0 : parent.clientWidth;
            if (canvas_bezie !== null)
                canvas_bezie.width = (_width || 1000) - 2;
            if (canvas_bspline !== null)
                canvas_bspline.width = (_width || 1000) - 2;
            bezie.redraw();
            bspline.reset();
        }
    }
    bezie.reset();
    bspline.reset();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    (_a = document.querySelector('input[name="bezie_degree"]')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', function (e) {
        const input = e.target;
        const value = input.value.replace(/\D/g, '');
        const numb = Math.min(17, parseInt(value));
        input.value = numb.toString();
        bezie.changeDegree(parseInt(input === null || input === void 0 ? void 0 : input.value) + 1);
    });
    (_b = document.querySelector('#bezie_redraw')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (e) {
        bezie.redraw();
    });
    (_c = document.querySelector('#bezie_reset')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (e) {
        bezie.reset();
    });
    (_d = document.querySelector('#bezie_support')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function (e) {
        bezie.toggleSupport();
    });
    document.querySelectorAll('input[name="bspline_type"]').forEach(radio => {
        radio.addEventListener('change', function (e) {
            let value = e.target.value;
            bspline.changeType(value);
        });
    });
    (_e = document.querySelector('#bspline_reset')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', function (e) {
        bspline.reset();
    });
    (_f = document.querySelector('#bspline_auto')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', function (e) {
        bspline.toggleSupport();
    });
};
//document.addEventListener('DOMContentLoaded', init);
window.addEventListener('load', init);

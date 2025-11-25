import Bezie from './bezie.js';
import Bspline from './bspline.js';
var init = () => {
    var _a, _b, _c, _d;
    const canvas_bezie = document.getElementById('bezie');
    const canvas_bspline = document.getElementById('bspline');
    const bezie = new Bezie(canvas_bezie);
    const bspline = new Bspline(canvas_bspline);
    const parent = document.querySelector('body > section');
    let _width = 0;
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
    resizeCanvas();
    bezie.reset();
    bspline.reset();
    window.addEventListener('resize', resizeCanvas);
    document.querySelectorAll('input[name="bezie_type"]').forEach(radio => {
        radio.addEventListener('change', function (e) {
            let value = e.target.value;
            bezie.changeType(parseInt(value));
        });
    });
    document.querySelectorAll('input[name="bspline_type"]').forEach(radio => {
        radio.addEventListener('change', function (e) {
            let value = e.target.value;
            bspline.changeType(value);
        });
    });
    (_a = document.querySelector('#bezie_redraw')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
        bezie.redraw();
    });
    (_b = document.querySelector('#bezie_support')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function (e) {
        bezie.toggleSupport();
    });
    (_c = document.querySelector('#bspline_redraw')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function (e) {
        bspline.reset();
    });
    (_d = document.querySelector('#bspline_auto')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function (e) {
        bspline.toggleSupport();
    });
};
document.addEventListener('DOMContentLoaded', init);

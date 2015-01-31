define(["require", "exports", '../has', "./dom/View"], function (require, exports, has) {
    var View;
    if (has('host-browser')) {
        View = require('./dom/View');
    }
    return View;
});
//# sourceMappingURL=View.js.map
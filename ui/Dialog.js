define(["require", "exports", '../has', "./dom/Dialog"], function (require, exports, has) {
    var Dialog;
    if (has('host-browser')) {
        Dialog = require('./dom/Dialog');
    }
    return Dialog;
});
//# sourceMappingURL=Dialog.js.map
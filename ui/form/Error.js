define(["require", "exports", '../../has', "../dom/form/Error"], function (require, exports, has) {
    var ErrorWidget;
    if (has('host-browser')) {
        ErrorWidget = require('../dom/form/Error');
    }
    return ErrorWidget;
});
//# sourceMappingURL=Error.js.map
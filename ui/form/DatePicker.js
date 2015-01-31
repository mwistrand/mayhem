define(["require", "exports", '../../has', "../dom/form/DatePicker"], function (require, exports, has) {
    var DatePicker;
    if (has('host-browser')) {
        DatePicker = require('../dom/form/DatePicker');
    }
    return DatePicker;
});
//# sourceMappingURL=DatePicker.js.map
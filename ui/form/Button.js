define(["require", "exports", '../../has', "../dom/form/Button"], function (require, exports, has) {
    var Button;
    if (has('host-browser')) {
        Button = require('../dom/form/Button');
    }
    return Button;
});
//# sourceMappingURL=Button.js.map
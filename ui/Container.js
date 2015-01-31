define(["require", "exports", '../has', "./dom/Container"], function (require, exports, has) {
    var Container;
    if (has('host-browser')) {
        Container = require('./dom/Container');
    }
    return Container;
});
//# sourceMappingURL=Container.js.map
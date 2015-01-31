define(["require", "exports", '../has', "./dom/ListView"], function (require, exports, has) {
    var ListView;
    if (has('host-browser')) {
        ListView = require('./dom/ListView');
    }
    return ListView;
});
//# sourceMappingURL=ListView.js.map
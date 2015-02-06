define(["require", "exports", 'intl-messageformat', "../has!intl?:intl"], function (require, exports, ImportedIntlMessageFormat) {
    var out;
    if (typeof IntlMessageFormat !== 'undefined') {
        out = IntlMessageFormat;
    }
    else {
        out = ImportedIntlMessageFormat;
    }
    return out;
});
//# sourceMappingURL=IntlMessageFormat.js.map
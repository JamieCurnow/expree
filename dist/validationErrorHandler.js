"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorHandler = void 0;
var express_validation_1 = require("express-validation");
var detailsKeys = ['body', 'cookies', 'headers', 'params', 'query', 'signedCookies'];
/** Helper function for parsing error details */
var parseDetail = function (detail) {
    return detail.map(function (x) {
        return {
            path: x.path.join('.'),
            message: x.message
        };
    });
};
/** The validation error middleware makes the validation error messages nicer */
var validationErrorHandler = function (err, _, res, __) {
    if (err instanceof express_validation_1.ValidationError) {
        var details_1 = {};
        detailsKeys.forEach(function (key) {
            // These are types incorrectly in express-validation so we cast them
            var deet = err.details[key];
            if (deet)
                details_1[key] = parseDetail(deet);
        });
        return res.status(err.statusCode).json(__assign(__assign({}, err), { details: details_1 }));
    }
    return res.status(500).json(err);
};
exports.validationErrorHandler = validationErrorHandler;

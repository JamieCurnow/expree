"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutes = exports.parseRouteDefinition = exports.defineRoute = exports.defineRoutes = void 0;
var express_validation_1 = require("express-validation");
var fs = require("fs");
var Joi = require("joi");
var path = require("path");
var fsPromises = fs.promises;
exports.defineRoutes = function (opts) { return opts; };
exports.defineRoute = function (opts) { return opts; };
// Parsing
exports.parseRouteDefinition = function (app, path, route, type) {
    var handler = route.handler, validate = route.validate, middleware = route.middleware;
    // Error if no handler
    if (!handler)
        throw new Error("No handler found for " + type + " request at " + path);
    // Make an array to hold express handlers, including any middleware
    var handlers = [];
    // Add middleware if any
    if (middleware && middleware.length)
        handlers = middleware;
    // Add validation middleware to the start of the array
    if (validate && typeof validate === 'function') {
        var validationObj = validate(Joi);
        var validationSchema = {
            body: validationObj.body ? Joi.object(validationObj.body) : undefined,
            query: validationObj.query ? Joi.object(validationObj.query) : undefined,
            params: validationObj.params ? Joi.object(validationObj.params) : undefined
        };
        handlers.unshift(express_validation_1.validate(validationSchema, { context: true, keyByField: true }));
    }
    // Add the actual handler to the end of the array
    var handlerProcessor = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, handler(req, res)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, res.headersSent || res.send(result)];
                case 2:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [2 /*return*/, res.headersSent || res.status(500).send('Server Error')];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    handlers.push(handlerProcessor);
    // Add the route to express
    return app[type].apply(app, __spreadArrays([path], handlers));
};
var appDir = path.dirname(require.main.filename);
var defaultDir = path.join(appDir, 'routes');
var getFilePaths = function (d) { return __awaiter(void 0, void 0, void 0, function () {
    var list, filteredFiles, filesArr;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, fsPromises.readdir(d, { withFileTypes: true })];
            case 1:
                list = _b.sent();
                filteredFiles = list.filter(function (x) { return !x.name.startsWith('_'); });
                return [4 /*yield*/, Promise.all(filteredFiles.map(function (x) {
                        var res = path.resolve(d, x.name);
                        return x.isDirectory() ? getFilePaths(res) : [res];
                    }))];
            case 2:
                filesArr = _b.sent();
                return [2 /*return*/, (_a = Array.prototype).concat.apply(_a, filesArr)];
        }
    });
}); };
var validationError = function (err, req, res, next) {
    if (err instanceof express_validation_1.ValidationError) {
        delete err.name;
        var e_2 = { code: 'validationError', message: 'Post body validation failed', details: {} };
        var details = err.details;
        details.forEach(function (deet) {
            for (var key in deet) {
                if (e_2.details[key]) {
                    e_2.details[key] = e_2.details[key] + (" | " + deet[key]);
                }
                else {
                    e_2.details[key] = deet[key];
                }
            }
        });
        return res.status(400).send(e_2);
    }
    return res.status(500).send(err);
};
var setupValidationError = function (app) {
    app.use(validationError);
};
exports.createRoutes = function (app, dir) { return __awaiter(void 0, void 0, void 0, function () {
    var d, filePaths;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                d = dir || defaultDir;
                return [4 /*yield*/, getFilePaths(d)];
            case 1:
                filePaths = _a.sent();
                filePaths.forEach(function (path) {
                    var routePath = path.split(d).join('').split('.').slice(0, -1).join('.').split('/index').join('');
                    var definition = require(path);
                    var isDefault = Object.prototype.hasOwnProperty.call(definition, 'default');
                    var routes = isDefault ? definition.default : definition;
                    var supportedKeys = ['delete', 'get', 'post', 'put'];
                    supportedKeys.forEach(function (key) {
                        var route = routes[key];
                        if (route)
                            exports.parseRouteDefinition(app, routePath, route, key);
                    });
                });
                setupValidationError(app);
                return [2 /*return*/, app];
        }
    });
}); };

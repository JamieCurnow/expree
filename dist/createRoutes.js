"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutes = void 0;
var path = __importStar(require("path"));
var getFilePaths_1 = require("./getFilePaths");
var makeRoutePathFromFilePath_1 = require("./makeRoutePathFromFilePath");
var parseRouteHandlers_1 = require("./parseRouteHandlers");
var validationErrorHandler_1 = require("./validationErrorHandler");
var getRoutesDirectories = function (opts) {
    var _a;
    // the absolute root dir of the app
    var appDir = path.dirname(((_a = require === null || require === void 0 ? void 0 : require.main) === null || _a === void 0 ? void 0 : _a.filename) || __dirname);
    return opts.map(function (x) {
        var routesDirectory = x.routesDirectory.includes(appDir)
            ? x.routesDirectory
            : path.join(appDir, x.routesDirectory);
        return {
            routesDirectory: routesDirectory,
            routePrefix: x.routePrefix || '/',
            // get the postix directory so it works in windows and unix
            postixDir: routesDirectory.split(path.sep).join(path.posix.sep)
        };
    });
};
/** Create all the routes and register them in the express app */
var createRoutes = function (app, options) { return __awaiter(void 0, void 0, void 0, function () {
    var optionsArray, directories, filePathsArray, filePaths, sortedFilePaths, supportedKeys;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                optionsArray = [];
                if (options) {
                    optionsArray = Array.isArray(options) ? options : [options];
                }
                else {
                    optionsArray = [{ routesDirectory: 'routes', routePrefix: '/' }];
                }
                directories = getRoutesDirectories(optionsArray);
                return [4 /*yield*/, Promise.all(directories.map(function (x) { return __awaiter(void 0, void 0, void 0, function () {
                        var filePaths;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getFilePaths_1.getFilePaths(x.routesDirectory)];
                                case 1:
                                    filePaths = _a.sent();
                                    return [2 /*return*/, filePaths.map(function (path) { return ({
                                            routesDirectory: x.routesDirectory,
                                            routePrefix: x.routePrefix,
                                            filePath: path,
                                            postixDir: x.postixDir
                                        }); })];
                            }
                        });
                    }); }))];
            case 1:
                filePathsArray = _b.sent();
                filePaths = (_a = Array.prototype).concat.apply(_a, filePathsArray);
                sortedFilePaths = filePaths.sort(function (a, b) {
                    var aIsDynamic = a.filePath.includes(':') || a.filePath.includes('_');
                    var bIsDynamic = b.filePath.includes(':') || b.filePath.includes('_');
                    return aIsDynamic && bIsDynamic ? 0 : aIsDynamic ? 1 : -1;
                });
                supportedKeys = [
                    'delete',
                    'get',
                    'post',
                    'put',
                    'options',
                    'head',
                    'connect',
                    'trace',
                    'patch'
                ];
                // loop over the paths
                sortedFilePaths.forEach(function (p) {
                    // make the route path from the file path
                    var routePath = makeRoutePathFromFilePath_1.makeRoutePathFromFilePath(p.filePath, p.postixDir, p.routePrefix);
                    // require the file
                    var definition = require(p.filePath);
                    // see if the export is the default export
                    var isDefault = Object.prototype.hasOwnProperty.call(definition, 'default');
                    // get the routes either by default export or named exports
                    var routes = isDefault ? definition.default : definition;
                    // loop over the supported keys and register any moethods that are exported by the route definition
                    supportedKeys.forEach(function (key) {
                        var route = routes[key];
                        if (route) {
                            // parse the handlers
                            var handlers = parseRouteHandlers_1.parseRouteHandlers(route);
                            // add them to express
                            app[key].apply(app, __spreadArray([routePath], handlers));
                        }
                    });
                });
                // set up the validation error handling so it returns nicer errors
                app.use(validationErrorHandler_1.validationErrorHandler);
                // return express
                return [2 /*return*/, app];
        }
    });
}); };
exports.createRoutes = createRoutes;

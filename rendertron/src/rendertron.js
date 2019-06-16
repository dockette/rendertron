"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
exports.__esModule = true;
var Koa = require("koa");
var bodyParser = require("koa-bodyparser");
var koaCompress = require("koa-compress");
var route = require("koa-route");
var koaSend = require("koa-send");
var koaLogger = require("koa-logger");
var path = require("path");
var puppeteer = require("puppeteer");
var url = require("url");
var renderer_1 = require("./renderer");
var config_1 = require("./config");
/**
 * Rendertron rendering service. This runs the server which routes rendering
 * requests through to the renderer.
 */
var Rendertron = /** @class */ (function () {
    function Rendertron() {
        this.app = new Koa();
        this.config = config_1.ConfigManager.config;
        this.port = process.env.PORT;
    }
    Rendertron.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, browser, DatastoreCache;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // Load config
                        _a = this;
                        return [4 /*yield*/, config_1.ConfigManager.getConfiguration()];
                    case 1:
                        // Load config
                        _a.config = _b.sent();
                        this.port = this.port || this.config.port;
                        return [4 /*yield*/, puppeteer.launch({ args: ['--no-sandbox'] })];
                    case 2:
                        browser = _b.sent();
                        this.renderer = new renderer_1.Renderer(browser, this.config);
                        this.app.use(koaLogger());
                        this.app.use(koaCompress());
                        this.app.use(bodyParser());
                        this.app.use(route.get('/', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, koaSend(ctx, 'index.html', { root: path.resolve(__dirname, '../src') })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }));
                        this.app.use(route.get('/_ah/health', function (ctx) { return ctx.body = 'OK'; }));
                        if (!this.config.datastoreCache) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.resolve().then(function () { return require('./datastore-cache'); })];
                    case 3:
                        DatastoreCache = (_b.sent()).DatastoreCache;
                        this.app.use(new DatastoreCache().middleware());
                        _b.label = 4;
                    case 4:
                        this.app.use(route.get('/render/:url(.*)', this.handleRenderRequest.bind(this)));
                        this.app.use(route.get('/screenshot/:url(.*)', this.handleScreenshotRequest.bind(this)));
                        this.app.use(route.post('/screenshot/:url(.*)', this.handleScreenshotRequest.bind(this)));
                        return [2 /*return*/, this.app.listen(this.port, function () {
                                console.log("Listening on port " + _this.port);
                            })];
                }
            });
        });
    };
    /**
     * Checks whether or not the URL is valid. For example, we don't want to allow
     * the requester to read the file system via Chrome.
     */
    Rendertron.prototype.restricted = function (href) {
        var parsedUrl = url.parse(href);
        var protocol = parsedUrl.protocol || '';
        if (!protocol.match(/^https?/)) {
            return true;
        }
        return false;
    };
    Rendertron.prototype.handleRenderRequest = function (ctx, url) {
        return __awaiter(this, void 0, void 0, function () {
            var mobileVersion, serialized;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.renderer) {
                            throw (new Error('No renderer initalized yet.'));
                        }
                        if (this.restricted(url)) {
                            ctx.status = 403;
                            return [2 /*return*/];
                        }
                        mobileVersion = 'mobile' in ctx.query ? true : false;
                        return [4 /*yield*/, this.renderer.serialize(url, mobileVersion)];
                    case 1:
                        serialized = _a.sent();
                        // Mark the response as coming from Rendertron.
                        ctx.set('x-renderer', 'rendertron');
                        ctx.status = serialized.status;
                        ctx.body = serialized.content;
                        return [2 /*return*/];
                }
            });
        });
    };
    Rendertron.prototype.handleScreenshotRequest = function (ctx, url) {
        return __awaiter(this, void 0, void 0, function () {
            var options, dimensions, mobileVersion, img, error_1, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.renderer) {
                            throw (new Error('No renderer initalized yet.'));
                        }
                        if (this.restricted(url)) {
                            ctx.status = 403;
                            return [2 /*return*/];
                        }
                        options = undefined;
                        if (ctx.method === 'POST' && ctx.request.body) {
                            options = ctx.request.body;
                        }
                        dimensions = {
                            width: Number(ctx.query['width']) || this.config.width,
                            height: Number(ctx.query['height']) || this.config.height
                        };
                        mobileVersion = 'mobile' in ctx.query ? true : false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.renderer.screenshot(url, mobileVersion, dimensions, options)];
                    case 2:
                        img = _a.sent();
                        ctx.set('Content-Type', 'image/jpeg');
                        ctx.set('Content-Length', img.length.toString());
                        ctx.body = img;
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        err = error_1;
                        ctx.status = err.type === 'Forbidden' ? 403 : 500;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Rendertron;
}());
exports.Rendertron = Rendertron;
function logUncaughtError(error) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.error('Uncaught exception');
            console.error(error);
            process.exit(1);
            return [2 /*return*/];
        });
    });
}
// Start rendertron if not running inside tests.
if (!module.parent) {
    var rendertron = new Rendertron();
    rendertron.initialize();
    process.on('uncaughtException', logUncaughtError);
    process.on('unhandledRejection', logUncaughtError);
}

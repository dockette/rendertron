"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var url = require("url");
var MOBILE_USERAGENT = 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.75 Mobile Safari/537.36';
/**
 * Wraps Puppeteer's interface to Headless Chrome to expose high level rendering
 * APIs that are able to handle web components and PWAs.
 */
var Renderer = /** @class */ (function () {
    function Renderer(browser, config) {
        this.browser = browser;
        this.config = config;
    }
    Renderer.prototype.serialize = function (requestUrl, isMobile) {
        return __awaiter(this, void 0, void 0, function () {
            /**
             * Executed on the page after the page has loaded. Strips script and
             * import tags to prevent further loading of resources.
             */
            function stripPage() {
                // Strip only script tags that contain JavaScript (either no type attribute or one that contains "javascript")
                var elements = document.querySelectorAll('script:not([type]), script[type*="javascript"], link[rel=import]');
                for (var _i = 0, _a = Array.from(elements); _i < _a.length; _i++) {
                    var e = _a[_i];
                    e.remove();
                }
            }
            /**
             * Injects a <base> tag which allows other resources to load. This
             * has no effect on serialised output, but allows it to verify render
             * quality.
             */
            function injectBaseHref(origin) {
                var base = document.createElement('base');
                base.setAttribute('href', origin);
                var bases = document.head.querySelectorAll('base');
                if (bases.length) {
                    // Patch existing <base> if it is relative.
                    var existingBase = bases[0].getAttribute('href') || '';
                    if (existingBase.startsWith('/')) {
                        bases[0].setAttribute('href', origin + existingBase);
                    }
                }
                else {
                    // Only inject <base> if it doesn't already exist.
                    document.head.insertAdjacentElement('afterbegin', base);
                }
            }
            var page, response, e_1, statusCode, newStatusCode, parsedUrl, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.browser.newPage()];
                    case 1:
                        page = _a.sent();
                        // Page may reload when setting isMobile
                        // https://github.com/GoogleChrome/puppeteer/blob/v1.10.0/docs/api.md#pagesetviewportviewport
                        return [4 /*yield*/, page.setViewport({ width: this.config.width, height: this.config.height, isMobile: isMobile })];
                    case 2:
                        // Page may reload when setting isMobile
                        // https://github.com/GoogleChrome/puppeteer/blob/v1.10.0/docs/api.md#pagesetviewportviewport
                        _a.sent();
                        if (isMobile) {
                            page.setUserAgent(MOBILE_USERAGENT);
                        }
                        page.evaluateOnNewDocument('customElements.forcePolyfill = true');
                        page.evaluateOnNewDocument('ShadyDOM = {force: true}');
                        page.evaluateOnNewDocument('ShadyCSS = {shimcssproperties: true}');
                        response = null;
                        // Capture main frame response. This is used in the case that rendering
                        // times out, which results in puppeteer throwing an error. This allows us
                        // to return a partial response for what was able to be rendered in that
                        // time frame.
                        page.addListener('response', function (r) {
                            if (!response) {
                                response = r;
                            }
                        });
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, page.goto(requestUrl, { timeout: this.config.timeout, waitUntil: 'networkidle0' })];
                    case 4:
                        // Navigate to page. Wait until there are no oustanding network requests.
                        response = _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 6];
                    case 6:
                        if (!!response) return [3 /*break*/, 8];
                        console.error('response does not exist');
                        // This should only occur when the page is about:blank. See
                        // https://github.com/GoogleChrome/puppeteer/blob/v1.5.0/docs/api.md#pagegotourl-options.
                        return [4 /*yield*/, page.close()];
                    case 7:
                        // This should only occur when the page is about:blank. See
                        // https://github.com/GoogleChrome/puppeteer/blob/v1.5.0/docs/api.md#pagegotourl-options.
                        _a.sent();
                        return [2 /*return*/, { status: 400, content: '' }];
                    case 8:
                        if (!(response.headers()['metadata-flavor'] === 'Google')) return [3 /*break*/, 10];
                        return [4 /*yield*/, page.close()];
                    case 9:
                        _a.sent();
                        return [2 /*return*/, { status: 403, content: '' }];
                    case 10:
                        statusCode = response.status();
                        return [4 /*yield*/, page
                                .$eval('meta[name="render:status_code"]', function (element) { return parseInt(element.getAttribute('content') || ''); })["catch"](function () { return undefined; })];
                    case 11:
                        newStatusCode = _a.sent();
                        // On a repeat visit to the same origin, browser cache is enabled, so we may
                        // encounter a 304 Not Modified. Instead we'll treat this as a 200 OK.
                        if (statusCode === 304) {
                            statusCode = 200;
                        }
                        // Original status codes which aren't 200 always return with that status
                        // code, regardless of meta tags.
                        if (statusCode === 200 && newStatusCode) {
                            statusCode = newStatusCode;
                        }
                        // Remove script & import tags.
                        return [4 /*yield*/, page.evaluate(stripPage)];
                    case 12:
                        // Remove script & import tags.
                        _a.sent();
                        parsedUrl = url.parse(requestUrl);
                        return [4 /*yield*/, page.evaluate(injectBaseHref, parsedUrl.protocol + "//" + parsedUrl.host)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate('document.firstElementChild.outerHTML')];
                    case 14:
                        result = _a.sent();
                        return [4 /*yield*/, page.close()];
                    case 15:
                        _a.sent();
                        return [2 /*return*/, { status: statusCode, content: result }];
                }
            });
        });
    };
    Renderer.prototype.screenshot = function (url, isMobile, dimensions, options) {
        return __awaiter(this, void 0, void 0, function () {
            var page, response, e_2, screenshotOptions, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.browser.newPage()];
                    case 1:
                        page = _a.sent();
                        // Page may reload when setting isMobile
                        // https://github.com/GoogleChrome/puppeteer/blob/v1.10.0/docs/api.md#pagesetviewportviewport
                        return [4 /*yield*/, page.setViewport({ width: dimensions.width, height: dimensions.height, isMobile: isMobile })];
                    case 2:
                        // Page may reload when setting isMobile
                        // https://github.com/GoogleChrome/puppeteer/blob/v1.10.0/docs/api.md#pagesetviewportviewport
                        _a.sent();
                        if (isMobile) {
                            page.setUserAgent(MOBILE_USERAGENT);
                        }
                        response = null;
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, page.goto(url, { timeout: 10000, waitUntil: 'networkidle0' })];
                    case 4:
                        // Navigate to page. Wait until there are no oustanding network requests.
                        response =
                            _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        console.error(e_2);
                        return [3 /*break*/, 6];
                    case 6:
                        if (!response) {
                            throw new ScreenshotError('NoResponse');
                        }
                        // Disable access to compute metadata. See
                        // https://cloud.google.com/compute/docs/storing-retrieving-metadata.
                        if (response.headers()['metadata-flavor'] === 'Google') {
                            throw new ScreenshotError('Forbidden');
                        }
                        screenshotOptions = Object.assign({}, options, { type: 'jpeg', encoding: 'binary' });
                        return [4 /*yield*/, page.screenshot(screenshotOptions)];
                    case 7:
                        buffer = _a.sent();
                        return [2 /*return*/, buffer];
                }
            });
        });
    };
    return Renderer;
}());
exports.Renderer = Renderer;
var ScreenshotError = /** @class */ (function (_super) {
    __extends(ScreenshotError, _super);
    function ScreenshotError(type) {
        var _this = _super.call(this, type) || this;
        _this.name = _this.constructor.name;
        _this.type = type;
        return _this;
    }
    return ScreenshotError;
}(Error));
exports.ScreenshotError = ScreenshotError;

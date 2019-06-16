/*
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 not
 * use this file except in compliance with the License. You may obtain a copy
 of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 under
 * the License.
 */
'use strict';
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
var Datastore = require("@google-cloud/datastore");
var DatastoreCache = /** @class */ (function () {
    function DatastoreCache() {
        this.datastore = new Datastore();
    }
    DatastoreCache.prototype.clearCache = function () {
        return __awaiter(this, void 0, void 0, function () {
            var query, data, entities, entityKeys;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.datastore.createQuery('Page');
                        return [4 /*yield*/, query.run()];
                    case 1:
                        data = _a.sent();
                        entities = data[0];
                        entityKeys = entities.map(function (entity) { return entity[_this.datastore.KEY]; });
                        console.log("Removing " + entities.length + " items from the cache");
                        return [4 /*yield*/, this.datastore["delete"](entityKeys)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatastoreCache.prototype.cacheContent = function (key, headers, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheDurationMinutes, now, entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cacheDurationMinutes = 60 * 24;
                        now = new Date();
                        entity = {
                            key: key,
                            data: [
                                { name: 'saved', value: now },
                                {
                                    name: 'expires',
                                    value: new Date(now.getTime() + cacheDurationMinutes * 60 * 1000)
                                },
                                {
                                    name: 'headers',
                                    value: JSON.stringify(headers),
                                    excludeFromIndexes: true
                                },
                                {
                                    name: 'payload',
                                    value: JSON.stringify(payload),
                                    excludeFromIndexes: true
                                },
                            ]
                        };
                        return [4 /*yield*/, this.datastore.save(entity)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Returns middleware function.
     */
    DatastoreCache.prototype.middleware = function () {
        var cacheContent = this.cacheContent.bind(this);
        return function (ctx, next) {
            return __awaiter(this, void 0, void 0, function () {
                var key, results, content, headers, payload;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = this.datastore.key(['Page', ctx.url]);
                            return [4 /*yield*/, this.datastore.get(key)];
                        case 1:
                            results = _a.sent();
                            if (results.length && results[0] !== undefined) {
                                content = results[0];
                                // Serve cached content if its not expired.
                                if (content.expires.getTime() >= new Date().getTime()) {
                                    headers = JSON.parse(content.headers);
                                    ctx.set(headers);
                                    ctx.set('x-rendertron-cached', content.saved.toUTCString());
                                    try {
                                        payload = JSON.parse(content.payload);
                                        if (payload && typeof (payload) === 'object' &&
                                            payload.type === 'Buffer') {
                                            payload = new Buffer(payload);
                                        }
                                        ctx.body = payload;
                                        return [2 /*return*/];
                                    }
                                    catch (error) {
                                        console.log('Erroring parsing cache contents, falling back to normal render');
                                    }
                                }
                            }
                            return [4 /*yield*/, next()];
                        case 2:
                            _a.sent();
                            if (ctx.status === 200) {
                                cacheContent(key, ctx.response.headers, ctx.body);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }.bind(this);
    };
    return DatastoreCache;
}());
exports.DatastoreCache = DatastoreCache;

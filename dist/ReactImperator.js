var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
define("Types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.generateName = function () {
        return Math.random()
            .toString(36)
            .substring(7);
    };
    exports.distinct = function (arr) {
        var container = arr.reduce(function (acc, cur) {
            acc[cur] = true;
            return acc;
        }, {});
        return Object.keys(container);
    };
});
define("ReactImperator", ["require", "exports", "react", "Utils"], function (require, exports, React, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var _a;
    exports.update = (_a = (function () {
        var callbacks = {};
        var contextState = {};
        var registerCallback = function (context, consumer, callback) {
            if (!callbacks[context]) {
                callbacks[context] = {};
            }
            callbacks[context][consumer] = callback;
        };
        var unregister = function (consumer) {
            Object.keys(callbacks).forEach(function (context) { return delete callbacks[context][consumer]; });
        };
        var updateContext = function (context, state) {
            Object.keys(callbacks[context]).forEach(function (subscriber) {
                var callback = callbacks[context][subscriber];
                if (!callback) {
                    return;
                }
                callback(state);
            });
        };
        return {
            update: function (context, producer) {
                if (!callbacks[context]) {
                    return;
                }
                var state = producer(contextState[context]);
                contextState[context] = state;
                updateContext(context, state);
            },
            connect: function (Component, contexts) {
                return /** @class */ (function (_super) {
                    __extends(class_1, _super);
                    function class_1(props) {
                        var _this = _super.call(this, props) || this;
                        _this.name = Utils_1.generateName();
                        var propContexts = Object.keys(props);
                        Utils_1.distinct(propContexts.concat(contexts || [])).forEach(function (context) {
                            registerCallback(context, _this.name, function (value) {
                                var _a;
                                if (!context) {
                                    return;
                                }
                                var newState = (_a = {}, _a[context] = value, _a);
                                _this.setState(function (state) { return (__assign({}, state, newState)); });
                            });
                            if (propContexts.indexOf(context) > -1) {
                                var value = props[context];
                                contextState[context] = value;
                            }
                        });
                        return _this;
                    }
                    class_1.prototype.render = function () {
                        return React.createElement(Component, __assign({}, this.state));
                    };
                    class_1.prototype.componentWillMount = function () {
                        var propContexts = Object.keys(this.props);
                        var extraContext = contexts || [];
                        Utils_1.distinct(propContexts.concat(extraContext)).forEach(function (context) {
                            exports.update(context, function (value) { return value; });
                        });
                    };
                    class_1.prototype.componentWillReceiveProps = function (props) {
                        this.setState(props);
                    };
                    class_1.prototype.componentWillUnmount = function () {
                        unregister(this.name);
                    };
                    return class_1;
                }(React.Component));
            }
        };
    })(), _a.update), exports.connect = _a.connect;
});
//# sourceMappingURL=ReactImperator.js.map
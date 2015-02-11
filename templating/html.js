define(["require", "exports", 'dojo/_base/array', 'dojo/_base/lang', './html/peg/html', '../util'], function (require, exports, arrayUtil, lang, parser, util) {
    function addBindings(BaseCtor) {
        var Ctor = function (kwArgs) {
            this._app = kwArgs['app'];
            BaseCtor.call(this, kwArgs);
        };
        __extends(Ctor, BaseCtor);
        Ctor.prototype._initialize = function () {
            BaseCtor.prototype._initialize.call(this);
            this.__bindingHandles = this.__bindingHandles || {};
            var self = this;
            this.__modelHandle = this.observe('model', function (value) {
                value = value || {};
                var bindingHandles = self.__bindingHandles;
                for (var key in bindingHandles) {
                    bindingHandles[key] && bindingHandles[key].setSource(value);
                }
            });
        };
        Ctor.prototype.destroy = function () {
            for (var key in this.__bindingHandles) {
                this.__bindingHandles[key].remove();
            }
            this.__modelHandle.remove();
            this.__parentModelHandle && this.__parentModelHandle.remove();
            this.__modelHandle = this.__parentModelHandle = this.__bindingHandles = this._model = null;
            BaseCtor.prototype.destroy.call(this);
        };
        Ctor.prototype._modelGetter = function () {
            if (this._model) {
                return this._model;
            }
            return this._parent && this._parent.get('model');
        };
        Ctor.prototype._modelSetter = function (value) {
            this.__parentModelHandle && this.__parentModelHandle.remove();
            this.__parentModelHandle = null;
            this._model = value;
        };
        Ctor.prototype._parentSetter = function (value) {
            this.__parentModelHandle && this.__parentModelHandle.remove();
            this.__parentModelHandle = null;
            var oldModel = this._parent && this._parent.get('model');
            this._parent = value;
            if (!this._model) {
                this._notify('model', value && value.get('model'), oldModel);
                if (value) {
                    var self = this;
                    this.__parentModelHandle = value.observe('model', function (newValue, oldValue) {
                        self._notify('model', newValue, oldValue);
                    });
                }
            }
        };
        Ctor.prototype._parentGetter = function () {
            return this._parent;
        };
        Ctor.prototype.set = function (key, value) {
            if (typeof key === 'string' && /^on[A-Z]/.test(key)) {
                var eventName = key.charAt(2).toLowerCase() + key.slice(3);
                if (value && value.$bind !== undefined) {
                    if (this.__bindingHandles[key]) {
                        this.__bindingHandles[key].setSource(this.get('model') || {}, value.$bind);
                    }
                    else {
                        var binder = this._app.get('binder');
                        var binding;
                        var rebind = function (object, path) {
                            if (path === void 0) { path = value.$bind; }
                            binding && binding.destroy();
                            binding = binder.createBinding(object || {}, path, { useScheduler: false });
                        };
                        rebind(this.get('model'));
                        var handle = this.on(eventName, function () {
                            var listener = binding.get();
                            if (typeof listener === 'function') {
                                return listener.apply(binding.getObject(), arguments);
                            }
                        });
                        this.__bindingHandles[key] = {
                            setSource: rebind,
                            remove: function () {
                                this.remove = function () {
                                };
                                binding.destroy();
                                handle.remove();
                                binder = value = binding = handle = null;
                            }
                        };
                    }
                }
                else {
                    this.on(eventName, function () {
                        if (this[value]) {
                            return this[value].apply(self, arguments);
                        }
                    });
                }
            }
            else if (value && value.$bind !== undefined) {
                if (value.$bind instanceof Array) {
                    value.$bind = arrayUtil.map(value.$bind, function (item) {
                        if (item.$bind) {
                            return { path: item.$bind };
                        }
                        return item;
                    });
                }
                if (this.__bindingHandles[key]) {
                    this.__bindingHandles[key].setSource(this.get('model') || {}, value.$bind);
                }
                else {
                    this.__bindingHandles[key] = this._app.get('binder').bind({
                        source: this.get('model') || {},
                        sourcePath: value.$bind,
                        target: this,
                        targetPath: key,
                        direction: value.direction
                    });
                }
            }
            else {
                BaseCtor.prototype.set.call(this, key, value);
            }
        };
        return Ctor;
    }
    var boundConstructors = {};
    function instantiate(Ctor, kwArgs) {
        if (typeof Ctor === 'string') {
            Ctor = boundConstructors[Ctor] = (boundConstructors[Ctor] || addBindings(require(Ctor)));
        }
        return new Ctor(kwArgs);
    }
    function createViewConstructor(root) {
        return function (kwArgs) {
            var staticArgs = (function visit(node, parent) {
                if (typeof node !== 'object') {
                    return node;
                }
                var value = node instanceof Array ? [] : {};
                if (node.$ctor) {
                    return createViewConstructor(node.$ctor);
                }
                for (var key in node) {
                    if (key === 'constructor') {
                        continue;
                    }
                    value[key] = visit(node[key], node);
                }
                if (node.constructor && node.constructor !== value.constructor && parent) {
                    value['app'] = kwArgs['app'];
                    value = instantiate(node.constructor, value);
                }
                return value;
            })(root);
            return instantiate(root.constructor, lang.mixin(staticArgs, kwArgs));
        };
    }
    function create(template) {
        var ast = parser.parse(template);
        return util.getModules(ast.constructors).then(function () {
            return createViewConstructor(ast.root);
        });
    }
    exports.create = create;
    function createFromFile(filename) {
        return util.getModule('dojo/text!' + filename).then(function (template) {
            return create(template);
        });
    }
    exports.createFromFile = createFromFile;
    function load(resourceId, _, load) {
        createFromFile(resourceId).then(load);
    }
    exports.load = load;
    function normalize(resourceId, normalize) {
        if (!/\.html(?:$|\?)/.test(resourceId)) {
            return normalize(resourceId.replace(/(\?|$)/, '.html$1'));
        }
        return normalize(resourceId);
    }
    exports.normalize = normalize;
});
//# sourceMappingURL=../_debug/templating/html.js.map
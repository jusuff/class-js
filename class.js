/*!
 * Class-based inheritance model for JavaScript
 * Copyright (c) 2011, Pawel Preneta <jusuff@jabster.pl>
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 * 
 * Inspired by Prototype and John Resig's Class
 * 
 * @fileOverview Class-based inheritance model for JavaScript
 * @version 1.0
 */

var Class = (function(){
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    function create() {
        "klass:nomunge"; // do not obfuscate constructor name 
        var parent = null, args = Array.prototype.slice.call(arguments);
        if (typeof args[0] == "function") {
            parent = args.shift();
        }

        function klass() {
            this.init.apply(this, arguments);
        }

        extend(klass, Methods);
        klass.superclass = parent;
        klass.subclasses = [];

        if (parent) {
            var subclass = function() {};
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            parent.subclasses.push(klass);
        }

        for (var i = 0; i < args.length; i++) {
            klass.addMethods(args[i]);
        }

        if (!klass.prototype.init) {
            klass.prototype.init = function() {};
        }

        klass.prototype.constructor = klass;

        return klass;
    }

    function extend(dest, source, safe) {
        safe = safe || false;
        for (var prop in source) {
            if (!dest[prop] || !safe) {
                dest[prop] = source[prop];
            }
        }
        return dest;
    }

    // allows to call class constructor with arguments list
    function construct(klass, args) {
        function F() {
            return klass.apply(this, args);
        }
        F.prototype = klass.prototype;
        return new F();
    }

    var Methods = {
        addMethods: function(source) {
            var ancestor = this.superclass && this.superclass.prototype;

            for (var name in source) {
                this.prototype[name] = typeof source[name] == "function" &&
                    ancestor && typeof ancestor[name] == "function" && fnTest.test(source[name]) ? (function(name, fn){
                    return function() {
                        this._super = function(method) {
                            return ancestor[method].apply(this, Array.prototype.slice.call(arguments, 1));
                        };
                        return fn.apply(this, arguments);
                    };
                })(name, source[name]) : source[name];
            }

            return this;
        }
    };

    return {
        create: create,
        extend: extend,
        construct: construct
    };

})();
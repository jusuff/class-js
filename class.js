/*!
 * Class-based inheritance model for JavaScript v1.0
 * Copyright (c) 2011, Pawel Preneta <jusuff@jabster.pl>
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 */
/**
 * @fileOverview Class-based inheritance model for JavaScript
 * @version 1.0
 */


/**
 * Class for managing class-based inheritance.<br />
 * It's based on Prototype's Class with some changes (the way of super method calls)
 * and the ability to call the constructor with a arguments list.
 * 
 * @namespace Class for managing class-based inheritance
 */
var Class = (function() {
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    /**
     * Creates a class and returns a constructor function for instances of the class.<br />
     * Calling returned constructor with "new" statement will create new class
     * instance and automatically invoke class's "init" method.<br />
     * Accepts two kind of params: <br />
     * - the first one - "superclass" - is optional and it can be other Class to extend; 
     *   if given - all its methods and properties are inherited by created class;
     *   one can access parent's methods calling "super" method (see examples)<br />
     * - other params are objects, which methods are copied to new class; if there's
     *   more then one object and method names are overlapping, later one take prcedence.
     * 
     * @example
     *  // create base class
     *  var Animal = Class.create({
     *      init: function(name, sound) {
     *          this.name  = name;
     *          this.sound = sound;
     *      },
     *      speak: function() {
     *          alert(this.name + ' says: ' + this.sound + '!');
     *      }
     *  });
     *  // extend base class
     *  var Snake = Class.create(Animal, {
     *      init: function(name) {
     *          this._super('init', name, 'hissssssssss');
     *      }
     *  });
     *  // create instance
     *  var ringneck = new Snake('Ringneck');
     *  ringneck.speak(); // alerts "Ringneck says: hissssssss!"
     * 
	 * @name Class.create
     * @static
	 * @function
     * 
     * @param {Class} [superclass] Optional superclass to extend
     * @param {Object} methods One or more objects with methods for new class
     * 
     * @return {Class} Class constructor
     */
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

    /**
     * Extends object by copying all properties from the source object to the destination object.<br />
     * By default source properties override destination properties, if such exists.
     * This can be avoided with safe param set to true.
     * 
     * @example
     *  // simple usage
     *  var dest = {
     *          a: 1
     *      },
     *      source = {
     *          a: 2,
     *          b: true
     *      };
     *  Class.extend(dest, source, true); // dest is now {a: 1, b: true}
     *  
     *  // extend Animal class with some static method
     *  Class.extend(Animal, {
     *      staticMethod: function() {
     *          alert('Animal.staticMethod called!');
     *      }
     *  });
     *  Animal.staticMethod(); // alerts "Animal.staticMethod called!"
     * 
	 * @name Class.extend
     * @static
	 * @function
     * 
     * @param {Object} dest Destination object, where new properties will be copied
     * @param {Object} source Source object
     * @param {Boolean} [safe=false] If set to true, the destination object properties won't be overwritten
     * 
     * @return {Object} Extended object
     */
    function extend(dest, source, safe) {
        safe = safe || false;
        for (var prop in source) {
            if (!dest[prop] || !safe) {
                dest[prop] = source[prop];
            }
        }
        return dest;
    }

    /**
     * Calls class constructor with an arbitrary number of arguments.<br />
     * Allows to simulate use of .apply() on class constructor.
     * 
     * @example
     *  var args = ['some name', 'some sound'];
     *  var instance = Class.construct(Animal, args); // works the same as new Animal('some name', 'some sound');
     * 
	 * @name Class.construct
     * @static
	 * @function
     * 
     * @param {Class} klass Class object
     * @param {Mixed} args Arguments to pass to klass constructor
     * 
     * @return {Class} New instance of given klass
     */
    function construct(klass, args) {
        function F() {
            return klass.apply(this, args);
        }
        F.prototype = klass.prototype;
        return new F();
    }

    var Methods = {
        /**
         * Allows to add new (or redefine existing) instance methods.<br />
         * This method is available on classes created by {@link Class.create}.<br />
         * New methods are added to all subclasses as well as the already instantiated instances.
         * 
         * @example
         *  var Animal = Class.create({
         *      init: function(name, sound) {
         *          this.name  = name;
         *          this.sound = sound;
         *      },
         *      speak: function() {
         *          alert(this.name + ' says: ' + this.sound + '!');
         *      }
         *  });
         *  var Bird = Class.create(Animal, {
         *      init: function(sound) {
         *          this._super('init', 'Bird', sound);
         *      }
         *  });
         *  var littleBird = new Bird('Bird', 'tweet, tweet');
         *  Animal.addMethods({
         *      speakLoud: function() {
         *          alert(this.name + ' says: ' + this.sound.toUpperCase() + '!');
         *      }
         *  });
         *  littleBird.speakLoud(); // alerts "Bird says: TWEET, TWEET!"
         * 
         * @name Class#addMethods
         * @function
         * 
         * @param {Object} source Source object containing methods to add
         * 
         * @return {Class}
         */
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
        },
        /**
         * Gets the class methods' names 
         * 
         * @example
         *  var Animal = Class.create({
         *      init: function(name, sound) {
         *          this.name  = name;
         *          this.sound = sound;
         *      },
         *      speak: function() {
         *          alert(this.name + ' says: ' + this.sound + '!');
         *      }
         *  });
         *  Animal.getMethods(); // returns ['init', 'speak']
         *  
         * @name Class#getMethods
         * @function
         * 
         * @return {Array} Array of class methods names
         */
        getMethods: function() {
            var methods = [];
            for (var name in this.prototype) {
                if (name != 'constructor' && typeof this.prototype[name] == "function") {
                    methods.push(name);
                }
            }
            return methods;
        },
        /**
         * Checks if the class method exists
         * 
         * @example
         *  var Animal = Class.create({
         *      init: function(name, sound) {
         *          this.name  = name;
         *          this.sound = sound;
         *      },
         *      speak: function() {
         *          alert(this.name + ' says: ' + this.sound + '!');
         *      }
         *  });
         *  Animal.hasMethod('speak'); // returns true
         *  Animal.hasMethod('speakQuietly'); // returns false
         * 
         * @name Class#hasMethod
         * @function
         * 
         * @param {String} name Method name to check
         * 
         * @return {Boolean}
         */
        hasMethod: function(name) {
            return typeof this.prototype[name] == "function";
        }
    };

    return {
        create: create,
        extend: extend,
        construct: construct
    };

})();
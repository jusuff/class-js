# Class-based inheritance model for JavaScript

## About

Yet another javascript Class for managing class-based inheritance. 
It's mostly based on Prototype's Class (but independent of Prototype.js and in fact fully "framework-agnostic")
with some ideas from John Resig's [Simple Class](http://ejohn.org/blog/simple-javascript-inheritance/).

Main difference is the way of super method calls. It's done by "_super" method which takes method name as first param:

    this._super('parentsMethod', arg1, arg2, ... );

One more difference are utility methods:
* "Class.construct" which allows to simulate "apply()" on class cunstructor to init new instance with arguments list (see examples).
* getMethods and hasMethods for get/check class methods.

Released under the MIT License.

## Examples

### Basic class creation

    var Animal = Class.create({
        init: function(name, sound) {
            this.name  = name;
            this.sound = sound;
        },
        speak: function() {
            alert(this.name + ' says: ' + this.sound + '!');
        }
    });

### Subclassing

    var Snake = Class.create(Animal, {
        init: function(name) {
            this._super('init', name, 'hissssssssss'); // calling parent's init method
        }
    });
    var ringneck = new Snake('Ringneck');
    ringneck.speak(); // alerts "Ringneck says: hissssssss!"

### Adding new method

    Snake.addMethods({
        speak: function() {
            this._super('speak');
            alert('You should probably run. He looks really mad.');
        }
    });
    ringneck.speak(); // alerts "Ringneck says: hissssssss!"; alerts "You should probably run. He looks really mad."

### Redefining method

Notice that new methods are added (or redefined) to all subclasses as well as the already instantiated instances.

    Animal.addMethods({
        speak: function() {
            alert(this.name + 'snarls: ' + this.sound + '!');
        }
    });
    ringneck.speak(); // alerts "Ringneck snarls: hissssssss!"; alerts "You should probably run. He looks really mad."

### Adding static method

    Class.extend(Animal, {
        staticMethod: function() {
            alert('Animal.staticMethod called!');
        }
    });
    Animal.staticMethod(); // alerts "This one is static"

### Get all class methods

    Animal.getMethods(); // returns ['init', 'speak']

### Check if the class method exists

    Animal.hasMethod('speak'); // returns true
    Animal.hasMethod('speakQuietly'); // returns false

### Get all class static properties

    Animal.getStaticProperties(); // returns ['staticMethod']

### Check if the class static property exists

    Animal.hasStaticProperty('staticMethod'); // returns true
    Animal.hasStaticProperty('anotherStaticMethod'); // returns false

### Creating new instance and passing an array of arguments

    var args = ['some name', 'some sound'];
    var instance = Class.construct(Animal, args); // works the same as: new Animal('some name', 'some sound');

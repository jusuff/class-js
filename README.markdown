# Class-based inheritance model for JavaScript

## About

Features:

* syntax like prototype
* call super
* Class.construct

## Examples

### Basic class creation

    var Animal = Class.create({
        init: function(name, sound) {
            this.name  = name;
            this.sound = sound;
        },
        speak: function() {
            alert(this.name + " says: " + this.sound + "!");
        }
    });

### Subclassing

    var Snake = Class.create(Animal, {
        init: function(name) {
            this._super('init', name, 'hissssssssss');
        }
    });
    var ringneck = new Snake("Ringneck");
    ringneck.speak(); // alerts "Ringneck says: hissssssss!"

### Adding new method

    Snake.addMethods({
        speak: function() {
            this._super('speak');
            alert("You should probably run. He looks really mad.");
        }
    });
    ringneck.speak(); // alerts "Ringneck says: hissssssss!"; alerts "You should probably run. He looks really mad."

### Redefining method

    Animal.addMethods({
        speak: function() {
            alert(this.name + 'snarls: ' + this.sound + '!');
        }
    });
    ringneck.speak(); // alerts "Ringneck snarls: hissssssss!"; alerts "You should probably run. He looks really mad."

### Adding static method

    Class.extend(Animal, {
        staticMethod: function() {
            alert('This one is static');
        }
    });
    Animal.staticMethod(); // alerts "This one is static"

### Creating new instance and passing an array of arguments

    var args = ['name', 'sound'];
    var instance = Class.construct(Animal, args); // works the same as new Animal('name', 'sound');


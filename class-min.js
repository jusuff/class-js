/*!
 * Class-based inheritance model for JavaScript v1.0
 * Copyright (c) 2011, Pawel Preneta <jusuff@jabster.pl>
 * MIT Licensed (http://www.opensource.org/licenses/mit-license.php)
 */
var Class=(function(){var d=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;function c(){var k=null,h=Array.prototype.slice.call(arguments);if(typeof h[0]==="function"){k=h.shift()}function klass(){this.init.apply(this,arguments)}f(klass,a);klass.superclass=k;klass.subclasses=[];if(k){var g=function(){};g.prototype=k.prototype;klass.prototype=new g();k.subclasses.push(klass)}for(var j=0;j<h.length;j++){klass.addMethods(h[j])}if(!klass.prototype.init){klass.prototype.init=function(){}}klass.prototype.constructor=klass;return klass}function f(g,i,h){h=h||false;for(var j in i){if(!g[j]||!h){g[j]=i[j]}}return g}function b(g,h){function i(){return g.apply(this,h)}i.prototype=g.prototype;return new i()}var e="superclass subclasses addMethods getMethods hasMethod getStaticProperties hasStaticProperty".split(" "),a={addMethods:function(i){var h=this.superclass&&this.superclass.prototype;for(var g in i){this.prototype[g]=typeof i[g]==="function"&&h&&typeof h[g]==="function"&&d.test(i[g])?(function(j,k){return function(){this._super=function(l){return h[l].apply(this,Array.prototype.slice.call(arguments,1))};return k.apply(this,arguments)}})(g,i[g]):i[g]}return this},getMethods:function(){var g=[];for(var h in this.prototype){if(h!=="constructor"&&typeof this.prototype[h]==="function"){g.push(h)}}return g},hasMethod:function(g){return typeof this.prototype[g]==="function"},getStaticProperties:function(){var h=[];for(var g in this){if(e.indexOf(g)===-1){h.push(g)}}return h},hasStaticProperty:function(g){return typeof this[g]!=="undefined"&&e.indexOf(g)===-1}};return{create:c,extend:f,construct:b}})();
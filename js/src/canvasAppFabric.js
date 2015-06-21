
var slice = Array.prototype.slice;

var IS_DONTENUM_BUGGY = (function(){
	for (var p in { toString: 1 }) {
		if (p === 'toString') return false;
	}
	return true;
})();

var addMethods = function(klass, source, parent) {
	 for (var property in source) {
 
	   if (property in klass.prototype &&
		   typeof klass.prototype[property] === 'function' &&
		   (source[property] + '').indexOf('callSuper') > -1) {
 
		 klass.prototype[property] = (function(property) {
		   return function() {
 
			 var superclass = this.constructor.superclass;
			 this.constructor.superclass = parent;
			 var returnValue = source[property].apply(this, arguments);
			 this.constructor.superclass = superclass;
 
			 if (property !== 'initialize') {
			   return returnValue;
			 }
		   };
		 })(property);
	   }
	   else {
		 klass.prototype[property] = source[property];
	   }

	   if (IS_DONTENUM_BUGGY) {
		 if (source.toString !== Object.prototype.toString) {
		   klass.prototype.toString = source.toString;
		 }
		 if (source.valueOf !== Object.prototype.valueOf) {
		   klass.prototype.valueOf = source.valueOf;
		 }
	   }
	 }
};

function callSuper(methodName) {
	var fn = this.constructor.superclass.prototype[methodName];
	return (arguments.length > 1)
		? fn.apply(this, slice.call(arguments, 1))
		: fn.call(this);
}

function createCanvasElement(canvasEl) {
	canvasEl || (canvasEl = fabric.document.createElement('canvas'));
	if (!canvasEl.getContext && typeof G_vmlCanvasManager !== 'undefined') {
		G_vmlCanvasManager.initElement(canvasEl);
	}
	return canvasEl;
}
fabric.util.createCanvasElement = createCanvasElement;

function createClass() {
	 var parent = null,
		 properties = slice.call(arguments, 0);
 
	 if (typeof properties[0] === 'function') {
	   parent = properties.shift();
	 }
	 function klass() {
	   this.initialize.apply(this, arguments);
	 }
 
	 klass.superclass = parent;
	 klass.subclasses = [ ];
 
	 if (parent) {
	   Subclass.prototype = parent.prototype;
	   klass.prototype = new Subclass();
	   parent.subclasses.push(klass);
	 }
	 for (var i = 0, length = properties.length; i < length; i++) {
	   addMethods(klass, properties[i], parent);
	 }
	 if (!klass.prototype.initialize) {
	   klass.prototype.initialize = emptyFunction;
	 }
	 klass.prototype.constructor = klass;
	 klass.prototype.callSuper = callSuper;
	 return klass;
}
 
fabric.util.createClass = createClass;

fabric.Image.filters.Convolute = fabric.util.createClass(/** @scope fabric.Image.filters.Convolute.prototype */ {

	type: 'Convolute',

	initialize: function(options) {
		 options || (options = { });
	 
		 this.opaque = options.opaque;
		 this.matrix = options.matrix || [ 0, 0, 0,
										   0, 1, 0,
										   0, 0, 0 ];
	 
		 var canvasEl = fabric.util.createCanvasElement();
		 this.tmpCtx = canvasEl.getContext('2d');
	   },

	   _createImageData: function(w, h) {
		 return this.tmpCtx.createImageData(w, h);
	   },

	   applyTo: function(canvasEl) {
	 
		 var weights = this.matrix;
		 var context = canvasEl.getContext('2d');
		 var pixels = context.getImageData(0, 0, canvasEl.width, canvasEl.height);
	 
		 var side = Math.round(Math.sqrt(weights.length));
		 var halfSide = Math.floor(side/2);
		 var src = pixels.data;
		 var sw = pixels.width;
		 var sh = pixels.height;
	 
		 var w = sw;
		 var h = sh;
		 var output = this._createImageData(w, h);
	 
		 var dst = output.data;
	 
		 // go through the destination image pixels
		 var alphaFac = this.opaque ? 1 : 0;
		 for (var y=0; y<h; y++) {
		   for (var x=0; x<w; x++) {
			 var sy = y;
			 var sx = x;
			 var dstOff = (y*w+x)*4;
			 // calculate the weighed sum of the source image pixels that
			 // fall under the convolution matrix
			 var r=0, g=0, b=0, a=0;
			 for (var cy=0; cy<side; cy++) {
			   for (var cx=0; cx<side; cx++) {
				 var scy = sy + cy - halfSide;
				 var scx = sx + cx - halfSide;
				 if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
				   var srcOff = (scy*sw+scx)*4;
				   var wt = weights[cy*side+cx];
				   r += src[srcOff] * wt;
				   g += src[srcOff+1] * wt;
				   b += src[srcOff+2] * wt;
				   a += src[srcOff+3] * wt;
				 }
			   }
			 }
			 dst[dstOff] = r;
			 dst[dstOff+1] = g;
			 dst[dstOff+2] = b;
			 dst[dstOff+3] = a + alphaFac*(255-a);
		   }
		 }
	 
		 context.putImageData(output, 0, 0);
	   },
	 
	   toJSON: function() {
		 return {
		   type: this.type,
		   matrix: this.matrix
		 };
	   }
});
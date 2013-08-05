(function( window ) {

	'use strict';

	var lastTime = 0;
	var prefixes = 'webkit moz ms o'.split(' ');
	// get unprefixed rAF and cAF, if present
	var requestAnimationFrame = window.requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame;
	// loop through vendor prefixes and get prefixed rAF and cAF
	var prefix;
	for( var i = 0; i < prefixes.length; i++ ) {
	if ( requestAnimationFrame && cancelAnimationFrame ) {
		 break;
	}
	prefix = prefixes[i];
	requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
	cancelAnimationFrame	 = cancelAnimationFrame	 || window[ prefix + 'CancelAnimationFrame' ] ||
								 window[ prefix + 'CancelRequestAnimationFrame' ];
	}

	// fallback to setTimeout and clearTimeout if either request/cancel is not supported
	if ( !requestAnimationFrame || !cancelAnimationFrame ) {
	requestAnimationFrame = function( callback, element ) {
		 var currTime = new Date().getTime();
		 var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
		 var id = window.setTimeout( function() {
		callback( currTime + timeToCall );
		 }, timeToCall );
		 lastTime = currTime + timeToCall;
		 return id;
	};

	cancelAnimationFrame = function( id ) {
		 window.clearTimeout( id );
	};
	}

	// put in global namespace
	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;

})( window );


// ======================= class change utility functions ========================

Element.prototype.hasClassName = function (a) {
	return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function (a) {
	if (!this.hasClassName(a)) {
		this.className = [this.className, a].join(" ");
	}
};

Element.prototype.removeClassName = function (b) {
	if (this.hasClassName(b)) {
		var a = this.className;
		this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ");
	}
};

Element.prototype.toggleClassName = function (a) {
	this[this.hasClassName(a) ? "removeClassName" : "addClassName"](a);
};

// ======================= ZZ site script ===============================


// global object
var ZZ = window.ZZ = {};

ZZ.init = function() {
	var i, len;
	
	if ( Modernizr.csstransitions ) {
	ZZ.colorT = ~~(Math.random()*18);
	document.body.addClassName('transitions-ready');
	ZZ.changeColor();
	}

	if ( !document.querySelectorAll ) {
	return;
	}
	
	// Do some groovin'
	if ( !Modernizr.textshadow || !Modernizr.cssgradients ) {
	return;
	}

	ZZ.groovers = [];
	var grooverElems = document.querySelectorAll('.groover');
	len = grooverElems.length;
	
	for ( i=0; i<len; i++ ) {
		ZZ.groovers.push( new ZZ.Groover( grooverElems[i] ) );
	}
	
	// Do some maskin'
	// TODO: add feature detection
	ZZ.masks = [];
	var maskElems = document.querySelectorAll('.mask');
	len = maskElems.length;
	
	for ( i=0; i<len; i++ ) {
		ZZ.masks.push( new ZZ.Masker( maskElems[i] ) );
	}
	

};

// cycles link colors
ZZ.changeColor = function() {
	document.body.removeClassName( 'color' + ZZ.colorT % 18 );
	ZZ.colorT++;
	document.body.addClassName( 'color' + ZZ.colorT % 18 );
	setTimeout( ZZ.changeColor, 3000 );
};



// ======================= Groover ===============================
// generates funky H1 super text-shadows
ZZ.Groover = function( elem ) {
	
	this.elem = elem;
	this.panes = parseInt( this.elem.getAttribute('data-groover-panes'), 10 );
	
	this.colorTime = ~~( Math.random() * 360 );
	this.waveTheta = 0;

	this.colorIncrement = -1;

	this.elem.addEventListener( 'mouseover', this, false );
	this.elem.addEventListener( 'mouseout', this, false );

	// kick off animation
	this.animateBackgroundGradient();

};

// ----- event handling ----- //

ZZ.Groover.prototype.handleEvent = function( event ) {
	var handlerMethod = event.type + 'Handler';
	if ( this[ handlerMethod ] ) {
	this[ handlerMethod ]( event );
	}
};

ZZ.Groover.prototype.mouseoverHandler = function() {
	this.isHovered = true;
};

ZZ.Groover.prototype.mouseoutHandler = function() {
	this.isHovered = false;
};

// ----- methods ----- //

ZZ.Groover.prototype.getTextShadow = function( x, y, hue, alpha ) {
	return ', ' + x + 'px ' + y + 'px hsla(' + hue + ', 100%, 45%, ' + alpha + ')';
};

ZZ.Groover.prototype.getGradientStop = function( stop, hue, alpha ) {
	return ', hsla(' + hue + ', 100%, 45%, ' + alpha + ') ' + stop + '%';
};

ZZ.Groover.prototype.animateTextShadow = function() {
	var shadows = '0 0 transparent',
		 i, j, x, y;

	// renders rainbow river
	for ( i = 1; i < this.panes; i++ ) {
		var normI = i / this.panes,
			hue = this.isHovered ?
				 ( normI * 400 + this.colorTime * 9 ) % 360 :
				 ( normI * 50 + this.colorTime * 0.5 ) % 360,
			alpha = this.isHovered ? 1 : ( 1 - normI ) * 0.9;
		hue = this.isHovered ? ( Math.floor( ( hue / 360 ) * 6 ) / 6 ) * 360 : hue;
		x = i * 2;
		y = i * 2;
		shadows += this.getTextShadow( x, y, hue, alpha );
	}

	this.elem.style.textShadow = shadows;
	this.colorTime += this.colorIncrement;
	window.requestAnimationFrame( this.animateTextShadow.bind( this ) );
};

ZZ.Groover.prototype.animateBackgroundGradient = function() {
	// TODO: add support for unprefixed, moz, and ms ('to bottom' instead of 'top')
	var background = '-webkit-linear-gradient(top ',
		 i, j, stops, stop;
	
	stops = this.isHovered ? this.panes * 5: this.panes; 
	
	// renders rainbow river
	for ( i = 0; i < stops; i++ ) {
		var normI = i / stops,
			hue = this.isHovered ?
			( normI * 400 + this.colorTime * 9 ) % 360 :
			( normI * 50 + this.colorTime * 0.5 ) % 360,
			alpha = this.isHovered ? 0.8 : ( 1 - normI ) * 0.7;
		hue = this.isHovered ? ( Math.floor( ( hue / 360 ) * 6 ) / 6 ) * 360 : hue;
		
		stop = Math.floor(normI % 1 * 100);
		
		background += this.getGradientStop( stop, hue, alpha );
	}
	
	this.elem.style.background = background + ')';
	this.colorTime += this.colorIncrement;
	window.requestAnimationFrame( this.animateBackgroundGradient.bind( this ) );
};

// ======================= Masker ===============================
// generates funky masks
ZZ.Masker = function( elem ) {
	
	this.elem = elem;
	this.num_masks = parseInt( this.elem.getAttribute('data-num-masks'), 10 );

	this.elem.addEventListener( 'mouseover', this, false );
	this.elem.addEventListener( 'mouseout', this, false );
 
	// kick off animation
	this.animate();
};

// ----- event handling ----- //

ZZ.Masker.prototype.handleEvent = function( event ) {
	var handlerMethod = event.type + 'Handler';
	if ( this[ handlerMethod ] ) {
	this[ handlerMethod ]( event );
	}
};

ZZ.Masker.prototype.mouseoverHandler = function() {
	this.isHovered = true;
};

ZZ.Masker.prototype.mouseoutHandler = function() {
	this.isHovered = false;
};

// ----- methods ----- //

ZZ.Masker.prototype.animate = function() {
	if(this.isHovered) {
		var mask_num = (Math.floor( Math.random() * this.num_masks ) + 1);
		this.elem.style.webkitMaskImage = 'url("/assets/img/no-fun-mask-' + mask_num + '.png")';
	}
	window.requestAnimationFrame( this.animate.bind( this ) );
};
window.addEventListener( 'DOMContentLoaded', ZZ.init, false );
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

	// fallback to setTimeout and clearTimeout if either request/cancel is NOFUNt supported
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

// ======================= NOFUN site script ===============================


// global object
var NOFUN = window.NOFUN = {};

NOFUN.init = function() {
	var i, len;
		
	if ( Modernizr.csstransitions ) {
	NOFUN.colorT = ~~(Math.random()*18);
	document.body.addClassName('transitions-ready');
	NOFUN.changeColor();
	}

	if ( !document.querySelectorAll ) {
	return;
	}
	
	// Do some groovin'
	if ( !Modernizr.textshadow || !Modernizr.cssgradients ) {
	return;
	}

	NOFUN.groovers = [];
	var grooverElems = document.querySelectorAll('.groover');
	len = grooverElems.length;
	
	for ( i=0; i<len; i++ ) {
		NOFUN.groovers.push( new NOFUN.Groover( grooverElems[i] ) );
	}
	
	// Do some maskin'
	// TODO: add feature detection
	NOFUN.masks = [];
	var maskElems = document.querySelectorAll('.mask');
	len = maskElems.length;
	
	for ( i=0; i<len; i++ ) {
		NOFUN.masks.push( new NOFUN.Masker( maskElems[i] ) );
	}
	
	// Scroll time

	// bind constructor to window.scroll event
	if ( Modernizr.csstransforms ) {

		NOFUN.scrollers = [];
		var scrollerElems = document.querySelectorAll('.scroller');
		len = scrollerElems.length;
	
		for ( i=0; i<len; i++ ) {
			NOFUN.scrollers.push( new NOFUN.Scroller( scrollerElems[i] ) );
		}
	}


};

// cycles link colors
NOFUN.changeColor = function() {
	document.body.removeClassName( 'color' + NOFUN.colorT % 18 );
	NOFUN.colorT++;
	document.body.addClassName( 'color' + NOFUN.colorT % 18 );
	setTimeout( NOFUN.changeColor, 3000 );
};



// ======================= Groover ===============================
// generates funky H1 super text-shadows
NOFUN.Groover = function( elem ) {
	
	this.elem = elem;
	this.panes = parseInt( this.elem.getAttribute('data-groover-panes'), 10 );
	
	this.colorTime = ~~( Math.random() * 360 );
	this.waveTheta = 0;

	this.colorIncrement = -1;

	this.elem.addEventListener( 'mouseover', this, false );
	this.elem.addEventListener( 'mouseout', this, false );
	this.elem.addEventListener( 'touchstart', this, false );

	// kick off animation
	this.animateBackgroundGradient();

};

// ----- event handling ----- //

NOFUN.Groover.prototype.handleEvent = function( event ) {
	var handlerMethod = event.type + 'Handler';
	if ( this[ handlerMethod ] ) {
	this[ handlerMethod ]( event );
	}
};

NOFUN.Groover.prototype.mouseoverHandler = function() {
	this.isHovered = true;
};

NOFUN.Groover.prototype.mouseoutHandler = function() {
	this.isHovered = false;
};

NOFUN.Groover.prototype.touchstartHandler = function() {
	this.isHovered = !this.isHovered;
};

// ----- methods ----- //

NOFUN.Groover.prototype.getTextShadow = function( x, y, hue, alpha ) {
	return ', ' + x + 'px ' + y + 'px hsla(' + hue + ', 100%, 45%, ' + alpha + ')';
};

NOFUN.Groover.prototype.getGradientStop = function( stop, hue, alpha ) {
	return ', hsla(' + hue + ', 100%, 45%, ' + alpha + ') ' + stop + '%';
};

NOFUN.Groover.prototype.animateTextShadow = function() {
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

NOFUN.Groover.prototype.animateBackgroundGradient = function() {
	// TODO: add support for unprefixed, moz, and ms ('to bottom' instead of 'top')
	var background = '-webkit-linear-gradient(top ',
		 i, j, stops, stop;
	
	stops = this.isHovered ? this.panes * 5: this.panes; 
	
	// renders rainbow river
	for ( i = 0; i < stops; i++ ) {
		var NOFUNrmI = i / stops,
			hue = this.isHovered ?
			( NOFUNrmI * 400 + this.colorTime * 9 ) % 360 :
			( NOFUNrmI * 50 + this.colorTime * 0.5 ) % 360,
			alpha = this.isHovered ? 0.8 : ( 1 - NOFUNrmI ) * 0.7;
		hue = this.isHovered ? ( Math.floor( ( hue / 360 ) * 6 ) / 6 ) * 360 : hue;
		
		stop = Math.floor(NOFUNrmI % 1 * 100);
		
		background += this.getGradientStop( stop, hue, alpha );
	}
	
	this.elem.style.background = background + ')';
	this.colorTime += this.colorIncrement;
	window.requestAnimationFrame( this.animateBackgroundGradient.bind( this ) );
};

// ======================= Masker ===============================
// generates funky masks
NOFUN.Masker = function( elem ) {
	
	this.elem = elem;
	this.num_masks = parseInt( this.elem.getAttribute('data-num-masks'), 10 );

	this.elem.addEventListener( 'mouseover', this, false );
	this.elem.addEventListener( 'mouseout', this, false );
	this.elem.addEventListener( 'touchstart', this, false );
 
	// kick off animation
	this.animate();
};

// ----- event handling ----- //

NOFUN.Masker.prototype.handleEvent = function( event ) {
	var handlerMethod = event.type + 'Handler';
	if ( this[ handlerMethod ] ) {
	this[ handlerMethod ]( event );
	}
};

NOFUN.Masker.prototype.mouseoverHandler = function() {
	this.isHovered = true;
};

NOFUN.Masker.prototype.mouseoutHandler = function() {
	this.isHovered = false;
};

NOFUN.Masker.prototype.touchstartHandler = function() {
	this.isHovered = !this.isHovered;
};

// ----- methods ----- //

NOFUN.Masker.prototype.animate = function() {
	if(this.isHovered) {
		var mask_num = (Math.floor( Math.random() * this.num_masks ) + 1);
		this.elem.style.webkitMaskImage = 'url("assets/img/no-fun-mask-' + mask_num + '.png")';
	}
	window.requestAnimationFrame( this.animate.bind( this ) );
};
window.addEventListener( 'DOMContentLoaded', NOFUN.init, false );


// ======================= Scroller ===============================
NOFUN.Scroller = function( elem ) {
	
	this.elem = elem;
		
	// Translated Z axis at end of scroll
	this.maxZ = parseInt( this.elem.getAttribute('data-max-z-height'), 10 );
	
	// Selector for elements to evenly space along scroll-path
	this.levelSelector = this.elem.getAttribute('data-level-selector');
	
	window.addEventListener( 'scroll', this, false );
	window.addEventListener( 'touchmove', this, false );
 
	this.transformProp = Modernizr.prefixed('transform');
	
	// which method should be used to return CSS transform styles
	this.getScrollTransform = Modernizr.csstransforms3d ? 
	  this.getScroll3DTransform : this.getScroll2DTransform;
	  
	var levelElems = document.querySelectorAll(this.levelSelector);
	len = levelElems.length;
	
	for ( i=0; i<len; i++ ) {
		levelElems[i].style[this.transformProp] = this.getScrollTransform( - i / (len - 1) );
	}
	
};

// ----- event handling ----- //

NOFUN.Scroller.prototype.handleEvent = function( event ) {
	var handlerMethod = event.type + 'Handler';
	if ( this[ handlerMethod ] ) {
	this[ handlerMethod ]( event );
	}
};

NOFUN.Scroller.prototype.touchmoveHandler = function( event ) {
    this.scrollHandler( event );
}

NOFUN.Scroller.prototype.scrollHandler = function( event ) {

  var scrollTop = (document.documentElement && document.documentElement.scrollTop) || 
	              document.body.scrollTop;

  // normalize scroll value from 0 to 1
  this.scrolled = scrollTop / (document.body.scrollHeight - this.elem.clientHeight);

  this.transformScroll( this.scrolled );

  // // change current selection on nav
  // this.currentLevel = Math.round( this.scrolled * (this.levels-1) );
  // 
  // if ( this.currentLevel !== this.previousLevel && this.$nav ) {
  //   this.$nav.find('.current').removeClass('current');
  //   if ( this.currentLevel < 5 ) {
  //     this.$nav.children().eq( this.currentLevel ).addClass('current');
  //   }
  //   this.previousLevel = this.currentLevel;
  // }
  
};

// ----- methods ----- //

// where the magic happens
// applies transform to content from position of scroll
NOFUN.Scroller.prototype.transformScroll = function( scroll ) {
  // bail out if content is not there yet
  // if ( !this.$content ) {
  //   return;
  // }

  this.elem.style[this.transformProp] = this.getScrollTransform( scroll );
};

NOFUN.Scroller.prototype.getScroll2DTransform = function( scroll ) {
  // 2D scale is exponential
  // var scale = Math.pow( 3, scroll * (this.levels - 1) );
  
  return 'scale(' + scale + ')';
};

NOFUN.Scroller.prototype.getScroll3DTransform = function( scroll ) {
  // var z = ( scroll * (this.levels - 1) * this.distance3d ),
  //     // how close are we to the nearest level
  //     leveledZ = this.distance3d / 2 - Math.abs( ( z % this.distance3d ) - this.distance3d / 2 ),
  //     style;
  // 
  // // if close to nearest level, 
  // // ensures that text doesn't get fuzzy after nav is clicked
  // if ( leveledZ < 5 ) {
  //   z = Math.round( z / this.distance3d ) * this.distance3d;
  // }
  
  z = Math.round( scroll * this.maxZ )
  
  return 'translate3d( 0, 0, ' + z + 'px )';
};
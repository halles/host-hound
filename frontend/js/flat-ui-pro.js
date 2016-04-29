/*!
 * Flat UI Pro v1.3.2 (http://designmodo.com/flat)
 * Copyright 2013-2014 Designmodo, Inc.
 */
/*!
 * jQuery UI Core 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
(function( $, undefined ) {

var uuid = 0,
  runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
  version: "1.10.4",

  keyCode: {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    NUMPAD_ADD: 107,
    NUMPAD_DECIMAL: 110,
    NUMPAD_DIVIDE: 111,
    NUMPAD_ENTER: 108,
    NUMPAD_MULTIPLY: 106,
    NUMPAD_SUBTRACT: 109,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38
  }
});

// plugins
$.fn.extend({
  focus: (function( orig ) {
    return function( delay, fn ) {
      return typeof delay === "number" ?
        this.each(function() {
          var elem = this;
          setTimeout(function() {
            $( elem ).focus();
            if ( fn ) {
              fn.call( elem );
            }
          }, delay );
        }) :
        orig.apply( this, arguments );
    };
  })( $.fn.focus ),

  scrollParent: function() {
    var scrollParent;
    if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
      scrollParent = this.parents().filter(function() {
        return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
      }).eq(0);
    } else {
      scrollParent = this.parents().filter(function() {
        return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
      }).eq(0);
    }

    return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
  },

  zIndex: function( zIndex ) {
    if ( zIndex !== undefined ) {
      return this.css( "zIndex", zIndex );
    }

    if ( this.length ) {
      var elem = $( this[ 0 ] ), position, value;
      while ( elem.length && elem[ 0 ] !== document ) {
        // Ignore z-index if position is set to a value where z-index is ignored by the browser
        // This makes behavior of this function consistent across browsers
        // WebKit always returns auto if the element is positioned
        position = elem.css( "position" );
        if ( position === "absolute" || position === "relative" || position === "fixed" ) {
          // IE returns 0 when zIndex is not specified
          // other browsers return a string
          // we ignore the case of nested elements with an explicit value of 0
          // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
          value = parseInt( elem.css( "zIndex" ), 10 );
          if ( !isNaN( value ) && value !== 0 ) {
            return value;
          }
        }
        elem = elem.parent();
      }
    }

    return 0;
  },

  uniqueId: function() {
    return this.each(function() {
      if ( !this.id ) {
        this.id = "ui-id-" + (++uuid);
      }
    });
  },

  removeUniqueId: function() {
    return this.each(function() {
      if ( runiqueId.test( this.id ) ) {
        $( this ).removeAttr( "id" );
      }
    });
  }
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
  var map, mapName, img,
    nodeName = element.nodeName.toLowerCase();
  if ( "area" === nodeName ) {
    map = element.parentNode;
    mapName = map.name;
    if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
      return false;
    }
    img = $( "img[usemap=#" + mapName + "]" )[0];
    return !!img && visible( img );
  }
  return ( /input|select|textarea|button|object/.test( nodeName ) ?
    !element.disabled :
    "a" === nodeName ?
      element.href || isTabIndexNotNaN :
      isTabIndexNotNaN) &&
    // the element and all of its ancestors must be visible
    visible( element );
}

function visible( element ) {
  return $.expr.filters.visible( element ) &&
    !$( element ).parents().addBack().filter(function() {
      return $.css( this, "visibility" ) === "hidden";
    }).length;
}

$.extend( $.expr[ ":" ], {
  data: $.expr.createPseudo ?
    $.expr.createPseudo(function( dataName ) {
      return function( elem ) {
        return !!$.data( elem, dataName );
      };
    }) :
    // support: jQuery <1.8
    function( elem, i, match ) {
      return !!$.data( elem, match[ 3 ] );
    },

  focusable: function( element ) {
    return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
  },

  tabbable: function( element ) {
    var tabIndex = $.attr( element, "tabindex" ),
      isTabIndexNaN = isNaN( tabIndex );
    return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
  }
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
  $.each( [ "Width", "Height" ], function( i, name ) {
    var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
      type = name.toLowerCase(),
      orig = {
        innerWidth: $.fn.innerWidth,
        innerHeight: $.fn.innerHeight,
        outerWidth: $.fn.outerWidth,
        outerHeight: $.fn.outerHeight
      };

    function reduce( elem, size, border, margin ) {
      $.each( side, function() {
        size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
        if ( border ) {
          size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
        }
        if ( margin ) {
          size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
        }
      });
      return size;
    }

    $.fn[ "inner" + name ] = function( size ) {
      if ( size === undefined ) {
        return orig[ "inner" + name ].call( this );
      }

      return this.each(function() {
        $( this ).css( type, reduce( this, size ) + "px" );
      });
    };

    $.fn[ "outer" + name] = function( size, margin ) {
      if ( typeof size !== "number" ) {
        return orig[ "outer" + name ].call( this, size );
      }

      return this.each(function() {
        $( this).css( type, reduce( this, size, true, margin ) + "px" );
      });
    };
  });
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
  $.fn.addBack = function( selector ) {
    return this.add( selector == null ?
      this.prevObject : this.prevObject.filter( selector )
    );
  };
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
  $.fn.removeData = (function( removeData ) {
    return function( key ) {
      if ( arguments.length ) {
        return removeData.call( this, $.camelCase( key ) );
      } else {
        return removeData.call( this );
      }
    };
  })( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
  disableSelection: function() {
    return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
      ".ui-disableSelection", function( event ) {
        event.preventDefault();
      });
  },

  enableSelection: function() {
    return this.unbind( ".ui-disableSelection" );
  }
});

$.extend( $.ui, {
  // $.ui.plugin is deprecated. Use $.widget() extensions instead.
  plugin: {
    add: function( module, option, set ) {
      var i,
        proto = $.ui[ module ].prototype;
      for ( i in set ) {
        proto.plugins[ i ] = proto.plugins[ i ] || [];
        proto.plugins[ i ].push( [ option, set[ i ] ] );
      }
    },
    call: function( instance, name, args ) {
      var i,
        set = instance.plugins[ name ];
      if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
        return;
      }

      for ( i = 0; i < set.length; i++ ) {
        if ( instance.options[ set[ i ][ 0 ] ] ) {
          set[ i ][ 1 ].apply( instance.element, args );
        }
      }
    }
  },

  // only used by resizable
  hasScroll: function( el, a ) {

    //If overflow is hidden, the element might have extra content, but the user wants to hide it
    if ( $( el ).css( "overflow" ) === "hidden") {
      return false;
    }

    var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
      has = false;

    if ( el[ scroll ] > 0 ) {
      return true;
    }

    // TODO: determine which cases actually cause this to happen
    // if the element doesn't have the scroll set, see if it's possible to
    // set the scroll
    el[ scroll ] = 1;
    has = ( el[ scroll ] > 0 );
    el[ scroll ] = 0;
    return has;
  }
});

})( jQuery );

/*!
 * jQuery UI Widget 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
(function( $, undefined ) {

var uuid = 0,
  slice = Array.prototype.slice,
  _cleanData = $.cleanData;
$.cleanData = function( elems ) {
  for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
    try {
      $( elem ).triggerHandler( "remove" );
    // http://bugs.jquery.com/ticket/8235
    } catch( e ) {}
  }
  _cleanData( elems );
};

$.widget = function( name, base, prototype ) {
  var fullName, existingConstructor, constructor, basePrototype,
    // proxiedPrototype allows the provided prototype to remain unmodified
    // so that it can be used as a mixin for multiple widgets (#8876)
    proxiedPrototype = {},
    namespace = name.split( "." )[ 0 ];

  name = name.split( "." )[ 1 ];
  fullName = namespace + "-" + name;

  if ( !prototype ) {
    prototype = base;
    base = $.Widget;
  }

  // create selector for plugin
  $.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
    return !!$.data( elem, fullName );
  };

  $[ namespace ] = $[ namespace ] || {};
  existingConstructor = $[ namespace ][ name ];
  constructor = $[ namespace ][ name ] = function( options, element ) {
    // allow instantiation without "new" keyword
    if ( !this._createWidget ) {
      return new constructor( options, element );
    }

    // allow instantiation without initializing for simple inheritance
    // must use "new" keyword (the code above always passes args)
    if ( arguments.length ) {
      this._createWidget( options, element );
    }
  };
  // extend with the existing constructor to carry over any static properties
  $.extend( constructor, existingConstructor, {
    version: prototype.version,
    // copy the object used to create the prototype in case we need to
    // redefine the widget later
    _proto: $.extend( {}, prototype ),
    // track widgets that inherit from this widget in case this widget is
    // redefined after a widget inherits from it
    _childConstructors: []
  });

  basePrototype = new base();
  // we need to make the options hash a property directly on the new instance
  // otherwise we'll modify the options hash on the prototype that we're
  // inheriting from
  basePrototype.options = $.widget.extend( {}, basePrototype.options );
  $.each( prototype, function( prop, value ) {
    if ( !$.isFunction( value ) ) {
      proxiedPrototype[ prop ] = value;
      return;
    }
    proxiedPrototype[ prop ] = (function() {
      var _super = function() {
          return base.prototype[ prop ].apply( this, arguments );
        },
        _superApply = function( args ) {
          return base.prototype[ prop ].apply( this, args );
        };
      return function() {
        var __super = this._super,
          __superApply = this._superApply,
          returnValue;

        this._super = _super;
        this._superApply = _superApply;

        returnValue = value.apply( this, arguments );

        this._super = __super;
        this._superApply = __superApply;

        return returnValue;
      };
    })();
  });
  constructor.prototype = $.widget.extend( basePrototype, {
    // TODO: remove support for widgetEventPrefix
    // always use the name + a colon as the prefix, e.g., draggable:start
    // don't prefix for widgets that aren't DOM-based
    widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
  }, proxiedPrototype, {
    constructor: constructor,
    namespace: namespace,
    widgetName: name,
    widgetFullName: fullName
  });

  // If this widget is being redefined then we need to find all widgets that
  // are inheriting from it and redefine all of them so that they inherit from
  // the new version of this widget. We're essentially trying to replace one
  // level in the prototype chain.
  if ( existingConstructor ) {
    $.each( existingConstructor._childConstructors, function( i, child ) {
      var childPrototype = child.prototype;

      // redefine the child widget using the same prototype that was
      // originally used, but inherit from the new version of the base
      $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
    });
    // remove the list of existing child constructors from the old constructor
    // so the old child constructors can be garbage collected
    delete existingConstructor._childConstructors;
  } else {
    base._childConstructors.push( constructor );
  }

  $.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
  var input = slice.call( arguments, 1 ),
    inputIndex = 0,
    inputLength = input.length,
    key,
    value;
  for ( ; inputIndex < inputLength; inputIndex++ ) {
    for ( key in input[ inputIndex ] ) {
      value = input[ inputIndex ][ key ];
      if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
        // Clone objects
        if ( $.isPlainObject( value ) ) {
          target[ key ] = $.isPlainObject( target[ key ] ) ?
            $.widget.extend( {}, target[ key ], value ) :
            // Don't extend strings, arrays, etc. with objects
            $.widget.extend( {}, value );
        // Copy everything else by reference
        } else {
          target[ key ] = value;
        }
      }
    }
  }
  return target;
};

$.widget.bridge = function( name, object ) {
  var fullName = object.prototype.widgetFullName || name;
  $.fn[ name ] = function( options ) {
    var isMethodCall = typeof options === "string",
      args = slice.call( arguments, 1 ),
      returnValue = this;

    // allow multiple hashes to be passed on init
    options = !isMethodCall && args.length ?
      $.widget.extend.apply( null, [ options ].concat(args) ) :
      options;

    if ( isMethodCall ) {
      this.each(function() {
        var methodValue,
          instance = $.data( this, fullName );
        if ( !instance ) {
          return $.error( "cannot call methods on " + name + " prior to initialization; " +
            "attempted to call method '" + options + "'" );
        }
        if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
          return $.error( "no such method '" + options + "' for " + name + " widget instance" );
        }
        methodValue = instance[ options ].apply( instance, args );
        if ( methodValue !== instance && methodValue !== undefined ) {
          returnValue = methodValue && methodValue.jquery ?
            returnValue.pushStack( methodValue.get() ) :
            methodValue;
          return false;
        }
      });
    } else {
      this.each(function() {
        var instance = $.data( this, fullName );
        if ( instance ) {
          instance.option( options || {} )._init();
        } else {
          $.data( this, fullName, new object( options, this ) );
        }
      });
    }

    return returnValue;
  };
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
  widgetName: "widget",
  widgetEventPrefix: "",
  defaultElement: "<div>",
  options: {
    disabled: false,

    // callbacks
    create: null
  },
  _createWidget: function( options, element ) {
    element = $( element || this.defaultElement || this )[ 0 ];
    this.element = $( element );
    this.uuid = uuid++;
    this.eventNamespace = "." + this.widgetName + this.uuid;
    this.options = $.widget.extend( {},
      this.options,
      this._getCreateOptions(),
      options );

    this.bindings = $();
    this.hoverable = $();
    this.focusable = $();

    if ( element !== this ) {
      $.data( element, this.widgetFullName, this );
      this._on( true, this.element, {
        remove: function( event ) {
          if ( event.target === element ) {
            this.destroy();
          }
        }
      });
      this.document = $( element.style ?
        // element within the document
        element.ownerDocument :
        // element is window or document
        element.document || element );
      this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
    }

    this._create();
    this._trigger( "create", null, this._getCreateEventData() );
    this._init();
  },
  _getCreateOptions: $.noop,
  _getCreateEventData: $.noop,
  _create: $.noop,
  _init: $.noop,

  destroy: function() {
    this._destroy();
    // we can probably remove the unbind calls in 2.0
    // all event bindings should go through this._on()
    this.element
      .unbind( this.eventNamespace )
      // 1.9 BC for #7810
      // TODO remove dual storage
      .removeData( this.widgetName )
      .removeData( this.widgetFullName )
      // support: jquery <1.6.3
      // http://bugs.jquery.com/ticket/9413
      .removeData( $.camelCase( this.widgetFullName ) );
    this.widget()
      .unbind( this.eventNamespace )
      .removeAttr( "aria-disabled" )
      .removeClass(
        this.widgetFullName + "-disabled " +
        "ui-state-disabled" );

    // clean up events and states
    this.bindings.unbind( this.eventNamespace );
    this.hoverable.removeClass( "ui-state-hover" );
    this.focusable.removeClass( "ui-state-focus" );
  },
  _destroy: $.noop,

  widget: function() {
    return this.element;
  },

  option: function( key, value ) {
    var options = key,
      parts,
      curOption,
      i;

    if ( arguments.length === 0 ) {
      // don't return a reference to the internal hash
      return $.widget.extend( {}, this.options );
    }

    if ( typeof key === "string" ) {
      // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
      options = {};
      parts = key.split( "." );
      key = parts.shift();
      if ( parts.length ) {
        curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
        for ( i = 0; i < parts.length - 1; i++ ) {
          curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
          curOption = curOption[ parts[ i ] ];
        }
        key = parts.pop();
        if ( arguments.length === 1 ) {
          return curOption[ key ] === undefined ? null : curOption[ key ];
        }
        curOption[ key ] = value;
      } else {
        if ( arguments.length === 1 ) {
          return this.options[ key ] === undefined ? null : this.options[ key ];
        }
        options[ key ] = value;
      }
    }

    this._setOptions( options );

    return this;
  },
  _setOptions: function( options ) {
    var key;

    for ( key in options ) {
      this._setOption( key, options[ key ] );
    }

    return this;
  },
  _setOption: function( key, value ) {
    this.options[ key ] = value;

    if ( key === "disabled" ) {
      this.widget()
        .toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
        .attr( "aria-disabled", value );
      this.hoverable.removeClass( "ui-state-hover" );
      this.focusable.removeClass( "ui-state-focus" );
    }

    return this;
  },

  enable: function() {
    return this._setOption( "disabled", false );
  },
  disable: function() {
    return this._setOption( "disabled", true );
  },

  _on: function( suppressDisabledCheck, element, handlers ) {
    var delegateElement,
      instance = this;

    // no suppressDisabledCheck flag, shuffle arguments
    if ( typeof suppressDisabledCheck !== "boolean" ) {
      handlers = element;
      element = suppressDisabledCheck;
      suppressDisabledCheck = false;
    }

    // no element argument, shuffle and use this.element
    if ( !handlers ) {
      handlers = element;
      element = this.element;
      delegateElement = this.widget();
    } else {
      // accept selectors, DOM elements
      element = delegateElement = $( element );
      this.bindings = this.bindings.add( element );
    }

    $.each( handlers, function( event, handler ) {
      function handlerProxy() {
        // allow widgets to customize the disabled handling
        // - disabled as an array instead of boolean
        // - disabled class as method for disabling individual parts
        if ( !suppressDisabledCheck &&
            ( instance.options.disabled === true ||
              $( this ).hasClass( "ui-state-disabled" ) ) ) {
          return;
        }
        return ( typeof handler === "string" ? instance[ handler ] : handler )
          .apply( instance, arguments );
      }

      // copy the guid so direct unbinding works
      if ( typeof handler !== "string" ) {
        handlerProxy.guid = handler.guid =
          handler.guid || handlerProxy.guid || $.guid++;
      }

      var match = event.match( /^(\w+)\s*(.*)$/ ),
        eventName = match[1] + instance.eventNamespace,
        selector = match[2];
      if ( selector ) {
        delegateElement.delegate( selector, eventName, handlerProxy );
      } else {
        element.bind( eventName, handlerProxy );
      }
    });
  },

  _off: function( element, eventName ) {
    eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
    element.unbind( eventName ).undelegate( eventName );
  },

  _delay: function( handler, delay ) {
    function handlerProxy() {
      return ( typeof handler === "string" ? instance[ handler ] : handler )
        .apply( instance, arguments );
    }
    var instance = this;
    return setTimeout( handlerProxy, delay || 0 );
  },

  _hoverable: function( element ) {
    this.hoverable = this.hoverable.add( element );
    this._on( element, {
      mouseenter: function( event ) {
        $( event.currentTarget ).addClass( "ui-state-hover" );
      },
      mouseleave: function( event ) {
        $( event.currentTarget ).removeClass( "ui-state-hover" );
      }
    });
  },

  _focusable: function( element ) {
    this.focusable = this.focusable.add( element );
    this._on( element, {
      focusin: function( event ) {
        $( event.currentTarget ).addClass( "ui-state-focus" );
      },
      focusout: function( event ) {
        $( event.currentTarget ).removeClass( "ui-state-focus" );
      }
    });
  },

  _trigger: function( type, event, data ) {
    var prop, orig,
      callback = this.options[ type ];

    data = data || {};
    event = $.Event( event );
    event.type = ( type === this.widgetEventPrefix ?
      type :
      this.widgetEventPrefix + type ).toLowerCase();
    // the original event may come from any element
    // so we need to reset the target on the new event
    event.target = this.element[ 0 ];

    // copy original event properties over to the new event
    orig = event.originalEvent;
    if ( orig ) {
      for ( prop in orig ) {
        if ( !( prop in event ) ) {
          event[ prop ] = orig[ prop ];
        }
      }
    }

    this.element.trigger( event, data );
    return !( $.isFunction( callback ) &&
      callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
      event.isDefaultPrevented() );
  }
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
  $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
    if ( typeof options === "string" ) {
      options = { effect: options };
    }
    var hasOptions,
      effectName = !options ?
        method :
        options === true || typeof options === "number" ?
          defaultEffect :
          options.effect || defaultEffect;
    options = options || {};
    if ( typeof options === "number" ) {
      options = { duration: options };
    }
    hasOptions = !$.isEmptyObject( options );
    options.complete = callback;
    if ( options.delay ) {
      element.delay( options.delay );
    }
    if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
      element[ method ]( options );
    } else if ( effectName !== method && element[ effectName ] ) {
      element[ effectName ]( options.duration, options.easing, callback );
    } else {
      element.queue(function( next ) {
        $( this )[ method ]();
        if ( callback ) {
          callback.call( element[ 0 ] );
        }
        next();
      });
    }
  };
});

})( jQuery );

/*!
 * jQuery UI Mouse 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 *
 * Depends:
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function() {
  mouseHandled = false;
});

$.widget("ui.mouse", {
  version: "1.10.4",
  options: {
    cancel: "input,textarea,button,select,option",
    distance: 1,
    delay: 0
  },
  _mouseInit: function() {
    var that = this;

    this.element
      .bind("mousedown."+this.widgetName, function(event) {
        return that._mouseDown(event);
      })
      .bind("click."+this.widgetName, function(event) {
        if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
          $.removeData(event.target, that.widgetName + ".preventClickEvent");
          event.stopImmediatePropagation();
          return false;
        }
      });

    this.started = false;
  },

  // TODO: make sure destroying one instance of mouse doesn't mess with
  // other instances of mouse
  _mouseDestroy: function() {
    this.element.unbind("."+this.widgetName);
    if ( this._mouseMoveDelegate ) {
      $(document)
        .unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
        .unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
    }
  },

  _mouseDown: function(event) {
    // don't let more than one widget handle mouseStart
    if( mouseHandled ) { return; }

    // we may have missed mouseup (out of window)
    (this._mouseStarted && this._mouseUp(event));

    this._mouseDownEvent = event;

    var that = this,
      btnIsLeft = (event.which === 1),
      // event.target.nodeName works around a bug in IE 8 with
      // disabled inputs (#7620)
      elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
    if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
      return true;
    }

    this.mouseDelayMet = !this.options.delay;
    if (!this.mouseDelayMet) {
      this._mouseDelayTimer = setTimeout(function() {
        that.mouseDelayMet = true;
      }, this.options.delay);
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted = (this._mouseStart(event) !== false);
      if (!this._mouseStarted) {
        event.preventDefault();
        return true;
      }
    }

    // Click event may never have fired (Gecko & Opera)
    if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
      $.removeData(event.target, this.widgetName + ".preventClickEvent");
    }

    // these delegates are required to keep context
    this._mouseMoveDelegate = function(event) {
      return that._mouseMove(event);
    };
    this._mouseUpDelegate = function(event) {
      return that._mouseUp(event);
    };
    $(document)
      .bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
      .bind("mouseup."+this.widgetName, this._mouseUpDelegate);

    event.preventDefault();

    mouseHandled = true;
    return true;
  },

  _mouseMove: function(event) {
    // IE mouseup check - mouseup happened when mouse was out of window
    if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
      return this._mouseUp(event);
    }

    if (this._mouseStarted) {
      this._mouseDrag(event);
      return event.preventDefault();
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted =
        (this._mouseStart(this._mouseDownEvent, event) !== false);
      (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
    }

    return !this._mouseStarted;
  },

  _mouseUp: function(event) {
    $(document)
      .unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
      .unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

    if (this._mouseStarted) {
      this._mouseStarted = false;

      if (event.target === this._mouseDownEvent.target) {
        $.data(event.target, this.widgetName + ".preventClickEvent", true);
      }

      this._mouseStop(event);
    }

    return false;
  },

  _mouseDistanceMet: function(event) {
    return (Math.max(
        Math.abs(this._mouseDownEvent.pageX - event.pageX),
        Math.abs(this._mouseDownEvent.pageY - event.pageY)
      ) >= this.options.distance
    );
  },

  _mouseDelayMet: function(/* event */) {
    return this.mouseDelayMet;
  },

  // These are placeholder methods, to be overriden by extending plugin
  _mouseStart: function(/* event */) {},
  _mouseDrag: function(/* event */) {},
  _mouseStop: function(/* event */) {},
  _mouseCapture: function(/* event */) { return true; }
});

})(jQuery);

/*!
 * jQuery UI Position 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
  max = Math.max,
  abs = Math.abs,
  round = Math.round,
  rhorizontal = /left|center|right/,
  rvertical = /top|center|bottom/,
  roffset = /[\+\-]\d+(\.[\d]+)?%?/,
  rposition = /^\w+/,
  rpercent = /%$/,
  _position = $.fn.position;

function getOffsets( offsets, width, height ) {
  return [
    parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
    parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
  ];
}

function parseCss( element, property ) {
  return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
  var raw = elem[0];
  if ( raw.nodeType === 9 ) {
    return {
      width: elem.width(),
      height: elem.height(),
      offset: { top: 0, left: 0 }
    };
  }
  if ( $.isWindow( raw ) ) {
    return {
      width: elem.width(),
      height: elem.height(),
      offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
    };
  }
  if ( raw.preventDefault ) {
    return {
      width: 0,
      height: 0,
      offset: { top: raw.pageY, left: raw.pageX }
    };
  }
  return {
    width: elem.outerWidth(),
    height: elem.outerHeight(),
    offset: elem.offset()
  };
}

$.position = {
  scrollbarWidth: function() {
    if ( cachedScrollbarWidth !== undefined ) {
      return cachedScrollbarWidth;
    }
    var w1, w2,
      div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
      innerDiv = div.children()[0];

    $( "body" ).append( div );
    w1 = innerDiv.offsetWidth;
    div.css( "overflow", "scroll" );

    w2 = innerDiv.offsetWidth;

    if ( w1 === w2 ) {
      w2 = div[0].clientWidth;
    }

    div.remove();

    return (cachedScrollbarWidth = w1 - w2);
  },
  getScrollInfo: function( within ) {
    var overflowX = within.isWindow || within.isDocument ? "" :
        within.element.css( "overflow-x" ),
      overflowY = within.isWindow || within.isDocument ? "" :
        within.element.css( "overflow-y" ),
      hasOverflowX = overflowX === "scroll" ||
        ( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
      hasOverflowY = overflowY === "scroll" ||
        ( overflowY === "auto" && within.height < within.element[0].scrollHeight );
    return {
      width: hasOverflowY ? $.position.scrollbarWidth() : 0,
      height: hasOverflowX ? $.position.scrollbarWidth() : 0
    };
  },
  getWithinInfo: function( element ) {
    var withinElement = $( element || window ),
      isWindow = $.isWindow( withinElement[0] ),
      isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
    return {
      element: withinElement,
      isWindow: isWindow,
      isDocument: isDocument,
      offset: withinElement.offset() || { left: 0, top: 0 },
      scrollLeft: withinElement.scrollLeft(),
      scrollTop: withinElement.scrollTop(),
      width: isWindow ? withinElement.width() : withinElement.outerWidth(),
      height: isWindow ? withinElement.height() : withinElement.outerHeight()
    };
  }
};

$.fn.position = function( options ) {
  if ( !options || !options.of ) {
    return _position.apply( this, arguments );
  }

  // make a copy, we don't want to modify arguments
  options = $.extend( {}, options );

  var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
    target = $( options.of ),
    within = $.position.getWithinInfo( options.within ),
    scrollInfo = $.position.getScrollInfo( within ),
    collision = ( options.collision || "flip" ).split( " " ),
    offsets = {};

  dimensions = getDimensions( target );
  if ( target[0].preventDefault ) {
    // force left top to allow flipping
    options.at = "left top";
  }
  targetWidth = dimensions.width;
  targetHeight = dimensions.height;
  targetOffset = dimensions.offset;
  // clone to reuse original targetOffset later
  basePosition = $.extend( {}, targetOffset );

  // force my and at to have valid horizontal and vertical positions
  // if a value is missing or invalid, it will be converted to center
  $.each( [ "my", "at" ], function() {
    var pos = ( options[ this ] || "" ).split( " " ),
      horizontalOffset,
      verticalOffset;

    if ( pos.length === 1) {
      pos = rhorizontal.test( pos[ 0 ] ) ?
        pos.concat( [ "center" ] ) :
        rvertical.test( pos[ 0 ] ) ?
          [ "center" ].concat( pos ) :
          [ "center", "center" ];
    }
    pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
    pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

    // calculate offsets
    horizontalOffset = roffset.exec( pos[ 0 ] );
    verticalOffset = roffset.exec( pos[ 1 ] );
    offsets[ this ] = [
      horizontalOffset ? horizontalOffset[ 0 ] : 0,
      verticalOffset ? verticalOffset[ 0 ] : 0
    ];

    // reduce to just the positions without the offsets
    options[ this ] = [
      rposition.exec( pos[ 0 ] )[ 0 ],
      rposition.exec( pos[ 1 ] )[ 0 ]
    ];
  });

  // normalize collision option
  if ( collision.length === 1 ) {
    collision[ 1 ] = collision[ 0 ];
  }

  if ( options.at[ 0 ] === "right" ) {
    basePosition.left += targetWidth;
  } else if ( options.at[ 0 ] === "center" ) {
    basePosition.left += targetWidth / 2;
  }

  if ( options.at[ 1 ] === "bottom" ) {
    basePosition.top += targetHeight;
  } else if ( options.at[ 1 ] === "center" ) {
    basePosition.top += targetHeight / 2;
  }

  atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
  basePosition.left += atOffset[ 0 ];
  basePosition.top += atOffset[ 1 ];

  return this.each(function() {
    var collisionPosition, using,
      elem = $( this ),
      elemWidth = elem.outerWidth(),
      elemHeight = elem.outerHeight(),
      marginLeft = parseCss( this, "marginLeft" ),
      marginTop = parseCss( this, "marginTop" ),
      collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
      collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
      position = $.extend( {}, basePosition ),
      myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

    if ( options.my[ 0 ] === "right" ) {
      position.left -= elemWidth;
    } else if ( options.my[ 0 ] === "center" ) {
      position.left -= elemWidth / 2;
    }

    if ( options.my[ 1 ] === "bottom" ) {
      position.top -= elemHeight;
    } else if ( options.my[ 1 ] === "center" ) {
      position.top -= elemHeight / 2;
    }

    position.left += myOffset[ 0 ];
    position.top += myOffset[ 1 ];

    // if the browser doesn't support fractions, then round for consistent results
    if ( !$.support.offsetFractions ) {
      position.left = round( position.left );
      position.top = round( position.top );
    }

    collisionPosition = {
      marginLeft: marginLeft,
      marginTop: marginTop
    };

    $.each( [ "left", "top" ], function( i, dir ) {
      if ( $.ui.position[ collision[ i ] ] ) {
        $.ui.position[ collision[ i ] ][ dir ]( position, {
          targetWidth: targetWidth,
          targetHeight: targetHeight,
          elemWidth: elemWidth,
          elemHeight: elemHeight,
          collisionPosition: collisionPosition,
          collisionWidth: collisionWidth,
          collisionHeight: collisionHeight,
          offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
          my: options.my,
          at: options.at,
          within: within,
          elem : elem
        });
      }
    });

    if ( options.using ) {
      // adds feedback as second argument to using callback, if present
      using = function( props ) {
        var left = targetOffset.left - position.left,
          right = left + targetWidth - elemWidth,
          top = targetOffset.top - position.top,
          bottom = top + targetHeight - elemHeight,
          feedback = {
            target: {
              element: target,
              left: targetOffset.left,
              top: targetOffset.top,
              width: targetWidth,
              height: targetHeight
            },
            element: {
              element: elem,
              left: position.left,
              top: position.top,
              width: elemWidth,
              height: elemHeight
            },
            horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
            vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
          };
        if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
          feedback.horizontal = "center";
        }
        if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
          feedback.vertical = "middle";
        }
        if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
          feedback.important = "horizontal";
        } else {
          feedback.important = "vertical";
        }
        options.using.call( this, props, feedback );
      };
    }

    elem.offset( $.extend( position, { using: using } ) );
  });
};

$.ui.position = {
  fit: {
    left: function( position, data ) {
      var within = data.within,
        withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
        outerWidth = within.width,
        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
        overLeft = withinOffset - collisionPosLeft,
        overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
        newOverRight;

      // element is wider than within
      if ( data.collisionWidth > outerWidth ) {
        // element is initially over the left side of within
        if ( overLeft > 0 && overRight <= 0 ) {
          newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
          position.left += overLeft - newOverRight;
        // element is initially over right side of within
        } else if ( overRight > 0 && overLeft <= 0 ) {
          position.left = withinOffset;
        // element is initially over both left and right sides of within
        } else {
          if ( overLeft > overRight ) {
            position.left = withinOffset + outerWidth - data.collisionWidth;
          } else {
            position.left = withinOffset;
          }
        }
      // too far left -> align with left edge
      } else if ( overLeft > 0 ) {
        position.left += overLeft;
      // too far right -> align with right edge
      } else if ( overRight > 0 ) {
        position.left -= overRight;
      // adjust based on position and margin
      } else {
        position.left = max( position.left - collisionPosLeft, position.left );
      }
    },
    top: function( position, data ) {
      var within = data.within,
        withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
        outerHeight = data.within.height,
        collisionPosTop = position.top - data.collisionPosition.marginTop,
        overTop = withinOffset - collisionPosTop,
        overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
        newOverBottom;

      // element is taller than within
      if ( data.collisionHeight > outerHeight ) {
        // element is initially over the top of within
        if ( overTop > 0 && overBottom <= 0 ) {
          newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
          position.top += overTop - newOverBottom;
        // element is initially over bottom of within
        } else if ( overBottom > 0 && overTop <= 0 ) {
          position.top = withinOffset;
        // element is initially over both top and bottom of within
        } else {
          if ( overTop > overBottom ) {
            position.top = withinOffset + outerHeight - data.collisionHeight;
          } else {
            position.top = withinOffset;
          }
        }
      // too far up -> align with top
      } else if ( overTop > 0 ) {
        position.top += overTop;
      // too far down -> align with bottom edge
      } else if ( overBottom > 0 ) {
        position.top -= overBottom;
      // adjust based on position and margin
      } else {
        position.top = max( position.top - collisionPosTop, position.top );
      }
    }
  },
  flip: {
    left: function( position, data ) {
      var within = data.within,
        withinOffset = within.offset.left + within.scrollLeft,
        outerWidth = within.width,
        offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
        collisionPosLeft = position.left - data.collisionPosition.marginLeft,
        overLeft = collisionPosLeft - offsetLeft,
        overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
        myOffset = data.my[ 0 ] === "left" ?
          -data.elemWidth :
          data.my[ 0 ] === "right" ?
            data.elemWidth :
            0,
        atOffset = data.at[ 0 ] === "left" ?
          data.targetWidth :
          data.at[ 0 ] === "right" ?
            -data.targetWidth :
            0,
        offset = -2 * data.offset[ 0 ],
        newOverRight,
        newOverLeft;

      if ( overLeft < 0 ) {
        newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
        if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
          position.left += myOffset + atOffset + offset;
        }
      }
      else if ( overRight > 0 ) {
        newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
        if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
          position.left += myOffset + atOffset + offset;
        }
      }
    },
    top: function( position, data ) {
      var within = data.within,
        withinOffset = within.offset.top + within.scrollTop,
        outerHeight = within.height,
        offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
        collisionPosTop = position.top - data.collisionPosition.marginTop,
        overTop = collisionPosTop - offsetTop,
        overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
        top = data.my[ 1 ] === "top",
        myOffset = top ?
          -data.elemHeight :
          data.my[ 1 ] === "bottom" ?
            data.elemHeight :
            0,
        atOffset = data.at[ 1 ] === "top" ?
          data.targetHeight :
          data.at[ 1 ] === "bottom" ?
            -data.targetHeight :
            0,
        offset = -2 * data.offset[ 1 ],
        newOverTop,
        newOverBottom;
      if ( overTop < 0 ) {
        newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
        if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
          position.top += myOffset + atOffset + offset;
        }
      }
      else if ( overBottom > 0 ) {
        newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
        if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
          position.top += myOffset + atOffset + offset;
        }
      }
    }
  },
  flipfit: {
    left: function() {
      $.ui.position.flip.left.apply( this, arguments );
      $.ui.position.fit.left.apply( this, arguments );
    },
    top: function() {
      $.ui.position.flip.top.apply( this, arguments );
      $.ui.position.fit.top.apply( this, arguments );
    }
  }
};

// fraction support test
(function () {
  var testElement, testElementParent, testElementStyle, offsetLeft, i,
    body = document.getElementsByTagName( "body" )[ 0 ],
    div = document.createElement( "div" );

  //Create a "fake body" for testing based on method used in jQuery.support
  testElement = document.createElement( body ? "div" : "body" );
  testElementStyle = {
    visibility: "hidden",
    width: 0,
    height: 0,
    border: 0,
    margin: 0,
    background: "none"
  };
  if ( body ) {
    $.extend( testElementStyle, {
      position: "absolute",
      left: "-1000px",
      top: "-1000px"
    });
  }
  for ( i in testElementStyle ) {
    testElement.style[ i ] = testElementStyle[ i ];
  }
  testElement.appendChild( div );
  testElementParent = body || document.documentElement;
  testElementParent.insertBefore( testElement, testElementParent.firstChild );

  div.style.cssText = "position: absolute; left: 10.7432222px;";

  offsetLeft = $( div ).offset().left;
  $.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

  testElement.innerHTML = "";
  testElementParent.removeChild( testElement );
})();

}( jQuery ) );

/*!
 * jQuery UI Button 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/button/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

var lastActive,
  baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
  typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
  formResetHandler = function() {
    var form = $( this );
    setTimeout(function() {
      form.find( ":ui-button" ).button( "refresh" );
    }, 1 );
  },
  radioGroup = function( radio ) {
    var name = radio.name,
      form = radio.form,
      radios = $( [] );
    if ( name ) {
      name = name.replace( /'/g, "\\'" );
      if ( form ) {
        radios = $( form ).find( "[name='" + name + "']" );
      } else {
        radios = $( "[name='" + name + "']", radio.ownerDocument )
          .filter(function() {
            return !this.form;
          });
      }
    }
    return radios;
  };

$.widget( "ui.button", {
  version: "1.10.4",
  defaultElement: "<button>",
  options: {
    disabled: null,
    text: true,
    label: null,
    icons: {
      primary: null,
      secondary: null
    }
  },
  _create: function() {
    this.element.closest( "form" )
      .unbind( "reset" + this.eventNamespace )
      .bind( "reset" + this.eventNamespace, formResetHandler );

    if ( typeof this.options.disabled !== "boolean" ) {
      this.options.disabled = !!this.element.prop( "disabled" );
    } else {
      this.element.prop( "disabled", this.options.disabled );
    }

    this._determineButtonType();
    this.hasTitle = !!this.buttonElement.attr( "title" );

    var that = this,
      options = this.options,
      toggleButton = this.type === "checkbox" || this.type === "radio",
      activeClass = !toggleButton ? "ui-state-active" : "";

    if ( options.label === null ) {
      options.label = (this.type === "input" ? this.buttonElement.val() : this.buttonElement.html());
    }

    this._hoverable( this.buttonElement );

    this.buttonElement
      .addClass( baseClasses )
      .attr( "role", "button" )
      .bind( "mouseenter" + this.eventNamespace, function() {
        if ( options.disabled ) {
          return;
        }
        if ( this === lastActive ) {
          $( this ).addClass( "ui-state-active" );
        }
      })
      .bind( "mouseleave" + this.eventNamespace, function() {
        if ( options.disabled ) {
          return;
        }
        $( this ).removeClass( activeClass );
      })
      .bind( "click" + this.eventNamespace, function( event ) {
        if ( options.disabled ) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      });

    // Can't use _focusable() because the element that receives focus
    // and the element that gets the ui-state-focus class are different
    this._on({
      focus: function() {
        this.buttonElement.addClass( "ui-state-focus" );
      },
      blur: function() {
        this.buttonElement.removeClass( "ui-state-focus" );
      }
    });

    if ( toggleButton ) {
      this.element.bind( "change" + this.eventNamespace, function() {
        that.refresh();
      });
    }

    if ( this.type === "checkbox" ) {
      this.buttonElement.bind( "click" + this.eventNamespace, function() {
        if ( options.disabled ) {
          return false;
        }
      });
    } else if ( this.type === "radio" ) {
      this.buttonElement.bind( "click" + this.eventNamespace, function() {
        if ( options.disabled ) {
          return false;
        }
        $( this ).addClass( "ui-state-active" );
        that.buttonElement.attr( "aria-pressed", "true" );

        var radio = that.element[ 0 ];
        radioGroup( radio )
          .not( radio )
          .map(function() {
            return $( this ).button( "widget" )[ 0 ];
          })
          .removeClass( "ui-state-active" )
          .attr( "aria-pressed", "false" );
      });
    } else {
      this.buttonElement
        .bind( "mousedown" + this.eventNamespace, function() {
          if ( options.disabled ) {
            return false;
          }
          $( this ).addClass( "ui-state-active" );
          lastActive = this;
          that.document.one( "mouseup", function() {
            lastActive = null;
          });
        })
        .bind( "mouseup" + this.eventNamespace, function() {
          if ( options.disabled ) {
            return false;
          }
          $( this ).removeClass( "ui-state-active" );
        })
        .bind( "keydown" + this.eventNamespace, function(event) {
          if ( options.disabled ) {
            return false;
          }
          if ( event.keyCode === $.ui.keyCode.SPACE || event.keyCode === $.ui.keyCode.ENTER ) {
            $( this ).addClass( "ui-state-active" );
          }
        })
        // see #8559, we bind to blur here in case the button element loses
        // focus between keydown and keyup, it would be left in an "active" state
        .bind( "keyup" + this.eventNamespace + " blur" + this.eventNamespace, function() {
          $( this ).removeClass( "ui-state-active" );
        });

      if ( this.buttonElement.is("a") ) {
        this.buttonElement.keyup(function(event) {
          if ( event.keyCode === $.ui.keyCode.SPACE ) {
            // TODO pass through original event correctly (just as 2nd argument doesn't work)
            $( this ).click();
          }
        });
      }
    }

    // TODO: pull out $.Widget's handling for the disabled option into
    // $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
    // be overridden by individual plugins
    this._setOption( "disabled", options.disabled );
    this._resetButton();
  },

  _determineButtonType: function() {
    var ancestor, labelSelector, checked;

    if ( this.element.is("[type=checkbox]") ) {
      this.type = "checkbox";
    } else if ( this.element.is("[type=radio]") ) {
      this.type = "radio";
    } else if ( this.element.is("input") ) {
      this.type = "input";
    } else {
      this.type = "button";
    }

    if ( this.type === "checkbox" || this.type === "radio" ) {
      // we don't search against the document in case the element
      // is disconnected from the DOM
      ancestor = this.element.parents().last();
      labelSelector = "label[for='" + this.element.attr("id") + "']";
      this.buttonElement = ancestor.find( labelSelector );
      if ( !this.buttonElement.length ) {
        ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
        this.buttonElement = ancestor.filter( labelSelector );
        if ( !this.buttonElement.length ) {
          this.buttonElement = ancestor.find( labelSelector );
        }
      }
      this.element.addClass( "ui-helper-hidden-accessible" );

      checked = this.element.is( ":checked" );
      if ( checked ) {
        this.buttonElement.addClass( "ui-state-active" );
      }
      this.buttonElement.prop( "aria-pressed", checked );
    } else {
      this.buttonElement = this.element;
    }
  },

  widget: function() {
    return this.buttonElement;
  },

  _destroy: function() {
    this.element
      .removeClass( "ui-helper-hidden-accessible" );
    this.buttonElement
      .removeClass( baseClasses + " ui-state-active " + typeClasses )
      .removeAttr( "role" )
      .removeAttr( "aria-pressed" )
      .html( this.buttonElement.find(".ui-button-text").html() );

    if ( !this.hasTitle ) {
      this.buttonElement.removeAttr( "title" );
    }
  },

  _setOption: function( key, value ) {
    this._super( key, value );
    if ( key === "disabled" ) {
      this.element.prop( "disabled", !!value );
      if ( value ) {
        this.buttonElement.removeClass( "ui-state-focus" );
      }
      return;
    }
    this._resetButton();
  },

  refresh: function() {
    //See #8237 & #8828
    var isDisabled = this.element.is( "input, button" ) ? this.element.is( ":disabled" ) : this.element.hasClass( "ui-button-disabled" );

    if ( isDisabled !== this.options.disabled ) {
      this._setOption( "disabled", isDisabled );
    }
    if ( this.type === "radio" ) {
      radioGroup( this.element[0] ).each(function() {
        if ( $( this ).is( ":checked" ) ) {
          $( this ).button( "widget" )
            .addClass( "ui-state-active" )
            .attr( "aria-pressed", "true" );
        } else {
          $( this ).button( "widget" )
            .removeClass( "ui-state-active" )
            .attr( "aria-pressed", "false" );
        }
      });
    } else if ( this.type === "checkbox" ) {
      if ( this.element.is( ":checked" ) ) {
        this.buttonElement
          .addClass( "ui-state-active" )
          .attr( "aria-pressed", "true" );
      } else {
        this.buttonElement
          .removeClass( "ui-state-active" )
          .attr( "aria-pressed", "false" );
      }
    }
  },

  _resetButton: function() {
    if ( this.type === "input" ) {
      if ( this.options.label ) {
        this.element.val( this.options.label );
      }
      return;
    }
    var buttonElement = this.buttonElement.removeClass( typeClasses ),
      buttonText = $( "<span></span>", this.document[0] )
        .addClass( "ui-button-text" )
        .html( this.options.label )
        .appendTo( buttonElement.empty() )
        .text(),
      icons = this.options.icons,
      multipleIcons = icons.primary && icons.secondary,
      buttonClasses = [];

    if ( icons.primary || icons.secondary ) {
      if ( this.options.text ) {
        buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
      }

      if ( icons.primary ) {
        buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
      }

      if ( icons.secondary ) {
        buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
      }

      if ( !this.options.text ) {
        buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

        if ( !this.hasTitle ) {
          buttonElement.attr( "title", $.trim( buttonText ) );
        }
      }
    } else {
      buttonClasses.push( "ui-button-text-only" );
    }
    buttonElement.addClass( buttonClasses.join( " " ) );
  }
});

$.widget( "ui.buttonset", {
  version: "1.10.4",
  options: {
    items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)"
  },

  _create: function() {
    this.element.addClass( "ui-buttonset" );
  },

  _init: function() {
    this.refresh();
  },

  _setOption: function( key, value ) {
    if ( key === "disabled" ) {
      this.buttons.button( "option", key, value );
    }

    this._super( key, value );
  },

  refresh: function() {
    var rtl = this.element.css( "direction" ) === "rtl";

    this.buttons = this.element.find( this.options.items )
      .filter( ":ui-button" )
        .button( "refresh" )
      .end()
      .not( ":ui-button" )
        .button()
      .end()
      .map(function() {
        return $( this ).button( "widget" )[ 0 ];
      })
        .removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
        .filter( ":first" )
          .addClass( rtl ? "ui-corner-right" : "ui-corner-left" )
        .end()
        .filter( ":last" )
          .addClass( rtl ? "ui-corner-left" : "ui-corner-right" )
        .end()
      .end();
  },

  _destroy: function() {
    this.element.removeClass( "ui-buttonset" );
    this.buttons
      .map(function() {
        return $( this ).button( "widget" )[ 0 ];
      })
        .removeClass( "ui-corner-left ui-corner-right" )
      .end()
      .button( "destroy" );
  }
});

}( jQuery ) );

/*!
 * jQuery UI Datepicker 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/datepicker/
 *
 * Depends:
 *  jquery.ui.core.js
 */
(function( $, undefined ) {

$.extend($.ui, { datepicker: { version: "1.10.4" } });

var PROP_NAME = "datepicker",
  instActive;

/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
  this._curInst = null; // The current instance in use
  this._keyEvent = false; // If the last event was a key event
  this._disabledInputs = []; // List of date picker inputs that have been disabled
  this._datepickerShowing = false; // True if the popup picker is showing , false if not
  this._inDialog = false; // True if showing within a "dialog", false if not
  this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
  this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
  this._appendClass = "ui-datepicker-append"; // The name of the append marker class
  this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
  this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
  this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
  this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
  this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
  this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
  this.regional = []; // Available regional settings, indexed by language code
  this.regional[""] = { // Default regional settings
    closeText: "Done", // Display text for close link
    prevText: "Prev", // Display text for previous month link
    nextText: "Next", // Display text for next month link
    currentText: "Today", // Display text for current month link
    monthNames: ["January","February","March","April","May","June",
      "July","August","September","October","November","December"], // Names of months for drop-down and formatting
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
    dayNamesMin: ["Su","Mo","Tu","We","Th","Fr","Sa"], // Column headings for days starting at Sunday
    weekHeader: "Wk", // Column header for week of the year
    dateFormat: "mm/dd/yy", // See format options on parseDate
    firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
    isRTL: false, // True if right-to-left language, false if left-to-right
    showMonthAfterYear: false, // True if the year select precedes month, false for month then year
    yearSuffix: "" // Additional text to append to the year in the month headers
  };
  this._defaults = { // Global defaults for all the date picker instances
    showOn: "focus", // "focus" for popup on focus,
      // "button" for trigger button, or "both" for either
    showAnim: "fadeIn", // Name of jQuery animation for popup
    showOptions: {}, // Options for enhanced animations
    defaultDate: null, // Used when field is blank: actual date,
      // +/-number for offset from today, null for today
    appendText: "", // Display text following the input box, e.g. showing the format
    buttonText: "...", // Text for trigger button
    buttonImage: "", // URL for trigger button image
    buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
    hideIfNoPrevNext: false, // True to hide next/previous month links
      // if not applicable, false to just disable them
    navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
    gotoCurrent: false, // True if today link goes back to current selection instead
    changeMonth: false, // True if month can be selected directly, false if only prev/next
    changeYear: false, // True if year can be selected directly, false if only prev/next
    yearRange: "c-10:c+10", // Range of years to display in drop-down,
      // either relative to today's year (-nn:+nn), relative to currently displayed year
      // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
    showOtherMonths: false, // True to show dates in other months, false to leave blank
    selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
    showWeek: false, // True to show week of the year, false to not show it
    calculateWeek: this.iso8601Week, // How to calculate the week of the year,
      // takes a Date and returns the number of the week for it
    shortYearCutoff: "+10", // Short year values < this are in the current century,
      // > this are in the previous century,
      // string value starting with "+" for current year + value
    minDate: null, // The earliest selectable date, or null for no limit
    maxDate: null, // The latest selectable date, or null for no limit
    duration: "fast", // Duration of display/closure
    beforeShowDay: null, // Function that takes a date and returns an array with
      // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
      // [2] = cell title (optional), e.g. $.datepicker.noWeekends
    beforeShow: null, // Function that takes an input field and
      // returns a set of custom settings for the date picker
    onSelect: null, // Define a callback function when a date is selected
    onChangeMonthYear: null, // Define a callback function when the month or year is changed
    onClose: null, // Define a callback function when the datepicker is closed
    numberOfMonths: 1, // Number of months to show at a time
    showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
    stepMonths: 1, // Number of months to step back/forward
    stepBigMonths: 12, // Number of months to step back/forward for the big links
    altField: "", // Selector for an alternate field to store selected dates into
    altFormat: "", // The date format to use for the alternate field
    constrainInput: true, // The input is constrained by the current date format
    showButtonPanel: false, // True to show button panel, false to not show it
    autoSize: false, // True to size the input for the date format, false to leave as is
    disabled: false // The initial disabled state
  };
  $.extend(this._defaults, this.regional[""]);
  this.dpDiv = bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
}

$.extend(Datepicker.prototype, {
  /* Class name added to elements to indicate already configured with a date picker. */
  markerClassName: "hasDatepicker",

  //Keep track of the maximum number of rows displayed (see #7043)
  maxRows: 4,

  // TODO rename to "widget" when switching to widget factory
  _widgetDatepicker: function() {
    return this.dpDiv;
  },

  /* Override the default settings for all instances of the date picker.
   * @param  settings  object - the new settings to use as defaults (anonymous object)
   * @return the manager object
   */
  setDefaults: function(settings) {
    extendRemove(this._defaults, settings || {});
    return this;
  },

  /* Attach the date picker to a jQuery selection.
   * @param  target element - the target input field or division or span
   * @param  settings  object - the new settings to use for this date picker instance (anonymous)
   */
  _attachDatepicker: function(target, settings) {
    var nodeName, inline, inst;
    nodeName = target.nodeName.toLowerCase();
    inline = (nodeName === "div" || nodeName === "span");
    if (!target.id) {
      this.uuid += 1;
      target.id = "dp" + this.uuid;
    }
    inst = this._newInst($(target), inline);
    inst.settings = $.extend({}, settings || {});
    if (nodeName === "input") {
      this._connectDatepicker(target, inst);
    } else if (inline) {
      this._inlineDatepicker(target, inst);
    }
  },

  /* Create a new instance object. */
  _newInst: function(target, inline) {
    var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
    return {id: id, input: target, // associated target
      selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
      drawMonth: 0, drawYear: 0, // month being drawn
      inline: inline, // is datepicker inline or not
      dpDiv: (!inline ? this.dpDiv : // presentation div
      bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))};
  },

  /* Attach the date picker to an input field. */
  _connectDatepicker: function(target, inst) {
    var input = $(target);
    inst.append = $([]);
    inst.trigger = $([]);
    if (input.hasClass(this.markerClassName)) {
      return;
    }
    this._attachments(input, inst);
    input.addClass(this.markerClassName).keydown(this._doKeyDown).
      keypress(this._doKeyPress).keyup(this._doKeyUp);
    this._autoSize(inst);
    $.data(target, PROP_NAME, inst);
    //If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
    if( inst.settings.disabled ) {
      this._disableDatepicker( target );
    }
  },

  /* Make attachments based on settings. */
  _attachments: function(input, inst) {
    var showOn, buttonText, buttonImage,
      appendText = this._get(inst, "appendText"),
      isRTL = this._get(inst, "isRTL");

    if (inst.append) {
      inst.append.remove();
    }
    if (appendText) {
      inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
      input[isRTL ? "before" : "after"](inst.append);
    }

    input.unbind("focus", this._showDatepicker);

    if (inst.trigger) {
      inst.trigger.remove();
    }

    showOn = this._get(inst, "showOn");
    if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
      input.focus(this._showDatepicker);
    }
    if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
      buttonText = this._get(inst, "buttonText");
      buttonImage = this._get(inst, "buttonImage");
      inst.trigger = $(this._get(inst, "buttonImageOnly") ?
        $("<img/>").addClass(this._triggerClass).
          attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
        $("<button type='button'></button>").addClass(this._triggerClass).
          html(!buttonImage ? buttonText : $("<img/>").attr(
          { src:buttonImage, alt:buttonText, title:buttonText })));
      input[isRTL ? "before" : "after"](inst.trigger);
      inst.trigger.click(function() {
        if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
          $.datepicker._hideDatepicker();
        } else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
          $.datepicker._hideDatepicker();
          $.datepicker._showDatepicker(input[0]);
        } else {
          $.datepicker._showDatepicker(input[0]);
        }
        return false;
      });
    }
  },

  /* Apply the maximum length for the date format. */
  _autoSize: function(inst) {
    if (this._get(inst, "autoSize") && !inst.inline) {
      var findMax, max, maxI, i,
        date = new Date(2009, 12 - 1, 20), // Ensure double digits
        dateFormat = this._get(inst, "dateFormat");

      if (dateFormat.match(/[DM]/)) {
        findMax = function(names) {
          max = 0;
          maxI = 0;
          for (i = 0; i < names.length; i++) {
            if (names[i].length > max) {
              max = names[i].length;
              maxI = i;
            }
          }
          return maxI;
        };
        date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
          "monthNames" : "monthNamesShort"))));
        date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
          "dayNames" : "dayNamesShort"))) + 20 - date.getDay());
      }
      inst.input.attr("size", this._formatDate(inst, date).length);
    }
  },

  /* Attach an inline date picker to a div. */
  _inlineDatepicker: function(target, inst) {
    var divSpan = $(target);
    if (divSpan.hasClass(this.markerClassName)) {
      return;
    }
    divSpan.addClass(this.markerClassName).append(inst.dpDiv);
    $.data(target, PROP_NAME, inst);
    this._setDate(inst, this._getDefaultDate(inst), true);
    this._updateDatepicker(inst);
    this._updateAlternate(inst);
    //If disabled option is true, disable the datepicker before showing it (see ticket #5665)
    if( inst.settings.disabled ) {
      this._disableDatepicker( target );
    }
    // Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
    // http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
    inst.dpDiv.css( "display", "block" );
  },

  /* Pop-up the date picker in a "dialog" box.
   * @param  input element - ignored
   * @param  date string or Date - the initial date to display
   * @param  onSelect  function - the function to call when a date is selected
   * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
   * @param  pos int[2] - coordinates for the dialog's position within the screen or
   *          event - with x/y coordinates or
   *          leave empty for default (screen centre)
   * @return the manager object
   */
  _dialogDatepicker: function(input, date, onSelect, settings, pos) {
    var id, browserWidth, browserHeight, scrollX, scrollY,
      inst = this._dialogInst; // internal instance

    if (!inst) {
      this.uuid += 1;
      id = "dp" + this.uuid;
      this._dialogInput = $("<input type='text' id='" + id +
        "' style='position: absolute; top: -100px; width: 0px;'/>");
      this._dialogInput.keydown(this._doKeyDown);
      $("body").append(this._dialogInput);
      inst = this._dialogInst = this._newInst(this._dialogInput, false);
      inst.settings = {};
      $.data(this._dialogInput[0], PROP_NAME, inst);
    }
    extendRemove(inst.settings, settings || {});
    date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
    this._dialogInput.val(date);

    this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
    if (!this._pos) {
      browserWidth = document.documentElement.clientWidth;
      browserHeight = document.documentElement.clientHeight;
      scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      this._pos = // should use actual width/height below
        [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
    }

    // move input on screen for focus, but hidden behind dialog
    this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
    inst.settings.onSelect = onSelect;
    this._inDialog = true;
    this.dpDiv.addClass(this._dialogClass);
    this._showDatepicker(this._dialogInput[0]);
    if ($.blockUI) {
      $.blockUI(this.dpDiv);
    }
    $.data(this._dialogInput[0], PROP_NAME, inst);
    return this;
  },

  /* Detach a datepicker from its control.
   * @param  target element - the target input field or division or span
   */
  _destroyDatepicker: function(target) {
    var nodeName,
      $target = $(target),
      inst = $.data(target, PROP_NAME);

    if (!$target.hasClass(this.markerClassName)) {
      return;
    }

    nodeName = target.nodeName.toLowerCase();
    $.removeData(target, PROP_NAME);
    if (nodeName === "input") {
      inst.append.remove();
      inst.trigger.remove();
      $target.removeClass(this.markerClassName).
        unbind("focus", this._showDatepicker).
        unbind("keydown", this._doKeyDown).
        unbind("keypress", this._doKeyPress).
        unbind("keyup", this._doKeyUp);
    } else if (nodeName === "div" || nodeName === "span") {
      $target.removeClass(this.markerClassName).empty();
    }
  },

  /* Enable the date picker to a jQuery selection.
   * @param  target element - the target input field or division or span
   */
  _enableDatepicker: function(target) {
    var nodeName, inline,
      $target = $(target),
      inst = $.data(target, PROP_NAME);

    if (!$target.hasClass(this.markerClassName)) {
      return;
    }

    nodeName = target.nodeName.toLowerCase();
    if (nodeName === "input") {
      target.disabled = false;
      inst.trigger.filter("button").
        each(function() { this.disabled = false; }).end().
        filter("img").css({opacity: "1.0", cursor: ""});
    } else if (nodeName === "div" || nodeName === "span") {
      inline = $target.children("." + this._inlineClass);
      inline.children().removeClass("ui-state-disabled");
      inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
        prop("disabled", false);
    }
    this._disabledInputs = $.map(this._disabledInputs,
      function(value) { return (value === target ? null : value); }); // delete entry
  },

  /* Disable the date picker to a jQuery selection.
   * @param  target element - the target input field or division or span
   */
  _disableDatepicker: function(target) {
    var nodeName, inline,
      $target = $(target),
      inst = $.data(target, PROP_NAME);

    if (!$target.hasClass(this.markerClassName)) {
      return;
    }

    nodeName = target.nodeName.toLowerCase();
    if (nodeName === "input") {
      target.disabled = true;
      inst.trigger.filter("button").
        each(function() { this.disabled = true; }).end().
        filter("img").css({opacity: "0.5", cursor: "default"});
    } else if (nodeName === "div" || nodeName === "span") {
      inline = $target.children("." + this._inlineClass);
      inline.children().addClass("ui-state-disabled");
      inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
        prop("disabled", true);
    }
    this._disabledInputs = $.map(this._disabledInputs,
      function(value) { return (value === target ? null : value); }); // delete entry
    this._disabledInputs[this._disabledInputs.length] = target;
  },

  /* Is the first field in a jQuery collection disabled as a datepicker?
   * @param  target element - the target input field or division or span
   * @return boolean - true if disabled, false if enabled
   */
  _isDisabledDatepicker: function(target) {
    if (!target) {
      return false;
    }
    for (var i = 0; i < this._disabledInputs.length; i++) {
      if (this._disabledInputs[i] === target) {
        return true;
      }
    }
    return false;
  },

  /* Retrieve the instance data for the target control.
   * @param  target  element - the target input field or division or span
   * @return  object - the associated instance data
   * @throws  error if a jQuery problem getting data
   */
  _getInst: function(target) {
    try {
      return $.data(target, PROP_NAME);
    }
    catch (err) {
      throw "Missing instance data for this datepicker";
    }
  },

  /* Update or retrieve the settings for a date picker attached to an input field or division.
   * @param  target  element - the target input field or division or span
   * @param  name object - the new settings to update or
   *        string - the name of the setting to change or retrieve,
   *        when retrieving also "all" for all instance settings or
   *        "defaults" for all global defaults
   * @param  value   any - the new value for the setting
   *        (omit if above is an object or to retrieve a value)
   */
  _optionDatepicker: function(target, name, value) {
    var settings, date, minDate, maxDate,
      inst = this._getInst(target);

    if (arguments.length === 2 && typeof name === "string") {
      return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
        (inst ? (name === "all" ? $.extend({}, inst.settings) :
        this._get(inst, name)) : null));
    }

    settings = name || {};
    if (typeof name === "string") {
      settings = {};
      settings[name] = value;
    }

    if (inst) {
      if (this._curInst === inst) {
        this._hideDatepicker();
      }

      date = this._getDateDatepicker(target, true);
      minDate = this._getMinMaxDate(inst, "min");
      maxDate = this._getMinMaxDate(inst, "max");
      extendRemove(inst.settings, settings);
      // reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
      if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
        inst.settings.minDate = this._formatDate(inst, minDate);
      }
      if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
        inst.settings.maxDate = this._formatDate(inst, maxDate);
      }
      if ( "disabled" in settings ) {
        if ( settings.disabled ) {
          this._disableDatepicker(target);
        } else {
          this._enableDatepicker(target);
        }
      }
      this._attachments($(target), inst);
      this._autoSize(inst);
      this._setDate(inst, date);
      this._updateAlternate(inst);
      this._updateDatepicker(inst);
    }
  },

  // change method deprecated
  _changeDatepicker: function(target, name, value) {
    this._optionDatepicker(target, name, value);
  },

  /* Redraw the date picker attached to an input field or division.
   * @param  target  element - the target input field or division or span
   */
  _refreshDatepicker: function(target) {
    var inst = this._getInst(target);
    if (inst) {
      this._updateDatepicker(inst);
    }
  },

  /* Set the dates for a jQuery selection.
   * @param  target element - the target input field or division or span
   * @param  date Date - the new date
   */
  _setDateDatepicker: function(target, date) {
    var inst = this._getInst(target);
    if (inst) {
      this._setDate(inst, date);
      this._updateDatepicker(inst);
      this._updateAlternate(inst);
    }
  },

  /* Get the date(s) for the first entry in a jQuery selection.
   * @param  target element - the target input field or division or span
   * @param  noDefault boolean - true if no default date is to be used
   * @return Date - the current date
   */
  _getDateDatepicker: function(target, noDefault) {
    var inst = this._getInst(target);
    if (inst && !inst.inline) {
      this._setDateFromField(inst, noDefault);
    }
    return (inst ? this._getDate(inst) : null);
  },

  /* Handle keystrokes. */
  _doKeyDown: function(event) {
    var onSelect, dateStr, sel,
      inst = $.datepicker._getInst(event.target),
      handled = true,
      isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

    inst._keyEvent = true;
    if ($.datepicker._datepickerShowing) {
      switch (event.keyCode) {
        case 9: $.datepicker._hideDatepicker();
            handled = false;
            break; // hide on tab out
        case 13: sel = $("td." + $.datepicker._dayOverClass + ":not(." +
                  $.datepicker._currentClass + ")", inst.dpDiv);
            if (sel[0]) {
              $.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
            }

            onSelect = $.datepicker._get(inst, "onSelect");
            if (onSelect) {
              dateStr = $.datepicker._formatDate(inst);

              // trigger custom callback
              onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
            } else {
              $.datepicker._hideDatepicker();
            }

            return false; // don't submit the form
        case 27: $.datepicker._hideDatepicker();
            break; // hide on escape
        case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
              -$.datepicker._get(inst, "stepBigMonths") :
              -$.datepicker._get(inst, "stepMonths")), "M");
            break; // previous month/year on page up/+ ctrl
        case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
              +$.datepicker._get(inst, "stepBigMonths") :
              +$.datepicker._get(inst, "stepMonths")), "M");
            break; // next month/year on page down/+ ctrl
        case 35: if (event.ctrlKey || event.metaKey) {
              $.datepicker._clearDate(event.target);
            }
            handled = event.ctrlKey || event.metaKey;
            break; // clear on ctrl or command +end
        case 36: if (event.ctrlKey || event.metaKey) {
              $.datepicker._gotoToday(event.target);
            }
            handled = event.ctrlKey || event.metaKey;
            break; // current on ctrl or command +home
        case 37: if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
            }
            handled = event.ctrlKey || event.metaKey;
            // -1 day on ctrl or command +left
            if (event.originalEvent.altKey) {
              $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                -$.datepicker._get(inst, "stepBigMonths") :
                -$.datepicker._get(inst, "stepMonths")), "M");
            }
            // next month/year on alt +left on Mac
            break;
        case 38: if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, -7, "D");
            }
            handled = event.ctrlKey || event.metaKey;
            break; // -1 week on ctrl or command +up
        case 39: if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
            }
            handled = event.ctrlKey || event.metaKey;
            // +1 day on ctrl or command +right
            if (event.originalEvent.altKey) {
              $.datepicker._adjustDate(event.target, (event.ctrlKey ?
                +$.datepicker._get(inst, "stepBigMonths") :
                +$.datepicker._get(inst, "stepMonths")), "M");
            }
            // next month/year on alt +right
            break;
        case 40: if (event.ctrlKey || event.metaKey) {
              $.datepicker._adjustDate(event.target, +7, "D");
            }
            handled = event.ctrlKey || event.metaKey;
            break; // +1 week on ctrl or command +down
        default: handled = false;
      }
    } else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
      $.datepicker._showDatepicker(this);
    } else {
      handled = false;
    }

    if (handled) {
      event.preventDefault();
      event.stopPropagation();
    }
  },

  /* Filter entered characters - based on date format. */
  _doKeyPress: function(event) {
    var chars, chr,
      inst = $.datepicker._getInst(event.target);

    if ($.datepicker._get(inst, "constrainInput")) {
      chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
      chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
      return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
    }
  },

  /* Synchronise manual entry and field/alternate field. */
  _doKeyUp: function(event) {
    var date,
      inst = $.datepicker._getInst(event.target);

    if (inst.input.val() !== inst.lastVal) {
      try {
        date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
          (inst.input ? inst.input.val() : null),
          $.datepicker._getFormatConfig(inst));

        if (date) { // only if valid
          $.datepicker._setDateFromField(inst);
          $.datepicker._updateAlternate(inst);
          $.datepicker._updateDatepicker(inst);
        }
      }
      catch (err) {
      }
    }
    return true;
  },

  /* Pop-up the date picker for a given input field.
   * If false returned from beforeShow event handler do not show.
   * @param  input  element - the input field attached to the date picker or
   *          event - if triggered by focus
   */
  _showDatepicker: function(input) {
    input = input.target || input;
    if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
      input = $("input", input.parentNode)[0];
    }

    if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
      return;
    }

    var inst, beforeShow, beforeShowSettings, isFixed,
      offset, showAnim, duration;

    inst = $.datepicker._getInst(input);
    if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
      $.datepicker._curInst.dpDiv.stop(true, true);
      if ( inst && $.datepicker._datepickerShowing ) {
        $.datepicker._hideDatepicker( $.datepicker._curInst.input[0] );
      }
    }

    beforeShow = $.datepicker._get(inst, "beforeShow");
    beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
    if(beforeShowSettings === false){
      return;
    }
    extendRemove(inst.settings, beforeShowSettings);

    inst.lastVal = null;
    $.datepicker._lastInput = input;
    $.datepicker._setDateFromField(inst);

    if ($.datepicker._inDialog) { // hide cursor
      input.value = "";
    }
    if (!$.datepicker._pos) { // position below input
      $.datepicker._pos = $.datepicker._findPos(input);
      $.datepicker._pos[1] += input.offsetHeight; // add the height
    }

    isFixed = false;
    $(input).parents().each(function() {
      isFixed |= $(this).css("position") === "fixed";
      return !isFixed;
    });

    offset = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
    $.datepicker._pos = null;
    //to avoid flashes on Firefox
    inst.dpDiv.empty();
    // determine sizing offscreen
    inst.dpDiv.css({position: "absolute", display: "block", top: "-1000px"});
    $.datepicker._updateDatepicker(inst);
    // fix width for dynamic number of date pickers
    // and adjust position before showing
    offset = $.datepicker._checkOffset(inst, offset, isFixed);
    inst.dpDiv.css({position: ($.datepicker._inDialog && $.blockUI ?
      "static" : (isFixed ? "fixed" : "absolute")), display: "none",
      left: offset.left + "px", top: offset.top + "px"});

    if (!inst.inline) {
      showAnim = $.datepicker._get(inst, "showAnim");
      duration = $.datepicker._get(inst, "duration");
      inst.dpDiv.zIndex($(input).zIndex()+1);
      $.datepicker._datepickerShowing = true;

      if ( $.effects && $.effects.effect[ showAnim ] ) {
        inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
      } else {
        inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
      }

      if ( $.datepicker._shouldFocusInput( inst ) ) {
        inst.input.focus();
      }

      $.datepicker._curInst = inst;
    }
  },

  /* Generate the date picker content. */
  _updateDatepicker: function(inst) {
    this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
    instActive = inst; // for delegate hover events
    inst.dpDiv.empty().append(this._generateHTML(inst));
    this._attachHandlers(inst);
    inst.dpDiv.find("." + this._dayOverClass + " a").mouseover();

    var origyearshtml,
      numMonths = this._getNumberOfMonths(inst),
      cols = numMonths[1],
      width = 17;

    inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
    if (cols > 1) {
      inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
    }
    inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
      "Class"]("ui-datepicker-multi");
    inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
      "Class"]("ui-datepicker-rtl");

    if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput( inst ) ) {
      inst.input.focus();
    }

    // deffered render of the years select (to avoid flashes on Firefox)
    if( inst.yearshtml ){
      origyearshtml = inst.yearshtml;
      setTimeout(function(){
        //assure that inst.yearshtml didn't change.
        if( origyearshtml === inst.yearshtml && inst.yearshtml ){
          inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
        }
        origyearshtml = inst.yearshtml = null;
      }, 0);
    }
  },

  // #6694 - don't focus the input if it's already focused
  // this breaks the change event in IE
  // Support: IE and jQuery <1.9
  _shouldFocusInput: function( inst ) {
    return inst.input && inst.input.is( ":visible" ) && !inst.input.is( ":disabled" ) && !inst.input.is( ":focus" );
  },

  /* Check positioning to remain on screen. */
  _checkOffset: function(inst, offset, isFixed) {
    var dpWidth = inst.dpDiv.outerWidth(),
      dpHeight = inst.dpDiv.outerHeight(),
      inputWidth = inst.input ? inst.input.outerWidth() : 0,
      inputHeight = inst.input ? inst.input.outerHeight() : 0,
      viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
      viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

    offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
    offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
    offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

    // now check if datepicker is showing outside window viewport - move to a better place if so.
    offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
      Math.abs(offset.left + dpWidth - viewWidth) : 0);
    offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
      Math.abs(dpHeight + inputHeight) : 0);

    return offset;
  },

  /* Find an object's position on the screen. */
  _findPos: function(obj) {
    var position,
      inst = this._getInst(obj),
      isRTL = this._get(inst, "isRTL");

    while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
      obj = obj[isRTL ? "previousSibling" : "nextSibling"];
    }

    position = $(obj).offset();
    return [position.left, position.top];
  },

  /* Hide the date picker from view.
   * @param  input  element - the input field attached to the date picker
   */
  _hideDatepicker: function(input) {
    var showAnim, duration, postProcess, onClose,
      inst = this._curInst;

    if (!inst || (input && inst !== $.data(input, PROP_NAME))) {
      return;
    }

    if (this._datepickerShowing) {
      showAnim = this._get(inst, "showAnim");
      duration = this._get(inst, "duration");
      postProcess = function() {
        $.datepicker._tidyDialog(inst);
      };

      // DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
      if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) ) {
        inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
      } else {
        inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
          (showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
      }

      if (!showAnim) {
        postProcess();
      }
      this._datepickerShowing = false;

      onClose = this._get(inst, "onClose");
      if (onClose) {
        onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
      }

      this._lastInput = null;
      if (this._inDialog) {
        this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
        if ($.blockUI) {
          $.unblockUI();
          $("body").append(this.dpDiv);
        }
      }
      this._inDialog = false;
    }
  },

  /* Tidy up after a dialog display. */
  _tidyDialog: function(inst) {
    inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
  },

  /* Close date picker if clicked elsewhere. */
  _checkExternalClick: function(event) {
    if (!$.datepicker._curInst) {
      return;
    }

    var $target = $(event.target),
      inst = $.datepicker._getInst($target[0]);

    if ( ( ( $target[0].id !== $.datepicker._mainDivId &&
        $target.parents("#" + $.datepicker._mainDivId).length === 0 &&
        !$target.hasClass($.datepicker.markerClassName) &&
        !$target.closest("." + $.datepicker._triggerClass).length &&
        $.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI) ) ) ||
      ( $target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst ) ) {
        $.datepicker._hideDatepicker();
    }
  },

  /* Adjust one of the date sub-fields. */
  _adjustDate: function(id, offset, period) {
    var target = $(id),
      inst = this._getInst(target[0]);

    if (this._isDisabledDatepicker(target[0])) {
      return;
    }
    this._adjustInstDate(inst, offset +
      (period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
      period);
    this._updateDatepicker(inst);
  },

  /* Action for current link. */
  _gotoToday: function(id) {
    var date,
      target = $(id),
      inst = this._getInst(target[0]);

    if (this._get(inst, "gotoCurrent") && inst.currentDay) {
      inst.selectedDay = inst.currentDay;
      inst.drawMonth = inst.selectedMonth = inst.currentMonth;
      inst.drawYear = inst.selectedYear = inst.currentYear;
    } else {
      date = new Date();
      inst.selectedDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = date.getFullYear();
    }
    this._notifyChange(inst);
    this._adjustDate(target);
  },

  /* Action for selecting a new month/year. */
  _selectMonthYear: function(id, select, period) {
    var target = $(id),
      inst = this._getInst(target[0]);

    inst["selected" + (period === "M" ? "Month" : "Year")] =
    inst["draw" + (period === "M" ? "Month" : "Year")] =
      parseInt(select.options[select.selectedIndex].value,10);

    this._notifyChange(inst);
    this._adjustDate(target);
  },

  /* Action for selecting a day. */
  _selectDay: function(id, month, year, td) {
    var inst,
      target = $(id);

    if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
      return;
    }

    inst = this._getInst(target[0]);
    inst.selectedDay = inst.currentDay = $("a", td).html();
    inst.selectedMonth = inst.currentMonth = month;
    inst.selectedYear = inst.currentYear = year;
    this._selectDate(id, this._formatDate(inst,
      inst.currentDay, inst.currentMonth, inst.currentYear));
  },

  /* Erase the input field and hide the date picker. */
  _clearDate: function(id) {
    var target = $(id);
    this._selectDate(target, "");
  },

  /* Update the input field with the selected date. */
  _selectDate: function(id, dateStr) {
    var onSelect,
      target = $(id),
      inst = this._getInst(target[0]);

    dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
    if (inst.input) {
      inst.input.val(dateStr);
    }
    this._updateAlternate(inst);

    onSelect = this._get(inst, "onSelect");
    if (onSelect) {
      onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
    } else if (inst.input) {
      inst.input.trigger("change"); // fire the change event
    }

    if (inst.inline){
      this._updateDatepicker(inst);
    } else {
      this._hideDatepicker();
      this._lastInput = inst.input[0];
      if (typeof(inst.input[0]) !== "object") {
        inst.input.focus(); // restore focus
      }
      this._lastInput = null;
    }
  },

  /* Update any alternate field to synchronise with the main field. */
  _updateAlternate: function(inst) {
    var altFormat, date, dateStr,
      altField = this._get(inst, "altField");

    if (altField) { // update alternate field too
      altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
      date = this._getDate(inst);
      dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
      $(altField).each(function() { $(this).val(dateStr); });
    }
  },

  /* Set as beforeShowDay function to prevent selection of weekends.
   * @param  date  Date - the date to customise
   * @return [boolean, string] - is this date selectable?, what is its CSS class?
   */
  noWeekends: function(date) {
    var day = date.getDay();
    return [(day > 0 && day < 6), ""];
  },

  /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
   * @param  date  Date - the date to get the week for
   * @return  number - the number of the week within the year that contains this date
   */
  iso8601Week: function(date) {
    var time,
      checkDate = new Date(date.getTime());

    // Find Thursday of this week starting on Monday
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

    time = checkDate.getTime();
    checkDate.setMonth(0); // Compare with Jan 1
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
  },

  /* Parse a string value into a date object.
   * See formatDate below for the possible formats.
   *
   * @param  format string - the expected format of the date
   * @param  value string - the date in the above format
   * @param  settings Object - attributes include:
   *          shortYearCutoff  number - the cutoff year for determining the century (optional)
   *          dayNamesShort string[7] - abbreviated names of the days from Sunday (optional)
   *          dayNames    string[7] - names of the days from Sunday (optional)
   *          monthNamesShort string[12] - abbreviated names of the months (optional)
   *          monthNames    string[12] - names of the months (optional)
   * @return  Date - the extracted date value or null if value is blank
   */
  parseDate: function (format, value, settings) {
    if (format == null || value == null) {
      throw "Invalid arguments";
    }

    value = (typeof value === "object" ? value.toString() : value + "");
    if (value === "") {
      return null;
    }

    var iFormat, dim, extra,
      iValue = 0,
      shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
      shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
        new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
      dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
      dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
      monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
      monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
      year = -1,
      month = -1,
      day = -1,
      doy = -1,
      literal = false,
      date,
      // Check whether a format character is doubled
      lookAhead = function(match) {
        var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
        if (matches) {
          iFormat++;
        }
        return matches;
      },
      // Extract a number from the string value
      getNumber = function(match) {
        var isDoubled = lookAhead(match),
          size = (match === "@" ? 14 : (match === "!" ? 20 :
          (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
          digits = new RegExp("^\\d{1," + size + "}"),
          num = value.substring(iValue).match(digits);
        if (!num) {
          throw "Missing number at position " + iValue;
        }
        iValue += num[0].length;
        return parseInt(num[0], 10);
      },
      // Extract a name from the string value and convert to an index
      getName = function(match, shortNames, longNames) {
        var index = -1,
          names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
            return [ [k, v] ];
          }).sort(function (a, b) {
            return -(a[1].length - b[1].length);
          });

        $.each(names, function (i, pair) {
          var name = pair[1];
          if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
            index = pair[0];
            iValue += name.length;
            return false;
          }
        });
        if (index !== -1) {
          return index + 1;
        } else {
          throw "Unknown name at position " + iValue;
        }
      },
      // Confirm that a literal character matches the string value
      checkLiteral = function() {
        if (value.charAt(iValue) !== format.charAt(iFormat)) {
          throw "Unexpected literal at position " + iValue;
        }
        iValue++;
      };

    for (iFormat = 0; iFormat < format.length; iFormat++) {
      if (literal) {
        if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
          literal = false;
        } else {
          checkLiteral();
        }
      } else {
        switch (format.charAt(iFormat)) {
          case "d":
            day = getNumber("d");
            break;
          case "D":
            getName("D", dayNamesShort, dayNames);
            break;
          case "o":
            doy = getNumber("o");
            break;
          case "m":
            month = getNumber("m");
            break;
          case "M":
            month = getName("M", monthNamesShort, monthNames);
            break;
          case "y":
            year = getNumber("y");
            break;
          case "@":
            date = new Date(getNumber("@"));
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case "!":
            date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
            break;
          case "'":
            if (lookAhead("'")){
              checkLiteral();
            } else {
              literal = true;
            }
            break;
          default:
            checkLiteral();
        }
      }
    }

    if (iValue < value.length){
      extra = value.substr(iValue);
      if (!/^\s+/.test(extra)) {
        throw "Extra/unparsed characters found in date: " + extra;
      }
    }

    if (year === -1) {
      year = new Date().getFullYear();
    } else if (year < 100) {
      year += new Date().getFullYear() - new Date().getFullYear() % 100 +
        (year <= shortYearCutoff ? 0 : -100);
    }

    if (doy > -1) {
      month = 1;
      day = doy;
      do {
        dim = this._getDaysInMonth(year, month - 1);
        if (day <= dim) {
          break;
        }
        month++;
        day -= dim;
      } while (true);
    }

    date = this._daylightSavingAdjust(new Date(year, month - 1, day));
    if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      throw "Invalid date"; // E.g. 31/02/00
    }
    return date;
  },

  /* Standard date formats. */
  ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
  COOKIE: "D, dd M yy",
  ISO_8601: "yy-mm-dd",
  RFC_822: "D, d M y",
  RFC_850: "DD, dd-M-y",
  RFC_1036: "D, d M y",
  RFC_1123: "D, d M yy",
  RFC_2822: "D, d M yy",
  RSS: "D, d M y", // RFC 822
  TICKS: "!",
  TIMESTAMP: "@",
  W3C: "yy-mm-dd", // ISO 8601

  _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
    Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

  /* Format a date object into a string value.
   * The format can be combinations of the following:
   * d  - day of month (no leading zero)
   * dd - day of month (two digit)
   * o  - day of year (no leading zeros)
   * oo - day of year (three digit)
   * D  - day name short
   * DD - day name long
   * m  - month of year (no leading zero)
   * mm - month of year (two digit)
   * M  - month name short
   * MM - month name long
   * y  - year (two digit)
   * yy - year (four digit)
   * @ - Unix timestamp (ms since 01/01/1970)
   * ! - Windows ticks (100ns since 01/01/0001)
   * "..." - literal text
   * '' - single quote
   *
   * @param  format string - the desired format of the date
   * @param  date Date - the date value to format
   * @param  settings Object - attributes include:
   *          dayNamesShort string[7] - abbreviated names of the days from Sunday (optional)
   *          dayNames    string[7] - names of the days from Sunday (optional)
   *          monthNamesShort string[12] - abbreviated names of the months (optional)
   *          monthNames    string[12] - names of the months (optional)
   * @return  string - the date in the above format
   */
  formatDate: function (format, date, settings) {
    if (!date) {
      return "";
    }

    var iFormat,
      dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
      dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
      monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
      monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
      // Check whether a format character is doubled
      lookAhead = function(match) {
        var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
        if (matches) {
          iFormat++;
        }
        return matches;
      },
      // Format a number, with leading zero if necessary
      formatNumber = function(match, value, len) {
        var num = "" + value;
        if (lookAhead(match)) {
          while (num.length < len) {
            num = "0" + num;
          }
        }
        return num;
      },
      // Format a name, short or long as requested
      formatName = function(match, value, shortNames, longNames) {
        return (lookAhead(match) ? longNames[value] : shortNames[value]);
      },
      output = "",
      literal = false;

    if (date) {
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            output += format.charAt(iFormat);
          }
        } else {
          switch (format.charAt(iFormat)) {
            case "d":
              output += formatNumber("d", date.getDate(), 2);
              break;
            case "D":
              output += formatName("D", date.getDay(), dayNamesShort, dayNames);
              break;
            case "o":
              output += formatNumber("o",
                Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
              break;
            case "m":
              output += formatNumber("m", date.getMonth() + 1, 2);
              break;
            case "M":
              output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
              break;
            case "y":
              output += (lookAhead("y") ? date.getFullYear() :
                (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
              break;
            case "@":
              output += date.getTime();
              break;
            case "!":
              output += date.getTime() * 10000 + this._ticksTo1970;
              break;
            case "'":
              if (lookAhead("'")) {
                output += "'";
              } else {
                literal = true;
              }
              break;
            default:
              output += format.charAt(iFormat);
          }
        }
      }
    }
    return output;
  },

  /* Extract all possible characters from the date format. */
  _possibleChars: function (format) {
    var iFormat,
      chars = "",
      literal = false,
      // Check whether a format character is doubled
      lookAhead = function(match) {
        var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
        if (matches) {
          iFormat++;
        }
        return matches;
      };

    for (iFormat = 0; iFormat < format.length; iFormat++) {
      if (literal) {
        if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
          literal = false;
        } else {
          chars += format.charAt(iFormat);
        }
      } else {
        switch (format.charAt(iFormat)) {
          case "d": case "m": case "y": case "@":
            chars += "0123456789";
            break;
          case "D": case "M":
            return null; // Accept anything
          case "'":
            if (lookAhead("'")) {
              chars += "'";
            } else {
              literal = true;
            }
            break;
          default:
            chars += format.charAt(iFormat);
        }
      }
    }
    return chars;
  },

  /* Get a setting value, defaulting if necessary. */
  _get: function(inst, name) {
    return inst.settings[name] !== undefined ?
      inst.settings[name] : this._defaults[name];
  },

  /* Parse existing date and initialise date picker. */
  _setDateFromField: function(inst, noDefault) {
    if (inst.input.val() === inst.lastVal) {
      return;
    }

    var dateFormat = this._get(inst, "dateFormat"),
      dates = inst.lastVal = inst.input ? inst.input.val() : null,
      defaultDate = this._getDefaultDate(inst),
      date = defaultDate,
      settings = this._getFormatConfig(inst);

    try {
      date = this.parseDate(dateFormat, dates, settings) || defaultDate;
    } catch (event) {
      dates = (noDefault ? "" : dates);
    }
    inst.selectedDay = date.getDate();
    inst.drawMonth = inst.selectedMonth = date.getMonth();
    inst.drawYear = inst.selectedYear = date.getFullYear();
    inst.currentDay = (dates ? date.getDate() : 0);
    inst.currentMonth = (dates ? date.getMonth() : 0);
    inst.currentYear = (dates ? date.getFullYear() : 0);
    this._adjustInstDate(inst);
  },

  /* Retrieve the default date shown on opening. */
  _getDefaultDate: function(inst) {
    return this._restrictMinMax(inst,
      this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
  },

  /* A date may be specified as an exact value or a relative one. */
  _determineDate: function(inst, date, defaultDate) {
    var offsetNumeric = function(offset) {
        var date = new Date();
        date.setDate(date.getDate() + offset);
        return date;
      },
      offsetString = function(offset) {
        try {
          return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
            offset, $.datepicker._getFormatConfig(inst));
        }
        catch (e) {
          // Ignore
        }

        var date = (offset.toLowerCase().match(/^c/) ?
          $.datepicker._getDate(inst) : null) || new Date(),
          year = date.getFullYear(),
          month = date.getMonth(),
          day = date.getDate(),
          pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
          matches = pattern.exec(offset);

        while (matches) {
          switch (matches[2] || "d") {
            case "d" : case "D" :
              day += parseInt(matches[1],10); break;
            case "w" : case "W" :
              day += parseInt(matches[1],10) * 7; break;
            case "m" : case "M" :
              month += parseInt(matches[1],10);
              day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
              break;
            case "y": case "Y" :
              year += parseInt(matches[1],10);
              day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
              break;
          }
          matches = pattern.exec(offset);
        }
        return new Date(year, month, day);
      },
      newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
        (typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

    newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
    if (newDate) {
      newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
    }
    return this._daylightSavingAdjust(newDate);
  },

  /* Handle switch to/from daylight saving.
   * Hours may be non-zero on daylight saving cut-over:
   * > 12 when midnight changeover, but then cannot generate
   * midnight datetime, so jump to 1AM, otherwise reset.
   * @param  date  (Date) the date to check
   * @return  (Date) the corrected date
   */
  _daylightSavingAdjust: function(date) {
    if (!date) {
      return null;
    }
    date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
    return date;
  },

  /* Set the date(s) directly. */
  _setDate: function(inst, date, noChange) {
    var clear = !date,
      origMonth = inst.selectedMonth,
      origYear = inst.selectedYear,
      newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

    inst.selectedDay = inst.currentDay = newDate.getDate();
    inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
    inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
    if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
      this._notifyChange(inst);
    }
    this._adjustInstDate(inst);
    if (inst.input) {
      inst.input.val(clear ? "" : this._formatDate(inst));
    }
  },

  /* Retrieve the date(s) directly. */
  _getDate: function(inst) {
    var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
      this._daylightSavingAdjust(new Date(
      inst.currentYear, inst.currentMonth, inst.currentDay)));
      return startDate;
  },

  /* Attach the onxxx handlers.  These are declared statically so
   * they work with static code transformers like Caja.
   */
  _attachHandlers: function(inst) {
    var stepMonths = this._get(inst, "stepMonths"),
      id = "#" + inst.id.replace( /\\\\/g, "\\" );
    inst.dpDiv.find("[data-handler]").map(function () {
      var handler = {
        prev: function () {
          $.datepicker._adjustDate(id, -stepMonths, "M");
        },
        next: function () {
          $.datepicker._adjustDate(id, +stepMonths, "M");
        },
        hide: function () {
          $.datepicker._hideDatepicker();
        },
        today: function () {
          $.datepicker._gotoToday(id);
        },
        selectDay: function () {
          $.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
          return false;
        },
        selectMonth: function () {
          $.datepicker._selectMonthYear(id, this, "M");
          return false;
        },
        selectYear: function () {
          $.datepicker._selectMonthYear(id, this, "Y");
          return false;
        }
      };
      $(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
    });
  },

  /* Generate the HTML for the current state of the date picker. */
  _generateHTML: function(inst) {
    var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
      controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
      monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
      selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
      cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
      printDate, dRow, tbody, daySettings, otherMonth, unselectable,
      tempDate = new Date(),
      today = this._daylightSavingAdjust(
        new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
      isRTL = this._get(inst, "isRTL"),
      showButtonPanel = this._get(inst, "showButtonPanel"),
      hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
      navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
      numMonths = this._getNumberOfMonths(inst),
      showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
      stepMonths = this._get(inst, "stepMonths"),
      isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
      currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
        new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
      minDate = this._getMinMaxDate(inst, "min"),
      maxDate = this._getMinMaxDate(inst, "max"),
      drawMonth = inst.drawMonth - showCurrentAtPos,
      drawYear = inst.drawYear;

    if (drawMonth < 0) {
      drawMonth += 12;
      drawYear--;
    }
    if (maxDate) {
      maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
        maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
      maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
      while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
        drawMonth--;
        if (drawMonth < 0) {
          drawMonth = 11;
          drawYear--;
        }
      }
    }
    inst.drawMonth = drawMonth;
    inst.drawYear = drawYear;

    prevText = this._get(inst, "prevText");
    prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
      this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
      this._getFormatConfig(inst)));

    prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
      "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
      " title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" :
      (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+ prevText +"'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));

    nextText = this._get(inst, "nextText");
    nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
      this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
      this._getFormatConfig(inst)));

    next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
      "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
      " title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" :
      (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+ nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));

    currentText = this._get(inst, "currentText");
    gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
    currentText = (!navigationAsDateFormat ? currentText :
      this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

    controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
      this._get(inst, "closeText") + "</button>" : "");

    buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
      (this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
      ">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

    firstDay = parseInt(this._get(inst, "firstDay"),10);
    firstDay = (isNaN(firstDay) ? 0 : firstDay);

    showWeek = this._get(inst, "showWeek");
    dayNames = this._get(inst, "dayNames");
    dayNamesMin = this._get(inst, "dayNamesMin");
    monthNames = this._get(inst, "monthNames");
    monthNamesShort = this._get(inst, "monthNamesShort");
    beforeShowDay = this._get(inst, "beforeShowDay");
    showOtherMonths = this._get(inst, "showOtherMonths");
    selectOtherMonths = this._get(inst, "selectOtherMonths");
    defaultDate = this._getDefaultDate(inst);
    html = "";
    dow;
    for (row = 0; row < numMonths[0]; row++) {
      group = "";
      this.maxRows = 4;
      for (col = 0; col < numMonths[1]; col++) {
        selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
        cornerClass = " ui-corner-all";
        calender = "";
        if (isMultiMonth) {
          calender += "<div class='ui-datepicker-group";
          if (numMonths[1] > 1) {
            switch (col) {
              case 0: calender += " ui-datepicker-group-first";
                cornerClass = " ui-corner-" + (isRTL ? "right" : "left"); break;
              case numMonths[1]-1: calender += " ui-datepicker-group-last";
                cornerClass = " ui-corner-" + (isRTL ? "left" : "right"); break;
              default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
            }
          }
          calender += "'>";
        }
        calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
          (/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
          (/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
          this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
          row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
          "</div><table class='ui-datepicker-calendar'><thead>" +
          "<tr>";
        thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
        for (dow = 0; dow < 7; dow++) { // days of the week
          day = (dow + firstDay) % 7;
          thead += "<th" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
            "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
        }
        calender += thead + "</tr></thead><tbody>";
        daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
        if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
          inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
        }
        leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
        curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
        numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
        this.maxRows = numRows;
        printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
        for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
          calender += "<tr>";
          tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
            this._get(inst, "calculateWeek")(printDate) + "</td>");
          for (dow = 0; dow < 7; dow++) { // create date picker days
            daySettings = (beforeShowDay ?
              beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
            otherMonth = (printDate.getMonth() !== drawMonth);
            unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
              (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
            tbody += "<td class='" +
              ((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
              (otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
              ((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
              (defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
              // or defaultDate is current printedDate and defaultDate is selectedDate
              " " + this._dayOverClass : "") + // highlight selected day
              (unselectable ? " " + this._unselectableClass + " ui-state-disabled": "") +  // highlight unselectable days
              (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
              (printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
              (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
              ((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
              (unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
              (otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
              (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
              (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
              (printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
              (otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
              "' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
            printDate.setDate(printDate.getDate() + 1);
            printDate = this._daylightSavingAdjust(printDate);
          }
          calender += tbody + "</tr>";
        }
        drawMonth++;
        if (drawMonth > 11) {
          drawMonth = 0;
          drawYear++;
        }
        calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
              ((numMonths[0] > 0 && col === numMonths[1]-1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
        group += calender;
      }
      html += group;
    }
    html += buttonPanel;
    inst._keyEvent = false;
    return html;
  },

  /* Generate the month and year header. */
  _generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
      secondary, monthNames, monthNamesShort) {

    var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
      changeMonth = this._get(inst, "changeMonth"),
      changeYear = this._get(inst, "changeYear"),
      showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
      html = "<div class='ui-datepicker-title'>",
      monthHtml = "";

    // month selection
    if (secondary || !changeMonth) {
      monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
    } else {
      inMinYear = (minDate && minDate.getFullYear() === drawYear);
      inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
      monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
      for ( month = 0; month < 12; month++) {
        if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
          monthHtml += "<option value='" + month + "'" +
            (month === drawMonth ? " selected='selected'" : "") +
            ">" + monthNamesShort[month] + "</option>";
        }
      }
      monthHtml += "</select>";
    }

    if (!showMonthAfterYear) {
      html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
    }

    // year selection
    if ( !inst.yearshtml ) {
      inst.yearshtml = "";
      if (secondary || !changeYear) {
        html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
      } else {
        // determine range of years to display
        years = this._get(inst, "yearRange").split(":");
        thisYear = new Date().getFullYear();
        determineYear = function(value) {
          var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
            (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
            parseInt(value, 10)));
          return (isNaN(year) ? thisYear : year);
        };
        year = determineYear(years[0]);
        endYear = Math.max(year, determineYear(years[1] || ""));
        year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
        endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
        inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
        for (; year <= endYear; year++) {
          inst.yearshtml += "<option value='" + year + "'" +
            (year === drawYear ? " selected='selected'" : "") +
            ">" + year + "</option>";
        }
        inst.yearshtml += "</select>";

        html += inst.yearshtml;
        inst.yearshtml = null;
      }
    }

    html += this._get(inst, "yearSuffix");
    if (showMonthAfterYear) {
      html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
    }
    html += "</div>"; // Close datepicker_header
    return html;
  },

  /* Adjust one of the date sub-fields. */
  _adjustInstDate: function(inst, offset, period) {
    var year = inst.drawYear + (period === "Y" ? offset : 0),
      month = inst.drawMonth + (period === "M" ? offset : 0),
      day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
      date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

    inst.selectedDay = date.getDate();
    inst.drawMonth = inst.selectedMonth = date.getMonth();
    inst.drawYear = inst.selectedYear = date.getFullYear();
    if (period === "M" || period === "Y") {
      this._notifyChange(inst);
    }
  },

  /* Ensure a date is within any min/max bounds. */
  _restrictMinMax: function(inst, date) {
    var minDate = this._getMinMaxDate(inst, "min"),
      maxDate = this._getMinMaxDate(inst, "max"),
      newDate = (minDate && date < minDate ? minDate : date);
    return (maxDate && newDate > maxDate ? maxDate : newDate);
  },

  /* Notify change of month/year. */
  _notifyChange: function(inst) {
    var onChange = this._get(inst, "onChangeMonthYear");
    if (onChange) {
      onChange.apply((inst.input ? inst.input[0] : null),
        [inst.selectedYear, inst.selectedMonth + 1, inst]);
    }
  },

  /* Determine the number of months to show. */
  _getNumberOfMonths: function(inst) {
    var numMonths = this._get(inst, "numberOfMonths");
    return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
  },

  /* Determine the current maximum date - ensure no time components are set. */
  _getMinMaxDate: function(inst, minMax) {
    return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
  },

  /* Find the number of days in a given month. */
  _getDaysInMonth: function(year, month) {
    return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
  },

  /* Find the day of the week of the first of a month. */
  _getFirstDayOfMonth: function(year, month) {
    return new Date(year, month, 1).getDay();
  },

  /* Determines if we should allow a "next/prev" month display change. */
  _canAdjustMonth: function(inst, offset, curYear, curMonth) {
    var numMonths = this._getNumberOfMonths(inst),
      date = this._daylightSavingAdjust(new Date(curYear,
      curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

    if (offset < 0) {
      date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
    }
    return this._isInRange(inst, date);
  },

  /* Is the given date in the accepted range? */
  _isInRange: function(inst, date) {
    var yearSplit, currentYear,
      minDate = this._getMinMaxDate(inst, "min"),
      maxDate = this._getMinMaxDate(inst, "max"),
      minYear = null,
      maxYear = null,
      years = this._get(inst, "yearRange");
      if (years){
        yearSplit = years.split(":");
        currentYear = new Date().getFullYear();
        minYear = parseInt(yearSplit[0], 10);
        maxYear = parseInt(yearSplit[1], 10);
        if ( yearSplit[0].match(/[+\-].*/) ) {
          minYear += currentYear;
        }
        if ( yearSplit[1].match(/[+\-].*/) ) {
          maxYear += currentYear;
        }
      }

    return ((!minDate || date.getTime() >= minDate.getTime()) &&
      (!maxDate || date.getTime() <= maxDate.getTime()) &&
      (!minYear || date.getFullYear() >= minYear) &&
      (!maxYear || date.getFullYear() <= maxYear));
  },

  /* Provide the configuration settings for formatting/parsing. */
  _getFormatConfig: function(inst) {
    var shortYearCutoff = this._get(inst, "shortYearCutoff");
    shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
      new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
    return {shortYearCutoff: shortYearCutoff,
      dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
      monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")};
  },

  /* Format the given date for display. */
  _formatDate: function(inst, day, month, year) {
    if (!day) {
      inst.currentDay = inst.selectedDay;
      inst.currentMonth = inst.selectedMonth;
      inst.currentYear = inst.selectedYear;
    }
    var date = (day ? (typeof day === "object" ? day :
      this._daylightSavingAdjust(new Date(year, month, day))) :
      this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
    return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
  }
});

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function bindHover(dpDiv) {
  var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
  return dpDiv.delegate(selector, "mouseout", function() {
      $(this).removeClass("ui-state-hover");
      if (this.className.indexOf("ui-datepicker-prev") !== -1) {
        $(this).removeClass("ui-datepicker-prev-hover");
      }
      if (this.className.indexOf("ui-datepicker-next") !== -1) {
        $(this).removeClass("ui-datepicker-next-hover");
      }
    })
    .delegate(selector, "mouseover", function(){
      if (!$.datepicker._isDisabledDatepicker( instActive.inline ? dpDiv.parent()[0] : instActive.input[0])) {
        $(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
        $(this).addClass("ui-state-hover");
        if (this.className.indexOf("ui-datepicker-prev") !== -1) {
          $(this).addClass("ui-datepicker-prev-hover");
        }
        if (this.className.indexOf("ui-datepicker-next") !== -1) {
          $(this).addClass("ui-datepicker-next-hover");
        }
      }
    });
}

/* jQuery extend now ignores nulls! */
function extendRemove(target, props) {
  $.extend(target, props);
  for (var name in props) {
    if (props[name] == null) {
      target[name] = props[name];
    }
  }
  return target;
}

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
          Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function(options){

  /* Verify an empty collection wasn't passed - Fixes #6976 */
  if ( !this.length ) {
    return this;
  }

  /* Initialise the date picker. */
  if (!$.datepicker.initialized) {
    $(document).mousedown($.datepicker._checkExternalClick);
    $.datepicker.initialized = true;
  }

  /* Append datepicker main container to body if not exist. */
  if ($("#"+$.datepicker._mainDivId).length === 0) {
    $("body").append($.datepicker.dpDiv);
  }

  var otherArgs = Array.prototype.slice.call(arguments, 1);
  if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
    return $.datepicker["_" + options + "Datepicker"].
      apply($.datepicker, [this[0]].concat(otherArgs));
  }
  if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
    return $.datepicker["_" + options + "Datepicker"].
      apply($.datepicker, [this[0]].concat(otherArgs));
  }
  return this.each(function() {
    typeof options === "string" ?
      $.datepicker["_" + options + "Datepicker"].
        apply($.datepicker, [this].concat(otherArgs)) :
      $.datepicker._attachDatepicker(this, options);
  });
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.10.4";

})(jQuery);

/*!
 * jQuery UI Slider 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/slider/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.mouse.js
 *  jquery.ui.widget.js
 */
(function( $, undefined ) {

// number of pages in a slider
// (how many times can you page up/down to go through the whole range)
var numPages = 5;

$.widget( "ui.slider", $.ui.mouse, {
  version: "1.10.4",
  widgetEventPrefix: "slide",

  options: {
    animate: false,
    distance: 0,
    max: 100,
    min: 0,
    orientation: "horizontal",
    range: false,
    step: 1,
    value: 0,
    values: null,

    // callbacks
    change: null,
    slide: null,
    start: null,
    stop: null
  },

  _create: function() {
    this._keySliding = false;
    this._mouseSliding = false;
    this._animateOff = true;
    this._handleIndex = null;
    this._detectOrientation();
    this._mouseInit();

    this.element
      .addClass( "ui-slider" +
        " ui-slider-" + this.orientation +
        " ui-widget" +
        " ui-widget-content" +
        " ui-corner-all");

    this._refresh();
    this._setOption( "disabled", this.options.disabled );

    this._animateOff = false;
  },

  _refresh: function() {
    this._createRange();
    this._createHandles();
    this._setupEvents();
    this._refreshValue();
  },

  _createHandles: function() {
    var i, handleCount,
      options = this.options,
      existingHandles = this.element.find( ".ui-slider-handle" ).addClass( "ui-state-default ui-corner-all" ),
      handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
      handles = [];

    handleCount = ( options.values && options.values.length ) || 1;

    if ( existingHandles.length > handleCount ) {
      existingHandles.slice( handleCount ).remove();
      existingHandles = existingHandles.slice( 0, handleCount );
    }

    for ( i = existingHandles.length; i < handleCount; i++ ) {
      handles.push( handle );
    }

    this.handles = existingHandles.add( $( handles.join( "" ) ).appendTo( this.element ) );

    this.handle = this.handles.eq( 0 );

    this.handles.each(function( i ) {
      $( this ).data( "ui-slider-handle-index", i );
    });
  },

  _createRange: function() {
    var options = this.options,
      classes = "";

    if ( options.range ) {
      if ( options.range === true ) {
        if ( !options.values ) {
          options.values = [ this._valueMin(), this._valueMin() ];
        } else if ( options.values.length && options.values.length !== 2 ) {
          options.values = [ options.values[0], options.values[0] ];
        } else if ( $.isArray( options.values ) ) {
          options.values = options.values.slice(0);
        }
      }

      if ( !this.range || !this.range.length ) {
        this.range = $( "<div></div>" )
          .appendTo( this.element );

        classes = "ui-slider-range" +
        // note: this isn't the most fittingly semantic framework class for this element,
        // but worked best visually with a variety of themes
        " ui-widget-header ui-corner-all";
      } else {
        this.range.removeClass( "ui-slider-range-min ui-slider-range-max" )
          // Handle range switching from true to min/max
          .css({
            "left": "",
            "bottom": ""
          });
      }

      this.range.addClass( classes +
        ( ( options.range === "min" || options.range === "max" ) ? " ui-slider-range-" + options.range : "" ) );
    } else {
      if ( this.range ) {
        this.range.remove();
      }
      this.range = null;
    }
  },

  _setupEvents: function() {
    var elements = this.handles.add( this.range ).filter( "a" );
    this._off( elements );
    this._on( elements, this._handleEvents );
    this._hoverable( elements );
    this._focusable( elements );
  },

  _destroy: function() {
    this.handles.remove();
    if ( this.range ) {
      this.range.remove();
    }

    this.element
      .removeClass( "ui-slider" +
        " ui-slider-horizontal" +
        " ui-slider-vertical" +
        " ui-widget" +
        " ui-widget-content" +
        " ui-corner-all" );

    this._mouseDestroy();
  },

  _mouseCapture: function( event ) {
    var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
      that = this,
      o = this.options;

    if ( o.disabled ) {
      return false;
    }

    this.elementSize = {
      width: this.element.outerWidth(),
      height: this.element.outerHeight()
    };
    this.elementOffset = this.element.offset();

    position = { x: event.pageX, y: event.pageY };
    normValue = this._normValueFromMouse( position );
    distance = this._valueMax() - this._valueMin() + 1;
    this.handles.each(function( i ) {
      var thisDistance = Math.abs( normValue - that.values(i) );
      if (( distance > thisDistance ) ||
        ( distance === thisDistance &&
          (i === that._lastChangedValue || that.values(i) === o.min ))) {
        distance = thisDistance;
        closestHandle = $( this );
        index = i;
      }
    });

    allowed = this._start( event, index );
    if ( allowed === false ) {
      return false;
    }
    this._mouseSliding = true;

    this._handleIndex = index;

    closestHandle
      .addClass( "ui-state-active" )
      .focus();

    offset = closestHandle.offset();
    mouseOverHandle = !$( event.target ).parents().addBack().is( ".ui-slider-handle" );
    this._clickOffset = mouseOverHandle ? { left: 0, top: 0 } : {
      left: event.pageX - offset.left - ( closestHandle.width() / 2 ),
      top: event.pageY - offset.top -
        ( closestHandle.height() / 2 ) -
        ( parseInt( closestHandle.css("borderTopWidth"), 10 ) || 0 ) -
        ( parseInt( closestHandle.css("borderBottomWidth"), 10 ) || 0) +
        ( parseInt( closestHandle.css("marginTop"), 10 ) || 0)
    };

    if ( !this.handles.hasClass( "ui-state-hover" ) ) {
      this._slide( event, index, normValue );
    }
    this._animateOff = true;
    return true;
  },

  _mouseStart: function() {
    return true;
  },

  _mouseDrag: function( event ) {
    var position = { x: event.pageX, y: event.pageY },
      normValue = this._normValueFromMouse( position );

    this._slide( event, this._handleIndex, normValue );

    return false;
  },

  _mouseStop: function( event ) {
    this.handles.removeClass( "ui-state-active" );
    this._mouseSliding = false;

    this._stop( event, this._handleIndex );
    this._change( event, this._handleIndex );

    this._handleIndex = null;
    this._clickOffset = null;
    this._animateOff = false;

    return false;
  },

  _detectOrientation: function() {
    this.orientation = ( this.options.orientation === "vertical" ) ? "vertical" : "horizontal";
  },

  _normValueFromMouse: function( position ) {
    var pixelTotal,
      pixelMouse,
      percentMouse,
      valueTotal,
      valueMouse;

    if ( this.orientation === "horizontal" ) {
      pixelTotal = this.elementSize.width;
      pixelMouse = position.x - this.elementOffset.left - ( this._clickOffset ? this._clickOffset.left : 0 );
    } else {
      pixelTotal = this.elementSize.height;
      pixelMouse = position.y - this.elementOffset.top - ( this._clickOffset ? this._clickOffset.top : 0 );
    }

    percentMouse = ( pixelMouse / pixelTotal );
    if ( percentMouse > 1 ) {
      percentMouse = 1;
    }
    if ( percentMouse < 0 ) {
      percentMouse = 0;
    }
    if ( this.orientation === "vertical" ) {
      percentMouse = 1 - percentMouse;
    }

    valueTotal = this._valueMax() - this._valueMin();
    valueMouse = this._valueMin() + percentMouse * valueTotal;

    return this._trimAlignValue( valueMouse );
  },

  _start: function( event, index ) {
    var uiHash = {
      handle: this.handles[ index ],
      value: this.value()
    };
    if ( this.options.values && this.options.values.length ) {
      uiHash.value = this.values( index );
      uiHash.values = this.values();
    }
    return this._trigger( "start", event, uiHash );
  },

  _slide: function( event, index, newVal ) {
    var otherVal,
      newValues,
      allowed;

    if ( this.options.values && this.options.values.length ) {
      otherVal = this.values( index ? 0 : 1 );

      if ( ( this.options.values.length === 2 && this.options.range === true ) &&
          ( ( index === 0 && newVal > otherVal) || ( index === 1 && newVal < otherVal ) )
        ) {
        newVal = otherVal;
      }

      if ( newVal !== this.values( index ) ) {
        newValues = this.values();
        newValues[ index ] = newVal;
        // A slide can be canceled by returning false from the slide callback
        allowed = this._trigger( "slide", event, {
          handle: this.handles[ index ],
          value: newVal,
          values: newValues
        } );
        otherVal = this.values( index ? 0 : 1 );
        if ( allowed !== false ) {
          this.values( index, newVal );
        }
      }
    } else {
      if ( newVal !== this.value() ) {
        // A slide can be canceled by returning false from the slide callback
        allowed = this._trigger( "slide", event, {
          handle: this.handles[ index ],
          value: newVal
        } );
        if ( allowed !== false ) {
          this.value( newVal );
        }
      }
    }
  },

  _stop: function( event, index ) {
    var uiHash = {
      handle: this.handles[ index ],
      value: this.value()
    };
    if ( this.options.values && this.options.values.length ) {
      uiHash.value = this.values( index );
      uiHash.values = this.values();
    }

    this._trigger( "stop", event, uiHash );
  },

  _change: function( event, index ) {
    if ( !this._keySliding && !this._mouseSliding ) {
      var uiHash = {
        handle: this.handles[ index ],
        value: this.value()
      };
      if ( this.options.values && this.options.values.length ) {
        uiHash.value = this.values( index );
        uiHash.values = this.values();
      }

      //store the last changed value index for reference when handles overlap
      this._lastChangedValue = index;

      this._trigger( "change", event, uiHash );
    }
  },

  value: function( newValue ) {
    if ( arguments.length ) {
      this.options.value = this._trimAlignValue( newValue );
      this._refreshValue();
      this._change( null, 0 );
      return;
    }

    return this._value();
  },

  values: function( index, newValue ) {
    var vals,
      newValues,
      i;

    if ( arguments.length > 1 ) {
      this.options.values[ index ] = this._trimAlignValue( newValue );
      this._refreshValue();
      this._change( null, index );
      return;
    }

    if ( arguments.length ) {
      if ( $.isArray( arguments[ 0 ] ) ) {
        vals = this.options.values;
        newValues = arguments[ 0 ];
        for ( i = 0; i < vals.length; i += 1 ) {
          vals[ i ] = this._trimAlignValue( newValues[ i ] );
          this._change( null, i );
        }
        this._refreshValue();
      } else {
        if ( this.options.values && this.options.values.length ) {
          return this._values( index );
        } else {
          return this.value();
        }
      }
    } else {
      return this._values();
    }
  },

  _setOption: function( key, value ) {
    var i,
      valsLength = 0;

    if ( key === "range" && this.options.range === true ) {
      if ( value === "min" ) {
        this.options.value = this._values( 0 );
        this.options.values = null;
      } else if ( value === "max" ) {
        this.options.value = this._values( this.options.values.length-1 );
        this.options.values = null;
      }
    }

    if ( $.isArray( this.options.values ) ) {
      valsLength = this.options.values.length;
    }

    $.Widget.prototype._setOption.apply( this, arguments );

    switch ( key ) {
      case "orientation":
        this._detectOrientation();
        this.element
          .removeClass( "ui-slider-horizontal ui-slider-vertical" )
          .addClass( "ui-slider-" + this.orientation );
        this._refreshValue();
        break;
      case "value":
        this._animateOff = true;
        this._refreshValue();
        this._change( null, 0 );
        this._animateOff = false;
        break;
      case "values":
        this._animateOff = true;
        this._refreshValue();
        for ( i = 0; i < valsLength; i += 1 ) {
          this._change( null, i );
        }
        this._animateOff = false;
        break;
      case "min":
      case "max":
        this._animateOff = true;
        this._refreshValue();
        this._animateOff = false;
        break;
      case "range":
        this._animateOff = true;
        this._refresh();
        this._animateOff = false;
        break;
    }
  },

  //internal value getter
  // _value() returns value trimmed by min and max, aligned by step
  _value: function() {
    var val = this.options.value;
    val = this._trimAlignValue( val );

    return val;
  },

  //internal values getter
  // _values() returns array of values trimmed by min and max, aligned by step
  // _values( index ) returns single value trimmed by min and max, aligned by step
  _values: function( index ) {
    var val,
      vals,
      i;

    if ( arguments.length ) {
      val = this.options.values[ index ];
      val = this._trimAlignValue( val );

      return val;
    } else if ( this.options.values && this.options.values.length ) {
      // .slice() creates a copy of the array
      // this copy gets trimmed by min and max and then returned
      vals = this.options.values.slice();
      for ( i = 0; i < vals.length; i+= 1) {
        vals[ i ] = this._trimAlignValue( vals[ i ] );
      }

      return vals;
    } else {
      return [];
    }
  },

  // returns the step-aligned value that val is closest to, between (inclusive) min and max
  _trimAlignValue: function( val ) {
    if ( val <= this._valueMin() ) {
      return this._valueMin();
    }
    if ( val >= this._valueMax() ) {
      return this._valueMax();
    }
    var step = ( this.options.step > 0 ) ? this.options.step : 1,
      valModStep = (val - this._valueMin()) % step,
      alignValue = val - valModStep;

    if ( Math.abs(valModStep) * 2 >= step ) {
      alignValue += ( valModStep > 0 ) ? step : ( -step );
    }

    // Since JavaScript has problems with large floats, round
    // the final value to 5 digits after the decimal point (see #4124)
    return parseFloat( alignValue.toFixed(5) );
  },

  _valueMin: function() {
    return this.options.min;
  },

  _valueMax: function() {
    return this.options.max;
  },

  _refreshValue: function() {
    var lastValPercent, valPercent, value, valueMin, valueMax,
      oRange = this.options.range,
      o = this.options,
      that = this,
      animate = ( !this._animateOff ) ? o.animate : false,
      _set = {};

    if ( this.options.values && this.options.values.length ) {
      this.handles.each(function( i ) {
        valPercent = ( that.values(i) - that._valueMin() ) / ( that._valueMax() - that._valueMin() ) * 100;
        _set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
        $( this ).stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );
        if ( that.options.range === true ) {
          if ( that.orientation === "horizontal" ) {
            if ( i === 0 ) {
              that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { left: valPercent + "%" }, o.animate );
            }
            if ( i === 1 ) {
              that.range[ animate ? "animate" : "css" ]( { width: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
            }
          } else {
            if ( i === 0 ) {
              that.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { bottom: ( valPercent ) + "%" }, o.animate );
            }
            if ( i === 1 ) {
              that.range[ animate ? "animate" : "css" ]( { height: ( valPercent - lastValPercent ) + "%" }, { queue: false, duration: o.animate } );
            }
          }
        }
        lastValPercent = valPercent;
      });
    } else {
      value = this.value();
      valueMin = this._valueMin();
      valueMax = this._valueMax();
      valPercent = ( valueMax !== valueMin ) ?
          ( value - valueMin ) / ( valueMax - valueMin ) * 100 :
          0;
      _set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
      this.handle.stop( 1, 1 )[ animate ? "animate" : "css" ]( _set, o.animate );

      if ( oRange === "min" && this.orientation === "horizontal" ) {
        this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { width: valPercent + "%" }, o.animate );
      }
      if ( oRange === "max" && this.orientation === "horizontal" ) {
        this.range[ animate ? "animate" : "css" ]( { width: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
      }
      if ( oRange === "min" && this.orientation === "vertical" ) {
        this.range.stop( 1, 1 )[ animate ? "animate" : "css" ]( { height: valPercent + "%" }, o.animate );
      }
      if ( oRange === "max" && this.orientation === "vertical" ) {
        this.range[ animate ? "animate" : "css" ]( { height: ( 100 - valPercent ) + "%" }, { queue: false, duration: o.animate } );
      }
    }
  },

  _handleEvents: {
    keydown: function( event ) {
      var allowed, curVal, newVal, step,
        index = $( event.target ).data( "ui-slider-handle-index" );

      switch ( event.keyCode ) {
        case $.ui.keyCode.HOME:
        case $.ui.keyCode.END:
        case $.ui.keyCode.PAGE_UP:
        case $.ui.keyCode.PAGE_DOWN:
        case $.ui.keyCode.UP:
        case $.ui.keyCode.RIGHT:
        case $.ui.keyCode.DOWN:
        case $.ui.keyCode.LEFT:
          event.preventDefault();
          if ( !this._keySliding ) {
            this._keySliding = true;
            $( event.target ).addClass( "ui-state-active" );
            allowed = this._start( event, index );
            if ( allowed === false ) {
              return;
            }
          }
          break;
      }

      step = this.options.step;
      if ( this.options.values && this.options.values.length ) {
        curVal = newVal = this.values( index );
      } else {
        curVal = newVal = this.value();
      }

      switch ( event.keyCode ) {
        case $.ui.keyCode.HOME:
          newVal = this._valueMin();
          break;
        case $.ui.keyCode.END:
          newVal = this._valueMax();
          break;
        case $.ui.keyCode.PAGE_UP:
          newVal = this._trimAlignValue( curVal + ( (this._valueMax() - this._valueMin()) / numPages ) );
          break;
        case $.ui.keyCode.PAGE_DOWN:
          newVal = this._trimAlignValue( curVal - ( (this._valueMax() - this._valueMin()) / numPages ) );
          break;
        case $.ui.keyCode.UP:
        case $.ui.keyCode.RIGHT:
          if ( curVal === this._valueMax() ) {
            return;
          }
          newVal = this._trimAlignValue( curVal + step );
          break;
        case $.ui.keyCode.DOWN:
        case $.ui.keyCode.LEFT:
          if ( curVal === this._valueMin() ) {
            return;
          }
          newVal = this._trimAlignValue( curVal - step );
          break;
      }

      this._slide( event, index, newVal );
    },
    click: function( event ) {
      event.preventDefault();
    },
    keyup: function( event ) {
      var index = $( event.target ).data( "ui-slider-handle-index" );

      if ( this._keySliding ) {
        this._keySliding = false;
        this._stop( event, index );
        this._change( event, index );
        $( event.target ).removeClass( "ui-state-active" );
      }
    }
  }

});

}(jQuery));

/*!
 * jQuery UI Spinner 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/spinner/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.button.js
 */
(function( $ ) {

function modifier( fn ) {
  return function() {
    var previous = this.element.val();
    fn.apply( this, arguments );
    this._refresh();
    if ( previous !== this.element.val() ) {
      this._trigger( "change" );
    }
  };
}

$.widget( "ui.spinner", {
  version: "1.10.4",
  defaultElement: "<input>",
  widgetEventPrefix: "spin",
  options: {
    culture: null,
    icons: {
      down: "ui-icon-triangle-1-s",
      up: "ui-icon-triangle-1-n"
    },
    incremental: true,
    max: null,
    min: null,
    numberFormat: null,
    page: 10,
    step: 1,

    change: null,
    spin: null,
    start: null,
    stop: null
  },

  _create: function() {
    // handle string values that need to be parsed
    this._setOption( "max", this.options.max );
    this._setOption( "min", this.options.min );
    this._setOption( "step", this.options.step );

    // Only format if there is a value, prevents the field from being marked
    // as invalid in Firefox, see #9573.
    if ( this.value() !== "" ) {
      // Format the value, but don't constrain.
      this._value( this.element.val(), true );
    }

    this._draw();
    this._on( this._events );
    this._refresh();

    // turning off autocomplete prevents the browser from remembering the
    // value when navigating through history, so we re-enable autocomplete
    // if the page is unloaded before the widget is destroyed. #7790
    this._on( this.window, {
      beforeunload: function() {
        this.element.removeAttr( "autocomplete" );
      }
    });
  },

  _getCreateOptions: function() {
    var options = {},
      element = this.element;

    $.each( [ "min", "max", "step" ], function( i, option ) {
      var value = element.attr( option );
      if ( value !== undefined && value.length ) {
        options[ option ] = value;
      }
    });

    return options;
  },

  _events: {
    keydown: function( event ) {
      if ( this._start( event ) && this._keydown( event ) ) {
        event.preventDefault();
      }
    },
    keyup: "_stop",
    focus: function() {
      this.previous = this.element.val();
    },
    blur: function( event ) {
      if ( this.cancelBlur ) {
        delete this.cancelBlur;
        return;
      }

      this._stop();
      this._refresh();
      if ( this.previous !== this.element.val() ) {
        this._trigger( "change", event );
      }
    },
    mousewheel: function( event, delta ) {
      if ( !delta ) {
        return;
      }
      if ( !this.spinning && !this._start( event ) ) {
        return false;
      }

      this._spin( (delta > 0 ? 1 : -1) * this.options.step, event );
      clearTimeout( this.mousewheelTimer );
      this.mousewheelTimer = this._delay(function() {
        if ( this.spinning ) {
          this._stop( event );
        }
      }, 100 );
      event.preventDefault();
    },
    "mousedown .ui-spinner-button": function( event ) {
      var previous;

      // We never want the buttons to have focus; whenever the user is
      // interacting with the spinner, the focus should be on the input.
      // If the input is focused then this.previous is properly set from
      // when the input first received focus. If the input is not focused
      // then we need to set this.previous based on the value before spinning.
      previous = this.element[0] === this.document[0].activeElement ?
        this.previous : this.element.val();
      function checkFocus() {
        var isActive = this.element[0] === this.document[0].activeElement;
        if ( !isActive ) {
          this.element.focus();
          this.previous = previous;
          // support: IE
          // IE sets focus asynchronously, so we need to check if focus
          // moved off of the input because the user clicked on the button.
          this._delay(function() {
            this.previous = previous;
          });
        }
      }

      // ensure focus is on (or stays on) the text field
      event.preventDefault();
      checkFocus.call( this );

      // support: IE
      // IE doesn't prevent moving focus even with event.preventDefault()
      // so we set a flag to know when we should ignore the blur event
      // and check (again) if focus moved off of the input.
      this.cancelBlur = true;
      this._delay(function() {
        delete this.cancelBlur;
        checkFocus.call( this );
      });

      if ( this._start( event ) === false ) {
        return;
      }

      this._repeat( null, $( event.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, event );
    },
    "mouseup .ui-spinner-button": "_stop",
    "mouseenter .ui-spinner-button": function( event ) {
      // button will add ui-state-active if mouse was down while mouseleave and kept down
      if ( !$( event.currentTarget ).hasClass( "ui-state-active" ) ) {
        return;
      }

      if ( this._start( event ) === false ) {
        return false;
      }
      this._repeat( null, $( event.currentTarget ).hasClass( "ui-spinner-up" ) ? 1 : -1, event );
    },
    // TODO: do we really want to consider this a stop?
    // shouldn't we just stop the repeater and wait until mouseup before
    // we trigger the stop event?
    "mouseleave .ui-spinner-button": "_stop"
  },

  _draw: function() {
    var uiSpinner = this.uiSpinner = this.element
      .addClass( "ui-spinner-input" )
      .attr( "autocomplete", "off" )
      .wrap( this._uiSpinnerHtml() )
      .parent()
        // add buttons
        .append( this._buttonHtml() );

    this.element.attr( "role", "spinbutton" );

    // button bindings
    this.buttons = uiSpinner.find( ".ui-spinner-button" )
      .attr( "tabIndex", -1 )
      .button()
      .removeClass( "ui-corner-all" );

    // IE 6 doesn't understand height: 50% for the buttons
    // unless the wrapper has an explicit height
    if ( this.buttons.height() > Math.ceil( uiSpinner.height() * 0.5 ) &&
        uiSpinner.height() > 0 ) {
      uiSpinner.height( uiSpinner.height() );
    }

    // disable spinner if element was already disabled
    if ( this.options.disabled ) {
      this.disable();
    }
  },

  _keydown: function( event ) {
    var options = this.options,
      keyCode = $.ui.keyCode;

    switch ( event.keyCode ) {
    case keyCode.UP:
      this._repeat( null, 1, event );
      return true;
    case keyCode.DOWN:
      this._repeat( null, -1, event );
      return true;
    case keyCode.PAGE_UP:
      this._repeat( null, options.page, event );
      return true;
    case keyCode.PAGE_DOWN:
      this._repeat( null, -options.page, event );
      return true;
    }

    return false;
  },

  _uiSpinnerHtml: function() {
    return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'></span>";
  },

  _buttonHtml: function() {
    return "" +
      "<a class='ui-spinner-button ui-spinner-up ui-corner-tr'>" +
        "<span class='ui-icon " + this.options.icons.up + "'>&#9650;</span>" +
      "</a>" +
      "<a class='ui-spinner-button ui-spinner-down ui-corner-br'>" +
        "<span class='ui-icon " + this.options.icons.down + "'>&#9660;</span>" +
      "</a>";
  },

  _start: function( event ) {
    if ( !this.spinning && this._trigger( "start", event ) === false ) {
      return false;
    }

    if ( !this.counter ) {
      this.counter = 1;
    }
    this.spinning = true;
    return true;
  },

  _repeat: function( i, steps, event ) {
    i = i || 500;

    clearTimeout( this.timer );
    this.timer = this._delay(function() {
      this._repeat( 40, steps, event );
    }, i );

    this._spin( steps * this.options.step, event );
  },

  _spin: function( step, event ) {
    var value = this.value() || 0;

    if ( !this.counter ) {
      this.counter = 1;
    }

    value = this._adjustValue( value + step * this._increment( this.counter ) );

    if ( !this.spinning || this._trigger( "spin", event, { value: value } ) !== false) {
      this._value( value );
      this.counter++;
    }
  },

  _increment: function( i ) {
    var incremental = this.options.incremental;

    if ( incremental ) {
      return $.isFunction( incremental ) ?
        incremental( i ) :
        Math.floor( i*i*i/50000 - i*i/500 + 17*i/200 + 1 );
    }

    return 1;
  },

  _precision: function() {
    var precision = this._precisionOf( this.options.step );
    if ( this.options.min !== null ) {
      precision = Math.max( precision, this._precisionOf( this.options.min ) );
    }
    return precision;
  },

  _precisionOf: function( num ) {
    var str = num.toString(),
      decimal = str.indexOf( "." );
    return decimal === -1 ? 0 : str.length - decimal - 1;
  },

  _adjustValue: function( value ) {
    var base, aboveMin,
      options = this.options;

    // make sure we're at a valid step
    // - find out where we are relative to the base (min or 0)
    base = options.min !== null ? options.min : 0;
    aboveMin = value - base;
    // - round to the nearest step
    aboveMin = Math.round(aboveMin / options.step) * options.step;
    // - rounding is based on 0, so adjust back to our base
    value = base + aboveMin;

    // fix precision from bad JS floating point math
    value = parseFloat( value.toFixed( this._precision() ) );

    // clamp the value
    if ( options.max !== null && value > options.max) {
      return options.max;
    }
    if ( options.min !== null && value < options.min ) {
      return options.min;
    }

    return value;
  },

  _stop: function( event ) {
    if ( !this.spinning ) {
      return;
    }

    clearTimeout( this.timer );
    clearTimeout( this.mousewheelTimer );
    this.counter = 0;
    this.spinning = false;
    this._trigger( "stop", event );
  },

  _setOption: function( key, value ) {
    if ( key === "culture" || key === "numberFormat" ) {
      var prevValue = this._parse( this.element.val() );
      this.options[ key ] = value;
      this.element.val( this._format( prevValue ) );
      return;
    }

    if ( key === "max" || key === "min" || key === "step" ) {
      if ( typeof value === "string" ) {
        value = this._parse( value );
      }
    }
    if ( key === "icons" ) {
      this.buttons.first().find( ".ui-icon" )
        .removeClass( this.options.icons.up )
        .addClass( value.up );
      this.buttons.last().find( ".ui-icon" )
        .removeClass( this.options.icons.down )
        .addClass( value.down );
    }

    this._super( key, value );

    if ( key === "disabled" ) {
      if ( value ) {
        this.element.prop( "disabled", true );
        this.buttons.button( "disable" );
      } else {
        this.element.prop( "disabled", false );
        this.buttons.button( "enable" );
      }
    }
  },

  _setOptions: modifier(function( options ) {
    this._super( options );
    this._value( this.element.val() );
  }),

  _parse: function( val ) {
    if ( typeof val === "string" && val !== "" ) {
      val = window.Globalize && this.options.numberFormat ?
        Globalize.parseFloat( val, 10, this.options.culture ) : +val;
    }
    return val === "" || isNaN( val ) ? null : val;
  },

  _format: function( value ) {
    if ( value === "" ) {
      return "";
    }
    return window.Globalize && this.options.numberFormat ?
      Globalize.format( value, this.options.numberFormat, this.options.culture ) :
      value;
  },

  _refresh: function() {
    this.element.attr({
      "aria-valuemin": this.options.min,
      "aria-valuemax": this.options.max,
      // TODO: what should we do with values that can't be parsed?
      "aria-valuenow": this._parse( this.element.val() )
    });
  },

  // update the value without triggering change
  _value: function( value, allowAny ) {
    var parsed;
    if ( value !== "" ) {
      parsed = this._parse( value );
      if ( parsed !== null ) {
        if ( !allowAny ) {
          parsed = this._adjustValue( parsed );
        }
        value = this._format( parsed );
      }
    }
    this.element.val( value );
    this._refresh();
  },

  _destroy: function() {
    this.element
      .removeClass( "ui-spinner-input" )
      .prop( "disabled", false )
      .removeAttr( "autocomplete" )
      .removeAttr( "role" )
      .removeAttr( "aria-valuemin" )
      .removeAttr( "aria-valuemax" )
      .removeAttr( "aria-valuenow" );
    this.uiSpinner.replaceWith( this.element );
  },

  stepUp: modifier(function( steps ) {
    this._stepUp( steps );
  }),
  _stepUp: function( steps ) {
    if ( this._start() ) {
      this._spin( (steps || 1) * this.options.step );
      this._stop();
    }
  },

  stepDown: modifier(function( steps ) {
    this._stepDown( steps );
  }),
  _stepDown: function( steps ) {
    if ( this._start() ) {
      this._spin( (steps || 1) * -this.options.step );
      this._stop();
    }
  },

  pageUp: modifier(function( pages ) {
    this._stepUp( (pages || 1) * this.options.page );
  }),

  pageDown: modifier(function( pages ) {
    this._stepDown( (pages || 1) * this.options.page );
  }),

  value: function( newVal ) {
    if ( !arguments.length ) {
      return this._parse( this.element.val() );
    }
    modifier( this._value ).call( this, newVal );
  },

  widget: function() {
    return this.uiSpinner;
  }
});

}( jQuery ) );

/*!
 * jQuery UI Effects 1.10.4
 * http://jqueryui.com
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/effects-core/
 */
(function($, undefined) {

var dataSpace = "ui-effects-";

$.effects = {
  effect: {}
};

/*!
 * jQuery Color Animations v2.1.2
 * https://github.com/jquery/jquery-color
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Wed Jan 16 08:47:09 2013 -0600
 */
(function( jQuery, undefined ) {

  var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",

  // plusequals test for += 100 -= 100
  rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
  // a set of RE's that can match strings and generate color tuples.
  stringParsers = [{
      re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      parse: function( execResult ) {
        return [
          execResult[ 1 ],
          execResult[ 2 ],
          execResult[ 3 ],
          execResult[ 4 ]
        ];
      }
    }, {
      re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      parse: function( execResult ) {
        return [
          execResult[ 1 ] * 2.55,
          execResult[ 2 ] * 2.55,
          execResult[ 3 ] * 2.55,
          execResult[ 4 ]
        ];
      }
    }, {
      // this regex ignores A-F because it's compared against an already lowercased string
      re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
      parse: function( execResult ) {
        return [
          parseInt( execResult[ 1 ], 16 ),
          parseInt( execResult[ 2 ], 16 ),
          parseInt( execResult[ 3 ], 16 )
        ];
      }
    }, {
      // this regex ignores A-F because it's compared against an already lowercased string
      re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
      parse: function( execResult ) {
        return [
          parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
          parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
          parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
        ];
      }
    }, {
      re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      space: "hsla",
      parse: function( execResult ) {
        return [
          execResult[ 1 ],
          execResult[ 2 ] / 100,
          execResult[ 3 ] / 100,
          execResult[ 4 ]
        ];
      }
    }],

  // jQuery.Color( )
  color = jQuery.Color = function( color, green, blue, alpha ) {
    return new jQuery.Color.fn.parse( color, green, blue, alpha );
  },
  spaces = {
    rgba: {
      props: {
        red: {
          idx: 0,
          type: "byte"
        },
        green: {
          idx: 1,
          type: "byte"
        },
        blue: {
          idx: 2,
          type: "byte"
        }
      }
    },

    hsla: {
      props: {
        hue: {
          idx: 0,
          type: "degrees"
        },
        saturation: {
          idx: 1,
          type: "percent"
        },
        lightness: {
          idx: 2,
          type: "percent"
        }
      }
    }
  },
  propTypes = {
    "byte": {
      floor: true,
      max: 255
    },
    "percent": {
      max: 1
    },
    "degrees": {
      mod: 360,
      floor: true
    }
  },
  support = color.support = {},

  // element for support tests
  supportElem = jQuery( "<p>" )[ 0 ],

  // colors = jQuery.Color.names
  colors,

  // local aliases of functions called often
  each = jQuery.each;

// determine rgba support immediately
supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
support.rgba = supportElem.style.backgroundColor.indexOf( "rgba" ) > -1;

// define cache name and alpha properties
// for rgba and hsla spaces
each( spaces, function( spaceName, space ) {
  space.cache = "_" + spaceName;
  space.props.alpha = {
    idx: 3,
    type: "percent",
    def: 1
  };
});

function clamp( value, prop, allowEmpty ) {
  var type = propTypes[ prop.type ] || {};

  if ( value == null ) {
    return (allowEmpty || !prop.def) ? null : prop.def;
  }

  // ~~ is an short way of doing floor for positive numbers
  value = type.floor ? ~~value : parseFloat( value );

  // IE will pass in empty strings as value for alpha,
  // which will hit this case
  if ( isNaN( value ) ) {
    return prop.def;
  }

  if ( type.mod ) {
    // we add mod before modding to make sure that negatives values
    // get converted properly: -10 -> 350
    return (value + type.mod) % type.mod;
  }

  // for now all property types without mod have min and max
  return 0 > value ? 0 : type.max < value ? type.max : value;
}

function stringParse( string ) {
  var inst = color(),
    rgba = inst._rgba = [];

  string = string.toLowerCase();

  each( stringParsers, function( i, parser ) {
    var parsed,
      match = parser.re.exec( string ),
      values = match && parser.parse( match ),
      spaceName = parser.space || "rgba";

    if ( values ) {
      parsed = inst[ spaceName ]( values );

      // if this was an rgba parse the assignment might happen twice
      // oh well....
      inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
      rgba = inst._rgba = parsed._rgba;

      // exit each( stringParsers ) here because we matched
      return false;
    }
  });

  // Found a stringParser that handled it
  if ( rgba.length ) {

    // if this came from a parsed string, force "transparent" when alpha is 0
    // chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
    if ( rgba.join() === "0,0,0,0" ) {
      jQuery.extend( rgba, colors.transparent );
    }
    return inst;
  }

  // named colors
  return colors[ string ];
}

color.fn = jQuery.extend( color.prototype, {
  parse: function( red, green, blue, alpha ) {
    if ( red === undefined ) {
      this._rgba = [ null, null, null, null ];
      return this;
    }
    if ( red.jquery || red.nodeType ) {
      red = jQuery( red ).css( green );
      green = undefined;
    }

    var inst = this,
      type = jQuery.type( red ),
      rgba = this._rgba = [];

    // more than 1 argument specified - assume ( red, green, blue, alpha )
    if ( green !== undefined ) {
      red = [ red, green, blue, alpha ];
      type = "array";
    }

    if ( type === "string" ) {
      return this.parse( stringParse( red ) || colors._default );
    }

    if ( type === "array" ) {
      each( spaces.rgba.props, function( key, prop ) {
        rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
      });
      return this;
    }

    if ( type === "object" ) {
      if ( red instanceof color ) {
        each( spaces, function( spaceName, space ) {
          if ( red[ space.cache ] ) {
            inst[ space.cache ] = red[ space.cache ].slice();
          }
        });
      } else {
        each( spaces, function( spaceName, space ) {
          var cache = space.cache;
          each( space.props, function( key, prop ) {

            // if the cache doesn't exist, and we know how to convert
            if ( !inst[ cache ] && space.to ) {

              // if the value was null, we don't need to copy it
              // if the key was alpha, we don't need to copy it either
              if ( key === "alpha" || red[ key ] == null ) {
                return;
              }
              inst[ cache ] = space.to( inst._rgba );
            }

            // this is the only case where we allow nulls for ALL properties.
            // call clamp with alwaysAllowEmpty
            inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
          });

          // everything defined but alpha?
          if ( inst[ cache ] && jQuery.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {
            // use the default of 1
            inst[ cache ][ 3 ] = 1;
            if ( space.from ) {
              inst._rgba = space.from( inst[ cache ] );
            }
          }
        });
      }
      return this;
    }
  },
  is: function( compare ) {
    var is = color( compare ),
      same = true,
      inst = this;

    each( spaces, function( _, space ) {
      var localCache,
        isCache = is[ space.cache ];
      if (isCache) {
        localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
        each( space.props, function( _, prop ) {
          if ( isCache[ prop.idx ] != null ) {
            same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
            return same;
          }
        });
      }
      return same;
    });
    return same;
  },
  _space: function() {
    var used = [],
      inst = this;
    each( spaces, function( spaceName, space ) {
      if ( inst[ space.cache ] ) {
        used.push( spaceName );
      }
    });
    return used.pop();
  },
  transition: function( other, distance ) {
    var end = color( other ),
      spaceName = end._space(),
      space = spaces[ spaceName ],
      startColor = this.alpha() === 0 ? color( "transparent" ) : this,
      start = startColor[ space.cache ] || space.to( startColor._rgba ),
      result = start.slice();

    end = end[ space.cache ];
    each( space.props, function( key, prop ) {
      var index = prop.idx,
        startValue = start[ index ],
        endValue = end[ index ],
        type = propTypes[ prop.type ] || {};

      // if null, don't override start value
      if ( endValue === null ) {
        return;
      }
      // if null - use end
      if ( startValue === null ) {
        result[ index ] = endValue;
      } else {
        if ( type.mod ) {
          if ( endValue - startValue > type.mod / 2 ) {
            startValue += type.mod;
          } else if ( startValue - endValue > type.mod / 2 ) {
            startValue -= type.mod;
          }
        }
        result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
      }
    });
    return this[ spaceName ]( result );
  },
  blend: function( opaque ) {
    // if we are already opaque - return ourself
    if ( this._rgba[ 3 ] === 1 ) {
      return this;
    }

    var rgb = this._rgba.slice(),
      a = rgb.pop(),
      blend = color( opaque )._rgba;

    return color( jQuery.map( rgb, function( v, i ) {
      return ( 1 - a ) * blend[ i ] + a * v;
    }));
  },
  toRgbaString: function() {
    var prefix = "rgba(",
      rgba = jQuery.map( this._rgba, function( v, i ) {
        return v == null ? ( i > 2 ? 1 : 0 ) : v;
      });

    if ( rgba[ 3 ] === 1 ) {
      rgba.pop();
      prefix = "rgb(";
    }

    return prefix + rgba.join() + ")";
  },
  toHslaString: function() {
    var prefix = "hsla(",
      hsla = jQuery.map( this.hsla(), function( v, i ) {
        if ( v == null ) {
          v = i > 2 ? 1 : 0;
        }

        // catch 1 and 2
        if ( i && i < 3 ) {
          v = Math.round( v * 100 ) + "%";
        }
        return v;
      });

    if ( hsla[ 3 ] === 1 ) {
      hsla.pop();
      prefix = "hsl(";
    }
    return prefix + hsla.join() + ")";
  },
  toHexString: function( includeAlpha ) {
    var rgba = this._rgba.slice(),
      alpha = rgba.pop();

    if ( includeAlpha ) {
      rgba.push( ~~( alpha * 255 ) );
    }

    return "#" + jQuery.map( rgba, function( v ) {

      // default to 0 when nulls exist
      v = ( v || 0 ).toString( 16 );
      return v.length === 1 ? "0" + v : v;
    }).join("");
  },
  toString: function() {
    return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
  }
});
color.fn.parse.prototype = color.fn;

// hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

function hue2rgb( p, q, h ) {
  h = ( h + 1 ) % 1;
  if ( h * 6 < 1 ) {
    return p + (q - p) * h * 6;
  }
  if ( h * 2 < 1) {
    return q;
  }
  if ( h * 3 < 2 ) {
    return p + (q - p) * ((2/3) - h) * 6;
  }
  return p;
}

spaces.hsla.to = function ( rgba ) {
  if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
    return [ null, null, null, rgba[ 3 ] ];
  }
  var r = rgba[ 0 ] / 255,
    g = rgba[ 1 ] / 255,
    b = rgba[ 2 ] / 255,
    a = rgba[ 3 ],
    max = Math.max( r, g, b ),
    min = Math.min( r, g, b ),
    diff = max - min,
    add = max + min,
    l = add * 0.5,
    h, s;

  if ( min === max ) {
    h = 0;
  } else if ( r === max ) {
    h = ( 60 * ( g - b ) / diff ) + 360;
  } else if ( g === max ) {
    h = ( 60 * ( b - r ) / diff ) + 120;
  } else {
    h = ( 60 * ( r - g ) / diff ) + 240;
  }

  // chroma (diff) == 0 means greyscale which, by definition, saturation = 0%
  // otherwise, saturation is based on the ratio of chroma (diff) to lightness (add)
  if ( diff === 0 ) {
    s = 0;
  } else if ( l <= 0.5 ) {
    s = diff / add;
  } else {
    s = diff / ( 2 - add );
  }
  return [ Math.round(h) % 360, s, l, a == null ? 1 : a ];
};

spaces.hsla.from = function ( hsla ) {
  if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
    return [ null, null, null, hsla[ 3 ] ];
  }
  var h = hsla[ 0 ] / 360,
    s = hsla[ 1 ],
    l = hsla[ 2 ],
    a = hsla[ 3 ],
    q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
    p = 2 * l - q;

  return [
    Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
    Math.round( hue2rgb( p, q, h ) * 255 ),
    Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
    a
  ];
};


each( spaces, function( spaceName, space ) {
  var props = space.props,
    cache = space.cache,
    to = space.to,
    from = space.from;

  // makes rgba() and hsla()
  color.fn[ spaceName ] = function( value ) {

    // generate a cache for this space if it doesn't exist
    if ( to && !this[ cache ] ) {
      this[ cache ] = to( this._rgba );
    }
    if ( value === undefined ) {
      return this[ cache ].slice();
    }

    var ret,
      type = jQuery.type( value ),
      arr = ( type === "array" || type === "object" ) ? value : arguments,
      local = this[ cache ].slice();

    each( props, function( key, prop ) {
      var val = arr[ type === "object" ? key : prop.idx ];
      if ( val == null ) {
        val = local[ prop.idx ];
      }
      local[ prop.idx ] = clamp( val, prop );
    });

    if ( from ) {
      ret = color( from( local ) );
      ret[ cache ] = local;
      return ret;
    } else {
      return color( local );
    }
  };

  // makes red() green() blue() alpha() hue() saturation() lightness()
  each( props, function( key, prop ) {
    // alpha is included in more than one space
    if ( color.fn[ key ] ) {
      return;
    }
    color.fn[ key ] = function( value ) {
      var vtype = jQuery.type( value ),
        fn = ( key === "alpha" ? ( this._hsla ? "hsla" : "rgba" ) : spaceName ),
        local = this[ fn ](),
        cur = local[ prop.idx ],
        match;

      if ( vtype === "undefined" ) {
        return cur;
      }

      if ( vtype === "function" ) {
        value = value.call( this, cur );
        vtype = jQuery.type( value );
      }
      if ( value == null && prop.empty ) {
        return this;
      }
      if ( vtype === "string" ) {
        match = rplusequals.exec( value );
        if ( match ) {
          value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
        }
      }
      local[ prop.idx ] = value;
      return this[ fn ]( local );
    };
  });
});

// add cssHook and .fx.step function for each named hook.
// accept a space separated string of properties
color.hook = function( hook ) {
  var hooks = hook.split( " " );
  each( hooks, function( i, hook ) {
    jQuery.cssHooks[ hook ] = {
      set: function( elem, value ) {
        var parsed, curElem,
          backgroundColor = "";

        if ( value !== "transparent" && ( jQuery.type( value ) !== "string" || ( parsed = stringParse( value ) ) ) ) {
          value = color( parsed || value );
          if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
            curElem = hook === "backgroundColor" ? elem.parentNode : elem;
            while (
              (backgroundColor === "" || backgroundColor === "transparent") &&
              curElem && curElem.style
            ) {
              try {
                backgroundColor = jQuery.css( curElem, "backgroundColor" );
                curElem = curElem.parentNode;
              } catch ( e ) {
              }
            }

            value = value.blend( backgroundColor && backgroundColor !== "transparent" ?
              backgroundColor :
              "_default" );
          }

          value = value.toRgbaString();
        }
        try {
          elem.style[ hook ] = value;
        } catch( e ) {
          // wrapped to prevent IE from throwing errors on "invalid" values like 'auto' or 'inherit'
        }
      }
    };
    jQuery.fx.step[ hook ] = function( fx ) {
      if ( !fx.colorInit ) {
        fx.start = color( fx.elem, hook );
        fx.end = color( fx.end );
        fx.colorInit = true;
      }
      jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
    };
  });

};

color.hook( stepHooks );

jQuery.cssHooks.borderColor = {
  expand: function( value ) {
    var expanded = {};

    each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
      expanded[ "border" + part + "Color" ] = value;
    });
    return expanded;
  }
};

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {
  // 4.1. Basic color keywords
  aqua: "#00ffff",
  black: "#000000",
  blue: "#0000ff",
  fuchsia: "#ff00ff",
  gray: "#808080",
  green: "#008000",
  lime: "#00ff00",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  purple: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  teal: "#008080",
  white: "#ffffff",
  yellow: "#ffff00",

  // 4.2.3. "transparent" color keyword
  transparent: [ null, null, null, 0 ],

  _default: "#ffffff"
};

})( jQuery );


/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/
(function() {

var classAnimationActions = [ "add", "remove", "toggle" ],
  shorthandStyles = {
    border: 1,
    borderBottom: 1,
    borderColor: 1,
    borderLeft: 1,
    borderRight: 1,
    borderTop: 1,
    borderWidth: 1,
    margin: 1,
    padding: 1
  };

$.each([ "borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle" ], function( _, prop ) {
  $.fx.step[ prop ] = function( fx ) {
    if ( fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr ) {
      jQuery.style( fx.elem, prop, fx.end );
      fx.setAttr = true;
    }
  };
});

function getElementStyles( elem ) {
  var key, len,
    style = elem.ownerDocument.defaultView ?
      elem.ownerDocument.defaultView.getComputedStyle( elem, null ) :
      elem.currentStyle,
    styles = {};

  if ( style && style.length && style[ 0 ] && style[ style[ 0 ] ] ) {
    len = style.length;
    while ( len-- ) {
      key = style[ len ];
      if ( typeof style[ key ] === "string" ) {
        styles[ $.camelCase( key ) ] = style[ key ];
      }
    }
  // support: Opera, IE <9
  } else {
    for ( key in style ) {
      if ( typeof style[ key ] === "string" ) {
        styles[ key ] = style[ key ];
      }
    }
  }

  return styles;
}


function styleDifference( oldStyle, newStyle ) {
  var diff = {},
    name, value;

  for ( name in newStyle ) {
    value = newStyle[ name ];
    if ( oldStyle[ name ] !== value ) {
      if ( !shorthandStyles[ name ] ) {
        if ( $.fx.step[ name ] || !isNaN( parseFloat( value ) ) ) {
          diff[ name ] = value;
        }
      }
    }
  }

  return diff;
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
  $.fn.addBack = function( selector ) {
    return this.add( selector == null ?
      this.prevObject : this.prevObject.filter( selector )
    );
  };
}

$.effects.animateClass = function( value, duration, easing, callback ) {
  var o = $.speed( duration, easing, callback );

  return this.queue( function() {
    var animated = $( this ),
      baseClass = animated.attr( "class" ) || "",
      applyClassChange,
      allAnimations = o.children ? animated.find( "*" ).addBack() : animated;

    // map the animated objects to store the original styles.
    allAnimations = allAnimations.map(function() {
      var el = $( this );
      return {
        el: el,
        start: getElementStyles( this )
      };
    });

    // apply class change
    applyClassChange = function() {
      $.each( classAnimationActions, function(i, action) {
        if ( value[ action ] ) {
          animated[ action + "Class" ]( value[ action ] );
        }
      });
    };
    applyClassChange();

    // map all animated objects again - calculate new styles and diff
    allAnimations = allAnimations.map(function() {
      this.end = getElementStyles( this.el[ 0 ] );
      this.diff = styleDifference( this.start, this.end );
      return this;
    });

    // apply original class
    animated.attr( "class", baseClass );

    // map all animated objects again - this time collecting a promise
    allAnimations = allAnimations.map(function() {
      var styleInfo = this,
        dfd = $.Deferred(),
        opts = $.extend({}, o, {
          queue: false,
          complete: function() {
            dfd.resolve( styleInfo );
          }
        });

      this.el.animate( this.diff, opts );
      return dfd.promise();
    });

    // once all animations have completed:
    $.when.apply( $, allAnimations.get() ).done(function() {

      // set the final class
      applyClassChange();

      // for each animated element,
      // clear all css properties that were animated
      $.each( arguments, function() {
        var el = this.el;
        $.each( this.diff, function(key) {
          el.css( key, "" );
        });
      });

      // this is guarnteed to be there if you use jQuery.speed()
      // it also handles dequeuing the next anim...
      o.complete.call( animated[ 0 ] );
    });
  });
};

$.fn.extend({
  addClass: (function( orig ) {
    return function( classNames, speed, easing, callback ) {
      return speed ?
        $.effects.animateClass.call( this,
          { add: classNames }, speed, easing, callback ) :
        orig.apply( this, arguments );
    };
  })( $.fn.addClass ),

  removeClass: (function( orig ) {
    return function( classNames, speed, easing, callback ) {
      return arguments.length > 1 ?
        $.effects.animateClass.call( this,
          { remove: classNames }, speed, easing, callback ) :
        orig.apply( this, arguments );
    };
  })( $.fn.removeClass ),

  toggleClass: (function( orig ) {
    return function( classNames, force, speed, easing, callback ) {
      if ( typeof force === "boolean" || force === undefined ) {
        if ( !speed ) {
          // without speed parameter
          return orig.apply( this, arguments );
        } else {
          return $.effects.animateClass.call( this,
            (force ? { add: classNames } : { remove: classNames }),
            speed, easing, callback );
        }
      } else {
        // without force parameter
        return $.effects.animateClass.call( this,
          { toggle: classNames }, force, speed, easing );
      }
    };
  })( $.fn.toggleClass ),

  switchClass: function( remove, add, speed, easing, callback) {
    return $.effects.animateClass.call( this, {
      add: add,
      remove: remove
    }, speed, easing, callback );
  }
});

})();

/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

(function() {

$.extend( $.effects, {
  version: "1.10.4",

  // Saves a set of properties in a data storage
  save: function( element, set ) {
    for( var i=0; i < set.length; i++ ) {
      if ( set[ i ] !== null ) {
        element.data( dataSpace + set[ i ], element[ 0 ].style[ set[ i ] ] );
      }
    }
  },

  // Restores a set of previously saved properties from a data storage
  restore: function( element, set ) {
    var val, i;
    for( i=0; i < set.length; i++ ) {
      if ( set[ i ] !== null ) {
        val = element.data( dataSpace + set[ i ] );
        // support: jQuery 1.6.2
        // http://bugs.jquery.com/ticket/9917
        // jQuery 1.6.2 incorrectly returns undefined for any falsy value.
        // We can't differentiate between "" and 0 here, so we just assume
        // empty string since it's likely to be a more common value...
        if ( val === undefined ) {
          val = "";
        }
        element.css( set[ i ], val );
      }
    }
  },

  setMode: function( el, mode ) {
    if (mode === "toggle") {
      mode = el.is( ":hidden" ) ? "show" : "hide";
    }
    return mode;
  },

  // Translates a [top,left] array into a baseline value
  // this should be a little more flexible in the future to handle a string & hash
  getBaseline: function( origin, original ) {
    var y, x;
    switch ( origin[ 0 ] ) {
      case "top": y = 0; break;
      case "middle": y = 0.5; break;
      case "bottom": y = 1; break;
      default: y = origin[ 0 ] / original.height;
    }
    switch ( origin[ 1 ] ) {
      case "left": x = 0; break;
      case "center": x = 0.5; break;
      case "right": x = 1; break;
      default: x = origin[ 1 ] / original.width;
    }
    return {
      x: x,
      y: y
    };
  },

  // Wraps the element around a wrapper that copies position properties
  createWrapper: function( element ) {

    // if the element is already wrapped, return it
    if ( element.parent().is( ".ui-effects-wrapper" )) {
      return element.parent();
    }

    // wrap the element
    var props = {
        width: element.outerWidth(true),
        height: element.outerHeight(true),
        "float": element.css( "float" )
      },
      wrapper = $( "<div></div>" )
        .addClass( "ui-effects-wrapper" )
        .css({
          fontSize: "100%",
          background: "transparent",
          border: "none",
          margin: 0,
          padding: 0
        }),
      // Store the size in case width/height are defined in % - Fixes #5245
      size = {
        width: element.width(),
        height: element.height()
      },
      active = document.activeElement;

    // support: Firefox
    // Firefox incorrectly exposes anonymous content
    // https://bugzilla.mozilla.org/show_bug.cgi?id=561664
    try {
      active.id;
    } catch( e ) {
      active = document.body;
    }

    element.wrap( wrapper );

    // Fixes #7595 - Elements lose focus when wrapped.
    if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
      $( active ).focus();
    }

    wrapper = element.parent(); //Hotfix for jQuery 1.4 since some change in wrap() seems to actually lose the reference to the wrapped element

    // transfer positioning properties to the wrapper
    if ( element.css( "position" ) === "static" ) {
      wrapper.css({ position: "relative" });
      element.css({ position: "relative" });
    } else {
      $.extend( props, {
        position: element.css( "position" ),
        zIndex: element.css( "z-index" )
      });
      $.each([ "top", "left", "bottom", "right" ], function(i, pos) {
        props[ pos ] = element.css( pos );
        if ( isNaN( parseInt( props[ pos ], 10 ) ) ) {
          props[ pos ] = "auto";
        }
      });
      element.css({
        position: "relative",
        top: 0,
        left: 0,
        right: "auto",
        bottom: "auto"
      });
    }
    element.css(size);

    return wrapper.css( props ).show();
  },

  removeWrapper: function( element ) {
    var active = document.activeElement;

    if ( element.parent().is( ".ui-effects-wrapper" ) ) {
      element.parent().replaceWith( element );

      // Fixes #7595 - Elements lose focus when wrapped.
      if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
        $( active ).focus();
      }
    }


    return element;
  },

  setTransition: function( element, list, factor, value ) {
    value = value || {};
    $.each( list, function( i, x ) {
      var unit = element.cssUnit( x );
      if ( unit[ 0 ] > 0 ) {
        value[ x ] = unit[ 0 ] * factor + unit[ 1 ];
      }
    });
    return value;
  }
});

// return an effect options object for the given parameters:
function _normalizeArguments( effect, options, speed, callback ) {

  // allow passing all options as the first parameter
  if ( $.isPlainObject( effect ) ) {
    options = effect;
    effect = effect.effect;
  }

  // convert to an object
  effect = { effect: effect };

  // catch (effect, null, ...)
  if ( options == null ) {
    options = {};
  }

  // catch (effect, callback)
  if ( $.isFunction( options ) ) {
    callback = options;
    speed = null;
    options = {};
  }

  // catch (effect, speed, ?)
  if ( typeof options === "number" || $.fx.speeds[ options ] ) {
    callback = speed;
    speed = options;
    options = {};
  }

  // catch (effect, options, callback)
  if ( $.isFunction( speed ) ) {
    callback = speed;
    speed = null;
  }

  // add options to effect
  if ( options ) {
    $.extend( effect, options );
  }

  speed = speed || options.duration;
  effect.duration = $.fx.off ? 0 :
    typeof speed === "number" ? speed :
    speed in $.fx.speeds ? $.fx.speeds[ speed ] :
    $.fx.speeds._default;

  effect.complete = callback || options.complete;

  return effect;
}

function standardAnimationOption( option ) {
  // Valid standard speeds (nothing, number, named speed)
  if ( !option || typeof option === "number" || $.fx.speeds[ option ] ) {
    return true;
  }

  // Invalid strings - treat as "normal" speed
  if ( typeof option === "string" && !$.effects.effect[ option ] ) {
    return true;
  }

  // Complete callback
  if ( $.isFunction( option ) ) {
    return true;
  }

  // Options hash (but not naming an effect)
  if ( typeof option === "object" && !option.effect ) {
    return true;
  }

  // Didn't match any standard API
  return false;
}

$.fn.extend({
  effect: function( /* effect, options, speed, callback */ ) {
    var args = _normalizeArguments.apply( this, arguments ),
      mode = args.mode,
      queue = args.queue,
      effectMethod = $.effects.effect[ args.effect ];

    if ( $.fx.off || !effectMethod ) {
      // delegate to the original method (e.g., .show()) if possible
      if ( mode ) {
        return this[ mode ]( args.duration, args.complete );
      } else {
        return this.each( function() {
          if ( args.complete ) {
            args.complete.call( this );
          }
        });
      }
    }

    function run( next ) {
      var elem = $( this ),
        complete = args.complete,
        mode = args.mode;

      function done() {
        if ( $.isFunction( complete ) ) {
          complete.call( elem[0] );
        }
        if ( $.isFunction( next ) ) {
          next();
        }
      }

      // If the element already has the correct final state, delegate to
      // the core methods so the internal tracking of "olddisplay" works.
      if ( elem.is( ":hidden" ) ? mode === "hide" : mode === "show" ) {
        elem[ mode ]();
        done();
      } else {
        effectMethod.call( elem[0], args, done );
      }
    }

    return queue === false ? this.each( run ) : this.queue( queue || "fx", run );
  },

  show: (function( orig ) {
    return function( option ) {
      if ( standardAnimationOption( option ) ) {
        return orig.apply( this, arguments );
      } else {
        var args = _normalizeArguments.apply( this, arguments );
        args.mode = "show";
        return this.effect.call( this, args );
      }
    };
  })( $.fn.show ),

  hide: (function( orig ) {
    return function( option ) {
      if ( standardAnimationOption( option ) ) {
        return orig.apply( this, arguments );
      } else {
        var args = _normalizeArguments.apply( this, arguments );
        args.mode = "hide";
        return this.effect.call( this, args );
      }
    };
  })( $.fn.hide ),

  toggle: (function( orig ) {
    return function( option ) {
      if ( standardAnimationOption( option ) || typeof option === "boolean" ) {
        return orig.apply( this, arguments );
      } else {
        var args = _normalizeArguments.apply( this, arguments );
        args.mode = "toggle";
        return this.effect.call( this, args );
      }
    };
  })( $.fn.toggle ),

  // helper functions
  cssUnit: function(key) {
    var style = this.css( key ),
      val = [];

    $.each( [ "em", "px", "%", "pt" ], function( i, unit ) {
      if ( style.indexOf( unit ) > 0 ) {
        val = [ parseFloat( style ), unit ];
      }
    });
    return val;
  }
});

})();

/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

(function() {

// based on easing equations from Robert Penner (http://www.robertpenner.com/easing)

var baseEasings = {};

$.each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( i, name ) {
  baseEasings[ name ] = function( p ) {
    return Math.pow( p, i + 2 );
  };
});

$.extend( baseEasings, {
  Sine: function ( p ) {
    return 1 - Math.cos( p * Math.PI / 2 );
  },
  Circ: function ( p ) {
    return 1 - Math.sqrt( 1 - p * p );
  },
  Elastic: function( p ) {
    return p === 0 || p === 1 ? p :
      -Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
  },
  Back: function( p ) {
    return p * p * ( 3 * p - 2 );
  },
  Bounce: function ( p ) {
    var pow2,
      bounce = 4;

    while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
    return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
  }
});

$.each( baseEasings, function( name, easeIn ) {
  $.easing[ "easeIn" + name ] = easeIn;
  $.easing[ "easeOut" + name ] = function( p ) {
    return 1 - easeIn( 1 - p );
  };
  $.easing[ "easeInOut" + name ] = function( p ) {
    return p < 0.5 ?
      easeIn( p * 2 ) / 2 :
      1 - easeIn( p * -2 + 2 ) / 2;
  };
});

})();

})(jQuery);

/*!
 * jQuery UI Touch Punch 0.2.2
 *
 * Copyright 2011, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

  // Detect touch support
  $.support.touch = 'ontouchend' in document;

  // Ignore browsers without touch support
  if (!$.support.touch) {
    return;
  }

  var mouseProto = $.ui.mouse.prototype,
      _mouseInit = mouseProto._mouseInit,
      touchHandled;

  /**
   * Simulate a mouse event based on a corresponding touch event
   * @param {Object} event A touch event
   * @param {String} simulatedType The corresponding mouse event
   */
  function simulateMouseEvent (event, simulatedType) {

    // Ignore multi-touch events
    if (event.originalEvent.touches.length > 1) {
      return;
    }

    event.preventDefault();

    var touch = event.originalEvent.changedTouches[0],
        simulatedEvent = document.createEvent('MouseEvents');

    // Initialize the simulated mouse event using the touch event's coordinates
    simulatedEvent.initMouseEvent(
      simulatedType,    // type
      true,             // bubbles
      true,             // cancelable
      window,           // view
      1,                // detail
      touch.screenX,    // screenX
      touch.screenY,    // screenY
      touch.clientX,    // clientX
      touch.clientY,    // clientY
      false,            // ctrlKey
      false,            // altKey
      false,            // shiftKey
      false,            // metaKey
      0,                // button
      null              // relatedTarget
    );

    // Dispatch the simulated event to the target element
    event.target.dispatchEvent(simulatedEvent);
  }

  /**
   * Handle the jQuery UI widget's touchstart events
   * @param {Object} event The widget element's touchstart event
   */
  mouseProto._touchStart = function (event) {

    var self = this;

    // Ignore the event if another widget is already being handled
    if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
      return;
    }

    // Set the flag to prevent other widgets from inheriting the touch event
    touchHandled = true;

    // Track movement to determine if interaction was a click
    self._touchMoved = false;

    // Simulate the mouseover event
    simulateMouseEvent(event, 'mouseover');

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');

    // Simulate the mousedown event
    simulateMouseEvent(event, 'mousedown');
  };

  /**
   * Handle the jQuery UI widget's touchmove events
   * @param {Object} event The document's touchmove event
   */
  mouseProto._touchMove = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Interaction was not a click
    this._touchMoved = true;

    // Simulate the mousemove event
    simulateMouseEvent(event, 'mousemove');
  };

  /**
   * Handle the jQuery UI widget's touchend events
   * @param {Object} event The document's touchend event
   */
  mouseProto._touchEnd = function (event) {

    // Ignore event if not handled
    if (!touchHandled) {
      return;
    }

    // Simulate the mouseup event
    simulateMouseEvent(event, 'mouseup');

    // Simulate the mouseout event
    simulateMouseEvent(event, 'mouseout');

    // If the touch interaction did not move, it should trigger a click
    if (!this._touchMoved) {

      // Simulate the click event
      simulateMouseEvent(event, 'click');
    }

    // Unset the flag to allow other widgets to inherit the touch event
    touchHandled = false;
  };

  /**
   * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
   * This method extends the widget with bound touch event handlers that
   * translate touch events to mouse events and pass them to the widget's
   * original mouse event handling methods.
   */
  mouseProto._mouseInit = function () {

    var self = this;

    // Delegate the touch handlers to the widget's element
    self.element
      .bind('touchstart', $.proxy(self, '_touchStart'))
      .bind('touchmove', $.proxy(self, '_touchMove'))
      .bind('touchend', $.proxy(self, '_touchEnd'));

    // Call the original $.ui.mouse init method
    _mouseInit.call(self);
  };

})(jQuery);
/*!
 * Bootstrap v3.3.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.1
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.1'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.1
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.1'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.1
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.1'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var delta = direction == 'prev' ? -1 : 1
    var activeIndex = this.getItemIndex(active)
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.1'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.1
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.1'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.1
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.1'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (that.options.backdrop) that.adjustBackdrop()
      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .prependTo(this.$element)
        .on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus.call(this.$element[0])
            : this.hide.call(this)
        }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    if (this.options.backdrop) this.adjustBackdrop()
    this.adjustDialog()
  }

  Modal.prototype.adjustBackdrop = function () {
    this.$backdrop
      .css('height', 0)
      .css('height', this.$element[0].scrollHeight)
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.1
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.1'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
    this.arrow()
      .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isHorizontal ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.tooltip')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.tooltip', (data = {}))
        if (!data[selector]) data[selector] = new Tooltip(this, options)
      } else {
        if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.1
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.1'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this    = $(this)
      var data     = $this.data('bs.popover')
      var options  = typeof option == 'object' && option
      var selector = options && options.selector

      if (!data && option == 'destroy') return
      if (selector) {
        if (!data) $this.data('bs.popover', (data = {}))
        if (!data[selector]) data[selector] = new Popover(this, options)
      } else {
        if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      }
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.1
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.1'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.1'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.1
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.1'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && colliderTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $('body').height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/* ========================================================================
 * bootstrap-switch - v3.0.2
 * http://www.bootstrap-switch.org
 * ========================================================================
 * Copyright 2012-2013 Mattia Larentis
 *
 * ========================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================================
 */

(function() {
  var __slice = [].slice;

  (function($, window) {
    "use strict";
    var BootstrapSwitch;
    BootstrapSwitch = (function() {
      function BootstrapSwitch(element, options) {
        if (options == null) {
          options = {};
        }
        this.$element = $(element);
        this.options = $.extend({}, $.fn.bootstrapSwitch.defaults, {
          state: this.$element.is(":checked"),
          size: this.$element.data("size"),
          animate: this.$element.data("animate"),
          disabled: this.$element.is(":disabled"),
          readonly: this.$element.is("[readonly]"),
          indeterminate: this.$element.data("indeterminate"),
          onColor: this.$element.data("on-color"),
          offColor: this.$element.data("off-color"),
          onText: this.$element.data("on-text"),
          offText: this.$element.data("off-text"),
          labelText: this.$element.data("label-text"),
          baseClass: this.$element.data("base-class"),
          wrapperClass: this.$element.data("wrapper-class"),
          radioAllOff: this.$element.data("radio-all-off")
        }, options);
        this.$wrapper = $("<div>", {
          "class": (function(_this) {
            return function() {
              var classes;
              classes = ["" + _this.options.baseClass].concat(_this._getClasses(_this.options.wrapperClass));
              classes.push(_this.options.state ? "" + _this.options.baseClass + "-on" : "" + _this.options.baseClass + "-off");
              if (_this.options.size != null) {
                classes.push("" + _this.options.baseClass + "-" + _this.options.size);
              }
              if (_this.options.animate) {
                classes.push("" + _this.options.baseClass + "-animate");
              }
              if (_this.options.disabled) {
                classes.push("" + _this.options.baseClass + "-disabled");
              }
              if (_this.options.readonly) {
                classes.push("" + _this.options.baseClass + "-readonly");
              }
              if (_this.options.indeterminate) {
                classes.push("" + _this.options.baseClass + "-indeterminate");
              }
              if (_this.$element.attr("id")) {
                classes.push("" + _this.options.baseClass + "-id-" + (_this.$element.attr("id")));
              }
              return classes.join(" ");
            };
          })(this)()
        });
        this.$container = $("<div>", {
          "class": "" + this.options.baseClass + "-container"
        });
        this.$on = $("<span>", {
          html: this.options.onText,
          "class": "" + this.options.baseClass + "-handle-on " + this.options.baseClass + "-" + this.options.onColor
        });
        this.$off = $("<span>", {
          html: this.options.offText,
          "class": "" + this.options.baseClass + "-handle-off " + this.options.baseClass + "-" + this.options.offColor
        });
        this.$label = $("<label>", {
          html: this.options.labelText,
          "class": "" + this.options.baseClass + "-label"
        });
        if (this.options.indeterminate) {
          this.$element.prop("indeterminate", true);
        }
        this.$element.on("init.bootstrapSwitch", (function(_this) {
          return function() {
            return _this.options.onInit.apply(element, arguments);
          };
        })(this));
        this.$element.on("switchChange.bootstrapSwitch", (function(_this) {
          return function() {
            return _this.options.onSwitchChange.apply(element, arguments);
          };
        })(this));
        this.$container = this.$element.wrap(this.$container).parent();
        this.$wrapper = this.$container.wrap(this.$wrapper).parent();
        this.$element.before(this.$on).before(this.$label).before(this.$off).trigger("init.bootstrapSwitch");
        this._elementHandlers();
        this._handleHandlers();
        this._labelHandlers();
        this._formHandler();
      }

      BootstrapSwitch.prototype._constructor = BootstrapSwitch;

      BootstrapSwitch.prototype.state = function(value, skip) {
        if (typeof value === "undefined") {
          return this.options.state;
        }
        if (this.options.disabled || this.options.readonly || this.options.indeterminate) {
          return this.$element;
        }
        if (this.options.state && !this.options.radioAllOff && this.$element.is(':radio')) {
          return this.$element;
        }
        value = !!value;
        this.$element.prop("checked", value).trigger("change.bootstrapSwitch", skip);
        return this.$element;
      };

      BootstrapSwitch.prototype.toggleState = function(skip) {
        if (this.options.disabled || this.options.readonly || this.options.indeterminate) {
          return this.$element;
        }
        return this.$element.prop("checked", !this.options.state).trigger("change.bootstrapSwitch", skip);
      };

      BootstrapSwitch.prototype.size = function(value) {
        if (typeof value === "undefined") {
          return this.options.size;
        }
        if (this.options.size != null) {
          this.$wrapper.removeClass("" + this.options.baseClass + "-" + this.options.size);
        }
        if (value) {
          this.$wrapper.addClass("" + this.options.baseClass + "-" + value);
        }
        this.options.size = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.animate = function(value) {
        if (typeof value === "undefined") {
          return this.options.animate;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-animate");
        this.options.animate = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.disabled = function(value) {
        if (typeof value === "undefined") {
          return this.options.disabled;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-disabled");
        this.$element.prop("disabled", value);
        this.options.disabled = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.toggleDisabled = function() {
        this.$element.prop("disabled", !this.options.disabled);
        this.$wrapper.toggleClass("" + this.options.baseClass + "-disabled");
        this.options.disabled = !this.options.disabled;
        return this.$element;
      };

      BootstrapSwitch.prototype.readonly = function(value) {
        if (typeof value === "undefined") {
          return this.options.readonly;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-readonly");
        this.$element.prop("readonly", value);
        this.options.readonly = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.toggleReadonly = function() {
        this.$element.prop("readonly", !this.options.readonly);
        this.$wrapper.toggleClass("" + this.options.baseClass + "-readonly");
        this.options.readonly = !this.options.readonly;
        return this.$element;
      };

      BootstrapSwitch.prototype.indeterminate = function(value) {
        if (typeof value === "undefined") {
          return this.options.indeterminate;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-indeterminate");
        this.$element.prop("indeterminate", value);
        this.options.indeterminate = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.toggleIndeterminate = function() {
        this.$element.prop("indeterminate", !this.options.indeterminate);
        this.$wrapper.toggleClass("" + this.options.baseClass + "-indeterminate");
        this.options.indeterminate = !this.options.indeterminate;
        return this.$element;
      };

      BootstrapSwitch.prototype.onColor = function(value) {
        var color;
        color = this.options.onColor;
        if (typeof value === "undefined") {
          return color;
        }
        if (color != null) {
          this.$on.removeClass("" + this.options.baseClass + "-" + color);
        }
        this.$on.addClass("" + this.options.baseClass + "-" + value);
        this.options.onColor = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.offColor = function(value) {
        var color;
        color = this.options.offColor;
        if (typeof value === "undefined") {
          return color;
        }
        if (color != null) {
          this.$off.removeClass("" + this.options.baseClass + "-" + color);
        }
        this.$off.addClass("" + this.options.baseClass + "-" + value);
        this.options.offColor = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.onText = function(value) {
        if (typeof value === "undefined") {
          return this.options.onText;
        }
        this.$on.html(value);
        this.options.onText = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.offText = function(value) {
        if (typeof value === "undefined") {
          return this.options.offText;
        }
        this.$off.html(value);
        this.options.offText = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.labelText = function(value) {
        if (typeof value === "undefined") {
          return this.options.labelText;
        }
        this.$label.html(value);
        this.options.labelText = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.baseClass = function(value) {
        return this.options.baseClass;
      };

      BootstrapSwitch.prototype.wrapperClass = function(value) {
        if (typeof value === "undefined") {
          return this.options.wrapperClass;
        }
        if (!value) {
          value = $.fn.bootstrapSwitch.defaults.wrapperClass;
        }
        this.$wrapper.removeClass(this._getClasses(this.options.wrapperClass).join(" "));
        this.$wrapper.addClass(this._getClasses(value).join(" "));
        this.options.wrapperClass = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.radioAllOff = function(value) {
        if (typeof value === "undefined") {
          return this.options.radioAllOff;
        }
        this.options.radioAllOff = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.onInit = function(value) {
        if (typeof value === "undefined") {
          return this.options.onInit;
        }
        if (!value) {
          value = $.fn.bootstrapSwitch.defaults.onInit;
        }
        this.options.onInit = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.onSwitchChange = function(value) {
        if (typeof value === "undefined") {
          return this.options.onSwitchChange;
        }
        if (!value) {
          value = $.fn.bootstrapSwitch.defaults.onSwitchChange;
        }
        this.options.onSwitchChange = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.destroy = function() {
        var $form;
        $form = this.$element.closest("form");
        if ($form.length) {
          $form.off("reset.bootstrapSwitch").removeData("bootstrap-switch");
        }
        this.$container.children().not(this.$element).remove();
        this.$element.unwrap().unwrap().off(".bootstrapSwitch").removeData("bootstrap-switch");
        return this.$element;
      };

      BootstrapSwitch.prototype._elementHandlers = function() {
        return this.$element.on({
          "change.bootstrapSwitch": (function(_this) {
            return function(e, skip) {
              var checked;
              e.preventDefault();
              e.stopImmediatePropagation();
              checked = _this.$element.is(":checked");
              if (checked === _this.options.state) {
                return;
              }
              _this.options.state = checked;
              _this.$wrapper.removeClass(checked ? "" + _this.options.baseClass + "-off" : "" + _this.options.baseClass + "-on").addClass(checked ? "" + _this.options.baseClass + "-on" : "" + _this.options.baseClass + "-off");
              if (!skip) {
                if (_this.$element.is(":radio")) {
                  $("[name='" + (_this.$element.attr('name')) + "']").not(_this.$element).prop("checked", false).trigger("change.bootstrapSwitch", true);
                }
                return _this.$element.trigger("switchChange.bootstrapSwitch", [checked]);
              }
            };
          })(this),
          "focus.bootstrapSwitch": (function(_this) {
            return function(e) {
              e.preventDefault();
              return _this.$wrapper.addClass("" + _this.options.baseClass + "-focused");
            };
          })(this),
          "blur.bootstrapSwitch": (function(_this) {
            return function(e) {
              e.preventDefault();
              return _this.$wrapper.removeClass("" + _this.options.baseClass + "-focused");
            };
          })(this),
          "keydown.bootstrapSwitch": (function(_this) {
            return function(e) {
              if (!e.which || _this.options.disabled || _this.options.readonly || _this.options.indeterminate) {
                return;
              }
              switch (e.which) {
                case 37:
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  return _this.state(false);
                case 39:
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  return _this.state(true);
              }
            };
          })(this)
        });
      };

      BootstrapSwitch.prototype._handleHandlers = function() {
        this.$on.on("click.bootstrapSwitch", (function(_this) {
          return function(e) {
            _this.state(false);
            return _this.$element.trigger("focus.bootstrapSwitch");
          };
        })(this));
        return this.$off.on("click.bootstrapSwitch", (function(_this) {
          return function(e) {
            _this.state(true);
            return _this.$element.trigger("focus.bootstrapSwitch");
          };
        })(this));
      };

      BootstrapSwitch.prototype._labelHandlers = function() {
        return this.$label.on({
          "mousemove.bootstrapSwitch touchmove.bootstrapSwitch": (function(_this) {
            return function(e) {
              var left, pageX, percent, right;
              if (!_this.isLabelDragging) {
                return;
              }
              e.preventDefault();
              _this.isLabelDragged = true;
              pageX = e.pageX || e.originalEvent.touches[0].pageX;
              percent = ((pageX - _this.$wrapper.offset().left) / _this.$wrapper.width()) * 100;
              left = 25;
              right = 75;
              if (_this.options.animate) {
                _this.$wrapper.removeClass("" + _this.options.baseClass + "-animate");
              }
              if (percent < left) {
                percent = left;
              } else if (percent > right) {
                percent = right;
              }
              _this.$container.css("margin-left", "" + (percent - right) + "%");
              return _this.$element.trigger("focus.bootstrapSwitch");
            };
          })(this),
          "mousedown.bootstrapSwitch touchstart.bootstrapSwitch": (function(_this) {
            return function(e) {
              if (_this.isLabelDragging || _this.options.disabled || _this.options.readonly || _this.options.indeterminate) {
                return;
              }
              e.preventDefault();
              _this.isLabelDragging = true;
              return _this.$element.trigger("focus.bootstrapSwitch");
            };
          })(this),
          "mouseup.bootstrapSwitch touchend.bootstrapSwitch": (function(_this) {
            return function(e) {
              if (!_this.isLabelDragging) {
                return;
              }
              e.preventDefault();
              if (_this.isLabelDragged) {
                _this.isLabelDragged = false;
                _this.state(parseInt(_this.$container.css("margin-left"), 10) > -(_this.$container.width() / 6));
                if (_this.options.animate) {
                  _this.$wrapper.addClass("" + _this.options.baseClass + "-animate");
                }
                _this.$container.css("margin-left", "");
              } else {
                _this.state(!_this.options.state);
              }
              return _this.isLabelDragging = false;
            };
          })(this),
          "mouseleave.bootstrapSwitch": (function(_this) {
            return function(e) {
              return _this.$label.trigger("mouseup.bootstrapSwitch");
            };
          })(this)
        });
      };

      BootstrapSwitch.prototype._formHandler = function() {
        var $form;
        $form = this.$element.closest("form");
        if ($form.data("bootstrap-switch")) {
          return;
        }
        return $form.on("reset.bootstrapSwitch", function() {
          return window.setTimeout(function() {
            return $form.find("input").filter(function() {
              return $(this).data("bootstrap-switch");
            }).each(function() {
              return $(this).bootstrapSwitch("state", this.checked);
            });
          }, 1);
        }).data("bootstrap-switch", true);
      };

      BootstrapSwitch.prototype._getClasses = function(classes) {
        var c, cls, _i, _len;
        if (!$.isArray(classes)) {
          return ["" + this.options.baseClass + "-" + classes];
        }
        cls = [];
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
          c = classes[_i];
          cls.push("" + this.options.baseClass + "-" + c);
        }
        return cls;
      };

      return BootstrapSwitch;

    })();
    $.fn.bootstrapSwitch = function() {
      var args, option, ret;
      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      ret = this;
      this.each(function() {
        var $this, data;
        $this = $(this);
        data = $this.data("bootstrap-switch");
        if (!data) {
          $this.data("bootstrap-switch", data = new BootstrapSwitch(this, option));
        }
        if (typeof option === "string") {
          return ret = data[option].apply(data, args);
        }
      });
      return ret;
    };
    $.fn.bootstrapSwitch.Constructor = BootstrapSwitch;
    return $.fn.bootstrapSwitch.defaults = {
      state: true,
      size: null,
      animate: true,
      disabled: false,
      readonly: false,
      indeterminate: false,
      onColor: "primary",
      offColor: "default",
      onText: "ON",
      offText: "OFF",
      labelText: "&nbsp;",
      baseClass: "bootstrap-switch",
      wrapperClass: "wrapper",
      radioAllOff: false,
      onInit: function() {},
      onSwitchChange: function() {}
    };
  })(window.jQuery, window);

}).call(this);

(function ($) {
  "use strict";

  var defaultOptions = {
    tagClass: function(item) {
      return 'label label-info';
    },
    itemValue: function(item) {
      return item ? item.toString() : item;
    },
    itemText: function(item) {
      return this.itemValue(item);
    },
    freeInput: true,
    addOnBlur: true,
    maxTags: undefined,
    maxChars: undefined,
    confirmKeys: [13, 44],
    onTagExists: function(item, $tag) {
      $tag.hide().fadeIn();
    },
    trimValue: false,
    allowDuplicates: false
  };

  /**
   * Constructor function
   */
  function TagsInput(element, options) {
    this.itemsArray = [];

    this.$element = $(element);
    this.$element.hide();

    this.isSelect = (element.tagName === 'SELECT');
    this.multiple = (this.isSelect && element.hasAttribute('multiple'));
    this.objectItems = options && options.itemValue;
    this.placeholderText = element.hasAttribute('placeholder') ? this.$element.attr('placeholder') : '';
    this.inputSize = Math.max(1, this.placeholderText.length);

    this.$container = $('<div class="bootstrap-tagsinput"></div>');
    this.$input = $('<input type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);

    this.$element.after(this.$container);

    var inputWidth = (this.inputSize < 3 ? 3 : this.inputSize) + "em";
    this.$input.get(0).style.cssText = "width: " + inputWidth + " !important;";
    this.build(options);
  }

  TagsInput.prototype = {
    constructor: TagsInput,

    /**
     * Adds the given item as a new tag. Pass true to dontPushVal to prevent
     * updating the elements val()
     */
    add: function(item, dontPushVal) {
      var self = this;

      if (self.options.maxTags && self.itemsArray.length >= self.options.maxTags)
        return;

      // Ignore falsey values, except false
      if (item !== false && !item)
        return;

      // Trim value
      if (typeof item === "string" && self.options.trimValue) {
        item = $.trim(item);
      }

      // Throw an error when trying to add an object while the itemValue option was not set
      if (typeof item === "object" && !self.objectItems)
        throw("Can't add objects when itemValue option is not set");

      // Ignore strings only containg whitespace
      if (item.toString().match(/^\s*$/))
        return;

      // If SELECT but not multiple, remove current tag
      if (self.isSelect && !self.multiple && self.itemsArray.length > 0)
        self.remove(self.itemsArray[0]);

      if (typeof item === "string" && this.$element[0].tagName === 'INPUT') {
        var items = item.split(',');
        if (items.length > 1) {
          for (var i = 0; i < items.length; i++) {
            this.add(items[i], true);
          }

          if (!dontPushVal)
            self.pushVal();
          return;
        }
      }

      var itemValue = self.options.itemValue(item),
          itemText = self.options.itemText(item),
          tagClass = self.options.tagClass(item);

      // Ignore items allready added
      var existing = $.grep(self.itemsArray, function(item) { return self.options.itemValue(item) === itemValue; } )[0];
      if (existing && !self.options.allowDuplicates) {
        // Invoke onTagExists
        if (self.options.onTagExists) {
          var $existingTag = $(".tag", self.$container).filter(function() { return $(this).data("item") === existing; });
          self.options.onTagExists(item, $existingTag);
        }
        return;
      }

      // if length greater than limit
      if (self.items().toString().length + item.length + 1 > self.options.maxInputLength)
        return;

      // raise beforeItemAdd arg
      var beforeItemAddEvent = $.Event('beforeItemAdd', { item: item, cancel: false });
      self.$element.trigger(beforeItemAddEvent);
      if (beforeItemAddEvent.cancel)
        return;

      // register item in internal array and map
      self.itemsArray.push(item);

      // add a tag element
      var $tag = $('<span class="tag ' + htmlEncode(tagClass) + '">' + htmlEncode(itemText) + '<span data-role="remove"></span></span>');
      $tag.data('item', item);
      self.findInputWrapper().before($tag);
      $tag.after(' ');

      // add <option /> if item represents a value not present in one of the <select />'s options
      if (self.isSelect && !$('option[value="' + encodeURIComponent(itemValue) + '"]',self.$element)[0]) {
        var $option = $('<option selected>' + htmlEncode(itemText) + '</option>');
        $option.data('item', item);
        $option.attr('value', itemValue);
        self.$element.append($option);
      }

      if (!dontPushVal)
        self.pushVal();

      // Add class when reached maxTags
      if (self.options.maxTags === self.itemsArray.length || self.items().toString().length === self.options.maxInputLength)
        self.$container.addClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemAdded', { item: item }));
    },

    /**
     * Removes the given item. Pass true to dontPushVal to prevent updating the
     * elements val()
     */
    remove: function(item, dontPushVal) {
      var self = this;

      if (self.objectItems) {
        if (typeof item === "object")
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  self.options.itemValue(item); } );
        else
          item = $.grep(self.itemsArray, function(other) { return self.options.itemValue(other) ==  item; } );

        item = item[item.length-1];
      }

      if (item) {
        var beforeItemRemoveEvent = $.Event('beforeItemRemove', { item: item, cancel: false });
        self.$element.trigger(beforeItemRemoveEvent);
        if (beforeItemRemoveEvent.cancel)
          return;

        $('.tag', self.$container).filter(function() { return $(this).data('item') === item; }).remove();
        $('option', self.$element).filter(function() { return $(this).data('item') === item; }).remove();
        if($.inArray(item, self.itemsArray) !== -1)
          self.itemsArray.splice($.inArray(item, self.itemsArray), 1);
      }

      if (!dontPushVal)
        self.pushVal();

      // Remove class when reached maxTags
      if (self.options.maxTags > self.itemsArray.length)
        self.$container.removeClass('bootstrap-tagsinput-max');

      self.$element.trigger($.Event('itemRemoved',  { item: item }));
    },

    /**
     * Removes all items
     */
    removeAll: function() {
      var self = this;

      $('.tag', self.$container).remove();
      $('option', self.$element).remove();

      while(self.itemsArray.length > 0)
        self.itemsArray.pop();

      self.pushVal();
    },

    /**
     * Refreshes the tags so they match the text/value of their corresponding
     * item.
     */
    refresh: function() {
      var self = this;
      $('.tag', self.$container).each(function() {
        var $tag = $(this),
            item = $tag.data('item'),
            itemValue = self.options.itemValue(item),
            itemText = self.options.itemText(item),
            tagClass = self.options.tagClass(item);

          // Update tag's class and inner text
          $tag.attr('class', null);
          $tag.addClass('tag ' + htmlEncode(tagClass));
          $tag.contents().filter(function() {
            return this.nodeType == 3;
          })[0].nodeValue = htmlEncode(itemText);

          if (self.isSelect) {
            var option = $('option', self.$element).filter(function() { return $(this).data('item') === item; });
            option.attr('value', itemValue);
          }
      });
    },

    /**
     * Returns the items added as tags
     */
    items: function() {
      return this.itemsArray;
    },

    /**
     * Assembly value by retrieving the value of each item, and set it on the
     * element.
     */
    pushVal: function() {
      var self = this,
          val = $.map(self.items(), function(item) {
            return self.options.itemValue(item).toString();
          });

      self.$element.val(val, true).trigger('change');
    },

    /**
     * Initializes the tags input behaviour on the element
     */
    build: function(options) {
      var self = this;

      self.options = $.extend({}, defaultOptions, options);
      // When itemValue is set, freeInput should always be false
      if (self.objectItems)
        self.options.freeInput = false;

      makeOptionItemFunction(self.options, 'itemValue');
      makeOptionItemFunction(self.options, 'itemText');
      makeOptionFunction(self.options, 'tagClass');

      // Typeahead Bootstrap version 2.3.2
      if (self.options.typeahead) {
        var typeahead = self.options.typeahead || {};

        makeOptionFunction(typeahead, 'source');

        self.$input.typeahead($.extend({}, typeahead, {
          source: function (query, process) {
            function processItems(items) {
              var texts = [];

              for (var i = 0; i < items.length; i++) {
                var text = self.options.itemText(items[i]);
                map[text] = items[i];
                texts.push(text);
              }
              process(texts);
            }

            this.map = {};
            var map = this.map,
                data = typeahead.source(query);

            if ($.isFunction(data.success)) {
              // support for Angular callbacks
              data.success(processItems);
            } else if ($.isFunction(data.then)) {
              // support for Angular promises
              data.then(processItems);
            } else {
              // support for functions and jquery promises
              $.when(data)
               .then(processItems);
            }
          },
          updater: function (text) {
            self.add(this.map[text]);
          },
          matcher: function (text) {
            return (text.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1);
          },
          sorter: function (texts) {
            return texts.sort();
          },
          highlighter: function (text) {
            var regex = new RegExp( '(' + this.query + ')', 'gi' );
            return text.replace( regex, "<strong>$1</strong>" );
          }
        }));
      }

      // typeahead.js
      if (self.options.typeaheadjs) {
          var typeaheadjs = self.options.typeaheadjs || {};

          self.$input.typeahead(null, typeaheadjs).on('typeahead:selected', $.proxy(function (obj, datum) {
            if (typeaheadjs.valueKey)
              self.add(datum[typeaheadjs.valueKey]);
            else
              self.add(datum);
            self.$input.typeahead('val', '');
          }, self));
      }

      self.$container.on('click', $.proxy(function(event) {
        if (! self.$element.attr('disabled')) {
          self.$input.removeAttr('disabled');
        }
        self.$input.focus();
      }, self));

        if (self.options.addOnBlur && self.options.freeInput) {
          self.$input.on('focusout', $.proxy(function(event) {
              // HACK: only process on focusout when no typeahead opened, to
              //       avoid adding the typeahead text as tag
              if ($('.typeahead, .twitter-typeahead', self.$container).length === 0) {
                self.add(self.$input.val());
                self.$input.val('');
              }
          }, self));
        }


      self.$container.on('keydown', 'input', $.proxy(function(event) {
        var $input = $(event.target),
            $inputWrapper = self.findInputWrapper();

        if (self.$element.attr('disabled')) {
          self.$input.attr('disabled', 'disabled');
          return;
        }

        switch (event.which) {
          // BACKSPACE
          case 8:
            if (doGetCaretPosition($input[0]) === 0) {
              var prev = $inputWrapper.prev();
              if (prev) {
                self.remove(prev.data('item'));
              }
            }
            break;

          // DELETE
          case 46:
            if (doGetCaretPosition($input[0]) === 0) {
              var next = $inputWrapper.next();
              if (next) {
                self.remove(next.data('item'));
              }
            }
            break;

          // LEFT ARROW
          case 37:
            // Try to move the input before the previous tag
            var $prevTag = $inputWrapper.prev();
            if ($input.val().length === 0 && $prevTag[0]) {
              $prevTag.before($inputWrapper);
              $input.focus();
            }
            break;
          // RIGHT ARROW
          case 39:
            // Try to move the input after the next tag
            var $nextTag = $inputWrapper.next();
            if ($input.val().length === 0 && $nextTag[0]) {
              $nextTag.after($inputWrapper);
              $input.focus();
            }
            break;
         default:
             // ignore
         }

        // Reset internal input's size
        var textLength = $input.val().length,
            wordSpace = Math.ceil(textLength / 5),
            size = textLength + wordSpace + 1;
        $input.attr('size', Math.max(this.inputSize, $input.val().length));
      }, self));

      self.$container.on('keypress', 'input', $.proxy(function(event) {
         var $input = $(event.target);

         if (self.$element.attr('disabled')) {
            self.$input.attr('disabled', 'disabled');
            return;
         }

         var text = $input.val(),
         maxLengthReached = self.options.maxChars && text.length >= self.options.maxChars;
         if (self.options.freeInput && (keyCombinationInList(event, self.options.confirmKeys) || maxLengthReached)) {
            self.add(maxLengthReached ? text.substr(0, self.options.maxChars) : text);
            $input.val('');
            event.preventDefault();
         }

         // Reset internal input's size
         var textLength = $input.val().length,
            wordSpace = Math.ceil(textLength / 5),
            size = textLength + wordSpace + 1;
         $input.attr('size', Math.max(this.inputSize, $input.val().length));
      }, self));

      // Remove icon clicked
      self.$container.on('click', '[data-role=remove]', $.proxy(function(event) {
        if (self.$element.attr('disabled')) {
          return;
        }
        self.remove($(event.target).closest('.tag').data('item'));
      }, self));

      // Only add existing value as tags when using strings as tags
      if (self.options.itemValue === defaultOptions.itemValue) {
        if (self.$element[0].tagName === 'INPUT') {
            self.add(self.$element.val());
        } else {
          $('option', self.$element).each(function() {
            self.add($(this).attr('value'), true);
          });
        }
      }
    },

    /**
     * Removes all tagsinput behaviour and unregsiter all event handlers
     */
    destroy: function() {
      var self = this;

      // Unbind events
      self.$container.off('keypress', 'input');
      self.$container.off('click', '[role=remove]');

      self.$container.remove();
      self.$element.removeData('tagsinput');
      self.$element.show();
    },

    /**
     * Sets focus on the tagsinput
     */
    focus: function() {
      this.$input.focus();
    },

    /**
     * Returns the internal input element
     */
    input: function() {
      return this.$input;
    },

    /**
     * Returns the element which is wrapped around the internal input. This
     * is normally the $container, but typeahead.js moves the $input element.
     */
    findInputWrapper: function() {
      var elt = this.$input[0],
          container = this.$container[0];
      while(elt && elt.parentNode !== container)
        elt = elt.parentNode;

      return $(elt);
    }
  };

  /**
   * Register JQuery plugin
   */
  $.fn.tagsinput = function(arg1, arg2) {
    var results = [];

    this.each(function() {
      var tagsinput = $(this).data('tagsinput');
      // Initialize a new tags input
      if (!tagsinput) {
          tagsinput = new TagsInput(this, arg1);
          $(this).data('tagsinput', tagsinput);
          results.push(tagsinput);

          if (this.tagName === 'SELECT') {
              $('option', $(this)).attr('selected', 'selected');
          }

          // Init tags from $(this).val()
          $(this).val($(this).val());
      } else if (!arg1 && !arg2) {
          // tagsinput already exists
          // no function, trying to init
          results.push(tagsinput);
      } else if(tagsinput[arg1] !== undefined) {
          // Invoke function on existing tags input
          var retVal = tagsinput[arg1](arg2);
          if (retVal !== undefined)
              results.push(retVal);
      }
    });

    if ( typeof arg1 == 'string') {
      // Return the results from the invoked function calls
      return results.length > 1 ? results : results[0];
    } else {
      return results;
    }
  };

  $.fn.tagsinput.Constructor = TagsInput;

  /**
   * Most options support both a string or number as well as a function as
   * option value. This function makes sure that the option with the given
   * key in the given options is wrapped in a function
   */
  function makeOptionItemFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var propertyName = options[key];
      options[key] = function(item) { return item[propertyName]; };
    }
  }
  function makeOptionFunction(options, key) {
    if (typeof options[key] !== 'function') {
      var value = options[key];
      options[key] = function() { return value; };
    }
  }
  /**
   * HtmlEncodes the given value
   */
  var htmlEncodeContainer = $('<div />');
  function htmlEncode(value) {
    if (value) {
      return htmlEncodeContainer.text(value).html();
    } else {
      return '';
    }
  }

  /**
   * Returns the position of the caret in the given input field
   * http://flightschool.acylt.com/devnotes/caret-position-woes/
   */
  function doGetCaretPosition(oField) {
    var iCaretPos = 0;
    if (document.selection) {
      oField.focus ();
      var oSel = document.selection.createRange();
      oSel.moveStart ('character', -oField.value.length);
      iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionStart;
    }
    return (iCaretPos);
  }

  /**
    * Returns boolean indicates whether user has pressed an expected key combination.
    * @param object keyPressEvent: JavaScript event object, refer
    *     http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    * @param object lookupList: expected key combinations, as in:
    *     [13, {which: 188, shiftKey: true}]
    */
  function keyCombinationInList(keyPressEvent, lookupList) {
      var found = false;
      $.each(lookupList, function (index, keyCombination) {
          if (typeof (keyCombination) === 'number' && keyPressEvent.which === keyCombination) {
              found = true;
              return false;
          }

          if (keyPressEvent.which === keyCombination.which) {
              var alt = !keyCombination.hasOwnProperty('altKey') || keyPressEvent.altKey === keyCombination.altKey,
                  shift = !keyCombination.hasOwnProperty('shiftKey') || keyPressEvent.shiftKey === keyCombination.shiftKey,
                  ctrl = !keyCombination.hasOwnProperty('ctrlKey') || keyPressEvent.ctrlKey === keyCombination.ctrlKey;
              if (alt && shift && ctrl) {
                  found = true;
                  return false;
              }
          }
      });

      return found;
  }

  /**
   * Initialize tagsinput behaviour on inputs and selects which have
   * data-role=tagsinput
   */
  $(function() {
    $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
  });
})(window.jQuery);

/*!

Holder - client side image placeholders
Version 2.4.1+f2l1h
© 2014 Ivan Malopinsky - http://imsky.co

Site:     http://imsky.github.io/holder
Issues:   https://github.com/imsky/holder/issues
License:  http://opensource.org/licenses/MIT

*/
!function(e,t,r){t[e]=r}("onDomReady",this,function(e){"use strict";function t(e){if(!b){if(!a.body)return i(t);for(b=!0;e=S.shift();)i(e)}}function r(e){(y||e.type===s||a[c]===u)&&(n(),t())}function n(){y?(a[x](m,r,d),e[x](s,r,d)):(a[g](v,r),e[g](h,r))}function i(e,t){setTimeout(e,+t>=0?t:1)}function o(e){b?i(e):S.push(e)}null==document.readyState&&document.addEventListener&&(document.addEventListener("DOMContentLoaded",function E(){document.removeEventListener("DOMContentLoaded",E,!1),document.readyState="complete"},!1),document.readyState="loading");var a=e.document,l=a.documentElement,s="load",d=!1,h="on"+s,u="complete",c="readyState",f="attachEvent",g="detachEvent",p="addEventListener",m="DOMContentLoaded",v="onreadystatechange",x="removeEventListener",y=p in a,w=d,b=d,S=[];if(a[c]===u)i(t);else if(y)a[p](m,r,d),e[p](s,r,d);else{a[f](v,r),e[f](h,r);try{w=null==e.frameElement&&l}catch(C){}w&&w.doScroll&&!function k(){if(!b){try{w.doScroll("left")}catch(e){return i(k,50)}n(),t()}}()}return o.version="1.4.0",o.isReady=function(){return b},o}(this)),document.querySelectorAll||(document.querySelectorAll=function(e){var t,r=document.createElement("style"),n=[];for(document.documentElement.firstChild.appendChild(r),document._qsa=[],r.styleSheet.cssText=e+"{x-qsa:expression(document._qsa && document._qsa.push(this))}",window.scrollBy(0,0),r.parentNode.removeChild(r);document._qsa.length;)t=document._qsa.shift(),t.style.removeAttribute("x-qsa"),n.push(t);return document._qsa=null,n}),document.querySelector||(document.querySelector=function(e){var t=document.querySelectorAll(e);return t.length?t[0]:null}),document.getElementsByClassName||(document.getElementsByClassName=function(e){return e=String(e).replace(/^|\s+/g,"."),document.querySelectorAll(e)}),Object.keys||(Object.keys=function(e){if(e!==Object(e))throw TypeError("Object.keys called on non-object");var t,r=[];for(t in e)Object.prototype.hasOwnProperty.call(e,t)&&r.push(t);return r}),function(e){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";e.atob=e.atob||function(e){e=String(e);var r,n=0,i=[],o=0,a=0;if(e=e.replace(/\s/g,""),e.length%4===0&&(e=e.replace(/=+$/,"")),e.length%4===1)throw Error("InvalidCharacterError");if(/[^+/0-9A-Za-z]/.test(e))throw Error("InvalidCharacterError");for(;n<e.length;)r=t.indexOf(e.charAt(n)),o=o<<6|r,a+=6,24===a&&(i.push(String.fromCharCode(o>>16&255)),i.push(String.fromCharCode(o>>8&255)),i.push(String.fromCharCode(255&o)),a=0,o=0),n+=1;return 12===a?(o>>=4,i.push(String.fromCharCode(255&o))):18===a&&(o>>=2,i.push(String.fromCharCode(o>>8&255)),i.push(String.fromCharCode(255&o))),i.join("")},e.btoa=e.btoa||function(e){e=String(e);var r,n,i,o,a,l,s,d=0,h=[];if(/[^\x00-\xFF]/.test(e))throw Error("InvalidCharacterError");for(;d<e.length;)r=e.charCodeAt(d++),n=e.charCodeAt(d++),i=e.charCodeAt(d++),o=r>>2,a=(3&r)<<4|n>>4,l=(15&n)<<2|i>>6,s=63&i,d===e.length+2?(l=64,s=64):d===e.length+1&&(s=64),h.push(t.charAt(o),t.charAt(a),t.charAt(l),t.charAt(s));return h.join("")}}(this),function(){function e(t,r,n){t.document;var i,o=t.currentStyle[r].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/)||[0,0,""],a=o[1],l=o[2];return n=n?/%|em/.test(l)&&t.parentElement?e(t.parentElement,"fontSize",null):16:n,i="fontSize"==r?n:/width/i.test(r)?t.clientWidth:t.clientHeight,"%"==l?a/100*i:"cm"==l?.3937*a*96:"em"==l?a*n:"in"==l?96*a:"mm"==l?.3937*a*96/10:"pc"==l?12*a*96/72:"pt"==l?96*a/72:a}function t(e,t){var r="border"==t?"Width":"",n=t+"Top"+r,i=t+"Right"+r,o=t+"Bottom"+r,a=t+"Left"+r;e[t]=(e[n]==e[i]&&e[n]==e[o]&&e[n]==e[a]?[e[n]]:e[n]==e[o]&&e[a]==e[i]?[e[n],e[i]]:e[a]==e[i]?[e[n],e[i],e[o]]:[e[n],e[i],e[o],e[a]]).join(" ")}function r(r){var n,i=this,o=r.currentStyle,a=e(r,"fontSize"),l=function(e){return"-"+e.toLowerCase()};for(n in o)if(Array.prototype.push.call(i,"styleFloat"==n?"float":n.replace(/[A-Z]/,l)),"width"==n)i[n]=r.offsetWidth+"px";else if("height"==n)i[n]=r.offsetHeight+"px";else if("styleFloat"==n)i.float=o[n];else if(/margin.|padding.|border.+W/.test(n)&&"auto"!=i[n])i[n]=Math.round(e(r,n,a))+"px";else if(/^outline/.test(n))try{i[n]=o[n]}catch(s){i.outlineColor=o.color,i.outlineStyle=i.outlineStyle||"none",i.outlineWidth=i.outlineWidth||"0px",i.outline=[i.outlineColor,i.outlineWidth,i.outlineStyle].join(" ")}else i[n]=o[n];t(i,"margin"),t(i,"padding"),t(i,"border"),i.fontSize=Math.round(a)+"px"}window.getComputedStyle||(r.prototype={constructor:r,getPropertyPriority:function(){throw new Error("NotSupportedError: DOM Exception 9")},getPropertyValue:function(e){var t=e.replace(/-([a-z])/g,function(e){return e=e.charAt?e.split(""):e,e[1].toUpperCase()}),r=this[t];return r},item:function(e){return this[e]},removeProperty:function(){throw new Error("NoModificationAllowedError: DOM Exception 7")},setProperty:function(){throw new Error("NoModificationAllowedError: DOM Exception 7")},getPropertyCSSValue:function(){throw new Error("NotSupportedError: DOM Exception 9")}},window.getComputedStyle=function(e){return new r(e)})}(),Object.prototype.hasOwnProperty||(Object.prototype.hasOwnProperty=function(e){var t=this.__proto__||this.constructor.prototype;return e in this&&(!(e in t)||t[e]!==this[e])}),function(e,t){e.augment=t()}(this,function(){"use strict";var e=function(){},t=Array.prototype.slice,r=function(r,n){var i=e.prototype="function"==typeof r?r.prototype:r,o=new e,a=n.apply(o,t.call(arguments,2).concat(i));if("object"==typeof a)for(var l in a)o[l]=a[l];if(!o.hasOwnProperty("constructor"))return o;var s=o.constructor;return s.prototype=o,s};return r.defclass=function(e){var t=e.constructor;return t.prototype=e,t},r.extend=function(e,t){return r(e,function(e){return this.uber=e,t})},r}),function(e,t){function r(e,t,r,o){var a=n(r.substr(r.lastIndexOf(e.domain)),e);a&&i(null,o,a,t)}function n(e,t){for(var r={theme:p(A.settings.themes.gray,null),stylesheets:t.stylesheets,holderURL:[]},n=!1,i=String.fromCharCode(11),o=e.replace(/([^\\])\//g,"$1"+i).split(i),a=/%[0-9a-f]{2}/gi,l=o.length,s=0;l>s;s++){var d=o[s];if(d.match(a))try{d=decodeURIComponent(d)}catch(h){d=o[s]}var u=!1;if(A.flags.dimensions.match(d))n=!0,r.dimensions=A.flags.dimensions.output(d),u=!0;else if(A.flags.fluid.match(d))n=!0,r.dimensions=A.flags.fluid.output(d),r.fluid=!0,u=!0;else if(A.flags.textmode.match(d))r.textmode=A.flags.textmode.output(d),u=!0;else if(A.flags.colors.match(d)){var c=A.flags.colors.output(d);r.theme=p(r.theme,c),u=!0}else if(t.themes[d])t.themes.hasOwnProperty(d)&&(r.theme=p(t.themes[d],null)),u=!0;else if(A.flags.font.match(d))r.font=A.flags.font.output(d),u=!0;else if(A.flags.auto.match(d))r.auto=!0,u=!0;else if(A.flags.text.match(d))r.text=A.flags.text.output(d),u=!0;else if(A.flags.random.match(d)){null==A.vars.cache.themeKeys&&(A.vars.cache.themeKeys=Object.keys(t.themes));var f=A.vars.cache.themeKeys[0|Math.random()*A.vars.cache.themeKeys.length];r.theme=p(t.themes[f],null),u=!0}u&&r.holderURL.push(d)}return r.holderURL.unshift(t.domain),r.holderURL=r.holderURL.join("/"),n?r:!1}function i(e,t,r,n){var i=r.dimensions,a=r.theme,l=i.width+"x"+i.height;if(e=null==e?r.fluid?"fluid":"image":e,null!=r.text&&(a.text=r.text,"object"===t.nodeName.toLowerCase())){for(var d=a.text.split("\\n"),u=0;u<d.length;u++)d[u]=b(d[u]);a.text=d.join("\\n")}var f=r.holderURL,g=p(n,null);r.font&&(a.font=r.font,!g.noFontFallback&&"img"===t.nodeName.toLowerCase()&&A.setup.supportsCanvas&&"svg"===g.renderer&&(g=p(g,{renderer:"canvas"}))),r.font&&"canvas"==g.renderer&&(g.reRender=!0),"background"==e?null==t.getAttribute("data-background-src")&&c(t,{"data-background-src":f}):c(t,{"data-src":f}),r.theme=a,t.holderData={flags:r,renderSettings:g},("image"==e||"fluid"==e)&&c(t,{alt:a.text?(a.text.length>16?a.text.substring(0,16)+"…":a.text)+" ["+l+"]":l}),"image"==e?("html"!=g.renderer&&r.auto||(t.style.width=i.width+"px",t.style.height=i.height+"px"),"html"==g.renderer?t.style.backgroundColor=a.background:(o(e,{dimensions:i,theme:a,flags:r},t,g),r.textmode&&"exact"==r.textmode&&(A.vars.resizableImages.push(t),s(t)))):"background"==e&&"html"!=g.renderer?o(e,{dimensions:i,theme:a,flags:r},t,g):"fluid"==e&&("%"==i.height.slice(-1)?t.style.height=i.height:null!=r.auto&&r.auto||(t.style.height=i.height+"px"),"%"==i.width.slice(-1)?t.style.width=i.width:null!=r.auto&&r.auto||(t.style.width=i.width+"px"),("inline"==t.style.display||""===t.style.display||"none"==t.style.display)&&(t.style.display="block"),h(t),"html"==g.renderer?t.style.backgroundColor=a.background:(A.vars.resizableImages.push(t),s(t)))}function o(e,t,r,n){function i(){var e=null;switch(n.renderer){case"canvas":e=L(s);break;case"svg":e=O(s,n);break;default:throw"Holder: invalid renderer: "+n.renderer}return e}var o=null;switch(n.renderer){case"svg":if(!A.setup.supportsSVG)return;break;case"canvas":if(!A.setup.supportsCanvas)return;break;default:return}{var l={width:t.dimensions.width,height:t.dimensions.height,theme:t.theme,flags:t.flags},s=a(l);({text:l.text,width:l.width,height:l.height,textHeight:l.font.size,font:l.font.family,fontWeight:l.font.weight,template:l.theme})}if(o=i(),null==o)throw"Holder: couldn't render placeholder";"background"==e?(r.style.backgroundImage="url("+o+")",r.style.backgroundSize=l.width+"px "+l.height+"px"):("img"===r.nodeName.toLowerCase()?c(r,{src:o}):"object"===r.nodeName.toLowerCase()&&(c(r,{data:o}),c(r,{type:"image/svg+xml"})),n.reRender&&setTimeout(function(){var e=i();if(null==e)throw"Holder: couldn't render placeholder";"img"===r.nodeName.toLowerCase()?c(r,{src:e}):"object"===r.nodeName.toLowerCase()&&(c(r,{data:e}),c(r,{type:"image/svg+xml"}))},100)),c(r,{"data-holder-rendered":!0})}function a(e){function t(e,t,r,n){t.width=r,t.height=n,e.width=Math.max(e.width,t.width),e.height+=t.height,e.add(t)}switch(e.font={family:e.theme.font?e.theme.font:"Arial, Helvetica, Open Sans, sans-serif",size:l(e.width,e.height,e.theme.size?e.theme.size:A.defaults.size),units:e.theme.units?e.theme.units:A.defaults.units,weight:e.theme.fontweight?e.theme.fontweight:"bold"},e.text=e.theme.text?e.theme.text:Math.floor(e.width)+"x"+Math.floor(e.height),e.flags.textmode){case"literal":e.text=e.flags.dimensions.width+"x"+e.flags.dimensions.height;break;case"exact":if(!e.flags.exactDimensions)break;e.text=Math.floor(e.flags.exactDimensions.width)+"x"+Math.floor(e.flags.exactDimensions.height)}var r=new z({width:e.width,height:e.height}),n=r.Shape,i=new n.Rect("holderBg",{fill:e.theme.background});i.resize(e.width,e.height),r.root.add(i);var o=new n.Group("holderTextGroup",{text:e.text,align:"center",font:e.font,fill:e.theme.foreground});o.moveTo(null,null,1),r.root.add(o);var a=o.textPositionData=T(r);if(!a)throw"Holder: staging fallback not supported yet.";o.properties.leading=a.boundingBox.height;var s=null,d=null;if(a.lineCount>1){var h=0,u=0,c=e.width*A.setup.lineWrapRatio,f=0;d=new n.Group("line"+f);for(var g=0;g<a.words.length;g++){var p=a.words[g];s=new n.Text(p.text);var m="\\n"==p.text;(h+p.width>=c||m===!0)&&(t(o,d,h,o.properties.leading),h=0,u+=o.properties.leading,f+=1,d=new n.Group("line"+f),d.y=u),m!==!0&&(s.moveTo(h,0),h+=a.spaceWidth+p.width,d.add(s))}t(o,d,h,o.properties.leading);for(var v in o.children)d=o.children[v],d.moveTo((o.width-d.width)/2,null,null);o.moveTo((e.width-o.width)/2,(e.height-o.height)/2,null),(e.height-o.height)/2<0&&o.moveTo(null,0,null)}else s=new n.Text(e.text),d=new n.Group("line0"),d.add(s),o.add(d),o.moveTo((e.width-a.boundingBox.width)/2,(e.height-a.boundingBox.height)/2,null);return r}function l(e,t,r){t=parseInt(t,10),e=parseInt(e,10);var n=Math.max(t,e),i=Math.min(t,e),o=A.defaults.scale,a=Math.min(.75*i,.75*n*o);return Math.round(Math.max(r,a))}function s(e){var t;t=null==e||null==e.nodeType?A.vars.resizableImages:[e];for(var r in t)if(t.hasOwnProperty(r)){var n=t[r];if(n.holderData){var i=n.holderData.flags,a=d(n,k.invisibleErrorFn(s));if(a){if(i.fluid&&i.auto){var l=n.holderData.fluidConfig;switch(l.mode){case"width":a.height=a.width/l.ratio;break;case"height":a.width=a.height*l.ratio}}var h={dimensions:a,theme:i.theme,flags:i};i.textmode&&"exact"==i.textmode&&(i.exactDimensions=a,h.dimensions=i.dimensions),o("image",h,n,n.holderData.renderSettings)}}}}function d(e,t){var r={height:e.clientHeight,width:e.clientWidth};return r.height||r.width?(e.removeAttribute("data-holder-invisible"),r):(c(e,{"data-holder-invisible":!0}),t.call(this,e),void 0)}function h(e){if(e.holderData){var t=d(e,k.invisibleErrorFn(h));if(t){var r=e.holderData.flags,n={fluidHeight:"%"==r.dimensions.height.slice(-1),fluidWidth:"%"==r.dimensions.width.slice(-1),mode:null,initialDimensions:t};n.fluidWidth&&!n.fluidHeight?(n.mode="width",n.ratio=n.initialDimensions.width/parseFloat(r.dimensions.height)):!n.fluidWidth&&n.fluidHeight&&(n.mode="height",n.ratio=parseFloat(r.dimensions.width)/n.initialDimensions.height),e.holderData.fluidConfig=n}}}function u(e,t){return null==t?E.createElement(e):E.createElementNS(t,e)}function c(e,t){for(var r in t)e.setAttribute(r,t[r])}function f(e,t,r){if(null==e){e=u("svg",C);var n=u("defs",C);e.appendChild(n)}return e.webkitMatchesSelector&&e.setAttribute("xmlns",C),c(e,{width:t,height:r,viewBox:"0 0 "+t+" "+r,preserveAspectRatio:"none"}),e}function g(e,r){if(t.XMLSerializer){{var n=new XMLSerializer,i="",o=r.stylesheets;e.querySelector("defs")}if(r.svgXMLStylesheet){for(var a=(new DOMParser).parseFromString("<xml />","application/xml"),l=o.length-1;l>=0;l--){var s=a.createProcessingInstruction("xml-stylesheet",'href="'+o[l]+'" rel="stylesheet"');a.insertBefore(s,a.firstChild)}var d=a.createProcessingInstruction("xml",'version="1.0" encoding="UTF-8" standalone="yes"');a.insertBefore(d,a.firstChild),a.removeChild(a.documentElement),i=n.serializeToString(a)}var h=n.serializeToString(e);return h=h.replace(/\&amp;(\#[0-9]{2,}\;)/g,"&$1"),i+h}}function p(e,t){var r={};for(var n in e)e.hasOwnProperty(n)&&(r[n]=e[n]);if(null!=t)for(var i in t)t.hasOwnProperty(i)&&(r[i]=t[i]);return r}function m(e){var t=[];for(var r in e)e.hasOwnProperty(r)&&t.push(r+":"+e[r]);return t.join(";")}function v(e){A.vars.debounceTimer||e.call(this),A.vars.debounceTimer&&clearTimeout(A.vars.debounceTimer),A.vars.debounceTimer=setTimeout(function(){A.vars.debounceTimer=null,e.call(this)},A.setup.debounce)}function x(){v(function(){s(null)})}function y(e){var r=null;return"string"==typeof e?r=E.querySelectorAll(e):t.NodeList&&e instanceof t.NodeList?r=e:t.Node&&e instanceof t.Node?r=[e]:t.HTMLCollection&&e instanceof t.HTMLCollection?r=e:null===e&&(r=[]),r}function w(e,t){var r=new Image;r.onerror=function(){t.call(this,!1)},r.onload=function(){t.call(this,!0)},r.src=e}function b(e){for(var t=[],r=0,n=e.length-1;n>=0;n--)r=e.charCodeAt(n),r>128?t.unshift(["&#",r,";"].join("")):t.unshift(e[n]);return t.join("")}function S(e){return e.replace(/&#(\d+);/g,function(e,t){return String.fromCharCode(t)})}var C="http://www.w3.org/2000/svg",E=t.document,k={addTheme:function(e,t){return null!=e&&null!=t&&(A.settings.themes[e]=t),delete A.vars.cache.themeKeys,this},addImage:function(e,t){var r=E.querySelectorAll(t);if(r.length)for(var n=0,i=r.length;i>n;n++){var o=u("img");c(o,{"data-src":e}),r[n].appendChild(o)}return this},run:function(e){e=e||{};var o={};A.vars.preempted=!0;var a=p(A.settings,e);o.renderer=a.renderer?a.renderer:A.setup.renderer,-1===A.setup.renderers.join(",").indexOf(o.renderer)&&(o.renderer=A.setup.supportsSVG?"svg":A.setup.supportsCanvas?"canvas":"html"),a.use_canvas?o.renderer="canvas":a.use_svg&&(o.renderer="svg");var l=y(a.images),s=y(a.bgnodes),d=y(a.stylenodes),h=y(a.objects);o.stylesheets=[],o.svgXMLStylesheet=!0,o.noFontFallback=a.noFontFallback?a.noFontFallback:!1;for(var c=0;c<d.length;c++){var f=d[c];if(f.attributes.rel&&f.attributes.href&&"stylesheet"==f.attributes.rel.value){var g=f.attributes.href.value,m=u("a");m.href=g;var v=m.protocol+"//"+m.host+m.pathname+m.search;o.stylesheets.push(v)}}for(c=0;c<s.length;c++){var x=t.getComputedStyle(s[c],null).getPropertyValue("background-image"),b=s[c].getAttribute("data-background-src"),S=null;S=null==b?x:b;var C=null,E="?"+a.domain+"/";if(0===S.indexOf(E))C=S.slice(1);else if(-1!=S.indexOf(E)){var k=S.substr(S.indexOf(E)).slice(1),T=k.match(/([^\"]*)"?\)/);null!=T&&(C=T[1])}if(null!=C){var L=n(C,a);L&&i("background",s[c],L,o)}}for(c=0;c<h.length;c++){var O=h[c],z={};try{z.data=O.getAttribute("data"),z.dataSrc=O.getAttribute("data-src")}catch(F){}var M=null!=z.data&&0===z.data.indexOf(a.domain),D=null!=z.dataSrc&&0===z.dataSrc.indexOf(a.domain);M?r(a,o,z.data,O):D&&r(a,o,z.dataSrc,O)}for(c=0;c<l.length;c++){var R=l[c],j={};try{j.src=R.getAttribute("src"),j.dataSrc=R.getAttribute("data-src"),j.rendered=R.getAttribute("data-holder-rendered")}catch(F){}var B=null!=j.src,P=null!=j.dataSrc&&0===j.dataSrc.indexOf(a.domain),N=null!=j.rendered&&"true"==j.rendered;B?0===j.src.indexOf(a.domain)?r(a,o,j.src,R):P&&(N?r(a,o,j.dataSrc,R):!function(e,t,n,i,o){w(e,function(e){e||r(t,n,i,o)})}(j.src,a,o,j.dataSrc,R)):P&&r(a,o,j.dataSrc,R)}return this},invisibleErrorFn:function(){return function(e){if(e.hasAttribute("data-holder-invisible"))throw"Holder: invisible placeholder"}}};k.add_theme=k.addTheme,k.add_image=k.addImage,k.invisible_error_fn=k.invisibleErrorFn;var A={settings:{domain:"holder.js",images:"img",objects:"object",bgnodes:"body .holderjs",stylenodes:"head link.holderjs",stylesheets:[],themes:{gray:{background:"#EEEEEE",foreground:"#AAAAAA"},social:{background:"#3a5a97",foreground:"#FFFFFF"},industrial:{background:"#434A52",foreground:"#C2F200"},sky:{background:"#0D8FDB",foreground:"#FFFFFF"},vine:{background:"#39DBAC",foreground:"#1E292C"},lava:{background:"#F8591A",foreground:"#1C2846"}}},defaults:{size:10,units:"pt",scale:1/16},flags:{dimensions:{regex:/^(\d+)x(\d+)$/,output:function(e){var t=this.regex.exec(e);return{width:+t[1],height:+t[2]}}},fluid:{regex:/^([0-9]+%?)x([0-9]+%?)$/,output:function(e){var t=this.regex.exec(e);return{width:t[1],height:t[2]}}},colors:{regex:/(?:#|\^)([0-9a-f]{3,})\:(?:#|\^)([0-9a-f]{3,})/i,output:function(e){var t=this.regex.exec(e);return{foreground:"#"+t[2],background:"#"+t[1]}}},text:{regex:/text\:(.*)/,output:function(e){return this.regex.exec(e)[1].replace("\\/","/")}},font:{regex:/font\:(.*)/,output:function(e){return this.regex.exec(e)[1]}},auto:{regex:/^auto$/},textmode:{regex:/textmode\:(.*)/,output:function(e){return this.regex.exec(e)[1]}},random:{regex:/^random$/}}},T=function(){var e=null,t=null,r=null;return function(n){var i=n.root;if(A.setup.supportsSVG){var o=!1,a=function(e){return E.createTextNode(e)};null==e&&(o=!0),e=f(e,i.properties.width,i.properties.height),o&&(t=u("text",C),r=a(null),c(t,{x:0}),t.appendChild(r),e.appendChild(t),E.body.appendChild(e),e.style.visibility="hidden",e.style.position="absolute",e.style.top="-100%",e.style.left="-100%");var l=i.children.holderTextGroup,s=l.properties;c(t,{y:s.font.size,style:m({"font-weight":s.font.weight,"font-size":s.font.size+s.font.units,"font-family":s.font.family,"dominant-baseline":"middle"})}),r.nodeValue=s.text;var d=t.getBBox(),h=Math.ceil(d.width/(i.properties.width*A.setup.lineWrapRatio)),g=s.text.split(" "),p=s.text.match(/\\n/g);h+=null==p?0:p.length,r.nodeValue=s.text.replace(/[ ]+/g,"");var v=t.getComputedTextLength(),x=d.width-v,y=Math.round(x/Math.max(1,g.length-1)),w=[];if(h>1){r.nodeValue="";for(var b=0;b<g.length;b++)if(0!==g[b].length){r.nodeValue=S(g[b]);var k=t.getBBox();w.push({text:g[b],width:k.width})}}return{spaceWidth:y,lineCount:h,boundingBox:d,words:w}}return!1}}(),L=function(){var e=u("canvas"),t=null;return function(r){null==t&&(t=e.getContext("2d"));var n=r.root;e.width=A.dpr(n.properties.width),e.height=A.dpr(n.properties.height),t.textBaseline="middle",t.fillStyle=n.children.holderBg.properties.fill,t.fillRect(0,0,A.dpr(n.children.holderBg.width),A.dpr(n.children.holderBg.height));{var i=n.children.holderTextGroup;i.properties}t.font=i.properties.font.weight+" "+A.dpr(i.properties.font.size)+i.properties.font.units+" "+i.properties.font.family+", monospace",t.fillStyle=i.properties.fill;for(var o in i.children){var a=i.children[o];for(var l in a.children){var s=a.children[l],d=A.dpr(i.x+a.x+s.x),h=A.dpr(i.y+a.y+s.y+i.properties.leading/2);t.fillText(s.properties.text,d,h)}}return e.toDataURL("image/png")}}(),O=function(){if(t.XMLSerializer){var e=f(null,0,0),r=u("rect",C);return e.appendChild(r),function(t,n){var i=t.root;f(e,i.properties.width,i.properties.height);for(var o=e.querySelectorAll("g"),a=0;a<o.length;a++)o[a].parentNode.removeChild(o[a]);c(r,{width:i.children.holderBg.width,height:i.children.holderBg.height,fill:i.children.holderBg.properties.fill});var l=i.children.holderTextGroup,s=l.properties,d=u("g",C);e.appendChild(d);for(var h in l.children){var p=l.children[h];for(var v in p.children){var x=p.children[v],y=l.x+p.x+x.x,w=l.y+p.y+x.y+l.properties.leading/2,b=u("text",C),S=E.createTextNode(null);c(b,{x:y,y:w,style:m({fill:s.fill,"font-weight":s.font.weight,"font-family":s.font.family+", monospace","font-size":s.font.size+s.font.units,"dominant-baseline":"central"})}),S.nodeValue=x.properties.text,b.appendChild(S),d.appendChild(b)}}var k="data:image/svg+xml;base64,"+btoa(unescape(encodeURIComponent(g(e,n))));return k}}}(),z=function(e){function t(e,t){for(var r in t)e[r]=t[r];return e}var r=1,n=augment.defclass({constructor:function(e){r++,this.parent=null,this.children={},this.id=r,this.name="n"+r,null!=e&&(this.name=e),this.x=0,this.y=0,this.z=0,this.width=0,this.height=0},resize:function(e,t){null!=e&&(this.width=e),null!=t&&(this.height=t)},moveTo:function(e,t,r){this.x=null!=e?e:this.x,this.y=null!=t?t:this.y,this.z=null!=r?r:this.z},add:function(e){var t=e.name;if(null!=this.children[t])throw"SceneGraph: child with that name already exists: "+t;this.children[t]=e,e.parent=this}}),i=augment(n,function(t){this.constructor=function(){t.constructor.call(this,"root"),this.properties=e}}),o=augment(n,function(e){function r(r,n){if(e.constructor.call(this,r),this.properties={fill:"#000"},null!=n)t(this.properties,n);else if(null!=r&&"string"!=typeof r)throw"SceneGraph: invalid node name"}this.Group=augment.extend(this,{constructor:r,type:"group"}),this.Rect=augment.extend(this,{constructor:r,type:"rect"}),this.Text=augment.extend(this,{constructor:function(e){r.call(this),this.properties.text=e},type:"text"})}),a=new i;return this.Shape=o,this.root=a,this};for(var F in A.flags)A.flags.hasOwnProperty(F)&&(A.flags[F].match=function(e){return e.match(this.regex)});A.setup={renderer:"html",debounce:100,ratio:1,supportsCanvas:!1,supportsSVG:!1,lineWrapRatio:.9,renderers:["html","canvas","svg"]},A.dpr=function(e){return e*A.setup.ratio},A.vars={preempted:!1,resizableImages:[],debounceTimer:null,cache:{}},function(){var e=1,r=1,n=u("canvas"),i=null;n.getContext&&-1!=n.toDataURL("image/png").indexOf("data:image/png")&&(A.setup.renderer="canvas",i=n.getContext("2d"),A.setup.supportsCanvas=!0),A.setup.supportsCanvas&&(e=t.devicePixelRatio||1,r=i.webkitBackingStorePixelRatio||i.mozBackingStorePixelRatio||i.msBackingStorePixelRatio||i.oBackingStorePixelRatio||i.backingStorePixelRatio||1),A.setup.ratio=e/r,E.createElementNS&&E.createElementNS(C,"svg").createSVGRect&&(A.setup.renderer="svg",A.setup.supportsSVG=!0)}(),e(k,"Holder",t),t.onDomReady&&t.onDomReady(function(){A.vars.preempted||k.run(),t.addEventListener?(t.addEventListener("resize",x,!1),t.addEventListener("orientationchange",x,!1)):t.attachEvent("onresize",x),"object"==typeof t.Turbolinks&&t.document.addEventListener("page:change",function(){k.run()})})}(function(e,t,r){var n="function"==typeof define&&define.amd;n?define(e):r[t]=e},this);
/*!
 * typeahead.js 0.10.5
 * https://github.com/twitter/typeahead.js
 * Copyright 2013-2014 Twitter, Inc. and other contributors; Licensed MIT
 */

(function($) {
    var _ = function() {
        "use strict";
        return {
            isMsie: function() {
                return /(msie|trident)/i.test(navigator.userAgent) ? navigator.userAgent.match(/(msie |rv:)(\d+(.\d+)?)/i)[2] : false;
            },
            isBlankString: function(str) {
                return !str || /^\s*$/.test(str);
            },
            escapeRegExChars: function(str) {
                return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            },
            isString: function(obj) {
                return typeof obj === "string";
            },
            isNumber: function(obj) {
                return typeof obj === "number";
            },
            isArray: $.isArray,
            isFunction: $.isFunction,
            isObject: $.isPlainObject,
            isUndefined: function(obj) {
                return typeof obj === "undefined";
            },
            toStr: function toStr(s) {
                return _.isUndefined(s) || s === null ? "" : s + "";
            },
            bind: $.proxy,
            each: function(collection, cb) {
                $.each(collection, reverseArgs);
                function reverseArgs(index, value) {
                    return cb(value, index);
                }
            },
            map: $.map,
            filter: $.grep,
            every: function(obj, test) {
                var result = true;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (!(result = test.call(null, val, key, obj))) {
                        return false;
                    }
                });
                return !!result;
            },
            some: function(obj, test) {
                var result = false;
                if (!obj) {
                    return result;
                }
                $.each(obj, function(key, val) {
                    if (result = test.call(null, val, key, obj)) {
                        return false;
                    }
                });
                return !!result;
            },
            mixin: $.extend,
            getUniqueId: function() {
                var counter = 0;
                return function() {
                    return counter++;
                };
            }(),
            templatify: function templatify(obj) {
                return $.isFunction(obj) ? obj : template;
                function template() {
                    return String(obj);
                }
            },
            defer: function(fn) {
                setTimeout(fn, 0);
            },
            debounce: function(func, wait, immediate) {
                var timeout, result;
                return function() {
                    var context = this, args = arguments, later, callNow;
                    later = function() {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                        }
                    };
                    callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                    }
                    return result;
                };
            },
            throttle: function(func, wait) {
                var context, args, timeout, result, previous, later;
                previous = 0;
                later = function() {
                    previous = new Date();
                    timeout = null;
                    result = func.apply(context, args);
                };
                return function() {
                    var now = new Date(), remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0) {
                        clearTimeout(timeout);
                        timeout = null;
                        previous = now;
                        result = func.apply(context, args);
                    } else if (!timeout) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            },
            noop: function() {}
        };
    }();
    var VERSION = "0.10.5";
    var tokenizers = function() {
        "use strict";
        return {
            nonword: nonword,
            whitespace: whitespace,
            obj: {
                nonword: getObjTokenizer(nonword),
                whitespace: getObjTokenizer(whitespace)
            }
        };
        function whitespace(str) {
            str = _.toStr(str);
            return str ? str.split(/\s+/) : [];
        }
        function nonword(str) {
            str = _.toStr(str);
            return str ? str.split(/\W+/) : [];
        }
        function getObjTokenizer(tokenizer) {
            return function setKey() {
                var args = [].slice.call(arguments, 0);
                return function tokenize(o) {
                    var tokens = [];
                    _.each(args, function(k) {
                        tokens = tokens.concat(tokenizer(_.toStr(o[k])));
                    });
                    return tokens;
                };
            };
        }
    }();
    var LruCache = function() {
        "use strict";
        function LruCache(maxSize) {
            this.maxSize = _.isNumber(maxSize) ? maxSize : 100;
            this.reset();
            if (this.maxSize <= 0) {
                this.set = this.get = $.noop;
            }
        }
        _.mixin(LruCache.prototype, {
            set: function set(key, val) {
                var tailItem = this.list.tail, node;
                if (this.size >= this.maxSize) {
                    this.list.remove(tailItem);
                    delete this.hash[tailItem.key];
                }
                if (node = this.hash[key]) {
                    node.val = val;
                    this.list.moveToFront(node);
                } else {
                    node = new Node(key, val);
                    this.list.add(node);
                    this.hash[key] = node;
                    this.size++;
                }
            },
            get: function get(key) {
                var node = this.hash[key];
                if (node) {
                    this.list.moveToFront(node);
                    return node.val;
                }
            },
            reset: function reset() {
                this.size = 0;
                this.hash = {};
                this.list = new List();
            }
        });
        function List() {
            this.head = this.tail = null;
        }
        _.mixin(List.prototype, {
            add: function add(node) {
                if (this.head) {
                    node.next = this.head;
                    this.head.prev = node;
                }
                this.head = node;
                this.tail = this.tail || node;
            },
            remove: function remove(node) {
                node.prev ? node.prev.next = node.next : this.head = node.next;
                node.next ? node.next.prev = node.prev : this.tail = node.prev;
            },
            moveToFront: function(node) {
                this.remove(node);
                this.add(node);
            }
        });
        function Node(key, val) {
            this.key = key;
            this.val = val;
            this.prev = this.next = null;
        }
        return LruCache;
    }();
    var PersistentStorage = function() {
        "use strict";
        var ls, methods;
        try {
            ls = window.localStorage;
            ls.setItem("~~~", "!");
            ls.removeItem("~~~");
        } catch (err) {
            ls = null;
        }
        function PersistentStorage(namespace) {
            this.prefix = [ "__", namespace, "__" ].join("");
            this.ttlKey = "__ttl__";
            this.keyMatcher = new RegExp("^" + _.escapeRegExChars(this.prefix));
        }
        if (ls && window.JSON) {
            methods = {
                _prefix: function(key) {
                    return this.prefix + key;
                },
                _ttlKey: function(key) {
                    return this._prefix(key) + this.ttlKey;
                },
                get: function(key) {
                    if (this.isExpired(key)) {
                        this.remove(key);
                    }
                    return decode(ls.getItem(this._prefix(key)));
                },
                set: function(key, val, ttl) {
                    if (_.isNumber(ttl)) {
                        ls.setItem(this._ttlKey(key), encode(now() + ttl));
                    } else {
                        ls.removeItem(this._ttlKey(key));
                    }
                    return ls.setItem(this._prefix(key), encode(val));
                },
                remove: function(key) {
                    ls.removeItem(this._ttlKey(key));
                    ls.removeItem(this._prefix(key));
                    return this;
                },
                clear: function() {
                    var i, key, keys = [], len = ls.length;
                    for (i = 0; i < len; i++) {
                        if ((key = ls.key(i)).match(this.keyMatcher)) {
                            keys.push(key.replace(this.keyMatcher, ""));
                        }
                    }
                    for (i = keys.length; i--; ) {
                        this.remove(keys[i]);
                    }
                    return this;
                },
                isExpired: function(key) {
                    var ttl = decode(ls.getItem(this._ttlKey(key)));
                    return _.isNumber(ttl) && now() > ttl ? true : false;
                }
            };
        } else {
            methods = {
                get: _.noop,
                set: _.noop,
                remove: _.noop,
                clear: _.noop,
                isExpired: _.noop
            };
        }
        _.mixin(PersistentStorage.prototype, methods);
        return PersistentStorage;
        function now() {
            return new Date().getTime();
        }
        function encode(val) {
            return JSON.stringify(_.isUndefined(val) ? null : val);
        }
        function decode(val) {
            return JSON.parse(val);
        }
    }();
    var Transport = function() {
        "use strict";
        var pendingRequestsCount = 0, pendingRequests = {}, maxPendingRequests = 6, sharedCache = new LruCache(10);
        function Transport(o) {
            o = o || {};
            this.cancelled = false;
            this.lastUrl = null;
            this._send = o.transport ? callbackToDeferred(o.transport) : $.ajax;
            this._get = o.rateLimiter ? o.rateLimiter(this._get) : this._get;
            this._cache = o.cache === false ? new LruCache(0) : sharedCache;
        }
        Transport.setMaxPendingRequests = function setMaxPendingRequests(num) {
            maxPendingRequests = num;
        };
        Transport.resetCache = function resetCache() {
            sharedCache.reset();
        };
        _.mixin(Transport.prototype, {
            _get: function(url, o, cb) {
                var that = this, jqXhr;
                if (this.cancelled || url !== this.lastUrl) {
                    return;
                }
                if (jqXhr = pendingRequests[url]) {
                    jqXhr.done(done).fail(fail);
                } else if (pendingRequestsCount < maxPendingRequests) {
                    pendingRequestsCount++;
                    pendingRequests[url] = this._send(url, o).done(done).fail(fail).always(always);
                } else {
                    this.onDeckRequestArgs = [].slice.call(arguments, 0);
                }
                function done(resp) {
                    cb && cb(null, resp);
                    that._cache.set(url, resp);
                }
                function fail() {
                    cb && cb(true);
                }
                function always() {
                    pendingRequestsCount--;
                    delete pendingRequests[url];
                    if (that.onDeckRequestArgs) {
                        that._get.apply(that, that.onDeckRequestArgs);
                        that.onDeckRequestArgs = null;
                    }
                }
            },
            get: function(url, o, cb) {
                var resp;
                if (_.isFunction(o)) {
                    cb = o;
                    o = {};
                }
                this.cancelled = false;
                this.lastUrl = url;
                if (resp = this._cache.get(url)) {
                    _.defer(function() {
                        cb && cb(null, resp);
                    });
                } else {
                    this._get(url, o, cb);
                }
                return !!resp;
            },
            cancel: function() {
                this.cancelled = true;
            }
        });
        return Transport;
        function callbackToDeferred(fn) {
            return function customSendWrapper(url, o) {
                var deferred = $.Deferred();
                fn(url, o, onSuccess, onError);
                return deferred;
                function onSuccess(resp) {
                    _.defer(function() {
                        deferred.resolve(resp);
                    });
                }
                function onError(err) {
                    _.defer(function() {
                        deferred.reject(err);
                    });
                }
            };
        }
    }();
    var SearchIndex = function() {
        "use strict";
        function SearchIndex(o) {
            o = o || {};
            if (!o.datumTokenizer || !o.queryTokenizer) {
                $.error("datumTokenizer and queryTokenizer are both required");
            }
            this.datumTokenizer = o.datumTokenizer;
            this.queryTokenizer = o.queryTokenizer;
            this.reset();
        }
        _.mixin(SearchIndex.prototype, {
            bootstrap: function bootstrap(o) {
                this.datums = o.datums;
                this.trie = o.trie;
            },
            add: function(data) {
                var that = this;
                data = _.isArray(data) ? data : [ data ];
                _.each(data, function(datum) {
                    var id, tokens;
                    id = that.datums.push(datum) - 1;
                    tokens = normalizeTokens(that.datumTokenizer(datum));
                    _.each(tokens, function(token) {
                        var node, chars, ch;
                        node = that.trie;
                        chars = token.split("");
                        while (ch = chars.shift()) {
                            node = node.children[ch] || (node.children[ch] = newNode());
                            node.ids.push(id);
                        }
                    });
                });
            },
            get: function get(query) {
                var that = this, tokens, matches;
                tokens = normalizeTokens(this.queryTokenizer(query));
                _.each(tokens, function(token) {
                    var node, chars, ch, ids;
                    if (matches && matches.length === 0) {
                        return false;
                    }
                    node = that.trie;
                    chars = token.split("");
                    while (node && (ch = chars.shift())) {
                        node = node.children[ch];
                    }
                    if (node && chars.length === 0) {
                        ids = node.ids.slice(0);
                        matches = matches ? getIntersection(matches, ids) : ids;
                    } else {
                        matches = [];
                        return false;
                    }
                });
                return matches ? _.map(unique(matches), function(id) {
                    return that.datums[id];
                }) : [];
            },
            reset: function reset() {
                this.datums = [];
                this.trie = newNode();
            },
            serialize: function serialize() {
                return {
                    datums: this.datums,
                    trie: this.trie
                };
            }
        });
        return SearchIndex;
        function normalizeTokens(tokens) {
            tokens = _.filter(tokens, function(token) {
                return !!token;
            });
            tokens = _.map(tokens, function(token) {
                return token.toLowerCase();
            });
            return tokens;
        }
        function newNode() {
            return {
                ids: [],
                children: {}
            };
        }
        function unique(array) {
            var seen = {}, uniques = [];
            for (var i = 0, len = array.length; i < len; i++) {
                if (!seen[array[i]]) {
                    seen[array[i]] = true;
                    uniques.push(array[i]);
                }
            }
            return uniques;
        }
        function getIntersection(arrayA, arrayB) {
            var ai = 0, bi = 0, intersection = [];
            arrayA = arrayA.sort(compare);
            arrayB = arrayB.sort(compare);
            var lenArrayA = arrayA.length, lenArrayB = arrayB.length;
            while (ai < lenArrayA && bi < lenArrayB) {
                if (arrayA[ai] < arrayB[bi]) {
                    ai++;
                } else if (arrayA[ai] > arrayB[bi]) {
                    bi++;
                } else {
                    intersection.push(arrayA[ai]);
                    ai++;
                    bi++;
                }
            }
            return intersection;
            function compare(a, b) {
                return a - b;
            }
        }
    }();
    var oParser = function() {
        "use strict";
        return {
            local: getLocal,
            prefetch: getPrefetch,
            remote: getRemote
        };
        function getLocal(o) {
            return o.local || null;
        }
        function getPrefetch(o) {
            var prefetch, defaults;
            defaults = {
                url: null,
                thumbprint: "",
                ttl: 24 * 60 * 60 * 1e3,
                filter: null,
                ajax: {}
            };
            if (prefetch = o.prefetch || null) {
                prefetch = _.isString(prefetch) ? {
                    url: prefetch
                } : prefetch;
                prefetch = _.mixin(defaults, prefetch);
                prefetch.thumbprint = VERSION + prefetch.thumbprint;
                prefetch.ajax.type = prefetch.ajax.type || "GET";
                prefetch.ajax.dataType = prefetch.ajax.dataType || "json";
                !prefetch.url && $.error("prefetch requires url to be set");
            }
            return prefetch;
        }
        function getRemote(o) {
            var remote, defaults;
            defaults = {
                url: null,
                cache: true,
                wildcard: "%QUERY",
                replace: null,
                rateLimitBy: "debounce",
                rateLimitWait: 300,
                send: null,
                filter: null,
                ajax: {}
            };
            if (remote = o.remote || null) {
                remote = _.isString(remote) ? {
                    url: remote
                } : remote;
                remote = _.mixin(defaults, remote);
                remote.rateLimiter = /^throttle$/i.test(remote.rateLimitBy) ? byThrottle(remote.rateLimitWait) : byDebounce(remote.rateLimitWait);
                remote.ajax.type = remote.ajax.type || "GET";
                remote.ajax.dataType = remote.ajax.dataType || "json";
                delete remote.rateLimitBy;
                delete remote.rateLimitWait;
                !remote.url && $.error("remote requires url to be set");
            }
            return remote;
            function byDebounce(wait) {
                return function(fn) {
                    return _.debounce(fn, wait);
                };
            }
            function byThrottle(wait) {
                return function(fn) {
                    return _.throttle(fn, wait);
                };
            }
        }
    }();
    (function(root) {
        "use strict";
        var old, keys;
        old = root.Bloodhound;
        keys = {
            data: "data",
            protocol: "protocol",
            thumbprint: "thumbprint"
        };
        root.Bloodhound = Bloodhound;
        function Bloodhound(o) {
            if (!o || !o.local && !o.prefetch && !o.remote) {
                $.error("one of local, prefetch, or remote is required");
            }
            this.limit = o.limit || 5;
            this.sorter = getSorter(o.sorter);
            this.dupDetector = o.dupDetector || ignoreDuplicates;
            this.local = oParser.local(o);
            this.prefetch = oParser.prefetch(o);
            this.remote = oParser.remote(o);
            this.cacheKey = this.prefetch ? this.prefetch.cacheKey || this.prefetch.url : null;
            this.index = new SearchIndex({
                datumTokenizer: o.datumTokenizer,
                queryTokenizer: o.queryTokenizer
            });
            this.storage = this.cacheKey ? new PersistentStorage(this.cacheKey) : null;
        }
        Bloodhound.noConflict = function noConflict() {
            root.Bloodhound = old;
            return Bloodhound;
        };
        Bloodhound.tokenizers = tokenizers;
        _.mixin(Bloodhound.prototype, {
            _loadPrefetch: function loadPrefetch(o) {
                var that = this, serialized, deferred;
                if (serialized = this._readFromStorage(o.thumbprint)) {
                    this.index.bootstrap(serialized);
                    deferred = $.Deferred().resolve();
                } else {
                    deferred = $.ajax(o.url, o.ajax).done(handlePrefetchResponse);
                }
                return deferred;
                function handlePrefetchResponse(resp) {
                    that.clear();
                    that.add(o.filter ? o.filter(resp) : resp);
                    that._saveToStorage(that.index.serialize(), o.thumbprint, o.ttl);
                }
            },
            _getFromRemote: function getFromRemote(query, cb) {
                var that = this, url, uriEncodedQuery;
                if (!this.transport) {
                    return;
                }
                query = query || "";
                uriEncodedQuery = encodeURIComponent(query);
                url = this.remote.replace ? this.remote.replace(this.remote.url, query) : this.remote.url.replace(this.remote.wildcard, uriEncodedQuery);
                return this.transport.get(url, this.remote.ajax, handleRemoteResponse);
                function handleRemoteResponse(err, resp) {
                    err ? cb([]) : cb(that.remote.filter ? that.remote.filter(resp) : resp);
                }
            },
            _cancelLastRemoteRequest: function cancelLastRemoteRequest() {
                this.transport && this.transport.cancel();
            },
            _saveToStorage: function saveToStorage(data, thumbprint, ttl) {
                if (this.storage) {
                    this.storage.set(keys.data, data, ttl);
                    this.storage.set(keys.protocol, location.protocol, ttl);
                    this.storage.set(keys.thumbprint, thumbprint, ttl);
                }
            },
            _readFromStorage: function readFromStorage(thumbprint) {
                var stored = {}, isExpired;
                if (this.storage) {
                    stored.data = this.storage.get(keys.data);
                    stored.protocol = this.storage.get(keys.protocol);
                    stored.thumbprint = this.storage.get(keys.thumbprint);
                }
                isExpired = stored.thumbprint !== thumbprint || stored.protocol !== location.protocol;
                return stored.data && !isExpired ? stored.data : null;
            },
            _initialize: function initialize() {
                var that = this, local = this.local, deferred;
                deferred = this.prefetch ? this._loadPrefetch(this.prefetch) : $.Deferred().resolve();
                local && deferred.done(addLocalToIndex);
                this.transport = this.remote ? new Transport(this.remote) : null;
                return this.initPromise = deferred.promise();
                function addLocalToIndex() {
                    that.add(_.isFunction(local) ? local() : local);
                }
            },
            initialize: function initialize(force) {
                return !this.initPromise || force ? this._initialize() : this.initPromise;
            },
            add: function add(data) {
                this.index.add(data);
            },
            get: function get(query, cb) {
                var that = this, matches = [], cacheHit = false;
                matches = this.index.get(query);
                matches = this.sorter(matches).slice(0, this.limit);
                matches.length < this.limit ? cacheHit = this._getFromRemote(query, returnRemoteMatches) : this._cancelLastRemoteRequest();
                if (!cacheHit) {
                    (matches.length > 0 || !this.transport) && cb && cb(matches);
                }
                function returnRemoteMatches(remoteMatches) {
                    var matchesWithBackfill = matches.slice(0);
                    _.each(remoteMatches, function(remoteMatch) {
                        var isDuplicate;
                        isDuplicate = _.some(matchesWithBackfill, function(match) {
                            return that.dupDetector(remoteMatch, match);
                        });
                        !isDuplicate && matchesWithBackfill.push(remoteMatch);
                        return matchesWithBackfill.length < that.limit;
                    });
                    cb && cb(that.sorter(matchesWithBackfill));
                }
            },
            clear: function clear() {
                this.index.reset();
            },
            clearPrefetchCache: function clearPrefetchCache() {
                this.storage && this.storage.clear();
            },
            clearRemoteCache: function clearRemoteCache() {
                this.transport && Transport.resetCache();
            },
            ttAdapter: function ttAdapter() {
                return _.bind(this.get, this);
            }
        });
        return Bloodhound;
        function getSorter(sortFn) {
            return _.isFunction(sortFn) ? sort : noSort;
            function sort(array) {
                return array.sort(sortFn);
            }
            function noSort(array) {
                return array;
            }
        }
        function ignoreDuplicates() {
            return false;
        }
    })(this);
    var html = function() {
        return {
            wrapper: '<span class="twitter-typeahead"></span>',
            dropdown: '<span class="tt-dropdown-menu"></span>',
            dataset: '<div class="tt-dataset-%CLASS%"></div>',
            suggestions: '<span class="tt-suggestions"></span>',
            suggestion: '<div class="tt-suggestion"></div>'
        };
    }();
    var css = function() {
        "use strict";
        var css = {
            wrapper: {
                position: "relative",
                display: "inline-block"
            },
            hint: {
                position: "absolute",
                top: "0",
                left: "0",
                borderColor: "transparent",
                boxShadow: "none",
                opacity: "1"
            },
            input: {
                position: "relative",
                verticalAlign: "top",
                backgroundColor: "transparent"
            },
            inputWithNoHint: {
                position: "relative",
                verticalAlign: "top"
            },
            dropdown: {
                position: "absolute",
                top: "100%",
                left: "0",
                zIndex: "100",
                display: "none"
            },
            suggestions: {
                display: "block"
            },
            suggestion: {
                whiteSpace: "nowrap",
                cursor: "pointer"
            },
            suggestionChild: {
                whiteSpace: "normal"
            },
            ltr: {
                left: "0",
                right: "auto"
            },
            rtl: {
                left: "auto",
                right: " 0"
            }
        };
        if (_.isMsie()) {
            _.mixin(css.input, {
                backgroundImage: "url(data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)"
            });
        }
        if (_.isMsie() && _.isMsie() <= 7) {
            _.mixin(css.input, {
                marginTop: "-1px"
            });
        }
        return css;
    }();
    var EventBus = function() {
        "use strict";
        var namespace = "typeahead:";
        function EventBus(o) {
            if (!o || !o.el) {
                $.error("EventBus initialized without el");
            }
            this.$el = $(o.el);
        }
        _.mixin(EventBus.prototype, {
            trigger: function(type) {
                var args = [].slice.call(arguments, 1);
                this.$el.trigger(namespace + type, args);
            }
        });
        return EventBus;
    }();
    var EventEmitter = function() {
        "use strict";
        var splitter = /\s+/, nextTick = getNextTick();
        return {
            onSync: onSync,
            onAsync: onAsync,
            off: off,
            trigger: trigger
        };
        function on(method, types, cb, context) {
            var type;
            if (!cb) {
                return this;
            }
            types = types.split(splitter);
            cb = context ? bindContext(cb, context) : cb;
            this._callbacks = this._callbacks || {};
            while (type = types.shift()) {
                this._callbacks[type] = this._callbacks[type] || {
                    sync: [],
                    async: []
                };
                this._callbacks[type][method].push(cb);
            }
            return this;
        }
        function onAsync(types, cb, context) {
            return on.call(this, "async", types, cb, context);
        }
        function onSync(types, cb, context) {
            return on.call(this, "sync", types, cb, context);
        }
        function off(types) {
            var type;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            while (type = types.shift()) {
                delete this._callbacks[type];
            }
            return this;
        }
        function trigger(types) {
            var type, callbacks, args, syncFlush, asyncFlush;
            if (!this._callbacks) {
                return this;
            }
            types = types.split(splitter);
            args = [].slice.call(arguments, 1);
            while ((type = types.shift()) && (callbacks = this._callbacks[type])) {
                syncFlush = getFlush(callbacks.sync, this, [ type ].concat(args));
                asyncFlush = getFlush(callbacks.async, this, [ type ].concat(args));
                syncFlush() && nextTick(asyncFlush);
            }
            return this;
        }
        function getFlush(callbacks, context, args) {
            return flush;
            function flush() {
                var cancelled;
                for (var i = 0, len = callbacks.length; !cancelled && i < len; i += 1) {
                    cancelled = callbacks[i].apply(context, args) === false;
                }
                return !cancelled;
            }
        }
        function getNextTick() {
            var nextTickFn;
            if (window.setImmediate) {
                nextTickFn = function nextTickSetImmediate(fn) {
                    setImmediate(function() {
                        fn();
                    });
                };
            } else {
                nextTickFn = function nextTickSetTimeout(fn) {
                    setTimeout(function() {
                        fn();
                    }, 0);
                };
            }
            return nextTickFn;
        }
        function bindContext(fn, context) {
            return fn.bind ? fn.bind(context) : function() {
                fn.apply(context, [].slice.call(arguments, 0));
            };
        }
    }();
    var highlight = function(doc) {
        "use strict";
        var defaults = {
            node: null,
            pattern: null,
            tagName: "strong",
            className: null,
            wordsOnly: false,
            caseSensitive: false
        };
        return function hightlight(o) {
            var regex;
            o = _.mixin({}, defaults, o);
            if (!o.node || !o.pattern) {
                return;
            }
            o.pattern = _.isArray(o.pattern) ? o.pattern : [ o.pattern ];
            regex = getRegex(o.pattern, o.caseSensitive, o.wordsOnly);
            traverse(o.node, hightlightTextNode);
            function hightlightTextNode(textNode) {
                var match, patternNode, wrapperNode;
                if (match = regex.exec(textNode.data)) {
                    wrapperNode = doc.createElement(o.tagName);
                    o.className && (wrapperNode.className = o.className);
                    patternNode = textNode.splitText(match.index);
                    patternNode.splitText(match[0].length);
                    wrapperNode.appendChild(patternNode.cloneNode(true));
                    textNode.parentNode.replaceChild(wrapperNode, patternNode);
                }
                return !!match;
            }
            function traverse(el, hightlightTextNode) {
                var childNode, TEXT_NODE_TYPE = 3;
                for (var i = 0; i < el.childNodes.length; i++) {
                    childNode = el.childNodes[i];
                    if (childNode.nodeType === TEXT_NODE_TYPE) {
                        i += hightlightTextNode(childNode) ? 1 : 0;
                    } else {
                        traverse(childNode, hightlightTextNode);
                    }
                }
            }
        };
        function getRegex(patterns, caseSensitive, wordsOnly) {
            var escapedPatterns = [], regexStr;
            for (var i = 0, len = patterns.length; i < len; i++) {
                escapedPatterns.push(_.escapeRegExChars(patterns[i]));
            }
            regexStr = wordsOnly ? "\\b(" + escapedPatterns.join("|") + ")\\b" : "(" + escapedPatterns.join("|") + ")";
            return caseSensitive ? new RegExp(regexStr) : new RegExp(regexStr, "i");
        }
    }(window.document);
    var Input = function() {
        "use strict";
        var specialKeyCodeMap;
        specialKeyCodeMap = {
            9: "tab",
            27: "esc",
            37: "left",
            39: "right",
            13: "enter",
            38: "up",
            40: "down"
        };
        function Input(o) {
            var that = this, onBlur, onFocus, onKeydown, onInput;
            o = o || {};
            if (!o.input) {
                $.error("input is missing");
            }
            onBlur = _.bind(this._onBlur, this);
            onFocus = _.bind(this._onFocus, this);
            onKeydown = _.bind(this._onKeydown, this);
            onInput = _.bind(this._onInput, this);
            this.$hint = $(o.hint);
            this.$input = $(o.input).on("blur.tt", onBlur).on("focus.tt", onFocus).on("keydown.tt", onKeydown);
            if (this.$hint.length === 0) {
                this.setHint = this.getHint = this.clearHint = this.clearHintIfInvalid = _.noop;
            }
            if (!_.isMsie()) {
                this.$input.on("input.tt", onInput);
            } else {
                this.$input.on("keydown.tt keypress.tt cut.tt paste.tt", function($e) {
                    if (specialKeyCodeMap[$e.which || $e.keyCode]) {
                        return;
                    }
                    _.defer(_.bind(that._onInput, that, $e));
                });
            }
            this.query = this.$input.val();
            this.$overflowHelper = buildOverflowHelper(this.$input);
        }
        Input.normalizeQuery = function(str) {
            return (str || "").replace(/^\s*/g, "").replace(/\s{2,}/g, " ");
        };
        _.mixin(Input.prototype, EventEmitter, {
            _onBlur: function onBlur() {
                this.resetInputValue();
                this.trigger("blurred");
            },
            _onFocus: function onFocus() {
                this.trigger("focused");
            },
            _onKeydown: function onKeydown($e) {
                var keyName = specialKeyCodeMap[$e.which || $e.keyCode];
                this._managePreventDefault(keyName, $e);
                if (keyName && this._shouldTrigger(keyName, $e)) {
                    this.trigger(keyName + "Keyed", $e);
                }
            },
            _onInput: function onInput() {
                this._checkInputValue();
            },
            _managePreventDefault: function managePreventDefault(keyName, $e) {
                var preventDefault, hintValue, inputValue;
                switch (keyName) {
                  case "tab":
                    hintValue = this.getHint();
                    inputValue = this.getInputValue();
                    preventDefault = hintValue && hintValue !== inputValue && !withModifier($e);
                    break;

                  case "up":
                  case "down":
                    preventDefault = !withModifier($e);
                    break;

                  default:
                    preventDefault = false;
                }
                preventDefault && $e.preventDefault();
            },
            _shouldTrigger: function shouldTrigger(keyName, $e) {
                var trigger;
                switch (keyName) {
                  case "tab":
                    trigger = !withModifier($e);
                    break;

                  default:
                    trigger = true;
                }
                return trigger;
            },
            _checkInputValue: function checkInputValue() {
                var inputValue, areEquivalent, hasDifferentWhitespace;
                inputValue = this.getInputValue();
                areEquivalent = areQueriesEquivalent(inputValue, this.query);
                hasDifferentWhitespace = areEquivalent ? this.query.length !== inputValue.length : false;
                this.query = inputValue;
                if (!areEquivalent) {
                    this.trigger("queryChanged", this.query);
                } else if (hasDifferentWhitespace) {
                    this.trigger("whitespaceChanged", this.query);
                }
            },
            focus: function focus() {
                this.$input.focus();
            },
            blur: function blur() {
                this.$input.blur();
            },
            getQuery: function getQuery() {
                return this.query;
            },
            setQuery: function setQuery(query) {
                this.query = query;
            },
            getInputValue: function getInputValue() {
                return this.$input.val();
            },
            setInputValue: function setInputValue(value, silent) {
                this.$input.val(value);
                silent ? this.clearHint() : this._checkInputValue();
            },
            resetInputValue: function resetInputValue() {
                this.setInputValue(this.query, true);
            },
            getHint: function getHint() {
                return this.$hint.val();
            },
            setHint: function setHint(value) {
                this.$hint.val(value);
            },
            clearHint: function clearHint() {
                this.setHint("");
            },
            clearHintIfInvalid: function clearHintIfInvalid() {
                var val, hint, valIsPrefixOfHint, isValid;
                val = this.getInputValue();
                hint = this.getHint();
                valIsPrefixOfHint = val !== hint && hint.indexOf(val) === 0;
                isValid = val !== "" && valIsPrefixOfHint && !this.hasOverflow();
                !isValid && this.clearHint();
            },
            getLanguageDirection: function getLanguageDirection() {
                return (this.$input.css("direction") || "ltr").toLowerCase();
            },
            hasOverflow: function hasOverflow() {
                var constraint = this.$input.width() - 2;
                this.$overflowHelper.text(this.getInputValue());
                return this.$overflowHelper.width() >= constraint;
            },
            isCursorAtEnd: function() {
                var valueLength, selectionStart, range;
                valueLength = this.$input.val().length;
                selectionStart = this.$input[0].selectionStart;
                if (_.isNumber(selectionStart)) {
                    return selectionStart === valueLength;
                } else if (document.selection) {
                    range = document.selection.createRange();
                    range.moveStart("character", -valueLength);
                    return valueLength === range.text.length;
                }
                return true;
            },
            destroy: function destroy() {
                this.$hint.off(".tt");
                this.$input.off(".tt");
                this.$hint = this.$input = this.$overflowHelper = null;
            }
        });
        return Input;
        function buildOverflowHelper($input) {
            return $('<pre aria-hidden="true"></pre>').css({
                position: "absolute",
                visibility: "hidden",
                whiteSpace: "pre",
                fontFamily: $input.css("font-family"),
                fontSize: $input.css("font-size"),
                fontStyle: $input.css("font-style"),
                fontVariant: $input.css("font-variant"),
                fontWeight: $input.css("font-weight"),
                wordSpacing: $input.css("word-spacing"),
                letterSpacing: $input.css("letter-spacing"),
                textIndent: $input.css("text-indent"),
                textRendering: $input.css("text-rendering"),
                textTransform: $input.css("text-transform")
            }).insertAfter($input);
        }
        function areQueriesEquivalent(a, b) {
            return Input.normalizeQuery(a) === Input.normalizeQuery(b);
        }
        function withModifier($e) {
            return $e.altKey || $e.ctrlKey || $e.metaKey || $e.shiftKey;
        }
    }();
    var Dataset = function() {
        "use strict";
        var datasetKey = "ttDataset", valueKey = "ttValue", datumKey = "ttDatum";
        function Dataset(o) {
            o = o || {};
            o.templates = o.templates || {};
            if (!o.source) {
                $.error("missing source");
            }
            if (o.name && !isValidName(o.name)) {
                $.error("invalid dataset name: " + o.name);
            }
            this.query = null;
            this.highlight = !!o.highlight;
            this.name = o.name || _.getUniqueId();
            this.source = o.source;
            this.displayFn = getDisplayFn(o.display || o.displayKey);
            this.templates = getTemplates(o.templates, this.displayFn);
            this.$el = $(html.dataset.replace("%CLASS%", this.name));
        }
        Dataset.extractDatasetName = function extractDatasetName(el) {
            return $(el).data(datasetKey);
        };
        Dataset.extractValue = function extractDatum(el) {
            return $(el).data(valueKey);
        };
        Dataset.extractDatum = function extractDatum(el) {
            return $(el).data(datumKey);
        };
        _.mixin(Dataset.prototype, EventEmitter, {
            _render: function render(query, suggestions) {
                if (!this.$el) {
                    return;
                }
                var that = this, hasSuggestions;
                this.$el.empty();
                hasSuggestions = suggestions && suggestions.length;
                if (!hasSuggestions && this.templates.empty) {
                    this.$el.html(getEmptyHtml()).prepend(that.templates.header ? getHeaderHtml() : null).append(that.templates.footer ? getFooterHtml() : null);
                } else if (hasSuggestions) {
                    this.$el.html(getSuggestionsHtml()).prepend(that.templates.header ? getHeaderHtml() : null).append(that.templates.footer ? getFooterHtml() : null);
                }
                this.trigger("rendered");
                function getEmptyHtml() {
                    return that.templates.empty({
                        query: query,
                        isEmpty: true
                    });
                }
                function getSuggestionsHtml() {
                    var $suggestions, nodes;
                    $suggestions = $(html.suggestions).css(css.suggestions);
                    nodes = _.map(suggestions, getSuggestionNode);
                    $suggestions.append.apply($suggestions, nodes);
                    that.highlight && highlight({
                        className: "tt-highlight",
                        node: $suggestions[0],
                        pattern: query
                    });
                    return $suggestions;
                    function getSuggestionNode(suggestion) {
                        var $el;
                        $el = $(html.suggestion).append(that.templates.suggestion(suggestion)).data(datasetKey, that.name).data(valueKey, that.displayFn(suggestion)).data(datumKey, suggestion);
                        $el.children().each(function() {
                            $(this).css(css.suggestionChild);
                        });
                        return $el;
                    }
                }
                function getHeaderHtml() {
                    return that.templates.header({
                        query: query,
                        isEmpty: !hasSuggestions
                    });
                }
                function getFooterHtml() {
                    return that.templates.footer({
                        query: query,
                        isEmpty: !hasSuggestions
                    });
                }
            },
            getRoot: function getRoot() {
                return this.$el;
            },
            update: function update(query) {
                var that = this;
                this.query = query;
                this.canceled = false;
                this.source(query, render);
                function render(suggestions) {
                    if (!that.canceled && query === that.query) {
                        that._render(query, suggestions);
                    }
                }
            },
            cancel: function cancel() {
                this.canceled = true;
            },
            clear: function clear() {
                this.cancel();
                this.$el.empty();
                this.trigger("rendered");
            },
            isEmpty: function isEmpty() {
                return this.$el.is(":empty");
            },
            destroy: function destroy() {
                this.$el = null;
            }
        });
        return Dataset;
        function getDisplayFn(display) {
            display = display || "value";
            return _.isFunction(display) ? display : displayFn;
            function displayFn(obj) {
                return obj[display];
            }
        }
        function getTemplates(templates, displayFn) {
            return {
                empty: templates.empty && _.templatify(templates.empty),
                header: templates.header && _.templatify(templates.header),
                footer: templates.footer && _.templatify(templates.footer),
                suggestion: templates.suggestion || suggestionTemplate
            };
            function suggestionTemplate(context) {
                return "<p>" + displayFn(context) + "</p>";
            }
        }
        function isValidName(str) {
            return /^[_a-zA-Z0-9-]+$/.test(str);
        }
    }();
    var Dropdown = function() {
        "use strict";
        function Dropdown(o) {
            var that = this, onSuggestionClick, onSuggestionMouseEnter, onSuggestionMouseLeave;
            o = o || {};
            if (!o.menu) {
                $.error("menu is required");
            }
            this.isOpen = false;
            this.isEmpty = true;
            this.datasets = _.map(o.datasets, initializeDataset);
            onSuggestionClick = _.bind(this._onSuggestionClick, this);
            onSuggestionMouseEnter = _.bind(this._onSuggestionMouseEnter, this);
            onSuggestionMouseLeave = _.bind(this._onSuggestionMouseLeave, this);
            this.$menu = $(o.menu).on("click.tt", ".tt-suggestion", onSuggestionClick).on("mouseenter.tt", ".tt-suggestion", onSuggestionMouseEnter).on("mouseleave.tt", ".tt-suggestion", onSuggestionMouseLeave);
            _.each(this.datasets, function(dataset) {
                that.$menu.append(dataset.getRoot());
                dataset.onSync("rendered", that._onRendered, that);
            });
        }
        _.mixin(Dropdown.prototype, EventEmitter, {
            _onSuggestionClick: function onSuggestionClick($e) {
                this.trigger("suggestionClicked", $($e.currentTarget));
            },
            _onSuggestionMouseEnter: function onSuggestionMouseEnter($e) {
                this._removeCursor();
                this._setCursor($($e.currentTarget), true);
            },
            _onSuggestionMouseLeave: function onSuggestionMouseLeave() {
                this._removeCursor();
            },
            _onRendered: function onRendered() {
                this.isEmpty = _.every(this.datasets, isDatasetEmpty);
                this.isEmpty ? this._hide() : this.isOpen && this._show();
                this.trigger("datasetRendered");
                function isDatasetEmpty(dataset) {
                    return dataset.isEmpty();
                }
            },
            _hide: function() {
                this.$menu.hide();
            },
            _show: function() {
                this.$menu.css("display", "block");
            },
            _getSuggestions: function getSuggestions() {
                return this.$menu.find(".tt-suggestion");
            },
            _getCursor: function getCursor() {
                return this.$menu.find(".tt-cursor").first();
            },
            _setCursor: function setCursor($el, silent) {
                $el.first().addClass("tt-cursor");
                !silent && this.trigger("cursorMoved");
            },
            _removeCursor: function removeCursor() {
                this._getCursor().removeClass("tt-cursor");
            },
            _moveCursor: function moveCursor(increment) {
                var $suggestions, $oldCursor, newCursorIndex, $newCursor;
                if (!this.isOpen) {
                    return;
                }
                $oldCursor = this._getCursor();
                $suggestions = this._getSuggestions();
                this._removeCursor();
                newCursorIndex = $suggestions.index($oldCursor) + increment;
                newCursorIndex = (newCursorIndex + 1) % ($suggestions.length + 1) - 1;
                if (newCursorIndex === -1) {
                    this.trigger("cursorRemoved");
                    return;
                } else if (newCursorIndex < -1) {
                    newCursorIndex = $suggestions.length - 1;
                }
                this._setCursor($newCursor = $suggestions.eq(newCursorIndex));
                this._ensureVisible($newCursor);
            },
            _ensureVisible: function ensureVisible($el) {
                var elTop, elBottom, menuScrollTop, menuHeight;
                elTop = $el.position().top;
                elBottom = elTop + $el.outerHeight(true);
                menuScrollTop = this.$menu.scrollTop();
                menuHeight = this.$menu.height() + parseInt(this.$menu.css("paddingTop"), 10) + parseInt(this.$menu.css("paddingBottom"), 10);
                if (elTop < 0) {
                    this.$menu.scrollTop(menuScrollTop + elTop);
                } else if (menuHeight < elBottom) {
                    this.$menu.scrollTop(menuScrollTop + (elBottom - menuHeight));
                }
            },
            close: function close() {
                if (this.isOpen) {
                    this.isOpen = false;
                    this._removeCursor();
                    this._hide();
                    this.trigger("closed");
                }
            },
            open: function open() {
                if (!this.isOpen) {
                    this.isOpen = true;
                    !this.isEmpty && this._show();
                    this.trigger("opened");
                }
            },
            setLanguageDirection: function setLanguageDirection(dir) {
                this.$menu.css(dir === "ltr" ? css.ltr : css.rtl);
            },
            moveCursorUp: function moveCursorUp() {
                this._moveCursor(-1);
            },
            moveCursorDown: function moveCursorDown() {
                this._moveCursor(+1);
            },
            getDatumForSuggestion: function getDatumForSuggestion($el) {
                var datum = null;
                if ($el.length) {
                    datum = {
                        raw: Dataset.extractDatum($el),
                        value: Dataset.extractValue($el),
                        datasetName: Dataset.extractDatasetName($el)
                    };
                }
                return datum;
            },
            getDatumForCursor: function getDatumForCursor() {
                return this.getDatumForSuggestion(this._getCursor().first());
            },
            getDatumForTopSuggestion: function getDatumForTopSuggestion() {
                return this.getDatumForSuggestion(this._getSuggestions().first());
            },
            update: function update(query) {
                _.each(this.datasets, updateDataset);
                function updateDataset(dataset) {
                    dataset.update(query);
                }
            },
            empty: function empty() {
                _.each(this.datasets, clearDataset);
                this.isEmpty = true;
                function clearDataset(dataset) {
                    dataset.clear();
                }
            },
            isVisible: function isVisible() {
                return this.isOpen && !this.isEmpty;
            },
            destroy: function destroy() {
                this.$menu.off(".tt");
                this.$menu = null;
                _.each(this.datasets, destroyDataset);
                function destroyDataset(dataset) {
                    dataset.destroy();
                }
            }
        });
        return Dropdown;
        function initializeDataset(oDataset) {
            return new Dataset(oDataset);
        }
    }();
    var Typeahead = function() {
        "use strict";
        var attrsKey = "ttAttrs";
        function Typeahead(o) {
            var $menu, $input, $hint;
            o = o || {};
            if (!o.input) {
                $.error("missing input");
            }
            this.isActivated = false;
            this.autoselect = !!o.autoselect;
            this.minLength = _.isNumber(o.minLength) ? o.minLength : 1;
            this.$node = buildDom(o.input, o.withHint);
            $menu = this.$node.find(".tt-dropdown-menu");
            $input = this.$node.find(".tt-input");
            $hint = this.$node.find(".tt-hint");
            $input.on("blur.tt", function($e) {
                var active, isActive, hasActive;
                active = document.activeElement;
                isActive = $menu.is(active);
                hasActive = $menu.has(active).length > 0;
                if (_.isMsie() && (isActive || hasActive)) {
                    $e.preventDefault();
                    $e.stopImmediatePropagation();
                    _.defer(function() {
                        $input.focus();
                    });
                }
            });
            $menu.on("mousedown.tt", function($e) {
                $e.preventDefault();
            });
            this.eventBus = o.eventBus || new EventBus({
                el: $input
            });
            this.dropdown = new Dropdown({
                menu: $menu,
                datasets: o.datasets
            }).onSync("suggestionClicked", this._onSuggestionClicked, this).onSync("cursorMoved", this._onCursorMoved, this).onSync("cursorRemoved", this._onCursorRemoved, this).onSync("opened", this._onOpened, this).onSync("closed", this._onClosed, this).onAsync("datasetRendered", this._onDatasetRendered, this);
            this.input = new Input({
                input: $input,
                hint: $hint
            }).onSync("focused", this._onFocused, this).onSync("blurred", this._onBlurred, this).onSync("enterKeyed", this._onEnterKeyed, this).onSync("tabKeyed", this._onTabKeyed, this).onSync("escKeyed", this._onEscKeyed, this).onSync("upKeyed", this._onUpKeyed, this).onSync("downKeyed", this._onDownKeyed, this).onSync("leftKeyed", this._onLeftKeyed, this).onSync("rightKeyed", this._onRightKeyed, this).onSync("queryChanged", this._onQueryChanged, this).onSync("whitespaceChanged", this._onWhitespaceChanged, this);
            this._setLanguageDirection();
        }
        _.mixin(Typeahead.prototype, {
            _onSuggestionClicked: function onSuggestionClicked(type, $el) {
                var datum;
                if (datum = this.dropdown.getDatumForSuggestion($el)) {
                    this._select(datum);
                }
            },
            _onCursorMoved: function onCursorMoved() {
                var datum = this.dropdown.getDatumForCursor();
                this.input.setInputValue(datum.value, true);
                this.eventBus.trigger("cursorchanged", datum.raw, datum.datasetName);
            },
            _onCursorRemoved: function onCursorRemoved() {
                this.input.resetInputValue();
                this._updateHint();
            },
            _onDatasetRendered: function onDatasetRendered() {
                this._updateHint();
            },
            _onOpened: function onOpened() {
                this._updateHint();
                this.eventBus.trigger("opened");
            },
            _onClosed: function onClosed() {
                this.input.clearHint();
                this.eventBus.trigger("closed");
            },
            _onFocused: function onFocused() {
                this.isActivated = true;
                this.dropdown.open();
            },
            _onBlurred: function onBlurred() {
                this.isActivated = false;
                this.dropdown.empty();
                this.dropdown.close();
            },
            _onEnterKeyed: function onEnterKeyed(type, $e) {
                var cursorDatum, topSuggestionDatum;
                cursorDatum = this.dropdown.getDatumForCursor();
                topSuggestionDatum = this.dropdown.getDatumForTopSuggestion();
                if (cursorDatum) {
                    this._select(cursorDatum);
                    $e.preventDefault();
                } else if (this.autoselect && topSuggestionDatum) {
                    this._select(topSuggestionDatum);
                    $e.preventDefault();
                }
            },
            _onTabKeyed: function onTabKeyed(type, $e) {
                var datum;
                if (datum = this.dropdown.getDatumForCursor()) {
                    this._select(datum);
                    $e.preventDefault();
                } else {
                    this._autocomplete(true);
                }
            },
            _onEscKeyed: function onEscKeyed() {
                this.dropdown.close();
                this.input.resetInputValue();
            },
            _onUpKeyed: function onUpKeyed() {
                var query = this.input.getQuery();
                this.dropdown.isEmpty && query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.moveCursorUp();
                this.dropdown.open();
            },
            _onDownKeyed: function onDownKeyed() {
                var query = this.input.getQuery();
                this.dropdown.isEmpty && query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.moveCursorDown();
                this.dropdown.open();
            },
            _onLeftKeyed: function onLeftKeyed() {
                this.dir === "rtl" && this._autocomplete();
            },
            _onRightKeyed: function onRightKeyed() {
                this.dir === "ltr" && this._autocomplete();
            },
            _onQueryChanged: function onQueryChanged(e, query) {
                this.input.clearHintIfInvalid();
                query.length >= this.minLength ? this.dropdown.update(query) : this.dropdown.empty();
                this.dropdown.open();
                this._setLanguageDirection();
            },
            _onWhitespaceChanged: function onWhitespaceChanged() {
                this._updateHint();
                this.dropdown.open();
            },
            _setLanguageDirection: function setLanguageDirection() {
                var dir;
                if (this.dir !== (dir = this.input.getLanguageDirection())) {
                    this.dir = dir;
                    this.$node.css("direction", dir);
                    this.dropdown.setLanguageDirection(dir);
                }
            },
            _updateHint: function updateHint() {
                var datum, val, query, escapedQuery, frontMatchRegEx, match;
                datum = this.dropdown.getDatumForTopSuggestion();
                if (datum && this.dropdown.isVisible() && !this.input.hasOverflow()) {
                    val = this.input.getInputValue();
                    query = Input.normalizeQuery(val);
                    escapedQuery = _.escapeRegExChars(query);
                    frontMatchRegEx = new RegExp("^(?:" + escapedQuery + ")(.+$)", "i");
                    match = frontMatchRegEx.exec(datum.value);
                    match ? this.input.setHint(val + match[1]) : this.input.clearHint();
                } else {
                    this.input.clearHint();
                }
            },
            _autocomplete: function autocomplete(laxCursor) {
                var hint, query, isCursorAtEnd, datum;
                hint = this.input.getHint();
                query = this.input.getQuery();
                isCursorAtEnd = laxCursor || this.input.isCursorAtEnd();
                if (hint && query !== hint && isCursorAtEnd) {
                    datum = this.dropdown.getDatumForTopSuggestion();
                    datum && this.input.setInputValue(datum.value);
                    this.eventBus.trigger("autocompleted", datum.raw, datum.datasetName);
                }
            },
            _select: function select(datum) {
                this.input.setQuery(datum.value);
                this.input.setInputValue(datum.value, true);
                this._setLanguageDirection();
                this.eventBus.trigger("selected", datum.raw, datum.datasetName);
                this.dropdown.close();
                _.defer(_.bind(this.dropdown.empty, this.dropdown));
            },
            open: function open() {
                this.dropdown.open();
            },
            close: function close() {
                this.dropdown.close();
            },
            setVal: function setVal(val) {
                val = _.toStr(val);
                if (this.isActivated) {
                    this.input.setInputValue(val);
                } else {
                    this.input.setQuery(val);
                    this.input.setInputValue(val, true);
                }
                this._setLanguageDirection();
            },
            getVal: function getVal() {
                return this.input.getQuery();
            },
            destroy: function destroy() {
                this.input.destroy();
                this.dropdown.destroy();
                destroyDomStructure(this.$node);
                this.$node = null;
            }
        });
        return Typeahead;
        function buildDom(input, withHint) {
            var $input, $wrapper, $dropdown, $hint;
            $input = $(input);
            $wrapper = $(html.wrapper).css(css.wrapper);
            $dropdown = $(html.dropdown).css(css.dropdown);
            $hint = $input.clone().css(css.hint).css(getBackgroundStyles($input));
            $hint.val("").removeData().addClass("tt-hint").removeAttr("id name placeholder required").prop("readonly", true).attr({
                autocomplete: "off",
                spellcheck: "false",
                tabindex: -1
            });
            $input.data(attrsKey, {
                dir: $input.attr("dir"),
                autocomplete: $input.attr("autocomplete"),
                spellcheck: $input.attr("spellcheck"),
                style: $input.attr("style")
            });
            $input.addClass("tt-input").attr({
                autocomplete: "off",
                spellcheck: false
            }).css(withHint ? css.input : css.inputWithNoHint);
            try {
                !$input.attr("dir") && $input.attr("dir", "auto");
            } catch (e) {}
            return $input.wrap($wrapper).parent().prepend(withHint ? $hint : null).append($dropdown);
        }
        function getBackgroundStyles($el) {
            return {
                backgroundAttachment: $el.css("background-attachment"),
                backgroundClip: $el.css("background-clip"),
                backgroundColor: $el.css("background-color"),
                backgroundImage: $el.css("background-image"),
                backgroundOrigin: $el.css("background-origin"),
                backgroundPosition: $el.css("background-position"),
                backgroundRepeat: $el.css("background-repeat"),
                backgroundSize: $el.css("background-size")
            };
        }
        function destroyDomStructure($node) {
            var $input = $node.find(".tt-input");
            _.each($input.data(attrsKey), function(val, key) {
                _.isUndefined(val) ? $input.removeAttr(key) : $input.attr(key, val);
            });
            $input.detach().removeData(attrsKey).removeClass("tt-input").insertAfter($node);
            $node.remove();
        }
    }();
    (function() {
        "use strict";
        var old, typeaheadKey, methods;
        old = $.fn.typeahead;
        typeaheadKey = "ttTypeahead";
        methods = {
            initialize: function initialize(o, datasets) {
                datasets = _.isArray(datasets) ? datasets : [].slice.call(arguments, 1);
                o = o || {};
                return this.each(attach);
                function attach() {
                    var $input = $(this), eventBus, typeahead;
                    _.each(datasets, function(d) {
                        d.highlight = !!o.highlight;
                    });
                    typeahead = new Typeahead({
                        input: $input,
                        eventBus: eventBus = new EventBus({
                            el: $input
                        }),
                        withHint: _.isUndefined(o.hint) ? true : !!o.hint,
                        minLength: o.minLength,
                        autoselect: o.autoselect,
                        datasets: datasets
                    });
                    $input.data(typeaheadKey, typeahead);
                }
            },
            open: function open() {
                return this.each(openTypeahead);
                function openTypeahead() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.open();
                    }
                }
            },
            close: function close() {
                return this.each(closeTypeahead);
                function closeTypeahead() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.close();
                    }
                }
            },
            val: function val(newVal) {
                return !arguments.length ? getVal(this.first()) : this.each(setVal);
                function setVal() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.setVal(newVal);
                    }
                }
                function getVal($input) {
                    var typeahead, query;
                    if (typeahead = $input.data(typeaheadKey)) {
                        query = typeahead.getVal();
                    }
                    return query;
                }
            },
            destroy: function destroy() {
                return this.each(unattach);
                function unattach() {
                    var $input = $(this), typeahead;
                    if (typeahead = $input.data(typeaheadKey)) {
                        typeahead.destroy();
                        $input.removeData(typeaheadKey);
                    }
                }
            }
        };
        $.fn.typeahead = function(method) {
            var tts;
            if (methods[method] && method !== "initialize") {
                tts = this.filter(function() {
                    return !!$(this).data(typeaheadKey);
                });
                return methods[method].apply(tts, [].slice.call(arguments, 1));
            } else {
                return methods.initialize.apply(this, arguments);
            }
        };
        $.fn.typeahead.noConflict = function noConflict() {
            $.fn.typeahead = old;
            return this;
        };
    })();
})(window.jQuery);
/*! http://mths.be/placeholder v2.0.8 by @mathias */
;(function(window, document, $) {

  // Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
  var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
  var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
  var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
  var prototype = $.fn;
  var valHooks = $.valHooks;
  var propHooks = $.propHooks;
  var hooks;
  var placeholder;

  if (isInputSupported && isTextareaSupported) {

    placeholder = prototype.placeholder = function() {
      return this;
    };

    placeholder.input = placeholder.textarea = true;

  } else {

    placeholder = prototype.placeholder = function() {
      var $this = this;
      $this
        .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
        .not('.placeholder')
        .bind({
          'focus.placeholder': clearPlaceholder,
          'blur.placeholder': setPlaceholder
        })
        .data('placeholder-enabled', true)
        .trigger('blur.placeholder');
      return $this;
    };

    placeholder.input = isInputSupported;
    placeholder.textarea = isTextareaSupported;

    hooks = {
      'get': function(element) {
        var $element = $(element);

        var $passwordInput = $element.data('placeholder-password');
        if ($passwordInput) {
          return $passwordInput[0].value;
        }

        return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
      },
      'set': function(element, value) {
        var $element = $(element);

        var $passwordInput = $element.data('placeholder-password');
        if ($passwordInput) {
          return $passwordInput[0].value = value;
        }

        if (!$element.data('placeholder-enabled')) {
          return element.value = value;
        }
        if (value == '') {
          element.value = value;
          // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
          if (element != safeActiveElement()) {
            // We can't use `triggerHandler` here because of dummy text/password inputs :(
            setPlaceholder.call(element);
          }
        } else if ($element.hasClass('placeholder')) {
          clearPlaceholder.call(element, true, value) || (element.value = value);
        } else {
          element.value = value;
        }
        // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
        return $element;
      }
    };

    if (!isInputSupported) {
      valHooks.input = hooks;
      propHooks.value = hooks;
    }
    if (!isTextareaSupported) {
      valHooks.textarea = hooks;
      propHooks.value = hooks;
    }

    $(function() {
      // Look for forms
      $(document).delegate('form', 'submit.placeholder', function() {
        // Clear the placeholder values so they don't get submitted
        var $inputs = $('.placeholder', this).each(clearPlaceholder);
        setTimeout(function() {
          $inputs.each(setPlaceholder);
        }, 10);
      });
    });

    // Clear placeholder values upon page reload
    $(window).bind('beforeunload.placeholder', function() {
      $('.placeholder').each(function() {
        this.value = '';
      });
    });

  }

  function args(elem) {
    // Return an object of element attributes
    var newAttrs = {};
    var rinlinejQuery = /^jQuery\d+$/;
    $.each(elem.attributes, function(i, attr) {
      if (attr.specified && !rinlinejQuery.test(attr.name)) {
        newAttrs[attr.name] = attr.value;
      }
    });
    return newAttrs;
  }

  function clearPlaceholder(event, value) {
    var input = this;
    var $input = $(input);
    if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
      if ($input.data('placeholder-password')) {
        $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
        // If `clearPlaceholder` was called from `$.valHooks.input.set`
        if (event === true) {
          return $input[0].value = value;
        }
        $input.focus();
      } else {
        input.value = '';
        $input.removeClass('placeholder');
        input == safeActiveElement() && input.select();
      }
    }
  }

  function setPlaceholder() {
    var $replacement;
    var input = this;
    var $input = $(input);
    var id = this.id;
    if (input.value == '') {
      if (input.type == 'password') {
        if (!$input.data('placeholder-textinput')) {
          try {
            $replacement = $input.clone().attr({ 'type': 'text' });
          } catch(e) {
            $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
          }
          $replacement
            .removeAttr('name')
            .data({
              'placeholder-password': $input,
              'placeholder-id': id
            })
            .bind('focus.placeholder', clearPlaceholder);
          $input
            .data({
              'placeholder-textinput': $replacement,
              'placeholder-id': id
            })
            .before($replacement);
        }
        $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
        // Note: `$input[0] != input` now!
      }
      $input.addClass('placeholder');
      $input[0].value = $input.attr('placeholder');
    } else {
      $input.removeClass('placeholder');
    }
  }

  function safeActiveElement() {
    // Avoid IE9 `document.activeElement` of death
    // https://github.com/mathiasbynens/jquery-placeholder/pull/99
    try {
      return document.activeElement;
    } catch (exception) {}
  }

}(this, document, jQuery));

/*
Copyright 2012 Igor Vaynberg

Version: 3.5.2 Timestamp: Sat Nov  1 14:43:36 EDT 2014

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
(function ($) {
    if(typeof $.fn.each2 == "undefined") {
        $.extend($.fn, {
            /*
            * 4-10 times faster .each replacement
            * use it carefully, as it overrides jQuery context of element on each iteration
            */
            each2 : function (c) {
                var j = $([0]), i = -1, l = this.length;
                while (
                    ++i < l
                    && (j.context = j[0] = this[i])
                    && c.call(j[0], i, j) !== false //"this"=DOM, i=index, j=jQuery object
                );
                return this;
            }
        });
    }
})(jQuery);

(function ($, undefined) {
    "use strict";
    /*global document, window, jQuery, console */

    if (window.Select2 !== undefined) {
        return;
    }

    var AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer,
        lastMousePosition={x:0,y:0}, $document, scrollBarDimensions,

    KEY = {
        TAB: 9,
        ENTER: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        HOME: 36,
        END: 35,
        BACKSPACE: 8,
        DELETE: 46,
        isArrow: function (k) {
            k = k.which ? k.which : k;
            switch (k) {
            case KEY.LEFT:
            case KEY.RIGHT:
            case KEY.UP:
            case KEY.DOWN:
                return true;
            }
            return false;
        },
        isControl: function (e) {
            var k = e.which;
            switch (k) {
            case KEY.SHIFT:
            case KEY.CTRL:
            case KEY.ALT:
                return true;
            }

            if (e.metaKey) return true;

            return false;
        },
        isFunctionKey: function (k) {
            k = k.which ? k.which : k;
            return k >= 112 && k <= 123;
        }
    },
    MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>",

    DIACRITICS = {"\u24B6":"A","\uFF21":"A","\u00C0":"A","\u00C1":"A","\u00C2":"A","\u1EA6":"A","\u1EA4":"A","\u1EAA":"A","\u1EA8":"A","\u00C3":"A","\u0100":"A","\u0102":"A","\u1EB0":"A","\u1EAE":"A","\u1EB4":"A","\u1EB2":"A","\u0226":"A","\u01E0":"A","\u00C4":"A","\u01DE":"A","\u1EA2":"A","\u00C5":"A","\u01FA":"A","\u01CD":"A","\u0200":"A","\u0202":"A","\u1EA0":"A","\u1EAC":"A","\u1EB6":"A","\u1E00":"A","\u0104":"A","\u023A":"A","\u2C6F":"A","\uA732":"AA","\u00C6":"AE","\u01FC":"AE","\u01E2":"AE","\uA734":"AO","\uA736":"AU","\uA738":"AV","\uA73A":"AV","\uA73C":"AY","\u24B7":"B","\uFF22":"B","\u1E02":"B","\u1E04":"B","\u1E06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24B8":"C","\uFF23":"C","\u0106":"C","\u0108":"C","\u010A":"C","\u010C":"C","\u00C7":"C","\u1E08":"C","\u0187":"C","\u023B":"C","\uA73E":"C","\u24B9":"D","\uFF24":"D","\u1E0A":"D","\u010E":"D","\u1E0C":"D","\u1E10":"D","\u1E12":"D","\u1E0E":"D","\u0110":"D","\u018B":"D","\u018A":"D","\u0189":"D","\uA779":"D","\u01F1":"DZ","\u01C4":"DZ","\u01F2":"Dz","\u01C5":"Dz","\u24BA":"E","\uFF25":"E","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u1EC0":"E","\u1EBE":"E","\u1EC4":"E","\u1EC2":"E","\u1EBC":"E","\u0112":"E","\u1E14":"E","\u1E16":"E","\u0114":"E","\u0116":"E","\u00CB":"E","\u1EBA":"E","\u011A":"E","\u0204":"E","\u0206":"E","\u1EB8":"E","\u1EC6":"E","\u0228":"E","\u1E1C":"E","\u0118":"E","\u1E18":"E","\u1E1A":"E","\u0190":"E","\u018E":"E","\u24BB":"F","\uFF26":"F","\u1E1E":"F","\u0191":"F","\uA77B":"F","\u24BC":"G","\uFF27":"G","\u01F4":"G","\u011C":"G","\u1E20":"G","\u011E":"G","\u0120":"G","\u01E6":"G","\u0122":"G","\u01E4":"G","\u0193":"G","\uA7A0":"G","\uA77D":"G","\uA77E":"G","\u24BD":"H","\uFF28":"H","\u0124":"H","\u1E22":"H","\u1E26":"H","\u021E":"H","\u1E24":"H","\u1E28":"H","\u1E2A":"H","\u0126":"H","\u2C67":"H","\u2C75":"H","\uA78D":"H","\u24BE":"I","\uFF29":"I","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u0128":"I","\u012A":"I","\u012C":"I","\u0130":"I","\u00CF":"I","\u1E2E":"I","\u1EC8":"I","\u01CF":"I","\u0208":"I","\u020A":"I","\u1ECA":"I","\u012E":"I","\u1E2C":"I","\u0197":"I","\u24BF":"J","\uFF2A":"J","\u0134":"J","\u0248":"J","\u24C0":"K","\uFF2B":"K","\u1E30":"K","\u01E8":"K","\u1E32":"K","\u0136":"K","\u1E34":"K","\u0198":"K","\u2C69":"K","\uA740":"K","\uA742":"K","\uA744":"K","\uA7A2":"K","\u24C1":"L","\uFF2C":"L","\u013F":"L","\u0139":"L","\u013D":"L","\u1E36":"L","\u1E38":"L","\u013B":"L","\u1E3C":"L","\u1E3A":"L","\u0141":"L","\u023D":"L","\u2C62":"L","\u2C60":"L","\uA748":"L","\uA746":"L","\uA780":"L","\u01C7":"LJ","\u01C8":"Lj","\u24C2":"M","\uFF2D":"M","\u1E3E":"M","\u1E40":"M","\u1E42":"M","\u2C6E":"M","\u019C":"M","\u24C3":"N","\uFF2E":"N","\u01F8":"N","\u0143":"N","\u00D1":"N","\u1E44":"N","\u0147":"N","\u1E46":"N","\u0145":"N","\u1E4A":"N","\u1E48":"N","\u0220":"N","\u019D":"N","\uA790":"N","\uA7A4":"N","\u01CA":"NJ","\u01CB":"Nj","\u24C4":"O","\uFF2F":"O","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u1ED2":"O","\u1ED0":"O","\u1ED6":"O","\u1ED4":"O","\u00D5":"O","\u1E4C":"O","\u022C":"O","\u1E4E":"O","\u014C":"O","\u1E50":"O","\u1E52":"O","\u014E":"O","\u022E":"O","\u0230":"O","\u00D6":"O","\u022A":"O","\u1ECE":"O","\u0150":"O","\u01D1":"O","\u020C":"O","\u020E":"O","\u01A0":"O","\u1EDC":"O","\u1EDA":"O","\u1EE0":"O","\u1EDE":"O","\u1EE2":"O","\u1ECC":"O","\u1ED8":"O","\u01EA":"O","\u01EC":"O","\u00D8":"O","\u01FE":"O","\u0186":"O","\u019F":"O","\uA74A":"O","\uA74C":"O","\u01A2":"OI","\uA74E":"OO","\u0222":"OU","\u24C5":"P","\uFF30":"P","\u1E54":"P","\u1E56":"P","\u01A4":"P","\u2C63":"P","\uA750":"P","\uA752":"P","\uA754":"P","\u24C6":"Q","\uFF31":"Q","\uA756":"Q","\uA758":"Q","\u024A":"Q","\u24C7":"R","\uFF32":"R","\u0154":"R","\u1E58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1E5A":"R","\u1E5C":"R","\u0156":"R","\u1E5E":"R","\u024C":"R","\u2C64":"R","\uA75A":"R","\uA7A6":"R","\uA782":"R","\u24C8":"S","\uFF33":"S","\u1E9E":"S","\u015A":"S","\u1E64":"S","\u015C":"S","\u1E60":"S","\u0160":"S","\u1E66":"S","\u1E62":"S","\u1E68":"S","\u0218":"S","\u015E":"S","\u2C7E":"S","\uA7A8":"S","\uA784":"S","\u24C9":"T","\uFF34":"T","\u1E6A":"T","\u0164":"T","\u1E6C":"T","\u021A":"T","\u0162":"T","\u1E70":"T","\u1E6E":"T","\u0166":"T","\u01AC":"T","\u01AE":"T","\u023E":"T","\uA786":"T","\uA728":"TZ","\u24CA":"U","\uFF35":"U","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u0168":"U","\u1E78":"U","\u016A":"U","\u1E7A":"U","\u016C":"U","\u00DC":"U","\u01DB":"U","\u01D7":"U","\u01D5":"U","\u01D9":"U","\u1EE6":"U","\u016E":"U","\u0170":"U","\u01D3":"U","\u0214":"U","\u0216":"U","\u01AF":"U","\u1EEA":"U","\u1EE8":"U","\u1EEE":"U","\u1EEC":"U","\u1EF0":"U","\u1EE4":"U","\u1E72":"U","\u0172":"U","\u1E76":"U","\u1E74":"U","\u0244":"U","\u24CB":"V","\uFF36":"V","\u1E7C":"V","\u1E7E":"V","\u01B2":"V","\uA75E":"V","\u0245":"V","\uA760":"VY","\u24CC":"W","\uFF37":"W","\u1E80":"W","\u1E82":"W","\u0174":"W","\u1E86":"W","\u1E84":"W","\u1E88":"W","\u2C72":"W","\u24CD":"X","\uFF38":"X","\u1E8A":"X","\u1E8C":"X","\u24CE":"Y","\uFF39":"Y","\u1EF2":"Y","\u00DD":"Y","\u0176":"Y","\u1EF8":"Y","\u0232":"Y","\u1E8E":"Y","\u0178":"Y","\u1EF6":"Y","\u1EF4":"Y","\u01B3":"Y","\u024E":"Y","\u1EFE":"Y","\u24CF":"Z","\uFF3A":"Z","\u0179":"Z","\u1E90":"Z","\u017B":"Z","\u017D":"Z","\u1E92":"Z","\u1E94":"Z","\u01B5":"Z","\u0224":"Z","\u2C7F":"Z","\u2C6B":"Z","\uA762":"Z","\u24D0":"a","\uFF41":"a","\u1E9A":"a","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u1EA7":"a","\u1EA5":"a","\u1EAB":"a","\u1EA9":"a","\u00E3":"a","\u0101":"a","\u0103":"a","\u1EB1":"a","\u1EAF":"a","\u1EB5":"a","\u1EB3":"a","\u0227":"a","\u01E1":"a","\u00E4":"a","\u01DF":"a","\u1EA3":"a","\u00E5":"a","\u01FB":"a","\u01CE":"a","\u0201":"a","\u0203":"a","\u1EA1":"a","\u1EAD":"a","\u1EB7":"a","\u1E01":"a","\u0105":"a","\u2C65":"a","\u0250":"a","\uA733":"aa","\u00E6":"ae","\u01FD":"ae","\u01E3":"ae","\uA735":"ao","\uA737":"au","\uA739":"av","\uA73B":"av","\uA73D":"ay","\u24D1":"b","\uFF42":"b","\u1E03":"b","\u1E05":"b","\u1E07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24D2":"c","\uFF43":"c","\u0107":"c","\u0109":"c","\u010B":"c","\u010D":"c","\u00E7":"c","\u1E09":"c","\u0188":"c","\u023C":"c","\uA73F":"c","\u2184":"c","\u24D3":"d","\uFF44":"d","\u1E0B":"d","\u010F":"d","\u1E0D":"d","\u1E11":"d","\u1E13":"d","\u1E0F":"d","\u0111":"d","\u018C":"d","\u0256":"d","\u0257":"d","\uA77A":"d","\u01F3":"dz","\u01C6":"dz","\u24D4":"e","\uFF45":"e","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u1EC1":"e","\u1EBF":"e","\u1EC5":"e","\u1EC3":"e","\u1EBD":"e","\u0113":"e","\u1E15":"e","\u1E17":"e","\u0115":"e","\u0117":"e","\u00EB":"e","\u1EBB":"e","\u011B":"e","\u0205":"e","\u0207":"e","\u1EB9":"e","\u1EC7":"e","\u0229":"e","\u1E1D":"e","\u0119":"e","\u1E19":"e","\u1E1B":"e","\u0247":"e","\u025B":"e","\u01DD":"e","\u24D5":"f","\uFF46":"f","\u1E1F":"f","\u0192":"f","\uA77C":"f","\u24D6":"g","\uFF47":"g","\u01F5":"g","\u011D":"g","\u1E21":"g","\u011F":"g","\u0121":"g","\u01E7":"g","\u0123":"g","\u01E5":"g","\u0260":"g","\uA7A1":"g","\u1D79":"g","\uA77F":"g","\u24D7":"h","\uFF48":"h","\u0125":"h","\u1E23":"h","\u1E27":"h","\u021F":"h","\u1E25":"h","\u1E29":"h","\u1E2B":"h","\u1E96":"h","\u0127":"h","\u2C68":"h","\u2C76":"h","\u0265":"h","\u0195":"hv","\u24D8":"i","\uFF49":"i","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u0129":"i","\u012B":"i","\u012D":"i","\u00EF":"i","\u1E2F":"i","\u1EC9":"i","\u01D0":"i","\u0209":"i","\u020B":"i","\u1ECB":"i","\u012F":"i","\u1E2D":"i","\u0268":"i","\u0131":"i","\u24D9":"j","\uFF4A":"j","\u0135":"j","\u01F0":"j","\u0249":"j","\u24DA":"k","\uFF4B":"k","\u1E31":"k","\u01E9":"k","\u1E33":"k","\u0137":"k","\u1E35":"k","\u0199":"k","\u2C6A":"k","\uA741":"k","\uA743":"k","\uA745":"k","\uA7A3":"k","\u24DB":"l","\uFF4C":"l","\u0140":"l","\u013A":"l","\u013E":"l","\u1E37":"l","\u1E39":"l","\u013C":"l","\u1E3D":"l","\u1E3B":"l","\u017F":"l","\u0142":"l","\u019A":"l","\u026B":"l","\u2C61":"l","\uA749":"l","\uA781":"l","\uA747":"l","\u01C9":"lj","\u24DC":"m","\uFF4D":"m","\u1E3F":"m","\u1E41":"m","\u1E43":"m","\u0271":"m","\u026F":"m","\u24DD":"n","\uFF4E":"n","\u01F9":"n","\u0144":"n","\u00F1":"n","\u1E45":"n","\u0148":"n","\u1E47":"n","\u0146":"n","\u1E4B":"n","\u1E49":"n","\u019E":"n","\u0272":"n","\u0149":"n","\uA791":"n","\uA7A5":"n","\u01CC":"nj","\u24DE":"o","\uFF4F":"o","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u1ED3":"o","\u1ED1":"o","\u1ED7":"o","\u1ED5":"o","\u00F5":"o","\u1E4D":"o","\u022D":"o","\u1E4F":"o","\u014D":"o","\u1E51":"o","\u1E53":"o","\u014F":"o","\u022F":"o","\u0231":"o","\u00F6":"o","\u022B":"o","\u1ECF":"o","\u0151":"o","\u01D2":"o","\u020D":"o","\u020F":"o","\u01A1":"o","\u1EDD":"o","\u1EDB":"o","\u1EE1":"o","\u1EDF":"o","\u1EE3":"o","\u1ECD":"o","\u1ED9":"o","\u01EB":"o","\u01ED":"o","\u00F8":"o","\u01FF":"o","\u0254":"o","\uA74B":"o","\uA74D":"o","\u0275":"o","\u01A3":"oi","\u0223":"ou","\uA74F":"oo","\u24DF":"p","\uFF50":"p","\u1E55":"p","\u1E57":"p","\u01A5":"p","\u1D7D":"p","\uA751":"p","\uA753":"p","\uA755":"p","\u24E0":"q","\uFF51":"q","\u024B":"q","\uA757":"q","\uA759":"q","\u24E1":"r","\uFF52":"r","\u0155":"r","\u1E59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1E5B":"r","\u1E5D":"r","\u0157":"r","\u1E5F":"r","\u024D":"r","\u027D":"r","\uA75B":"r","\uA7A7":"r","\uA783":"r","\u24E2":"s","\uFF53":"s","\u00DF":"s","\u015B":"s","\u1E65":"s","\u015D":"s","\u1E61":"s","\u0161":"s","\u1E67":"s","\u1E63":"s","\u1E69":"s","\u0219":"s","\u015F":"s","\u023F":"s","\uA7A9":"s","\uA785":"s","\u1E9B":"s","\u24E3":"t","\uFF54":"t","\u1E6B":"t","\u1E97":"t","\u0165":"t","\u1E6D":"t","\u021B":"t","\u0163":"t","\u1E71":"t","\u1E6F":"t","\u0167":"t","\u01AD":"t","\u0288":"t","\u2C66":"t","\uA787":"t","\uA729":"tz","\u24E4":"u","\uFF55":"u","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u0169":"u","\u1E79":"u","\u016B":"u","\u1E7B":"u","\u016D":"u","\u00FC":"u","\u01DC":"u","\u01D8":"u","\u01D6":"u","\u01DA":"u","\u1EE7":"u","\u016F":"u","\u0171":"u","\u01D4":"u","\u0215":"u","\u0217":"u","\u01B0":"u","\u1EEB":"u","\u1EE9":"u","\u1EEF":"u","\u1EED":"u","\u1EF1":"u","\u1EE5":"u","\u1E73":"u","\u0173":"u","\u1E77":"u","\u1E75":"u","\u0289":"u","\u24E5":"v","\uFF56":"v","\u1E7D":"v","\u1E7F":"v","\u028B":"v","\uA75F":"v","\u028C":"v","\uA761":"vy","\u24E6":"w","\uFF57":"w","\u1E81":"w","\u1E83":"w","\u0175":"w","\u1E87":"w","\u1E85":"w","\u1E98":"w","\u1E89":"w","\u2C73":"w","\u24E7":"x","\uFF58":"x","\u1E8B":"x","\u1E8D":"x","\u24E8":"y","\uFF59":"y","\u1EF3":"y","\u00FD":"y","\u0177":"y","\u1EF9":"y","\u0233":"y","\u1E8F":"y","\u00FF":"y","\u1EF7":"y","\u1E99":"y","\u1EF5":"y","\u01B4":"y","\u024F":"y","\u1EFF":"y","\u24E9":"z","\uFF5A":"z","\u017A":"z","\u1E91":"z","\u017C":"z","\u017E":"z","\u1E93":"z","\u1E95":"z","\u01B6":"z","\u0225":"z","\u0240":"z","\u2C6C":"z","\uA763":"z","\u0386":"\u0391","\u0388":"\u0395","\u0389":"\u0397","\u038A":"\u0399","\u03AA":"\u0399","\u038C":"\u039F","\u038E":"\u03A5","\u03AB":"\u03A5","\u038F":"\u03A9","\u03AC":"\u03B1","\u03AD":"\u03B5","\u03AE":"\u03B7","\u03AF":"\u03B9","\u03CA":"\u03B9","\u0390":"\u03B9","\u03CC":"\u03BF","\u03CD":"\u03C5","\u03CB":"\u03C5","\u03B0":"\u03C5","\u03C9":"\u03C9","\u03C2":"\u03C3"};

    $document = $(document);

    nextUid=(function() { var counter=1; return function() { return counter++; }; }());


    function reinsertElement(element) {
        var placeholder = $(document.createTextNode(''));

        element.before(placeholder);
        placeholder.before(element);
        placeholder.remove();
    }

    function stripDiacritics(str) {
        // Used 'uni range + named function' from http://jsperf.com/diacritics/18
        function match(a) {
            return DIACRITICS[a] || a;
        }

        return str.replace(/[^\u0000-\u007E]/g, match);
    }

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    function measureScrollbar () {
        var $template = $( MEASURE_SCROLLBAR_TEMPLATE );
        $template.appendTo(document.body);

        var dim = {
            width: $template.width() - $template[0].clientWidth,
            height: $template.height() - $template[0].clientHeight
        };
        $template.remove();

        return dim;
    }

    /**
     * Compares equality of a and b
     * @param a
     * @param b
     */
    function equal(a, b) {
        if (a === b) return true;
        if (a === undefined || b === undefined) return false;
        if (a === null || b === null) return false;
        // Check whether 'a' or 'b' is a string (primitive or object).
        // The concatenation of an empty string (+'') converts its argument to a string's primitive.
        if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object
        if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object
        return false;
    }

    /**
     * Splits the string into an array of values, transforming each value. An empty array is returned for nulls or empty
     * strings
     * @param string
     * @param separator
     */
    function splitVal(string, separator, transform) {
        var val, i, l;
        if (string === null || string.length < 1) return [];
        val = string.split(separator);
        for (i = 0, l = val.length; i < l; i = i + 1) val[i] = transform(val[i]);
        return val;
    }

    function getSideBorderPadding(element) {
        return element.outerWidth(false) - element.width();
    }

    function installKeyUpChangeEvent(element) {
        var key="keyup-change-value";
        element.on("keydown", function () {
            if ($.data(element, key) === undefined) {
                $.data(element, key, element.val());
            }
        });
        element.on("keyup", function () {
            var val= $.data(element, key);
            if (val !== undefined && element.val() !== val) {
                $.removeData(element, key);
                element.trigger("keyup-change");
            }
        });
    }


    /**
     * filters mouse events so an event is fired only if the mouse moved.
     *
     * filters out mouse events that occur when mouse is stationary but
     * the elements under the pointer are scrolled.
     */
    function installFilteredMouseMove(element) {
        element.on("mousemove", function (e) {
            var lastpos = lastMousePosition;
            if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                $(e.target).trigger("mousemove-filtered", e);
            }
        });
    }

    /**
     * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
     * within the last quietMillis milliseconds.
     *
     * @param quietMillis number of milliseconds to wait before invoking fn
     * @param fn function to be debounced
     * @param ctx object to be used as this reference within fn
     * @return debounced version of fn
     */
    function debounce(quietMillis, fn, ctx) {
        ctx = ctx || undefined;
        var timeout;
        return function () {
            var args = arguments;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function() {
                fn.apply(ctx, args);
            }, quietMillis);
        };
    }

    function installDebouncedScroll(threshold, element) {
        var notify = debounce(threshold, function (e) { element.trigger("scroll-debounced", e);});
        element.on("scroll", function (e) {
            if (indexOf(e.target, element.get()) >= 0) notify(e);
        });
    }

    function focus($el) {
        if ($el[0] === document.activeElement) return;

        /* set the focus in a 0 timeout - that way the focus is set after the processing
            of the current event has finished - which seems like the only reliable way
            to set focus */
        window.setTimeout(function() {
            var el=$el[0], pos=$el.val().length, range;

            $el.focus();

            /* make sure el received focus so we do not error out when trying to manipulate the caret.
                sometimes modals or others listeners may steal it after its set */
            var isVisible = (el.offsetWidth > 0 || el.offsetHeight > 0);
            if (isVisible && el === document.activeElement) {

                /* after the focus is set move the caret to the end, necessary when we val()
                    just before setting focus */
                if(el.setSelectionRange)
                {
                    el.setSelectionRange(pos, pos);
                }
                else if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                }
            }
        }, 0);
    }

    function getCursorInfo(el) {
        el = $(el)[0];
        var offset = 0;
        var length = 0;
        if ('selectionStart' in el) {
            offset = el.selectionStart;
            length = el.selectionEnd - offset;
        } else if ('selection' in document) {
            el.focus();
            var sel = document.selection.createRange();
            length = document.selection.createRange().text.length;
            sel.moveStart('character', -el.value.length);
            offset = sel.text.length - length;
        }
        return { offset: offset, length: length };
    }

    function killEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    function killEventImmediately(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }

    function measureTextWidth(e) {
        if (!sizer){
            var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
            sizer = $(document.createElement("div")).css({
                position: "absolute",
                left: "-10000px",
                top: "-10000px",
                display: "none",
                fontSize: style.fontSize,
                fontFamily: style.fontFamily,
                fontStyle: style.fontStyle,
                fontWeight: style.fontWeight,
                letterSpacing: style.letterSpacing,
                textTransform: style.textTransform,
                whiteSpace: "nowrap"
            });
            sizer.attr("class","select2-sizer");
            $(document.body).append(sizer);
        }
        sizer.text(e.val());
        return sizer.width();
    }

    function syncCssClasses(dest, src, adapter) {
        var classes, replacements = [], adapted;

        classes = $.trim(dest.attr("class"));

        if (classes) {
            classes = '' + classes; // for IE which returns object

            $(classes.split(/\s+/)).each2(function() {
                if (this.indexOf("select2-") === 0) {
                    replacements.push(this);
                }
            });
        }

        classes = $.trim(src.attr("class"));

        if (classes) {
            classes = '' + classes; // for IE which returns object

            $(classes.split(/\s+/)).each2(function() {
                if (this.indexOf("select2-") !== 0) {
                    adapted = adapter(this);

                    if (adapted) {
                        replacements.push(adapted);
                    }
                }
            });
        }

        dest.attr("class", replacements.join(" "));
    }


    function markMatch(text, term, markup, escapeMarkup) {
        var match=stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())),
            tl=term.length;

        if (match<0) {
            markup.push(escapeMarkup(text));
            return;
        }

        markup.push(escapeMarkup(text.substring(0, match)));
        markup.push("<span class='select2-match'>");
        markup.push(escapeMarkup(text.substring(match, match + tl)));
        markup.push("</span>");
        markup.push(escapeMarkup(text.substring(match + tl, text.length)));
    }

    function defaultEscapeMarkup(markup) {
        var replace_map = {
            '\\': '&#92;',
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#47;'
        };

        return String(markup).replace(/[&<>"'\/\\]/g, function (match) {
            return replace_map[match];
        });
    }

    /**
     * Produces an ajax-based query function
     *
     * @param options object containing configuration parameters
     * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
     * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
     * @param options.url url for the data
     * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
     * @param options.dataType request data type: ajax, jsonp, other datatypes supported by jQuery's $.ajax function or the transport function if specified
     * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
     * @param options.results a function(remoteData, pageNumber, query) that converts data returned form the remote request to the format expected by Select2.
     *      The expected format is an object containing the following keys:
     *      results array of objects that will be used as choices
     *      more (optional) boolean indicating whether there are more results available
     *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
     */
    function ajax(options) {
        var timeout, // current scheduled but not yet executed request
            handler = null,
            quietMillis = options.quietMillis || 100,
            ajaxUrl = options.url,
            self = this;

        return function (query) {
            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                var data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.fn.select2.ajaxDefaults.transport,
                    // deprecated - to be removed in 4.0  - use params instead
                    deprecated = {
                        type: options.type || 'GET', // set type of request (GET or POST)
                        cache: options.cache || false,
                        jsonpCallback: options.jsonpCallback||undefined,
                        dataType: options.dataType||"json"
                    },
                    params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);

                data = data ? data.call(self, query.term, query.page, query.context) : null;
                url = (typeof url === 'function') ? url.call(self, query.term, query.page, query.context) : url;

                if (handler && typeof handler.abort === "function") { handler.abort(); }

                if (options.params) {
                    if ($.isFunction(options.params)) {
                        $.extend(params, options.params.call(self));
                    } else {
                        $.extend(params, options.params);
                    }
                }

                $.extend(params, {
                    url: url,
                    dataType: options.dataType,
                    data: data,
                    success: function (data) {
                        // TODO - replace query.page with query so users have access to term, page, etc.
                        // added query as third paramter to keep backwards compatibility
                        var results = options.results(data, query.page, query);
                        query.callback(results);
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        var results = {
                            hasError: true,
                            jqXHR: jqXHR,
                            textStatus: textStatus,
                            errorThrown: errorThrown
                        };

                        query.callback(results);
                    }
                });
                handler = transport.call(self, params);
            }, quietMillis);
        };
    }

    /**
     * Produces a query function that works with a local array
     *
     * @param options object containing configuration parameters. The options parameter can either be an array or an
     * object.
     *
     * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
     *
     * If the object form is used it is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
     * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
     * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
     * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
     * the text.
     */
    function local(options) {
        var data = options, // data elements
            dataText,
            tmp,
            text = function (item) { return ""+item.text; }; // function used to retrieve the text portion of a data item that is matched against the search

         if ($.isArray(data)) {
            tmp = data;
            data = { results: tmp };
        }

         if ($.isFunction(data) === false) {
            tmp = data;
            data = function() { return tmp; };
        }

        var dataItem = data();
        if (dataItem.text) {
            text = dataItem.text;
            // if text is not a function we assume it to be a key name
            if (!$.isFunction(text)) {
                dataText = dataItem.text; // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                text = function (item) { return item[dataText]; };
            }
        }

        return function (query) {
            var t = query.term, filtered = { results: [] }, process;
            if (t === "") {
                query.callback(data());
                return;
            }

            process = function(datum, collection) {
                var group, attr;
                datum = datum[0];
                if (datum.children) {
                    group = {};
                    for (attr in datum) {
                        if (datum.hasOwnProperty(attr)) group[attr]=datum[attr];
                    }
                    group.children=[];
                    $(datum.children).each2(function(i, childDatum) { process(childDatum, group.children); });
                    if (group.children.length || query.matcher(t, text(group), datum)) {
                        collection.push(group);
                    }
                } else {
                    if (query.matcher(t, text(datum), datum)) {
                        collection.push(datum);
                    }
                }
            };

            $(data().results).each2(function(i, datum) { process(datum, filtered.results); });
            query.callback(filtered);
        };
    }

    // TODO javadoc
    function tags(data) {
        var isFunc = $.isFunction(data);
        return function (query) {
            var t = query.term, filtered = {results: []};
            var result = isFunc ? data(query) : data;
            if ($.isArray(result)) {
                $(result).each(function () {
                    var isObject = this.text !== undefined,
                        text = isObject ? this.text : this;
                    if (t === "" || query.matcher(t, text)) {
                        filtered.results.push(isObject ? this : {id: this, text: this});
                    }
                });
                query.callback(filtered);
            }
        };
    }

    /**
     * Checks if the formatter function should be used.
     *
     * Throws an error if it is not a function. Returns true if it should be used,
     * false if no formatting should be performed.
     *
     * @param formatter
     */
    function checkFormatter(formatter, formatterName) {
        if ($.isFunction(formatter)) return true;
        if (!formatter) return false;
        if (typeof(formatter) === 'string') return true;
        throw new Error(formatterName +" must be a string, function, or falsy value");
    }

  /**
   * Returns a given value
   * If given a function, returns its output
   *
   * @param val string|function
   * @param context value of "this" to be passed to function
   * @returns {*}
   */
    function evaluate(val, context) {
        if ($.isFunction(val)) {
            var args = Array.prototype.slice.call(arguments, 2);
            return val.apply(context, args);
        }
        return val;
    }

    function countResults(results) {
        var count = 0;
        $.each(results, function(i, item) {
            if (item.children) {
                count += countResults(item.children);
            } else {
                count++;
            }
        });
        return count;
    }

    /**
     * Default tokenizer. This function uses breaks the input on substring match of any string from the
     * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
     * two options have to be defined in order for the tokenizer to work.
     *
     * @param input text user has typed so far or pasted into the search field
     * @param selection currently selected choices
     * @param selectCallback function(choice) callback tho add the choice to selection
     * @param opts select2's opts
     * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
     */
    function defaultTokenizer(input, selection, selectCallback, opts) {
        var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator; // the matched separator

        if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;

        while (true) {
            index = -1;

            for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                separator = opts.tokenSeparators[i];
                index = input.indexOf(separator);
                if (index >= 0) break;
            }

            if (index < 0) break; // did not find any token separator in the input string, bail

            token = input.substring(0, index);
            input = input.substring(index + separator.length);

            if (token.length > 0) {
                token = opts.createSearchChoice.call(this, token, selection);
                if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                    dupe = false;
                    for (i = 0, l = selection.length; i < l; i++) {
                        if (equal(opts.id(token), opts.id(selection[i]))) {
                            dupe = true; break;
                        }
                    }

                    if (!dupe) selectCallback(token);
                }
            }
        }

        if (original!==input) return input;
    }

    function cleanupJQueryElements() {
        var self = this;

        $.each(arguments, function (i, element) {
            self[element].remove();
            self[element] = null;
        });
    }

    /**
     * Creates a new class
     *
     * @param superClass
     * @param methods
     */
    function clazz(SuperClass, methods) {
        var constructor = function () {};
        constructor.prototype = new SuperClass;
        constructor.prototype.constructor = constructor;
        constructor.prototype.parent = SuperClass.prototype;
        constructor.prototype = $.extend(constructor.prototype, methods);
        return constructor;
    }

    AbstractSelect2 = clazz(Object, {

        // abstract
        bind: function (func) {
            var self = this;
            return function () {
                func.apply(self, arguments);
            };
        },

        // abstract
        init: function (opts) {
            var results, search, resultsSelector = ".select2-results";

            // prepare options
            this.opts = opts = this.prepareOpts(opts);

            this.id=opts.id;

            // destroy if called on an existing component
            if (opts.element.data("select2") !== undefined &&
                opts.element.data("select2") !== null) {
                opts.element.data("select2").destroy();
            }

            this.container = this.createContainer();

            this.liveRegion = $('.select2-hidden-accessible');
            if (this.liveRegion.length == 0) {
                this.liveRegion = $("<span>", {
                        role: "status",
                        "aria-live": "polite"
                    })
                    .addClass("select2-hidden-accessible")
                    .appendTo(document.body);
            }

            this.containerId="s2id_"+(opts.element.attr("id") || "autogen"+nextUid());
            this.containerEventName= this.containerId
                .replace(/([.])/g, '_')
                .replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
            this.container.attr("id", this.containerId);

            this.container.attr("title", opts.element.attr("title"));

            this.body = $(document.body);

            syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);

            this.container.attr("style", opts.element.attr("style"));
            this.container.css(evaluate(opts.containerCss, this.opts.element));
            this.container.addClass(evaluate(opts.containerCssClass, this.opts.element));

            this.elementTabIndex = this.opts.element.attr("tabindex");

            // swap container for the element
            this.opts.element
                .data("select2", this)
                .attr("tabindex", "-1")
                .before(this.container)
                .on("click.select2", killEvent); // do not leak click events

            this.container.data("select2", this);

            this.dropdown = this.container.find(".select2-drop");

            syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);

            this.dropdown.addClass(evaluate(opts.dropdownCssClass, this.opts.element));
            this.dropdown.data("select2", this);
            this.dropdown.on("click", killEvent);

            this.results = results = this.container.find(resultsSelector);
            this.search = search = this.container.find("input.select2-input");

            this.queryCount = 0;
            this.resultsPage = 0;
            this.context = null;

            // initialize the container
            this.initContainer();

            this.container.on("click", killEvent);

            installFilteredMouseMove(this.results);

            this.dropdown.on("mousemove-filtered", resultsSelector, this.bind(this.highlightUnderEvent));
            this.dropdown.on("touchstart touchmove touchend", resultsSelector, this.bind(function (event) {
                this._touchEvent = true;
                this.highlightUnderEvent(event);
            }));
            this.dropdown.on("touchmove", resultsSelector, this.bind(this.touchMoved));
            this.dropdown.on("touchstart touchend", resultsSelector, this.bind(this.clearTouchMoved));

            // Waiting for a click event on touch devices to select option and hide dropdown
            // otherwise click will be triggered on an underlying element
            this.dropdown.on('click', this.bind(function (event) {
                if (this._touchEvent) {
                    this._touchEvent = false;
                    this.selectHighlighted();
                }
            }));

            installDebouncedScroll(80, this.results);
            this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));

            // do not propagate change event from the search field out of the component
            $(this.container).on("change", ".select2-input", function(e) {e.stopPropagation();});
            $(this.dropdown).on("change", ".select2-input", function(e) {e.stopPropagation();});

            // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
            if ($.fn.mousewheel) {
                results.mousewheel(function (e, delta, deltaX, deltaY) {
                    var top = results.scrollTop();
                    if (deltaY > 0 && top - deltaY <= 0) {
                        results.scrollTop(0);
                        killEvent(e);
                    } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                        results.scrollTop(results.get(0).scrollHeight - results.height());
                        killEvent(e);
                    }
                });
            }

            installKeyUpChangeEvent(search);
            search.on("keyup-change input paste", this.bind(this.updateResults));
            search.on("focus", function () { search.addClass("select2-focused"); });
            search.on("blur", function () { search.removeClass("select2-focused");});

            this.dropdown.on("mouseup", resultsSelector, this.bind(function (e) {
                if ($(e.target).closest(".select2-result-selectable").length > 0) {
                    this.highlightUnderEvent(e);
                    this.selectHighlighted(e);
                }
            }));

            // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
            // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
            // dom it will trigger the popup close, which is not what we want
            // focusin can cause focus wars between modals and select2 since the dropdown is outside the modal.
            this.dropdown.on("click mouseup mousedown touchstart touchend focusin", function (e) { e.stopPropagation(); });

            this.nextSearchTerm = undefined;

            if ($.isFunction(this.opts.initSelection)) {
                // initialize selection based on the current value of the source element
                this.initSelection();

                // if the user has provided a function that can set selection based on the value of the source element
                // we monitor the change event on the element and trigger it, allowing for two way synchronization
                this.monitorSource();
            }

            if (opts.maximumInputLength !== null) {
                this.search.attr("maxlength", opts.maximumInputLength);
            }

            var disabled = opts.element.prop("disabled");
            if (disabled === undefined) disabled = false;
            this.enable(!disabled);

            var readonly = opts.element.prop("readonly");
            if (readonly === undefined) readonly = false;
            this.readonly(readonly);

            // Calculate size of scrollbar
            scrollBarDimensions = scrollBarDimensions || measureScrollbar();

            this.autofocus = opts.element.prop("autofocus");
            opts.element.prop("autofocus", false);
            if (this.autofocus) this.focus();

            this.search.attr("placeholder", opts.searchInputPlaceholder);
        },

        // abstract
        destroy: function () {
            var element=this.opts.element, select2 = element.data("select2"), self = this;

            this.close();

            if (element.length && element[0].detachEvent && self._sync) {
                element.each(function () {
                    if (self._sync) {
                        this.detachEvent("onpropertychange", self._sync);
                    }
                });
            }
            if (this.propertyObserver) {
                this.propertyObserver.disconnect();
                this.propertyObserver = null;
            }
            this._sync = null;

            if (select2 !== undefined) {
                select2.container.remove();
                select2.liveRegion.remove();
                select2.dropdown.remove();
                element
                    .show()
                    .removeData("select2")
                    .off(".select2")
                    .prop("autofocus", this.autofocus || false);
                if (this.elementTabIndex) {
                    element.attr({tabindex: this.elementTabIndex});
                } else {
                    element.removeAttr("tabindex");
                }
                element.show();
            }

            cleanupJQueryElements.call(this,
                "container",
                "liveRegion",
                "dropdown",
                "results",
                "search"
            );
        },

        // abstract
        optionToData: function(element) {
            if (element.is("option")) {
                return {
                    id:element.prop("value"),
                    text:element.text(),
                    element: element.get(),
                    css: element.attr("class"),
                    disabled: element.prop("disabled"),
                    locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
                };
            } else if (element.is("optgroup")) {
                return {
                    text:element.attr("label"),
                    children:[],
                    element: element.get(),
                    css: element.attr("class")
                };
            }
        },

        // abstract
        prepareOpts: function (opts) {
            var element, select, idKey, ajaxUrl, self = this;

            element = opts.element;

            if (element.get(0).tagName.toLowerCase() === "select") {
                this.select = select = opts.element;
            }

            if (select) {
                // these options are not allowed when attached to a select because they are picked up off the element itself
                $.each(["id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags"], function () {
                    if (this in opts) {
                        throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                    }
                });
            }

            opts = $.extend({}, {
                populateResults: function(container, results, query) {
                    var populate, id=this.opts.id, liveRegion=this.liveRegion;

                    populate=function(results, container, depth) {

                        var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;

                        results = opts.sortResults(results, container, query);

                        // collect the created nodes for bulk append
                        var nodes = [];
                        for (i = 0, l = results.length; i < l; i = i + 1) {

                            result=results[i];

                            disabled = (result.disabled === true);
                            selectable = (!disabled) && (id(result) !== undefined);

                            compound=result.children && result.children.length > 0;

                            node=$("<li></li>");
                            node.addClass("select2-results-dept-"+depth);
                            node.addClass("select2-result");
                            node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                            if (disabled) { node.addClass("select2-disabled"); }
                            if (compound) { node.addClass("select2-result-with-children"); }
                            node.addClass(self.opts.formatResultCssClass(result));
                            node.attr("role", "presentation");

                            label=$(document.createElement("div"));
                            label.addClass("select2-result-label");
                            label.attr("id", "select2-result-label-" + nextUid());
                            label.attr("role", "option");

                            formatted=opts.formatResult(result, label, query, self.opts.escapeMarkup);
                            if (formatted!==undefined) {
                                label.html(formatted);
                                node.append(label);
                            }


                            if (compound) {

                                innerContainer=$("<ul></ul>");
                                innerContainer.addClass("select2-result-sub");
                                populate(result.children, innerContainer, depth+1);
                                node.append(innerContainer);
                            }

                            node.data("select2-data", result);
                            nodes.push(node[0]);
                        }

                        // bulk append the created nodes
                        container.append(nodes);
                        liveRegion.text(opts.formatMatches(results.length));
                    };

                    populate(results, container, 0);
                }
            }, $.fn.select2.defaults, opts);

            if (typeof(opts.id) !== "function") {
                idKey = opts.id;
                opts.id = function (e) { return e[idKey]; };
            }

            if ($.isArray(opts.element.data("select2Tags"))) {
                if ("tags" in opts) {
                    throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                }
                opts.tags=opts.element.data("select2Tags");
            }

            if (select) {
                opts.query = this.bind(function (query) {
                    var data = { results: [], more: false },
                        term = query.term,
                        children, placeholderOption, process;

                    process=function(element, collection) {
                        var group;
                        if (element.is("option")) {
                            if (query.matcher(term, element.text(), element)) {
                                collection.push(self.optionToData(element));
                            }
                        } else if (element.is("optgroup")) {
                            group=self.optionToData(element);
                            element.children().each2(function(i, elm) { process(elm, group.children); });
                            if (group.children.length>0) {
                                collection.push(group);
                            }
                        }
                    };

                    children=element.children();

                    // ignore the placeholder option if there is one
                    if (this.getPlaceholder() !== undefined && children.length > 0) {
                        placeholderOption = this.getPlaceholderOption();
                        if (placeholderOption) {
                            children=children.not(placeholderOption);
                        }
                    }

                    children.each2(function(i, elm) { process(elm, data.results); });

                    query.callback(data);
                });
                // this is needed because inside val() we construct choices from options and their id is hardcoded
                opts.id=function(e) { return e.id; };
            } else {
                if (!("query" in opts)) {

                    if ("ajax" in opts) {
                        ajaxUrl = opts.element.data("ajax-url");
                        if (ajaxUrl && ajaxUrl.length > 0) {
                            opts.ajax.url = ajaxUrl;
                        }
                        opts.query = ajax.call(opts.element, opts.ajax);
                    } else if ("data" in opts) {
                        opts.query = local(opts.data);
                    } else if ("tags" in opts) {
                        opts.query = tags(opts.tags);
                        if (opts.createSearchChoice === undefined) {
                            opts.createSearchChoice = function (term) { return {id: $.trim(term), text: $.trim(term)}; };
                        }
                        if (opts.initSelection === undefined) {
                            opts.initSelection = function (element, callback) {
                                var data = [];
                                $(splitVal(element.val(), opts.separator, opts.transformVal)).each(function () {
                                    var obj = { id: this, text: this },
                                        tags = opts.tags;
                                    if ($.isFunction(tags)) tags=tags();
                                    $(tags).each(function() { if (equal(this.id, obj.id)) { obj = this; return false; } });
                                    data.push(obj);
                                });

                                callback(data);
                            };
                        }
                    }
                }
            }
            if (typeof(opts.query) !== "function") {
                throw "query function not defined for Select2 " + opts.element.attr("id");
            }

            if (opts.createSearchChoicePosition === 'top') {
                opts.createSearchChoicePosition = function(list, item) { list.unshift(item); };
            }
            else if (opts.createSearchChoicePosition === 'bottom') {
                opts.createSearchChoicePosition = function(list, item) { list.push(item); };
            }
            else if (typeof(opts.createSearchChoicePosition) !== "function")  {
                throw "invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";
            }

            return opts;
        },

        /**
         * Monitor the original element for changes and update select2 accordingly
         */
        // abstract
        monitorSource: function () {
            var el = this.opts.element, observer, self = this;

            el.on("change.select2", this.bind(function (e) {
                if (this.opts.element.data("select2-change-triggered") !== true) {
                    this.initSelection();
                }
            }));

            this._sync = this.bind(function () {

                // sync enabled state
                var disabled = el.prop("disabled");
                if (disabled === undefined) disabled = false;
                this.enable(!disabled);

                var readonly = el.prop("readonly");
                if (readonly === undefined) readonly = false;
                this.readonly(readonly);

                if (this.container) {
                    syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                    this.container.addClass(evaluate(this.opts.containerCssClass, this.opts.element));
                }

                if (this.dropdown) {
                    syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                    this.dropdown.addClass(evaluate(this.opts.dropdownCssClass, this.opts.element));
                }

            });

            // IE8-10 (IE9/10 won't fire propertyChange via attachEventListener)
            if (el.length && el[0].attachEvent) {
                el.each(function() {
                    this.attachEvent("onpropertychange", self._sync);
                });
            }

            // safari, chrome, firefox, IE11
            observer = window.MutationObserver || window.WebKitMutationObserver|| window.MozMutationObserver;
            if (observer !== undefined) {
                if (this.propertyObserver) { delete this.propertyObserver; this.propertyObserver = null; }
                this.propertyObserver = new observer(function (mutations) {
                    $.each(mutations, self._sync);
                });
                this.propertyObserver.observe(el.get(0), { attributes:true, subtree:false });
            }
        },

        // abstract
        triggerSelect: function(data) {
            var evt = $.Event("select2-selecting", { val: this.id(data), object: data, choice: data });
            this.opts.element.trigger(evt);
            return !evt.isDefaultPrevented();
        },

        /**
         * Triggers the change event on the source element
         */
        // abstract
        triggerChange: function (details) {

            details = details || {};
            details= $.extend({}, details, { type: "change", val: this.val() });
            // prevents recursive triggering
            this.opts.element.data("select2-change-triggered", true);
            this.opts.element.trigger(details);
            this.opts.element.data("select2-change-triggered", false);

            // some validation frameworks ignore the change event and listen instead to keyup, click for selects
            // so here we trigger the click event manually
            this.opts.element.click();

            // ValidationEngine ignores the change event and listens instead to blur
            // so here we trigger the blur event manually if so desired
            if (this.opts.blurOnChange)
                this.opts.element.blur();
        },

        //abstract
        isInterfaceEnabled: function()
        {
            return this.enabledInterface === true;
        },

        // abstract
        enableInterface: function() {
            var enabled = this._enabled && !this._readonly,
                disabled = !enabled;

            if (enabled === this.enabledInterface) return false;

            this.container.toggleClass("select2-container-disabled", disabled);
            this.close();
            this.enabledInterface = enabled;

            return true;
        },

        // abstract
        enable: function(enabled) {
            if (enabled === undefined) enabled = true;
            if (this._enabled === enabled) return;
            this._enabled = enabled;

            this.opts.element.prop("disabled", !enabled);
            this.enableInterface();
        },

        // abstract
        disable: function() {
            this.enable(false);
        },

        // abstract
        readonly: function(enabled) {
            if (enabled === undefined) enabled = false;
            if (this._readonly === enabled) return;
            this._readonly = enabled;

            this.opts.element.prop("readonly", enabled);
            this.enableInterface();
        },

        // abstract
        opened: function () {
            return (this.container) ? this.container.hasClass("select2-dropdown-open") : false;
        },

        // abstract
        positionDropdown: function() {
            var $dropdown = this.dropdown,
                container = this.container,
                offset = container.offset(),
                height = container.outerHeight(false),
                width = container.outerWidth(false),
                dropHeight = $dropdown.outerHeight(false),
                $window = $(window),
                windowWidth = $window.width(),
                windowHeight = $window.height(),
                viewPortRight = $window.scrollLeft() + windowWidth,
                viewportBottom = $window.scrollTop() + windowHeight,
                dropTop = offset.top + height,
                dropLeft = offset.left,
                enoughRoomBelow = dropTop + dropHeight <= viewportBottom,
                enoughRoomAbove = (offset.top - dropHeight) >= $window.scrollTop(),
                dropWidth = $dropdown.outerWidth(false),
                enoughRoomOnRight = function() {
                    return dropLeft + dropWidth <= viewPortRight;
                },
                enoughRoomOnLeft = function() {
                    return offset.left + viewPortRight + container.outerWidth(false)  > dropWidth;
                },
                aboveNow = $dropdown.hasClass("select2-drop-above"),
                bodyOffset,
                above,
                changeDirection,
                css,
                resultsListNode;

            // always prefer the current above/below alignment, unless there is not enough room
            if (aboveNow) {
                above = true;
                if (!enoughRoomAbove && enoughRoomBelow) {
                    changeDirection = true;
                    above = false;
                }
            } else {
                above = false;
                if (!enoughRoomBelow && enoughRoomAbove) {
                    changeDirection = true;
                    above = true;
                }
            }

            //if we are changing direction we need to get positions when dropdown is hidden;
            if (changeDirection) {
                $dropdown.hide();
                offset = this.container.offset();
                height = this.container.outerHeight(false);
                width = this.container.outerWidth(false);
                dropHeight = $dropdown.outerHeight(false);
                viewPortRight = $window.scrollLeft() + windowWidth;
                viewportBottom = $window.scrollTop() + windowHeight;
                dropTop = offset.top + height;
                dropLeft = offset.left;
                dropWidth = $dropdown.outerWidth(false);
                $dropdown.show();

                // fix so the cursor does not move to the left within the search-textbox in IE
                this.focusSearch();
            }

            if (this.opts.dropdownAutoWidth) {
                resultsListNode = $('.select2-results', $dropdown)[0];
                $dropdown.addClass('select2-drop-auto-width');
                $dropdown.css('width', '');
                // Add scrollbar width to dropdown if vertical scrollbar is present
                dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                dropWidth > width ? width = dropWidth : dropWidth = width;
                dropHeight = $dropdown.outerHeight(false);
            }
            else {
                this.container.removeClass('select2-drop-auto-width');
            }

            //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
            //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body.scrollTop(), "enough?", enoughRoomAbove);

            // fix positioning when body has an offset and is not position: static
            if (this.body.css('position') !== 'static') {
                bodyOffset = this.body.offset();
                dropTop -= bodyOffset.top;
                dropLeft -= bodyOffset.left;
            }

            if (!enoughRoomOnRight() && enoughRoomOnLeft()) {
                dropLeft = offset.left + this.container.outerWidth(false) - dropWidth;
            }

            css =  {
                left: dropLeft,
                width: width
            };

            if (above) {
                css.top = offset.top - dropHeight;
                css.bottom = 'auto';
                this.container.addClass("select2-drop-above");
                $dropdown.addClass("select2-drop-above");
            }
            else {
                css.top = dropTop;
                css.bottom = 'auto';
                this.container.removeClass("select2-drop-above");
                $dropdown.removeClass("select2-drop-above");
            }
            css = $.extend(css, evaluate(this.opts.dropdownCss, this.opts.element));

            $dropdown.css(css);
        },

        // abstract
        shouldOpen: function() {
            var event;

            if (this.opened()) return false;

            if (this._enabled === false || this._readonly === true) return false;

            event = $.Event("select2-opening");
            this.opts.element.trigger(event);
            return !event.isDefaultPrevented();
        },

        // abstract
        clearDropdownAlignmentPreference: function() {
            // clear the classes used to figure out the preference of where the dropdown should be opened
            this.container.removeClass("select2-drop-above");
            this.dropdown.removeClass("select2-drop-above");
        },

        /**
         * Opens the dropdown
         *
         * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
         * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
         */
        // abstract
        open: function () {

            if (!this.shouldOpen()) return false;

            this.opening();

            // Only bind the document mousemove when the dropdown is visible
            $document.on("mousemove.select2Event", function (e) {
                lastMousePosition.x = e.pageX;
                lastMousePosition.y = e.pageY;
            });

            return true;
        },

        /**
         * Performs the opening of the dropdown
         */
        // abstract
        opening: function() {
            var cid = this.containerEventName,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid,
                mask;

            this.container.addClass("select2-dropdown-open").addClass("select2-container-active");

            this.clearDropdownAlignmentPreference();

            if(this.dropdown[0] !== this.body.children().last()[0]) {
                this.dropdown.detach().appendTo(this.body);
            }

            // create the dropdown mask if doesn't already exist
            mask = $("#select2-drop-mask");
            if (mask.length === 0) {
                mask = $(document.createElement("div"));
                mask.attr("id","select2-drop-mask").attr("class","select2-drop-mask");
                mask.hide();
                mask.appendTo(this.body);
                mask.on("mousedown touchstart click", function (e) {
                    // Prevent IE from generating a click event on the body
                    reinsertElement(mask);

                    var dropdown = $("#select2-drop"), self;
                    if (dropdown.length > 0) {
                        self=dropdown.data("select2");
                        if (self.opts.selectOnBlur) {
                            self.selectHighlighted({noFocus: true});
                        }
                        self.close();
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
            }

            // ensure the mask is always right before the dropdown
            if (this.dropdown.prev()[0] !== mask[0]) {
                this.dropdown.before(mask);
            }

            // move the global id to the correct dropdown
            $("#select2-drop").removeAttr("id");
            this.dropdown.attr("id", "select2-drop");

            // show the elements
            mask.show();

            this.positionDropdown();
            this.dropdown.show();
            this.positionDropdown();

            this.dropdown.addClass("select2-drop-active");

            // attach listeners to events that can change the position of the container and thus require
            // the position of the dropdown to be updated as well so it does not come unglued from the container
            var that = this;
            this.container.parents().add(window).each(function () {
                $(this).on(resize+" "+scroll+" "+orient, function (e) {
                    if (that.opened()) that.positionDropdown();
                });
            });


        },

        // abstract
        close: function () {
            if (!this.opened()) return;

            var cid = this.containerEventName,
                scroll = "scroll." + cid,
                resize = "resize."+cid,
                orient = "orientationchange."+cid;

            // unbind event listeners
            this.container.parents().add(window).each(function () { $(this).off(scroll).off(resize).off(orient); });

            this.clearDropdownAlignmentPreference();

            $("#select2-drop-mask").hide();
            this.dropdown.removeAttr("id"); // only the active dropdown has the select2-drop id
            this.dropdown.hide();
            this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
            this.results.empty();

            // Now that the dropdown is closed, unbind the global document mousemove event
            $document.off("mousemove.select2Event");

            this.clearSearch();
            this.search.removeClass("select2-active");
            this.opts.element.trigger($.Event("select2-close"));
        },

        /**
         * Opens control, sets input value, and updates results.
         */
        // abstract
        externalSearch: function (term) {
            this.open();
            this.search.val(term);
            this.updateResults(false);
        },

        // abstract
        clearSearch: function () {

        },

        //abstract
        getMaximumSelectionSize: function() {
            return evaluate(this.opts.maximumSelectionSize, this.opts.element);
        },

        // abstract
        ensureHighlightVisible: function () {
            var results = this.results, children, index, child, hb, rb, y, more, topOffset;

            index = this.highlight();

            if (index < 0) return;

            if (index == 0) {

                // if the first element is highlighted scroll all the way to the top,
                // that way any unselectable headers above it will also be scrolled
                // into view

                results.scrollTop(0);
                return;
            }

            children = this.findHighlightableChoices().find('.select2-result-label');

            child = $(children[index]);

            topOffset = (child.offset() || {}).top || 0;

            hb = topOffset + child.outerHeight(true);

            // if this is the last child lets also make sure select2-more-results is visible
            if (index === children.length - 1) {
                more = results.find("li.select2-more-results");
                if (more.length > 0) {
                    hb = more.offset().top + more.outerHeight(true);
                }
            }

            rb = results.offset().top + results.outerHeight(false);
            if (hb > rb) {
                results.scrollTop(results.scrollTop() + (hb - rb));
            }
            y = topOffset - results.offset().top;

            // make sure the top of the element is visible
            if (y < 0 && child.css('display') != 'none' ) {
                results.scrollTop(results.scrollTop() + y); // y is negative
            }
        },

        // abstract
        findHighlightableChoices: function() {
            return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");
        },

        // abstract
        moveHighlight: function (delta) {
            var choices = this.findHighlightableChoices(),
                index = this.highlight();

            while (index > -1 && index < choices.length) {
                index += delta;
                var choice = $(choices[index]);
                if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                    this.highlight(index);
                    break;
                }
            }
        },

        // abstract
        highlight: function (index) {
            var choices = this.findHighlightableChoices(),
                choice,
                data;

            if (arguments.length === 0) {
                return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
            }

            if (index >= choices.length) index = choices.length - 1;
            if (index < 0) index = 0;

            this.removeHighlight();

            choice = $(choices[index]);
            choice.addClass("select2-highlighted");

            // ensure assistive technology can determine the active choice
            this.search.attr("aria-activedescendant", choice.find(".select2-result-label").attr("id"));

            this.ensureHighlightVisible();

            this.liveRegion.text(choice.text());

            data = choice.data("select2-data");
            if (data) {
                this.opts.element.trigger({ type: "select2-highlight", val: this.id(data), choice: data });
            }
        },

        removeHighlight: function() {
            this.results.find(".select2-highlighted").removeClass("select2-highlighted");
        },

        touchMoved: function() {
            this._touchMoved = true;
        },

        clearTouchMoved: function() {
          this._touchMoved = false;
        },

        // abstract
        countSelectableResults: function() {
            return this.findHighlightableChoices().length;
        },

        // abstract
        highlightUnderEvent: function (event) {
            var el = $(event.target).closest(".select2-result-selectable");
            if (el.length > 0 && !el.is(".select2-highlighted")) {
                var choices = this.findHighlightableChoices();
                this.highlight(choices.index(el));
            } else if (el.length == 0) {
                // if we are over an unselectable item remove all highlights
                this.removeHighlight();
            }
        },

        // abstract
        loadMoreIfNeeded: function () {
            var results = this.results,
                more = results.find("li.select2-more-results"),
                below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                page = this.resultsPage + 1,
                self=this,
                term=this.search.val(),
                context=this.context;

            if (more.length === 0) return;
            below = more.offset().top - results.offset().top - results.height();

            if (below <= this.opts.loadMorePadding) {
                more.addClass("select2-active");
                this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function (data) {

                    // ignore a response if the select2 has been closed before it was received
                    if (!self.opened()) return;


                    self.opts.populateResults.call(this, results, data.results, {term: term, page: page, context:context});
                    self.postprocessResults(data, false, false);

                    if (data.more===true) {
                        more.detach().appendTo(results).html(self.opts.escapeMarkup(evaluate(self.opts.formatLoadMore, self.opts.element, page+1)));
                        window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                    } else {
                        more.remove();
                    }
                    self.positionDropdown();
                    self.resultsPage = page;
                    self.context = data.context;
                    this.opts.element.trigger({ type: "select2-loaded", items: data });
                })});
            }
        },

        /**
         * Default tokenizer function which does nothing
         */
        tokenize: function() {

        },

        /**
         * @param initial whether or not this is the call to this method right after the dropdown has been opened
         */
        // abstract
        updateResults: function (initial) {
            var search = this.search,
                results = this.results,
                opts = this.opts,
                data,
                self = this,
                input,
                term = search.val(),
                lastTerm = $.data(this.container, "select2-last-term"),
                // sequence number used to drop out-of-order responses
                queryNumber;

            // prevent duplicate queries against the same term
            if (initial !== true && lastTerm && equal(term, lastTerm)) return;

            $.data(this.container, "select2-last-term", term);

            // if the search is currently hidden we do not alter the results
            if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                return;
            }

            function postRender() {
                search.removeClass("select2-active");
                self.positionDropdown();
                if (results.find('.select2-no-results,.select2-selection-limit,.select2-searching').length) {
                    self.liveRegion.text(results.text());
                }
                else {
                    self.liveRegion.text(self.opts.formatMatches(results.find('.select2-result-selectable:not(".select2-selected")').length));
                }
            }

            function render(html) {
                results.html(html);
                postRender();
            }

            queryNumber = ++this.queryCount;

            var maxSelSize = this.getMaximumSelectionSize();
            if (maxSelSize >=1) {
                data = this.data();
                if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                    render("<li class='select2-selection-limit'>" + evaluate(opts.formatSelectionTooBig, opts.element, maxSelSize) + "</li>");
                    return;
                }
            }

            if (search.val().length < opts.minimumInputLength) {
                if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooShort, opts.element, search.val(), opts.minimumInputLength) + "</li>");
                } else {
                    render("");
                }
                if (initial && this.showSearch) this.showSearch(true);
                return;
            }

            if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooLong, opts.element, search.val(), opts.maximumInputLength) + "</li>");
                } else {
                    render("");
                }
                return;
            }

            if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                render("<li class='select2-searching'>" + evaluate(opts.formatSearching, opts.element) + "</li>");
            }

            search.addClass("select2-active");

            this.removeHighlight();

            // give the tokenizer a chance to pre-process the input
            input = this.tokenize();
            if (input != undefined && input != null) {
                search.val(input);
            }

            this.resultsPage = 1;

            opts.query({
                element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function (data) {
                var def; // default choice

                // ignore old responses
                if (queryNumber != this.queryCount) {
                  return;
                }

                // ignore a response if the select2 has been closed before it was received
                if (!this.opened()) {
                    this.search.removeClass("select2-active");
                    return;
                }

                // handle ajax error
                if(data.hasError !== undefined && checkFormatter(opts.formatAjaxError, "formatAjaxError")) {
                    render("<li class='select2-ajax-error'>" + evaluate(opts.formatAjaxError, opts.element, data.jqXHR, data.textStatus, data.errorThrown) + "</li>");
                    return;
                }

                // save context, if any
                this.context = (data.context===undefined) ? null : data.context;
                // create a default choice and prepend it to the list
                if (this.opts.createSearchChoice && search.val() !== "") {
                    def = this.opts.createSearchChoice.call(self, search.val(), data.results);
                    if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                        if ($(data.results).filter(
                            function () {
                                return equal(self.id(this), self.id(def));
                            }).length === 0) {
                            this.opts.createSearchChoicePosition(data.results, def);
                        }
                    }
                }

                if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                    render("<li class='select2-no-results'>" + evaluate(opts.formatNoMatches, opts.element, search.val()) + "</li>");
                    return;
                }

                results.empty();
                self.opts.populateResults.call(this, results, data.results, {term: search.val(), page: this.resultsPage, context:null});

                if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                    results.append("<li class='select2-more-results'>" + opts.escapeMarkup(evaluate(opts.formatLoadMore, opts.element, this.resultsPage)) + "</li>");
                    window.setTimeout(function() { self.loadMoreIfNeeded(); }, 10);
                }

                this.postprocessResults(data, initial);

                postRender();

                this.opts.element.trigger({ type: "select2-loaded", items: data });
            })});
        },

        // abstract
        cancel: function () {
            this.close();
        },

        // abstract
        blur: function () {
            // if selectOnBlur == true, select the currently highlighted option
            if (this.opts.selectOnBlur)
                this.selectHighlighted({noFocus: true});

            this.close();
            this.container.removeClass("select2-container-active");
            // synonymous to .is(':focus'), which is available in jquery >= 1.6
            if (this.search[0] === document.activeElement) { this.search.blur(); }
            this.clearSearch();
            this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
        },

        // abstract
        focusSearch: function () {
            focus(this.search);
        },

        // abstract
        selectHighlighted: function (options) {
            if (this._touchMoved) {
              this.clearTouchMoved();
              return;
            }
            var index=this.highlight(),
                highlighted=this.results.find(".select2-highlighted"),
                data = highlighted.closest('.select2-result').data("select2-data");

            if (data) {
                this.highlight(index);
                this.onSelect(data, options);
            } else if (options && options.noFocus) {
                this.close();
            }
        },

        // abstract
        getPlaceholder: function () {
            var placeholderOption;
            return this.opts.element.attr("placeholder") ||
                this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") ||
                this.opts.placeholder ||
                ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
        },

        // abstract
        getPlaceholderOption: function() {
            if (this.select) {
                var firstOption = this.select.children('option').first();
                if (this.opts.placeholderOption !== undefined ) {
                    //Determine the placeholder option based on the specified placeholderOption setting
                    return (this.opts.placeholderOption === "first" && firstOption) ||
                           (typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select));
                } else if ($.trim(firstOption.text()) === "" && firstOption.val() === "") {
                    //No explicit placeholder option specified, use the first if it's blank
                    return firstOption;
                }
            }
        },

        /**
         * Get the desired width for the container element.  This is
         * derived first from option `width` passed to select2, then
         * the inline 'style' on the original element, and finally
         * falls back to the jQuery calculated element width.
         */
        // abstract
        initContainerWidth: function () {
            function resolveContainerWidth() {
                var style, attrs, matches, i, l, attr;

                if (this.opts.width === "off") {
                    return null;
                } else if (this.opts.width === "element"){
                    return this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px';
                } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                    // check if there is inline style on the element that contains width
                    style = this.opts.element.attr('style');
                    if (style !== undefined) {
                        attrs = style.split(';');
                        for (i = 0, l = attrs.length; i < l; i = i + 1) {
                            attr = attrs[i].replace(/\s/g, '');
                            matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                            if (matches !== null && matches.length >= 1)
                                return matches[1];
                        }
                    }

                    if (this.opts.width === "resolve") {
                        // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                        // when attached to input type=hidden or elements hidden via css
                        style = this.opts.element.css('width');
                        if (style.indexOf("%") > 0) return style;

                        // finally, fallback on the calculated width of the element
                        return (this.opts.element.outerWidth(false) === 0 ? 'auto' : this.opts.element.outerWidth(false) + 'px');
                    }

                    return null;
                } else if ($.isFunction(this.opts.width)) {
                    return this.opts.width();
                } else {
                    return this.opts.width;
               }
            };

            var width = resolveContainerWidth.call(this);
            if (width !== null) {
                this.container.css("width", width);
            }
        }
    });

    SingleSelect2 = clazz(AbstractSelect2, {

        // single

        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container"
            }).html([
                "<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>",
                "   <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>",
                "   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>",
                "</a>",
                "<label for='' class='select2-offscreen'></label>",
                "<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />",
                "<div class='select2-drop select2-display-none'>",
                "   <div class='select2-search'>",
                "       <label for='' class='select2-offscreen'></label>",
                "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'",
                "       aria-autocomplete='list' />",
                "   </div>",
                "   <ul class='select2-results' role='listbox'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // single
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.focusser.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // single
        opening: function () {
            var el, range, len;

            if (this.opts.minimumResultsForSearch >= 0) {
                this.showSearch(true);
            }

            this.parent.opening.apply(this, arguments);

            if (this.showSearchInput !== false) {
                // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                // all other browsers handle this just fine

                this.search.val(this.focusser.val());
            }
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
                // move the cursor to the end after focussing, otherwise it will be at the beginning and
                // new text will appear *before* focusser.val()
                el = this.search.get(0);
                if (el.createTextRange) {
                    range = el.createTextRange();
                    range.collapse(false);
                    range.select();
                } else if (el.setSelectionRange) {
                    len = this.search.val().length;
                    el.setSelectionRange(len, len);
                }
            }

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.focusser.prop("disabled", true).val("");
            this.updateResults(true);
            this.opts.element.trigger($.Event("select2-open"));
        },

        // single
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);

            this.focusser.prop("disabled", false);

            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        },

        // single
        focus: function () {
            if (this.opened()) {
                this.close();
            } else {
                this.focusser.prop("disabled", false);
                if (this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
            }
        },

        // single
        isFocused: function () {
            return this.container.hasClass("select2-container-active");
        },

        // single
        cancel: function () {
            this.parent.cancel.apply(this, arguments);
            this.focusser.prop("disabled", false);

            if (this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }
        },

        // single
        destroy: function() {
            $("label[for='" + this.focusser.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);

            cleanupJQueryElements.call(this,
                "selection",
                "focusser"
            );
        },

        // single
        initContainer: function () {

            var selection,
                container = this.container,
                dropdown = this.dropdown,
                idSuffix = nextUid(),
                elementLabel;

            if (this.opts.minimumResultsForSearch < 0) {
                this.showSearch(false);
            } else {
                this.showSearch(true);
            }

            this.selection = selection = container.find(".select2-choice");

            this.focusser = container.find(".select2-focusser");

            // add aria associations
            selection.find(".select2-chosen").attr("id", "select2-chosen-"+idSuffix);
            this.focusser.attr("aria-labelledby", "select2-chosen-"+idSuffix);
            this.results.attr("id", "select2-results-"+idSuffix);
            this.search.attr("aria-owns", "select2-results-"+idSuffix);

            // rewrite labels from original element to focusser
            this.focusser.attr("id", "s2id_autogen"+idSuffix);

            elementLabel = $("label[for='" + this.opts.element.attr("id") + "']");
            this.opts.element.focus(this.bind(function () { this.focus(); }));

            this.focusser.prev()
                .text(elementLabel.text())
                .attr('for', this.focusser.attr('id'));

            // Ensure the original element retains an accessible name
            var originalTitle = this.opts.element.attr("title");
            this.opts.element.attr("title", (originalTitle || elementLabel.text()));

            this.focusser.attr("tabindex", this.elementTabIndex);

            // write label for search field using the label from the focusser element
            this.search.attr("id", this.focusser.attr('id') + '_search');

            this.search.prev()
                .text($("label[for='" + this.focusser.attr('id') + "']").text())
                .attr('for', this.search.attr('id'));

            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                // filter 229 keyCodes (input method editor is processing key input)
                if (229 == e.keyCode) return;

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                    return;
                }

                switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus: true});
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                }
            }));

            this.search.on("blur", this.bind(function(e) {
                // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                // without this the search field loses focus which is annoying
                if (document.activeElement === this.body.get(0)) {
                    window.setTimeout(this.bind(function() {
                        if (this.opened()) {
                            this.search.focus();
                        }
                    }), 0);
                }
            }));

            this.focusser.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                    return;
                }

                if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DOWN || e.which == KEY.UP
                    || (e.which == KEY.ENTER && this.opts.openOnEnter)) {

                    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;

                    this.open();
                    killEvent(e);
                    return;
                }

                if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                    if (this.opts.allowClear) {
                        this.clear();
                    }
                    killEvent(e);
                    return;
                }
            }));


            installKeyUpChangeEvent(this.focusser);
            this.focusser.on("keyup-change input", this.bind(function(e) {
                if (this.opts.minimumResultsForSearch >= 0) {
                    e.stopPropagation();
                    if (this.opened()) return;
                    this.open();
                }
            }));

            selection.on("mousedown touchstart", "abbr", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) {
                    return;
                }

                this.clear();
                killEventImmediately(e);
                this.close();

                if (this.selection) {
                    this.selection.focus();
                }
            }));

            selection.on("mousedown touchstart", this.bind(function (e) {
                // Prevent IE from generating a click event on the body
                reinsertElement(selection);

                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }

                if (this.opened()) {
                    this.close();
                } else if (this.isInterfaceEnabled()) {
                    this.open();
                }

                killEvent(e);
            }));

            dropdown.on("mousedown touchstart", this.bind(function() {
                if (this.opts.shouldFocusInput(this)) {
                    this.search.focus();
                }
            }));

            selection.on("focus", this.bind(function(e) {
                killEvent(e);
            }));

            this.focusser.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            })).on("blur", this.bind(function() {
                if (!this.opened()) {
                    this.container.removeClass("select2-container-active");
                    this.opts.element.trigger($.Event("select2-blur"));
                }
            }));
            this.search.on("focus", this.bind(function(){
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
            }));

            this.initContainerWidth();
            this.opts.element.hide();
            this.setPlaceholder();

        },

        // single
        clear: function(triggerChange) {
            var data=this.selection.data("select2-data");
            if (data) { // guard against queued quick consecutive clicks
                var evt = $.Event("select2-clearing");
                this.opts.element.trigger(evt);
                if (evt.isDefaultPrevented()) {
                    return;
                }
                var placeholderOption = this.getPlaceholderOption();
                this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
                this.selection.find(".select2-chosen").empty();
                this.selection.removeData("select2-data");
                this.setPlaceholder();

                if (triggerChange !== false){
                    this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
                    this.triggerChange({removed:data});
                }
            }
        },

        /**
         * Sets selection based on source element's value
         */
        // single
        initSelection: function () {
            var selected;
            if (this.isPlaceholderOptionSelected()) {
                this.updateSelection(null);
                this.close();
                this.setPlaceholder();
            } else {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(selected){
                    if (selected !== undefined && selected !== null) {
                        self.updateSelection(selected);
                        self.close();
                        self.setPlaceholder();
                        self.nextSearchTerm = self.opts.nextSearchTerm(selected, self.search.val());
                    }
                });
            }
        },

        isPlaceholderOptionSelected: function() {
            var placeholderOption;
            if (this.getPlaceholder() === undefined) return false; // no placeholder specified so no option should be considered
            return ((placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected"))
                || (this.opts.element.val() === "")
                || (this.opts.element.val() === undefined)
                || (this.opts.element.val() === null);
        },

        // single
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {
                    var selected = element.find("option").filter(function() { return this.selected && !this.disabled });
                    // a single select box always has a value, no need to null check 'selected'
                    callback(self.optionToData(selected));
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var id = element.val();
                    //search in data by id, storing the actual matching item
                    var match = null;
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = equal(id, opts.id(el));
                            if (is_match) {
                                match = el;
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            callback(match);
                        }
                    });
                };
            }

            return opts;
        },

        // single
        getPlaceholder: function() {
            // if a placeholder is specified on a single select without a valid placeholder option ignore it
            if (this.select) {
                if (this.getPlaceholderOption() === undefined) {
                    return undefined;
                }
            }

            return this.parent.getPlaceholder.apply(this, arguments);
        },

        // single
        setPlaceholder: function () {
            var placeholder = this.getPlaceholder();

            if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {

                // check for a placeholder option if attached to a select
                if (this.select && this.getPlaceholderOption() === undefined) return;

                this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));

                this.selection.addClass("select2-default");

                this.container.removeClass("select2-allowclear");
            }
        },

        // single
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var selected = 0, self = this, showSearchInput = true;

            // find the selected element in the result list

            this.findHighlightableChoices().each2(function (i, elm) {
                if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                    selected = i;
                    return false;
                }
            });

            // and highlight it
            if (noHighlightUpdate !== false) {
                if (initial === true && selected >= 0) {
                    this.highlight(selected);
                } else {
                    this.highlight(0);
                }
            }

            // hide the search box if this is the first we got the results and there are enough of them for search

            if (initial === true) {
                var min = this.opts.minimumResultsForSearch;
                if (min >= 0) {
                    this.showSearch(countResults(data.results) >= min);
                }
            }
        },

        // single
        showSearch: function(showSearchInput) {
            if (this.showSearchInput === showSearchInput) return;

            this.showSearchInput = showSearchInput;

            this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
            this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
            //add "select2-with-searchbox" to the container if search box is shown
            $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
        },

        // single
        onSelect: function (data, options) {

            if (!this.triggerSelect(data)) { return; }

            var old = this.opts.element.val(),
                oldData = this.data();

            this.opts.element.val(this.id(data));
            this.updateSelection(data);

            this.opts.element.trigger({ type: "select2-selected", val: this.id(data), choice: data });

            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
            this.close();

            if ((!options || !options.noFocus) && this.opts.shouldFocusInput(this)) {
                this.focusser.focus();
            }

            if (!equal(old, this.id(data))) {
                this.triggerChange({ added: data, removed: oldData });
            }
        },

        // single
        updateSelection: function (data) {

            var container=this.selection.find(".select2-chosen"), formatted, cssClass;

            this.selection.data("select2-data", data);

            container.empty();
            if (data !== null) {
                formatted=this.opts.formatSelection(data, container, this.opts.escapeMarkup);
            }
            if (formatted !== undefined) {
                container.append(formatted);
            }
            cssClass=this.opts.formatSelectionCssClass(data, container);
            if (cssClass !== undefined) {
                container.addClass(cssClass);
            }

            this.selection.removeClass("select2-default");

            if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                this.container.addClass("select2-allowclear");
            }
        },

        // single
        val: function () {
            var val,
                triggerChange = false,
                data = null,
                self = this,
                oldData = this.data();

            if (arguments.length === 0) {
                return this.opts.element.val();
            }

            val = arguments[0];

            if (arguments.length > 1) {
                triggerChange = arguments[1];
            }

            if (this.select) {
                this.select
                    .val(val)
                    .find("option").filter(function() { return this.selected }).each2(function (i, elm) {
                        data = self.optionToData(elm);
                        return false;
                    });
                this.updateSelection(data);
                this.setPlaceholder();
                if (triggerChange) {
                    this.triggerChange({added: data, removed:oldData});
                }
            } else {
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.clear(triggerChange);
                    return;
                }
                if (this.opts.initSelection === undefined) {
                    throw new Error("cannot call val() if initSelection() is not defined");
                }
                this.opts.element.val(val);
                this.opts.initSelection(this.opts.element, function(data){
                    self.opts.element.val(!data ? "" : self.id(data));
                    self.updateSelection(data);
                    self.setPlaceholder();
                    if (triggerChange) {
                        self.triggerChange({added: data, removed:oldData});
                    }
                });
            }
        },

        // single
        clearSearch: function () {
            this.search.val("");
            this.focusser.val("");
        },

        // single
        data: function(value) {
            var data,
                triggerChange = false;

            if (arguments.length === 0) {
                data = this.selection.data("select2-data");
                if (data == undefined) data = null;
                return data;
            } else {
                if (arguments.length > 1) {
                    triggerChange = arguments[1];
                }
                if (!value) {
                    this.clear(triggerChange);
                } else {
                    data = this.data();
                    this.opts.element.val(!value ? "" : this.id(value));
                    this.updateSelection(value);
                    if (triggerChange) {
                        this.triggerChange({added: value, removed:data});
                    }
                }
            }
        }
    });

    MultiSelect2 = clazz(AbstractSelect2, {

        // multi
        createContainer: function () {
            var container = $(document.createElement("div")).attr({
                "class": "select2-container select2-container-multi"
            }).html([
                "<ul class='select2-choices'>",
                "  <li class='select2-search-field'>",
                "    <label for='' class='select2-offscreen'></label>",
                "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>",
                "  </li>",
                "</ul>",
                "<div class='select2-drop select2-drop-multi select2-display-none'>",
                "   <ul class='select2-results'>",
                "   </ul>",
                "</div>"].join(""));
            return container;
        },

        // multi
        prepareOpts: function () {
            var opts = this.parent.prepareOpts.apply(this, arguments),
                self=this;

            // TODO validate placeholder is a string if specified
            if (opts.element.get(0).tagName.toLowerCase() === "select") {
                // install the selection initializer
                opts.initSelection = function (element, callback) {

                    var data = [];

                    element.find("option").filter(function() { return this.selected && !this.disabled }).each2(function (i, elm) {
                        data.push(self.optionToData(elm));
                    });
                    callback(data);
                };
            } else if ("data" in opts) {
                // install default initSelection when applied to hidden input and data is local
                opts.initSelection = opts.initSelection || function (element, callback) {
                    var ids = splitVal(element.val(), opts.separator, opts.transformVal);
                    //search in data by array of ids, storing matching items in a list
                    var matches = [];
                    opts.query({
                        matcher: function(term, text, el){
                            var is_match = $.grep(ids, function(id) {
                                return equal(id, opts.id(el));
                            }).length;
                            if (is_match) {
                                matches.push(el);
                            }
                            return is_match;
                        },
                        callback: !$.isFunction(callback) ? $.noop : function() {
                            // reorder matches based on the order they appear in the ids array because right now
                            // they are in the order in which they appear in data array
                            var ordered = [];
                            for (var i = 0; i < ids.length; i++) {
                                var id = ids[i];
                                for (var j = 0; j < matches.length; j++) {
                                    var match = matches[j];
                                    if (equal(id, opts.id(match))) {
                                        ordered.push(match);
                                        matches.splice(j, 1);
                                        break;
                                    }
                                }
                            }
                            callback(ordered);
                        }
                    });
                };
            }

            return opts;
        },

        // multi
        selectChoice: function (choice) {

            var selected = this.container.find(".select2-search-choice-focus");
            if (selected.length && choice && choice[0] == selected[0]) {

            } else {
                if (selected.length) {
                    this.opts.element.trigger("choice-deselected", selected);
                }
                selected.removeClass("select2-search-choice-focus");
                if (choice && choice.length) {
                    this.close();
                    choice.addClass("select2-search-choice-focus");
                    this.opts.element.trigger("choice-selected", choice);
                }
            }
        },

        // multi
        destroy: function() {
            $("label[for='" + this.search.attr('id') + "']")
                .attr('for', this.opts.element.attr("id"));
            this.parent.destroy.apply(this, arguments);

            cleanupJQueryElements.call(this,
                "searchContainer",
                "selection"
            );
        },

        // multi
        initContainer: function () {

            var selector = ".select2-choices", selection;

            this.searchContainer = this.container.find(".select2-search-field");
            this.selection = selection = this.container.find(selector);

            var _this = this;
            this.selection.on("click", ".select2-container:not(.select2-container-disabled) .select2-search-choice:not(.select2-locked)", function (e) {
                _this.search[0].focus();
                _this.selectChoice($(this));
            });

            // rewrite labels from original element to focusser
            this.search.attr("id", "s2id_autogen"+nextUid());

            this.search.prev()
                .text($("label[for='" + this.opts.element.attr("id") + "']").text())
                .attr('for', this.search.attr('id'));
            this.opts.element.focus(this.bind(function () { this.focus(); }));

            this.search.on("input paste", this.bind(function() {
                if (this.search.attr('placeholder') && this.search.val().length == 0) return;
                if (!this.isInterfaceEnabled()) return;
                if (!this.opened()) {
                    this.open();
                }
            }));

            this.search.attr("tabindex", this.elementTabIndex);

            this.keydowns = 0;
            this.search.on("keydown", this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;

                ++this.keydowns;
                var selected = selection.find(".select2-search-choice-focus");
                var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
                var next = selected.next(".select2-search-choice:not(.select2-locked)");
                var pos = getCursorInfo(this.search);

                if (selected.length &&
                    (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                    var selectedChoice = selected;
                    if (e.which == KEY.LEFT && prev.length) {
                        selectedChoice = prev;
                    }
                    else if (e.which == KEY.RIGHT) {
                        selectedChoice = next.length ? next : null;
                    }
                    else if (e.which === KEY.BACKSPACE) {
                        if (this.unselect(selected.first())) {
                            this.search.width(10);
                            selectedChoice = prev.length ? prev : next;
                        }
                    } else if (e.which == KEY.DELETE) {
                        if (this.unselect(selected.first())) {
                            this.search.width(10);
                            selectedChoice = next.length ? next : null;
                        }
                    } else if (e.which == KEY.ENTER) {
                        selectedChoice = null;
                    }

                    this.selectChoice(selectedChoice);
                    killEvent(e);
                    if (!selectedChoice || !selectedChoice.length) {
                        this.open();
                    }
                    return;
                } else if (((e.which === KEY.BACKSPACE && this.keydowns == 1)
                    || e.which == KEY.LEFT) && (pos.offset == 0 && !pos.length)) {

                    this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());
                    killEvent(e);
                    return;
                } else {
                    this.selectChoice(null);
                }

                if (this.opened()) {
                    switch (e.which) {
                    case KEY.UP:
                    case KEY.DOWN:
                        this.moveHighlight((e.which === KEY.UP) ? -1 : 1);
                        killEvent(e);
                        return;
                    case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;
                    case KEY.TAB:
                        this.selectHighlighted({noFocus:true});
                        this.close();
                        return;
                    case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }

                if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e)
                 || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                    return;
                }

                if (e.which === KEY.ENTER) {
                    if (this.opts.openOnEnter === false) {
                        return;
                    } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                        return;
                    }
                }

                this.open();

                if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                    // prevent the page from scrolling
                    killEvent(e);
                }

                if (e.which === KEY.ENTER) {
                    // prevent form from being submitted
                    killEvent(e);
                }

            }));

            this.search.on("keyup", this.bind(function (e) {
                this.keydowns = 0;
                this.resizeSearch();
            })
            );

            this.search.on("blur", this.bind(function(e) {
                this.container.removeClass("select2-container-active");
                this.search.removeClass("select2-focused");
                this.selectChoice(null);
                if (!this.opened()) this.clearSearch();
                e.stopImmediatePropagation();
                this.opts.element.trigger($.Event("select2-blur"));
            }));

            this.container.on("click", selector, this.bind(function (e) {
                if (!this.isInterfaceEnabled()) return;
                if ($(e.target).closest(".select2-search-choice").length > 0) {
                    // clicked inside a select2 search choice, do not open
                    return;
                }
                this.selectChoice(null);
                this.clearPlaceholder();
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.open();
                this.focusSearch();
                e.preventDefault();
            }));

            this.container.on("focus", selector, this.bind(function () {
                if (!this.isInterfaceEnabled()) return;
                if (!this.container.hasClass("select2-container-active")) {
                    this.opts.element.trigger($.Event("select2-focus"));
                }
                this.container.addClass("select2-container-active");
                this.dropdown.addClass("select2-drop-active");
                this.clearPlaceholder();
            }));

            this.initContainerWidth();
            this.opts.element.hide();

            // set the placeholder if necessary
            this.clearSearch();
        },

        // multi
        enableInterface: function() {
            if (this.parent.enableInterface.apply(this, arguments)) {
                this.search.prop("disabled", !this.isInterfaceEnabled());
            }
        },

        // multi
        initSelection: function () {
            var data;
            if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                this.updateSelection([]);
                this.close();
                // set the placeholder if necessary
                this.clearSearch();
            }
            if (this.select || this.opts.element.val() !== "") {
                var self = this;
                this.opts.initSelection.call(null, this.opts.element, function(data){
                    if (data !== undefined && data !== null) {
                        self.updateSelection(data);
                        self.close();
                        // set the placeholder if necessary
                        self.clearSearch();
                    }
                });
            }
        },

        // multi
        clearSearch: function () {
            var placeholder = this.getPlaceholder(),
                maxWidth = this.getMaxSearchWidth();

            if (placeholder !== undefined  && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                this.search.val(placeholder).addClass("select2-default");
                // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
            } else {
                this.search.val("").width(10);
            }
        },

        // multi
        clearPlaceholder: function () {
            if (this.search.hasClass("select2-default")) {
                this.search.val("").removeClass("select2-default");
            }
        },

        // multi
        opening: function () {
            this.clearPlaceholder(); // should be done before super so placeholder is not used to search
            this.resizeSearch();

            this.parent.opening.apply(this, arguments);

            this.focusSearch();

            // initializes search's value with nextSearchTerm (if defined by user)
            // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
            if(this.search.val() === "") {
                if(this.nextSearchTerm != undefined){
                    this.search.val(this.nextSearchTerm);
                    this.search.select();
                }
            }

            this.updateResults(true);
            if (this.opts.shouldFocusInput(this)) {
                this.search.focus();
            }
            this.opts.element.trigger($.Event("select2-open"));
        },

        // multi
        close: function () {
            if (!this.opened()) return;
            this.parent.close.apply(this, arguments);
        },

        // multi
        focus: function () {
            this.close();
            this.search.focus();
        },

        // multi
        isFocused: function () {
            return this.search.hasClass("select2-focused");
        },

        // multi
        updateSelection: function (data) {
            var ids = [], filtered = [], self = this;

            // filter out duplicates
            $(data).each(function () {
                if (indexOf(self.id(this), ids) < 0) {
                    ids.push(self.id(this));
                    filtered.push(this);
                }
            });
            data = filtered;

            this.selection.find(".select2-search-choice").remove();
            $(data).each(function () {
                self.addSelectedChoice(this);
            });
            self.postprocessResults();
        },

        // multi
        tokenize: function() {
            var input = this.search.val();
            input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
            if (input != null && input != undefined) {
                this.search.val(input);
                if (input.length > 0) {
                    this.open();
                }
            }

        },

        // multi
        onSelect: function (data, options) {

            if (!this.triggerSelect(data) || data.text === "") { return; }

            this.addSelectedChoice(data);

            this.opts.element.trigger({ type: "selected", val: this.id(data), choice: data });

            // keep track of the search's value before it gets cleared
            this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());

            this.clearSearch();
            this.updateResults();

            if (this.select || !this.opts.closeOnSelect) this.postprocessResults(data, false, this.opts.closeOnSelect===true);

            if (this.opts.closeOnSelect) {
                this.close();
                this.search.width(10);
            } else {
                if (this.countSelectableResults()>0) {
                    this.search.width(10);
                    this.resizeSearch();
                    if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                        // if we reached max selection size repaint the results so choices
                        // are replaced with the max selection reached message
                        this.updateResults(true);
                    } else {
                        // initializes search's value with nextSearchTerm and update search result
                        if(this.nextSearchTerm != undefined){
                            this.search.val(this.nextSearchTerm);
                            this.updateResults();
                            this.search.select();
                        }
                    }
                    this.positionDropdown();
                } else {
                    // if nothing left to select close
                    this.close();
                    this.search.width(10);
                }
            }

            // since its not possible to select an element that has already been
            // added we do not need to check if this is a new element before firing change
            this.triggerChange({ added: data });

            if (!options || !options.noFocus)
                this.focusSearch();
        },

        // multi
        cancel: function () {
            this.close();
            this.focusSearch();
        },

        addSelectedChoice: function (data) {
            var enableChoice = !data.locked,
                enabledItem = $(
                    "<li class='select2-search-choice'>" +
                    "    <div></div>" +
                    "    <a href='#' class='select2-search-choice-close' tabindex='-1'></a>" +
                    "</li>"),
                disabledItem = $(
                    "<li class='select2-search-choice select2-locked'>" +
                    "<div></div>" +
                    "</li>");
            var choice = enableChoice ? enabledItem : disabledItem,
                id = this.id(data),
                val = this.getVal(),
                formatted,
                cssClass;

            formatted=this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
            if (formatted != undefined) {
                choice.find("div").replaceWith($("<div></div>").html(formatted));
            }
            cssClass=this.opts.formatSelectionCssClass(data, choice.find("div"));
            if (cssClass != undefined) {
                choice.addClass(cssClass);
            }

            if(enableChoice){
              choice.find(".select2-search-choice-close")
                  .on("mousedown", killEvent)
                  .on("click dblclick", this.bind(function (e) {
                  if (!this.isInterfaceEnabled()) return;

                  this.unselect($(e.target));
                  this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                  killEvent(e);
                  this.close();
                  this.focusSearch();
              })).on("focus", this.bind(function () {
                  if (!this.isInterfaceEnabled()) return;
                  this.container.addClass("select2-container-active");
                  this.dropdown.addClass("select2-drop-active");
              }));
            }

            choice.data("select2-data", data);
            choice.insertBefore(this.searchContainer);

            val.push(id);
            this.setVal(val);
        },

        // multi
        unselect: function (selected) {
            var val = this.getVal(),
                data,
                index;
            selected = selected.closest(".select2-search-choice");

            if (selected.length === 0) {
                throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
            }

            data = selected.data("select2-data");

            if (!data) {
                // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                // and invoked on an element already removed
                return;
            }

            var evt = $.Event("select2-removing");
            evt.val = this.id(data);
            evt.choice = data;
            this.opts.element.trigger(evt);

            if (evt.isDefaultPrevented()) {
                return false;
            }

            while((index = indexOf(this.id(data), val)) >= 0) {
                val.splice(index, 1);
                this.setVal(val);
                if (this.select) this.postprocessResults();
            }

            selected.remove();

            this.opts.element.trigger({ type: "select2-removed", val: this.id(data), choice: data });
            this.triggerChange({ removed: data });

            return true;
        },

        // multi
        postprocessResults: function (data, initial, noHighlightUpdate) {
            var val = this.getVal(),
                choices = this.results.find(".select2-result"),
                compound = this.results.find(".select2-result-with-children"),
                self = this;

            choices.each2(function (i, choice) {
                var id = self.id(choice.data("select2-data"));
                if (indexOf(id, val) >= 0) {
                    choice.addClass("select2-selected");
                    // mark all children of the selected parent as selected
                    choice.find(".select2-result-selectable").addClass("select2-selected");
                }
            });

            compound.each2(function(i, choice) {
                // hide an optgroup if it doesn't have any selectable children
                if (!choice.is('.select2-result-selectable')
                    && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                    choice.addClass("select2-selected");
                }
            });

            if (this.highlight() == -1 && noHighlightUpdate !== false && this.opts.closeOnSelect === true){
                self.highlight(0);
            }

            //If all results are chosen render formatNoMatches
            if(!this.opts.createSearchChoice && !choices.filter('.select2-result:not(.select2-selected)').length > 0){
                if(!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
                    if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
                        this.results.append("<li class='select2-no-results'>" + evaluate(self.opts.formatNoMatches, self.opts.element, self.search.val()) + "</li>");
                    }
                }
            }

        },

        // multi
        getMaxSearchWidth: function() {
            return this.selection.width() - getSideBorderPadding(this.search);
        },

        // multi
        resizeSearch: function () {
            var minimumWidth, left, maxWidth, containerLeft, searchWidth,
                sideBorderPadding = getSideBorderPadding(this.search);

            minimumWidth = measureTextWidth(this.search) + 10;

            left = this.search.offset().left;

            maxWidth = this.selection.width();
            containerLeft = this.selection.offset().left;

            searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;

            if (searchWidth < minimumWidth) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth < 40) {
                searchWidth = maxWidth - sideBorderPadding;
            }

            if (searchWidth <= 0) {
              searchWidth = minimumWidth;
            }

            this.search.width(Math.floor(searchWidth));
        },

        // multi
        getVal: function () {
            var val;
            if (this.select) {
                val = this.select.val();
                return val === null ? [] : val;
            } else {
                val = this.opts.element.val();
                return splitVal(val, this.opts.separator, this.opts.transformVal);
            }
        },

        // multi
        setVal: function (val) {
            var unique;
            if (this.select) {
                this.select.val(val);
            } else {
                unique = [];
                // filter out duplicates
                $(val).each(function () {
                    if (indexOf(this, unique) < 0) unique.push(this);
                });
                this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
            }
        },

        // multi
        buildChangeDetails: function (old, current) {
            var current = current.slice(0),
                old = old.slice(0);

            // remove intersection from each array
            for (var i = 0; i < current.length; i++) {
                for (var j = 0; j < old.length; j++) {
                    if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
                        current.splice(i, 1);
                        if(i>0){
                            i--;
                        }
                        old.splice(j, 1);
                        j--;
                    }
                }
            }

            return {added: current, removed: old};
        },


        // multi
        val: function (val, triggerChange) {
            var oldData, self=this;

            if (arguments.length === 0) {
                return this.getVal();
            }

            oldData=this.data();
            if (!oldData.length) oldData=[];

            // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
            if (!val && val !== 0) {
                this.opts.element.val("");
                this.updateSelection([]);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange({added: this.data(), removed: oldData});
                }
                return;
            }

            // val is a list of ids
            this.setVal(val);

            if (this.select) {
                this.opts.initSelection(this.select, this.bind(this.updateSelection));
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(oldData, this.data()));
                }
            } else {
                if (this.opts.initSelection === undefined) {
                    throw new Error("val() cannot be called if initSelection() is not defined");
                }

                this.opts.initSelection(this.opts.element, function(data){
                    var ids=$.map(data, self.id);
                    self.setVal(ids);
                    self.updateSelection(data);
                    self.clearSearch();
                    if (triggerChange) {
                        self.triggerChange(self.buildChangeDetails(oldData, self.data()));
                    }
                });
            }
            this.clearSearch();
        },

        // multi
        onSortStart: function() {
            if (this.select) {
                throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
            }

            // collapse search field into 0 width so its container can be collapsed as well
            this.search.width(0);
            // hide the container
            this.searchContainer.hide();
        },

        // multi
        onSortEnd:function() {

            var val=[], self=this;

            // show search and move it to the end of the list
            this.searchContainer.show();
            // make sure the search container is the last item in the list
            this.searchContainer.appendTo(this.searchContainer.parent());
            // since we collapsed the width in dragStarted, we resize it here
            this.resizeSearch();

            // update selection
            this.selection.find(".select2-search-choice").each(function() {
                val.push(self.opts.id($(this).data("select2-data")));
            });
            this.setVal(val);
            this.triggerChange();
        },

        // multi
        data: function(values, triggerChange) {
            var self=this, ids, old;
            if (arguments.length === 0) {
                 return this.selection
                     .children(".select2-search-choice")
                     .map(function() { return $(this).data("select2-data"); })
                     .get();
            } else {
                old = this.data();
                if (!values) { values = []; }
                ids = $.map(values, function(e) { return self.opts.id(e); });
                this.setVal(ids);
                this.updateSelection(values);
                this.clearSearch();
                if (triggerChange) {
                    this.triggerChange(this.buildChangeDetails(old, this.data()));
                }
            }
        }
    });

    $.fn.select2 = function () {

        var args = Array.prototype.slice.call(arguments, 0),
            opts,
            select2,
            method, value, multiple,
            allowedMethods = ["val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search"],
            valueMethods = ["opened", "isFocused", "container", "dropdown"],
            propertyMethods = ["val", "data"],
            methodsMap = { search: "externalSearch" };

        this.each(function () {
            if (args.length === 0 || typeof(args[0]) === "object") {
                opts = args.length === 0 ? {} : $.extend({}, args[0]);
                opts.element = $(this);

                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    multiple = opts.element.prop("multiple");
                } else {
                    multiple = opts.multiple || false;
                    if ("tags" in opts) {opts.multiple = multiple = true;}
                }

                select2 = multiple ? new window.Select2["class"].multi() : new window.Select2["class"].single();
                select2.init(opts);
            } else if (typeof(args[0]) === "string") {

                if (indexOf(args[0], allowedMethods) < 0) {
                    throw "Unknown method: " + args[0];
                }

                value = undefined;
                select2 = $(this).data("select2");
                if (select2 === undefined) return;

                method=args[0];

                if (method === "container") {
                    value = select2.container;
                } else if (method === "dropdown") {
                    value = select2.dropdown;
                } else {
                    if (methodsMap[method]) method = methodsMap[method];

                    value = select2[method].apply(select2, args.slice(1));
                }
                if (indexOf(args[0], valueMethods) >= 0
                    || (indexOf(args[0], propertyMethods) >= 0 && args.length == 1)) {
                    return false; // abort the iteration, ready to return first matched value
                }
            } else {
                throw "Invalid arguments to select2 plugin: " + args;
            }
        });
        return (value === undefined) ? this : value;
    };

    // plugin defaults, accessible to users
    $.fn.select2.defaults = {
        width: "copy",
        loadMorePadding: 0,
        closeOnSelect: true,
        openOnEnter: true,
        containerCss: {},
        dropdownCss: {},
        containerCssClass: "",
        dropdownCssClass: "",
        formatResult: function(result, container, query, escapeMarkup) {
            var markup=[];
            markMatch(this.text(result), query.term, markup, escapeMarkup);
            return markup.join("");
        },
        transformVal: function(val) {
            return $.trim(val);
        },
        formatSelection: function (data, container, escapeMarkup) {
            return data ? escapeMarkup(this.text(data)) : undefined;
        },
        sortResults: function (results, container, query) {
            return results;
        },
        formatResultCssClass: function(data) {return data.css;},
        formatSelectionCssClass: function(data, container) {return undefined;},
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        maximumInputLength: null,
        maximumSelectionSize: 0,
        id: function (e) { return e == undefined ? null : e.id; },
        text: function (e) {
          if (e && this.data && this.data.text) {
            if ($.isFunction(this.data.text)) {
              return this.data.text(e);
            } else {
              return e[this.data.text];
            }
          } else {
            return e.text;
          }
        },
        matcher: function(term, text) {
            return stripDiacritics(''+text).toUpperCase().indexOf(stripDiacritics(''+term).toUpperCase()) >= 0;
        },
        separator: ",",
        tokenSeparators: [],
        tokenizer: defaultTokenizer,
        escapeMarkup: defaultEscapeMarkup,
        blurOnChange: false,
        selectOnBlur: false,
        adaptContainerCssClass: function(c) { return c; },
        adaptDropdownCssClass: function(c) { return null; },
        nextSearchTerm: function(selectedObject, currentSearchTerm) { return undefined; },
        searchInputPlaceholder: '',
        createSearchChoicePosition: 'top',
        shouldFocusInput: function (instance) {
            // Attempt to detect touch devices
            var supportsTouchEvents = (('ontouchstart' in window) ||
                                       (navigator.msMaxTouchPoints > 0));

            // Only devices which support touch events should be special cased
            if (!supportsTouchEvents) {
                return true;
            }

            // Never focus the input if search is disabled
            if (instance.opts.minimumResultsForSearch < 0) {
                return false;
            }

            return true;
        }
    };

    $.fn.select2.locales = [];

    $.fn.select2.locales['en'] = {
         formatMatches: function (matches) { if (matches === 1) { return "One result is available, press enter to select it."; } return matches + " results are available, use up and down arrow keys to navigate."; },
         formatNoMatches: function () { return "No matches found"; },
         formatAjaxError: function (jqXHR, textStatus, errorThrown) { return "Loading failed"; },
         formatInputTooShort: function (input, min) { var n = min - input.length; return "Please enter " + n + " or more character" + (n == 1 ? "" : "s"); },
         formatInputTooLong: function (input, max) { var n = input.length - max; return "Please delete " + n + " character" + (n == 1 ? "" : "s"); },
         formatSelectionTooBig: function (limit) { return "You can only select " + limit + " item" + (limit == 1 ? "" : "s"); },
         formatLoadMore: function (pageNumber) { return "Loading more results…"; },
         formatSearching: function () { return "Searching…"; }
    };

    $.extend($.fn.select2.defaults, $.fn.select2.locales['en']);

    $.fn.select2.ajaxDefaults = {
        transport: $.ajax,
        params: {
            type: "GET",
            cache: false,
            dataType: "json"
        }
    };

    // exports
    window.Select2 = {
        query: {
            ajax: ajax,
            local: local,
            tags: tags
        }, util: {
            debounce: debounce,
            markMatch: markMatch,
            escapeMarkup: defaultEscapeMarkup,
            stripDiacritics: stripDiacritics
        }, "class": {
            "abstract": AbstractSelect2,
            "single": SingleSelect2,
            "multi": MultiSelect2
        }
    };

}(jQuery));

/*! DataTables Bootstrap 3 integration
 * ©2011-2014 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 3. This requires Bootstrap 3 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function(window, document, undefined){

var factory = function( $, DataTable ) {
"use strict";


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
  dom:
    "<'row'<'col-sm-6'l><'col-sm-6'f>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row'<'col-sm-6'i><'col-sm-6'p>>",
  renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
  sWrapper:      "dataTables_wrapper form-inline dt-bootstrap",
  sFilterInput:  "form-control input-sm",
  sLengthSelect: "form-control input-sm"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
  var api     = new DataTable.Api( settings );
  var classes = settings.oClasses;
  var lang    = settings.oLanguage.oPaginate;
  var btnDisplay, btnClass;

  var attach = function( container, buttons ) {
    var i, ien, node, button;
    var clickHandler = function ( e ) {
      e.preventDefault();
      if ( !$(e.currentTarget).hasClass('disabled') ) {
        api.page( e.data.action ).draw( false );
      }
    };

    for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
      button = buttons[i];

      if ( $.isArray( button ) ) {
        attach( container, button );
      }
      else {
        btnDisplay = '';
        btnClass = '';

        switch ( button ) {
          case 'ellipsis':
            btnDisplay = '&hellip;';
            btnClass = 'disabled';
            break;

          case 'first':
            btnDisplay = lang.sFirst;
            btnClass = button + (page > 0 ?
              '' : ' disabled');
            break;

          case 'previous':
            btnDisplay = lang.sPrevious;
            btnClass = button + (page > 0 ?
              '' : ' disabled');
            break;

          case 'next':
            btnDisplay = lang.sNext;
            btnClass = button + (page < pages-1 ?
              '' : ' disabled');
            break;

          case 'last':
            btnDisplay = lang.sLast;
            btnClass = button + (page < pages-1 ?
              '' : ' disabled');
            break;

          default:
            btnDisplay = button + 1;
            btnClass = page === button ?
              'active' : '';
            break;
        }

        if ( btnDisplay ) {
          node = $('<li>', {
              'class': classes.sPageButton+' '+btnClass,
              'aria-controls': settings.sTableId,
              'tabindex': settings.iTabIndex,
              'id': idx === 0 && typeof button === 'string' ?
                settings.sTableId +'_'+ button :
                null
            } )
            .append( $('<a>', {
                'href': '#'
              } )
              .html( btnDisplay )
            )
            .appendTo( container );

          settings.oApi._fnBindAction(
            node, {action: button}, clickHandler
          );
        }
      }
    }
  };

  attach(
    $(host).empty().html('<ul class="pagination"/>').children('ul'),
    buttons
  );
};


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */
if ( DataTable.TableTools ) {
  // Set the classes that TableTools uses to something suitable for Bootstrap
  $.extend( true, DataTable.TableTools.classes, {
    "container": "DTTT btn-group",
    "buttons": {
      "normal": "btn btn-default",
      "disabled": "disabled"
    },
    "collection": {
      "container": "DTTT_dropdown dropdown-menu",
      "buttons": {
        "normal": "",
        "disabled": "disabled"
      }
    },
    "print": {
      "info": "DTTT_print_info"
    },
    "select": {
      "row": "active"
    }
  } );

  // Have the collection use a bootstrap compatible drop down
  $.extend( true, DataTable.TableTools.DEFAULTS.oTags, {
    "collection": {
      "container": "ul",
      "button": "li",
      "liner": "a"
    }
  } );
}

}; // /factory


// Define as an AMD module if possible
if ( typeof define === 'function' && define.amd ) {
  define( ['jquery', 'datatables'], factory );
}
else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    factory( require('jquery'), require('datatables') );
}
else if ( jQuery ) {
  // Otherwise simply initialise as normal, stopping multiple evaluation
  factory( jQuery, jQuery.fn.dataTable );
}


})(window, document);


/************************
jquery-timepicker v1.4.13
http://jonthornton.github.com/jquery-timepicker/

requires jQuery 1.7+
************************/


(function (factory) {
    if (typeof exports === "object" && exports &&
        typeof module === "object" && module && module.exports === exports) {
        // Browserify. Attach to jQuery module.
        factory(require("jquery"));
    } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  var _baseDate = _generateBaseDate();
  var _ONE_DAY = 86400;
  var _lang = {
    am: 'am',
    pm: 'pm',
    AM: 'AM',
    PM: 'PM',
    decimal: '.',
    mins: 'mins',
    hr: 'hr',
    hrs: 'hrs'
  };

  var methods =
  {
    init: function(options)
    {
      return this.each(function()
      {
        var self = $(this);

        // pick up settings from data attributes
        var attributeOptions = [];
        for (var key in $.fn.timepicker.defaults) {
          if (self.data(key))  {
            attributeOptions[key] = self.data(key);
          }
        }

        var settings = $.extend({}, $.fn.timepicker.defaults, attributeOptions, options);

        if (settings.lang) {
          _lang = $.extend(_lang, settings.lang);
        }

        settings = _parseSettings(settings);
        self.data('timepicker-settings', settings);
        self.addClass('ui-timepicker-input');

        if (settings.useSelect) {
          _render(self);
        } else {
          self.prop('autocomplete', 'off');
          self.on('click.timepicker focus.timepicker', methods.show);
          self.on('change.timepicker', _formatValue);
          self.on('keydown.timepicker', _keydownhandler);
          self.on('keyup.timepicker', _keyuphandler);

          _formatValue.call(self.get(0));
        }
      });
    },

    show: function(e)
    {
      var self = $(this);
      var settings = self.data('timepicker-settings');

      if (e) {
        if (!settings.showOnFocus) {
          return true;
        }

        e.preventDefault();
      }

      if (settings.useSelect) {
        self.data('timepicker-list').focus();
        return;
      }

      if (_hideKeyboard(self)) {
        // block the keyboard on mobile devices
        self.blur();
      }

      var list = self.data('timepicker-list');

      // check if input is readonly
      if (self.prop('readonly')) {
        return;
      }

      // check if list needs to be rendered
      if (!list || list.length === 0 || typeof settings.durationTime === 'function') {
        _render(self);
        list = self.data('timepicker-list');
      }

      if (_isVisible(list)) {
        return;
      }

      // make sure other pickers are hidden
      methods.hide();

      // position the dropdown relative to the input
      list.show();
      var listOffset = {};

      if (settings.orientation == 'rtl') {
        // right-align the dropdown
        listOffset.left = self.offset().left + self.outerWidth() - list.outerWidth() + parseInt(list.css('marginLeft').replace('px', ''), 10);
      } else {
        // left-align the dropdown
        listOffset.left = self.offset().left + parseInt(list.css('marginLeft').replace('px', ''), 10);
      }

      if ((self.offset().top + self.outerHeight(true) + list.outerHeight()) > $(window).height() + $(window).scrollTop()) {
        // position the dropdown on top
        listOffset.top = self.offset().top - list.outerHeight() + parseInt(list.css('marginTop').replace('px', ''), 10);
        list.addClass('ui-timepicker-positioned-top');
      } else {
        // put it under the input
        listOffset.top = self.offset().top + self.outerHeight() + parseInt(list.css('marginTop').replace('px', ''), 10);
        list.removeClass('ui-timepicker-positioned-top');
      }

      list.offset(listOffset);

      // position scrolling
      var selected = list.find('.ui-timepicker-selected');

      if (!selected.length) {
        if (_getTimeValue(self)) {
          selected = _findRow(self, list, _time2int(_getTimeValue(self)));
        } else if (settings.scrollDefault) {
          selected = _findRow(self, list, settings.scrollDefault);
        }
      }

      if (selected && selected.length) {
        var topOffset = list.scrollTop() + selected.position().top - selected.outerHeight();
        list.scrollTop(topOffset);
      } else {
        list.scrollTop(0);
      }

      // attach close handlers
      $(document).on('touchstart.ui-timepicker mousedown.ui-timepicker', _closeHandler);
      if (settings.closeOnWindowScroll) {
        $(document).on('scroll.ui-timepicker', _closeHandler);
      }

      self.trigger('showTimepicker');

      return this;
    },

    hide: function(e)
    {
      var self = $(this);
      var settings = self.data('timepicker-settings');

      if (settings && settings.useSelect) {
        self.blur();
      }

      $('.ui-timepicker-wrapper').each(function() {
        var list = $(this);
        if (!_isVisible(list)) {
          return;
        }

        var self = list.data('timepicker-input');
        var settings = self.data('timepicker-settings');

        if (settings && settings.selectOnBlur) {
          _selectValue(self);
        }

        list.hide();
        self.trigger('hideTimepicker');
      });

      return this;
    },

    option: function(key, value)
    {
      return this.each(function(){
        var self = $(this);
        var settings = self.data('timepicker-settings');
        var list = self.data('timepicker-list');

        if (typeof key == 'object') {
          settings = $.extend(settings, key);

        } else if (typeof key == 'string' && typeof value != 'undefined') {
          settings[key] = value;

        } else if (typeof key == 'string') {
          return settings[key];
        }

        settings = _parseSettings(settings);

        self.data('timepicker-settings', settings);

        if (list) {
          list.remove();
          self.data('timepicker-list', false);
        }

        if (settings.useSelect) {
          _render(self);
        }
      });
    },

    getSecondsFromMidnight: function()
    {
      return _time2int(_getTimeValue(this));
    },

    getTime: function(relative_date)
    {
      var self = this;

      var time_string = _getTimeValue(self);
      if (!time_string) {
        return null;
      }

      if (!relative_date) {
        relative_date = new Date();
      }
      var offset = _time2int(time_string);

      // construct a Date with today's date, and offset's time
      var time = new Date(relative_date);
      time.setHours(offset / 3600);
      time.setMinutes(offset % 3600 / 60);
      time.setSeconds(offset % 60);
      time.setMilliseconds(0);

      return time;
    },

    setTime: function(value)
    {
      var self = this;
      var settings = self.data('timepicker-settings');

      if (settings.forceRoundTime) {
        var prettyTime = _roundAndFormatTime(value, settings)
      } else {
        var prettyTime = _int2time(_time2int(value), settings.timeFormat);
      }

      _setTimeValue(self, prettyTime);
      if (self.data('timepicker-list')) {
        _setSelected(self, self.data('timepicker-list'));
      }

      return this;
    },

    remove: function()
    {
      var self = this;

      // check if this element is a timepicker
      if (!self.hasClass('ui-timepicker-input')) {
        return;
      }

      var settings = self.data('timepicker-settings');
      self.removeAttr('autocomplete', 'off');
      self.removeClass('ui-timepicker-input');
      self.removeData('timepicker-settings');
      self.off('.timepicker');

      // timepicker-list won't be present unless the user has interacted with this timepicker
      if (self.data('timepicker-list')) {
        self.data('timepicker-list').remove();
      }

      if (settings.useSelect) {
        self.show();
      }

      self.removeData('timepicker-list');

      return this;
    }
  };

  // private methods

  function _isVisible(elem)
  {
    var el = elem[0];
    return el.offsetWidth > 0 && el.offsetHeight > 0;
  }

  function _parseSettings(settings)
  {
    if (settings.minTime) {
      settings.minTime = _time2int(settings.minTime);
    }

    if (settings.maxTime) {
      settings.maxTime = _time2int(settings.maxTime);
    }

    if (settings.durationTime && typeof settings.durationTime !== 'function') {
      settings.durationTime = _time2int(settings.durationTime);
    }

    if (settings.scrollDefault == 'now') {
      settings.scrollDefault = _time2int(new Date());
    } else if (settings.scrollDefault) {
      settings.scrollDefault = _time2int(settings.scrollDefault);
    } else if (settings.minTime) {
      settings.scrollDefault = settings.minTime;
    }

    if (settings.scrollDefault) {
      settings.scrollDefault = _roundTime(settings.scrollDefault, settings);
    }

    if ($.type(settings.timeFormat) === "string" && settings.timeFormat.match(/[gh]/)) {
      settings._twelveHourTime = true;
    }

    if (settings.disableTimeRanges.length > 0) {
      // convert string times to integers
      for (var i in settings.disableTimeRanges) {
        settings.disableTimeRanges[i] = [
          _time2int(settings.disableTimeRanges[i][0]),
          _time2int(settings.disableTimeRanges[i][1])
        ];
      }

      // sort by starting time
      settings.disableTimeRanges = settings.disableTimeRanges.sort(function(a, b){
        return a[0] - b[0];
      });

      // merge any overlapping ranges
      for (var i = settings.disableTimeRanges.length-1; i > 0; i--) {
        if (settings.disableTimeRanges[i][0] <= settings.disableTimeRanges[i-1][1]) {
          settings.disableTimeRanges[i-1] = [
            Math.min(settings.disableTimeRanges[i][0], settings.disableTimeRanges[i-1][0]),
            Math.max(settings.disableTimeRanges[i][1], settings.disableTimeRanges[i-1][1])
          ];
          settings.disableTimeRanges.splice(i, 1);
        }
      }
    }

    return settings;
  }

  function _render(self)
  {
    var settings = self.data('timepicker-settings');
    var list = self.data('timepicker-list');

    if (list && list.length) {
      list.remove();
      self.data('timepicker-list', false);
    }

    if (settings.useSelect) {
      list = $('<select />', { 'class': 'ui-timepicker-select' });
      var wrapped_list = list;
    } else {
      list = $('<ul />', { 'class': 'ui-timepicker-list' });

      var wrapped_list = $('<div />', { 'class': 'ui-timepicker-wrapper', 'tabindex': -1 });
      wrapped_list.css({'display':'none', 'position': 'absolute' }).append(list);
    }

    if (settings.noneOption) {
      if (settings.noneOption === true) {
        settings.noneOption = (settings.useSelect) ? 'Time...' : 'None';
      }

      if ($.isArray(settings.noneOption)) {
        for (var i in settings.noneOption) {
          if (parseInt(i, 10) == i){
            var noneElement = _generateNoneElement(settings.noneOption[i], settings.useSelect);
            list.append(noneElement);
          }
        }
      } else {
        var noneElement = _generateNoneElement(settings.noneOption, settings.useSelect);
        list.append(noneElement);
      }
    }

    if (settings.className) {
      wrapped_list.addClass(settings.className);
    }

    if ((settings.minTime !== null || settings.durationTime !== null) && settings.showDuration) {
      wrapped_list.addClass('ui-timepicker-with-duration');
      wrapped_list.addClass('ui-timepicker-step-'+settings.step);
    }

    var durStart = settings.minTime;
    if (typeof settings.durationTime === 'function') {
      durStart = _time2int(settings.durationTime());
    } else if (settings.durationTime !== null) {
      durStart = settings.durationTime;
    }
    var start = (settings.minTime !== null) ? settings.minTime : 0;
    var end = (settings.maxTime !== null) ? settings.maxTime : (start + _ONE_DAY - 1);

    if (end <= start) {
      // make sure the end time is greater than start time, otherwise there will be no list to show
      end += _ONE_DAY;
    }

    if (end === _ONE_DAY-1 && $.type(settings.timeFormat) === "string" && settings.timeFormat.indexOf('H') !== -1) {
      // show a 24:00 option when using military time
      end = _ONE_DAY;
    }

    var dr = settings.disableTimeRanges;
    var drCur = 0;
    var drLen = dr.length;

    for (var i=start; i <= end; i += settings.step*60) {
      var timeInt = i;
      var timeString = _int2time(timeInt, settings.timeFormat);

      if (settings.useSelect) {
        var row = $('<option />', { 'value': timeString });
        row.text(timeString);
      } else {
        var row = $('<li />');
        row.data('time', (timeInt <= 86400 ? timeInt : timeInt % 86400));
        row.text(timeString);
      }

      if ((settings.minTime !== null || settings.durationTime !== null) && settings.showDuration) {
        var durationString = _int2duration(i - durStart, settings.step);
        if (settings.useSelect) {
          row.text(row.text()+' ('+durationString+')');
        } else {
          var duration = $('<span />', { 'class': 'ui-timepicker-duration' });
          duration.text(' ('+durationString+')');
          row.append(duration);
        }
      }

      if (drCur < drLen) {
        if (timeInt >= dr[drCur][1]) {
          drCur += 1;
        }

        if (dr[drCur] && timeInt >= dr[drCur][0] && timeInt < dr[drCur][1]) {
          if (settings.useSelect) {
            row.prop('disabled', true);
          } else {
            row.addClass('ui-timepicker-disabled');
          }
        }
      }

      list.append(row);
    }

    wrapped_list.data('timepicker-input', self);
    self.data('timepicker-list', wrapped_list);

    if (settings.useSelect) {
      if (self.val()) {
        list.val(_roundAndFormatTime(self.val(), settings));
      }

      list.on('focus', function(){
        $(this).data('timepicker-input').trigger('showTimepicker');
      });
      list.on('blur', function(){
        $(this).data('timepicker-input').trigger('hideTimepicker');
      });
      list.on('change', function(){
        _setTimeValue(self, $(this).val(), 'select');
      });

      _setTimeValue(self, list.val());
      self.hide().after(list);
    } else {
      var appendTo = settings.appendTo;
      if (typeof appendTo === 'string') {
        appendTo = $(appendTo);
      } else if (typeof appendTo === 'function') {
        appendTo = appendTo(self);
      }
      appendTo.append(wrapped_list);
      _setSelected(self, list);

      list.on('mousedown', 'li', function(e) {

        // hack: temporarily disable the focus handler
        // to deal with the fact that IE fires 'focus'
        // events asynchronously
        self.off('focus.timepicker');
        self.on('focus.timepicker-ie-hack', function(){
          self.off('focus.timepicker-ie-hack');
          self.on('focus.timepicker', methods.show);
        });

        if (!_hideKeyboard(self)) {
          self[0].focus();
        }

        // make sure only the clicked row is selected
        list.find('li').removeClass('ui-timepicker-selected');
        $(this).addClass('ui-timepicker-selected');

        if (_selectValue(self)) {
          self.trigger('hideTimepicker');
          wrapped_list.hide();
        }
      });
    }
  }

  function _generateNoneElement(optionValue, useSelect)
  {
    var label, className, value;

    if (typeof optionValue == 'object') {
      label = optionValue.label;
      className = optionValue.className;
      value = optionValue.value;
    } else if (typeof optionValue == 'string') {
      label = optionValue;
    } else {
      $.error('Invalid noneOption value');
    }

    if (useSelect) {
      return $('<option />', {
          'value': value,
          'class': className,
          'text': label
        });
    } else {
      return $('<li />', {
          'class': className,
          'text': label
        }).data('time', value);
    }
  }

  function _roundTime(seconds, settings)
  {
    if (!$.isNumeric(seconds)) {
      seconds = _time2int(seconds);
    }

    if (seconds === null) {
      return null;
    } else {
      var offset = seconds % (settings.step*60); // step is in minutes

      if (offset >= settings.step*30) {
        // if offset is larger than a half step, round up
        seconds += (settings.step*60) - offset;
      } else {
        // round down
        seconds -= offset;
      }

      return seconds;
    }
  }

  function _roundAndFormatTime(seconds, settings)
  {
    seconds = _roundTime(seconds, settings);
    if (seconds !== null) {
      return _int2time(seconds, settings.timeFormat);
    }
  }

  function _generateBaseDate()
  {
    return new Date(1970, 1, 1, 0, 0, 0);
  }

  // event handler to decide whether to close timepicker
  function _closeHandler(e)
  {
    var target = $(e.target);
    var input = target.closest('.ui-timepicker-input');
    if (input.length === 0 && target.closest('.ui-timepicker-wrapper').length === 0) {
      methods.hide();
      $(document).unbind('.ui-timepicker');
    }
  }

  function _hideKeyboard(self)
  {
    var settings = self.data('timepicker-settings');
    return ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && settings.disableTouchKeyboard);
  }

  function _findRow(self, list, value)
  {
    if (!value && value !== 0) {
      return false;
    }

    var settings = self.data('timepicker-settings');
    var out = false;
    var halfStep = settings.step*30;

    // loop through the menu items
    list.find('li').each(function(i, obj) {
      var jObj = $(obj);
      if (typeof jObj.data('time') != 'number') {
        return;
      }

      var offset = jObj.data('time') - value;

      // check if the value is less than half a step from each row
      if (Math.abs(offset) < halfStep || offset == halfStep) {
        out = jObj;
        return false;
      }
    });

    return out;
  }

  function _setSelected(self, list)
  {
    list.find('li').removeClass('ui-timepicker-selected');

    var timeValue = _time2int(_getTimeValue(self), self.data('timepicker-settings'));
    if (timeValue === null) {
      return;
    }

    var selected = _findRow(self, list, timeValue);
    if (selected) {

      var topDelta = selected.offset().top - list.offset().top;

      if (topDelta + selected.outerHeight() > list.outerHeight() || topDelta < 0) {
        list.scrollTop(list.scrollTop() + selected.position().top - selected.outerHeight());
      }

      selected.addClass('ui-timepicker-selected');
    }
  }


  function _formatValue(e, origin)
  {
    if (this.value === '' || origin == 'timepicker') {
      return;
    }

    var self = $(this);
    var list = self.data('timepicker-list');

    if (self.is(':focus') && (!e || e.type != 'change')) {
      return;
    }

    var seconds = _time2int(this.value);

    if (seconds === null) {
      self.trigger('timeFormatError');
      return;
    }

    var settings = self.data('timepicker-settings');
    var rangeError = false;
    // check that the time in within bounds
    if (settings.minTime !== null && seconds < settings.minTime) {
      rangeError = true;
    } else if (settings.maxTime !== null && seconds > settings.maxTime) {
      rangeError = true;
    }

    // check that time isn't within disabled time ranges
    $.each(settings.disableTimeRanges, function(){
      if (seconds >= this[0] && seconds < this[1]) {
        rangeError = true;
        return false;
      }
    });

    if (settings.forceRoundTime) {
      var offset = seconds % (settings.step*60); // step is in minutes

      if (offset >= settings.step*30) {
        // if offset is larger than a half step, round up
        seconds += (settings.step*60) - offset;
      } else {
        // round down
        seconds -= offset;
      }
    }

    var prettyTime = _int2time(seconds, settings.timeFormat);

    if (rangeError) {
      if (_setTimeValue(self, prettyTime, 'error')) {
        self.trigger('timeRangeError');
      }
    } else {
      _setTimeValue(self, prettyTime);
    }
  }

  function _getTimeValue(self)
  {
    if (self.is('input')) {
      return self.val();
    } else {
      // use the element's data attributes to store values
      return self.data('ui-timepicker-value');
    }
  }

  function _setTimeValue(self, value, source)
  {
    if (self.is('input')) {
      self.val(value);

      var settings = self.data('timepicker-settings');
      if (settings.useSelect && source != 'select') {
        self.data('timepicker-list').val(_roundAndFormatTime(value, settings));
      }
    }

    if (self.data('ui-timepicker-value') != value) {
      self.data('ui-timepicker-value', value);
      if (source == 'select') {
        self.trigger('selectTime').trigger('changeTime').trigger('change', 'timepicker');
      } else if (source != 'error') {
        self.trigger('changeTime');
      }

      return true;
    } else {
      self.trigger('selectTime');
      return false;
    }
  }

  /*
  *  Keyboard navigation via arrow keys
  */
  function _keydownhandler(e)
  {
    var self = $(this);
    var list = self.data('timepicker-list');

    if (!list || !_isVisible(list)) {
      if (e.keyCode == 40) {
        // show the list!
        methods.show.call(self.get(0));
        list = self.data('timepicker-list');
        if (!_hideKeyboard(self)) {
          self.focus();
        }
      } else {
        return true;
      }
    }

    switch (e.keyCode) {

      case 13: // return
        if (_selectValue(self)) {
          methods.hide.apply(this);
        }

        e.preventDefault();
        return false;

      case 38: // up
        var selected = list.find('.ui-timepicker-selected');

        if (!selected.length) {
          list.find('li').each(function(i, obj) {
            if ($(obj).position().top > 0) {
              selected = $(obj);
              return false;
            }
          });
          selected.addClass('ui-timepicker-selected');

        } else if (!selected.is(':first-child')) {
          selected.removeClass('ui-timepicker-selected');
          selected.prev().addClass('ui-timepicker-selected');

          if (selected.prev().position().top < selected.outerHeight()) {
            list.scrollTop(list.scrollTop() - selected.outerHeight());
          }
        }

        return false;

      case 40: // down
        selected = list.find('.ui-timepicker-selected');

        if (selected.length === 0) {
          list.find('li').each(function(i, obj) {
            if ($(obj).position().top > 0) {
              selected = $(obj);
              return false;
            }
          });

          selected.addClass('ui-timepicker-selected');
        } else if (!selected.is(':last-child')) {
          selected.removeClass('ui-timepicker-selected');
          selected.next().addClass('ui-timepicker-selected');

          if (selected.next().position().top + 2*selected.outerHeight() > list.outerHeight()) {
            list.scrollTop(list.scrollTop() + selected.outerHeight());
          }
        }

        return false;

      case 27: // escape
        list.find('li').removeClass('ui-timepicker-selected');
        methods.hide();
        break;

      case 9: //tab
        methods.hide();
        break;

      default:
        return true;
    }
  }

  /*
  * Time typeahead
  */
  function _keyuphandler(e)
  {
    var self = $(this);
    var list = self.data('timepicker-list');

    if (!list || !_isVisible(list)) {
      return true;
    }

    if (!self.data('timepicker-settings').typeaheadHighlight) {
      list.find('li').removeClass('ui-timepicker-selected');
      return true;
    }

    switch (e.keyCode) {

      case 96: // numpad numerals
      case 97:
      case 98:
      case 99:
      case 100:
      case 101:
      case 102:
      case 103:
      case 104:
      case 105:
      case 48: // numerals
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
      case 65: // a
      case 77: // m
      case 80: // p
      case 186: // colon
      case 8: // backspace
      case 46: // delete
        _setSelected(self, list);
        break;

      default:
        // list.find('li').removeClass('ui-timepicker-selected');
        return;
    }
  }

  function _selectValue(self)
  {
    var settings = self.data('timepicker-settings');
    var list = self.data('timepicker-list');
    var timeValue = null;

    var cursor = list.find('.ui-timepicker-selected');

    if (cursor.hasClass('ui-timepicker-disabled')) {
      return false;
    }

    if (cursor.length) {
      // selected value found
      timeValue = cursor.data('time');
    }

    if (timeValue !== null) {
      if (typeof timeValue == 'string') {
        self.val(timeValue);
      } else {
        var timeString = _int2time(timeValue, settings.timeFormat);
        _setTimeValue(self, timeString, 'select');
      }
    }

    //self.trigger('change').trigger('selectTime');
    return true;
  }

  function _int2duration(seconds, step)
  {
    seconds = Math.abs(seconds);
    var minutes = Math.round(seconds/60),
      duration = [],
      hours, mins;

    if (minutes < 60) {
      // Only show (x mins) under 1 hour
      duration = [minutes, _lang.mins];
    } else {
      hours = Math.floor(minutes/60);
      mins = minutes%60;

      // Show decimal notation (eg: 1.5 hrs) for 30 minute steps
      if (step == 30 && mins == 30) {
        hours += _lang.decimal + 5;
      }

      duration.push(hours);
      duration.push(hours == 1 ? _lang.hr : _lang.hrs);

      // Show remainder minutes notation (eg: 1 hr 15 mins) for non-30 minute steps
      // and only if there are remainder minutes to show
      if (step != 30 && mins) {
        duration.push(mins);
        duration.push(_lang.mins);
      }
    }

    return duration.join(' ');
  }

  function _int2time(seconds, format)
  {
    if (seconds === null) {
      return;
    }

    var time = new Date(_baseDate.valueOf() + (seconds*1000));

    if (isNaN(time.getTime())) {
      return;
    }

    if ($.type(format) === "function") {
      return format(time);
    }

    var output = '';
    var hour, code;
    for (var i=0; i<format.length; i++) {

      code = format.charAt(i);
      switch (code) {

        case 'a':
          output += (time.getHours() > 11) ? _lang.pm : _lang.am;
          break;

        case 'A':
          output += (time.getHours() > 11) ? _lang.pm.toUpperCase() : _lang.am.toUpperCase();
          break;

        case 'g':
          hour = time.getHours() % 12;
          output += (hour === 0) ? '12' : hour;
          break;

        case 'G':
          output += time.getHours();
          break;

        case 'h':
          hour = time.getHours() % 12;

          if (hour !== 0 && hour < 10) {
            hour = '0'+hour;
          }

          output += (hour === 0) ? '12' : hour;
          break;

        case 'H':
          hour = time.getHours();
          if (seconds === _ONE_DAY) hour = 24;
          output += (hour > 9) ? hour : '0'+hour;
          break;

        case 'i':
          var minutes = time.getMinutes();
          output += (minutes > 9) ? minutes : '0'+minutes;
          break;

        case 's':
          seconds = time.getSeconds();
          output += (seconds > 9) ? seconds : '0'+seconds;
          break;

        case '\\':
          // escape character; add the next character and skip ahead
          i++;
          output += format.charAt(i);
          break;

        default:
          output += code;
      }
    }

    return output;
  }

  function _time2int(timeString, settings)
  {
    if (timeString === '') return null;
    if (!timeString || timeString+0 == timeString) return timeString;

    if (typeof(timeString) == 'object') {
      return timeString.getHours()*3600 + timeString.getMinutes()*60 + timeString.getSeconds();
    }

    timeString = timeString.toLowerCase();

    // if the last character is an "a" or "p", add the "m"
    if (timeString.slice(-1) == 'a' || timeString.slice(-1) == 'p') {
      timeString += 'm';
    }

    // try to parse time input
    var pattern = new RegExp('^([0-2]?[0-9])\\W?([0-5][0-9])?\\W?([0-5][0-9])?\\s*('+_lang.am+'|'+_lang.pm+')?$');
    var time = timeString.match(pattern);
    if (!time) {
      return null;
    }

    var hour = parseInt(time[1]*1, 10);
    var ampm = time[4];
    var hours = hour;

    if (hour <= 12 && ampm) {
      if (hour == 12) {
        hours = (time[4] == _lang.pm) ? 12 : 0;
      } else {
        hours = (hour + (time[4] == _lang.pm ? 12 : 0));
      }
    }

    var minutes = ( time[2]*1 || 0 );
    var seconds = ( time[3]*1 || 0 );
    var timeInt = hours*3600 + minutes*60 + seconds;

    // if no am/pm provided, intelligently guess based on the scrollDefault
    if (!ampm && settings && settings._twelveHourTime && settings.scrollDefault) {
      var delta = timeInt - settings.scrollDefault;
      if (delta < 0 && delta >= _ONE_DAY / -2) {
        timeInt = (timeInt + (_ONE_DAY / 2)) % _ONE_DAY;
      }
    }

    return timeInt
  }

  function _pad2(n) {
    return ("0" + n).slice(-2);
  }

  // Plugin entry
  $.fn.timepicker = function(method)
  {
    if (!this.length) return this;
    if (methods[method]) {
      // check if this element is a timepicker
      if (!this.hasClass('ui-timepicker-input')) {
        return this;
      }
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if(typeof method === "object" || !method) { return methods.init.apply(this, arguments); }
    else { $.error("Method "+ method + " does not exist on jQuery.timepicker"); }
  };
  // Global defaults
  $.fn.timepicker.defaults = {
    className: null,
    minTime: null,
    maxTime: null,
    durationTime: null,
    step: 30,
    showDuration: false,
    showOnFocus: true,
    timeFormat: 'g:ia',
    scrollDefault: null,
    selectOnBlur: false,
    disableTouchKeyboard: false,
    forceRoundTime: false,
    appendTo: 'body',
    orientation: 'ltr',
    disableTimeRanges: [],
    closeOnWindowScroll: false,
    typeaheadHighlight: true,
    noneOption: false
  };
}));

/* ===========================================================
 * flatui-fileinput v0.2.0
 * Based on Bootstrap: fileinput.js v3.1.3
 * http://jasny.github.com/bootstrap/javascript.html#fileinput
 * ===========================================================
 */

+function ($) { 'use strict';

  var isIE = window.navigator.appName == 'Microsoft Internet Explorer';

  // FILEUPLOAD PUBLIC CLASS DEFINITION
  // =================================

  var Fileinput = function (element, options) {
    this.$element = $(element);
    this.$input = this.$element.find(':file');
    if (this.$input.length === 0) {
      return;
    }
    this.name = this.$input.attr('name') || options.name;
    this.$hidden = this.$element.find('input[type=hidden][name="' + this.name + '"]');
    if (this.$hidden.length === 0) {
      this.$hidden = $('<input type="hidden">').insertBefore(this.$input);
    }
    this.$preview = this.$element.find('.fileinput-preview');
    var height = this.$preview.css('height');
    if (this.$preview.css('display') !== 'inline' && height !== '0px' && height !== 'none') {
      this.$preview.css('line-height', height);
    }
    this.original = {
      exists: this.$element.hasClass('fileinput-exists'),
      preview: this.$preview.html(),
      hiddenVal: this.$hidden.val()
    };
    this.listen();
  };
  Fileinput.prototype.listen = function () {
    this.$input.on('change.bs.fileinput', $.proxy(this.change, this));
    $(this.$input[0].form).on('reset.bs.fileinput', $.proxy(this.reset, this));

    this.$element.find('[data-trigger="fileinput"]').on('click.bs.fileinput', $.proxy(this.trigger, this));
    this.$element.find('[data-dismiss="fileinput"]').on('click.bs.fileinput', $.proxy(this.clear, this));
  };
  Fileinput.prototype.change = function (e) {
    var files = e.target.files === undefined ? (e.target && e.target.value ? [{ name: e.target.value.replace(/^.+\\/, '') }] : []) : e.target.files;
    e.stopPropagation();
    if (files.length === 0) {
      this.clear();
      return;
    }
    this.$hidden.val('');
    this.$hidden.attr('name', '');
    this.$input.attr('name', this.name);
    var file = files[0];
    if (this.$preview.length > 0 && (typeof file.type !== 'undefined' ? file.type.match(/^image\/(gif|png|jpeg)$/) : file.name.match(/\.(gif|png|jpe?g)$/i)) && typeof FileReader !== 'undefined') {
      var reader = new FileReader();
      var preview = this.$preview;
      var element = this.$element;

      reader.onload = function (re) {
        var $img = $('<img>');
        $img[0].src = re.target.result;
        files[0].result = re.target.result;
        element.find('.fileinput-filename').text(file.name);

        // if parent has max-height, using `(max-)height: 100%` on child doesn't take padding and border into account
        if (preview.css('max-height') != 'none') {
          $img.css('max-height', parseInt(preview.css('max-height'), 10) - parseInt(preview.css('padding-top'), 10) - parseInt(preview.css('padding-bottom'), 10)  - parseInt(preview.css('border-top'), 10) - parseInt(preview.css('border-bottom'), 10));
        }

        preview.html($img);
        element.addClass('fileinput-exists').removeClass('fileinput-new');
        element.trigger('change.bs.fileinput', files);
      };

      reader.readAsDataURL(file);
    } else {
      this.$element.find('.fileinput-filename').text(file.name);
      this.$preview.text(file.name);
      this.$element.addClass('fileinput-exists').removeClass('fileinput-new');
      this.$element.trigger('change.bs.fileinput');
    }
  };

  Fileinput.prototype.clear = function (e) {
    if (e) {
      e.preventDefault();
    }

    this.$hidden.val('');
    this.$hidden.attr('name', this.name);
    this.$input.attr('name', '');

    // ie8+ doesn't support changing the value of input with type=file so clone instead
    if (isIE) {
      var inputClone = this.$input.clone(true);
      this.$input.after(inputClone);
      this.$input.remove();
      this.$input = inputClone;
    } else {
      this.$input.val('');
    }

    this.$preview.html('');
    this.$element.find('.fileinput-filename').text('');
    this.$element.addClass('fileinput-new').removeClass('fileinput-exists');

    if (e !== undefined) {
      this.$input.trigger('change');
      this.$element.trigger('clear.bs.fileinput');
    }
  };

  Fileinput.prototype.reset = function () {
    this.clear();
    this.$hidden.val(this.original.hiddenVal);
    this.$preview.html(this.original.preview);
    this.$element.find('.fileinput-filename').text('');

    if (this.original.exists) {
      this.$element.addClass('fileinput-exists').removeClass('fileinput-new');
    } else {
      this.$element.addClass('fileinput-new').removeClass('fileinput-exists');
    }

    this.$element.trigger('reset.bs.fileinput');
  };

  Fileinput.prototype.trigger = function (e) {
    this.$input.trigger('click');
    e.preventDefault();
  };


  // FILEUPLOAD PLUGIN DEFINITION
  // ===========================

  function Plugin(options) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('bs.fileinput');
      if (!data) {
        $this.data('bs.fileinput', (data = new Fileinput(this, options)));
      }
      if (typeof options == 'string') {
        data[options]();
      }
    });
  }

  var old = $.fn.fileinput;

  $.fn.fileinput             = Plugin;
  $.fn.fileinput.Constructor = Fileinput;


  // FILEINPUT NO CONFLICT
  // ====================

  $.fn.fileinput.noConflict = function () {
    $.fn.fileinput = old;
    return this;
  };


  // FILEUPLOAD DATA-API
  // ==================

  $(document).on('click.fileinput.data-api', '[data-provides="fileinput"]', function (e) {
    var $this = $(this);
    if ($this.data('bs.fileinput')) {
      return;
    }
    Plugin.call($this, $this.data());

    var $target = $(e.target).closest('[data-dismiss="fileinput"],[data-trigger="fileinput"]');
    if ($target.length > 0) {
      e.preventDefault();
      $target.trigger('click.bs.fileinput');
    }
  });

}(window.jQuery);

/* ============================================================
 * flatui-radiocheck v0.1.0
 * ============================================================ */

+function (global, $) {
  'use strict';

  var Radiocheck = function (element, options) {
    this.init('radiocheck', element, options);
  };

  Radiocheck.DEFAULTS = {
    checkboxClass: 'custom-checkbox',
    radioClass: 'custom-radio',
    checkboxTemplate: '<span class="icons"><span class="icon-unchecked"></span><span class="icon-checked"></span></span>',
    radioTemplate: '<span class="icons"><span class="icon-unchecked"></span><span class="icon-checked"></span></span>'
  };

  Radiocheck.prototype.init = function (type, element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Radiocheck.DEFAULTS, this.$element.data(), options);
    if (this.$element.attr('type') == 'checkbox') {
      this.$element.addClass(this.options.checkboxClass);
      this.$element.after(this.options.checkboxTemplate);
    } else if (this.$element.attr('type') == 'radio') {
      this.$element.addClass(this.options.radioClass);
      this.$element.after(this.options.radioTemplate);
    }
  };

  Radiocheck.prototype.check = function () {
    this.$element.prop('checked', true);
    this.$element.trigger('change.radiocheck').trigger('checked.radiocheck');
  },

  Radiocheck.prototype.uncheck = function () {
    this.$element.prop('checked', false);
    this.$element.trigger('change.radiocheck').trigger('unchecked.radiocheck');
  },

  Radiocheck.prototype.toggle = function () {
    this.$element.prop('checked', function (i, value) {
      return !value;
    });
    this.$element.trigger('change.radiocheck').trigger('toggled.radiocheck');
  },

  Radiocheck.prototype.indeterminate = function () {
    this.$element.prop('indeterminate', true);
    this.$element.trigger('change.radiocheck').trigger('indeterminated.radiocheck');
  },

  Radiocheck.prototype.determinate = function () {
    this.$element.prop('indeterminate', false);
    this.$element.trigger('change.radiocheck').trigger('determinated.radiocheck');
  },

  Radiocheck.prototype.disable = function () {
    this.$element.prop('disabled', true);
    this.$element.trigger('change.radiocheck').trigger('disabled.radiocheck');
  },

  Radiocheck.prototype.enable = function () {
    this.$element.prop('disabled', false);
    this.$element.trigger('change.radiocheck').trigger('enabled.radiocheck');
  },

  Radiocheck.prototype.destroy = function () {
    this.$element.removeData().removeClass(this.options.checkboxClass + ' ' + this.options.radioClass).next('.icons').remove();
    this.$element.trigger('destroyed.radiocheck');
  };

  // RADIOCHECK PLUGIN DEFINITION
  // ============================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this);
      var data    = $this.data('radiocheck');
      var options = typeof option == 'object' && option;

      if (!data && option == 'destroy') { return; }
      if (!data) {
        $this.data('radiocheck', (data = new Radiocheck(this, options)));
      }
      if (typeof option == 'string') {
        data[option]();
      }

      // Adding 'nohover' class for mobile devices

      var mobile = /mobile|tablet|phone|ip(ad|od)|android|silk|webos/i.test(global.navigator.userAgent);

      if (mobile === true) {
        $this.parent().hover(function () {
          $this.addClass('nohover');
        }, function () {
          $this.removeClass('nohover');
        });
      }
    });
  }

  var old = $.fn.radiocheck;

  $.fn.radiocheck             = Plugin;
  $.fn.radiocheck.Constructor = Radiocheck;

  // RADIOCHECK NO CONFLICT
  // ======================

  $.fn.radiocheck.noConflict = function () {
    $.fn.radiocheck = old;
    return this;
  };

}(this, jQuery);

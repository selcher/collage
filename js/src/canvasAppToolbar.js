/**
 * Class: CanvasAppToolbar
 *
 * Toolbar
 */
function CanvasAppToolbar( app ) {

    if ( this instanceof CanvasAppToolbar ) {

        this.app = app;

        return this;

    } else {

        return new CanvasAppToolbar( app );

    }
}

/**
 * Function: init
 */
CanvasAppToolbar.prototype.init = function init() {

    this.initHandlers();

};

/**
 * Function: initHandlers
 *
 * Initialize handlers
 */
CanvasAppToolbar.prototype.initHandlers = function initHandlers() {

    this.initCanvasSizeHandlers();
    this.initNewToolbarHandlers();
    this.initEditTabHandler();
    this.initSaveTabHandler();

};

/**
 * Function: initCanvasSizeHandlers
 *
 *  Initialize canvas size handler on toolbar
 */
CanvasAppToolbar.prototype.initCanvasSizeHandlers =
    function initNewToolbarHandlers() {

        var self = this;

        document.getElementById( "canvas_size" ).onchange = function() {

            var size = $( "#canvas_size option:selected" ).val();

            size = size.split( "x" );

            var width = parseInt( size[ 0 ] );
            var height = parseInt( size[ 1 ] );

            self.app.canvas.setWidth( width );
            self.app.canvas.setHeight( height );
            self.app.canvas.calcOffset();

            // Add 1 for boder
            $( "#canvasCont" ).height( height + 1 );
            $( "#sidebarCont" ).height( height + 1 );

        };

};

/**
 * Function: initNewToolbarHandlers
 *
 *  Initialize handlers for new tab on toolbar
 */
CanvasAppToolbar.prototype.initNewToolbarHandlers =
    function initNewToolbarHandlers() {

    var self = this;
    var showAddImageOption = false;

    var app = self.app;
    var sidebar = app.sidebar;

	document.getElementById( "imgFile" ).addEventListener( "change",
        function() {

    		if( !showAddImageOption ) {

                showAddImageOption = true;
    			$( "#toolbar_addImg" ).show();

    		}

            app.getImageWithPreview( this );

        }

    );

	document.getElementById( "addImage" ).addEventListener( "click",
        function() {

            app.addImage();
            sidebar.openList();

        }
    );

    document.getElementById( "setBkGnd" ).onclick = function() {

        app.setBackGround();
        sidebar.openList();

    };

    document.getElementById( "colorShape" ).onchange = function() {

        app.setColor( "#" + this.color );

    };

	document.getElementById( "addShape" ).addEventListener( "click",
        function() {

            app.addShape();
            sidebar.openList();

        }
    );

    document.getElementById( "colorText" ).onchange = function() {

        app.setColorTxt( "#" + this.color );

    };

	document.getElementById( "addText" ).addEventListener( "click",
        function() {

            app.addText();
            sidebar.openList();

        }
    );

    document.getElementById( "bgColorVal" ).onchange = function() {

        app.setBgColor( "#" + this.color );

    };

	document.getElementById( "setBgColor" ).onclick = function() {

		app.updateCanvasBgColor();
        sidebar.openList();

    };

};

/**
 * Function: initEditTabHandler
 *
 * Initialize handlers for the edit tab
 */
CanvasAppToolbar.prototype.initEditTabHandler = function initEditTabHandler() {

    var self = this;

	document.getElementById( "mvUp" ).onclick = function() {

        self.app.moveUp();

    };

	document.getElementById( "mvBk" ).onclick = function() {

        self.app.moveBack();

    };

	document.getElementById( "strtn" ).onclick = function() {

        self.app.strtCanvasObj();

    };

	document.getElementById( "grayscale" ).onclick = function() {

		self.app.editCanvasObj( this, 0, new fabric.Image.filters.Grayscale() );

    };

	document.getElementById( "invert" ).onclick = function() {

		self.app.editCanvasObj( this, 1, new fabric.Image.filters.Invert() );

    };

	document.getElementById( "flipx" ).onclick = function() {

		self.app.flip( "X" );

    };

	document.getElementById( "flipy" ).onclick = function() {

		self.app.flip( "Y" );

    };

	var removeWhite = document.getElementById( "remove-white" );
    var removeWhiteThreshold = document.getElementById(
        "remove-white-threshold"
    );
    var removeWhiteDistance = document.getElementById(
        "remove-white-distance"
    );

    document.getElementById( "remove-white" ).onclick = function() {

		var thresh = parseInt( removeWhiteThreshold.value, 10 );
		var dist = parseInt( removeWhiteDistance.value, 10 );

        self.app.editCanvasObj( this, 2,
            new fabric.Image.filters.RemoveWhite( {
                "threshold": thresh,
                "distance": dist
            } )
        );

    };

	document.getElementById( "remove-white-threshold" ).onchange = function() {

		var checkBoxChecked = removeWhite.checked;
		var thresh = parseInt( removeWhiteThreshold.value, 10 );
		var dist = parseInt( removeWhiteDistance.value, 10 );

		self.app.updateCanvasObjProp( checkBoxChecked, 2,
            new fabric.Image.filters.RemoveWhite( {
                "threshold": thresh,
                "distance": dist
            } )
        );

    };

	document.getElementById( "remove-white-distance" ).onchange = function() {

		var checkBoxChecked = removeWhite.checked;
		var thresh = parseInt( removeWhiteThreshold.value, 10 );
		var dist = parseInt( removeWhiteDistance.value, 10 );

        self.app.updateCanvasObjProp( checkBoxChecked, 2,
            new fabric.Image.filters.RemoveWhite( {
                "threshold": thresh,
                "distance": dist
            } )
        );

    };

	document.getElementById( "sepia" ).onclick = function() {

		self.app.editCanvasObj( this, 3, new fabric.Image.filters.Sepia() );

    };

	document.getElementById( "sepia2" ).onclick = function() {

		self.app.editCanvasObj( this, 4, new fabric.Image.filters.Sepia2() );

    };

    var bright = document.getElementById( "brightness" );
    var brightValue = document.getElementById( "brightness-value" );

	document.getElementById( "brightness" ).onclick = function() {

		var val = parseInt( brightValue.value, 10 );

		self.app.editCanvasObj( this, 5,
            new fabric.Image.filters.Brightness( {
                "brightness": val
            } )
        );

	};

	document.getElementById( "brightness-value" ).onchange = function() {

		var checkBoxChecked = bright.checked;
		var val = parseInt( bright.value, 10 );

		self.app.updateCanvasObjProp( checkBoxChecked, 5,
            new fabric.Image.filters.Brightness( {
                "brightness": val
            } )
        );

    };

    var noise = document.getElementById( "noise" );
    var noiseValue = document.getElementById( "noise-value" );

	document.getElementById( "noise" ).onclick = function() {

		var val = parseInt( noiseValue.value, 10 );

        self.app.editCanvasObj( this, 6,
            new fabric.Image.filters.Noise( {
                "noise": val
            } )
        );

    };

	document.getElementById( "noise-value" ).onchange = function() {

		var checkBoxChecked = noise.checked;
		var val = parseInt( noiseValue.value, 10 );

        self.app.updateCanvasObjProp( checkBoxChecked, 6,
            new fabric.Image.filters.Noise( {
                "noise": val
            } )
        );

    };

    var gradientTrans = document.getElementById( "gradient-transparency" );
    var gradientTransValue = document.getElementById(
        "gradient-transparency-value"
    );

	document.getElementById( "gradient-transparency" ).onclick = function() {

		var val = parseInt( gradientTransValue.value, 10 );

        self.app.editCanvasObj( this, 7,
            new fabric.Image.filters.GradientTransparency( {
                "threshold": val
            } )
        );

    };

	document.getElementById( "gradient-transparency-value" ).onchange =
        function() {

		var checkBoxChecked = gradientTrans.checked;
		var val = parseInt( gradientTransValue.value, 10 );

		self.app.updateCanvasObjProp( checkBoxChecked, 7,
            new fabric.Image.filters.GradientTransparency( {
                "threshold": val
            } )
        );

    };

	document.getElementById( "blur" ).onclick = function() {

		self.app.editCanvasObj( this, 8,
            new fabric.Image.filters.Convolute( {
				"matrix": [ 1/9, 1/9, 1/9,
						  1/9, 1/9, 1/9,
						  1/9, 1/9, 1/9 ]
				}
            )
        );

	};

	document.getElementById( "sharpen" ).onclick = function() {

		self.app.editCanvasObj( this, 9,
            new fabric.Image.filters.Convolute( {
				"matrix": [  0, -1,  0,
						  -1,  5, -1,
						   0, -1,  0 ]
				}
		    )
        );

	};

	document.getElementById( "emboss" ).onclick = function() {

		self.app.editCanvasObj( this, 10,
            new fabric.Image.filters.Convolute( {
				"matrix": [ 1,   1,  1,
						  1, 0.7, -1,
						 -1,  -1, -1 ]
				}
		    )
        );

	};

	document.getElementById( "opacity-value" ).onchange = function() {

		self.app.setProp( "opacity", this.value );

	};

	document.getElementById( "angle-value" ).onchange = function() {

		self.app.setProp( "angle", this.value );

	};

	document.getElementById( "scale-value" ).onchange = function() {

		var scaleValue = this.value;

		self.app.setProp( "scaleX", scaleValue );
		self.app.setProp( "scaleY", scaleValue );

	};

	document.getElementById( "colorFill" ).onchange = function() {

		self.app.setProp( "fill", "#" + this.color );

    };

};

/**
 * Function: initSaveTabHandler
 *
 * Initialize handlers for save tab
 */
CanvasAppToolbar.prototype.initSaveTabHandler = function initSaveTabHandler() {

    var self = this;

	document.getElementById( "saveTab" ).onclick = function() {

        self.updatePreview();

    };

	document.getElementById( "saveImage" ).onclick = function() {

        self.app.saveImage();

    };

	document.getElementById( "refreshImage" ).onclick = function() {

        self.updatePreview();

    };

};

/**
 * Function: updatePreview
 *
 * Update preview of saved image on save tab
 */
CanvasAppToolbar.prototype.updatePreview = function updatePreview() {

	document.getElementById( "savePreview" ).src =
        document.getElementById( "collage" ).toDataURL( "image/png" );

};

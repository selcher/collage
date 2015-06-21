/**
 * Class: CanvasApp
 *
 */
function CanvasApp( canvas ) {

    if ( this instanceof CanvasApp ) {

        this.canvas = canvas;
        this.bgColor = "#000000";
        this.color = "#66FF00";
        this.colorTxt = "#66FF00";

        this.image = new Image();

        // obj = image / shape / text / imgCrop
        this.canvasObj = {
            "images": {},
            "imagesCount": 1,
            "shapes": {},
            "shapesCount": 1,
            "texts": {},
            "textsCount": 1,
            "imgCrop": {},
            "imgCropCount": 1
        };

        this.toolbar = null;
        this.sidebar = this;

        return this;

    } else {

        return new CanvasApp();

    }

}

/**
 * Function: init
 *
 * Initialize app
 */
CanvasApp.prototype.init = function init() {

    this.canvas.backgroundColor = this.bgColor;

    this.canvas.renderAll();

    this.createObjects();
    this.initObjects();
    this.initHandlers();

};

/**
 * Function: createObject
 *
 * Create app objects
 */
CanvasApp.prototype.createObjects = function createObjects() {

    this.toolbar = new CanvasAppToolbar( this );
    this.sidebar = new CanvasAppSidebar( this );
    this.crop = new CanvasCrop( this );

};

/**
 * Function: initObjects
 *
 * Initialize app objects
 */
CanvasApp.prototype.initObjects = function initHandlers() {

    this.toolbar.init();
    this.sidebar.init();
    this.crop.init();

};

/**
 * Function: initHandlers
 *
 * Initialize handlers for app
 */
CanvasApp.prototype.initHandlers = function initHandlers() {

    this.initFabricCanvasHandlers();

};

/**
 * Function: initFabricCanvasHandlers
 *
 * Initialize handlers for fabric canvas
 */
CanvasApp.prototype.initFabricCanvasHandlers =
    function initFabricCanvasHandlers() {

    var self = this;

    var canvas = this.canvas;
    var canvasObj = this.canvasObj;
    var images = canvasObj.images;
    var shapes = canvasObj.shapes;
    var texts = canvasObj.texts;
    var imgCrop = canvasObj.imgCrop;

    var sidebar = this.sidebar;

	fabric.util.addListener( fabric.document, "dblclick",
        function dblClickHandler() {

        	var obj = canvas.getActiveObject();

        	if ( obj ) {

        		for ( i in texts ) {

        			if ( texts[ i ] == obj ) {

        				var newTxt = prompt( "Enter new text:", "text" );

                        if ( newTxt ) {

                            texts[ i ].setText( newTxt );
                        	canvas.renderAll();

                        }
        			}

        		}
        	}
        }

    );

	this.canvas.on( "object:selected", function() {

		var currentObject = self.canvas.getActiveObject();
        var listItem = null;

        // Clear selection on sidebar
        sidebar.clearSelection();

        for ( i in images ) {

			// add selection on list for selected canvas object
			if ( images[ i ] && images[ i ][ "img" ] == currentObject ) {

				listItem = $( "#img" + i );

                if ( !( listItem.hasClass( "selectedList" ) ) ) {

                    listItem.addClass( "selectedList" );

                }

			}
		}

		for ( i in shapes ) {

			// add selection on list for selected canvas object
			if ( shapes[ i ] == currentObject ) {

                listItem = $( "#shp" + i );

				if ( !( listItem.hasClass( "selectedList" ) ) ) {

					listItem.addClass( "selectedList" );

                }

			}

		}

		for ( i in texts ) {

			// add selection on list for selected canvas object
			if ( texts[ i ] == currentObject ) {

                listItem = $( "#txt" + i );

				if ( !( listItem.hasClass( "selectedList" ) ) ) {

					listItem.addClass( "selectedList" );

                }
			}
		}

		for ( i in imgCrop ) {

			// add selection on list for selected canvas object
			if ( imgCrop[ i ][ "img" ] == currentObject ) {

                listItem = $( "#crp" + i );

				if ( !( listItem.hasClass( "selectedList" ) ) ) {

					listItem.addClass( "selectedList" );

                }

            }

		}

	} );

	this.canvas.on( "selection:cleared", function() {

        sidebar.clearSelection();

	} );

};

/**
 * Function: setColor
 *
 * Set color
 */
CanvasApp.prototype.setColor = function setColor( color ) {

    this.color = color;

};

/**
 * Function: setColorTxt
 *
 * Set colorTxt
 */
CanvasApp.prototype.setColorTxt = function setColorTxt( color ) {

    this.colorTxt = color;

};

/**
 * Function: setBgColor
 *
 * Set background color
 */
CanvasApp.prototype.setBgColor = function setBgColor( color ) {

    this.bgColor = color;

};

/**
 * Function: showLoading
 *
 * Show div with loading image
 */
CanvasApp.prototype.showLoading = function showLoading() {

    $( "#loadIndicator" ).show();

};

/**
 * Function: hideLoading
 *
 * Hide div with loading image
 */
CanvasApp.prototype.hideLoading = function showLoading() {

    $( "#loadIndicator" ).hide();

};

/**
 * Function: updateCanvas
 *
 * Update the the canvas
 */
CanvasApp.prototype.updateCanvas = function updateCanvas() {

    this.canvas.renderAll();

};

/**
 * Function: updateCanvasBgColor
 *
 * Update the background color of the canvas
 */
CanvasApp.prototype.updateCanvasBgColor = function updateCanvasBgColor() {

    this.canvas.backgroundColor = this.bgColor;

    this.updateCanvas();

};

/**
 * Function: getImageWithPreview
 *
 * When opening a new image,
 * 1. Set the imgPreview src on the toolbar
 * 2. Set the cropbox src for image cropping
 * 3. Set the preview src for image crop preview
 * 4. Add an img element for generating the
 * 		cropped image:
 * 		<img id="cropImg" ... />
 *
 * @param input = form file input for new image
 * @param w = new width of image ( default 100 )
 * @param h = new height of image ( default 63 )
 */
CanvasApp.prototype.getImageWithPreview =
    function getImageWithPreview( input, w, h ) {

    w = w || 100;
    h = h || 63;

    var self = this;

    if ( input.files && input.files[ 0 ] ) {

		this.showLoading();

		var reader = new FileReader();

		reader.onload = function ( e ) {

			// store img for adding image later
			self.image.src = e.target.result;

			$( "#imgPreview" ).attr(
                "src", e.target.result ).width( w ).height( h );

			self.crop.initJcrop( e.target.result );

		};

		setTimeout( function() {

			reader.readAsDataURL( input.files[ 0 ] );

			self.hideLoading();

		}, 10 );

	}

};

/**
 * Function: addImage
 *
 * Add selected image to canvas
 */
CanvasApp.prototype.addImage = function addImage() {

	var self = this;

    var src = this.image.src;

    var canvasObj = this.canvasObj;
    var images = canvasObj.images;
    var cnt = canvasObj.imagesCount;

    var sidebar = this.sidebar;
    var toolbar = this.toolbar;

    this.showLoading();

	setTimeout( function() {

		setTimeout( function() {

            fabric.Image.fromURL( src, function( img ) {

				images[ cnt ] = {
                    "src": null,
                    "img": null,
                    "id": cnt
                };
				images[ cnt ][ "src" ] = src;
				images[ cnt ][ "img" ] = img;

				canvasObj.imagesCount = cnt + 1;

				// add filter
				img.filters[0] = null;

				// apply filters and re-render canvas when done
				img.applyFilters( self.canvas.renderAll.bind( self.canvas ) );

				// add image onto canvas
				self.canvas.add( img );

                // update list on sidebar
				sidebar.updateList();

            } );

		}, 0 );

		setTimeout( function() {

			toolbar.updatePreview();

            self.hideLoading();

        }, 10 );

	}, 10 );

};

/**
 * Function: removeObj
 *
 * Remove object from canvas
 *
 * @param i = index in list
 * @param type = img / shp
 */
CanvasApp.prototype.removeObj = function removeObj( i, type ) {

	var canvas = this.canvas;
    var canvasObj = this.canvasObj;

    var list = type == "img" ? canvasObj.images : null;
    list = type == "shp" ? canvasObj.shapes : list;
    list = type == "txt" ? canvasObj.texts : list;
    list = type == "crp" ? canvasObj.imgCrop : list;

    var selectedObj = list[ i ] && (
        type == "img" || type == "crp" ) ?
        list[ i ][ "img" ] : list[ i ];

    if ( type != "img" || ( type == "img" && i != 0 ) ) {

		canvas.remove( selectedObj );

	} else {

		canvas.setBackgroundImage( "" );
		canvas.backgroundColor = "#FFFFFF";
		canvas.renderAll();

	}

	delete list[ i ];

};

/**
 * Function: setBackGround
 *
 * Set background image of canvas
 */
CanvasApp.prototype.setBackGround = function setBackGround() {

    var self = this;

    var canvas = this.canvas;
    var image = this.image;
    var src = image.src;

    var canvasObj = this.canvasObj;
    var images = canvasObj.images;

	this.showLoading();

	setTimeout( function() {

		setTimeout ( function() {
			canvas.setBackgroundImage(
                src,
                canvas.renderAll.bind( canvas )
            );
		}, 10 );

		setTimeout( function() {
			fabric.Image.fromURL( src, function( img ) {
				images[ 0 ] = { "src": null, "img": null };
				images[ 0 ][ "src" ] = src;
				images[ 0 ][ "img" ] = img;

				self.sidebar.updateList();
			} );
		}, 10 );

		setTimeout( function() {

			self.toolbar.updatePreview();
			self.hideLoading();

        }, 20 );

	}, 0);

};

/**
 * Function: addShape
 *
 * Add shape to canvas
 */
CanvasApp.prototype.addShape = function addShape() {

    var canvasObj = this.canvasObj;
    var shapes = canvasObj.shapes;
    var cnt = canvasObj.shapesCount;

    var shapePicked = document.querySelector(
        "input[name=shape]:checked" ).value;

	if ( shapePicked == "circle" ) {
	    shapes[ cnt ] = new fabric.Circle( {
            "radius": 10,
            "fill": this.color,
            "left": 100,
            "top": 100
        } );
	}

	if ( shapePicked == "rectangle" ) {
		shapes[ cnt ] = new fabric.Rect( {
            "left": 100,
            "top": 100,
            "fill": this.color,
            "width": 20,
            "height": 20
        } );
	}

	if ( shapePicked == "triangle" ) {
		shapes[ cnt ] = new fabric.Triangle( {
            "width": 20,
            "height": 30,
            "fill": this.color,
            "left": 50,
            "top": 50
        } );
	}

	// check if a shape radio button is selected
	if ( shapePicked !== undefined ) {

		this.canvas.add( shapes[ cnt ] );
		canvasObj.shapesCount = cnt + 1;

		this.sidebar.updateList();
	}

};

/**
 * Function: addText
 *
 * Add text to canvas
 */
CanvasApp.prototype.addText = function addText() {

	var fntFamily = $( "#fontFamily option:selected" ).val();
	var fntDecor = $( "#fontDecor option:selected" ).val();

    var canvas = this.canvas;
    var canvasObj = this.canvasObj;
    var texts = canvasObj.texts;
    var cnt = canvasObj.textsCount;

	texts[ cnt ] = new fabric.Text( "text", {
		"left": 100,
		"top": 100,
		"fill": this.colorTxt,
		"fontFamily": fntFamily,
		"textDecoration": fntDecor
	} );


	canvas.add( texts[ cnt ] );
	this.canvasObj.textsCount = cnt + 1;

	this.sidebar.updateList();

};

/**
 * Function: moveUp
 *
 * Move order of object higher ( edit tab )
 */
CanvasApp.prototype.moveUp = function moveUp() {

	var canvas = this.canvas;
    var currentObject = canvas.getActiveObject();

    canvas.bringForward( currentObject );

	this.toolbar.updatePreview();

};

/**
 * Function: moveBack
 *
 * Move order of object lower ( edit tab )
 */
CanvasApp.prototype.moveBack = function moveBack() {

	var canvas = this.canvas;
    var currentObject = canvas.getActiveObject();

    canvas.sendBackwards( currentObject );

	this.toolbar.updatePreview();

};

/**
 * Function: strtCanvasObj
 *
 * Straigthen canvas object when it is rotated ( edit tab )
 */
CanvasApp.prototype.strtCanvasObj = function strtCanvasObj() {

	var canvas = this.canvas;
    var currentObject = canvas.getActiveObject();

    currentObject.straighten();

    canvas.renderAll();

};

/**
 * Function: editCanvasObj
 *
 * Update canvas object based on edit option enabled
 */
CanvasApp.prototype.editCanvasObj = function editCanvasObj(
    checkBox, filterIndex, filterObj ) {

	var self = this;
    var canvas = this.canvas;
    var obj = canvas.getActiveObject();

	// obj.filters is undefined if obj is a shape
	if ( obj && obj.filters ) {

		this.showLoading();

		if ( obj.filters[ filterIndex ] == null ) {

			if ( checkBox.checked ) {
				obj.filters[ filterIndex ] = filterObj;
            }

        } else {

            if ( !( checkBox.checked ) ) {
				obj.filters[ filterIndex ] = null;
            }

        }

		setTimeout( function() {

			obj.applyFilters( canvas.renderAll.bind( canvas ) );

			self.hideLoading();

		}, 10 );

	}

};

/**
 * Function: updateCanvasObjProp
 *
 * Update canvas object based on edit option value provided
 */
CanvasApp.prototype.updateCanvasObjProp = function updateCanvasObjProp(
    checkBoxChecked, filterIndex, filterObj ) {

    var self = this;
    var canvas = this.canvas;
    var obj = canvas.getActiveObject();

	// obj.filters is undefined if obj is a shape
	if ( obj && obj.filters ) {

		this.showLoading();

		if ( checkBoxChecked ) {
			obj.filters[ filterIndex ] = filterObj;
		}

		setTimeout( function() {

			obj.applyFilters( canvas.renderAll.bind( canvas ) );

			self.hideLoading();

		}, 10 );

	}

};

// set property value (eg. opacity)
/**
 * Function: setProp
 *
 * Set property value ( e.g. opacity )
 */
CanvasApp.prototype.setProp = function setProp( prop, val ) {

    var canvas = this.canvas;
	var currentObject = canvas.getActiveObject();

	if ( currentObject ) {

		currentObject.set( prop, val );
		canvas.renderAll();

    }

};

/**
 * Function: flip
 *
 * Flip the canvas object along the x or y axis
 *
 * @param type = x or y
 */
CanvasApp.prototype.flip = function flip( type ) {

    var canvas = this.canvas;
	var currentObject = canvas.getActiveObject();
	var flip = currentObject.get( "flip" + type );

	if ( currentObject ) {

        if ( flip ) {

			currentObject.set( "flip" + type, false );

        } else {

        	currentObject.set( "flip" + type, true );

        }

		canvas.renderAll();

    }

};

/**
 * Function: saveImage
 *
 * Save the canvas as image using
 * FileSaverJS and canvas-toBlobJS
 */
CanvasApp.prototype.saveImage = function saveImage() {

	var canvas = document.getElementById( "collage" );
	var ctx = canvas.getContext( "2d" );

	canvas.toBlob( function( blob ) {
		saveAs( blob, "canvas.png" );
	} );

};

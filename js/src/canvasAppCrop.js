/**
 * Class CanvasCrop
 *
 * Crop feature
 */
function CanvasCrop( app ) {

	if ( this instanceof CanvasCrop ) {

		var doc = document;

		this.app = app;
		this.canvas = app.canvas;
		this.container = doc.getElementById( "cropDiv" );
		this.menu = doc.getElementById( "cropDivMenu" );

		this.currentImg = new Image();

		this.jcropApi = null;

		this.cropX = doc.getElementById( "x" );
		this.cropY = doc.getElementById( "y" );
		this.cropW = doc.getElementById( "w" );
		this.cropH = doc.getElementById( "h" );

		// Store crop box coordinates and size.
		this.dstX = null;
		this.dstY = null;
		this.dstW = null;
		this.dstH = null;

		this.cropBoxContainer = doc.getElementById( "cropboxContainer" );
		this.cropBox = doc.getElementById( "cropbox" );
		this.cropImgPreviewContainer = doc.getElementById( "imgCont" );
		this.cropPreview = doc.getElementById( "cropPreview" );
		this.generatedCropContainer = doc.getElementById( "collageCropContainer" );
		this.generatedCropCanvas = doc.getElementById( "collageCrop" );

		// Crop div menu buttons.
		this.showCropDivBtn = doc.getElementById( "cropBtn" );
		this.hideCropDivBtn = doc.getElementById( "closeCrop" );
		this.showCropBoxBtn = doc.getElementById( "cropImgBtn" );
		this.showCropImgBtn = doc.getElementById( "generateCropImgBtn" );
		this.addToCanvasBtn = doc.getElementById( "addCropToCanvas" );
		this.saveCropImgBtn = doc.getElementById( "saveCrop" );

		// Hidden when crop div is shown.
		this.topMenu = doc.getElementById( "topMenu" );
		this.canvasCont = doc.getElementById( "canvasCont" );
		this.toolbar = doc.getElementById( "toolbar" );

		return this;

	} else {

		return new CanvasCrop( app );

	}

}

/**
 * Function: init
 *
 * Initialize
 */
CanvasCrop.prototype.init = function init() {

	this.initHandlers();

};

/**
 * Function: initHandlers
 *
 * Initialize event handlers for crop feature
 */
CanvasCrop.prototype.initHandlers = function initHandlers() {

	var self = this;

	this.showCropDivBtn.onclick = function() {
		self.topMenu.style.display = "none";
		self.canvasCont.style.display = "none";
		self.toolbar.style.display = "none";
		self.displayCropDiv();

		self.showCropBoxContainer();
		self.hideGeneratedCropContainer();
	};

	this.hideCropDivBtn.onclick = function() {
		self.topMenu.style.display = "block";
		self.canvasCont.style.display = "block";
		self.toolbar.style.display = "block";
		self.hideCropDiv();
	};

	this.showCropBoxBtn.onclick = function() {
		self.showCropBoxContainer();
		self.hideGeneratedCropContainer();
	};

	this.showCropImgBtn.onclick = function() {
		self.hideCropBoxContainer();
		self.showGeneratedCropContainer();

		self.generateCropCanvas();
	};

	this.addToCanvasBtn.onclick = function() {
		self.addCropToCanvas();
		self.app.sidebar.openList();
	};

	this.saveCropImgBtn.onclick = function() {
		self.saveCrop();
	};

};

/**
 * Function: initJcrop
 *
 * Initialize jcrop widget
 */
CanvasCrop.prototype.initJcrop = function initJCrop( img ) {

	var self = this;

	if ( this.jcropApi ) {

		this.jcropApi.destroy();

	}

	this.cropBox.src = img;
	this.cropPreview.src = img;

	$( "#cropbox" ).Jcrop( {
		"onChange": this.showPreview.bind( this ),
		"onSelect": this.showPreview.bind( this )
	}, function() {

		self.jcropApi = this;

	} );

	// Store image temporarily
	this.currentImg.src = img;

};

/**
 * Function: displayCropDiv
 *
 * Display crop div
 */
CanvasCrop.prototype.displayCropDiv = function displayCropDiv() {

	var container = this.container;
	var display = container.style.display;

	if ( display === "none" || display === "" ) {

		container.style.display = "block";
		this.menu.style.display = "block";

	}

};

/**
 * Function: hideCropDiv
 *
 * Hide crop div
 */
CanvasCrop.prototype.hideCropDiv = function hideCropDiv() {

	var container = this.container;
	var display = container.style.display;

	if ( display == 'block' ) {

		container.style.display = "none";
		this.menu.style.display = "none";

	}

};

/**
 * Function: showCropBoxContainer
 *
 * Show crop box container in crop div
 */
CanvasCrop.prototype.showCropBoxContainer =
	function showCropBoxContainer() {

		this.cropBoxContainer.style.display = "block";

		this.showCropImgBtn.style.display = "inline-block";
};

/**
 * Function: hideCropBoxContainer
 *
 * Hide crop box container in crop div
 */
CanvasCrop.prototype.hideCropBoxContainer =
	function hideCropBoxContainer() {

		this.cropBoxContainer.style.display = "none";

		this.showCropImgBtn.style.display = "none";
};

/**
 * Function: showGeneratedCropContainer
 *
 * Show generated crop image container in crop div
 */
CanvasCrop.prototype.showGeneratedCropContainer =
	function showGeneratedCropContainer() {

		this.generatedCropContainer.style.display = "block";

		this.showCropBoxBtn.style.display = "inline-block";
		this.addToCanvasBtn.style.display = "inline-block";
		this.saveCropImgBtn.style.display = "inline-block";
};

/**
 * Function: hideGeneratedCropContainer
 *
 * Hide generated crop image container in crop div
 */
CanvasCrop.prototype.hideGeneratedCropContainer =
	function hideGeneratedCropContainer() {

		this.generatedCropContainer.style.display = "none";

		this.showCropBoxBtn.style.display = "none";
		this.addToCanvasBtn.style.display = "none";
		this.saveCropImgBtn.style.display = "none";
};

/**
 * Function: showPreview
 *
 * Called by JCrop for events onChange and onSelect
 * when crop box changes
 *
 * @param coords
 */
CanvasCrop.prototype.showPreview = function showPreview( coords ) {

	this.cropX.value = coords.x;
	this.cropY.value = coords.y;
	this.cropW.value = coords.w;
	this.cropH.value = coords.h;

	var cropImgPreviewContainer = this.cropImgPreviewContainer;
	cropImgPreviewContainer.style.width = coords.w + "px";
	cropImgPreviewContainer.style.height = coords.h + "px";

	var oImgW = this.cropBox.width;
	var oImgH = this.cropBox.height;
	var rx = 1;
	var ry = 1;

	$( "#cropPreview" ).css( {

		width: ( rx * oImgW ) + "px",
		height: ( ry * oImgH ) + "px",
		marginLeft: "-" + Math.round( rx * coords.x ) + "px",
		marginTop: "-" + Math.round( ry * coords.y ) + "px"

	} );
};

/**
 * Function: generateCropCanvas
 *
 * Generate cropped image on canvas
 */
CanvasCrop.prototype.generateCropCanvas = function generateCropCanvas() {

	var cropBox = this.cropBox;

	this.generatedCropCanvas.width = this.cropW.value;
	this.generatedCropCanvas.height = this.cropH.value;

	var canvas2 = this.generatedCropCanvas;
	var context = canvas2.getContext( '2d' );

	var imageObj = new Image();

	imageObj.onload = function() {

		// draw cropped image
		var sourceX = parseInt( this.cropX.value );
		var sourceY = parseInt( this.cropY.value );
		var sourceWidth = parseInt( this.cropW.value );
		var sourceHeight = parseInt( this.cropH.value );
		var destWidth = sourceWidth;
		var destHeight = sourceHeight;
		var destX = canvas2.width / 2 - destWidth / 2;
		var destY = canvas2.height / 2 - destHeight / 2;

		context.drawImage( imageObj,
				sourceX, sourceY,
				sourceWidth, sourceHeight,
				destX, destY,
				destWidth, destHeight );

		var cbw = cropBox.width / 2;
		var cbh = cropBox.height / 2;

		// Store x, y, w, and h for adding crop to canvas later
		// Position is based on center and not on topLeft side
		// so calculate...
		this.dstX = -cbw;
		this.dstY = -cbh;
		this.dstW = destWidth;
		this.dstH = destHeight;

		if ( sourceX < cbw ) { this.dstX = -( cbw - sourceX ); }
		if ( sourceX > cbw ) { this.dstX = cbw - sourceX; }
		if ( sourceY < cbh ) { this.dstY = -( cbh - sourceY ); }
		if ( sourceY > cbh ) { this.dstY = cbh - sourceY; }

	}.bind( this );

	imageObj.src = cropBox.src;

};

/**
 * Function: addCropToCanvas
 *
 * Add the cropped image to the canvas
 */
CanvasCrop.prototype.addCropToCanvas = function addCropToCanvas() {

	this.addCropImg( this.dstX, this.dstY, this.dstW, this.dstH );
};

/**
 * Function: addCropImg
 *
 * Add cropped image to canvas
 * dstX = starting x pt of crop
 * dstY = starting y pt of crop
 * dstW = width of crop
 * dstH = height of crop
 *
 * @param dstX
 * @param dstY
 * @param dstW
 * @param dstH
 */
CanvasCrop.prototype.addCropImg = function addCropImg(
	dstX, dstY, dstW, dstH ) {

	var canvasObj = this.app.canvasObj;
	var imgCrop = canvasObj.imgCrop;
	var cnt = canvasObj.imgCropCount;
	var img = this.currentImg;

	// store img in cropImgsCont div (hidden)
	var canvasObj = this.app.canvasObj;
	var cnt = canvasObj.imgCropCount;
	var id = "cropImg" + cnt;
	var newImg = '<img id="' + id + '" src="' + img.src + '" />';

	$( "#cropImgsCont" ).append( newImg );

	var imgElement = document.getElementById( id );

	imgCrop[ cnt ] = {
		"id": id,
		"src": imgElement.src,
		"img": new fabric.Image( imgElement, {
			"left": 100,
			"top": 100,
			"angle": 0,
			"opacity": 1,
			"clipTo": function( ctx ) {
				ctx.rect( dstX, dstY, dstW, dstH );
			}
		} )
	};

	// Add to canvas
	this.canvas.add( imgCrop[ cnt ][ "img" ] );
	this.app.canvasObj.imgCropCount += 1;

	// Update sidebar list
	this.app.sidebar.updateList();

};

/**
 * Function: saveCrop
 *
 * Save the cropped image using
 * FileSaverJS and canvas-toBlobJS
 */
CanvasCrop.prototype.saveCrop = function saveCrop() {

	var canvas = this.generatedCropCanvas;
	var ctx = canvas.getContext( "2d" );

	canvas.toBlob( function( blob ) {
		saveAs( blob, "crop.png" );
	} );

};

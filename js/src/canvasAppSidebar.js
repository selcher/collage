/**
 * Class: CanvasAppSidebar
 *
 * Sidebar
 */
function CanvasAppSidebar( app ) {

    if ( this instanceof CanvasAppSidebar ) {

        this.app = app;

        return this;

    } else {

        return new CanvasAppSidebar( app );

    }
}

/**
 * Function: init
 */
CanvasAppSidebar.prototype.init = function init() {

    this.initHandlers();

};

/**
 * Function: initHandlers
 *
 * Initialize handlers
 */
CanvasAppSidebar.prototype.initHandlers = function initHandlers() {

    var self = this;
    var imgListEmpty = true;
    var resetImgList = function() {

        if ( imgListEmpty ) {

            imgListEmpty = true;
            self.resetImgList();

        }

    };

    document.getElementById( "imgFile" ).addEventListener(
        "change", resetImgList
    );
    document.getElementById( "addShape" ).addEventListener(
        "click", resetImgList
    );
    document.getElementById( "addText" ).addEventListener(
        "click", resetImgList
    );
    $( "#imgList" ).on( "click", ".listCont", function( e ) {

        e.stopPropagation();

        var index = $( this ).attr( "data-index" );
        var type = $( this ).attr( "data-type" );

        // selectImg / selectShp
        self.selectObj( index, type );

    } );
    $( "#imgList" ).on( "click", ".liCheckBox", function( e ) {

        e.stopPropagation();

        var index = $( this ).attr( "data-index" );
        var type = $( this ).attr( "data-type" );

        // hideImg / hideShp
        self.hideObj( index, type );

    } );
    $( "#imgList" ).on( "click", ".listRemoveCanvasObj", function( e ) {

        e.stopPropagation();

        var index = $( this ).attr( "data-index" );
        var type = $( this ).attr( "data-type" );

        // removeImg / removeShp
        self.removeObj( index, type.toLowerCase() );

        self.app.removeObj( index, type.toLowerCase() );

    } );

};

/**
 * Function: openList
 *
 * Open canvas list on sidebar accordion
 */
CanvasAppSidebar.prototype.openList = function openList() {

    var sidebarPanel = $( "#sidebar-panel" );

    if ( sidebarPanel.accordion( "option", "active" ) === 1 ) {

        sidebarPanel.accordion( "option", "active", 0 );

    }

};

/**
 * Function: resetImgList
 *
 * Reset div containing list of images added to canvas
 */
CanvasAppSidebar.prototype.resetImgList = function resetImgList() {

    document.getElementById( "imgList" ).html = "";

};

/**
 * Function: updateList
 *
 * Update sidebar list of images, shapes, texts, imgCrop
 */
CanvasAppSidebar.prototype.updateList = function updateList() {

    var list = "";
    var app = this.app;
    var canvasObj = app.canvasObj;
    var images = canvasObj.images;
    var shapes = canvasObj.shapes;
    var texts = canvasObj.texts;
    var imgCrop = canvasObj.imgCrop;

    if ( images[ 0 ] != null ) {
		list = this.getListDiv( 0, "Img", "BG" );
	}

    for ( i in images ) {

        if ( i != 0 ) {
			list += this.getListDiv( i, "Img", "Img_" + i );
        }

	}

	for ( i in shapes ) {

        if ( i != 0 ) {
			list += this.getListDiv( i, "Shp", "Shp_" + i );
        }

	}

	for ( i in texts ) {

		if ( i != 0 ) {
			list += this.getListDiv( i, "Txt", "Txt_" + i );
	    }

    }

	for ( i in imgCrop ) {
		list += this.getListDiv( i, "Crp", "Crp_" + i );
	}

	document.getElementById( "imgList" ).innerHTML = list;

};

/**
 * Function: getListDiv
 *
 * Return html for item in sidebar list
 * <div> added to <div id="imgList"></div>
 * type = Img or Shp
 */
CanvasAppSidebar.prototype.getListDiv = function getListDiv( index, type, txt ) {

    var self = this;

    var app = this.app;
    var canvasObj = app.canvasObj;
    var images = canvasObj.images;
    var imgCrop = canvasObj.imgCrop;

	var img = type == "Img" ?
        "<img class='liImg' src=" + images[ index ][ "src" ] + " />" : "";
	img = type == "Crp" ?
        "<img class='liImg' src=" + imgCrop[ index ][ "src" ] + " />" : img;
	var liCheckBoxId = ( type.toLowerCase() )[ 0 ] + index;

	return (
        "<div class='listCont' id='" + type.toLowerCase() + index + "' " +
            "data-index='" + index + "' " +
            "data-type='" + type.toLowerCase() + "' " + ">" +

				"<input class='liCheckBox' id='" + liCheckBoxId +
                    "' type='checkbox' " +
                    "data-index='" + index + "' " +
                    "data-type='" + type.toLowerCase() + "' " +
                    "checked='checked'></input>" +

                "<div class='liImgDiv'>" + img + "</div>" +
				"<div class='liTxt'>&nbsp;" + txt + "&nbsp;</div>" +

                "<div class='listRemoveCanvasObj' " +
                    "src='img/icons/0006_cross.png' " +
                    "data-index='" + index + "' " +
                    "data-type='" + type + "' " +
                    "></div>" +

		"</div>" +
        "<div class='clrFloat'></div>" );

};

/**
 * Function: selectObj
 *
 * On item selected on sidebar list
 *
 * @param i = index in list
 * @param type = img / shp
 */
CanvasAppSidebar.prototype.selectObj = function selectObj( i, type ) {

    var app = this.app;
    var canvas = app.canvas;

    var canvasObj = app.canvasObj;
    var list = type == "img" ? canvasObj.images : null;
    list = type == "shp" ? canvasObj.shapes : list;
    list = type == "txt" ? canvasObj.texts : list;
    list = type == "crp" ? canvasObj.imgCrop : list;

    var currentObject = canvas.getActiveObject();
    var selectedObjInList = list[ i ] && (
        type == "img" || type == "crp" ) ?
        list[ i ][ "img" ] : list[ i ];

    if ( selectedObjInList &&
        !( currentObject == selectedObjInList ) ) {

		canvas.setActiveObject( selectedObjInList );

		this.clearSelection();

        if ( $( "#" + type + i ).hasClass( "selectedList" ) ) {

			//$('#img'+i).removeClass('selectedList');

		} else {

			$( "#" + type + i ).addClass( "selectedList" );

		}

	}

};

/**
 * Function: hideObj
 *
 * Toggle hiding of obj on canvas
 */
CanvasAppSidebar.prototype.hideObj = function hideObj( i, type ) {

    var app = this.app;

    var canvas = app.canvas;

    var canvasObj = app.canvasObj;
    var list = type == "img" ? canvasObj.images : null;
    list = type == "shp" ? canvasObj.shapes : list;
    list = type == "txt" ? canvasObj.texts : list;
    list = type == "crp" ? canvasObj.imgCrop : list;

    var selectedObjInList = list[ i ] && (
        type == "img" || type == "crp" ) ?
        list[ i ][ "img" ] : list[ i ];

    var checkBoxId = type == "img" ? "i" + i : "";
    checkBoxId = type == "shp" ? "s" + i : checkBoxId;
    checkBoxId = type == "txt" ? "t" + i : checkBoxId;
    checkBoxId = type == "crp" ? "c" + i : checkBoxId;

	// TODO: refactor hiding to app
    if ( type != "img" || ( i != 0 && type == "img" ) ) {

        selectedObjInList.set( "opacity", 0 );

        if ( document.getElementById( checkBoxId ).checked ) {
            selectedObjInList.set( "opacity", 1 );
		}

	} else {

		canvas.setBackgroundImage( "", canvas.renderAll.bind( canvas ) );

        if ( document.getElementById( checkBoxId ).checked ) {
			canvas.setBackgroundImage(
                list[ 0 ][ "src" ],
                canvas.renderAll.bind( canvas )
            );
		}
	}

	canvas.renderAll();

};

/**
 * Function: removeObj
 *
 * Remove object from sidebar list
 */
CanvasAppSidebar.prototype.removeObj = function removeObj( i, type ) {

    document.getElementById( "imgList" ).removeChild(
        document.getElementById( type + i )
    );

};

/**
 * Function: clearSelection
 *
 * Clear selection on sidebar list
 */
CanvasAppSidebar.prototype.clearSelection = function clearSelection() {

    $( ".listCont" ).removeClass( "selectedList" );

};

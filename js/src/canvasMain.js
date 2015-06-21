// Load last

$( document ).ready( function() {

	var queue = new createjs.LoadQueue( true );
	var progress = 0;

	queue.loadManifest( [
		{
			id : "logo",
			src : "img/github-logo.png"
		},
		{
			id : "glyphIcons",
			src : "img/glyphicons-halflings-white.png"
		},
		{
			id : "noImage",
			src : "img/no_Image.jpg"
		}
	] );

	queue.addEventListener( "progress", function( e ) {

		progress = Math.floor( e.loaded * 100 );
		document.getElementById( "loadBar" ).style.width = progress + "%";

	} );

	queue.addEventListener( "complete", function( e ) {

		onPreLoadComplete();
		
	} );

	queue.load();

	function onPreLoadComplete() {

		$( "#loadPage" ).fadeOut( 1000, function() {

			document.getElementById( "topMenu" ).style.display = "block";
			document.getElementById( "toolbar" ).style.display = "block";
			document.getElementById( "canvasCont" ).style.display = "block";
			document.getElementById( "footerCont" ).style.display = "block";

			// Toolbar tabs
			$( "#toolbar" ).tabs();

			// Tooltip
			$( document ).tooltip();

			// Right sidebar drop down lists
			// (add image, edit image, save canvas...)
			$( "#sidebar-panel" ).accordion( { "active": 1 } );

			// hide add image/background buttons until user opens a file
			$( "#toolbar_addImg" ).hide();

		    // Initialize canvas app
		    var app = new CanvasApp( new fabric.Canvas( "collage" ) );

		    app.init();

		} );

	}

} );

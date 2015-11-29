// Load last

$( document ).ready( function() {

	var doc = document;
	var queue = new createjs.LoadQueue( true );
	var progress = 0;
	var loadingBar = doc.getElementById( "loadBar" );
	var loadingMessage = doc.getElementById( "loadMessage" );

	loadingMessage.innerHTML = "Loading";

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
		loadingBar.style.width = progress + "%";

	} );

	queue.addEventListener( "complete", function( e ) {

		onPreLoadComplete();

	} );

	queue.load();

	function onPreLoadComplete() {

		loadingMessage.innerHTML = "Initializing app";

		doc.getElementById( "topMenu" ).style.display = "block";
		doc.getElementById( "toolbar" ).style.display = "block";
		doc.getElementById( "canvasCont" ).style.display = "block";
		doc.getElementById( "footerCont" ).style.display = "block";

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

		// Hide loading page after app is initialized
		setTimeout( function() {

			loadingMessage.innerHTML = "Welcome";

			var appDom = $( "#app" );

			$( "#loadPage" ).fadeOut( 1000, function() {

				appDom.fadeIn( 500 );

			} );

		}, 1000 );

	}

} );

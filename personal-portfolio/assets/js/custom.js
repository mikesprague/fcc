jQuery( document ).ready( function( $ ) {

  $( window ).scroll( function() {
    if ( $( ".navbar" ).offset().top > 50 ) {
        $( ".navbar-fixed-top" ).addClass( "nav-collapse navbar-opacity" );
        $( "span.return-to-top" ).show();
    } else {
        $( ".navbar-fixed-top" ).removeClass( "nav-collapse navbar-opacity" );
        $( "span.return-to-top" ).hide();
    }
  });

  $( "a.page-scroll" ).on( "click", function( e ) {
    e.preventDefault();
    var anchor = $( this );
      $( "html, body" ).stop().animate({
          scrollTop: $( anchor.attr( "href" )).offset().top
      }, 1500, "easeInOutExpo" );
  });

  $( "[data-toggle=\"tooltip\"]" ).tooltip();

});

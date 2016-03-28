var app = {

  wikipediaEndpoint: "https://en.wikipedia.org/w/api.php",
  searchSuffix: "?action=query&format=json&prop=extracts|pageimages&generator=search&utf8=1&exsentences=1&exlimit=max&exintro=1&explaintext=1&exsectionformat=plain&piprop=thumbnail|name|original&pithumbsize=200&pilimit=max&gsrnamespace=0&gsrwhat=text&gsrlimit=20&redirects=1&gsrsearch=",
  apiUserAgent: "FccWikipediaViewer-MS/v0.5.0",
  noSearchResultsString: "<h1>No Results: <small>Please try another search term</small></h1>",
  brokenImageSrc: "https://placehold.it/215?text=n/a",

  initSearchField: function() {

    var currentSearchRequest = null;
    var searchField = $( ".search-field" );

    searchField.on( "keyup", function(e) {

      var searchQuery = encodeURIComponent( $.trim( $( this ).val() ));

      if (( searchQuery !== "" ) && ( searchQuery.length > 1 )) {

        var fullUrlToCall = app.wikipediaEndpoint + app.searchSuffix + searchQuery;
        currentSearchRequest = $.ajax({
          url: fullUrlToCall,
          dataType: "jsonp",
          type: "GET",
          crossDomain: true,
          headers: {
            "Api-User-Agent": app.apiUserAgent,
            "Access-Control-Allow-Origin": "*"
          },
          cache: false,

          beforeSend : function()    {
            if ( currentSearchRequest != null ) {

              currentSearchRequest.abort();

            }
          },

          success: function ( data ) {
            try {

              app.renderSearchResults( data.query.pages );

            } catch (e) {

              app.clearSearchResults();
              app.noSearchResults();

            };

            currentSearchRequest = null;

          },

          error: function( error ) {

            currentSearchRequest = null;

          }

        });

      } else {

        app.clearSearchResults();

      }

    });

    searchField.focus();

  },

  renderSearchResults: function( results ) {

    app.clearSearchResults();

    var searchResultsArray = Object.keys( results ).map(

      function( key ) {
        return results[key]
      }

    );

    for ( var i = 0; i < searchResultsArray.length; i++ ) {

      var searchResultTemplate = $( "#template-search-result" ).html();
      var searchResultString = Mustache.render( searchResultTemplate, searchResultsArray[i] );

      $( ".search-results" ).append( searchResultString );

    }

    app.fixBrokenImages();

  },

  clearSearchResults: function() {

    $( ".search-results" ).empty();

  },

  noSearchResults: function() {

    $( ".search-results" ).html( app.noSearchResultsString );

  },

  fixBrokenImages: function() {

    $( "img" ).error( function() {
      $( this ).attr( "src", app.brokenImageSrc );
    });

  },

  init: function() {

    app.initSearchField();

  }
};




jQuery( document ).ready( function( $ ) {

  app.init();

});

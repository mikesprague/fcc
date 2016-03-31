var app = {

  twitchApiPrefix: "https://api.twitch.tv/kraken/",
  twitchApiSuffix: "?callback=?",
  usersArray: [
    "freecodecamp", "storbeck", "mikesprague", "terakilobyte", "monstercat", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "brunofin", "comster404", "test_channel"
  ],
  timerBar: null,

  initCards: function( arrayOfUsers) {

    for ( var i = 0; i < arrayOfUsers.length; i++ ) {
      app.getTwitchData( "streams", arrayOfUsers[i] );
    }

    app.initDimmable();

  },

  initDimmable: function() {

    $( ".dimmable.image" ).dimmer({
      on: "hover"
    });

  },

  initFixedHeader: function() {

    $( ".main.menu" ).visibility({
      type: "fixed"
    });

    $( ".main.menu  .ui.dropdown" ).dropdown({
      on: "hover"
    });

  },

  getTwitchData: function( type, user ) {
    $.ajax({

      url: app.getApiUrl( type, user ),
      dataType: "jsonp",
      type: "GET",
      crossDomain: true,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      cache: false,
      success: function ( data ) {

        if ( type === "streams" ) {

          if (( data.hasOwnProperty( "stream" )) && ( data.stream === null )) { // stream is offline

            app.getTwitchData( "channels", user );

          } else if (( data.hasOwnProperty( "stream" )) && ( data.stream !== null )) { //stream is live

            app.renderData( "stream", data );

          } else if (( data.hasOwnProperty( "status" )) && ( data.status === 422 )) { // invalid stream

            app.renderInvalid( user );

          }

        } else if ( type === "channels" ) {

          app.renderData( "channel", data );

        }

      },
      error: function( error ) {

        app.handleError( error );

      }

    });

  },

  renderData: function( type, data ) {

    if ( type === "stream" ) {

      var streamerCardTemplate = $( "#template-streamer-card" ).html();
      var streamerCardString = Mustache.render( streamerCardTemplate, data );

      $( ".twitch.cards" ).append( streamerCardString );

    } else if ( type === "channel" ) {

      var channelCardTemplate = $( "#template-channel-card" ).html();
      var channelCardString = Mustache.render( channelCardTemplate, data );

      $( ".twitch.cards" ).append( channelCardString );

    }

    app.initDimmable();
    app.fixBrokenImages();

  },

  initFiltering: function() {

    $( "#sortable-cards" ).mixItUp({
      load: {
        filter: "all",
        sort: 'online:desc valid:desc name:asc'
      },
      selectors: {
    		target: ".card"
    	},
      layout: {
    		display: "flex"
    	},
      animation: {
        animateResizeTargets: true
    	},
      callbacks: {
      	onMixEnd: function( state ) {
          app.fixSortSizing();
      	},
        onMixLoad: function( state ) {
          app.fixSortSizing();
      	}
      }
    });

  },

  renderInvalid: function( user ) {

    var invalidData = {
      "name": user
    };

    var invalidTemplate = $( "#template-invalid-stream" ).html();
    var invalidString = Mustache.render( invalidTemplate, invalidData );

    $( ".twitch.cards" ).append( invalidString );

  },

  handleError: function( error ) {

    //TODO: ajax error handling
    console.log( error );

  },

  getApiUrl: function( type, uid ) {

    return app.twitchApiPrefix + type + "/" + uid + app.twitchApiSuffix;

  },

  fixBrokenImages: function() {

     $( "img" ).error( function() {
       $( this ).attr( "src", "https://placehold.it/300?text=N/A" );
     });

  },

  fixSortSizing: function() {

    $( ".content:last" ).css( "flex-grow", "1" );

  },

  initPopups: function() {

    $( ".tooltip" ).popup();

  },

  toggleLiveData: function( isEnabled ) {

    var progressBarCount = 0;

    if ( isEnabled === true ) {

      var progressBar = new Nanobar({
        bg: "#fff",
        id: "nanoBar"
      });

      app.timerBar = window.setInterval( function() {

        progressBarCount += 1;
        progressBar.go( progressBarCount );

        if ( progressBarCount === 100 ) {  // 5 minutes

          clearInterval( app.timerBar );
          progressBarCount = 0;
          // TODO: empty container and create new cards
          // app.initCards( app.usersArray );
          // app.fixBrokenImages();
          // app.fixSortSizing();

        }

      }, 3000 ); // update progressbar every 3 seconds

    } else if ( isEnabled === false ) {

      clearInterval( app.timerBar );
      $( "#nanoBar" ).empty().remove();

    }

  },

  initLiveRefreshToggle() {

    $( ".checkbox" ).checkbox({

      fireOnInit: false,
      onChecked: function() {
        app.toggleLiveData( true );
      },

      onUnchecked: function() {
        app.toggleLiveData( false )
      }

    });

  },

  init: function() {

    app.initCards( app.usersArray );
    app.initFixedHeader();
    app.fixBrokenImages();
    app.fixSortSizing();
    app.initPopups();
    app.initLiveRefreshToggle();

  }
};




jQuery( document ).ready( function( $ ) {

  app.init();

});

jQuery( window ).load( function( $ ) {

  app.initFiltering();

});

var app = {

  twitchApiPrefix: "https://api.twitch.tv/kraken/",
  twitchApiSuffix: "?callback=?",
  usersArray: [
    "freecodecamp", "storbeck", "mikesprague", "terakilobyte", "monstercat", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "brunofin", "comster404", "test_channel"
  ],
  timerBar: null,

  initCards: function( arrayOfUsers) {
    'use strict';

    for ( var i = 0; i < arrayOfUsers.length; i++ ) {
      app.getTwitchData( "streams", arrayOfUsers[i] );
    }

    app.initDimmable();

  },

  initDimmable: function() {
    'use strict';

    $( ".dimmable.image" ).dimmer({
      on: "hover"
    });

  },

  initFixedHeader: function() {
    'use strict';

    $( ".main.menu" ).visibility({
      type: "fixed"
    });

    $( ".main.menu  .ui.dropdown" ).dropdown({
      on: "hover"
    });

  },

  getTwitchData: function( type, user ) {
    'use strict';

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
    'use strict';

    if ( type === "stream" ) {

      var streamerCardTemplate = $( "#template-streamer-card" ).html();
      var streamerCardString = Mustache.render( streamerCardTemplate, data );

      $( ".cards.twitch" ).append( streamerCardString );

    } else if ( type === "channel" ) {

      var channelCardTemplate = $( "#template-channel-card" ).html();
      var channelCardString = Mustache.render( channelCardTemplate, data );

      $( ".cards.twitch" ).append( channelCardString );

    }

    app.initDimmable();
    app.fixBrokenImages();

  },

  initFiltering: function() {
    'use strict';

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
          app.removeDuplicateCards();
      	},
        onMixLoad: function( state ) {
          app.fixSortSizing();
          app.removeDuplicateCards();
      	}
      }
    });

  },

  renderInvalid: function( user ) {
    'use strict';

    var invalidData = {
      "name": user
    };

    var invalidTemplate = $( "#template-invalid-stream" ).html();
    var invalidString = Mustache.render( invalidTemplate, invalidData );

    $( ".cards.twitch" ).append( invalidString );

  },

  handleError: function( error ) {
    'use strict';

    //TODO: ajax error handling
    console.log( error );

  },

  getApiUrl: function( type, uid ) {
    'use strict';

    return app.twitchApiPrefix + type + "/" + uid + app.twitchApiSuffix;

  },

  fixBrokenImages: function() {
    'use strict';

     $( "img" ).error( function() {
       $( this ).attr( "src", "https://placehold.it/300?text=N/A" );
     });

  },

  fixSortSizing: function() {
    'use strict';

    $( ".content:last" ).css( "flex-grow", "1" );

  },

  removeDuplicateCards: function() {
    'use strict';

    $( "[id]" ).each(function () {
      $( "[id='" + this.id + "']:gt(0)" ).remove();
    });

  },

  initPopups: function() {
    'use strict';

    $( ".tooltip" ).popup();

  },

  toggleLiveData: function( isEnabled ) {
    'use strict';

    var progressBarCount = 0;

    if ( isEnabled === true ) {

      var progressBar = new Nanobar({
        bg: "#fff",
        id: "nanoBar"
      });

      app.timerBar = window.setInterval( function() {

        progressBarCount += 1;
        progressBar.go( progressBarCount );

        if ( progressBarCount > 100 ) {

          clearInterval( app.timerBar );
          $( "#sortable-cards" ).mixItUp( "destroy", true );
          $( "#nanoBar" ).remove();
          app.initCards( app.usersArray );
          app.initFiltering();
          app.fixSortSizing();
          app.toggleLiveData( true );
          app.removeDuplicateCards();

        }

      }, 600 )

    } else if ( isEnabled === false ) {

      clearInterval( app.timerBar );
      $( "#nanoBar" ).remove();

    }

  },

  initLiveRefreshToggle() {
    'use strict';

    $( ".refresh-toggle" ).checkbox({

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
    'use strict';

    app.initCards( app.usersArray );
    app.initFixedHeader();
    app.fixBrokenImages();
    app.fixSortSizing();
    app.initPopups();
    app.initLiveRefreshToggle();
    app.toggleLiveData( true );

  }
};




jQuery( document ).ready( function( $ ) {

  app.init();

});

jQuery( window ).load( function( $ ) {

  app.initFiltering();

});

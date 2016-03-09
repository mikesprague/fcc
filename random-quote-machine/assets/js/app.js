var app = {

  flickrApiUrl: "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
  designQuoteApiUUrl: "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1",
  tweetUrl: "https://twitter.com/intent/tweet?text=",
  loadingIndicator: "<div class=\"text-center loading-spinner\"><i class=\"fa fa-spinner fa-5x fa-pulse\"></i></div>",
  quoteElement: $( ".quote-content" ),
  authorElement: $( ".quote-author" ),
  btnTweetQuote: $( ".btn-tweet-quote" ),
  btnNewQuote: $( ".btn-new-quote" ),
  defaultFlickrTags: "flowers",

  getBackgroundFromFlickr: function( tags ) {
    var randomPhoto = "",
        bgSmall = "",
        bgLarge = "";

    if ( $.trim( tags ) === "" ) {
      tags = app.defaultFlickrTags;
    }

    app.quoteElement.html( "" );
    app.authorElement.html( "" ).hide();
    app.setBodyBackgroundImage();

    $.getJSON( app.flickrApiUrl, {
      tags: tags,
      cache: false,
      format: "json",
      sort: "relevance",
      media: "photos"
    }, function ( data ) {
      randomPhoto = data.items[ Math.floor( Math.random() * data.items.length )];
      bgSmall = randomPhoto.media.m;
      bgLarge = bgSmall.replace( "_m", "" ); // "_c"
      app.setBodyBackgroundImage( bgLarge );
    });

  }, // end getBackgroundFromFlickr()

  setBodyBackgroundImage: function( bgImage ) {
    if ( $.trim( bgImage ).length > 5  ) {
      $( "body" ).animate( { opacity: 0 }, 0 )
        .css( "background-image", "url(" + bgImage + ")" )
        .animate( { opacity: 1 }, "0.67s" );
    }

  }, // end setBodyBackgroundImage()

  getRandomQuoteOnDesign: function() {
    var quoteData = [],
        quoteId = 0,
        quoteAuthor = "",
        quoteAuthorText = "",
        quoteAuthorLink = "",
        quoteLink = "",
        quoteSource = "";

    app.quoteElement.html( app.loadingIndicator );
    $.ajax({
      url: app.designQuoteApiUUrl,
      cache: false,
      success: function ( data ) {
        quoteData = data.shift();
        quoteId = quoteData.ID;
        quoteAuthorText = $.trim( quoteData.title );
        quoteText = $.trim( quoteData.content );
        quoteAuthor = '<i class="fa fa-user"></i> ' + quoteAuthorText;

        app.quoteElement.html( "" ).html( quoteText );

        if ( quoteData.custom_meta !== undefined ) {
          quoteLink = quoteData.custom_meta.Source;
          quoteSource = $( quoteLink ).text();
          quoteLink = $( quoteLink ).attr( "target", "_blank" )
            .attr( "title", "View quote source (" + quoteSource + ")" )
            .attr( "data-toggle", "tooltip" );
          quoteAuthor = quoteLink.html( quoteAuthor );
        }
        $( ".quote-author" ).html( quoteAuthor ).show();
        $( "[data-toggle='tooltip']" ).tooltip();
      },
      error: function( error ) {
        app.quoteElement.html( "" ).html( error );
      }
    });

  }, // end getRandomQuoteOnDesign()

  sendTweet: function() {
    var tweetText = encodeURI( app.quoteElement.text() );
    var tweetAuthor = encodeURI( app.authorElement.text() );
    var fullTweetUrl = app.tweetUrl + tweetText + " - " + tweetAuthor;

    window.open ( fullTweetUrl );

  }, // end sendTwet()

  initTweetButton: function() {
    app.btnTweetQuote.on( "click", function( e ) {
      e.preventDefault();
      e.stopPropagation();
      app.sendTweet();
    });

  }, // end initTweetButton()

  initNewQuoteButton: function() {
    app.btnNewQuote.on( "click", function( e ) {
      e.preventDefault();
      e.stopPropagation();
      app.getNewQuote();
    });

  }, // end initNewQuoteButton()

  getNewQuote: function() {
    app.getBackgroundFromFlickr();
    app.getRandomQuoteOnDesign();

  } //end getNewQuote()

};

jQuery( document ).ready( function( $ ){
  app.getNewQuote();
  app.initNewQuoteButton();
  app.initTweetButton();
});

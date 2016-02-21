function getBackgroundFromFlickr() {
  var flickrApiUrlToFetch = 'https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';
  $("body").css("background-image", "");
  $(".quote-content").html("");
  $(".quote-author").html("").hide();
  $.getJSON(flickrApiUrlToFetch, {
    tags: 'flowers',
    cache: false,
    format: 'json',
    sort: 'relevance',
    media: 'photos'
  }, function (data) {
    var randomPhoto = data.items[Math.floor(Math.random() * data.items.length)];
    var bgSmall = randomPhoto.media.m;
    var bgLarge = bgSmall.replace("_m", "_b");
    $("body").css({
        "height": "100%",
        "background-repeat": "no-repeat",
        "background-position": "50% 0",
        "-ms-background-size": "cover",
        "-o-background-size": "cover",
        "-moz-background-size": "cover",
        "-webkit-background-size": "cover",
        "background-size": "cover",
        "background-image": "url(" + bgLarge + ")"
    });
  });
}

function getRandomQuoteOnDesign() {
  var loading = '<div class="text-center loading-spinner"><i class="fa fa-spinner fa-5x fa-pulse"></i></div>';
  $(".quote-content").html(loading);
  $.ajax({
    url: 'https://crossorigin.me/http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
    success: function (data) {
      var quoteData = data.shift();
      var quoteId = quoteData.ID;
      var quoteAuthorText = $.trim(quoteData.title);
      var quoteText = $.trim(quoteData.content);
      var quoteAuthor = '<i class="fa fa-user"></i> ' + quoteAuthorText;
      var quoteAuthorLink = "";
      var openQuote = '<i class="fa fa-quote-left"></i> ';
      var quoteContent = $(quoteText).prepend(openQuote);
      $(".quote-content").html("").html(quoteContent);

      initTweetButton(quoteText, quoteAuthorText);

      if(quoteData.custom_meta !== undefined) {
        var quoteLink = quoteData.custom_meta.Source;
        var quoteSource = $(quoteLink).text();
        quoteLink = $(quoteLink).attr("target", "_blank")
          .attr("title", "View quote source (" + quoteSource + ")")
          .attr("data-toggle", "tooltip");
        quoteAuthor = quoteLink.html(quoteAuthor);
      }
      $(".quote-author").html(quoteAuthor).show();
      $('[data-toggle="tooltip"]').tooltip();
    },
    cache: false
  });
}

function initTweetButton(quote, author) {
  var tweetUrl = "https://twitter.com/intent/tweet?text=";
  var tweetText = $(quote).text();
  var tweetAuthor = encodeURI(" - " + author);
  tweetText = encodeURI(tweetText);
  var fullTweetUrl = tweetUrl + tweetText + tweetAuthor;
  $(".btn-tweet-quote").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    window.open(fullTweetUrl);
  });
}

function initNewQuoteButton() {
  $(".btn-new-quote").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    getNewQuote();
  });
}

function getNewQuote() {
  getBackgroundFromFlickr();
  getRandomQuoteOnDesign();
}

$(document).ready(function(){
  getNewQuote();
  initNewQuoteButton();
});

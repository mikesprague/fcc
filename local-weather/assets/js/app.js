var app = {

  defaultLocation: "Ithaca, NY",
  defaultError: "There was a problem retrieving your weather conditions. Please try again.",
  postalCodeError: "Please enter a valid postal code and try again.",
  geolocationError: "Your browser does not support this feature. Try using your postal code.",

  getBodyBgColorClass: function() {

    var hourNum = new Date().getHours();
    var bodyClass = "night";

    if ( hourNum >= 5 && hourNum <= 7 ) {
      bodyClass = "morning";
    } else if ( hourNum > 7 && hourNum <= 18 ) {
      bodyClass = "day";
    } else if ( hourNum > 18 && hourNum <= 20 ) {
      bodyClass = "evening";
    }

    return bodyClass;

  },

  setBodyBgColor: function() {

    $( "body" ).addClass( app.getBodyBgColorClass() );

  },

  showLoading: function() {

    app.hideUi();
    $( ".loading-spinner" ).show();

  },

  hideLoading: function() {

    $( ".loading-spinner" ).hide();
    app.showUi();

  },

  hideUi: function() {

    $( "hr" ).hide();
    $( ".search-controls" ).hide();
    $( ".link-toggle-units" ).hide();

  },

  showUi: function() {

    $( "hr" ).show();
    $( ".search-controls" ).show();
    $( ".link-toggle-units" ).show();

  },

  initTooltips: function() {

    $( "[data-toggle=\"tooltip\"]" ).tooltip();

  },

  initBtnLocation: function() {

    $( ".btn-geolocation" ).on( "click", function( e ) {

      e.preventDefault();
      $( this ).tooltip( "hide" );
      app.getLocation();

    });

  },

  initBtnPostalCode: function() {

    $( ".btn-postal-code" ).on( "click", function( e ) {

      e.preventDefault();
      $( this ).parent().tooltip( "hide" );
      app.submitPostalCodeSearch();

    });

  },

  initPostalCodeField: function() {

    $( ".postal-code" ).on( "keypress", function( e ) {

      if ( e.which === 13 ) {
        app.submitPostalCodeSearch();
      }

    });

  },

  submitPostalCodeSearch: function() {

    var postalCode = $( ".postal-code" ).val();

    if ( $.trim(postalCode) === "" ) {

      app.showError( app.postalCodeError );

    } else {

      app.removeError();
      app.getWeather( postalCode );

    }

  },

  showError: function( msg ) {

    var errorMessageTemplate = $( "#template-error-message" ).html();

    var errorMessageView = {
      error_message: msg
    };

    var errorMessageString = Mustache.render( errorMessageTemplate, errorMessageView );

    if ( ! $( ".error-message" ).is( ":visible" ) ) {
      $( "hr:first" ).after( errorMessageString );
    }

  },

  removeError: function() {

    $( ".error-message" ).remove();

  },

  showAltUnit: function() {

    $( ".primary-unit" ).hide();
    $( ".alt-unit" ).show();

  },

  showPrimaryUnit: function() {

    $( ".alt-unit" ).hide();
    $( ".primary-unit" ).show();

  },

  initUnitToggle: function() {

    $( ".current-temp p" ).on( "click", function( e ) {

      e.preventDefault();

      if ( $( this ).hasClass( "primary-unit" )) {
        app.showAltUnit();
      } else {
        app.showPrimaryUnit();
      }

      $( this ).parent().tooltip( "hide" );

    });

  },

  initUnitToggleLink: function() {

    $( ".link-toggle-units" ).on( "click", function( e ) {

      e.preventDefault();

      var mainToggle = $( ".current-temp p:visible" );

      if ( mainToggle.hasClass( "primary-unit" )) {
        app.showAltUnit();
      } else {
        app.showPrimaryUnit();
      }

    });

  },

  getLocation: function() {

    if ( "geolocation" in navigator ) {
      navigator.geolocation.getCurrentPosition( function( position ) {
        app.getWeather( position.coords.latitude + "," + position.coords.longitude );
      });
    } else {
      app.showError( app.geolocationError );
    }

  },

  getWeather: function( weatherLocation ) {

    app.showLoading();

    $.simpleWeather({
      location: weatherLocation,
      unit: "f",
      cache: false,
      success: function( weather ) {

        var locationTemplate = $( "#template-location" ).html();
        var locationView = {
          city: weather.city,
          region: weather.region,
          country: weather.country
        };
        var locationString = Mustache.render( locationTemplate, locationView );
        $( ".location" ).html( locationString );

        var primaryDataTemplate = $( "#template-primary-data").html();
        var primmaryDataView = {
          current_code: weather.code,
          current_conditions: weather.currently,
          current_temp: weather.temp,
          current_temp_unit: weather.units.temp.toUpperCase(),
          current_temp_alt: weather.alt.temp,
          current_temp_unit_alt: weather.alt.unit.toUpperCase()
        };
        var primaryDataString = Mustache.render( primaryDataTemplate, primmaryDataView );
        $( ".primary-conditions-data" ).html( primaryDataString );

        app.initUnitToggle();

        var weatherDataRowOneTemplate = $( "#template-weather-data-row-1" ).html();
        var weatherDataRowOneView = {
          wind_speed: weather.wind.speed,
          wind_unit: weather.units.speed,
          wind_direction: weather.wind.direction.toLowerCase(),
          humidity: weather.humidity,
          sunrise_time: weather.sunrise
        };
        var weatherDataRowOne = Mustache.render( weatherDataRowOneTemplate, weatherDataRowOneView );
        $( ".weather-data-row-1" ).html( weatherDataRowOne );

        var barometricIconClass = "fa fa-arrows-h"; //steady
        if ( parseInt( weather.rising ) === 1) {
          barometricIconClass = "wi wi-direction-up";
        } else if ( parseInt( weather.rising ) === 2 ) {
          barometricIconClass = "wi wi-direction-down";
        }

        var weatherDataRowTwoTemplate = $( "#template-weather-data-row-2" ).html();
        var weatherDataRowTwoView = {
          barometric_pressure: weather.pressure,
          barometric_pressure_unit: weather.units.pressure,
          pressure_direction_icon_class: barometricIconClass,
          visibility: weather.visibility,
          visibility_unit: weather.units.distance,
          sunset_time: weather.sunset
        };
        var weatherDataRowTwo = Mustache.render( weatherDataRowTwoTemplate, weatherDataRowTwoView );
        $( ".weather-data-row-2" ).html( weatherDataRowTwo );

        var forecastTemplate = $( "#template-forecast" ).html();
        for ( var i = 0; i < weather.forecast.length; i++ ) {

          var currentDay = "Today"
          if ( i > 0 ) {
            currentDay = weather.forecast[i].day;
          }

          var forecastView = {
            day_name: currentDay,
            weather_code: weather.forecast[i].code,
            temp_low: weather.forecast[i].low,
            temp_low_alt: weather.forecast[i].alt.low,
            temp_high: weather.forecast[i].high,
            temp_high_alt: weather.forecast[i].alt.high,
            forecast_string: weather.forecast[i].text
          };

          var forecastString = Mustache.render( forecastTemplate, forecastView );
          $( ".forecast-" + i ).html( forecastString );

        }

        var lastUpdatedTemplate = $( "#template-last-updated" ).html();
        var lastUpdatedView = {
          last_updated: weather.updated
        };
        var lastUpdatedString = Mustache.render( lastUpdatedTemplate, lastUpdatedView );
        $( ".last-updated").html( lastUpdatedString );

        app.initUnitToggleLink();

        app.initTooltips();
        app.hideLoading();

      },

      error: function( error ) {

        app.showError( app.defaultError );
        app.hideLoading();

      }
    });
  },

  init: function() {

    app.setBodyBgColor();
    app.initBtnLocation();
    app.initBtnPostalCode();
    app.getWeather( app.defaultLocation );
    app.initPostalCodeField();

  }

};

jQuery( document ).ready( function( $ ) {

  app.init();

});

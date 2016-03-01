var app = {

  defaultLocation: "Ithaca, NY",

  getBodyBgColorClass: function() {
    var hourNum = new Date().getHours();
    var bodyClass = "night";

    if ( hourNum >= 5 && hourNum <= 7 ) {
      bodyClass = "morning";
    } else if ( hourNum > 7 && hourNum <= 17 ) {
      bodyClass = "day";
    } else if ( hourNum > 18 && hourNum <= 20 ) {
      bodyClass = "evening";
    }

    return bodyClass;
  },

  getLocation: function() {

    if ( "geolocation" in navigator ) {
      navigator.geolocation.getCurrentPosition( function( position ) {
        app.getWeather( position.coords.latitude + "," + position.coords.longitude );
      });
    } else {
      app.getWeather( app.defaultLocation );
    }

  },

  getWeather: function( weatherLocation ) {

    $( ".loading-spinner" ).show();
    $( "body" ).addClass( app.getBodyBgColorClass() );

    $.simpleWeather({
      location: weatherLocation,
      unit: "f",
      cache: false,
      success: function(weather) {

        //populate location
        var locationTemplate = $( "#template-location" ).html();
        var locationView = {
          city: weather.city,
          region: weather.region,
          country: weather.country
        };
        var locationString = Mustache.render( locationTemplate, locationView );
        $( ".location").html( locationString );

        //populate primary data
        var primaryDataTemplate = $( "#template-primary-data").html();
        var primmaryDataView = {
          current_code: weather.code,
          current_conditions: weather.currently,
          current_temp: weather.temp,
          current_temp_unit: weather.units.temp.toUpperCase()
        };
        var primaryDataString = Mustache.render( primaryDataTemplate, primmaryDataView );
        $( ".primary-conditions-data" ).html( primaryDataString );


        //populate weather data row one
        var weatherDataRowOneTemplate = $( "#template-weather-data-row-1" ).html();
        var weatherDataRowOneView = {
          wind_speed: weather.wind.speed,
          wind_unit: weather.units.speed,
          wind_direction: weather.wind.direction.toLowerCase(),
          humidity: weather.humidity,
          sunset_time: weather.sunset
        };
        var weatherDataRowOne = Mustache.render( weatherDataRowOneTemplate, weatherDataRowOneView );
        $( ".weather-data-row-1").html( weatherDataRowOne );

        // populate weather data row two
        var barometricIconClass = "fa fa-arrows-h"; //steady
        if ( parseInt( weather.rising ) === 1) {
          barometricIconClass = "wi wi-direction-up-right";
        } else if ( parseInt( weather.rising ) === 2 ) {
          barometricIconClass = "wi wi-direction-down-right";
        }

        var weatherDataRowTwoTemplate = $( "#template-weather-data-row-2" ).html();
        var weatherDataRowTwoView = {
          barometric_pressure: weather.pressure,
          barometric_pressure_unit: weather.units.pressure,
          pressure_direction_icon_class: barometricIconClass,
          visibility: weather.visibility,
          visibility_unit: weather.units.distance,
          feels_like_temp: weather.wind.chill
        };
        var weatherDataRowTwo = Mustache.render( weatherDataRowTwoTemplate, weatherDataRowTwoView );
        $( ".weather-data-row-2").html( weatherDataRowTwo );

        // populate forecast
        var forecastTemplate = $( "#template-forecast" ).html();
        for ( var i = 0; i < weather.forecast.length; i++ ) {
          var currentDay = weather.forecast[i].day;
          if ( i === 0 ) {
            currentDay = "Today";
          }
          var forecastView = {
            day_name: currentDay,
            weather_code: weather.forecast[i].code,
            temp_low: weather.forecast[i].low,
            temp_high: weather.forecast[i].high,
            forecast_string: weather.forecast[i].text
          };
          var forecastString = Mustache.render( forecastTemplate, forecastView );
          $( ".forecast-" + i ).html( forecastString );
        }

        // populate last updated time
        var lastUpdatedTemplate = $( "#template-last-updated" ).html();
        var lastUpdatedView = {
          last_updated: weather.updated
        };
        var lastUpdatedString = Mustache.render( lastUpdatedTemplate, lastUpdatedView );
        $( ".last-updated").html( lastUpdatedString );

        $( "[data-toggle='tooltip']" ).tooltip();
        $( ".loading-spinner" ).hide();
      },

      error: function(error) {
        // $("h1.location").text("Error:");
        $(".weather-data").html("<p>" + error.message + "</p>");
        $( ".loading-spinner" ).hide();

      }
    });
  }
};

app.getLocation();

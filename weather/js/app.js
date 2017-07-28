'use strict';

(function() {
    var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
    var DARKSKY_API_KEY = 'ddc78902b33a3015b36c9228ea9f9313';
    var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

    var GOOGLE_MAPS_API_KEY = 'AIzaSyDbNeSnuY3Hq2uLAaw8CqBIxjo9awlC88c';
    var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

    function getCurrentWeather(coords) {
        var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}`;

        return (
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    //console.log(data.currently);
                    return data.currently
                })
        );
    }

    function getCoordinatesForCity(cityName) {
        var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

        return (
            fetch(url)
                .then(response => response.json())
                .then(data => data.results[0].geometry.location)
                .catch(error => {
                    throw new Error('City not found');
                })
        );
    }

    var app = document.querySelector('#app');
    var cityForm = app.querySelector('.city-form');
    var cityInput = cityForm.querySelector('.city-input');
    var getWeatherButton = cityForm.querySelector('.get-weather-button');
    var cityWeather = app.querySelector('.city-weather');
    var summary = document.querySelector('#summary');
    var currentTemperature = cityWeather.querySelector('#currentTemperature');
    var displayCity = document.querySelector('#displayCity');

    cityForm.addEventListener('submit', function(event) {
        event.preventDefault(); // prevent the form from submitting

        var city = cityInput.value;
        cityWeather.innerText = 'loading...';

        getCoordinatesForCity(city)
            .then(getCurrentWeather)
            .then(function(weather) {
                displayCity.innerText = city;
                cityWeather.innerText = 'Current temperature: ' + weather.temperature;

                var skycons = new Skycons({"color": "pink"});
                skycons.add(document.getElementById("icon"), weather.icon);
                skycons.play();

                summary.textContent = 'Summary: ' + weather.summary;
                //currentTemperature.innerHTML = 'Current temperature: ' + weather.temperature;


            }).catch(error => {
            cityWeather.innerText = error;
            cityWeather.classList.add('error');

        })
    })
})();
// Elements
var searchBtnEl = $('#search-btn');
var savedCitiesListEl = $('#saved-cities-list');
var forecastSectionEl = $('#forecast-section');
var inputCityEl = $('#input-city');

var apiKey = '2b961d95742301fadceba231bbd02ad7';
var savedCities = [];

// Search for a city
var searchCity = function (event) {
    event.preventDefault();
    // get input from the user
    var inputCity = inputCityEl.val().trim();
    if (!inputCity) {
        console.log('You must type in a city name');
        return;
    }
    // call retrieveCityData
    retrieveCityData(inputCity);

    // call function to save user search as a favorite city in the list
    saveCityName(inputCity);
}

function saveCityName(city) {
    // check if city is already saved
    if (savedCities.includes(city)) {
        return;
    } else {
        // create button element with city name as value
        var favCityBtn = $('<button>');
        favCityBtn.text(city);
        favCityBtn.attr('class', 'my-1 col-12 bg-success');
        savedCitiesListEl.append(favCityBtn);

        // adding city to the array of saved cities, later to be kept on localstorage
        savedCities.push(city);

        // reset input field
        inputCityEl.val('');

        // TODO if savedCities > 10 remove first element
    }
}

function retrieveCityData(city) {
    // create api url
    var mapsUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;
    // get lat and lon from mapsUrl
    fetch(mapsUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (ldata) {
                // use data to get lat and lon
                console.log(ldata);

                // set lat and lon
                var lat = ldata[0].lat; // city's latitude
                var lon = ldata[0].lon; // city's longetude

                // create final api call
                var openWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + apiKey;
                // fetch using api call url
                // fetch data from openWeatherAPI
                fetch(openWeatherUrl).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            // call function to display data
                            displayWeatherData(data, city);
                        })
                    } else {
                        console.log('Error retrieving Weather Data: ' + response.status);
                    }
                });
            })
        } else {
            console.log("Error retrieving City Data:" + response.status);
        }
    });
}

function displayWeatherData(data, city) {
    // TODO parse the data and display it on the screen
    console.log(data);

    // remove previous displayed data
    forecastSectionEl.empty();

    // create the current day forecast card
    var currentDayEl = $('<div class="card">'); // gets appended to the section
    var cardBody = $('<div class="card-body">'); // gets appended to currentDayEl
    var locationDate = $('<h1 class="card-title">'); // gets appended to cardBody
    var temp = $('<p>'); // gets appended to cardBody
    var wind = $('<p>'); // gets appended to cardBody
    var humidity = $('<p>'); // gets appended to cardBody
    var uvIndex = $('<p>'); // gets appended to cardBody
    var currentDate = moment(data.current.dt, 'X').format('DD/MM/YY');

    // TODO add weather icon/emoji to end of locationDate.text
    locationDate.text(city + ' ' + currentDate);
    temp.text('Temp: ' + data.current.temp);
    wind.text('Wind speed: ' + data.current.wind_speed + ' MPH');
    humidity.text('Humidity: ' + data.current.humidity + ' %');
    uvIndex.text('UV Index: ' + data.current.uvi);

    cardBody.append(locationDate);
    cardBody.append(temp);
    cardBody.append(wind);
    cardBody.append(humidity);
    cardBody.append(uvIndex);
    currentDayEl.append(cardBody);
    forecastSectionEl.append(currentDayEl);

    var fiveDayEl = $('<div class="py-3">');
    var fiveDayHeader = $('<h2>');
    fiveDayHeader.text('5-Day Forecast:');
    fiveDayEl.append(fiveDayHeader);
    // create the 5-day forecast cards
    for (var i = 0; i < 5; i++) {

    }
}

// TODO save list of favorite cities to localstorage

// TODO retrieve list of favorite cities from localstorage on page load

searchBtnEl.on('click', searchCity);
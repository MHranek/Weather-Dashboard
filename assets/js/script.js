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
}

function saveCityName(city) {
    // check if city is already saved
    if (savedCities.includes(city)) {
        return;
    } else {
        // create button element with city name as value
        var favCityBtn = $('<button>');
        favCityBtn.text(city);
        favCityBtn.attr('class', 'my-1 col-12 bg-secondary');
        savedCitiesListEl.append(favCityBtn);

        // adding city to the array of saved cities, later to be kept on localstorage
        savedCities.push(city);
        saveToStorage();

        // TODO BONUS if savedCities > 10 remove first element
    }
}

function retrieveCityData(city) {
    // create api url
    var mapsUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + apiKey;
    // get lat and lon from mapsUrl
    fetch(mapsUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (ldata) {
                // checks if returned data is undefined (ie: no city with that name)
                if (ldata[0] === undefined) {
                    // no latitude propery found\
                    console.log("City not found");
                    return;
                }
                // use data to get lat and lon
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
                            // call function to save user search as a favorite city in the list
                            saveCityName(city);
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
    // remove previous displayed data
    forecastSectionEl.empty();

    // make a divider between the search section and data section
    forecastSectionEl.attr('style', 'border-left: 3px solid black');

    // create the current day forecast card
    var currentDayEl = $('<section class="card" id="current-day">'); // gets appended to the section
    var cardBody = $('<div class="card-body">'); // gets appended to currentDayEl
    var locationDate = $('<h1 class="card-title">'); // gets appended to cardBody
    var temp = $('<p>'); // gets appended to cardBody
    var wind = $('<p>'); // gets appended to cardBody
    var humidity = $('<p>'); // gets appended to cardBody
    var uvIndex = $('<p>'); // gets appended to cardBody
    var currentDate = moment(data.current.dt, 'X').format('MM/DD/YY');
    var currentIcon = $('<img>');

    currentIcon.attr('src', 'https://openweathermap.org/img/w/' + data.current.weather[0].icon + '.png')
    currentIcon.attr('alt', data.current.weather[0].description);
    locationDate.text(city + ' ' + currentDate);
    temp.text('Temp: ' + data.current.temp);
    wind.text('Wind speed: ' + data.current.wind_speed + ' MPH');
    humidity.text('Humidity: ' + data.current.humidity + ' %');
    uvIndex.text('UV Index: ' + data.current.uvi);

    locationDate.append(currentIcon);
    cardBody.append(locationDate);
    cardBody.append(temp);
    cardBody.append(wind);
    cardBody.append(humidity);
    cardBody.append(uvIndex);
    currentDayEl.append(cardBody);
    forecastSectionEl.append(currentDayEl);

    // create the 5-day forecast cards
    var fiveDayEl = $('<section class="py-3">');
    var fiveDayHeader = $('<h2>');
    var forecastCards = $('<div class="d-flex justify-content-between justify-content-lg-around flex-wrap">');
    fiveDayHeader.text('5-Day Forecast:');
    fiveDayEl.append(fiveDayHeader);
    fiveDayEl.append(forecastCards);
    forecastSectionEl.append(fiveDayEl);

    for (var i = 1; i < 6; i++) {
        var smallCard = $('<section class="card col-12 col-lg-5 col-xl-2 small-card my-1 p-3">');
        var smallDate = $('<h3>');
        var smallIcon = $('<img>');
        var smallTemp = $('<p>');
        var smallWind = $('<p>');
        var smallHumidity = $('<p>');

        smallDate.text(moment(data.daily[i].dt, 'X').format('MM/DD/YY'));
        smallIcon.attr('src', 'https://openweathermap.org/img/w/' + data.daily[i].weather[0].icon + '.png');
        smallIcon.attr('alt', data.daily[i].weather[0].description);
        smallIcon.attr('height', '50px');
        smallIcon.attr('width', '50px');
        smallTemp.text('Temp: ' + data.daily[i].temp.day);
        smallWind.text('Wind: ' + data.daily[i].wind_speed + ' MPH');
        smallHumidity.text('Humidity: ' + data.daily[i].humidity + ' %');

        smallCard.append(smallDate);
        smallCard.append(smallIcon);
        smallCard.append(smallTemp);
        smallCard.append(smallWind);
        smallCard.append(smallHumidity);

        forecastCards.append(smallCard);
    }
}

// save list of favorite cities to localstorage
function saveToStorage() {
    // save the savedCities array to localstorage
    localStorage.setItem('cities', savedCities);
}

// retrieve list of favorite cities from localstorage on page load
function retrieveFromStorage() {
    // retrieve localstorage data of savedCities
    var localData = localStorage.getItem('cities');

    // parse the array
    var localData = localData.split(',');

    if (localData != "") {
        // run saveCityName(city) for each city in the array
        for (var i=0; i < localData.length; i++) {
        saveCityName(localData[i]);
        }
    }
}

// run once on page load
retrieveFromStorage()

searchBtnEl.on('click', searchCity);
savedCitiesListEl.on('click', 'button', function (event) {
    event.preventDefault();
    var element = $(event.target);
    retrieveCityData(element.text());
});
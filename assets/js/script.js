// Elements
var searchBtnEl = $('#search-btn');
var savedCitiesListEl = $('#saved-cities-list');
var forecastSectionEl = $('#forecast-section');
var inputCityEl = $('#input-city');

var apiKey = '';
var savedCities = [];

// Search for a city
var searchCity = function (event) {
    event.preventDefault();
    // get input from the user
    var inputCity = inputCityEl.val().trim();
    if (!inputCity) {
        console.log('You must type in a city name');
        return;
    } else {
        // TODO log city name for testing
        console.log(inputCity);
    }
    // call retrieveCityData
    // retrieveCityData(inputCity);

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
    var lat; // city's latitude
    var lon; // city's longetude
    var openWeatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&appid=' + apiKey;
    // fetch data from openWeatherAPI
    fetch(openWeatherUrl).then(function (response){
        if (response.ok) {
            response.json().then(function (data) {
                // do something with the data
                // call function to display data
                displayWeatherData(data);
            })
        } else {
            console.log('Error retrieving data: ' + response.status);
        }
    });
}

function displayWeatherData(data) {
    // TODO parse the data and display it on the screen
}

// TODO save list of favorite cities to localstorage

// TODO retrieve list of favorite cities from localstorage on page load

searchBtnEl.on('click', searchCity);
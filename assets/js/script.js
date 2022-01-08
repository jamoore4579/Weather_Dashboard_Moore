var cityNameEl = document.getElementById("city-name")
var searchEl = document.getElementById("search-button")
var clearEl = document.getElementById("clear-search")
var historyEl = document.getElementById("search-history")
var currentWeatherEl = document.getElementById("current-weather")
var currentForecastEl = document.getElementById("current-forecast")
var citySearchEl = document.getElementById("city")
var currentTempEl = document.getElementById("tempature")
var currentWindEl = document.getElementById("wind")
var currentHumidity = document.getElementById("humidity")
var currentIndexEl = document.getElementById("UV-index")
var APIKey = "4a543088943e858a5b17eaec992c251f";

function getWeather(citySearch) {
    let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&appid=" + APIKey;
    axios.get(queryUrl)

        .then(function (response) {
            currentWeatherEl.classList.remove("d-none");
            
            var todaysDate = new Date(response.data.dt * 1000);
            var day = todaysDate.getDate();
            var month = todaysDate.getMonth() + 1;
            var year = todaysDate.getFullYear();
            citySearchEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
            var weatherIcon = response.data.weather[0].icon;
            currentForecastEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
            currentForecastEl.setAttribute("alt", response.data.weather[0].description);
            currentTempEl.innerHTML = "Temp: " + k2f(response.data.main.temp) + " &#176F";
            console.log(currentTempEl)
            currentWindEl.innerHTML = "Wind: " + response.data.wind.speed + " MPH";
            console.log(currentWindEl)
            currentHumidity.innerHTML = "Humidity: " +response.data.main.humidity + "%";
            console.log(currentHumidity)

            var lat = response.data.coord.lat;
            var lon = response.data.coord.lon;
            var indexQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            axios.get(indexQueryURL)
                .then(function(response) {
                    var indexEl = document.createElement("span");

                    if (response.data[0].value < 4 ) {
                        indexEl.setAttribute("class", "badge badge-success");
                    }
                    else if (response.data[0].value < 8) {
                        indexEl.setAttribute("class", "badge badge-warning");
                    }
                    else {
                        indexEl.setAttribute("class", "badge badge-danger");
                    }
                    console.log(response.data[0].value)
                    indexEl.innerHTML = response.data[0].value;
                    currentIndexEl.innerHTML = "UV Index: ";
                    currentIndexEl.append(indexEl);
                });
        })
}

searchEl.addEventListener("click", function() {
    var searchReq = cityNameEl.value;
    getWeather(searchReq);
})

function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

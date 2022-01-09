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
var fivedayEL = document.getElementById("fiveday")
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
var APIKey = "4a543088943e858a5b17eaec992c251f"

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
            currentHumidity.innerHTML = "Humidity: " + response.data.main.humidity + "%";
            console.log(currentHumidity)

            var lat = response.data.coord.lat;
            var lon = response.data.coord.lon;
            var indexQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
            axios.get(indexQueryURL)
                .then(function (response) {
                    var indexEl = document.createElement("span");

                    if (response.data[0].value < 4 ) {
                        indexEl.setAttribute("class", "badge bg-success");
                    }
                    else if (response.data[0].value < 8) {
                        indexEl.setAttribute("class", "badge bg-warning");
                    }
                    else {
                        indexEl.setAttribute("class", "badge bg-danger");
                    }
                    console.log(response.data[0].value)
                    indexEl.innerHTML = response.data[0].value;
                    currentIndexEl.innerHTML = "UV Index: ";
                    currentIndexEl.append(indexEl);
                });

            var cityID = response.data.id;
            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
            axios.get(forecastURL)
                .then(function (response) {
                    fivedayEL.classList.remove("d-none");

                    var fiveForecastEl = document.querySelectorAll(".forecast")
                    for (i = 0; i < fiveForecastEl.length; i++) {
                        fiveForecastEl[i].innerHTML = "";
                        var forecastIndex = i * 8 + 4;
                        var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                        var forecastDay = forecastDate.getDate();
                        var forecastMonth = forecastDate.getMonth() + 1;
                        var forecastYear = forecastDate.getFullYear();
                        var forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date ");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        fiveForecastEl[i].append(forecastDateEl);

                        var fiveDayForecastEl = document.createElement("img");
                        fiveDayForecastEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                        fiveDayForecastEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                        fiveForecastEl[i].append(fiveDayForecastEl);
                        var forecastTempEl = document.createElement("p");
                        forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                        fiveForecastEl[i].append(forecastTempEl);
                        var forecastWindEl = document.createElement("p")
                        forecastWindEl.innerHTML = "Wind: " + response.data.list[forecastIndex].wind.speed + " MPH";
                        fiveForecastEl[i].append(forecastWindEl);
                        var forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                        fiveForecastEl[i].append(forecastHumidityEl);
                    }
                })
        });
}

searchEl.addEventListener("click", function() {
    var searchReq = cityNameEl.value;
    getWeather(searchReq);
    searchHistory.push(searchReq);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
    //document.getElementById("city-name").value = "";
})
    

clearEl.addEventListener("click", function () {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
    //document.getElementById("current-weather").remove();
    //document.getElementById("five-forecast").remove();
})


function k2f(K) {
    return Math.floor((K - 273.15) * 1.8 + 32);
}

console.log(searchHistory)


function renderSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyReq = document.createElement("input");
        historyReq.setAttribute("type", "text");
        historyReq.setAttribute("readonly", true);
        historyReq.setAttribute("class", "form-control d-block bg-white mb-1");
        historyReq.setAttribute("value", searchHistory[i]);
        historyReq.addEventListener("click", function () {
            console.log(historyReq.value)
            getWeather(historyReq.value);
        })
        historyEl.append(historyReq);
    }
}

renderSearchHistory();
if (searchHistory.length > 0) {
    getWeather(searchHistory[searchHistory.length - 1]);
}




let activeTempUnit = "C";
let tempC;

const searchForPlace = document.querySelector(".search-for-place-js");
const searchForPlaceInput = document.querySelector(".SearchForPlacesInput-js");
const currentWeather = document.querySelector(".CurrentWeather-js");
const exitBtn = document.querySelector(".exit-icon");

searchForPlaceInput.style.left = `-${currentWeather.clientWidth}px`;

searchForPlace.addEventListener("click", () => {
  searchForPlaceInput.classList.add("SearchForPlacesInput-transition");
  searchForPlaceInput.style.left = 0;
})

exitBtn.addEventListener("click", () => {
  searchForPlaceInput.style.left = `-${currentWeather.clientWidth}px`;
});

async function getWeatherData(url, lat, long) {
  const weatherData = await fetch(url);
  const weatherDataJson = await weatherData.json();
  const current = weatherDataJson.current;
  const daily = weatherDataJson.daily;

  setHighlights([
    current.wind_speed,
    current.humidity,
    current.visibility,
    current.pressure,
  ]);

  let cityData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?appid=114843591b3cb4652a2b94e65486c00a&units=metric&lang=en&lat=${lat}&lon=${long}`
  );
  cityData = await cityData.json();

  tempC = Math.round(current.temp);
  if (activeTempUnit === "C") {
    setCurrentWeather(
      tempC,
      current.weather[0].description,
      cityData.name,
      cityData.sys.country
    );
  } else {
    setCurrentWeather(
      current.weather[0].description,
      cityData.name,
      cityData.sys.country
    );
  }

  setFutureWeather(daily);
}

function setHighlights(highlights) {
  const windSpeed = Math.round(highlights[0] * 2.236936);
  const humidity = highlights[1];
  const visibility = (highlights[2] * 0.00062).toFixed(2);
  const pressure = highlights[3];

  document.querySelector(".Highlights-WindValueNum").textContent = windSpeed;
  document.querySelector(".Highlights-HumidityPerValue").textContent = humidity;
  document.querySelector(
    ".humidityIndicatorLevel"
  ).style.width = `${humidity}%`;
  document.querySelector(
    ".Highlights-VisibilityDistanceValue"
  ).textContent = visibility;
  document.querySelector(".Highlights-AirPressureValue").textContent = pressure;
}

function setCurrentWeather(temp, desc, cityName, country) {
  document.querySelector(".CurrentWeather-Value").textContent = temp;
  document.querySelector(".CurrentWeather-Unit").textContent = activeTempUnit;
  document.querySelector(".CurrentWeather-Desc").textContent = desc;
  document
    .querySelector(".currentWeatherImg-js")
    .setAttribute("src", `images/${desc}.svg`);
  document.querySelector(".Location-Address").textContent = cityName;
  if (country) {
    document.querySelector(".Location-Address").textContent =
      cityName + ", " + country;
  }
}

function setFutureWeather(dailyData) {
  
  let tomorrow = 1;
  let maxElements = document.querySelectorAll(".FutureCard-MaxTempValue");
  let minElements = document.querySelectorAll(".FutureCard-MinTempValue");
  let futureWeatherImg = document.querySelectorAll(".FutureCard-WeatherImg");
  let futureWeatherDesc = document.querySelectorAll(".FutureCard-Desc");

  let elem = 0;
  for (let i = tomorrow; i <= 5; i++) {
    let temp;
    if (activeTempUnit === "F") {
      temp = Math.round(+dailyData[i].temp.max * (9 / 5) + 32);
    } else {
      temp = Math.round(+dailyData[i].temp.max);
    }
    maxElements[elem].textContent = temp;
    elem++;
  }
  elem = 0;
  for (let i = tomorrow; i <= 5; i++) {
    let temp;
    if (activeTempUnit === "F") {
      temp = Math.round(+dailyData[i].temp.min * (9 / 5) + 32);
    } else {
      temp = Math.round(+dailyData[i].temp.min);
    }
    minElements[elem].textContent = temp;
    futureWeatherImg[elem].setAttribute(
      "src",
      `images/${dailyData[i].weather[0].description}.svg`
    );
    futureWeatherDesc[elem].textContent = dailyData[i].weather[0].description;
    elem++;
  }
}

async function searchCity() {
  let inputCity = document.querySelector(".Form-InputField").value;
  document.querySelector(".Form-InputField").value = "";

  let cityData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=114843591b3cb4652a2b94e65486c00a&units=metric&lang=en`
  );
  cityData = await cityData.json();

  if (cityData.cod !== "404") {
    document
      .querySelector(".recent-cities-name")
      .classList.add("recent-cities-name-visible");
    if (inputCity !== "") addRecentCitySearch(inputCity);
    delCitiesItem();
    let urlNew = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityData.coord.lat}&lon=${cityData.coord.lon}&exclude=minutely,hourly,alerts&appid=114843591b3cb4652a2b94e65486c00a&units=metric&lang=en`;
    getWeatherData(urlNew, cityData.coord.lat, cityData.coord.lon);
    searchForPlaceInput.style.left = `-${currentWeather.clientWidth}px`;
    document
      .querySelector(".errorInput")
      .classList.remove("errorInput-visible");
  } else {
    document.querySelector(".errorInput").classList.add("errorInput-visible");
  }
}

function addRecentCitySearch(inputValue) {
  let citiesItem = document.createElement("div");
  citiesItem.classList.add("Cities-Item");
  let span = document.createElement("span");
  span.classList.add("Cities-Name");
  span.textContent = inputValue;
  let img = document.createElement("img");
  img.src = "images/right-angle-icon.svg";
  img.alt = "right arrow icon";
  img.classList.add("right-angle-icon");
  citiesItem.appendChild(span);
  citiesItem.appendChild(img);
  document.querySelector(".Cities").prepend(citiesItem);
  switchBackRecent();
}

function delCitiesItem() {
  let cities = document.querySelectorAll(".Cities-Item");
  if (cities.length > 5) {
    cities[cities.length - 1].parentNode.removeChild(cities[cities.length - 1]);
  }
}

document.querySelector(".Form-SubmitBtn").addEventListener("click", searchCity);

document.querySelector(".search-for-place-js").addEventListener("click", () => {
  document.querySelector(".Form-InputField").focus();
});

let inputField = document.querySelector(".Form-InputField");
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && inputField.value !== "") {
    searchCity();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.altKey && event.key === "s") {
    searchForPlaceInput.classList.add("SearchForPlacesInput-transition");
    searchForPlaceInput.style.left = 0;
    document.querySelector(".Form-InputField").focus();
  }
});

function switchBackRecent() {
  let cities = document.querySelectorAll(".Cities-Item");
  cities.forEach((element) => {
    element.addEventListener("click", () => {
      document.querySelector(".Form-InputField").value = element.textContent;
      console.log(element.textContent);
      searchCity();
    });
  });
}


navigator.geolocation.getCurrentPosition(onSuccess, onError);

  function onSuccess(position) {
      let lat, long;
    
      lat = position.coords.latitude;
      long = position.coords.longitude;

      let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&appid=114843591b3cb4652a2b94e65486c00a&units=metric&lang=en`;

    getWeatherData(url, lat, long);
  }
  
function onError() {
  const popOpen = document.querySelector('.popup');
  const closeOpen = document.querySelector('.popup__close');

  popOpen.classList.add('open');
  closeOpen.addEventListener('click', () => {
    popOpen.classList.remove('open');
  });

  setTimeout(() => {
    popOpen.classList.remove('open');
      document.querySelector(".SearchForPlacesInput ").style.left = '0px';
  }, 5000);
}
  


(function () {
  const date = new Date().toString();
  const dateArr = date.split(" ");
  let outputDate = `${dateArr[0]}, ${+dateArr[2]} ${dateArr[1]}`;
  document.querySelector(".date-js").textContent = outputDate;

  let lastDate = new Date();
  let futureCardDates = document.querySelectorAll(".FutureCard-Date");
  for (let date of futureCardDates) {
    lastDate = new Date(lastDate);
    lastDate.setDate(lastDate.getDate() + 1);
    let customisedDate = lastDate.toString();
    let dateArr = customisedDate.split(" ");
    let outputDate = `${dateArr[0]}, ${+dateArr[2]} ${dateArr[1]}`;
    date.textContent = outputDate;
  }
  futureCardDates[0].textContent = "Tomorrow";
})();

const futureUnits = document.querySelectorAll(".future-temp-unit-js");
const futureValue = document.querySelectorAll(".future-temp-js");




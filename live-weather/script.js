let searchBar = document.getElementById("searchBar");

let searchBtn = document.getElementById("searchBtn");

let weather = document.getElementById("weather");
let otherInfo = document.getElementById("searchInfo");
let backgroundVideo = document.getElementById("backgroundVideo");

window.onload = function() {
    backgroundVideo.src ="./videos/intro.mp4";
    backgroundVideo.load();
};
let weatherVideos= {
    "cloud": "./videos/cloud.mp4",
    "haze": "./videos/haze.mp4",
    "rain": "./videos/rain.mp4",
    "snow": "./videos/snow.mp4",
    "sun": "./videos/sun.mp4",
    "thunderstorm": "./videos/rain.mp4",
    "mist": "./videos/rain.mp4",
    "fog": "./videos/cloud.mp4",
    "clear": "./videos/sun.mp4"
};
searchBar.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        searchBtn.click()
    };
});
searchBtn.onclick = function() {
    let location = searchBar.value.trim();

    let apiKey = "03502a14e7c39ce84d39af67e5658da0";


    if (location === "") {

        otherInfo.innerHTML = '<div style="text-align: center; font-size:18px; padding: 20px; color: red"><i class="fas fa-exclamation-triangle"></i> Please enter a location.</div>';
        return;
    }
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data); // Log the weather data
            let weatherCondition = data.weather[0].main.toLowerCase();
            let selectedVideo = weatherVideos[weatherCondition] || "./videos/intro.mp4";
            backgroundVideo.src = selectedVideo;
            backgroundVideo.load(); 
            backgroundVideo.play().catch(error => {
                 console.log("Autoplay Isuue:", error);
            });


            let weatherData = {

                temp: (data.main.temp - 273.15).toFixed(1),
                country: data.sys.country,
                feels_like: (data.main.feels_like - 273.15).toFixed(1),

                pressure: data.main.pressure,

                humidity: data.main.humidity,

                wind: data.wind.speed,

                location: data.name,

              //country: data.sys.country,

                weather: weatherCondition,

                sea: data.main.sea_level || "N/A",

                lat: data.coord.lat,

                lon: data.coord.lon
            };
            let weatherImages ={
                cloud: "./assets/cloud.png",
                haze: "./assets/haze.png",
                rain: "./assets/rain.png",   
                snow: "./assets/snow.png",
                sun: "./assets/sun.png",
                thunderstorm: "./assets/rain.png",
                mist: "./assets/rain.png",
                fog: "./assets/cloud.png",
            };
            let weatherImageSrc = weatherImages[weatherCondition] || "./assets/intro.png";
            weather.innerHTML = `
                <div class="weatherMain"> 
                <h1>${weatherData.temp} &#176 C</h1>
                <div class= "weatherCity">
                <h3>${weatherData.location}</h3>
                <h4>${weatherData.country}</h4>
                </div>
                <div class="weatherImg">
                <img src="${weatherImageSrc}" alt="${weatherData.weather}">
                <p>${weatherData.weather.charAt(0).toUpperCase()+weatherData.weather.slice(1)}
                </p>
                </div>
                </div> `;
            otherInfo.innerHTML = `
                <div class="Other-info">
                    <p class="feels-like">Feels Like:
                        <span><b>${weatherData.feels_like}</b>&#176 C</span></p><hr>
                        <h2> Weather Details: </h2>
                        <p> Wind Speed: <span>${weatherData.wind} km/h</span></p>
                        <p> Pressure: <span>${weatherData.pressure} mb</span></p>
                        <p> Humidity: <span>${weatherData.humidity}%</span></p>
                        <p> Sea Level: <span>${weatherData.sea} mb</span></p> <hr><h2>Coordinates: </h2>
                        <p> Latitude: <span>${weatherData.lat}&#176 N</span></p>
                        <p> Longitude: <span>${weatherData.lon}&#176 S</span></p> 
                </div>
            `;
        })
        .catch((error)=> {
            console.error("Error fetching weather data:", error);
            otherInfo.innerHTML = '<div style="text-align: center; font-size:18px; padding: 20px; color:skyblue"><i class="fas fa-exclamation-triangle"></i> Location not found. Please try again.</div>';
            weather.innerHTML = "";
        });

    };


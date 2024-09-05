const apiKey = '13b6671de814dbdc77f1659c25cabe1e'; // Your new API key
const weatherInfoDiv = document.getElementById('weather-info');
const weatherDetailsDiv = document.getElementById('weather-details');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error-message');
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    }
});

async function fetchWeatherData(city) {
    try {
        showLoading();
        console.log(`Fetching weather data for: ${city}`); // Log the city name
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (response.ok) {
            console.log("Weather data:", data); // Log the data for debugging
            displayWeatherData(data);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error fetching weather data:", error); // Log the error
        showError(error.message);
    }
}

function showLoading() {
    loadingDiv.style.display = 'block';
    weatherDetailsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
}

function showError(message) {
    loadingDiv.style.display = 'none';
    errorDiv.classList.remove('hidden');
    errorDiv.textContent = message;
}

function displayWeatherData(data) {
    const { name, weather, main, wind } = data;

    document.getElementById('city-name').textContent = name;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`; // Use HTTPS for icon
    document.getElementById('weather-description').textContent = weather[0].description;
    document.getElementById('temperature').textContent = `${main.temp}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${wind.speed} m/s`;

    loadingDiv.style.display = 'none';
    weatherDetailsDiv.classList.remove('hidden');
    weatherDetailsDiv.classList.add('show');
}

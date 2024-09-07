const apiKey = '13b6671de814dbdc77f1659c25cabe1e'; // Your API key
const weatherInfoDiv = document.getElementById('weather-info');
const weatherDetailsDiv = document.getElementById('weather-details');
const forecastDetailsDiv = document.getElementById('forecast-details');
const forecastDataDiv = document.getElementById('forecast-data');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error-message');
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
        fetchForecastData(city);
    } else {
        showError('Please enter a city name.');
    }
});

async function fetchWeatherData(city) {
    try {
        showLoading();
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (response.ok) {
            displayWeatherData(data);
        } else {
            throw new Error(data.message || 'An error occurred');
        }
    } catch (error) {
        showError(error.message);
    }
}

async function fetchForecastData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (response.ok) {
            displayForecastData(data);
        } else {
            throw new Error(data.message || 'An error occurred');
        }
    } catch (error) {
        showError(error.message);
    }
}

function showLoading() {
    loadingDiv.style.display = 'block';
    weatherDetailsDiv.classList.add('hidden');
    forecastDetailsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
}

function hideLoading() {
    loadingDiv.style.display = 'none';
}

function showError(message) {
    hideLoading();
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function displayWeatherData(data) {
    const { name, weather, main, wind } = data;

    document.getElementById('city-name').textContent = name;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    document.getElementById('weather-description').textContent = weather[0].description;
    document.getElementById('temperature').textContent = `${main.temp}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${wind.speed} m/s`;

    hideLoading();
    weatherDetailsDiv.classList.remove('hidden');
    weatherDetailsDiv.classList.add('show');
}

function displayForecastData(data) {
    const { list } = data;

    // Clear previous forecast data
    forecastDataDiv.innerHTML = '';

    // Get forecast data for every 8 hours (3-hour intervals)
    const forecasts = list.filter((_, index) => index % 8 === 0);

    forecasts.forEach(forecast => {
        const { dt, main, weather } = forecast;
        const date = new Date(dt * 1000).toLocaleDateString();
        const temperature = `${main.temp}°C`;
        const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        const description = weather[0].description;

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';

        forecastItem.innerHTML = `
            <h3>${date}</h3>
            <img src="${icon}" alt="${description}">
            <p>${temperature}</p>
            <p>${description}</p>
        `;

        forecastDataDiv.appendChild(forecastItem);
    });

    hideLoading();
    forecastDetailsDiv.classList.remove('hidden');
}
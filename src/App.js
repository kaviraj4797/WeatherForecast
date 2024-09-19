// Import React and necessary hooks from the React library
import React, { useContext, useEffect, useState } from 'react';

// Importing the CSS module for styling
import styles from './App.module.css'; 

// Import functions to fetch weather and forecast data
import { fetchWeather, fetchWeatherByLocation } from './components/weather';

// Importing the WeatherForecast component to display forecast data
import WeatherForecast from './components/WeatherForecast';

// Importing the WeatherContext to manage global state for weather data
import { WeatherContext } from './WeatherContext';

function App() {
  // State hooks to manage city input, weather data, forecast data, and loading/error states
  const [city, setCity] = useState(''); // To store the city name entered by the user
  const [weather, setWeather] = useState(null); // To store the weather data fetched for the city
  const [forecast, setForecast] = useState(null); // To store the forecast data
  const [loadingStates, setLoadingStates] = useState({}); // Track loading states for each forecast request
  const [searchLoading, setSearchLoading] = useState(false); // Track loading state for city search
  const [errorMessage, setErrorMessage] = useState(''); // Store error messages during data fetch

  // Destructure values from WeatherContext to sync state across components
  const {
    setCity: setContextCity,
    setCountry: setContextCountry,
    setErrorMessage: setContextErrorMessage,
    setForecast: setContextForecast,
    setLoadingStates: setContextLoadingStates,
    setSearchLoading: setContextSearchLoading,
    setWeather: setContextWeather,
  } = useContext(WeatherContext);

  // Sync the city state in the context whenever it changes
  useEffect(() => {
    setContextCity(city);
  }, [city]);

  // Function to handle searching for weather data by city
  const handleSearch = async () => {
    setSearchLoading(true); // Start loading animation
    setErrorMessage(''); // Reset error message before new search

    try {
      const data = await fetchWeather(city); // Fetch weather data for the entered city

      // If no data is returned, show error message
      if (!data.data || data.data.length === 0) {
        setErrorMessage('City not found. Please try again.');
        setWeather(null); // Reset weather data
      } else {
        setWeather(data.data); // Set the fetched weather data

        // Fetch forecast for the first city in the returned list
        if (data.data.length > 0) {
          const firstCity = data.data[0];
          handleGetForecast(firstCity.latitude, firstCity.longitude, 0, firstCity.city, firstCity.stateOrCountry);
        }
      }
    } catch (error) {
      // Catch any errors during the fetch process and display an error message
      console.error('Error fetching city weather:', error);
      setErrorMessage('An error occurred while fetching the data.');
    } finally {
      setSearchLoading(false); // Stop loading animation
    }
  };

  // Function to fetch forecast based on latitude and longitude
  const handleGetForecast = async (latitude, longitude, index, city, country) => {
    // Mark the specific forecast as loading
    setLoadingStates((prev) => ({ ...prev, [index]: true }));

    try {
      const forecastData = await fetchWeatherByLocation(latitude, longitude); // Fetch forecast data for the location
      setForecast(forecastData); // Set the forecast data

      // Update city and country in the context
      setContextCity(city);
      setContextCountry(country);
    } catch (error) {
      // Catch and log any errors during forecast fetching
      console.error('Error fetching location forecast:', error);
    } finally {
      // Remove the loading state for the current forecast
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className={styles.appContainer}>
      {/* Section for searching weather by city */}
      <div className={styles.searchSection}>
        <h1>Discover Today’s Weather</h1>
        <input 
          type="text" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} // Update city input when user types
          placeholder="Enter city name" 
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          {searchLoading ? (
            <div className={styles.loading}></div> // Show loading animation while fetching
          ) : (
            'Get Weather' // Button label for fetching weather
          )}
        </button>
      </div>

      {/* Display error message if there's any */}
      {errorMessage && (
        <div className={styles.errorMessage}>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Section to display weather details and forecast */}
      <div className={styles.weatherForecastContainer}>
        {/* Display the list of weather results */}
        {weather && weather.length > 0 && (
          <div className={styles.weatherList}>
            {weather.map((cityWeather, index) => (
              <div key={index} className={styles.weatherDetails}>
                <h2>Weather Details:</h2>
                <p>City: {cityWeather.city}</p>
                <p>State or Country: {cityWeather.stateOrCountry}</p>
                <p>Latitude: {cityWeather.latitude}</p>
                <p>Geocode: {cityWeather.geocode}</p>

                <button 
                  onClick={() => handleGetForecast(cityWeather.latitude, cityWeather.longitude, index, cityWeather.city, cityWeather.stateOrCountry)}
                  className={styles.forecastButton}
                  disabled={loadingStates[index]} // Disable button if loading is in progress
                >
                  {loadingStates[index] ? (
                    <div className={styles.loading}></div> // Show loading animation while fetching forecast
                  ) : (
                    'Get Forecast' // Button label for fetching forecast
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Display the forecast details when available */}
        {forecast && weather && (
          <div className={styles.forecastSection}>
            <WeatherForecast forecast={forecast} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

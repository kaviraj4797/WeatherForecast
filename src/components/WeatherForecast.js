import React, { useContext } from 'react'; 
import { WeatherContext } from '../WeatherContext'; // Import context to access global weather state
import styles from '../css/weather.module.css'; // Import scoped CSS module for styling

function WeatherForecast({ forecast }) {
  // Destructure city and country from WeatherContext to display location-specific data
  const { city, country } = useContext(WeatherContext); 
  
  // Extract current weather conditions from the forecast prop
  const { currentConditions } = forecast.data;
  const {
    temperature, // Current temperature
    feelsLikeTemperature, // Feels like temperature
    humidity, // Humidity percentage
    wind, // Wind speed or description
    description, // Weather condition description
    sunriseTime, // Time for sunrise
    sunsetTime, // Time for sunset
    iconCode, // Icon code for weather condition
  } = currentConditions;

  return (
    <div className={styles.weatherContainer}> 
      {/* Display city and country names */}
      <h2>Weather Forecast for {city}, {country}</h2> 

      <div className={styles.weatherMain}> 
        {/* Display main weather details */}
        <div className={styles.weatherDetails}> 
          <p>Temperature: {temperature}°C</p>
          <p>Humidity: {humidity}%</p>
          <p>Feels like: {feelsLikeTemperature}°C</p>
          <p>Weather Condition: {description}</p>
        </div>

        <div className={styles.weatherExtra}> 
          {/* Display additional weather information */}
          <p>Wind: {wind}</p>
          <p>Sunrise: {sunriseTime.time}</p>
          <p>Sunset: {sunsetTime.time}</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherForecast;

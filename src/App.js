import './App.css';
import Search from './components/search/search';
import Forecast from './components/forecast/forecast';
import CurrentWeather from './components/current_weather/current-weather';
import LineChart from './components/chart/LineChart';
import { WEATHER_API_URL, WEATHER_API_KEY } from './api';
import { useState } from 'react';

function App() {

  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastWeather, setforcastWeather] = useState(null);
  const [chartData, setChartData] = useState(null);

  function handleOnSearchChange(searchData) {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const forecastWeatherFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    Promise.all([currentWeatherFetch, forecastWeatherFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setforcastWeather({ city: searchData.label, ...forecastResponse });
        setChartData({
          labels: forecastWeather.map((item, idx) => item.main.humidity),
          datasets:[
            {
              label:"farhan",
              data: forecastWeather.map((item, idx) => item.main.temp),
              backgroundColor: "limegreen"
            }
          ],
        })
        
      })
      .catch((err) => console.log(err));
  }


  console.log(currentWeather);
  console.log(forecastWeather);
  console.log("chart");
  console.log(chartData);


  return (
    <div>

    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather}/>}
      {forecastWeather && <Forecast data={forecastWeather} currentData = {currentWeather}/>}
    </div>
      {chartData && <LineChart data={chartData}/>}

    </div>
  );
}

export default App;
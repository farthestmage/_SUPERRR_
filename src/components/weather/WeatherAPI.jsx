import {useEffect,useState} from 'react'
import { useLocation } from './useLocation'

export function WeatherAPI  ()  {
    const [location, updateLocation] = useLocation()
    const [weatherCity,setWeatherCity] = useState(null)
    const [weathercurrent, setWeatherCurrent] = useState(null)
    const[locomoco, setLocomoco] = useState(null)
    const[futureWeather, setFutureWeather] = useState(null)
    //Initial value on mount
    useEffect(() => {
    chrome.storage.session.get("weather_city", (result) => {
      if (result.weather_city) {
        setWeatherCity(result.weather_city);
      } else {
        setWeatherCity(null);
      }
    });
  }, []);

  //React to storage chages(updates)
  useEffect(() => {
    function handleStorageChange(changes, areaName) {
      if (areaName === "session" && changes.weather_city) {
        const newValue = changes.weather_city.newValue;
        setWeatherCity(newValue ?? null); // null if deleted
      }
    }

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);
    
    
    
    useEffect(() => {
        if (!location) {
            updateLocation()
        }
    }, [location, updateLocation])

// Acess weather_city viable ??  A way to acess the variable ?? 
    useEffect(() => {
        if(weatherCity){
            console.log("Fecthing weather for search: ",weatherCity)
            callWeather(weatherCity,setWeatherCurrent,setLocomoco,setFutureWeather)
        }
        else if (location){
            console.log("Fetching weather for location:", location)
            callWeather(location,setWeatherCurrent,setLocomoco,setFutureWeather)
        }
    }, [location,weatherCity])
  return [
   weathercurrent,locomoco,futureWeather
  ]
}


function callWeather(location,setWeatherCurrent,setLocomoco,setFutureWeather){
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API}&q=${location.lat},${location.lon}&days=3&aqi=no&alerts=yes
`)
            .then(response => response.json())
            .then(data => {
                console.log("Weather data:", data)
                setWeatherCurrent(data?.current)
                setLocomoco(data?.location)
                setFutureWeather(data?.forecast.forecastday)
            })
            .catch(err => {
                console.error("Error fetching weather data:", err)
            })
}
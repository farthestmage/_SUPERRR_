import { useEffect, useState } from "react"
import { WeatherDetails } from "./WeatherDetails"
import {WeatherAPI} from "./WeatherAPI"
import { AnimatePresence, motion } from "framer-motion"


export const WeatherWidget = ({weatherMode}) => {
    const [city, setCity] = useState("")
    const [weathercurrent,locomoco,futureWeather] = WeatherAPI()
    const [hover, setHover] = useState(false)
    
    useEffect(()=>{
        chrome.storage.local.get("weather_city", (item)=>{
            setCity(item.weather_city.name)
        })
    })
useEffect(() => {

if (!hover){
    chrome.storage.session.clear()}

},[hover])

    return (
        <>
            <div className="absolute" onMouseEnter={()=>{setHover(true)}} onMouseLeave={()=>{setHover(false)}}>
                <div className=" mt-4 ml-6 text-white space-y-1">
                   { weathercurrent && locomoco ? (
                    <div>
                    <span className="flex"> {weathercurrent.condition.icon && <img src={`https:${weathercurrent.condition.icon}`} alt={`${weathercurrent.condition.text}`} className="inline w-7 h-7 mr-2"/>}
                     <p className="text-2xl font-light ">{Math.ceil(weathercurrent.temp_c)}°C</p></span>
                    <p className="text-sm opacity-80">{locomoco.name},{locomoco.country}</p> 
                    </div> )
                    :
                    ( <p>Loading....</p>)
                    }
                   {/*<p className={`${weatherMode?"":"hidden"} text-sm opacity-80`}>Rainy</p>
               */} 
                </div>
                <AnimatePresence>
                { hover &&
                <motion.div
                            initial={{opacity : 0, y: -20}}
                            animate = {{opacity : 1, y: 0}}
                            exit = {{opacity : 0, y: -20}}
                            transition={{
                                opacity: { duration: 0.1, ease: "easeOut" },
                                y: {duration: 0.3, type:"spring", bounce:0.5}
                            }} 
                    ><WeatherDetails setCity={setCity} city={city} futureWeather={futureWeather} weathercurrent={weathercurrent} locomoco={locomoco}/>
                </motion.div>
                }
                </AnimatePresence>
            </div>
        </>
    )
}



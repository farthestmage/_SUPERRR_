import React from 'react'
import SunnyIcon from '../svg/weather_icons/Sunny'

const FutureWeather = ({data}) => {
    const dayName = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "short", 
  })
  return (




                         <div className=" px-7 border-r-2 border-gray-50/30 text-shadow-md">
                                <p className="text-center mb-2">{dayName}</p>
                                <SunnyIcon size={35} stroke="#ffffffdd" />
                                <div className="text-center text-[.8rem]  mt-2">
                                    <p className="text-white">{Math.round(data.day.maxtemp_c)}&deg;C</p>
                                    <p className="text-white/70">{Math.round(data.day.maxtemp_c)}&deg;C</p>
                                </div>
                            </div>
  )
}

export default FutureWeather
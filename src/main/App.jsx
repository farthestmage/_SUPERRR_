import './App.css'
import { Todo, WeatherWidget, Qoute, Greeting, DateTime, SearchBar, WallpaperAPI , Setting} from '../components'
import { useEffect, useState } from 'react'
import { saveImageToStorage } from '../components/Wallpaper'
import { useSettings } from './useSettings'   
const defaultSettings= {
    weather: true,
    clock: true,
    greeting: true,
    quote: true,
    todo: true,
    searchBar: true,
    wallpaperRefresh: true,
  }


export default function App() {

  const [weatherMode, setWeatherMode] = useState(false)
  const [wallpaperURI, setWallpaperURI] = useState("")
  const [refreshTime, setRefreshTime] = useState(30) // in mins
  const [settings, setSettings] = useSettings()

  // Some helper function
  const wallpaperApi = async() => {
    const url = await WallpaperAPI("snow")
    await saveImageToStorage(url)
    
  }
  

  // Changing wallpaper after x minutes
  useEffect(() => {
      const wallpaperChanging = () => {
        const save = async() => {
            await wallpaperApi()
        }
        save()
      chrome.storage.local.get("wallpaper", (URI) => {
        setWallpaperURI(URI)
      })
    }

    const intervalId = setInterval(() => {
            chrome.storage.local.get("time", (time) => {
              const cur_time = new Date()
              if(Math.floor((cur_time.getTime() - time.time) / (1000 * 60)) >= refreshTime){
                wallpaperChanging()
              }
            })
        }, 1000);
  },[])

  // Initially set the wallpaper 
  useEffect(() => {
        chrome.storage.local.get("wallpaper", (URI) => {
          if(!URI.wallpaper){
            const save = async() => {
                await wallpaperApi()
            }
            save()
            chrome.storage.local.get("wallpaper", (URL) => {
              setWallpaperURI(URL)
            })
            return
          }
          setWallpaperURI(URI)
        })
  },[])




  return (
    <div>

      <div id='Bg' className={`  bg-cover bg-center `} 
      style={settings.wallpaperRefresh 
        ? { backgroundImage: `url(${wallpaperURI.wallpaper})` } 
        : {backgroundColor: 'black'}
      }
      >
        <div className="absolute inset-0 bg-black/20"></div> 
        <div className='z-10 relative overflow-hidden h-screen max-w-screen'> 
          {settings.weather && <WeatherWidget
          weatherMode = {weatherMode}
        />}

        <div className='grid grid-rows-3 h-full'>
          {/* <Goog/>  */}

          <div className='grid grid-cols-3 place-items-center'>
            <div className=''></div>

            <div className=''>
             { settings.clock && <DateTime
                weatherMode = {weatherMode}
              />}
            </div>

            <div className=' self-start justify-self-end pr-10 pt-7'>{settings.searchBar && <SearchBar/>}</div>
          </div>
         <div className='flex items-center justify-center'>{ settings.greeting && <Greeting/>}</div>
        <div className='grid grid-cols-4 mb-7'>
          <div>
            <Setting settings={settings} setSettings={setSettings}/> 
          </div>
          <div className='col-span-2 justify-self-center place-self-end'>{settings.quote && <Qoute/>}</div>
          <div className='justify-self-center place-self-end'>{settings.todo && <Todo/>}</div>
        </div>
        </div>

        </div>
      </div>

    </div>
  )
}

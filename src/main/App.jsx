import './App.css'
import { Todo, WeatherWidget, Qoute, Greeting, DateTime, SearchBar, WallpaperAPI , Setting, Credits} from '../components'
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
  }


export default function App() {

  const [weatherMode, setWeatherMode] = useState(false)
  const [wallpaperURI, setWallpaperURI] = useState("")
  const [refreshTime, setRefreshTime] = useState() // in mins
  const [settings, setSettings] = useSettings()

  // Some helper function
  const wallpaperApi = async() => {
    const image = await WallpaperAPI("placeholder")
    await saveImageToStorage(image)
    
  }

  async function fetchRefreshTime() {
      try {
        const result = await chrome.storage.local.get("wallpaper_time");


        // Check if key exists
        if (!result || !("wallpaper_time" in result)) {
          throw new Error('Key "wallpaper_time" not found in storage');
        }

        setRefreshTime(result.wallpaper_time || 30);
        // console.log("refresh time set", result.wallpaper_time)
      } catch (err) {
        console.error("Storage fetch error:", err.message);
      }
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

        fetchRefreshTime()

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

          <div className={`grid grid-cols-3 place-items-center`} >
            <div className=''></div>

            <div className=" ">
             { settings.clock && settings.greeting && <DateTime
                weatherMode = {weatherMode}
              />}
            </div>

            <div className=' self-start justify-self-end pr-10 pt-7'>{settings.searchBar && <SearchBar/>}</div>
          </div>
         <div className='flex items-center justify-center'>
          { settings.greeting ? <Greeting/> :  settings.clock && <DateTime weatherMode = {weatherMode}/>}
          </div>
        <div className='grid grid-cols-4 mb-7'>
          <div className=''>
            <div className='flex fixed bottom-6 left-6 items-center'>
              <Setting settings={settings} setSettings={setSettings}/> 
              <Credits/>
            </div>
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

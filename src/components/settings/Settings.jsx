import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Toggle from "./Toggle";
import { motion, spring } from "framer-motion";
import Dropdown from "../dropdown";

  const options = [
    { label: "30min", value: 30 },
    { label: "1 hrs", value: 60 },
    { label: "6 hrs", value: 360 }
  ];


export const Setting = ({settings,setSettings}) => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(30)
  const settingRef = useRef()

  async function setInStorage(key, value) {
  try {
    await chrome.storage.local.set({ [key]: value });

    if (chrome.runtime.lastError) {
      throw new Error(chrome.runtime.lastError.message);
    }
  } catch (err) {
    console.error(`Failed to set "${key}" in storage:`, err.message);
    throw err; // optional: rethrow if you want to handle in caller
  }
}


  useEffect(() => {
    async function fetchStorageValue() {
      try {
        const result = await chrome.storage.local.get("wallpaper_time");


        // Check if key exists
        if (!result || !("wallpaper_time" in result)) {
          throw new Error('Key "wallpaper_time" not found in storage');
        }

        setTime(result.wallpaper_time);
        // console.log("time set", result.wallpaper_time)
      } catch (err) {
        console.error("Storage fetch error:", err.message);
      }
    }

    fetchStorageValue();


  }, []);

  useEffect(() => {
           
      function handleClickOutside(evt) {
        if (settingRef.current && !settingRef.current.contains(evt.target)) {
          setOpen(false)
        }
      }
  
      if (open) {
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("touchstart", handleClickOutside)
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("touchstart", handleClickOutside)
      }
      }, [open]) 
  

  const settingOptions = [
    { id: "weather", label: "Weather" },
    { id: "clock", label: "Clock" },
    { id: "greeting", label: "Greeting" },
    { id: "quote", label: "Quote" },
    { id: "todo", label: "Todo" },
    { id: "searchBar", label: "Search Bar" },
    // { id: "wallpaperRefresh", label: "Wallpaper Refresh" },
  ];

  {/* absolute bottom-12 right-20  */}
  return (
    <div className="fixed bottom-6 left-6">
      {/* Settings Icon */}
      <div
        ref={settingRef}
        className="relative"
      >

        <motion.div
          
          animate={{
            rotate: open? 0 : 90
          }}
          transition={{type: spring, stiffness:300, damping: 15}}
        >
          <button  onClick={() => {
            setOpen(prev=>!prev)
            console.log("RUnning")
            }} className="p-3 rounded-full shadow-lg hover:bg-black/20">
            <Settings className="w-6 h-6 text-white" />
          </button>
        </motion.div>

        {/* Hover Box */}
        {open && (
          <motion.div 
          initial={{opacity : 0, y: 20, height: "auto"}}
          animate = {{opacity : 1, y: 0,  height: "auto"}}
          transition={{
              opacity: { duration: 0.3, ease: "easeOut" },
              y: {duration: 0.5, type:"spring", bounce:0.5},
          }} 
          
          className={`absolute bottom-14 left-2 w-64 p-4 px-5 bg-white/20 backdrop-blur-sm rounded-lg text-white/80 shadow-lg mb-3 origin-bottom
                            h-auto"}
                            shadow-lg rounded-xl p-4`}>
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            {settingOptions.map((opt) => (
              <Toggle
                key={opt.id}
                id={opt.id}
                label={opt.label}
                settings={settings}
                setSettings={setSettings}
              />
            ))}

              <div className="flex justify-between items-center">
                <label className="flex justify-between items-center cursor-pointer mb-3">
                  <span className="ms-3 text-sm font-medium text-black-900 dark:text-black-300">Wallpaper Refresh</span>
                </label>
                <Dropdown
                items={options}
                placeholder={time == 30? "30min": (time == 60? "1hr":"6hrs")}
                onSelect={(item) => {
                  setTime(item.value)
                  setInStorage("wallpaper_time", item.value)
                }}
              />
              </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

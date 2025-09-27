import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Toggle from "./Toggle";
import { motion, spring } from "framer-motion";


export const Setting = ({settings,setSettings}) => {
  const [open, setOpen] = useState(false);
  const settingRef = useRef()

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
        document.removeEventListener("click", handleClickOutside)
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
    { id: "wallpaperRefresh", label: "Wallpaper Refresh" },
  ];

  {/* absolute bottom-12 right-20  */}
  return (
    <div className="fixed bottom-6 left-6">
      {/* Settings Icon */}
      <div
       
        className="relative"
      >

        <motion.div
        
          animate={{
            rotate: open? 0 : 90
          }}
          transition={{type: spring, stiffness:300, damping: 15}}
        >
          <button  onClick={() => setOpen(()=>!open)} className="p-3 rounded-full shadow-lg hover:bg-black/20">
            <Settings className="w-6 h-6 text-white" />
          </button>
        </motion.div>

        {/* Hover Box */}
        {open && (
          <motion.div 
          ref={settingRef}
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
          </motion.div>
        )}
      </div>
    </div>
  )
}

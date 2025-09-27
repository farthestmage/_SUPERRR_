
import {useState , useEffect} from 'react'

const Toggle = ({ label, id, settings, setSettings }) => {
    const [enabled, setEnabled] = useState(false)
   

  return (
        <label className="flex justify-between items-center cursor-pointer mb-3">
          <span className="ms-3 text-sm font-medium text-black-900 dark:text-black-300">{label}</span>
          <input type="checkbox" checked={settings[id]} 
            onChange={(e)=> 
              setSettings((prev) => ({ ...prev, [id]: e.target.checked }))
            } 
            className="sr-only peer"/>
            <div className="relative w-11 h-6 bg-gray-200  dark: rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
            peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600/50 dark:peer-checked:bg-green-600/50"></div>
            
        </label>
  )
}

export default Toggle
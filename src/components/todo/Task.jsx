import DoubleTick from "../svg/DoubleTick"
import "./task.css"
import {useRef, useState } from "react"
import { Pencil } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"



export const Task = ({ id, taskName, done, onToggle,onEdit,onDelete }) => {
    

    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const [pencilOpacity, setPencilOpacity] = useState(0)



    return (
        <div className="p-1 flex items-center ml-3 ">
            <button onClick={onToggle} className="relative flex items-center justify-center w-4 h-4 rounded-full">


              {!done ? (<div
                className={`
                  absolute w-4 h-4 border-2
                  transition-all duration-300 ease-in-out rounded-full
                `}
              ></div>)
                  :
              ( <motion.div
                initial = {{rotate:0, scale:0}}
                animate = {{rotate: 360, scale:1, transition:{duration:0.4, type:"spring", bounce:0.4}}}
                onAnimationComplete={() => onDelete(id)}
              >
                  <DoubleTick size={16}
                  className={`
                    text-white transition-all duration-300 ease-in-out
                    ${!done ? "opacity-100 scale-100" : "opacity-0 scale-50"}
                  `}
                />
              </motion.div> )
              
              }

            </button>



            <div className=" w-full flex items-center relative"> 

              <AnimatePresence>    
                    {editing && (<motion.div
                    initial={{scaleX:0}}
                    animate={{scaleX:1, transition: {duration: 0.3, type: "spring", bounce: 0.5}}}
                    onAnimationComplete={() => {inputRef.current?.focus()}}

                      className="absolute left-0 bottom-0 h-0.5 bg-gray-50/50 w-full"
                    >
                    </motion.div>)} 
                </AnimatePresence> 

                <motion.div
                  onHoverStart={()=>{setPencilOpacity(60)}}
                  onHoverEnd={() => {setPencilOpacity(0)}}
                >
                <input 
                ref={inputRef}
                type="text " 
                    value={taskName}
                    disabled={!editing}
                    onChange={(e) => onEdit(id, e.target.value)}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setEditing(false);
                        }
                    }} 
                    className={`relative w-[10rem] text-[1.05rem] leading-0.5  text-white ml-1 px-1 border-b-1 border-transparent
                    focus:outline-none cursor-default ${editing ? "cursor-text" : "cursor-default"}`}
                    />
                  </motion.div>

                <Pencil size={14} color="#ffffffaa" className={`ml-1 opacity-${pencilOpacity} hover:opacity-100 cursor-pointer`}
                            onClick={() => {setEditing((prev) => (!prev))}}
                    ></Pencil>
            </div>
        </div>
    )
}






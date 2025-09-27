import { useState,useRef,useEffect } from "react"
import { Task } from "./Task"
import { useTasks } from "./useTask"
import { motion, AnimatePresence } from "framer-motion";
import { BrushCleaning } from 'lucide-react';

export const Todo = () => {
    const [expand, setExpand] = useState(false)
    const [tasks, setTasks] = useTasks()
    const menuRef = useRef(null)
    const addtaskRef = useRef(null)
    const [hovered, setHovered] = useState(false)
    const [addEventListener, setAddEventListener] = useState(false) // For showing add button and input


    
    useEffect(() => {
         
    function handleClickOutside(evt) {
      if (menuRef.current && !menuRef.current.contains(evt.target)) {
        setExpand(false)
      }
    }

    if (expand) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
    }, [expand]) 
    

    useEffect(() => {
        if(addEventListener && addtaskRef.current)
            addtaskRef.current.focus()
    },[addEventListener])


     const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
                    )
            )
        }
    const editTask = (id, newName) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, taskName: newName } : task
            )
        )
    }
    const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
    }
    const addTask = (taskName) => {
        setAddEventListener(false)
    const newTask = {
      id: Date.now(),
        taskName: taskName,
        done: false,}
    setTasks((prev) => [...prev, newTask])}    


    /*View calling*/
    return (
        <>
            <div
            ref={menuRef} className={` w-fit `} >

                <div onMouseLeave={() => {setHovered(false)}}
                    onMouseEnter={() => {setHovered(true)}}
                 className="">
                    <AnimatePresence>
                        {hovered || expand? (<motion.div
                            layout
                            initial={{opacity : 0, y: 5, height: "auto"}}
                            animate = {{opacity : 1, y: 0,  height: "auto"}}
                            exit = {{opacity : 0, y: 5}}
                            transition={{
                                opacity: { duration: 0.2, ease: "easeOut" },
                                layout: {duration: 0.3, type:"spring", bounce:0.5}
                            }} 
                        className={`absolute bottom-12 min-w-[16rem] right-20 bg-white/20 backdrop-blur-sm rounded-lg text-white p-4  shadow-lg mb-3 origin-bottom
                            h-auto"}
                            shadow-lg rounded-xl p-4 
                            `} 
                        >
                            <h3 className="mb-1 font-semibold text-[1.5rem]">Todo</h3>
                            <div className={`max-h-[26rem] overflow-y-auto overflow-x-hidden`}>
                                {tasks.length === 0 && !addEventListener?(
                                    <div className="flex justify-center py-1 text-[1.1rem] text-shadow-2xs text-white/70">
                                        <div className="opacity-60 mr-1">
                                            <BrushCleaning />
                                        </div>
                                        No Tasks
                                    </div>
                                ):(<div></div>)}
                                <AnimatePresence mode="poplayout">
                                    {(expand ? tasks : tasks.slice(0, 3)).map((task) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{opacity:0, height: 0}}
                                            animate = {{opacity:1, height: "auto",transition: {duration: 0.1} }}
                                            exit={{ opacity: 0, height: 0, transition: { duration: 0.1 } }}
                                            className="overflow-hidden"
                                        >  
                                            <Task key={task.id} {...task} onToggle={() => toggleTask(task.id)} onEdit ={editTask} onDelete={()=> deleteTask(task.id)} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            
                                <div className={`ml-3 mt-2 text-[0.9rem] opacity-60 transition duration-100 cursor-pointer  w-fit
                                    hover:opacity-100`}>
                                    <AnimatePresence mode="wait">
                                        {!addEventListener? (expand &&(
                                            <motion.div
                                                key="addTask"
                                                initial = {{opacity: 0, x:-10 }}
                                                animate = {{opacity: 1, x: 0,
                                                    transition:{
                                                    type: 'spring',
                                                    bounce: 0.5
                                                }
                                                }}
                                                exit={{opacity: 0, x:10,
                                                    transition: {
                                                        duration: 0.2,
                                                        type:"spring", bounce: 0.5
                                                    }
                                                }}
                                                
                                            >
                                                <p className={`inline`}  
                                                    onClick={()=>{setAddEventListener(prev=>!prev)}}
                                                >
                                                    + Add task
                                                </p>
                                            </motion.div>
                                            ))
                                            :
                                            (
                                                <motion.div
                                                    initial={{opacity:0.5, x:-10}}
                                                    animate = {{opacity:1,x:0, transition:{duration:0.2, type:"spring", bounce: 0.5}}}
                                                    onAnimationComplete={() => {addtaskRef.current.focus()}}

                                                >
                                                    <input ref={addtaskRef}  onKeyUp={e => e.key === "Enter" && addTask(e.currentTarget.value)} type="text" placeholder="+ Add task" className="w-[13rem] focus:outline-none focus:border-b-1 text-sm" />
                                                </motion.div>
                                            )
                                            }
                                    </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>):""}
                        </AnimatePresence>

                    <div className="w-full text-[1.2rem] text-center relative">
                        <div className="w-full">
                            <p className="cursor-pointer inline text-white underline "
                            onMouseEnter={() => {setHovered(true)}}
                            
                            onClick={() => {setAddEventListener(false),setExpand((prev) => !prev)}}
                            >todo</p>
                        </div>
                    </div>
                </div>   
        </div>
        
        </>
    )
}

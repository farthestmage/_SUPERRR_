import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Dropdown({ items, placeholder = "Select an option", onSelect }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Handle selection
  const handleSelect = (item) => {
    setSelected(item);
    onSelect?.(item);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative text-sm">
      {/* Dropdown button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-18 items-center justify-between px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-md shadow-md text-white hover:bg-white/20 transition"
      >
        <span>{selected?.label || placeholder}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown className="w-4 h-4 text-white" />
        </motion.div>
      </button>

      {/* Dropdown items */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="absolute left-19 top-0 z-20 w-fit bg-white/20 backdrop-blur-md border border-white/20 rounded-md shadow-lg overflow-hidden"
          >
            {items.map((item) => (
              <li
                key={item.value}
                onClick={() => handleSelect(item)}
                className={`px-4 py-2 cursor-pointer hover:bg-white/30 text-white ${
                  selected?.value === item.value ? "bg-white/30 font-medium" : ""
                }`}
              >
                {item.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

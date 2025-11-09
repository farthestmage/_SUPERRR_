import { useEffect, useState } from "react"

export const Qoute = () => {

  const [qoute, setQoute] = useState(null)
  useEffect(() => {
    fetch("https://dummyjson.com/quotes/random")
    .then(response => response.json())
    .then(data => {
        setQoute(data)
    })
    .catch(err => {
        console.error("Error fetching weather data:", err)
    })
  },[])

    return (
        <>
            {qoute ? (
                <div className=" text-white italic opacity-80 text-[1.3rem]">
                    {qoute.quote}
                </div>
            ) : (
                <div><p>Loading...</p></div>
            )}
        </>
    )
}
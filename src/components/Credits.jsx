import { useEffect, useState } from "react"

function Credits() {

    const [author, setAuthor] = useState()
    const [link, setLink] = useState()
    useEffect(() => {
        chrome.storage.local.get("photographer")
        .then((result) => {
          setAuthor(result.photographer)
        })
        .catch(() => {setAuthor("Photos by Pexels")})

        chrome.storage.local.get("author_link")
        .then((result) => {setLink(result.author_link)
        })
        .catch(() => {setLink("https://www.pexels.com/")})
    },[])

  return (
    <div className="text-white text-sm">
      <a href={link} target="_blank" rel="noopener noreferrer">{author}</a>
    </div>
  )
}

export {Credits}
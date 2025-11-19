import {createClient} from "pexels"

const KEYWORDS = {
    "sunny" : ["sunny", "sun", "afternoon", "blue sky", "sky"],
    "rainy" : ["rains", "clouds", "thunderstorm", "street rain"],
    "snow" : ["snow", "snowfall", "snowy night"],
    "placeholder" : ["nature", "landscape", "calm", "dark", "minimalism", "city", "rain", "cafe", "cute animals", "sunset", "mist", "mountains", "abstract art"]
}

export const WallpaperAPI = async(weather) => {

    const queryArray = KEYWORDS[weather]
    const randomKeywordIndex = Math.floor(Math.random() * queryArray.length)
    const query = queryArray[randomKeywordIndex]

    const client = createClient(import.meta.env.VITE_PEXELS_API)
    const perPage = 15;
    const randomPage = Math.floor(Math.random() * 10) + 1; // pages 1-10

    const test = await client.photos.search({query, per_page : perPage, orientation: "landscape", page: randomPage})
    const randomIndex = Math.floor(Math.random() * test.photos.length);
    const link = test.photos[randomIndex].src.large2x
    
    return test.photos[randomIndex]
}

async function imageUrlToBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // result = base64 string
        reader.onerror = reject;
        reader.readAsDataURL(blob); // converts blob to base64
    });
}

export async function saveImageToStorage(image, key = "wallpaper") {
  try {
    const time = new Date()
    console.log(image)
    const base64 = await imageUrlToBase64(image.src.large2x);
    chrome.storage.local.set({ [key]: base64 });
    chrome.storage.local.set({ "time": time.getTime()});
    chrome.storage.local.set({ "photographer": image.photographer});
    chrome.storage.local.set({ "author_link": image.url})
  } catch (err) {
    console.error("Error converting image:", err);
  }
}


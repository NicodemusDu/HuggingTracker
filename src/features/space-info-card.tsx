import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export const SpaceInfoCard = ({ spaceId }) => {
  const [lastVisited, setLastVisited] = useState("")
  const [favoriteCount, setFavoriteCount] = useState(0)

  useEffect(() => {
    const fetchInitialData = async () => {
      const storedInfoString = await storage.get(spaceId)
      if (storedInfoString) {
        const storedInfo = JSON.parse(storedInfoString)
        setLastVisited(storedInfo.lastVisited)
        setFavoriteCount(storedInfo.favoriteCount)
      }
    }

    fetchInitialData()
  }, [spaceId])

  const handleFavorite = async () => {
    const now = new Date().toLocaleString()
    setLastVisited(now)
    const newFavoriteCount = favoriteCount + 1
    setFavoriteCount(newFavoriteCount)
    await storage.set(spaceId, JSON.stringify({ favoriteCount: newFavoriteCount, lastVisited: now }))
  }

  return (
    <div className="plasmo-bg-white plasmo-shadow-md plasmo-rounded-lg plasmo-p-4 plasmo-m-2">
      <p>最后访问: {lastVisited}</p>
      <p>收藏次数: {favoriteCount}</p>
      <button
        onClick={handleFavorite}
        className="plasmo-bg-blue-500 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded plasmo-mt-2">
        收藏并更新访问时间
      </button>
    </div>
  )
}

import { useEffect, useState } from "react"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

function HistoryPage() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      const allData = await storage.getAll()
      const historyData = Object.entries(allData).map(([key, value]) => ({
        spaceId: key,
        ...(typeof value === 'object' && value !== null ? value : {})
      }))
      setHistory(historyData)
    }

    fetchHistory()
  }, [])

  return (
    <div className="plasmo-p-4">
      <h1 className="plasmo-text-2xl plasmo-font-bold plasmo-mb-4">浏览历史</h1>
      {history.map((item) => (
        <div key={item.spaceId} className="plasmo-bg-white plasmo-shadow plasmo-rounded-lg plasmo-p-4 plasmo-mb-4">
          <h2 className="plasmo-text-xl plasmo-font-semibold">{item.spaceId}</h2>
          <p>最后访问: {item.lastVisited}</p>
          <p>收藏次数: {item.favoriteCount}</p>
        </div>
      ))}
    </div>
  )
}

export default HistoryPage

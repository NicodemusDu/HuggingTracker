import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";
import type { SpaceData } from "./types";

const storage = new Storage();

function HistoryPage() {
	const [history, setHistory] = useState<SpaceData[]>([]);

	useEffect(() => {
		const fetchHistory = async () => {
			const allData = await storage.getAll();
			const historyData = Object.entries(allData)
				.map(([key, value]) => {
					try {
						const parsedValue = JSON.parse(value as string) as SpaceData;
						return {
							...parsedValue,
							url: key,
						};
					} catch (e) {
						console.error("Error parsing stored data:", e);
						return null;
					}
				})
				.filter((item): item is SpaceData => item !== null);
			setHistory(historyData);
		};

		fetchHistory();
	}, []);

	return (
		<div className="plasmo-p-4">
			<h1 className="plasmo-text-2xl plasmo-font-bold plasmo-mb-4">浏览历史</h1>
			{history.map((item) => (
				<div
					key={item.url}
					className="plasmo-bg-white plasmo-shadow plasmo-rounded-lg plasmo-p-4 plasmo-mb-4"
				>
					<h2 className="plasmo-text-xl plasmo-font-semibold">{item.title}</h2>
					<p>URL: {item.url}</p>
					<p>最后访问: {item.likes[item.likes.length - 1]?.date}</p>
					<p>收藏次数: {item.likes.length}</p>
				</div>
			))}
		</div>
	);
}

export default HistoryPage;

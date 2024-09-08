import { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";

import "~style.css";
import type { SpaceData } from "~features/types";

const storage = new Storage();

function IndexPopup() {
	const [allData, setAllData] = useState<Record<string, SpaceData>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAllData = async () => {
		try {
			setIsLoading(true);
			const data = await storage.getAll();

			const parsedData: Record<string, SpaceData> = {};

			for (const [key, value] of Object.entries(data)) {
				try {
					if (typeof value === "string") {
						parsedData[key] = JSON.parse(value) as SpaceData;
					} else {
						console.warn(`Unexpected data type for key ${key}:`, typeof value);
					}
				} catch (e) {
					console.error(`Error parsing data for key ${key}:`, e);
				}
			}

			setAllData(parsedData);
		} catch (e) {
			console.error("Error fetching data:", e);
			setError("Failed to fetch data. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	const handleClearAllData = async () => {
		if (window.confirm("确定要清除所有数据吗？此操作不可撤销。")) {
			try {
				await storage.clear();
				setAllData({});
				alert("所有数据已清除");
			} catch (e) {
				console.error("Error clearing data:", e);
				setError("Failed to clear data. Please try again.");
			}
		}
	};

	return (
		<div className="plasmo-p-4 plasmo-w-96 plasmo-min-h-[200px] plasmo-max-h-96 plasmo-overflow-y-auto">
			<h1 className="plasmo-text-2xl plasmo-font-bold plasmo-mb-4">
				存储的数据
			</h1>
			<button
				onClick={handleClearAllData}
				className="plasmo-bg-red-500 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded plasmo-mb-4 plasmo-hover:plasmo-bg-red-600 plasmo-transition-colors"
			>
				清除所有数据
			</button>
			{isLoading ? (
				<p>Loading...</p>
			) : error ? (
				<p className="plasmo-text-red-500">{error}</p>
			) : Object.keys(allData).length === 0 ? (
				<p>No data stored yet.</p>
			) : (
				Object.entries(allData).map(([spaceId, data]) => (
					<div
						key={spaceId}
						className="plasmo-mb-4 plasmo-bg-white plasmo-shadow plasmo-rounded-lg plasmo-p-4"
					>
						<h2 className="plasmo-text-xl plasmo-font-semibold">
							{data.title || spaceId}
						</h2>
						<p className="plasmo-text-sm plasmo-text-gray-600">
							URL: {data.url || spaceId}
						</p>
						<p className="plasmo-mt-2">
							收藏次数: {data.likes?.[0]?.count || 0}
						</p>
						{data.likes && data.likes.length > 0 && (
							<p className="plasmo-text-sm plasmo-text-gray-600">
								最后访问:{" "}
								{new Date(
									data.likes[data.likes.length - 1].date,
								).toLocaleString()}
							</p>
						)}
					</div>
				))
			)}
		</div>
	);
}

export default IndexPopup;

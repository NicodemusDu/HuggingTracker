import { useState } from "react";
import { SpaceDataProvider, useSpaceData } from "~contexts/SpaceDataContext";

import "~style.css";

function IndexPopup() {
	const { spaceData, clearAllData } = useSpaceData();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleClearAllData = async () => {
		if (window.confirm("确定要清除所有数据吗？此操作不可撤销。")) {
			try {
				chrome.runtime.sendMessage({
					type: "DEBUG",
					message: "清除数据",
				});
				await clearAllData();
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
				type="button"
				className="plasmo-bg-red-500 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded plasmo-mb-4 plasmo-hover:plasmo-bg-red-600 plasmo-transition-colors"
			>
				清除所有数据
			</button>
			{isLoading ? (
				<p>Loading...</p>
			) : error ? (
				<p className="plasmo-text-red-500">{error}</p>
			) : Object.keys(spaceData).length === 0 ? (
				<p>No data stored yet.</p>
			) : (
				Object.entries(spaceData).map(([spaceId, data]) => (
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

function Popup() {
	return (
		<SpaceDataProvider>
			<IndexPopup />
		</SpaceDataProvider>
	);
}

export default Popup;

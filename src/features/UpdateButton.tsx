import { useState } from "react";
import packageInfo from "~/../package.json";
import { useSpaceData } from "../contexts/SpaceDataContext";
import type { SpaceData } from "../types";

export const UpdateButton = () => {
	const { spaceData, updateSpace } = useSpaceData();
	const [showInfoPanel, setShowInfoPanel] = useState(false);
	const spaceId = window.location.pathname.split("/spaces/")[1];
	const space = spaceData[spaceId];

	const updateSpaceData = async () => {
		const title =
			document.querySelector(".gradio-container h1")?.textContent || "";
		const likeButton = document.querySelector(
			'button[title="See users who liked this repository"]',
		);
		const likeCount = likeButton
			? Number.parseInt(likeButton.textContent || "0", 10)
			: 0;

		const updatedSpace: SpaceData = {
			title,
			url: spaceId,
			likes: [
				...(space?.likes || []),
				{ count: likeCount, date: new Date().toISOString() },
			],
		};

		await updateSpace(spaceId, updatedSpace);
		alert("数据已更新");
	};

	return (
		<div className="-translate-y-1/2 fixed top-1/2 right-0 z-50 flex transform flex-col items-end">
			<div className="relative">
				<button
					type="button"
					onClick={updateSpaceData}
					onMouseEnter={() => setShowInfoPanel(true)}
					onMouseLeave={() => setShowInfoPanel(false)}
					className="rounded bg-green-500 px-4 py-2 text-white shadow transition duration-200 ease-in-out hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
				>
					更新数据 [{packageInfo.version}]
				</button>
				{showInfoPanel && space && space.likes.length > 0 && (
					<div className="absolute top-full right-0 mt-2 max-w-xs rounded border border-gray-200 bg-white p-4 shadow-lg">
						<p className="text-sm">
							最后更新:{" "}
							{new Date(
								space.likes[space.likes.length - 1].date,
							).toLocaleString()}
						</p>
						<p className="text-sm">
							当前点赞数: {space.likes[space.likes.length - 1].count}
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

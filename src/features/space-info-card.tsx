import { useState, useEffect } from "react";
import { Storage } from "@plasmohq/storage";
import type { SpaceData } from "./types";

const storage = new Storage();

export const SpaceInfoCard = ({ spaceId }) => {
	const [spaceData, setSpaceData] = useState<SpaceData | null>(null);

	useEffect(() => {
		const fetchSpaceData = async () => {
			const storedInfoString = await storage.get(spaceId);
			if (storedInfoString) {
				const storedInfo = JSON.parse(storedInfoString) as SpaceData;
				setSpaceData(storedInfo);
			}
		};

		fetchSpaceData();
	}, [spaceId]);

	const handleFavorite = async () => {
		if (!spaceData) return;

		const newLike = {
			count: spaceData.likes.length + 1,
			date: new Date().toISOString(),
		};
		const updatedSpaceData = {
			...spaceData,
			likes: [...spaceData.likes, newLike],
		};

		await storage.set(spaceId, JSON.stringify(updatedSpaceData));
		setSpaceData(updatedSpaceData);
	};

	if (!spaceData) return null;

	return (
		<div className="plasmo-bg-white plasmo-shadow-md plasmo-rounded-lg plasmo-p-4 plasmo-m-2">
			<p>标题: {spaceData.title}</p>
			<p>最后访问: {spaceData.likes[spaceData.likes.length - 1]?.date}</p>
			<p>收藏次数: {spaceData.likes.length}</p>
			<button
				onClick={handleFavorite}
				className="plasmo-bg-blue-500 plasmo-text-white plasmo-px-4 plasmo-py-2 plasmo-rounded plasmo-mt-2"
			>
				收藏并更新访问时间
			</button>
		</div>
	);
};

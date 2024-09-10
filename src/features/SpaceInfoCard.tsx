import { useSpaceData } from "../contexts/SpaceDataContext";

export const SpaceInfoCard = ({ spaceId }) => {
	const { spaceData } = useSpaceData();
	const space = spaceData[spaceId];

	if (!space) return null;

	return (
		<div className="plasmo-bg-white plasmo-shadow-md plasmo-rounded-lg plasmo-p-4 plasmo-m-2">
			<p>标题: {space.title}</p>
			<p>最后访问: {space.likes[space.likes.length - 1]?.date}</p>
			<p>点赞次数: {space.likes[space.likes.length - 1]?.count}</p>
		</div>
	);
};

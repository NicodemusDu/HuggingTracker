import {} from "react";
import { useSpaceData } from "~contexts/SpaceDataContext";

function HistoryPage() {
	const { spaceData: history } = useSpaceData();

	return (
		<div className="plasmo-p-4">
			<h1 className="plasmo-text-2xl plasmo-font-bold plasmo-mb-4">浏览历史</h1>
			{Object.entries(history).map(([spaceId, item]) => (
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

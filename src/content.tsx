import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { SpaceInfoCard } from "~features/space-info-card";
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

export const config: PlasmoCSConfig = {
	matches: ["https://huggingface.co/spaces", "https://huggingface.co/spaces/*"],
};

export const getStyle = () => {
	const style = document.createElement("style");
	style.textContent = cssText;
	return style;
};

interface SpaceData {
	title: string;
	url: string;
	likes: { count: number; date: string }[];
}

const PlasmoOverlay = () => {
	const [injected, setInjected] = useState(false);

	useEffect(() => {
		if (injected) return;

		const isListPage = window.location.pathname === "/spaces";
		const isDetailPage =
			window.location.pathname.startsWith("/spaces/") &&
			window.location.pathname.split("/").length > 3;

		if (isListPage) {
			injectListPageContent();
		} else if (isDetailPage) {
			injectDetailPageContent();
		}

		setInjected(true);
	}, [injected]);

	const injectListPageContent = () => {
		const cards = document.querySelectorAll('article a[href^="/spaces/"]');
		cards.forEach((card) => {
			const anchor = card as HTMLAnchorElement;
			const spaceId = anchor.href.split("/spaces/")[1];
			const data = getSpaceData(spaceId);
			if (data) {
				const infoElement = document.createElement("div");
				// infoElement.className = 'text-sm text-white mt-2'
				// infoElement.innerHTML = `最后访问: ${new Date(data.likes[data.likes.length - 1].date).toLocaleDateString()}<br>收藏次数: ${data.likes.length}`
				// card.appendChild(infoElement)

				const root = createRoot(infoElement);
				root.render(<SpaceInfoCard spaceId={spaceId} />);
			}
		});
	};

	const injectDetailPageContent = () => {
		if (document.readyState === "complete") {
			addUpdateButton();
		} else {
			window.addEventListener("load", addUpdateButton);
		}
	};

	const addUpdateButton = () => {
		const existingButton = document.getElementById("update-space-data-button");
		if (existingButton) return;

		const updateButton = document.createElement("button");
		updateButton.id = "update-space-data-button";
		updateButton.textContent = "更新数据";
		updateButton.className = `
      fixed top-4 right-4 z-50
      px-4 py-2
      bg-green-500 hover:bg-green-600
      text-white
      rounded
      shadow
      transition duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50
    `;
		updateButton.onclick = updateSpaceData;

		document.body.appendChild(updateButton);
	};

	const getSpaceData = async (spaceId: string): Promise<SpaceData> => {
		const data = await storage.get(spaceId);
		if (data) {
			try {
				const parsedData = JSON.parse(data);
				if (typeof parsedData === "object" && parsedData !== null) {
					return parsedData;
				}
			} catch (e) {
				console.error("Error parsing stored data:", e);
			}
		}
		return { title: "", url: spaceId, likes: [] };
	};

	const updateSpaceData = async () => {
		const spaceId = window.location.pathname.split("/spaces/")[1];
		const title = document.querySelector("h1")?.textContent || "";
		const likeButton = document.querySelector(
			'button[title="See users who liked this repository"]',
		);
		const likeCount = likeButton
			? parseInt(likeButton.textContent || "0", 10)
			: 0;

		console.log(spaceId, title, likeCount);
		let data = await getSpaceData(spaceId);
		if (!data) {
			data = { title, url: spaceId, likes: [] };
		}
		if (!Array.isArray(data.likes)) {
			data.likes = [];
		}

		data.likes.push({ count: likeCount, date: new Date().toISOString() });

		await storage.set(spaceId, JSON.stringify(data));
		alert("数据已更新");
	};

	return null;
};

export default PlasmoOverlay;

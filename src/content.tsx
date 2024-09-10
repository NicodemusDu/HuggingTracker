import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { SpaceDataProvider } from "~contexts/SpaceDataContext";
import { SpaceInfoCard } from "~features/SpaceInfoCard";
import { UpdateButton } from "~features/UpdateButton";

export const config: PlasmoCSConfig = {
	matches: ["https://huggingface.co/spaces", "https://huggingface.co/spaces/*"],
};

export const getStyle = () => {
	const style = document.createElement("style");
	style.textContent = cssText;
	return style;
};

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
			const infoElement = document.createElement("div");
			const root = createRoot(infoElement);
			root.render(
				<SpaceDataProvider>
					<SpaceInfoCard spaceId={spaceId} />
				</SpaceDataProvider>,
			);
			card.appendChild(infoElement);
		});
	};

	const injectDetailPageContent = () => {
		const container = document.createElement("div");
		const root = createRoot(container);
		root.render(
			<SpaceDataProvider>
				<UpdateButton />
			</SpaceDataProvider>,
		);
		document.body.appendChild(container);
	};

	return null;
};

export default PlasmoOverlay;

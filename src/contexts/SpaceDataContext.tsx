import { useStorage } from "@plasmohq/storage/hook";
import type React from "react";
import { createContext, useContext } from "react";
import type { SpaceData } from "../types";

interface SpaceDataContextType {
	spaceData: Record<string, SpaceData>;
	updateSpace: (spaceId: string, data: SpaceData) => void;
	removeSpace: (spaceId: string) => void;
	clearAllData: () => void;
}

const SpaceDataContext = createContext<SpaceDataContextType | undefined>(
	undefined,
);

export const SpaceDataProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [spaceData, setSpaceData] = useStorage<Record<string, SpaceData>>(
		"spaceData",
		{},
	);

	const updateSpace = (spaceId: string, data: SpaceData) => {
		setSpaceData({ ...spaceData, [spaceId]: data });
	};

	const removeSpace = (spaceId: string) => {
		const newData = { ...spaceData };
		delete newData[spaceId];
		setSpaceData(newData);
	};

	const clearAllData = () => {
		setSpaceData({});
	};

	return (
		<SpaceDataContext.Provider
			value={{
				spaceData,
				updateSpace,
				removeSpace,
				clearAllData,
			}}
		>
			{children}
		</SpaceDataContext.Provider>
	);
};

export const useSpaceData = () => {
	const context = useContext(SpaceDataContext);
	if (context === undefined) {
		throw new Error("useSpaceData must be used within a SpaceDataProvider");
	}
	return context;
};

"use client";

import styles from "./components.module.scss";

import { createContext, useEffect, useState } from "react";

import PanelView from "./PanelView";
import Viewport from "./Viewport";

export interface ACGlobalState {
	fullscreenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const ACGlobalStateContext = createContext<ACGlobalState | null>(null);

export default function MainLayout({
	ambianceBrowser,
}: {
	ambianceBrowser: React.ReactNode;
}) {
	const [isFullscreen, setIsFullscreen] = useState(true);

	// TODO: fix
	return (
		<main className={styles.mainLayout}>
			<ACGlobalStateContext.Provider
				value={{ fullscreenState: [isFullscreen, setIsFullscreen] }}
			>
				{isFullscreen ? (
					<Viewport />
				) : (
					<PanelView main={<Viewport />} side={ambianceBrowser} />
				)}
			</ACGlobalStateContext.Provider>
		</main>
	);
}

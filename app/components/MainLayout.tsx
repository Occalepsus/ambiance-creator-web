"use client";

import styles from "./components.module.scss";

import { useEffect, useState } from "react";

import PanelView from "./PanelView";
import Viewport from "./Viewport";

export default function MainLayout({
	ambianceBrowser,
}: {
	ambianceBrowser: React.ReactNode;
}) {
	const [isFullscreen, setIsFullscreen] = useState(true);
	// const [viewport, _] = useState<React.ReactNode>(
	// 	<Viewport
	// 		isFullscreen={isFullscreen}
	// 		setIsFullscreen={setIsFullscreen}
	// 	/>
	// );

	useEffect(() => {
		console.log(isFullscreen);
	}, [isFullscreen]);

	// TODO: fix
	return (
		<main className={styles.mainLayout}>
			{isFullscreen ? (
				<div className={styles.fullscreen}>
					<Viewport
						isFullscreen={isFullscreen}
						setIsFullscreen={setIsFullscreen}
					/>
				</div>
			) : (
				<PanelView
					main={
						<Viewport
							isFullscreen={isFullscreen}
							setIsFullscreen={setIsFullscreen}
						/>
					}
					side={ambianceBrowser}
				/>
			)}
		</main>
	);
}

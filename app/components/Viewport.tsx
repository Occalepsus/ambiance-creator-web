"use client";

import styles from "./components.module.scss";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./ClientSocket";
import { Ambiance } from "@/ambianceManager";

export default function Viewport({
	isFullscreen,
	setIsFullscreen,
	className = "",
}: {
	isFullscreen: boolean;
	setIsFullscreen: (fullscreen: boolean) => void;
	className?: string;
}) {
	const socket = useContext(SocketContext);
	const [displayedAmbiance, setDisplayedAmbiance] = useState<Ambiance | null>(
		null
	);

	useEffect(() => {
		function onAmbianceChange({ ambiance }: { ambiance: Ambiance }) {
			setDisplayedAmbiance(ambiance);
		}

		socket.on("ambiance-change", onAmbianceChange);

		return () => {
			socket.off("ambiance-change", onAmbianceChange);
		};
	}, []);

	return (
		<div className={[styles.viewport, className].join(" ")}>
			{displayedAmbiance === null ? (
				<p>Waiting for ambiance...</p>
			) : (
				<img
					src={displayedAmbiance ? displayedAmbiance.src : ""}
					className={styles.viewportImage}
				/>
			)}
			{/* <button
				onClick={() => {
					setIsFullscreen(!isFullscreen);
				}}
			>
				Show ambiance browser
			</button> */}
		</div>
	);
}

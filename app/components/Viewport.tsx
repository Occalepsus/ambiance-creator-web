// Viewport is a client component so that it can use SocketIO-client to listen for ambiance changes. It displays the ambiance that is currently being shown on the ambiance browser. It also has a button that toggles the ambiance browser's visibility. The ambiance browser is a panel that displays all the ambiances that are available to be shown. The ambiance browser is not implemented in this snippet.
"use client";

import styles from "./components.module.scss";

import { useContext, useEffect, useState } from "react";
import { ACGlobalStateContext } from "./MainLayout";
import { SocketContext } from "./ClientSocket";
import { Ambiance, getCurrentAmbiance } from "@/ambianceManager";

export default function Viewport({ className = "" }: { className?: string }) {
	const { fullscreenState } = useContext(ACGlobalStateContext)!;
	const socket = useContext(SocketContext);

	const [currentAmbiance, setCurrentAmbiance] = useState<Ambiance | null>(
		null
	);

	useEffect(() => {
		// Get the current ambiance from the server
		getCurrentAmbiance().then((ambiance) => {
			setCurrentAmbiance(ambiance);
			// TODO : why is this called twice ?
			console.log("current ambiance : ", ambiance);
		});

		// Listen for ambiance changes
		function onAmbianceChange({ ambiance }: { ambiance: Ambiance }) {
			setCurrentAmbiance(ambiance);
		}
		socket.on("ambiance-change", onAmbianceChange);

		return () => {
			socket.off("ambiance-change", onAmbianceChange);
		};
	}, []);

	return (
		<div
			className={[
				styles.viewport,
				fullscreenState[0] ? styles.fullscreen : "",
				className,
			].join(" ")}
		>
			{currentAmbiance !== null ? (
				<img
					src={currentAmbiance ? currentAmbiance.src : ""}
					className={styles.viewportImage}
				/>
			) : (
				<></>
			)}
			<button
				onClick={() => {
					fullscreenState[1](!fullscreenState[0]);
				}}
			>
				Show ambiance browser
			</button>
		</div>
	);
}

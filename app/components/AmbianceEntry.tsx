"use client";

import styles from "./components.module.scss";

import { useContext } from "react";

import { Ambiance, setCurrentAmbiance } from "@/ambianceManager";
import { SocketContext } from "./ClientSocket";

export default function AmbianceEntry({
	ambiance,
	selectedEntryState,
	className,
}: {
	ambiance: Ambiance;
	selectedEntryState: [Ambiance | null, (ambiance: Ambiance) => void];
	className?: string;
}) {
	const socket = useContext(SocketContext);

	function onEntryClick(event: React.MouseEvent<HTMLElement, MouseEvent>) {
		// If not selected yet, select it
		if (selectedEntryState[0] !== ambiance) {
			selectedEntryState[1](ambiance);
		}

		// On double click, display this ambiance
		if (event.detail === 2) {
			setCurrentAmbiance(ambiance);
			socket.emit("set-displayed-ambiance", { ambiance });
		}

		// Stop the click propagation, so the ambiance browser doesn't unselect the ambiance
		event.stopPropagation();
	}

	return (
		<div
			className={[
				styles.ambianceEntry,
				selectedEntryState[0] === ambiance ? styles.selected : "",
				className,
			].join(" ")}
			onClick={onEntryClick}
		>
			<img
				src={ambiance.src}
				alt="thumbnail"
				className={styles.thumbnail}
			/>
			<span>{ambiance.name}</span>
		</div>
	);
}

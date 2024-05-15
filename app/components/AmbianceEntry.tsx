"use client";

import styles from "./components.module.scss";

import { useContext } from "react";

import { Ambiance } from "@/ambianceManager";
import { SocketContext } from "./ClientSocket";

export default function AmbianceEntry({
	ambiance,
	className,
}: {
	ambiance: Ambiance;
	className?: string;
}) {
	const socket = useContext(SocketContext);

	return (
		<div className={[styles.ambianceEntry, className].join(" ")}>
			<p>{ambiance.name}</p>
			<img
				src={ambiance.src}
				alt="thumbnail"
				className={styles.thumbnail}
			/>
			<button
				onClick={(e) =>
					socket.emit("set-displayed-ambiance", { ambiance })
				}
			>
				{"|>"}
			</button>
		</div>
	);
}

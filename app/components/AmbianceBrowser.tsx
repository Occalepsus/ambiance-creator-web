"use client";

import styles from "./components.module.scss";

import AmbianceEntry from "./AmbianceEntry";
import { Ambiance, getAmbianceList } from "@/ambianceManager";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./ClientSocket";
import FileUploader from "./FileUploader";

export default function AmbianceBrowser({
	className = "",
}: {
	className?: string;
}) {
	const [ambianceList, setAmbianceList] = useState<Ambiance[]>([]);
	const [selectedEntry, setSelectedEntry] = useState<Ambiance | null>(null);

	const socket = useContext(SocketContext);

	useEffect(() => {
		console.log("useEffect");

		// Get the ambiance list from the server
		getAmbianceList().then((list) => {
			setAmbianceList(list);
			// TODO : why is this called twice ?
			console.log("list : ", list);
		});

		// Listen for ambiance list changes
		function onAmbiancesAdd({
			newAmbiances,
		}: {
			newAmbiances: Ambiance[];
		}) {
			setAmbianceList((currentList) => [...currentList, ...newAmbiances]);
		}
		socket.on("ambiances-add", onAmbiancesAdd);

		return () => {
			socket.off("ambiances-add", onAmbiancesAdd);
		};
	}, []);

	// onClick is only called when the click is not on an ambianceEntry element, if it is called, unselect the selected entry
	function onClick(event: React.MouseEvent<HTMLElement, MouseEvent>) {
		setSelectedEntry(null);
	}

	return (
		<>
			<FileUploader />
			<div
				className={[styles.ambianceBrowser, className].join(" ")}
				onClick={onClick}
			>
				{ambianceList.length === 0 ? (
					<p>No ambiance found</p>
				) : (
					<ul className={styles.browserLayout}>
						{ambianceList.map((ambiance, index) => (
							<li key={index}>
								<AmbianceEntry
									ambiance={ambiance}
									selectedEntryState={[
										selectedEntry,
										setSelectedEntry,
									]}
								/>
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
}

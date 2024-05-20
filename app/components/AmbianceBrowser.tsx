"use client";

import styles from "./components.module.scss";

import { Ambiance, getAmbianceList, uploadAmbiances } from "@/ambianceManager";
import { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "./ClientSocket";
import FileUploader from "./FileUploader";
import AmbianceEntry from "./AmbianceEntry";

export default function AmbianceBrowser({
	className = "",
}: {
	className?: string;
}) {
	const [ambianceList, setAmbianceList] = useState<Ambiance[]>([]);
	const itemsRef = useRef<Map<Ambiance, HTMLLIElement>>(null);
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
			setAmbianceList((currentList) =>
				[...currentList, ...newAmbiances].sort((a, b) =>
					a.name.localeCompare(b.name, undefined, {
						numeric: true,
						sensitivity: "base",
					})
				)
			);
			setSelectedEntry(newAmbiances[0]);
		}

		socket.on("ambiances-add", onAmbiancesAdd);

		return () => {
			socket.off("ambiances-add", onAmbiancesAdd);
		};
	}, []);

	useEffect(() => {
		if (selectedEntry) {
			getMap()
				.get(selectedEntry)
				?.scrollIntoView({ behavior: "smooth", block: "nearest" });
		}
	}, [selectedEntry]);

	// onClick is only called when the click is not on an ambianceEntry element, if it is called, unselect the selected entry
	function onClick(event: React.MouseEvent<HTMLElement, MouseEvent>) {
		setSelectedEntry(null);
	}

	function getMap() {
		if (!itemsRef.current) {
			itemsRef.current = new Map();
		}
		return itemsRef.current;
	}

	return (
		<div className={[styles.ambianceBrowser, className].join(" ")}>
			<FileUploader>
				<ol className={styles.ambianceBrowserLayout} onClick={onClick}>
					{ambianceList.map((ambiance, index) => (
						<li
							key={index}
							ref={(node) => {
								const map = getMap();
								if (node) {
									map.set(ambiance, node);
								} else {
									map.delete(ambiance);
								}
							}}
						>
							<AmbianceEntry
								ambiance={ambiance}
								selectedEntryState={[
									selectedEntry,
									setSelectedEntry,
								]}
							/>
						</li>
					))}
				</ol>
			</FileUploader>
		</div>
	);
}

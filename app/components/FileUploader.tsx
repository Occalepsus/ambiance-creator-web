"use client";

import styles from "./components.module.scss";

import { uploadAmbiances } from "@/ambianceManager";
import { useContext } from "react";
import { SocketContext } from "./ClientSocket";

export default function FileUploader({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	const socket = useContext(SocketContext);

	function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
		if (event.target.files === null) return;

		const formData = new FormData();
		Array.from(event.target.files).forEach((file) => {
			formData.append("file", file);
		});

		uploadAmbiances(formData).then((newAmbiances) => {
			socket.emit("ambiances-upload", { newAmbiances });
		});
	}

	// handleFileDrop is called when a file is dropped on the ambianceBrowser, it prevents the default behavior and uploads the files
	function handleFileDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		if (event.dataTransfer.files === null) return;

		const formData = new FormData();
		Array.from(event.dataTransfer.files).forEach((file) => {
			formData.append("file", file);
		});

		uploadAmbiances(formData).then((newAmbiances) => {
			socket.emit("ambiances-upload", { newAmbiances });
		});
	}

	// TODO : implement drag and drop user visual feedback
	return (
		<div
			className={[
				styles.fileUploader,
				styles.fileUploaderDragNDrop,
				className,
			].join(" ")}
			onDrop={handleFileDrop}
			onDragOver={(e) => e.preventDefault()}
		>
			<input
				className={styles.fileUploaderButton}
				type="file"
				accept="image/jpeg, image/png, image/gif"
				name="file"
				multiple
				onChange={handleFileUpload}
			/>
			{children}
		</div>
	);
}

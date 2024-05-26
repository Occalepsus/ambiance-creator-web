"use client";

import styles from "./components.module.scss";

import { addAmbianceFromURL, uploadAmbiances } from "@/ambianceManager";
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

	function handleFromURLSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		// Get the URL from the input
		const URLValue = (event.currentTarget.elements[0] as HTMLInputElement)
			.value;

		// Check URL sanity
		if (!URLValue) {
			console.error("URL is empty.");
		} else {
			// Add ambiance from URL
			addAmbianceFromURL(URLValue).then((newAmbiances) => {
				socket.emit("ambiances-upload", { newAmbiances });
			});
		}
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
			{children}
			<div className={styles.fileUploaderBox}>
				<label
					htmlFor="fileUpload"
					className={styles.fileUploaderButton}
				>
					Upload new files
					<input
						id="fileUpload"
						type="file"
						accept="image/jpeg, image/png, image/gif"
						name="file"
						multiple
						onChange={handleFileUpload}
					/>
				</label>
				<form className={styles.fromURL} onSubmit={handleFromURLSubmit}>
					<input
						type="text"
						name="fromURLInput"
						className={styles.fromURLInput}
						placeholder="Paste image URL here"
					/>
					<button className={styles.fromURLButton} type="submit">
						From URL
					</button>
				</form>
			</div>
		</div>
	);
}

"use client";

import { uploadAmbiances } from "@/ambianceManager";
import { useContext } from "react";
import { SocketContext } from "./ClientSocket";

export default function FileUploader() {
	const socket = useContext(SocketContext);

	function onUploadFile(data: FormData) {
		uploadAmbiances(data).then((newAmbiances) => {
			socket.emit("ambiances-upload", { newAmbiances });
		});
	}

	return (
		<div>
			<form action={onUploadFile}>
				<input type="file" accept="jpg" name="file" />
				<button type="submit">Upload</button>
			</form>
		</div>
	);
}

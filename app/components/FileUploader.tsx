import React from "react";
import { writeFile } from "fs/promises";
import path from "path";
import { addAmbiance, createAmbianceFromName } from "@/ambianceManager";
import { revalidatePath } from "next/cache";

export default function FileUploader() {
	async function uploadFile(data: FormData) {
		"use server";
		const file = data.get("file") as File | undefined;
		if (!file || (file.name === "undefined" && file.size === 0)) {
			return { success: false };
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const filePath = path.join(".", "public", "ambiances", file.name);
		await writeFile(filePath, buffer);
		console.log(`open ${filePath} to see the uploaded file`);

		addAmbiance(createAmbianceFromName(file.name));

		revalidatePath("/AmbianceBrowser");

		return { success: true };
	}

	return (
		<div>
			<form action={uploadFile}>
				<input type="file" accept="jpg" name="file" />
				<button type="submit">Upload</button>
			</form>
		</div>
	);
}

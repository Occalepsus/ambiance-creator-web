"use server";

import { readdir, writeFile } from "fs/promises";
import path from "path";

let ambianceList: Array<Ambiance> = [];
let currentAmbiance: Ambiance | null = null;

export interface Ambiance {
	name: string;
	src: string;
}

export async function createAmbianceFromName(name: string) {
	return {
		name: name,
		src: `/ambiances/${name}`,
	};
}

export async function getCurrentAmbiance() {
	return currentAmbiance;
}

export async function setCurrentAmbiance(ambiance: Ambiance) {
	currentAmbiance = ambiance;
}

export async function getAmbianceList() {
	return ambianceList;
}

export async function uploadAmbiances(data: FormData) {
	// Get fileList from formData, and return early if it is null
	const fileList = data.getAll("file") as Array<File | undefined> | undefined;
	if (!fileList) {
		return [];
	}

	// For each file, if it is valid, upload it to the server
	// and create an Ambiance object to add it to the new ambiances list
	const newAmbiances: Array<Ambiance> = [];
	fileList.forEach((file) => {
		// First check for sanity: file should not be null, undefined, or empty
		if (!file || (file.name === "undefined" && file.size === 0)) {
			console.error("Invalid file:", file);
			return;
		}

		// File should be an image
		if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
			console.error("Invalid file type:", file.name);
			return;
		}

		// File should not already exist in the ambiance list
		if (ambianceList.find((ambiance) => ambiance.name === file.name)) {
			console.error("Ambiance already exists:", file.name);
			return;
		}

		file.arrayBuffer().then((bytes) => {
			const buffer = Buffer.from(bytes);

			const filePath = path.join(".", "public", "ambiances", file.name);
			writeFile(filePath, buffer).then(() => {
				console.log(`${filePath} successfully uploaded to the server.`);
			});

			createAmbianceFromName(file.name).then((newAmbiance) =>
				newAmbiances.push(newAmbiance)
			);
		});
	});

	// Add the new ambiances to the list, and return them
	ambianceList.concat(newAmbiances);
	return newAmbiances;
}

// TODO: add a function to remove ambiance

async function getAmbianceListFromPublicFolder() {
	// Read the ambiances directory and create an Ambiance object for each file
	const ambiancesDir = path.join(".", "public", "ambiances");
	try {
		const files = await readdir(ambiancesDir);
		const ambiances = await Promise.all(
			files.map(async (file) => {
				// Assurez-vous que createAmbianceFromName est une fonction asynchrone qui retourne une promesse
				return createAmbianceFromName(file);
			})
		);
		console.log("Ambiances initialized:", ambiances);

		return ambiances;
	} catch (error) {
		console.error("Error initializing ambiance list:", error);
	}
}

async function generateMockAmbianceList() {
	return [
		await createAmbianceFromName("tftf-2.jpg"),
		await createAmbianceFromName("tftl-18.jpg"),
		await createAmbianceFromName("tftf-19.jpg"),
	];
}

getAmbianceListFromPublicFolder().then((ambiances) => {
	if (ambiances) {
		ambianceList = ambiances;
	} else {
		console.log("No ambiances found in public folder, it can be an error.");
	}
});

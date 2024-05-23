"use server";

import fs from "fs";
import { readdir, writeFile } from "fs/promises";
import path from "path";

let ambianceList: Array<Ambiance> = [];
let currentAmbiance: Ambiance | null = null;

export interface Ambiance {
	name: string;
	src: string;
}

function createAmbianceFromName(name: string) {
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

function sortAmbianceList() {
	ambianceList.sort((a, b) =>
		a.name.localeCompare(b.name, undefined, {
			numeric: true,
			sensitivity: "base",
		})
	);
}

export async function uploadAmbiances(data: FormData) {
	// Get fileList from formData, and return early if it is null
	const fileList = data.getAll("file") as Array<File | undefined> | undefined;
	if (!fileList) {
		return [];
	}

	const ambiancesDir = path.join(".", "public", "ambiances");
	if (!fs.existsSync(ambiancesDir)) {
		fs.mkdirSync(ambiancesDir, { recursive: true });
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

		// Write file on the server
		file.arrayBuffer().then((bytes) => {
			const buffer = Buffer.from(bytes);

			const filePath = path.join(ambiancesDir, file.name);
			writeFile(filePath, buffer).then(() => {
				console.log(`${filePath} successfully uploaded to the server.`);
			});
		});

		// At last, add the new ambiance to the list
		newAmbiances.push(createAmbianceFromName(file.name));
	});

	// Add the new ambiances to the list, and return them
	ambianceList = [...ambianceList, ...newAmbiances];
	sortAmbianceList();
	console.log("Ambiances uploaded:", ambianceList);
	return newAmbiances;
}

// TODO: add a function to remove ambiance

async function getAmbianceListFromPublicFolder() {
	// Read the ambiances directory and create an Ambiance object for each file
	const ambiancesDir = path.join(".", "public", "ambiances");
	if (fs.existsSync(ambiancesDir)) {
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
	} else {
		console.warn("Ambiances directory not found. Can be an error.");
		return null;
	}
}

function generateMockAmbianceList() {
	return [
		createAmbianceFromName("tftf-2.jpg"),
		createAmbianceFromName("tftl-18.jpg"),
		createAmbianceFromName("tftf-19.jpg"),
	];
}

getAmbianceListFromPublicFolder().then((ambiances) => {
	if (ambiances) {
		ambianceList = ambiances;
		sortAmbianceList();
	} else {
		console.log("No ambiances found in public folder, it can be an error.");
	}
});

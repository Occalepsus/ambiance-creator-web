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

function getLocalAmbianceFromName(name: string) {
	return {
		name: name,
		src: `/ambiances/${name}`,
	};
}

function getAmbianceFromSource(src: string) {
	return {
		name: path.basename(src),
		src: src,
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

async function onAmbianceListModified() {
	// Sort list
	ambianceList.sort((a, b) =>
		a.name.localeCompare(b.name, undefined, {
			numeric: true,
			sensitivity: "base",
		})
	);

	// Save list to file
	const dataFilePath = path.join(".", "data", "ambianceList.json");
	const data = JSON.stringify(ambianceList, null, 2);

	// Check if file exists
	if (!fs.existsSync(dataFilePath)) {
		// If file doesn't exist, create it
		fs.writeFileSync(dataFilePath, "", { flag: "wx" });
	}

	// Write to file
	fs.writeFileSync(dataFilePath, data);
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
		newAmbiances.push(getLocalAmbianceFromName(file.name));
	});

	// Add the new ambiances to the list, and return them
	ambianceList = [...ambianceList, ...newAmbiances];
	onAmbianceListModified();
	console.log("Ambiances uploaded:", ambianceList);
	return newAmbiances;
}

export async function addAmbianceFromURL(url: string) {
	// Check for sanity: URL should not be empty
	if (!url) {
		console.error("Invalid URL:", url);
		return [];
	}

	const res = await fetch(url);
	const buff = await res.blob();

	if (!buff.type.startsWith("image/")) {
		console.error("Invalid file type:", buff.type);
		return [];
	}

	// Check if the ambiance already exists
	if (ambianceList.find((ambiance) => ambiance.src === url)) {
		console.error("Ambiance already exists:", url);
		return [];
	}

	// Add the new ambiance to the list
	const newAmbiance = getAmbianceFromSource(url);
	ambianceList.push(newAmbiance);
	onAmbianceListModified();
	console.log("Ambiance added:", newAmbiance);
	return [newAmbiance];
}

// TODO: add a function to remove ambiance

function loadAmbianceList(): Array<Ambiance> | null {
	const dataFilePath = path.join(".", "data", "ambianceList.json");
	if (fs.existsSync(dataFilePath)) {
		const data = fs.readFileSync(dataFilePath, "utf8");
		return JSON.parse(data);
	} else {
		console.warn("Ambiance list data file not found. Can be an error.");
		return null;
	}
}

ambianceList = loadAmbianceList() || [];
console.log("Ambiance list loaded:", ambianceList);

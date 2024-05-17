"use server";

import { writeFile } from "fs/promises";
import path from "path";

let ambianceList: Array<Ambiance>;
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
	const file = data.get("file") as File | undefined;
	if (!file || (file.name === "undefined" && file.size === 0)) {
		return [];
	}

	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	const filePath = path.join(".", "public", "ambiances", file.name);
	await writeFile(filePath, buffer);
	console.log(`open ${filePath} to see the uploaded file`);

	const newAmbiance = await createAmbianceFromName(file.name);

	ambianceList.push(newAmbiance);

	return [newAmbiance];
}

// TODO: add a function to remove ambiance

// TODO : vérifier si j'ai vraiment besoin de socket io pour ça, car je peux juste fetch la liste des ambiances dans un composant server

async function generateMockAmbianceList() {
	return [
		await createAmbianceFromName("tftf-2.jpg"),
		await createAmbianceFromName("tftf-10.jpg"),
		await createAmbianceFromName("tftf-19.jpg"),
	];
}

generateMockAmbianceList().then((list) => {
	ambianceList = list;
});

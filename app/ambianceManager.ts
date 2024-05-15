let ambianceList: Array<Ambiance> = [
	createAmbianceFromName("tftf-2.jpg"),
	createAmbianceFromName("tftf-10.jpg"),
	createAmbianceFromName("tftf-19.jpg"),
];

export interface Ambiance {
	name: string;
	src: string;
}

export function createAmbianceFromName(name: string) {
	return {
		name: name,
		src: `/ambiances/${name}`,
	};
}

export function getAmbianceList() {
	return ambianceList;
}

export async function addAmbiance(ambiance: Ambiance) {
	ambianceList.push(ambiance);
	//serverSocket.emit("list-update", { newList: ambianceList });
}

// TODO: add a function to remove ambiance

// TODO : vérifier si j'ai vraiment besoin de socket io pour ça, car je peux juste fetch la liste des ambiances dans un composant server

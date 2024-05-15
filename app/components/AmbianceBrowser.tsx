import styles from "./components.module.scss";

import AmbianceEntry from "./AmbianceEntry";
import { getAmbianceList } from "@/ambianceManager";
import FileUploader from "./FileUploader";

export default function AmbianceBrowser({
	className = "",
}: {
	className?: string;
}) {
	const ambianceList = getAmbianceList();

	return (
		<>
			<FileUploader />
			<div className={[styles.ambianceBrowser, className].join(" ")}>
				{ambianceList.length === 0 ? (
					<p>No ambiance found</p>
				) : (
					<ul>
						{ambianceList.map((ambiance, index) => (
							<li key={index}>
								<AmbianceEntry ambiance={ambiance} />
							</li>
						))}
					</ul>
				)}
			</div>
		</>
	);
}

import styles from "./page.module.scss";

import "./test.scss";

import ClientSocket from "./components/ClientSocket";
import Viewport from "./components/Viewport";
import AmbianceBrowser from "./components/AmbianceBrowser";
import PanelView from "./components/PanelView";
import FileUploader from "./components/FileUploader";
import MainLayout from "./components/MainLayout";

export default function App() {
	return (
		<body className={styles.ambianceCreator}>
			<ClientSocket debug={false}>
				<MainLayout ambianceBrowser={<AmbianceBrowser />} />
			</ClientSocket>
		</body>
	);
}

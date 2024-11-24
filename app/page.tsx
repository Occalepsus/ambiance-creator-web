import styles from "./page.module.scss";

import ClientSocket from "./components/ClientSocket";
import AmbianceBrowser from "./components/AmbianceBrowser";
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

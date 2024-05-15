"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import styles from "./components.module.scss";

export default function PanelView({
	main,
	side,
}: {
	main: React.ReactNode;
	side: React.ReactNode;
}) {
	return (
		<PanelGroup autoSaveId="root" direction="horizontal">
			<Panel className={styles.panel}>{main}</Panel>
			<ResizeHandle />
			<Panel className={styles.panel}>{side}</Panel>
		</PanelGroup>
	);
}

function ResizeHandle({
	className = "",
	id,
}: {
	className?: string;
	id?: string;
}) {
	return (
		<PanelResizeHandle
			className={[styles.resizeHandle, className].join(" ")}
			id={id}
		>
			<div className={styles.resizeHandleInner}></div>
		</PanelResizeHandle>
	);
}

"use client";

import style from "./components.module.scss";

import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export const SocketContext = createContext<Socket>(io());

export default function ClientSocket({
	debug = false,
	children,
}: {
	debug?: boolean;
	children?: React.ReactNode;
}) {
	const socket = useContext(SocketContext);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [transport, setTransport] = useState<string>("N/A");

	useEffect(() => {
		if (socket.connected) {
			onConnect();
		}

		function onConnect() {
			setIsConnected(true);
			setTransport(socket.io.engine.transport.name);

			socket.io.engine.on("upgrade", (transport) => {
				setTransport(transport.name);
			});
		}

		function onDisconnect() {
			setIsConnected(false);
			setTransport("N/A");
		}

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	return (
		<div className={style.socketContext}>
			<SocketContext.Provider value={socket}>
				{children}
			</SocketContext.Provider>
			{debug && (
				<footer className={style.socketClientDebugFooter}>
					<div className={style.debugFrame}>
						<h1>Socket status</h1>
						<p>
							Status:{" "}
							<span
								className={
									isConnected ? style.success : style.error
								}
							>
								{isConnected ? "connected" : "disconnected"}
							</span>
						</p>
						<p>Transport: {transport}</p>
					</div>
				</footer>
			)}
		</div>
	);
}

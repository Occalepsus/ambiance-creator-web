import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer);

	io.on("connection", (socket) => {
		console.log("Client connected");

		socket.on("disconnect", () => {
			console.log("Client disconnected");
		});

		socket.on("set-displayed-ambiance", (data) => {
			io.emit("ambiance-change", data);
		});

		socket.on("ambiances-upload", (data) => {
			io.emit("ambiances-add", data);
		});
	});

	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});

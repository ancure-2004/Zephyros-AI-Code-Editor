import "dotenv/config";
import http from "http";
import app from "./app.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";

import {Server} from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

io.use(async (socket, next) => {
	try {
		const token =
			socket.handshake.auth?.token ||
			socket.handshake.headers.authorization?.split(" ")[1];
		const projectId = socket.handshake.query?.projectId;

		if (
			!projectId ||
			typeof projectId !== "string" ||
			!mongoose.Types.ObjectId.isValid(projectId)
		) {
			return next(new Error("Invalid Project ID"));
		}

		socket.project = await projectModel.findById(projectId);

		if (!token) {
			return next(new Error("Authentication Error"));
		}

		const user = jwt.verify(token, process.env.JWT_SECRET);

		if (!user) {
			return next(new Error("Authentication Error"));
		}

		socket.user = user;

		next();
	} catch (error) {
		next(error);
	}
});

io.on("connection", (socket) => {
	socket.roomId = socket.project._id.toString();

	console.log("a user connected");

	socket.join(socket.roomId);

	socket.on("project-message", (data) => {
		// console.log('message: ', data);
		socket.broadcast.to(socket.roomId).emit("project-message", data);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
		socket.leave(socket.roomId);
	});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

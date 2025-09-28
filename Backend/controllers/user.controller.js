import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import {validationResult} from "express-validator";
import redisClient from "../services/redis.service.js";
import { oauth2Client } from "../services/user.service.js";
import axios from "axios";
import jwt from "jsonwebtoken";

export const createUserController = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()});
	}

	try {
		const user = await userService.createUser(req.body);

		const token = user.generateAuthToken();

		delete user._doc.password;

		return res.status(201).json({user, token});
	} catch (error) {
		return res.status(500).json({error: error.message});
	}
};

export const loginController = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()});
	}

	try {
		const {email, password} = req.body;
		const user = await userModel.findOne({email}).select("+password");

		if (!user) {
			return res.status(401).json({error: "Invalid email"});
		}

		const isValidPassword = await user.isValidPassword(password);
		if (!isValidPassword) {
			return res.status(401).json({error: "Invalid password"});
		}

		const token = user.generateAuthToken();

		delete user._doc.password;

		return res.status(200).json({user, token});
	} catch (error) {
		return res.status(400).json({error: error.message});
	}
};

export const googleAuthURL = async (req, res) => {
	try {
		const authUrl = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: [
				'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/userinfo.email'
			],
			include_granted_scopes: true,
		});
		
		res.json({ authUrl });
	} catch (error) {
		return res.status(500).json({error: error.message});
	}
};

export const googleCallback = async (req, res) => {
	const { code } = req.query;
	
	try {
		const { tokens } = await oauth2Client.getToken(code);
		oauth2Client.setCredentials(tokens);
		
		const userRes = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
		);

		const { email, name } = userRes.data;
		let user = await userModel.findOne({ email });

		if (!user) {
			const nameParts = name.trim().split(" ");
			const firstName = nameParts[0];
			const lastName = nameParts.slice(1).join(" ") || "";
			user = await userModel.create({
				name: {
					firstName,
					lastName
				},
				email,
			});
		}

		const { _id } = user;
		const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
			expiresIn: "15d",
		});

		// Redirect to frontend with token
		const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
		res.redirect(`${frontendURL}/auth/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
		
	} catch (err) {
		const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
		res.redirect(`${frontendURL}/auth/error?error=${encodeURIComponent(err.message)}`);
	}
};

export const googleLogin = async (req, res) => {

	const {code} = req.body;

	try {
		const googleRes = await oauth2Client.getToken(code);

		oauth2Client.setCredentials(googleRes.tokens);
		const userRes = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
		);

		const {email, name} = userRes.data;
		// console.log(userRes);
		let user = await userModel.findOne({email});

		if (!user) {
			const nameParts = name.trim().split(" ");
			const firstName = nameParts[0];
			const lastName = nameParts.slice(1).join(" ") || "";
			user = await userModel.create({
				name : {
					firstName,
					lastName
				},
				email,
			});
		}
		const {_id} = user;
		const token = jwt.sign({_id, email}, process.env.JWT_SECRET, {
			expiresIn: "15d",
		});
		res.status(200).json({
			message: "success",
			token,
			user,
		});
	} catch (err) {
		return res.status(500).json({error: err.message});
	}
};

export const getUserProfile = async (req, res) => {
	console.log(req.user);
	res.status(200).json({user: req.user});
};

export const logoutController = async (req, res) => {
	try {
		const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({error: "Access denied. No token provided."});
		}

		await redisClient.set(token, "logout", "EX", 60 * 60 * 24);

		return res.status(200).json({message: "Logged out successfully"});
	} catch (error) {
		console.log(error);
		return res.status(500).json({error: error.message});
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const loggedInUser = await userModel.findOne({email: req.user.email});
		const userId = loggedInUser._id;

		const users = await userService.getAllUsers({userId});

		return res.status(200).json({users: users});
	} catch (error) {
		console.error(error);
		return res.status(500).json({error: error.message});
	}
};

import React, {useState, useContext} from "react";
import {Github, ArrowLeft} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import axios from "../config/axios";
import {UserContext} from "../context/user.context";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const navigate = useNavigate();
	const {setUser} = useContext(UserContext);

	function submitHandler(e) {
		e.preventDefault();
		axios
			.post("/users/register", {
				name:{
					firstName: firstname,
					lastName: lastname
				},
				email,
				password
			})
			.then((res) => {
				localStorage.setItem("token", res.data.token);
				setUser(res.data.user);
				console.log(res.data.user);
				navigate("/projects");
			})
			.catch((err) => console.log(err));
	}

	return (
		<div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
			{/* Left Side - Form */}
			<div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-20 py-10 md:py-0 relative">
				{/* Back Button */}
				<Link
					to="/"
					className="absolute top-4 left-4 flex items-center text-gray-400 hover:text-white transition-colors duration-300 group"
				>
					<ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
					<span className="text-sm md:text-base">Back</span>
				</Link>

				{/* Header */}
				<div className="mb-6 animate-fade-in">
					<div className="flex items-center mb-3">
						<img
							src="./logo.png"
							alt="Zephyros Logo"
							className="h-8 w-20 mr-2"
						/>
					</div>
					<h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome!</h1>
				</div>

				{/* Social Login */}
				<div className="space-y-3 md:space-y-2.5 mb-4 animate-slide-up">
					<button className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-700 rounded-lg hover:bg-gray-900 transition-all duration-300 hover:scale-105 text-sm">
						<svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Log in with Google
					</button>

					<button className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-700 rounded-lg hover:bg-gray-900 transition-all duration-300 hover:scale-105 text-sm">
						<Github className="w-4 h-4 mr-2.5" />
						Log in with GitHub
					</button>
				</div>

				<div className="flex items-center mb-4">
					<div className="flex-1 border-t border-gray-700"></div>
					<span className="px-1 text-gray-500 text-xs">OR</span>
					<div className="flex-1 border-t border-gray-700"></div>
				</div>

				{/* Form */}
				<form onSubmit={submitHandler} className="space-y-3">
					<div className="flex flex-col md:flex-row gap-2">
						<input
							type="text"
							value={firstname}
							onChange={(e) => setFirstname(e.target.value)}
							placeholder="First Name"
							className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-500 text-sm"
						/>
						<input
							type="text"
							value={lastname}
							onChange={(e) => setLastname(e.target.value)}
							placeholder="Last Name"
							className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-500 text-sm"
						/>
					</div>

					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-500 text-sm"
					/>

					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-500 pr-10 text-sm"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
						>
							{showPassword ? <span>🙈</span> : <span>👁️</span>}
						</button>
					</div>

					<button
						type="submit"
						className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 transform hover:shadow-lg hover:shadow-purple-600/25 text-sm"
					>
						Create Account
					</button>
				</form>

				<p className="text-center text-gray-400 text-xs mt-3">
					Already have an account?{" "}
					<a href="/login" className="text-purple-400 hover:text-purple-300">
						Login
					</a>
				</p>
			</div>

			{/* Right Side - Image */}
			<div className="hidden md:block w-1/2 relative">
				<img
					src="./fc1e4bf3b1d22fd8416cbd243247f619.jpg"
					alt="Login Illustration"
					className="w-full h-full object-cover"
				/>
			</div>
			<style jsx>{`
@keyframes fadeIn {
from { opacity: 0; }
to { opacity: 1; }
}

@keyframes slideUp {
from { 
opacity: 0; 
transform: translateY(20px); 
}
to { 
opacity: 1; 
transform: translateY(0); 
}
}

@keyframes fadeInDelayed {
0% { opacity: 0; }
50% { opacity: 0; }
100% { opacity: 1; }
}

.animate-fade-in {
animation: fadeIn 0.8s ease-out;
}

.animate-slide-up {
animation: slideUp 0.8s ease-out 0.3s both;
}

.animate-fade-in-delayed {
animation: fadeInDelayed 1.5s ease-out;
}
`}</style>
		</div>
	);
}

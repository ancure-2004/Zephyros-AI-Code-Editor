import React, {useState, useContext} from "react";
import {Github, ArrowLeft, Eye, EyeOff} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import axios from "../config/axios";
import {UserContext} from "../context/user.context";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();
	const {setUser} = useContext(UserContext);

	function submitHandler(e) {
		e.preventDefault();
		axios
			.post("/users/login", {email, password})
			.then((res) => {
				localStorage.setItem("token", res.data.token);
				setUser(res.data.user);
				navigate("/projects");
			})
			.catch((err) => console.log(err.response?.data));
	}

	return (
		<div
			className="h-screen bg-gray-950 text-[#cccccc] flex overflow-hidden animate-fadeIn"
			style={{
				background: `linear-gradient(135deg, rgb(5, 7, 25) 0%, rgb(0, 0, 0) 100%)`,
			}}
		>
			{/* Left Side - Form */}
			<div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 relative h-screen animate-slideInLeft">
				{/* Back Button */}
				<Link
					to="/"
					className="absolute top-4 left-4 flex items-center text-[#858585] hover:text-[#cccccc] transition-all duration-300 group animate-fadeInDown"
				>
					<ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
					<span className="text-sm">Back</span>
				</Link>

				{/* Header */}
				<div className="max-w-xs mx-auto w-full">
					<div className="mb-4 animate-slideUp">
						<div className="flex items-center mb-2">
							<img src="./logo.png" alt="Zephyros Logo" className="h-5 w-14 animate-pulse" />
						</div>
						<h1 className="text-lg font-bold text-[#cccccc] mb-1 animate-slideUp" style={{animationDelay: '0.1s'}}>
							Welcome Back
						</h1>
						<p className="text-[#858585] text-xs animate-slideUp" style={{animationDelay: '0.2s'}}>Sign in to continue coding</p>
					</div>

					{/* Social Buttons */}
					<div className="space-y-2 mb-3 animate-slideUp" style={{animationDelay: '0.3s'}}>
						<button className="w-full flex items-center justify-center px-3 py-2 bg-[#37373d] hover:bg-[#464647] border border-[#3c3c3c] rounded text-xs text-[#cccccc] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transform">
							<svg className="w-3 h-3 mr-2" viewBox="0 0 24 24">
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
							Google
						</button>
						<button className="w-full flex items-center justify-center px-3 py-2 bg-[#37373d] hover:bg-[#464647] border border-[#3c3c3c] rounded text-xs text-[#cccccc] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transform">
							<Github className="w-3 h-3 mr-2" />
							GitHub
						</button>
					</div>

					{/* Divider */}
					<div className="flex items-center mb-3 animate-slideUp" style={{animationDelay: '0.4s'}}>
						<div className="flex-1 border-t border-[#3c3c3c]"></div>
						<span className="px-3 text-[#858585] text-xs">or</span>
						<div className="flex-1 border-t border-[#3c3c3c]"></div>
					</div>

					{/* Form */}
					<form onSubmit={submitHandler} className="space-y-3 animate-slideUp" style={{animationDelay: '0.5s'}}>
						<div className="transform transition-all duration-300 hover:translate-y-[-2px]">
							<label className="block text-xs font-medium text-[#cccccc] mb-1.5">
								Email
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#464647] rounded text-[#cccccc] placeholder-[#858585] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs transition-all duration-300 focus:scale-105 focus:shadow-lg focus:shadow-blue-500/20"
							/>
						</div>

						<div className="transform transition-all duration-300 hover:translate-y-[-2px]">
							<label className="block text-xs font-medium text-[#cccccc] mb-1.5">
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your password"
									className="w-full px-3 py-2 bg-[#3c3c3c] border border-[#464647] rounded text-[#cccccc] placeholder-[#858585] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-9 text-xs transition-all duration-300 focus:scale-105 focus:shadow-lg focus:shadow-blue-500/20"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[#858585] hover:text-[#cccccc] transition-all duration-300 hover:scale-110"
								>
									{showPassword ? (
										<EyeOff className="w-3 h-3" />
									) : (
										<Eye className="w-3 h-3" />
									)}
								</button>
							</div>
						</div>

						<button
							type="submit"
							className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-all duration-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 transform hover:scale-105 hover:shadow-lg hover:shadow-gray-500/30 active:scale-95"
						>
							Sign In
						</button>
					</form>

					{/* Footer */}
					<div className="mt-4 text-center animate-slideUp" style={{animationDelay: '0.6s'}}>
						<p className="text-[#858585] text-xs">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-300 hover:underline"
							>
								Create one
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/* Right Side - Image */}
			<div className="hidden lg:block w-1/2 relative animate-slideInRight">
				<img
					src="./login_banner.jpg"
					alt="Login Illustration"
					className="w-screen h-screen object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/20 animate-fadeIn" style={{animationDelay: '0.8s'}}></div>
			</div>

			<style jsx>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}

				@keyframes slideInLeft {
					from { 
						opacity: 0;
						transform: translateX(-50px);
					}
					to { 
						opacity: 1;
						transform: translateX(0);
					}
				}

				@keyframes slideInRight {
					from { 
						opacity: 0;
						transform: translateX(50px);
					}
					to { 
						opacity: 1;
						transform: translateX(0);
					}
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

				@keyframes fadeInDown {
					from { 
						opacity: 0;
						transform: translateY(-20px);
					}
					to { 
						opacity: 1;
						transform: translateY(0);
					}
				}

				.animate-fadeIn {
					animation: fadeIn 1s ease-out;
				}

				.animate-slideInLeft {
					animation: slideInLeft 0.8s ease-out;
				}

				.animate-slideInRight {
					animation: slideInRight 0.8s ease-out;
				}

				.animate-slideUp {
					animation: slideUp 0.6s ease-out both;
				}

				.animate-fadeInDown {
					animation: fadeInDown 0.6s ease-out;
				}

				.animate-pulse {
					animation: pulse 2s infinite;
				}

				@keyframes pulse {
					0%, 100% { opacity: 1; }
					50% { opacity: 0.7; }
				}
			`}</style>
		</div>
	);
}
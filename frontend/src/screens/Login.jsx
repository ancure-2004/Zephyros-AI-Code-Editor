import React, {useState, useContext} from "react";
import {Github, ArrowLeft} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from '../context/user.context'

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const { setUser } = useContext(UserContext);

	function submitHandler(e) {
		
		e.preventDefault();

		axios
			.post("/users/login", {
				email,
				password,
			})
			.then((res) => {
				console.log(res.data);
				localStorage.setItem('token', res.data.token)
				setUser(res.data.user)
				navigate("/");
			})
			.catch((err) => {
				console.log(err.response.data);
			});
	}

	return (
		<div className="min-h-screen bg-black text-white flex">
			{/* Left Side - Login Form */}
			<div className="w-1/2 flex flex-col justify-center px-25 relative">
				{/* Back Button */}
				<Link
					to="/"
					className="absolute top-4 right-8 flex items-center text-gray-400 hover:text-white transition-colors duration-300 group"
				>
					<ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
					<span>Back</span>
				</Link>

				{/* Header */}
				<div className="mb-4 animate-fade-in">
					<div className="flex items-center mb-3">
						<img
							src="./logo.png"
							alt="Zephyros Logo"
							className=" h-8 w-20 mr-2"
						/>
					</div>

					<h1 className="text-3xl font-bold mb-1">Welcome!</h1>
				</div>

				{/* Login Form */}
				<div className="space-y-4 animate-slide-up">
					{/* Social Login Buttons */}
					<div className="space-y-2.5">
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

					<div className="flex items-center">
						<div className="flex-1 border-t border-gray-700"></div>
						<span className="px-1 text-gray-500 text-xs">OR</span>
						<div className="flex-1 border-t border-gray-700"></div>
					</div>

					<form onSubmit={submitHandler}>
						{/* Email Input */}
						<div className="mt-2">
							<label className="block text-xs font-medium mb-1">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Your email address"
								className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-sm"
							/>
						</div>

						{/* Password Input */}
						<div className="mt-2">
							<div className="flex justify-between items-center mb-1">
								<label className="block text-xs font-medium">Password</label>
								<a
									href="#"
									className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
								>
									Forgot password?
								</a>
							</div>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Your password"
									className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-300 placeholder-gray-500 pr-10 text-sm"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
								>
									{showPassword ? (
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
											/>
										</svg>
									) : (
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>
						{/* Login Button */}
						<button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 transform hover:shadow-lg hover:shadow-purple-600/25 text-sm">
							Login
						</button>
					</form>

					{/* Sign Up Link */}
					<p className="text-center text-gray-400 text-s">
						Don't have an account?{" "}
						<a
							href="/register"
							className="text-purple-400 hover:text-purple-300 transition-colors"
						>
							Sign Up
						</a>
					</p>
				</div>
			</div>

			{/* Right Side - Image Space */}
			<div className="w-1/2 relative h-screen bg-white overflow-hidden">
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

import React, {useState, useEffect} from "react";
import {
	MessageSquare,
	Bot,
	Server,
	Code,
	Users,
	Zap,
	ArrowRight,
	Github,
	Play,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ZephyrosHome() {
	const [scrollY, setScrollY] = useState(0);
	const [isVisible, setIsVisible] = useState({
		feature1: false,
		feature2: false,
		feature3: false,
	});

	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);

			// Check visibility of features
			const feature1 = document.getElementById("feature1");
			const feature2 = document.getElementById("feature2");
			const feature3 = document.getElementById("feature3");

			if (feature1) {
				const rect1 = feature1.getBoundingClientRect();
				if (rect1.top < window.innerHeight * 0.8) {
					setIsVisible((prev) => ({...prev, feature1: true}));
				}
			}

			if (feature2) {
				const rect2 = feature2.getBoundingClientRect();
				if (rect2.top < window.innerHeight * 0.8) {
					setIsVisible((prev) => ({...prev, feature2: true}));
				}
			}

			if (feature3) {
				const rect3 = feature3.getBoundingClientRect();
				if (rect3.top < window.innerHeight * 0.8) {
					setIsVisible((prev) => ({...prev, feature3: true}));
				}
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="min-h-screen bg-black text-white relative overflow-hidden">
			{/* Animated background particles */}
			<div className="fixed inset-0 z-0">
				{[...Array(50)].map((_, i) => (
					<div
						key={i}
						className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20 animate-pulse"
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 3}s`,
							animationDuration: `${3 + Math.random() * 2}s`,
						}}
					/>
				))}
			</div>

			{/* Navigation */}
			<nav
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					scrollY > 50
						? "bg-black/80 backdrop-blur-xl border-b border-purple-500/20"
						: "bg-transparent"
				}`}
			>
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
							ZEPHYROS
						</div>
						<div className="hidden md:flex items-center space-x-8">
							<a
								href="/"
								className="hover:text-purple-400 transition-colors duration-300"
							>
								Home
							</a>
							<a
								href="#"
								className="hover:text-purple-400 transition-colors duration-300"
							>
								Projects
							</a>
							<Link to="/login" className="px-4 py-2 text-purple-400 border border-purple-400 rounded-lg hover:bg-purple-400 hover:text-white transition-all duration-300">
								Login
							</Link>
							<Link to="/register" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
								Sign Up
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section
				id="home"
				className="relative min-h-screen flex items-center justify-center px-6"
			>
				<div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20"></div>

				{/* Floating geometric shape */}
				<div
					className="absolute top-1/4 right-1/4 w-64 h-64 opacity-20"
					style={{
						transform: `translateY(${scrollY * 0.2}px) rotate(${
							scrollY * 0.1
						}deg)`,
					}}
				>
					<div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
				</div>

				<div className="relative z-10 text-center max-w-4xl mx-auto">
					<div className="mb-6 animate-fadeInUp">
						<h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
							ZEPHYROS
						</h1>
						<p
							className="text-xl md:text-2xl text-gray-300 mb-8 animate-fadeInUp"
							style={{animationDelay: "0.2s"}}
						>
							CODE TOGETHER, BUILD FASTER
						</p>
						<p
							className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-fadeInUp"
							style={{animationDelay: "0.4s"}}
						>
							The ultimate collaborative development platform with real-time
							coding, AI assistance, and instant deployment
						</p>
					</div>

					<Link
                        to="/register"
						className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 animate-fadeInUp"
						style={{animationDelay: "0.6s"}}
					>
						GET STARTED
						<ArrowRight
							className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300"
							size={20}
						/>
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 px-6 relative">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-20">
						<h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
							Powerful Features
						</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Everything you need to build amazing projects together
						</p>
					</div>

					{/* Feature 1: Collaborative Chat & Real-time Coding */}
					<div
						id="feature1"
						className={`mb-32 transition-all duration-1000 ${
							isVisible.feature1
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-20"
						}`}
					>
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div>
								<div className="flex items-center mb-6">
									<div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl mr-4">
										<MessageSquare size={24} />
									</div>
									<h3 className="text-3xl font-bold">
										Collaborative Chat & Real-time Coding
									</h3>
								</div>
								<p className="text-lg text-gray-300 mb-6">
									Code together seamlessly with integrated chat. See changes
									instantly as your team types, discuss ideas in context, and
									build faster than ever before.
								</p>
								<div className="flex items-center space-x-4">
									<div className="flex items-center text-green-400">
										<Users size={16} className="mr-2" />
										Live collaboration
									</div>
									<div className="flex items-center text-blue-400">
										<Code size={16} className="mr-2" />
										Real-time sync
									</div>
								</div>
							</div>
							<div className="relative">
								<div className="bg-gray-900 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
									<div className="bg-gray-800 rounded-lg p-4 mb-4">
										<div className="flex items-center space-x-2 mb-3">
											<div className="w-3 h-3 bg-red-500 rounded-full"></div>
											<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
											<div className="w-3 h-3 bg-green-500 rounded-full"></div>
										</div>
										<div className="space-y-2 text-sm">
											<div className="text-purple-400">
												function createApp() {"{"}
											</div>
											<div className="text-white ml-4">
												return &lt;div&gt;Hello World&lt;/div&gt;
											</div>
											<div className="text-purple-400">{"}"}</div>
										</div>
									</div>
									<div className="bg-gray-800 rounded-lg p-4">
										<div className="flex items-center space-x-2 mb-2">
											<div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs">
												A
											</div>
											<span className="text-sm text-gray-300">
												Alice is typing...
											</span>
										</div>
										<div className="text-sm text-gray-400">
											Great progress on the UI!
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Feature 2: AI Assistant */}
					<div
						id="feature2"
						className={`mb-32 transition-all duration-1000 ${
							isVisible.feature2
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-20"
						}`}
					>
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div className="order-2 md:order-1">
								<div className="bg-gray-900 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
									<div className="bg-gray-800 rounded-lg p-4">
										<div className="flex items-center space-x-2 mb-4">
											<MessageSquare size={16} className="text-purple-400" />
											<span className="text-sm text-gray-300">Team Chat</span>
										</div>
										<div className="space-y-3">
											<div className="bg-gray-700 rounded-lg p-3">
												<div className="text-sm">
													@ai help me optimize this React component
												</div>
											</div>
											<div className="bg-purple-600 rounded-lg p-3">
												<div className="flex items-center space-x-2 mb-2">
													<Bot size={16} />
													<span className="text-sm font-semibold">
														AI Assistant
													</span>
												</div>
												<div className="text-sm">
													I can help you optimize that! Here are 3 ways to
													improve performance...
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="order-1 md:order-2">
								<div className="flex items-center mb-6">
									<div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mr-4">
										<Bot size={24} />
									</div>
									<h3 className="text-3xl font-bold">
										AI Assistant with @ Commands
									</h3>
								</div>
								<p className="text-lg text-gray-300 mb-6">
									Get instant help from our AI assistant directly in your chat.
									Just type @ and ask for code reviews, bug fixes, optimization
									tips, or implementation guidance.
								</p>
								<div className="flex items-center space-x-4">
									<div className="flex items-center text-blue-400">
										<Zap size={16} className="mr-2" />
										Instant responses
									</div>
									<div className="flex items-center text-purple-400">
										<Bot size={16} className="mr-2" />
										Smart suggestions
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Feature 3: Web-based Server */}
					<div
						id="feature3"
						className={`mb-20 transition-all duration-1000 ${
							isVisible.feature3
								? "opacity-100 translate-y-0"
								: "opacity-0 translate-y-20"
						}`}
					>
						<div className="grid md:grid-cols-2 gap-12 items-center">
							<div>
								<div className="flex items-center mb-6">
									<div className="p-3 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl mr-4">
										<Server size={24} />
									</div>
									<h3 className="text-3xl font-bold">
										Run Servers Directly in Browser
									</h3>
								</div>
								<p className="text-lg text-gray-300 mb-6">
									No more complex setup or local installations. Run your backend
									servers, databases, and full-stack applications directly in
									the browser with instant deployment.
								</p>
								<div className="flex items-center space-x-4">
									<div className="flex items-center text-green-400">
										<Play size={16} className="mr-2" />
										Instant deployment
									</div>
									<div className="flex items-center text-blue-400">
										<Server size={16} className="mr-2" />
										Browser-based
									</div>
								</div>
							</div>
							<div className="relative">
								<div className="bg-gray-900 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
									<div className="bg-gray-800 rounded-lg p-4 mb-4">
										<div className="flex items-center justify-between mb-3">
											<span className="text-sm text-gray-300">Terminal</span>
											<div className="flex space-x-1">
												<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
												<span className="text-xs text-green-400">Running</span>
											</div>
										</div>
										<div className="space-y-1 text-sm font-mono">
											<div className="text-green-400">$ npm start</div>
											<div className="text-gray-400">
												Server running on port 3000
											</div>
											<div className="text-blue-400">→ localhost:3000</div>
										</div>
									</div>
									<div className="bg-gray-800 rounded-lg p-4">
										<div className="text-sm text-gray-300 mb-2">
											Live Preview
										</div>
										<div className="bg-white rounded p-3 text-black text-xs">
											<div className="border-b pb-2 mb-2">
												Your App is Live! 🎉
											</div>
											<div className="text-gray-600">
												Access your server from anywhere
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 px-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-4xl md:text-5xl font-bold mb-6">
						Ready to Transform Your Development?
					</h2>
					<p className="text-xl text-gray-300 mb-8">
						Join thousands of developers building the future with Zephyros
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
							Start Building Free
						</button>
						<button className="px-8 py-4 border border-purple-400 rounded-full text-lg font-semibold text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300">
							View Demo
						</button>
					</div>
				</div>
			</section>

			<style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
		</div>
	);
}

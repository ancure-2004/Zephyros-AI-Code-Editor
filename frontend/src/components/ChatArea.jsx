import React, {useState, useContext, useRef, useEffect} from "react";
import {UserContext} from "../context/user.context";

const ChatArea = ({
	project,
	messages,
	message,
	setMessage,
	messageBox,
	writeAImessage,
	send,
	users,
	handleUserClick,
	addCollaborators,
	selectedUserId,
	setIsModalOpen,
	isModalOpen
}) => {
	
	const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
	const [isAITyping, setIsAITyping] = useState(false);
	const [aiTypingStage, setAITypingStage] = useState(''); // 'typing', 'thinking', 'generating'

	const {user} = useContext(UserContext);
	const inputRef = useRef(null);
	const typingTimeoutRef = useRef(null);

	// Focus input when Tab is pressed anywhere on the page
	useEffect(() => {
		const handleTab = (e) => {
			if (e.key === "Tab") {
				e.preventDefault();
				inputRef.current.focus();
			}
		};

		window.addEventListener("keydown", handleTab);
		return () => window.removeEventListener("keydown", handleTab);
	}, []);

	// Auto scroll to bottom when messages change
	useEffect(() => {
		if (messageBox.current) {
			messageBox.current.scrollTop = messageBox.current.scrollHeight;
		}
	}, [messages, isAITyping]);

	// Enhanced AI typing simulation - WhatsApp style
	// Show only when message starts with "@ai"
	useEffect(() => {
		const lastMessage = messages[messages.length - 1];
		
		// Check if we should show AI typing:
		// 1. There is a last message
		// 2. The last message is NOT from AI (to avoid showing typing after AI responds)
		// 3. The message starts with "@ai" (case insensitive)
		// 4. We're not already showing typing indicator
		if (
			lastMessage &&
			lastMessage.sender._id !== "ai" &&
			lastMessage.message.toLowerCase().startsWith('@ai') &&
			!isAITyping // Prevent multiple triggers
		) {
			// Clear any existing timeout
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			// Start the typing sequence
			setIsAITyping(true);
			setAITypingStage('thinking');

			// Stage 1: AI is thinking (1-2 seconds)
			typingTimeoutRef.current = setTimeout(() => {
				setAITypingStage('typing');
				
				// Stage 2: AI is typing (2-4 seconds)
				typingTimeoutRef.current = setTimeout(() => {
					setAITypingStage('generating');
					
					// Stage 3: AI is generating response (1-2 seconds)
					typingTimeoutRef.current = setTimeout(() => {
						setIsAITyping(false);
						setAITypingStage('');
					}, 1500);
				}, 3000);
			}, 1500);
		}

		// Cleanup timeout on unmount
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, [messages, isAITyping]);

	// Stop typing when AI message actually arrives
	useEffect(() => {
		const lastMessage = messages[messages.length - 1];
		if (lastMessage && lastMessage.sender._id === "ai") {
			setIsAITyping(false);
			setAITypingStage('');
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		}
	}, [messages]);

	const renderMessage = (msg) => {
		if (msg.sender._id === "ai") {
			return writeAImessage(msg.message);
		}
		return <p className="text-white leading-relaxed">{msg.message}</p>;
	};

	const getInitials = (name) => {
		return name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	// WhatsApp-style typing indicator text
	const getTypingText = () => {
		switch (aiTypingStage) {
			case 'thinking':
				return 'thinking...';
			case 'typing':
				return 'typing...';
			case 'generating':
				return 'generating response...';
			default:
				return 'typing...';
		}
	};

	// Enhanced WhatsApp-style typing dots
	const renderTypingDots = () => {
		if (aiTypingStage === 'thinking') {
			return (
				<div className="flex gap-1 items-center">
					<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
					<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
					<div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
				</div>
			);
		}
		
		return (
			<div className="flex gap-1">
				<div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
				<div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
				<div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
			</div>
		);
	};

	return (
		<div className="flex flex-col h-screen bg-gray-900 text-white relative">
			{/* Header */}
			<header className="flex justify-between items-center px-4 py-2 bg-gray-900 border-b border-gray-800 absolute top-0 w-full z-10">
				<div className="flex justify-between items-center w-full">
					<button
						className="group cursor-pointer relative bg-gradient-to-r from-gray-950 to-gray-940 hover:from-gray-900 hover:to-gray-800 text-white py-3 px-2 rounded-lg font-mono transition-all duration-300 flex items-center gap-1 border border-gray-800 text-sm"
						onClick={() => setIsModalOpen(true)}
					>
						<i className="ri-add-fill"></i>
						<span className="hidden md:block">Add collaborator</span>
						<div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
					</button>
					<div className="flex flex-col">
						<p className="text-xs text-gray-500 font-mono">
							{project?.users?.length || 0} members
						</p>
						<button
							onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
							className="p-2 cursor-pointer bg-gradient-to-r from-gray-950 to-gray-900 hover:from-gray-900 hover:to-gray-800 rounded-lg transition-colors border border-gray-800"
						>
							<i className="ri-group-fill text-xl"></i>
						</button>
					</div>
				</div>
			</header>

			{/* Chat Area */}
			<div className="conversation-area pt-16 pb-10 flex-grow flex flex-col h-full relative">
				<div
					ref={messageBox}
					className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
				>
					<div className="flex flex-col gap-4 max-w-4xl mx-auto p-4 w-full">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`flex ${
									msg.sender._id == user._id.toString()
										? "justify-end"
										: "justify-start"
								}`}
							>
								<div
									className={`${
										msg.sender._id === "ai" ? "max-w-80" : "max-w-52"
									} ${msg.sender._id == user._id.toString() && "ml-auto"}`}
								>
									{msg.sender._id !== user._id.toString() && (
										<div className="flex items-center gap-2 mb-1">
											<div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-950 to-gray-900 flex items-center justify-center text-xs font-semibold text-white">
												{msg.sender._id === "ai"
													? "AI"
													: getInitials(msg.sender.email)}
											</div>
											<small className="opacity-65 text-xs text-gray-500 font-mono">
												{msg.sender._id === "ai" ? "AI Assistant" : msg.sender.email}
											</small>
										</div>
									)}
									<div
										className={`message flex flex-col p-2 w-fit rounded-md ${
											msg.sender._id == user._id.toString()
												? "bg-gray-950 text-white rounded-br-md ml-auto"
												: "bg-gray-950 text-white rounded-bl-md border border-gray-800"
										}`}
									>
										<div className="text-sm">{renderMessage(msg)}</div>
									</div>
								</div>
							</div>
						))}

						{/* Enhanced WhatsApp-style Typing Indicator */}
						{isAITyping && (
							<div className="flex justify-start animate-fadeIn">
								<div className="max-w-xs">
									<div className="flex items-center gap-2 mb-1">
										<div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white">
											<i className="ri-robot-fill"></i>
										</div>
										<small className="opacity-65 text-xs text-blue-400 font-mono animate-pulse">
											AI {getTypingText()}
										</small>
									</div>
									<div className="bg-gray-900 border border-gray-700 p-3 rounded-md rounded-bl-md shadow-lg">
										<div className="flex items-center gap-2">
											{renderTypingDots()}
											{aiTypingStage === 'thinking' && (
												<i className="ri-brain-fill text-blue-400 text-sm animate-pulse ml-2"></i>
											)}
											{aiTypingStage === 'generating' && (
												<i className="ri-magic-fill text-purple-400 text-sm animate-spin ml-2"></i>
											)}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="inputField w-full flex absolute bottom-0">
					<input
						ref={inputRef}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								if (message && message.trim()) {
									send();
								}
							}
						}}
						className="p-2 px-4 border-none outline-none flex-grow bg-gray-950 text-white font-mono placeholder-gray-500 border-t border-gray-800"
						type="text"
						placeholder={isAITyping ? "AI is responding..." : "Enter message"}
						disabled={isAITyping}
					/>
					<button
						type="button"
						className="px-5 bg-black hover:from-gray-900 hover:to-gray-800 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white border-t border-black transition-all"
						onClick={send}
						disabled={!message.trim() || isAITyping}
					>
						{isAITyping ? (
							<i className="ri-loader-4-line animate-spin"></i>
						) : (
							<i className="ri-send-plane-fill"></i>
						)}
					</button>
				</div>
			</div>

			{/* Side Panel */}
			<div
				className={`sidePanel w-full h-full flex flex-col gap-2 bg-gray-950 border-l border-gray-800 absolute transition-all z-15 ${
					isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
				} top-0`}
			>
				<header className="flex justify-between items-center px-4 p-2 bg-black border-b border-gray-800">
					<h1 className="font-semibold text-lg font-mono">Collaborators</h1>
					<button
						onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
						className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
					>
						<i className="ri-close-fill"></i>
					</button>
				</header>
				<div className="users flex flex-col gap-2 p-4">
					{project?.users &&
						project.users.map((collaborator, index) => {
							return (
								<div
									key={index}
									className="user cursor-pointer hover:bg-gray-900 p-2 flex gap-2 items-center rounded-lg transition-colors"
								>
									<div className="relative">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
											{getInitials(collaborator.email)}
										</div>
										<div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-950 bg-green-500"></div>
									</div>
									<div className="flex-grow">
										<h1 className="font-semibold text-white font-mono">
											{collaborator.email}
										</h1>
										<p className="text-xs text-gray-500">online</p>
									</div>
								</div>
							);
						})}
				</div>
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 backdrop-blur-sm">
					<div className="bg-gray-950 rounded-xl shadow-2xl p-4 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 border border-gray-800">
						{/* Header */}
						<header className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
							<div className="flex items-center gap-2">
								<div className="flex gap-1">
									<div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
								</div>
								<h2 className="text-lg font-mono font-bold text-white">
									add-collaborators.config
								</h2>
							</div>
							<button
								onClick={() => setIsModalOpen(false)}
								className="w-7 h-7 rounded bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors border border-gray-700"
							>
								<i className="ri-close-fill text-gray-400"></i>
							</button>
						</header>

						<div className="users-list flex flex-col gap-2 mb-6 max-h-96 overflow-auto">
							{users &&
								users.map((collaborator) => (
									<div
										key={collaborator._id}
										className={`user cursor-pointer hover:bg-gray-900 transition-all duration-200 ${
											Array.from(selectedUserId).indexOf(collaborator._id) != -1
												? "bg-gray-900 border border-blue-500"
												: "border border-gray-800"
										} p-3 flex gap-3 items-center rounded-lg`}
										onClick={() => handleUserClick(collaborator._id)}
									>
										<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
											{getInitials(collaborator.email)}
										</div>
										<div className="flex-grow">
											<h1 className="font-semibold text-white font-mono">
												{collaborator.email}
											</h1>
											<p className="text-sm text-gray-500">Available to add</p>
										</div>
										{Array.from(selectedUserId).indexOf(collaborator._id) !=
											-1 && <i className="ri-check-fill text-blue-400"></i>}
									</div>
								))}
						</div>

						<button
							onClick={addCollaborators}
							disabled={selectedUserId.size === 0}
							className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-900 hover:from-gray-900 hover:to-gray-900 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-lg font-mono font-semibold transition-colors"
						>
							Add {Array.from(selectedUserId).length} Collaborator
							{Array.from(selectedUserId).length !== 1 ? "s" : ""}
						</button>
					</div>
				</div>
			)}

			{/* Add custom CSS for fade-in animation */}
			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateY(10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out;
				}
			`}</style>

			{/* Add Remix Icon CSS */}
			<link
				href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
				rel="stylesheet"
			/>
		</div>
	);
};

export default ChatArea;
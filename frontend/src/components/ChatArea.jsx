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
	isModalOpen,
}) => {
	const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
	const [isAITyping, setIsAITyping] = useState(false);
	const [aiTypingStage, setAITypingStage] = useState(""); // 'typing', 'thinking', 'generating'

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
			lastMessage.message.toLowerCase().startsWith("@ai") &&
			!isAITyping // Prevent multiple triggers
		) {
			// Clear any existing timeout
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}

			// Start the typing sequence
			setIsAITyping(true);
			setAITypingStage("thinking");

			// Stage 1: AI is thinking (1-2 seconds)
			typingTimeoutRef.current = setTimeout(() => {
				setAITypingStage("typing");

				// Stage 2: AI is typing (2-4 seconds)
				typingTimeoutRef.current = setTimeout(() => {
					setAITypingStage("generating");

					// Stage 3: AI is generating response (1-2 seconds)
					typingTimeoutRef.current = setTimeout(() => {
						setIsAITyping(false);
						setAITypingStage("");
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
			setAITypingStage("");
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		}
	}, [messages]);

	const renderMessage = (msg) => {
		if (msg.sender._id === "ai") {
			return writeAImessage(msg.message);
		}
		return <p className="text-[#cccccc] leading-relaxed">{msg.message}</p>;
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
			case "thinking":
				return "thinking...";
			case "typing":
				return "typing...";
			case "generating":
				return "generating response...";
			default:
				return "typing...";
		}
	};

	// Enhanced WhatsApp-style typing dots
	const renderTypingDots = () => {
		if (aiTypingStage === "thinking") {
			return (
				<div className="flex gap-1 items-center">
					<div className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce"></div>
					<div
						className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce"
						style={{animationDelay: "0.1s"}}
					></div>
					<div
						className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce"
						style={{animationDelay: "0.2s"}}
					></div>
				</div>
			);
		}

		return (
			<div className="flex gap-1">
				<div className="w-2 h-2 bg-[#858585] rounded-full animate-bounce"></div>
				<div
					className="w-2 h-2 bg-[#858585] rounded-full animate-bounce"
					style={{animationDelay: "0.1s"}}
				></div>
				<div
					className="w-2 h-2 bg-[#858585] rounded-full animate-bounce"
					style={{animationDelay: "0.2s"}}
				></div>
			</div>
		);
	};

	return (
		<div
			className="flex flex-col h-screen bg-gray-900 text-[#cccccc] relative font-mono"
			style={{
				background: `linear-gradient(135deg, rgb(3, 7, 20) 0%, rgb(0, 0, 0) 100%)`,
			}}
		>
			{/* Header */}
			<header className="flex justify-between items-center py-2 px-4 absolute top-0 w-full h-12 z-10">
				<div className="flex justify-between items-center w-full">
					<button
						className="group cursor-pointer relative bg-gray-850 hover:bg-[#081c2a] text-white py-0.5 px-2 rounded flex items-center gap-2 border border-gray-700/90 hover:border-[#020405] transition-all duration-200 text-sm"
						onClick={() => setIsModalOpen(true)}
					>
						<i className="ri-add-fill"></i>
						<span className="hidden text-xs font-semibold md:block">
							Add Collaborator
						</span>
					</button>
					<div className="flex gap-1 items-center hover:bg-[#464647] px-1 rounded-lg">
						<button
							onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
							className="cursor-pointer rounded transition-colors "
						>
							<i className="ri-group-fill text-lg"></i>
						</button>
					</div>
				</div>
			</header>

			{/* Chat Area */}
			<div className="conversation-area flex flex-col h-full relative">
				<div
					ref={messageBox}
					className="message-box absolute top-12 left-0 right-0 bottom-12 p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full"
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
										msg.sender._id === "ai" ? "max-w-70" : "max-w-52"
									} ${msg.sender._id == user._id.toString() && "ml-auto"}`}
								>
									{msg.sender._id !== user._id.toString() && (
										<div className="flex items-center gap-2 mb-1">
											<div className="w-6 h-6 rounded-full bg-gray-900 border border-[#3c3c3c] flex items-center justify-center text-xs font-semibold text-[#cccccc]">
												{msg.sender._id === "ai"
													? "AI"
													: getInitials(msg.sender.email)}
											</div>
											<small className="text-xs text-[#858585]">
												{msg.sender._id === "ai"
													? "AI Assistant"
													: msg.sender.email}
											</small>
										</div>
									)}
									<div
										className={`message flex flex-col py-1.5 px-2 w-fit rounded-lg ${
											msg.sender._id == user._id.toString()
												? "bg-gray-900 text-white ml-auto"
												: "bg-gray-950 text-[#cccccc] border border-[#3c3c3c]"
										}`}
									>
										<div className="text-xs font-semibold">
											{renderMessage(msg)}
										</div>
									</div>
								</div>
							</div>
						))}

						{/* Enhanced WhatsApp-style Typing Indicator */}
						{isAITyping && (
							<div className="flex justify-start animate-fadeIn">
								<div className="max-w-xs">
									<div className="flex items-center gap-2 mb-1">
										<div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-semibold text-white">
											<i className="ri-robot-fill"></i>
										</div>
										<small className="text-xs text-[#007acc] animate-pulse">
											AI {getTypingText()}
										</small>
									</div>
									<div className="bg-[#2d2d30] border border-[#3c3c3c] p-3 rounded shadow-lg">
										<div className="flex items-center gap-2">
											{renderTypingDots()}
											{aiTypingStage === "thinking" && (
												<i className="ri-brain-fill text-[#007acc] text-sm animate-pulse ml-2"></i>
											)}
											{aiTypingStage === "generating" && (
												<i className="ri-magic-fill text-[#c586c0] text-sm animate-spin ml-2"></i>
											)}
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="inputField w-full flex bottom-0 absolute border-t border-[#3c3c3c] h-10">
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
						className="py-2 px-4 border-none outline-none flex-grow bg-gray-850 text-sm text-[#cccccc] placeholder-[#858585]"
						type="text"
						placeholder={
							isAITyping ? "AI is responding..." : "Type a message..."
						}
						disabled={isAITyping}
					/>
					<button
						type="button"
						className="px-5 bg-black hover:bg-gray-900 disabled:bg-[#3c3c3c] disabled:cursor-not-allowed text-white transition-all"
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
				className={`sidePanel top-0 w-full h-full flex flex-col gap-2 overflow-hidden border-l border-[#3c3c3c] absolute transition-all z-15 ${
					isSidePanelOpen ? "translate-y-0" : "-translate-y-full"
				}`}
				style={{
					background: `linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(0, 0, 0) 100%)`,
				}}
			>
				<header
					className="flex justify-between items-center px-4 py-1 border-b border-gray-700"
					style={{
						background: `linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(0, 0, 0) 100%)`,
					}}
				>
					<h1 className="font-semibold text-m text-[#cccccc]">Collaborators</h1>
					<button
						onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
						className="p-1 h-8 w-8 hover:bg-gray-800 rounded transition-colors"
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
									className="user cursor-pointer hover:bg-[#2a2d2e] py-2 px-3 flex gap-3 items-center rounded border border-[#3c3c3c] transition-colors"
								>
									<div className="relative">
										<div className="w-8 h-8 rounded-full bg-gray-800 border border-[#3c3c3c] flex items-center justify-center text-[#cccccc] font-semibold">
											{getInitials(collaborator.email)}
										</div>
										<div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#252526] bg-[#4ec9b0]"></div>
									</div>
									<div className="flex-grow">
										<h1 className="font-bold text-[#cccccc]">
											{collaborator?.name?.firstName} {collaborator?.name?.lastName}
										</h1>
										<h2 className="font-semibold text-[#7c7b7b] text-xs">
											{collaborator.email}
										</h2>
										<p className="text-xs text-[#858585]">online</p>
									</div>
								</div>
							);
						})}
				</div>
			</div>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-2xl">
					<div
						className="rounded shadow-2xl p-4 w-full max-w-md mx-4 transform transition-all duration-300 scale-100 border border-black"
						style={{
							background: `linear-gradient(135deg, rgb(3, 7, 20) 0%, rgb(0, 0, 0) 100%)`,
						}}
					>
						{/* Header */}
						<header className="flex items-center justify-between mb-4 border-b border-[#3c3c3c] pb-3">
							<div className="flex items-center gap-3">
								<div className="flex gap-1">
									<div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
									<div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
									<div className="w-3 h-3 rounded-full bg-[#27ca3f]"></div>
								</div>
								<h2 className="text-lg font-bold text-[#cccccc]">
									Add Collaborators
								</h2>
							</div>
							<button
								onClick={() => setIsModalOpen(false)}
								className="w-7 h-7 rounded bg-gray-950 hover:bg-gray-800 flex items-center justify-center transition-colors"
							>
								<i className="ri-close-fill text-[#cccccc]"></i>
							</button>
						</header>

						<div className="users-list flex flex-col gap-2 mb-6 max-h-96 overflow-auto">
							{users &&
								users.map((collaborator) => (
									<div
										key={collaborator._id}
										className={`user cursor-pointer hover:bg-gray-800 transition-all duration-200 ${
											Array.from(selectedUserId).indexOf(collaborator._id) != -1
												? "bg-gray-900"
												: ""
										} p-3 flex gap-3 items-center rounded`}
										onClick={() => handleUserClick(collaborator._id)}
									>
										<div className="w-10 h-10 rounded-full bg-gray-900 border border-black flex items-center justify-center text-[#cccccc] font-semibold text-sm">
											{getInitials(collaborator.email)}
										</div>
										<div className="flex-grow">
											<h1 className="font-semibold text-[#cccccc]">
												{collaborator.email}
											</h1>
											<p className="text-sm text-[#858585]">Available to add</p>
										</div>
										{Array.from(selectedUserId).indexOf(collaborator._id) !=
											-1 && <i className="ri-check-fill text-[#007acc]"></i>}
									</div>
								))}
						</div>

						<button
							onClick={addCollaborators}
							disabled={selectedUserId.size === 0}
							className="w-full py-3 bg-[#031e30] hover:bg-[#061823] disabled:bg-gray-900 text-white rounded font-semibold transition-colors"
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

				/* Custom scrollbar for VS Code theme */
				.conversation-area ::-webkit-scrollbar {
					width: 14px;
				}
				
				.conversation-area ::-webkit-scrollbar-thumb {
					background-color: #424242;
					border-radius: 10px;
					border: 3px solid #1e1e1e;
				}
				
				.conversation-area ::-webkit-scrollbar-thumb:hover {
					background-color: #4f4f4f;
				}
				
				.conversation-area ::-webkit-scrollbar-track {
					background-color: #1e1e1e;
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

import React, {
	useState,
	useEffect,
	useContext,
	useRef,
	createRef,
	useCallback,
} from "react";
import {useNavigate, useLocation} from "react-router-dom";

import axios from "../config/axios";
import {initializeSocket, recieveMessage, sendMessage} from "../config/socket";
import {getWebContainer} from "../config/webContainer";

import {UserContext} from "../context/user.context";

import Markdown from "markdown-to-jsx";

import ChatArea from "../components/ChatArea";
import CodeEditor from "../components/CodeEditor";
import FileTree from "../components/FileTree";
import IFrame from "../components/IFrame";
import toast from "react-hot-toast";

function SyntaxHighlightedCode(props) {
	const ref = useRef(null);

	React.useEffect(() => {
		if (ref.current && props.className?.includes("lang-") && window.hljs) {
			window.hljs.highlightElement(ref.current);

			// hljs won't reprocess the element unless this attribute is removed
			ref.current.removeAttribute("data-highlighted");
		}
	}, [props.className, props.children]);

	return <code {...props} ref={ref} />;
}

// ResizeHandle component for dragging
const ResizeHandle = ({onResize, orientation = "vertical"}) => {
	const [isDragging, setIsDragging] = useState(false);
	const startPos = useRef(0);

	const handleMouseDown = useCallback(
		(e) => {
			setIsDragging(true);
			startPos.current = orientation === "vertical" ? e.clientX : e.clientY;
			e.preventDefault();
		},
		[orientation]
	);

	const handleMouseMove = useCallback(
		(e) => {
			if (!isDragging) return;

			const currentPos = orientation === "vertical" ? e.clientX : e.clientY;
			const delta = currentPos - startPos.current;
			startPos.current = currentPos;

			onResize(delta);
		},
		[isDragging, onResize, orientation]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.body.style.cursor =
				orientation === "vertical" ? "col-resize" : "row-resize";

			// Add pointer-events: none to all iframes to prevent them from capturing mouse events
			const iframes = document.querySelectorAll("iframe");
			iframes.forEach((iframe) => {
				iframe.style.pointerEvents = "none";
			});

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.body.style.cursor = "default";

				// Restore pointer events to iframes
				const iframes = document.querySelectorAll("iframe");
				iframes.forEach((iframe) => {
					iframe.style.pointerEvents = "auto";
				});
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp, orientation]);

	return (
		<div className="relative flex items-center justify-center">
			{/* Invisible hit area */}
			<div
				className={`absolute ${
					orientation === "vertical"
						? "w-2 h-full cursor-col-resize"
						: "h-2 w-full cursor-row-resize"
				} z-10`}
				onMouseDown={handleMouseDown}
				style={{background: "transparent"}}
			/>
			{/* Visible line */}
			<div
				className={`${
					orientation === "vertical" ? "w-px h-full" : "h-px w-full"
				} bg-[#3c3c3c] transition-colors duration-150 ${
					isDragging ? "bg-blue-500" : ""
				} hover:bg-blue-500 pointer-events-none`}
			/>
		</div>
	);
};

const Project = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const [selectedUserId, setSelectedUserId] = useState([]);
	const [project, setProject] = useState(location?.state?.project);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [message, setMessage] = useState("");

	const [currentFile, setCurrentFile] = useState(null);
	const [openFiles, setOpenFiles] = useState([]);

	// New state for UI controls
	const [isChatOpen, setIsChatOpen] = useState(true);
	const [isFileTreeOpen, setIsFileTreeOpen] = useState(true);
	const [isIframeOpen, setIsIframeOpen] = useState(true); // New state for iframe visibility
	const [searchQuery, setSearchQuery] = useState("");

	// Resizable panel widths
	const [fileTreeWidth, setFileTreeWidth] = useState(250);
	const [chatWidth, setChatWidth] = useState(320);
	const [iframeWidth, setIframeWidth] = useState(400);
	const containerRef = useRef(null);
	const [containerWidth, setContainerWidth] = useState(1200);

	const {user} = useContext(UserContext);
	const messageBox = createRef();

	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);

	const [fileTree, setFileTree] = useState({});

	const [webContainer, setWebContainer] = useState(null);
	const [iframeUrl, setIframeUrl] = useState(null);
	const [runProcess, setRunProcess] = useState(null);
	const [isInstalling, setIsInstalling] = useState(false);
	const [isServerReady, setIsServerReady] = useState(false);

	// Footer stats state
	const [editorStats, setEditorStats] = useState({
		totalWords: 0,
		currentLine: 1,
		currentColumn: 1,
	});

	// Resize handlers
	const handleFileTreeResize = useCallback((delta) => {
		setFileTreeWidth((prev) => Math.max(150, Math.min(500, prev + delta)));
	}, []);

	// Fixed iframe resize handler - invert the delta for correct direction
	const handleIframeResize = useCallback((delta) => {
		setIframeWidth((prev) => Math.max(200, Math.min(800, prev - delta))); // Note: -delta to fix direction
	}, []);

	const handleChatResize = useCallback((delta) => {
		setChatWidth((prev) => Math.max(250, Math.min(600, prev - delta)));
	}, []);

	// Calculate code editor width
	const getCodeEditorWidth = () => {
		let usedWidth = 0;
		if (isFileTreeOpen) usedWidth += fileTreeWidth + 1;
		if (isChatOpen) usedWidth += chatWidth + 1;
		if (iframeUrl && isIframeOpen) usedWidth += iframeWidth + 1; // Consider isIframeOpen

		return Math.max(300, containerWidth - usedWidth);
	};

	// Track container width
	useEffect(() => {
		const handleResize = () => {
			if (containerRef.current) {
				setContainerWidth(containerRef.current.offsetWidth);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		initializeSocket(project?._id);

		if (!webContainer) {
			getWebContainer().then((container) => {
				setWebContainer(container);

				// Set up server-ready event listener when container is created
				container.on("server-ready", (port, url) => {
					console.log("server-ready", port, url);
					setIframeUrl(url);
					setIsServerReady(true);
					// Auto-close chat when iframe opens
					setIsChatOpen(false);
				});

				console.log("container started");
				toast.success("✅ Container started");
			});
		}

		recieveMessage("project-message", (data) => {
			if (data.sender._id == "ai") {
				const message = JSON.parse(data.message);

				console.log(message);

				webContainer?.mount(message.fileTree);

				if (message.fileTree) {
					setFileTree(message.fileTree || {});
				}
				setMessages((prevMessages) => [...prevMessages, data]);
			} else {
				setMessages((prevMessages) => [...prevMessages, data]);
			}

			scrollToBottom();
		});

		axios
			.get(`/projects/get-project/${location.state?.project._id}`)
			.then((res) => {
				setProject(res.data.project);
				setFileTree(res.data.project.fileTree);
			})
			.catch((err) => {
				console.log(err);
			});

		axios.get("/users/all").then((res) => {
			setUsers(res.data.users);
		});
	}, []);

	// Calculate editor stats when current file changes
	useEffect(() => {
		if (currentFile && fileTree[currentFile]) {
			const content = fileTree[currentFile].file.contents;
			const words = content
				.split(/\s+/)
				.filter((word) => word.length > 0).length;
			setEditorStats({
				totalWords: words,
				currentLine: content.split("\n").length,
				currentColumn: 1,
			});
		} else {
			setEditorStats({
				totalWords: 0,
				currentLine: 1,
				currentColumn: 1,
			});
		}
	}, [currentFile, fileTree]);

	function writeAImessage(message) {
		const messageObject = JSON.parse(message);

		return (
			<div className="overflow-auto bg-[#1e1e1e] text-[#cccccc] p-2 rounded-sm border border-[#3c3c3c]">
				<Markdown
					children={messageObject.text}
					options={{
						overrides: {
							code: SyntaxHighlightedCode,
						},
					}}
				/>
			</div>
		);
	}

	function send() {
		sendMessage("project-message", {
			message,
			sender: user,
		});

		setMessages((prevMessages) => [...prevMessages, {sender: user, message}]);

		setMessage("");
		scrollToBottom();
	}

	const handleUserClick = (id) => {
		setSelectedUserId((prevSelectedUserId) => {
			const newSelectedUserId = new Set(prevSelectedUserId);
			if (newSelectedUserId.has(id)) {
				newSelectedUserId.delete(id);
			} else {
				newSelectedUserId.add(id);
			}
			return newSelectedUserId;
		});
	};

	function addCollaborators() {
		axios
			.put("/projects/addUser", {
				projectId: location.state.project._id,
				users: Array.from(selectedUserId),
			})
			.then((res) => {
				console.log(res.data);
				setIsModalOpen(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function saveFileTree(ft) {
		axios
			.put("/projects/update-file-tree", {
				projectId: project._id,
				fileTree: ft,
			})
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	function scrollToBottom() {
		if (messageBox.current) {
			messageBox.current.scrollTop = messageBox.current.scrollHeight;
		}
	}

	const runProject = async () => {
		try {
			if (!webContainer) {
				console.warn("webContainer not ready yet");
				return;
			}

			setIsInstalling(true);
			await webContainer.mount(fileTree);

			// npm install
			const installProcess = await webContainer.spawn("npm", ["install"]);
			if (installProcess?.output) {
				installProcess.output
					.pipeTo(
						new WritableStream({
							write(chunk) {
								console.log("install:", chunk);
							},
						})
					)
					.catch((e) => console.warn("install pipeTo error", e));
			}

			setIsInstalling(false);

			// Kill previous process
			if (runProcess) {
				try {
					runProcess.kill();
				} catch (e) {
					console.warn("failed to kill runProcess", e);
				}
			}

			// npm start
			const tempRunProcess = await webContainer.spawn("npm", ["start"]);
			if (tempRunProcess?.output) {
				tempRunProcess.output
					.pipeTo(
						new WritableStream({
							write(chunk) {
								console.log("start:", chunk);
							},
						})
					)
					.catch((e) => console.warn("start pipeTo error", e));
			}

			setRunProcess(tempRunProcess);

			// Note: server-ready event listener is now set up when container is created
		} catch (err) {
			console.error("Run handler error:", err);
			alert("Run failed — see console for details");
			setIsInstalling(false);
		}
	};

	return (
		<main className="h-screen w-screen flex flex-col bg-white">
			{/* VS Code Header */}
			<header className="bg-gray-900 border-b border-[#3c3c3c] px-4 py-2 h-10 flex items-center justify-between text-[#cccccc] text-sm">
				{/* Left section - Logo and navigation */}
				<div className="flex items-center gap-4">
					<button
						onClick={() => navigate("/projects")}
						className="flex items-center gap-2 hover:bg-[#37373d] px-2 py-1 cursor-pointer rounded transition-colors"
					>
						<div className="w-30 h-5 rounded flex items-center justify-center text-white font-bold text-xs">
							<img src="/logo.png" />
						</div>
					</button>

					<button
						onClick={() => setIsFileTreeOpen(!isFileTreeOpen)}
						className="p-1.5 cursor-pointer hover:bg-[#37373d] rounded transition-colors"
						title="Toggle File Explorer"
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5z" />
						</svg>
					</button>
				</div>

				{/* Middle section - Search bar and Preview toggle */}
				<div className="flex items-center gap-4 flex-1 max-w-md mx-8">
					<div className="relative flex-1">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center">
							<svg
								width="14"
								height="14"
								viewBox="0 0 16 16"
								fill="currentColor"
								className="text-[#858585]"
							>
								<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
							</svg>
						</div>
						<input
							type="text"
							placeholder="Search files, symbols, commands..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-8 pr-3 py-1 bg-gray-950 rounded text-sm text-[#cccccc] placeholder-[#858585] focus:bg-gray-800 outline-none transition-colors"
						/>
					</div>

					{/* Preview toggle button - only show when server is ready */}
					{isServerReady && iframeUrl && (
						<button
							onClick={() => setIsIframeOpen(!isIframeOpen)}
							className={`p-1 rounded transition-colors cursor-pointer hover:bg-[#37373d] ${
								isIframeOpen ? "text-white" : "text-[#cccccc]"
							}`}
							title="Toggle Preview"
						>
							<i className="ri-code-line"></i>
						</button>
					)}
				</div>

				{/* Right section - Chat toggle */}
				<div className="flex items-center gap-2">
					<button
						onClick={() => setIsChatOpen(!isChatOpen)}
						className={`p-1.5 rounded transition-colors cursor-pointer hover:bg-[#37373d] ${
							isChatOpen ? " text-white" : "text-[#cccccc]"
						}`}
						title="Toggle Chat"
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
						</svg>
					</button>
				</div>
			</header>

			{/* Main content area */}
			<div ref={containerRef} className="flex-1 flex overflow-hidden">
				<section className="right flex-grow h-full flex">
					{/* File Tree with resize handle */}
					{isFileTreeOpen && (
						<>
							<div
								style={{width: `${fileTreeWidth}px`}}
								className="overflow-hidden"
							>
								<FileTree
									project={project}
									fileTree={fileTree}
									openFiles={openFiles}
									setOpenFiles={setOpenFiles}
									currentFile={currentFile}
									setCurrentFile={setCurrentFile}
								/>
							</div>
							<ResizeHandle onResize={handleFileTreeResize} />
						</>
					)}

					{/* Code Editor */}
					<div
						style={{width: `${getCodeEditorWidth()}px`}}
						className="overflow-hidden"
					>
						<CodeEditor
							openFiles={openFiles}
							setOpenFiles={setOpenFiles}
							currentFile={currentFile}
							setCurrentFile={setCurrentFile}
							webContainer={webContainer}
							setWebContainer={setWebContainer}
							fileTree={fileTree}
							setFileTree={setFileTree}
							runProcess={runProcess}
							setRunProcess={setRunProcess}
							saveFileTree={saveFileTree}
							setIframeUrl={setIframeUrl}
							setIsInstalling={setIsInstalling}
							setIsServerReady={setIsServerReady}
						/>
					</div>

					{/* IFrame/Preview with resize handle - only show when both conditions are met */}
					{iframeUrl && webContainer && isIframeOpen && (
						<>
							<ResizeHandle onResize={handleIframeResize} />
							<div
								style={{width: `${iframeWidth}px`}}
								className="overflow-hidden"
							>
								<IFrame iframeUrl={iframeUrl} setIframeUrl={setIframeUrl} />
							</div>
						</>
					)}
				</section>

				{/* Chat Panel with resize handle */}
				{isChatOpen && (
					<>
						<ResizeHandle onResize={handleChatResize} />
						<section
							className="left relative flex flex-col h-full border-l border-[#3c3c3c]"
							style={{width: `${chatWidth}px`}}
						>
							<ChatArea
								project={project}
								users={users}
								messages={messages}
								message={message}
								setMessage={setMessage}
								messageBox={messageBox}
								writeAImessage={writeAImessage}
								send={send}
								handleUserClick={handleUserClick}
								addCollaborators={addCollaborators}
								selectedUserId={selectedUserId}
								isModalOpen={isModalOpen}
								setIsModalOpen={setIsModalOpen}
							/>
						</section>
					</>
				)}
			</div>

			{/* VS Code Footer */}
			<footer className="bg-gray-950 border border-gray-500 text-white px-4 py-1 flex items-center justify-between text-xs font-mono h-5">
				{/* Left section - File and cursor info */}
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
							<path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
						</svg>
						<span>
							Ln {editorStats.currentLine}, Col {editorStats.currentColumn}
						</span>
					</div>

					<div className="flex items-center gap-2">
						<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
							<path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z" />
							<path d="M6 4a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 4zm0 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 6zm0 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3A.5.5 0 0 1 6 8z" />
						</svg>
						<span>{editorStats.totalWords} words</span>
					</div>

					{currentFile && (
						<div className="flex items-center gap-2">
							<svg
								width="12"
								height="12"
								viewBox="0 0 16 16"
								fill="currentColor"
							>
								<path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
							</svg>
							<span>{currentFile}</span>
						</div>
					)}
				</div>

				{/* Right section - Action buttons */}
				<div className="flex items-center gap-3">
					{isInstalling && (
						<span className="text-xs text-yellow-400 flex items-center gap-1">
							<i className="ri-loader-4-line animate-spin"></i> Installing...
						</span>
					)}

					{/* Server ready indicator */}
					{isServerReady && (
						<span className="text-xs text-green-400 flex items-center gap-1">
							<i className="ri-check-line"></i> Server Ready
						</span>
					)}

					{!isServerReady && (
						<button
							onClick={runProject}
							className="flex items-center gap-1 hover:bg-[#1177bb] px-2 py-0.5 rounded transition-colors"
						>
							<i className="ri-code-line"></i>
							<span>Go Live</span>
						</button>
					)}

					<button
						onClick={() => navigate("/projects")}
						className="flex items-center gap-1 hover:bg-[#1177bb] px-2 py-0.5 rounded transition-colors"
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
							<path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9z" />
						</svg>
						<span>My Projects</span>
					</button>
				</div>
			</footer>
		</main>
	);
};

export default Project;
import React, {useState, useEffect} from "react";
import hljs from "highlight.js";

const CodeEditor = ({
	openFiles,
	currentFile,
	setCurrentFile,
	webContainer,
	setWebContainer,
	fileTree,
	setFileTree,
	runProcess,
	setRunProcess,
	saveFileTree,
	setIframeUrl,
	setOpenFiles,
}) => {
	// Get file extension for syntax highlighting
	const getLanguage = (filename) => {
		const ext = filename?.split(".").pop()?.toLowerCase();
		const langMap = {
			js: "javascript",
			jsx: "javascript",
			ts: "typescript",
			tsx: "typescript",
			html: "html",
			css: "css",
			json: "json",
			md: "markdown",
			py: "python",
			java: "java",
			cpp: "cpp",
			c: "c",
		};
		return langMap[ext] || "javascript";
	};

	// Get file icon based on extension
	const getFileIcon = (filename) => {
		const ext = filename?.split(".").pop()?.toLowerCase();
		const iconMap = {
			js: "📄",
			jsx: "⚛️",
			ts: "📘",
			tsx: "⚛️",
			html: "🌐",
			css: "🎨",
			json: "📋",
			md: "📝",
			py: "🐍",
			java: "☕",
			cpp: "⚙️",
			c: "⚙️",
		};
		return iconMap[ext] || "📄";
	};

	const backgroundPatterns = [
		"linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.02) 100%)",
		"linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(219, 39, 119, 0.02) 100%)",
		"linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.02) 100%)",
		"linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.02) 100%)",
		"linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.02) 100%)",
		"linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.02) 100%)",
	];

	// Close a file tab
	const closeFile = (fileToClose, e) => {
		e.stopPropagation();
		const updatedOpenFiles = openFiles.filter((file) => file !== fileToClose);
		setOpenFiles(updatedOpenFiles);

		// If we closed the current file, switch to another open file or none
		if (currentFile === fileToClose) {
			if (updatedOpenFiles.length > 0) {
				// Switch to the next file, or the previous one if we closed the last
				const currentIndex = openFiles.indexOf(fileToClose);
				const nextFile =
					updatedOpenFiles[currentIndex] || updatedOpenFiles[currentIndex - 1];
				setCurrentFile(nextFile);
			} else {
				setCurrentFile(null);
			}
		}
	};

	// Check if file exists in current fileTree
	const fileExists = (filename) => {
		return fileTree && fileTree[filename];
	};

	return (
		<div
			className="code-editor bg-gray-950 w-full flex flex-col h-full text-[#cccccc] font-mono"
			style={{
				background: `linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(0, 0, 0) 100%)`,
			}}
		>
			{/* Tab Bar - VS Code Style */}
			<div className="flex justify-between w-full bg-gray-900/70">
				<div
					className="flex overflow-x-auto"
					style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
				>
					<style jsx>{`
                        .tabs-container::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
					{openFiles.map((file) => {
						const exists = fileExists(file);
						const isActive = currentFile === file;

						return (
							<div
								key={file}
								onClick={() => exists && setCurrentFile(file)}
								className={`flex items-center min-w-fit border-r border-[#3c3c3c] group relative cursor-pointer ${
									isActive
										? "bg-gray-950 text-white border-t-2 border-t-[#007acc]"
										: exists
										? "bg-gray-900 text-[#cccccc] hover:bg-gray-800"
										: "bg-[#252526] text-[#858585]"
								}`}
							>
								<div className="flex items-center gap-2 px-2 py-1 pr-8 min-w-0">
									<span className="text-sm flex-shrink-0">
										{getFileIcon(file)}
									</span>
									<span
										className={`text-sm font-normal truncate ${
											!exists ? "italic line-through" : ""
										}`}
									>
										{file}
									</span>
									{!exists && (
										<span className="text-xs text-[#f48771] ml-1 flex-shrink-0">
											(deleted)
										</span>
									)}
								</div>

								{/* Close button */}
								<button
									onClick={(e) => closeFile(file, e)}
									className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center transition-opacity ${
										isActive
											? "opacity-70 hover:opacity-100"
											: "opacity-0 group-hover:opacity-100"
									} hover:bg-[#ffffff1a]`}
								>
									<span className="text-sm text-[#cccccc] hover:text-white font-normal">
										×
									</span>
								</button>
							</div>
						);
					})}
				</div>

				<div className="flex items-center justify-center gap-1 py-1 px-2">
					<button
						onClick={async () => {
							try {
								if (!webContainer) {
									console.warn("webContainer not ready yet");
									return;
								}

								await webContainer.mount(fileTree);

								// npm install
								const installProcess = await webContainer.spawn("npm", [
									"install",
								]);
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

								// Kill previous process
								if (runProcess) {
									try {
										runProcess.kill();
									} catch (e) {
										console.warn("failed to kill runProcess", e);
									}
								}

								// npm start
								const tempRunProcess = await webContainer.spawn("npm", [
									"start",
								]);
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

								webContainer.on("server-ready", (port, url) => {
									console.log("server-ready", port, url);
									setIframeUrl(url);
								});
							} catch (err) {
								console.error("Run handler error:", err);
								alert("Run failed — see console for details");
							}
						}}
						className="px-3 py-1 h-5 w-5 hover:bg-gray-800 text-white text-sm rounded flex items-center justify-center gap-2 transition-colors"
					>
						<span className="text-xs">▶</span>
					</button>
				</div>
			</div>

			{/* Editor Area */}
			<div className="flex flex-grow overflow-hidden">
				{currentFile && fileExists(currentFile) ? (
					<div className="flex h-full w-full overflow-auto">
						{/* Line numbers */}
						<div className=" text-[#4e4b4bbd] text-sm px-4 py-4 border-r border-[#19112d87] select-none min-w-[3.5rem] flex-shrink-0">
							{fileTree[currentFile].file.contents
								.split("\n")
								.map((_, index) => (
									<div key={index + 1} className="leading-6 text-right h-6">
										{index + 1}
									</div>
								))}
						</div>

						{/* Code area */}
						<div className="flex-grow">
							<div className="min-h-full">
								<pre className="m-0 bg-transparent">
									<code
										className="block outline-none text-xs leading-6 bg-transparent p-4 min-h-full"
										contentEditable
										suppressContentEditableWarning
										spellCheck={false}
										onBlur={(e) => {
											const updatedContent = e.target.innerText;
											const ft = {
												...fileTree,
												[currentFile]: {
													file: {
														contents: updatedContent,
													},
												},
											};
											setFileTree(ft);
											saveFileTree(ft);
										}}
										dangerouslySetInnerHTML={{
											__html: hljs.highlight(
												getLanguage(currentFile),
												fileTree[currentFile].file.contents
											).value,
										}}
										style={{
											whiteSpace: "pre-wrap",
											paddingBottom: "50vh",
											minHeight: "100%",
											color: "#d4d4d4",
											fontFamily: "'Consolas', 'Courier New', monospace",
										}}
									/>
								</pre>
							</div>
						</div>
					</div>
				) : currentFile && !fileExists(currentFile) ? (
					// File doesn't exist anymore
					<div className="flex-grow flex items-center justify-center text-[#858585]">
						<div className="text-center">
							<div className="text-6xl mb-4 opacity-50">📄</div>
							<div className="text-xl mb-2 text-[#cccccc]">File not found</div>
							<div className="text-sm">
								The file "{currentFile}" has been deleted or moved.
							</div>
						</div>
					</div>
				) : (
					// No file selected
					<div className="flex-grow flex items-center justify-center text-[#858585]">
						<div className="text-center">
							<div className="text-6xl mb-4 opacity-50">📝</div>
							<div className="text-xl mb-2 text-[#cccccc]">
								No file selected
							</div>
							<div className="text-sm">
								Select a file from the tabs above to start editing.
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Custom scrollbar styles */}
			<style jsx global>{`
                .code-editor ::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                
                .code-editor ::-webkit-scrollbar-thumb {
                    background-color: #424242;
                    border-radius: 10px;
                    border: 3px solid #0b0b0b;
                }
                
                .code-editor ::-webkit-scrollbar-thumb:hover {
                    background-color: #4f4f4f;
                }
                
                .code-editor ::-webkit-scrollbar-track {
                    background-color: #0b0b0b
;
                }
                
                .code-editor ::-webkit-scrollbar-corner {
                    background-color: #0b0b0b;
                }
            `}</style>
		</div>
	);
};

export default CodeEditor;

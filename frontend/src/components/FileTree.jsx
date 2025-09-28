import React from "react";

const FileTree = ({
	project,
	fileTree,
	openFiles,
	setOpenFiles,
	currentFile,
	setCurrentFile,
}) => {
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
			json: "⚙️",
			md: "📝",
			py: "🐍",
			java: "☕",
			cpp: "⚙️",
			c: "⚙️",
			txt: "📄",
			yml: "⚙️",
			yaml: "⚙️",
			xml: "📄",
			svg: "🎨",
			png: "🖼️",
			jpg: "🖼️",
			jpeg: "🖼️",
			gif: "🖼️",
			ico: "🖼️",
		};
		return iconMap[ext] || "📄";
	};

	const handleFileClick = (file) => {
		setCurrentFile(file);
		setOpenFiles([...new Set([...openFiles, file])]);
	};

	return (
		<div
			className="explorer h-full min-w-64 text-[#cccccc] border-r border-[#3c3c3c] font-sans"
			style={{
				background: `linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(0, 0, 0) 100%)`,
			}}
		>
			{/* Project Header */}
			<div
				className="project-header border-b border-[#3c3c3c] px-3 py-2"
				style={{
					background: `linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(0, 0, 0) 100%)`,
				}}
			>
				<span className="text-sm font-medium text-[#cccccc]">
					{project?.name}
				</span>
			</div>

			{/* Files */}
			{fileTree && (
				<div className="files">
					{Object?.keys(fileTree).map((file) => {
						const isActive = currentFile === file;
						const isOpen = openFiles.includes(file);

						return (
							<div
								key={file}
								onClick={() => handleFileClick(file)}
								className={`file-item flex items-center gap-2 px-3 py-2 cursor-pointer select-none transition-colors ${
									isActive
										? "bg-gray-900 text-white"
										: "hover:bg-gray-700 text-[#cccccc]"
								}`}
							>
								{/* File icon */}
								<span className="text-sm flex-shrink-0">
									{getFileIcon(file)}
								</span>

								{/* File name */}
								<span className="text-sm font-normal truncate">{file}</span>

								{/* Open indicator */}
								{isOpen && !isActive && (
									<div className="w-1.5 h-1.5 bg-[#007acc] rounded-full ml-auto flex-shrink-0"></div>
								)}
							</div>
						);
					})}
				</div>
			)}

			{/* Custom scrollbar styles for file tree */}
			<style jsx>{`
                .explorer ::-webkit-scrollbar {
                    width: 10px;
                }
                
                .explorer ::-webkit-scrollbar-thumb {
                    background-color: #424242;
                    border-radius: 10px;
                    border: 2px solid #252526;
                }
                
                .explorer ::-webkit-scrollbar-thumb:hover {
                    background-color: #4f4f4f;
                }
                
                .explorer ::-webkit-scrollbar-track {
                    background-color: #252526;
                }
            `}</style>
		</div>
	);
};

export default FileTree;

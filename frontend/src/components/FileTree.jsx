import React from "react";

const FileTree = ({
    fileTree,
    openFiles,
    setOpenFiles,
    currentFile,
    setCurrentFile,
}) => {
	return (
		<div className="explorer h-full max-w-64 min-w-52 bg-slate-400 ">
			<div className="file-tree cursor-pointer w-full">
				{Object.keys(fileTree).map((file) => (
					<button
						key={file}
						onClick={() => {
							setCurrentFile(file);
							setOpenFiles([...new Set([...openFiles, file])]);
						}}
						className="tree-element px-4 py-2 flex items-center gap-2 bg-slate-200 w-full"
					>
						<p className=" font-semibold text-lg">{file}</p>
					</button>
				))}
			</div>
		</div>
	);
};

export default FileTree;

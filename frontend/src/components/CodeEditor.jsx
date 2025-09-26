import React from "react";
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
	setIframeUrl
}) => {
	return (
		<div className="code-editor flex flex-col flex-grow h-full shrink">

			<div className="top flex justify-between w-full">
				<div className="files flex">
					{openFiles.map((file, index) => (
						<button
                            key={file}
							onClick={() => setCurrentFile(file)}
							className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${
								currentFile === file ? "bg-slate-400" : ""
							}`}
						>
							<p className="font-semibold text-lg">{file}</p>
						</button>
					))}
				</div>

				<div className="actions flex gap-2">
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
								if (!installProcess || !installProcess.output) {
									console.warn(
										"installProcess missing or has no output",
										installProcess
									);
								} else {
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

								// kill previous if exists
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
								if (!tempRunProcess || !tempRunProcess.output) {
									console.warn(
										"startProcess missing or has no output",
										tempRunProcess
									);
								} else {
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
						className="p-2 px-4 bg-slate-300 text-white"
					>
						run
					</button>
				</div>

			</div>

			<div className="bottom flex flex-grow max-w-full shrink overflow-auto">
				{fileTree && currentFile && fileTree[currentFile] && (
					<div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
						<pre className="hljs h-full">
							<code
								className="hljs h-full outline-none"
								contentEditable
								suppressContentEditableWarning
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
										"javascript",
										fileTree[currentFile].file.contents
									).value,
								}}
								style={{
									whiteSpace: "pre-wrap",
									paddingBottom: "25rem",
									counterSet: "line-numbering",
								}}
							/>
						</pre>
					</div>
				)}
			</div>
		</div>
	);
};

export default CodeEditor;

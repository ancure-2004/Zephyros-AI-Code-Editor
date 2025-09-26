import React, {
	useState,
	useEffect,
	useContext,
	useRef,
	createRef,
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

const Project = () => {
	const location = useLocation();

	const [selectedUserId, setSelectedUserId] = useState([]);
	const [project, setProject] = useState(location?.state?.project);

	const [message, setMessage] = useState("");

	const [currentFile, setCurrentFile] = useState(null);
	const [openFiles, setOpenFiles] = useState([]);

	const {user} = useContext(UserContext);
	const messageBox = createRef();

	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);

	const [fileTree, setFileTree] = useState({});

	const [webContainer, setWebContainer] = useState(null);
	const [iframeUrl, setIframeUrl] = useState(null);
	const [runProcess, setRunProcess] = useState(null);

	useEffect(() => {
		initializeSocket(project._id);

		if (!webContainer) {
			getWebContainer().then((container) => {
				setWebContainer(container);

				console.log("container started");
			});
		}

		recieveMessage("project-message", (data) => {
			// console.log(JSON.parse(data.message));

			if (data.sender._id == "ai") {
				const message = JSON.parse(data.message);

				console.log(message);

				webContainer?.mount(message.fileTree);

				if (message.fileTree) {
					setFileTree(message.fileTree || {});
				}
				setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
			} else {
				setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
			}

			scrollToBottom();
		});

		axios
			.get(`/projects/get-project/${location.state.project._id}`)
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

	function writeAImessage(message) {

		const messageObject = JSON.parse(message);

		// console.log(messageObject);

		return (
			<div className="overflow-auto bg-slate-950 text-white p-2 rounded-sm">
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
		// console.log(user);

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

	function scrollToBottom() {
		messageBox.current.scrollTop = messageBox.current.scrollHeight;
	}

	return (
		<main className="h-screen w-screen flex">
			<section className="left relative flex flex-col h-screen min-w-86 bg-slate-300">
				< ChatArea
					project={project} users={users}
					messages={messages} message={message} setMessage={setMessage} messageBox={messageBox}
					writeAImessage={writeAImessage} send={send}
					handleUserClick={handleUserClick} addCollaborators={addCollaborators}
					selectedUserId={selectedUserId}
				/>
			</section>

			<section className="right bg-red-50 flex-grow h-full flex">
				{fileTree && (
					<FileTree 
						fileTree={fileTree}
						openFiles={openFiles} setOpenFiles={setOpenFiles}
						currentFile={currentFile} setCurrentFile={setCurrentFile}		
					/>
				)}

				<CodeEditor
					openFiles={openFiles} currentFile={currentFile} setCurrentFile={setCurrentFile}
					webContainer={webContainer} setWebContainer={setWebContainer}
					fileTree={fileTree} setFileTree={setFileTree}
					runProcess={runProcess} setRunProcess={setRunProcess}
					saveFileTree={saveFileTree} setIframeUrl={setIframeUrl}
				/>

				{iframeUrl && webContainer && (
					<IFrame 
						iframeUrl={iframeUrl}
						setIframeUrl={setIframeUrl}
					/>
				)}
			</section>

		</main>
	);
};

export default Project;

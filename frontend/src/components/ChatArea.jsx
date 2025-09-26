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
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

	const {user} = useContext(UserContext);

	const inputRef = useRef(null);

	// Focus input when Tab is pressed anywhere on the page
	useEffect(() => {
		const handleTab = (e) => {
			if (e.key === "Tab") {
				e.preventDefault(); // prevent default tab behavior
				inputRef.current.focus();
			}
		};

		window.addEventListener("keydown", handleTab);
		return () => window.removeEventListener("keydown", handleTab);
	}, []);

	return (
		<div className="flex flex-col h-screen">
			<header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
				<button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
					<i className="ri-add-fill mr-1"></i>
					<p>Add collaborator</p>
				</button>
				<button
					onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
					className="p-2"
				>
					<i className="ri-group-fill"></i>
				</button>
			</header>

			<div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
				<div
					ref={messageBox}
					className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide"
				>
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`${
								msg.sender._id === "ai" ? "max-w-80" : "max-w-52"
							} ${
								msg.sender._id == user._id.toString() && "ml-auto"
							}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
						>
							<small className="opacity-65 text-xs">{msg.sender.email}</small>
							<div className="text-sm">
								{msg.sender._id === "ai" ? (
									writeAImessage(msg.message)
								) : (
									<p>{msg.message}</p>
								)}
							</div>
						</div>
					))}
				</div>

				<div className="inputField w-full flex absolute bottom-0 ">
					<input
                        ref={inputRef}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								send(); // call your send function
							}
						}}
						className="p-2 px-4 border-none outline-none flex-grow bg-white"
						type="text"
						placeholder="Enter message"
					/>
					<button
						type="button"
						className="px-5 bg-slate-950 text-white w-1/4"
						onClick={send}
					>
						<i className="ri-send-plane-fill"></i>
					</button>
				</div>
			</div>

			<div
				className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${
					isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
				} top-0`}
			>
				<header className="flex justify-between items-center px-4 p-2 bg-slate-200">
					<h1 className="font-semibold text-lg">Collaborators</h1>

					<button
						onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
						className="p-2"
					>
						<i className="ri-close-fill"></i>
					</button>
				</header>
				<div className="users flex flex-col gap-2">
					{project.users &&
						project.users.map((user, index) => {
							return (
								<div
									key={index}
									className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center"
								>
									<div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
										<i className="ri-user-fill absolute text-small"></i>
									</div>
									<h1 className="font-semibold text-small">{user.email}</h1>
								</div>
							);
						})}
				</div>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-4 rounded-md w-96 max-w-full relative">
						<header className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-semibold">Select User</h2>
							<button onClick={() => setIsModalOpen(false)} className="p-2">
								<i className="ri-close-fill"></i>
							</button>
						</header>
						<div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
							{users.map((user) => (
								<div
									key={user.id}
									className={`user cursor-pointer hover:bg-slate-200 ${
										Array.from(selectedUserId).indexOf(user._id) != -1
											? "bg-slate-200"
											: ""
									} p-2 flex gap-2 items-center`}
									onClick={() => handleUserClick(user._id)}
								>
									<div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
										<i className="ri-user-fill absolute"></i>
									</div>
									<h1 className="font-semibold text-lg">{user.email}</h1>
								</div>
							))}
						</div>
						<button
							onClick={addCollaborators}
							className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
						>
							Add Collaborators
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatArea;

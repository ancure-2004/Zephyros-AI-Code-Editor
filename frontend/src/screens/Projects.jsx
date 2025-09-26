import React, {useEffect, useState} from "react";
import {UserContext} from "../context/user.context";
import axios from "../config/axios";
import {useNavigate} from "react-router-dom";

const Projects = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [selectedStack, setSelectedStack] = useState([]);
	const [projects, setProjects] = useState([]);
	const [isCreating, setIsCreating] = useState(false);
	const [editingProject, setEditingProject] = useState(null);
	const [editName, setEditName] = useState("");
	const [editStack, setEditStack] = useState([]);

	const navigate = useNavigate();

	// Tech stack options with icons and darker theme colors
	const techStacks = [
		{name: "React", color: "#61DAFB", icon: "⚛️"},
		{name: "Node.js", color: "#68A063", icon: "🟢"},
		{name: "JavaScript", color: "#F7DF1E", icon: "⚡"},
		{name: "TypeScript", color: "#3178C6", icon: "🔷"},
		{name: "MongoDB", color: "#47A248", icon: "🍃"},
		{name: "Docker", color: "#2496ED", icon: "🐳"},
		{name: "AWS", color: "#FF9900", icon: "☁️"},
		{name: "Next.js", color: "#000000", icon: "▲"},
		{name: "Express", color: "#000000", icon: "🚀"},
	];

	// Darker background patterns for project cards
	const backgroundPatterns = [
		"linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.02) 100%)",
		"linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(219, 39, 119, 0.02) 100%)",
		"linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.02) 100%)",
		"linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.02) 100%)",
		"linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.02) 100%)",
		"linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.02) 100%)",
	];

	// Tech stack persistence functions
	// Note: In Claude.ai artifacts, localStorage is not supported
	// In a real environment, these functions would work with localStorage
	const saveProjectTechStack = (projectId, techStack) => {
		try {
			// localStorage.setItem(`project_${projectId}_stack`, JSON.stringify(techStack));
			// For now, we'll store in component state as a fallback
			console.log(`Would save tech stack for project ${projectId}:`, techStack);
		} catch (error) {
			console.log("Storage not available in this environment");
		}
	};

	const getProjectTechStack = (projectId) => {
		try {
			// const stored = localStorage.getItem(`project_${projectId}_stack`);
			// return stored ? JSON.parse(stored) : getRandomTechStack();
			// Fallback: return random tech stack for demo
			return getRandomTechStack();
		} catch (error) {
			return getRandomTechStack();
		}
	};

	const getRandomTechStack = () => {
		// const shuffled = [...techStacks].sort(() => 0.5 - Math.random());
		// return shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
	};

	function createProject(e) {
		if (e) e.preventDefault();
		if (!projectName.trim()) return;

		setIsCreating(true);

		axios
			.post("/projects/create", {
				name: projectName,
			})
			.then((res) => {
				console.log(res.data);
				// Save tech stack for the new project
				if (res.data._id) {
					saveProjectTechStack(res.data._id, selectedStack);
				}
				setIsModalOpen(false);
				setProjectName("");
				setSelectedStack([]);
				fetchProjects();
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				setIsCreating(false);
			});
	}

	function handleEditProject(project, e) {
		e.stopPropagation();
		setEditingProject(project);
		setEditName(project.name);
		setEditStack(getProjectTechStack(project._id));
		setIsEditModalOpen(true);
	}

	function saveEditProject() {
		if (!editName.trim()) return;

		// Save tech stack
		saveProjectTechStack(editingProject._id, editStack);

		// Update project name if needed (you might want to add an API endpoint for this)
		console.log("Would update project:", {name: editName, stack: editStack});

		setIsEditModalOpen(false);
		setEditingProject(null);
		setEditName("");
		setEditStack([]);
		fetchProjects();
	}

	function toggleStackSelection(stack) {
		setSelectedStack((prev) => {
			if (prev.find((s) => s.name === stack.name)) {
				return prev.filter((s) => s.name !== stack.name);
			} else {
				return [...prev, stack];
			}
		});
	}

	function toggleEditStackSelection(stack) {
		setEditStack((prev) => {
			if (prev.find((s) => s.name === stack.name)) {
				return prev.filter((s) => s.name !== stack.name);
			} else {
				return [...prev, stack];
			}
		});
	}

	function fetchProjects() {
		axios
			.get("/projects/all")
			.then((res) => {
				setProjects(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		fetchProjects();
	}, []);

	return (
		<main className="min-h-screen bg-black text-white p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
							My Projects
						</h1>
						<p className="text-gray-500">
							Manage and explore your development projects
						</p>
					</div>
					<button
						className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-gray-800"
						onClick={() => setIsModalOpen(true)}
					>
						<span className="text-xl">+</span>
						New Project
						<div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
					</button>
				</div>

				{/* Projects Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((project, index) => {
						const projectStack = getProjectTechStack(project._id);
						return (
							<div
								key={project._id}
								className="group relative bg-gray-950 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer overflow-hidden border border-gray-800 hover:border-gray-700"
								style={{
									background: `linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(0, 0, 0) 100%), ${
										backgroundPatterns[index % backgroundPatterns.length]
									}`,
								}}
								onClick={() =>
									navigate(`/project`, {
										state: {project},
									})
								}
							>
								{/* Code-like pattern overlay */}
								<div className="absolute inset-0 opacity-3">
									<svg
										width="100%"
										height="100%"
										viewBox="0 0 100 100"
										className="text-gray-700"
									>
										<defs>
											<pattern
												id={`code-pattern-${index}`}
												x="0"
												y="0"
												width="40"
												height="20"
												patternUnits="userSpaceOnUse"
											>
												<text
													x="2"
													y="12"
													fontSize="8"
													fill="currentColor"
													fontFamily="monospace"
												>
													{"</>"}
												</text>
											</pattern>
										</defs>
										<rect
											width="100%"
											height="100%"
											fill={`url(#code-pattern-${index})`}
										/>
									</svg>
								</div>

								{/* Edit Button */}
								<button
									className="absolute top-3 right-3 w-8 h-8 bg-gray-900/80 hover:bg-gray-800 rounded-lg border border-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
									onClick={(e) => handleEditProject(project, e)}
									title="Edit project"
								>
									<svg
										className="w-4 h-4 text-gray-400 hover:text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
								</button>

								{/* Content */}
								<div className="relative p-6">
									{/* Project Header */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
												<span className="text-xs font-mono text-gray-500">
													ACTIVE
												</span>
											</div>
											<h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors font-mono truncate">
												{project.name}
											</h3>
											<p className="text-sm text-gray-500 font-mono">
												{project.createdAt
													? new Date(project.createdAt).toLocaleDateString()
													: "Recently created"}
											</p>
										</div>
									</div>

									{/* Collaborators */}
									<div className="mb-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<svg
													className="w-4 h-4 text-gray-500"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
													/>
												</svg>
												<span className="text-xs font-mono text-gray-500">
													TEAM
												</span>
											</div>
										</div>
									</div>

									{/* File Explorer Style */}
									<div className="mb-4 p-3 bg-gray-950/70 rounded-lg border border-gray-800">
										<div className="flex items-center gap-2 mb-2">
											<svg
												className="w-4 h-4 text-blue-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
											</svg>
											<span className="text-xs font-mono text-gray-500">
												src/
											</span>
										</div>
										<div className="space-y-1">
											<div className="flex items-center gap-2 text-xs font-mono text-gray-600">
												<span className="text-gray-700">├──</span>
												<span>components/</span>
											</div>
											<div className="flex items-center gap-2 text-xs font-mono text-gray-600">
												<span className="text-gray-700">├──</span>
												<span>pages/</span>
											</div>
											<div className="flex items-center gap-2 text-xs font-mono text-gray-600">
												<span className="text-gray-700">└──</span>
												<span>app.js</span>
											</div>
										</div>
									</div>

									{/* Tech Stack */}
									{/* <div className="mb-4">
										<div className="flex items-center gap-2 mb-2">
											<svg
												className="w-4 h-4 text-gray-500"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
												/>
											</svg>
											<span className="text-xs font-mono text-gray-500">
												STACK
											</span>
										</div>
										<div className="flex flex-wrap gap-2">
											{projectStack.map((tech) => (
												<div
													key={tech.name}
													className="flex items-center gap-1 px-2 py-1 rounded bg-gray-900 border border-gray-800 text-xs font-mono text-gray-300"
												>
													<span>{tech.icon}</span>
													{tech.name}
												</div>
											))}
										</div>
									</div> */}

									{/* Action Area */}
									<div className="flex items-center justify-between pt-4 border-t border-gray-800">
										<span className="text-xs font-mono text-gray-600">
											$ open project
										</span>
										<div className="flex items-center gap-2">
											<div className="w-1 h-1 rounded-full bg-gray-600 animate-pulse"></div>
											<svg
												className="w-4 h-4 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 7l5 5m0 0l-5 5m5-5H6"
												/>
											</svg>
										</div>
									</div>
								</div>

								{/* Glow effect on hover */}
								<div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"></div>
							</div>
						);
					})}
				</div>

				{projects.length === 0 && (
					<div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-xl">
						<div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-950 flex items-center justify-center border border-gray-800">
							<svg
								className="w-12 h-12 text-gray-700"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
						</div>
						<h3 className="text-lg font-mono font-bold text-gray-400 mb-2">
							~/projects empty
						</h3>
						<p className="text-gray-600 font-mono text-sm mb-4">
							Initialize your first repository
						</p>
						<code className="text-xs text-blue-400 bg-gray-950 px-3 py-1 rounded border border-gray-800">
							git init my-project
						</code>
					</div>
				)}
			</div>

			{/* Create Project Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 backdrop-blur-sm">
					<div className="bg-gray-950 rounded-xl shadow-2xl p-4 w-full max-w-lg mx-4 transform transition-all duration-300 scale-100 border border-gray-800 max-h-[80vh] overflow-y-auto">
						{/* Header */}
						<div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
							<div className="flex items-center gap-2">
								<div className="flex gap-1">
									<div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
								</div>
								<h2 className="text-lg font-mono font-bold text-white">
									new-project.config
								</h2>
							</div>
							<button
								onClick={() => setIsModalOpen(false)}
								className="w-7 h-7 rounded bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors border border-gray-700"
							>
								<svg
									className="w-3.5 h-3.5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						{/* Content */}
						<div className="space-y-4">
							{/* Project Name */}
							<div>
								<label className="mb-2 text-sm font-mono font-semibold text-gray-300 flex items-center gap-1">
									<span className="text-blue-400">const</span>
									<span className="text-yellow-400">projectName</span>
									<span className="text-gray-500">=</span>
								</label>
								<input
									onChange={(e) => setProjectName(e.target.value)}
									value={projectName}
									type="text"
									className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white font-mono text-sm placeholder-gray-500"
									placeholder='"my-awesome-project"'
									required
								/>
							</div>

							{/* Tech Stack */}
							<div>
								<label className="mb-2 text-sm font-mono font-semibold text-gray-300 flex items-center gap-1">
									<span className="text-blue-400">const</span>
									<span className="text-yellow-400">techStack</span>
									<span className="text-gray-500">= [</span>
								</label>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 max-h-40 overflow-y-auto">
									{techStacks.map((stack) => (
										<button
											key={stack.name}
											type="button"
											onClick={() => toggleStackSelection(stack)}
											className={`flex items-center gap-1 p-2 rounded-md border transition-all duration-200 font-mono text-sm ${
												selectedStack.find((s) => s.name === stack.name)
													? "border-blue-500 bg-blue-500/10 text-blue-400"
													: "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600 hover:bg-gray-800"
											}`}
										>
											<span className="text-base">{stack.icon}</span>
											<span>{stack.name}</span>
										</button>
									))}
								</div>
								<div className="text-xs font-mono text-gray-600 mt-1">
									<span className="text-gray-500">
										]; // Selected: {selectedStack.length}
									</span>
								</div>
							</div>

							{/* Footer */}
							<div className="flex flex-col md:flex-row justify-between items-center pt-3 border-t border-gray-800 gap-2 md:gap-0">
								<div className="text-xs font-mono text-gray-600 mb-2 md:mb-0">
									$ npm create project --stack{" "}
									{selectedStack.map((s) => s.name.toLowerCase()).join(" ")}
								</div>
								<div className="flex gap-2 md:gap-3">
									<button
										type="button"
										className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-md font-mono transition-all duration-200 border border-gray-700 text-sm"
										onClick={() => setIsModalOpen(false)}
										disabled={isCreating}
									>
										Cancel
									</button>
									<button
										type="button"
										disabled={isCreating || !projectName.trim()}
										className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-md font-mono transition-all duration-200 flex items-center gap-2 text-sm"
										onClick={createProject}
									>
										{isCreating ? (
											<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										) : (
											<>
												<span>Create</span>
												<span className="text-green-400">→</span>
											</>
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Edit Project Modal */}
			{isEditModalOpen && editingProject && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 backdrop-blur-sm">
					<div className="bg-gray-950 rounded-xl shadow-2xl p-4 w-full max-w-lg mx-4 transform transition-all duration-300 scale-100 border border-gray-800 max-h-[80vh] overflow-y-auto">
						{/* Header */}
						<div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
							<div className="flex items-center gap-2">
								<div className="flex gap-1">
									<div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
									<div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
								</div>
								<h2 className="text-lg font-mono font-bold text-white">
									edit-project.config
								</h2>
							</div>
							<button
								onClick={() => setIsEditModalOpen(false)}
								className="w-7 h-7 rounded bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors border border-gray-700"
							>
								<svg
									className="w-3.5 h-3.5 text-gray-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						{/* Content */}
						<div className="space-y-4">
							{/* Project Name */}
							<div>
								<label className="mb-2 text-sm font-mono font-semibold text-gray-300 flex items-center gap-1">
									<span className="text-blue-400">const</span>
									<span className="text-yellow-400">projectName</span>
									<span className="text-gray-500">=</span>
								</label>
								<input
									onChange={(e) => setEditName(e.target.value)}
									value={editName}
									type="text"
									className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white font-mono text-sm placeholder-gray-500"
									placeholder='"my-awesome-project"'
									required
								/>
							</div>

							{/* Tech Stack */}
							<div>
								<label className="mb-2 text-sm font-mono font-semibold text-gray-300 flex items-center gap-1">
									<span className="text-blue-400">const</span>
									<span className="text-yellow-400">techStack</span>
									<span className="text-gray-500">= [</span>
								</label>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 max-h-40 overflow-y-auto">
									{techStacks.map((stack) => (
										<button
											key={stack.name}
											type="button"
											onClick={() => toggleEditStackSelection(stack)}
											className={`flex items-center gap-1 p-2 rounded-md border transition-all duration-200 font-mono text-sm ${
												editStack.find((s) => s.name === stack.name)
													? "border-blue-500 bg-blue-500/10 text-blue-400"
													: "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600 hover:bg-gray-800"
											}`}
										>
											<span className="text-base">{stack.icon}</span>
											<span>{stack.name}</span>
										</button>
									))}
								</div>
								<div className="text-xs font-mono text-gray-600 mt-1">
									<span className="text-gray-500">
										]; // Selected: {editStack.length}
									</span>
								</div>
							</div>

							{/* Footer */}
							<div className="flex flex-col md:flex-row justify-between items-center pt-3 border-t border-gray-800 gap-2 md:gap-0">
								<div className="text-xs font-mono text-gray-600 mb-2 md:mb-0">
									$ npm update project --stack{" "}
									{editStack.map((s) => s.name.toLowerCase()).join(" ")}
								</div>
								<div className="flex gap-2 md:gap-3">
									<button
										type="button"
										className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-md font-mono transition-all duration-200 border border-gray-700 text-sm"
										onClick={() => setIsEditModalOpen(false)}
									>
										Cancel
									</button>
									<button
										type="button"
										disabled={!editName.trim()}
										className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 text-white rounded-md font-mono transition-all duration-200 flex items-center gap-2 text-sm"
										onClick={saveEditProject}
									>
										<span>Save</span>
										<span className="text-green-400">✓</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</main>
	);
};

export default Projects;

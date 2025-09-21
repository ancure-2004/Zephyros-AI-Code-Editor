import React from "react";
import { useState, useContext } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";

const Projects = () => {
	const { user } = useContext(UserContext);

	const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");

	function createProject(e) {
        e.preventDefault();
        
        axios.post('/projects/create', {
            name: projectName,
        }).then((res) => {
            console.log(res.data);
            setIsModalOpen(false);
        }).catch((err) => {
            console.log(err);
        });

        console.log({projectName});
	}

	return (
		<main className="p-4">
			<div className="projects">
				<button
					className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
					onClick={() => setIsModalOpen(true)}
				>
					Create New Project
				</button>
			</div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                        <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
                        <form
                            onSubmit={createProject}
                        >
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Project Name
                            </label>
                            <input
                                onChange={(e) => setProjectName(e.target.value)}
                                value={projectName}
                                type="text"
                                className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                placeholder="Enter project name"
                                required
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
		</main>
	);
};

export default Projects;

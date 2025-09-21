import mongoose from "mongoose";
import projectModel from "../models/project.model.js";


export const createProject = async ({
    name, userId
}) => {
    if(!name) throw new Error("Project name is required");
    if(!userId) throw new Error("User ID is required");

    try {
        const project = await projectModel.create({
            name,
            users: [userId]
        });
        return project;
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
            throw new Error("Project name already exists");
        }
        throw error;
    }
};

export const getAllProjects = async (userId) => {
    if(!userId) throw new Error("User ID is required");

    try {
        const projects = await projectModel.find({ users: userId });
        return projects;
    } catch (error) {
        throw error;
    }
};

export const addUserToProject = async ({ projectId, users, userId }) => {

    if(!projectId) throw new Error("Project ID is required");
    
    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID");
    }

    if(!users || users.length === 0) throw new Error("Users array is required");

    if(!Array.isArray(users) || users.some(userId => 
        !mongoose.Types.ObjectId.isValid(userId)
    )) {
        throw new Error("Invalid User ID(s)");
    }

    if(!userId) throw new Error("Requesting User ID is required");

    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid Requesting User ID");
    }

    try {
        const project = await projectModel.findOne({
            _id: projectId,
            users: userId
        });

        if (!project) throw new Error("User is not a member of this project");

        const updatedProject = await projectModel.findOneAndUpdate(
            { _id: projectId },
            { $addToSet: { users: { $each: users } } },
            { new: true }
        );

        return updatedProject;

    } catch (error) {
        throw error;
    }
};

export const getProjectById = async ({projectId}) => {

    if(!projectId) throw new Error("Project ID is required");
    
    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID");
    }

    const project = await projectModel.findOne({_id: projectId}).populate('users');

    console.log(project);

    return project;
};

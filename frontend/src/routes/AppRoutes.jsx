import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Projects from '../screens/Projects'
import Project from '../screens/Project'
import UserAuth from '../auth/UserAuth'
import PublicRoute from './PublicRoutes'
import {GoogleOAuthProvider} from "@react-oauth/google";

const AppRoutes = () => {

    return (
        
        <GoogleOAuthProvider clientId="32077272735-jhdqfr9hdj44al264u4v0ve0o3ig0v0m.apps.googleusercontent.com">
            <BrowserRouter>

                <Routes>
                    <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/projects" element={<UserAuth><Projects /></UserAuth>} />
                    <Route path="/project" element={<UserAuth><Project /></UserAuth>} />
                </Routes>

            </BrowserRouter>
        </GoogleOAuthProvider>

    )
}

export default AppRoutes
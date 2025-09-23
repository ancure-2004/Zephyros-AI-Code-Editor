import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Home from '../screens/Home'
import Projects from '../screens/Projects'
import Project from '../screens/Project'
import UserAuth from '../auth/UserAuth'

const AppRoutes = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/projects" element={<UserAuth><Projects /></UserAuth>} />
                <Route path="/project" element={<UserAuth><Project /></UserAuth>} />
            </Routes>

        </BrowserRouter>
    )
}

export default AppRoutes
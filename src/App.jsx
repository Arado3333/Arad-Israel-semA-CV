import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Outlet,
    Navigate,
} from "react-router-dom";
import DashboardLayoutBranding from "./components/DashboardSidebarAccountFooter.jsx";
import Home from "./pages/Home";
import Map from "./pages/map";
import Chat from "./pages/chat";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";

function DashboardLayout() {
    return (
        <DashboardLayoutBranding>
            <Outlet />
        </DashboardLayoutBranding>
    );
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        JSON.parse(localStorage.getItem("isAuthenticated")) || false
    );

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/home" />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/login"
                    element={<Login onLogin={handleLogin} />}
                />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <DashboardLayout />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                >
                    <Route path="home" element={<Home />} />
                    <Route path="map" element={<Map />} />
                    <Route path="chat" element={<Chat />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;

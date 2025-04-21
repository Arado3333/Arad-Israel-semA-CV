import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Outlet,
    Navigate,
} from "react-router-dom";
import DashboardLayoutBranding from "./components/DashboardSidebarAccountFooter.jsx";
import Map from "./pages/MyCV.jsx";
import Chat from "./pages/chat";
import EditProfile from "./pages/EditProfile";
import Logout from "./pages/Logout"; // Import the Logout component
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";

function DashboardLayout({ onLogout }) {
    return (
        <DashboardLayoutBranding onLogout={onLogout}>
            <Outlet />
        </DashboardLayoutBranding>
    );
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        JSON.parse(localStorage.getItem("isAuthenticated")) || false
    );
    
    const [currentUser, setCurrentUser] = useState(
        localStorage.getItem("currentUsername") || ""
    );

    const handleLogin = (username) => {
        setIsAuthenticated(true);
        setCurrentUser(username);
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("currentUsername", username);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser("");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("currentUsername");
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/map" />
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
                            <DashboardLayout onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                >
                    <Route path="map" element={<Map />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="profile/edit" element={<EditProfile username={currentUser} />} />
                    <Route path="logout" element={<Logout />} /> {/* Add the Logout route */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;

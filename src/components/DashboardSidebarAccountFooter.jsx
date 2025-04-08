import PropTypes from "prop-types";
import { Routes, Route } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { useContext } from "react";  

import HomePage from "../pages/Home";
import MapPage from "../pages/map";
import ChatPage from "../pages/chat";
import Login from "../pages/Login";

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

const NAVIGATION = [
    {
        kind: "header",
        title: "Main items",
    },
    {
        segment: "home",
        title: "Home",
    },
    {
        segment: "map",
        title: "Map",
    },
    {
        segment: "chat",
        title: "Chat",
    },
    {
        segment: "login",
        title: "Logout",
    }
];

function DashboardLayoutBranding(props) {
    const { window } = props;
    const demoWindow = window !== undefined ? window() : undefined;
    
    return (
        <AppProvider
            navigation={NAVIGATION}
            branding={{
                logo: <img src="../src/assets/11.jpeg" alt="israel" />,
                title: "israel",
                homeUrl: "/toolpad/core/introduction",
            }}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout>
                <Routes>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </DashboardLayout>
        </AppProvider>
    );
}

DashboardLayoutBranding.propTypes = {
    window: PropTypes.func,
};

export default DashboardLayoutBranding;

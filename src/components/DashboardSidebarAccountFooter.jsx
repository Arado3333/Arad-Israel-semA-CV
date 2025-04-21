import PropTypes from "prop-types";
import { createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";

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
        segment: "map",
        title: "My CV",
    },
    {
        segment: "chat",
        title: "Chat",
    },
    {
        segment: "profile/edit",
        title: "Edit Profile",
    },
    {
        segment: "logout",
        title: "Logout",
    },
];

function DashboardLayoutBranding(props) {
    const { window, children } = props;
    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <AppProvider
            navigation={NAVIGATION}
            branding={{
                logo: <img src="../src/assets/11.jpeg" alt="israel" />,
                title: "israel",
                homeUrl: "/profile/edit",
            }}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout>{children}</DashboardLayout>
        </AppProvider>
    );
}

DashboardLayoutBranding.propTypes = {
    window: PropTypes.func,
    children: PropTypes.node,
};

export default DashboardLayoutBranding;

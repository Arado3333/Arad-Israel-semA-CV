import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Stack,
    TextField,
    Container,
    Card,
    CardContent,
    Typography,
    Box,
} from "@mui/material";

function Login({ onLogin }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [labelColor, setLabelColor] = useState("error");

    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();

        let response = await fetch("http://localhost:5001/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        let data = await response.json();
        setMessage(data?.message || "");

        if (data.success) {
            setLabelColor("success");
            onLogin(); // Update authentication state in App.jsx
            setTimeout(() => {
                navigate(`/home`);
            }, 1500);
        }
    }

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(to right, #121212, #242424)",
                margin: 0,
                padding: 0,
                overflow: "hidden",
            }}
        >
            <Container maxWidth="xs">
                <Card
                    sx={{
                        padding: 4,
                        borderRadius: 3,
                        background: "rgba(44, 44, 44, 0.9)",
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <CardContent>
                        <Typography
                            variant="h4"
                            textAlign="center"
                            mb={2}
                            sx={{ color: "#fff" }}
                        >
                            Welcome Back!
                        </Typography>
                        <Stack spacing={3}>
                            <TextField
                                label="User Name"
                                variant="outlined"
                                required
                                fullWidth
                                InputLabelProps={{ style: { color: "#aaa" } }}
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "#333",
                                        borderRadius: "8px",
                                    },
                                }}
                                value={formData.username}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        username: event.target.value,
                                    })
                                }
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                type="password"
                                required
                                fullWidth
                                InputLabelProps={{ style: { color: "#aaa" } }}
                                InputProps={{
                                    style: {
                                        color: "white",
                                        background: "#333",
                                        borderRadius: "8px",
                                    },
                                }}
                                value={formData.password}
                                onChange={(event) =>
                                    setFormData({
                                        ...formData,
                                        password: event.target.value,
                                    })
                                }
                            />
                            <Typography color={labelColor} textAlign="center">
                                {message}
                            </Typography>
                            <Button
                                onClick={handleLogin}
                                variant="contained"
                                color="primary"
                                sx={{
                                    borderRadius: "20px",
                                    padding: "10px",
                                    fontSize: "16px",
                                    background: "#1976d2",
                                    "&:hover": { background: "#125ea8" },
                                }}
                            >
                                Log In
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate("/register")}
                                sx={{
                                    borderRadius: "20px",
                                    padding: "10px",
                                    fontSize: "16px",
                                    borderColor: "#bbb",
                                    color: "#bbb",
                                    "&:hover": {
                                        background: "rgba(255,255,255,0.1)",
                                        borderColor: "#fff",
                                    },
                                }}
                            >
                                Register Page
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default Login;

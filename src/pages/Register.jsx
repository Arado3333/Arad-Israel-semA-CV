import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Card, CardContent, Typography } from "@mui/material";

function Register() {
    const [formData, setFormData] = useState({
        fName: "",
        lName: "",
        email: "",
        username: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [labelColor, setLabelColor] = useState("error");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (validateData()) {
            setMessage(""); // Clear error messages

            try {
                // Send data to the server
                let response = await fetch("http://localhost:5001/users/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                let data = await response.json();
                console.log(data);  // Log server response

                setMessage(data?.message || ""); // Display server message

                // If registration is successful, navigate to login page
                if (data.success) {
                    setTimeout(() => {
                        navigate("/login");  // Navigate to login page after 1.5 seconds
                    }, 1500);
                }
            } catch (error) {
                console.error("Error:", error);
                setMessage("An error occurred. Please try again.");
            }
        }
    }

    // פונקציה לאימות נתונים
    function validateData() {
        const { fName, lName, email, username, password } = formData;

        if (!fName || !lName || !email || !username || !password) {
            setLabelColor("error");
            setMessage("All fields are required.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setLabelColor("error");
            setMessage("Invalid email format.");
            return false;
        }

        if (password.length < 8) {
            setLabelColor("error");
            setMessage("Password must be at least 8 characters long.");
            return false;
        }

        setLabelColor("success");
        return true;
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
                        <Typography variant="h4" textAlign="center" mb={2} sx={{ color: "#fff" }}>
                            Create an Account
                        </Typography>
                        <Stack spacing={2}>
                            {[
                                { id: "tf-fName", label: "First Name", value: "fName" },
                                { id: "tf-lName", label: "Last Name", value: "lName" },
                                { id: "tf-email", label: "Email", value: "email" },
                                { id: "tf-username", label: "Username", value: "username" },
                                { id: "tf-password", label: "Password", value: "password", type: "password" },
                            ].map(({ id, label, value, type = "text" }) => (
                                <TextField
                                    key={id}
                                    id={id}
                                    label={label}
                                    variant="filled"
                                    required
                                    type={type}
                                    value={formData[value]}
                                    onChange={(event) => setFormData({ ...formData, [value]: event.target.value })}
                                    sx={{
                                        input: {
                                            color: "white",
                                            background: "#333",
                                            borderRadius: "8px",
                                        },
                                        label: {
                                            color: "#aaa",
                                        },
                                    }}
                                />
                            ))}
                            <Typography color={labelColor} textAlign="center">
                                {message}
                            </Typography>
                            <Button
                                onClick={handleSubmit}  // שליחה של הנתונים
                                variant="contained"
                                sx={{
                                    borderRadius: "20px",
                                    padding: "10px",
                                    fontSize: "16px",
                                    background: "#1976d2",
                                    "&:hover": { background: "#125ea8" },
                                }}
                            >
                                Register
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate("/login")}  // ניווט ישיר לדף ההתחברות
                                sx={{
                                    borderRadius: "20px",
                                    padding: "10px",
                                    fontSize: "10px",
                                    borderColor: "#bbb",
                                    color: "#bbb",
                                    "&:hover": {
                                        background: "rgba(255,255,255,0.1)",
                                        borderColor: "#fff",
                                    },
                                }}
                            >
                                Already have an account? Login
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default Register;

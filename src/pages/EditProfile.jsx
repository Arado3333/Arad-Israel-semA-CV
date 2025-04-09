import { useState, useEffect } from "react";
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
    Alert,
} from "@mui/material";

function EditProfile({ username }) {
    const [formData, setFormData] = useState({
        username: username,
        fName: "",
        lName: "",
        email: "",
    });
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const navigate = useNavigate();

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            if (!username) return;

            setStatus("loading");
            try {
                const response = await fetch(`http://localhost:5001/users/${username}`);
                const data = await response.json();

                if (data.success && data.user) {
                    setFormData({
                        username: username,
                        fName: data.user.fName || "",
                        lName: data.user.lName || "",
                        email: data.user.email || "",
                    });
                    setStatus("idle");
                } else {
                    setMessage(data.message || "Failed to fetch user data");
                    setStatus("error");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setMessage("Error connecting to server");
                setStatus("error");
            }
        };

        fetchUserData();
    }, [username]);

    // Handle form submission to update user profile
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setStatus("loading");
        
        try {
            const response = await fetch("http://localhost:5001/users/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setMessage(data.message || "Profile updated successfully");
                setStatus("success");
                // Update form data with the returned user data
                if (data.user) {
                    setFormData({
                        ...formData,
                        fName: data.user.fName,
                        lName: data.user.lName,
                        email: data.user.email,
                    });
                }
            } else {
                setMessage(data.message || "Failed to update profile");
                setStatus("error");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage("Error connecting to server");
            setStatus("error");
        }
    };
    
    // Validate form data
    const validateForm = () => {
        // Check for empty fields
        if (!formData.fName || !formData.lName || !formData.email) {
            setMessage("All fields are required");
            setStatus("error");
            return false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMessage("Please enter a valid email address");
            setStatus("error");
            return false;
        }
        
        return true;
    };

    // Handle form field changes
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <Box
            sx={{
                minHeight: "100vh", 
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 4,
                paddingBottom: 4,
            }}
        >
            <Container maxWidth="sm">
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
                            mb={4}
                            sx={{ color: "#fff" }}
                        >
                            Edit Profile
                        </Typography>
                        
                        {message && (
                            <Alert 
                                severity={status === "success" ? "success" : "error"}
                                sx={{ mb: 3 }}
                            >
                                {message}
                            </Alert>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <TextField
                                    label="Username"
                                    variant="outlined"
                                    fullWidth
                                    name="username"
                                    value={formData.username}
                                    disabled
                                    InputLabelProps={{ style: { color: "#aaa" } }}
                                    InputProps={{
                                        style: {
                                            color: "white",
                                            background: "#333",
                                            borderRadius: "8px",
                                            opacity: "0.7",
                                        },
                                    }}
                                />
                                
                                <TextField
                                    label="First Name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="fName"
                                    value={formData.fName}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ style: { color: "#aaa" } }}
                                    InputProps={{
                                        style: {
                                            color: "white",
                                            background: "#333",
                                            borderRadius: "8px",
                                        },
                                    }}
                                />
                                
                                <TextField
                                    label="Last Name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="lName"
                                    value={formData.lName}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ style: { color: "#aaa" } }}
                                    InputProps={{
                                        style: {
                                            color: "white",
                                            background: "#333",
                                            borderRadius: "8px",
                                        },
                                    }}
                                />
                                
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ style: { color: "#aaa" } }}
                                    InputProps={{
                                        style: {
                                            color: "white",
                                            background: "#333",
                                            borderRadius: "8px",
                                        },
                                    }}
                                />
                                
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={status === "loading"}
                                    sx={{
                                        borderRadius: "20px",
                                        padding: "10px",
                                        fontSize: "16px",
                                        background: "#1976d2",
                                        "&:hover": { background: "#125ea8" },
                                    }}
                                >
                                    {status === "loading" ? "Updating..." : "Update Profile"}
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => navigate("/map")}
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
                                    Cancel
                                </Button>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default EditProfile;
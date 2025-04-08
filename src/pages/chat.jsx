import React, { useState, useEffect } from "react";
import { HfInference } from "@huggingface/inference";
import {
    Button,
    TextField,
    Paper,
    Typography,
    Box,
    Grid,
    Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { blue } from "@mui/material/colors";

function ChatPage() {
    const sysPrompt = `Welcome to the job interview assistant! I will guide you through 10 simple questions to create your resume. Answer each question with short, precise information. What is your name?`;

    const [token] = useState(import.meta.env.VITE_HF_TOKEN);

    const [text, setText] = useState("");
    const [messages, setMessages] = useState([
        { role: "system", content: sysPrompt },
    ]);
    const [resumeData, setResumeData] = useState({
        fullName: "",
        currentRole: "",
        skills: "",
        education: "",
        teamExperience: "",
        achievements: "",
        careerGoals: "",
        hobbies: "",
        location: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
    }, [resumeData]);

    const questions = [
        "What is your full name?",
        "What is your current role?",
        "What are your skills?",
        "What is your education background?",
        "Describe your team experience.",
        "What are your achievements?",
        "What are your career goals?",
        "What are your hobbies?",
        "Where are you located?",
    ];

    const askAI = async (updatedMessages) => {
        setLoading(true);
        const client = new HfInference(token);

        try {
            const answer = await client.chatCompletion({
                model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
                messages: updatedMessages,
                temperature: 0.5,
                max_tokens: 2048,
                top_p: 0.7,
            });

            const botMessage = answer.choices[0].message;
            setMessages([...updatedMessages, botMessage]);
        } catch (error) {
            console.error("Error during AI call:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = (questionIndex) => {
        if (text.trim()) {
            const newMessage = { role: "user", content: text };
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);

            const newResumeData = { ...resumeData };

            // Ensure the questionIndex aligns with resumeData keys
            const questionKeys = Object.keys(resumeData);
            if (questionIndex < questionKeys.length) {
                const questionKey = questionKeys[questionIndex];
                newResumeData[questionKey] = text.trim(); // Save only non-empty input
            }

            setResumeData(newResumeData);
            askAI(updatedMessages);
            setText("");
        } else {
            alert("Please provide a valid response before proceeding.");
        }
    };

    const endConversation = () => {
        // Check for missing fields in resumeData
        const missingFields = Object.entries(resumeData)
            .filter(([key, value]) => !value.trim())
            .map(([key]) => key);

        if (missingFields.length > 0) {
            // If there are missing fields, ask the user to provide the missing details
            const missingQuestions = missingFields.map((field) => {
                switch (field) {
                    case "fullName":
                        return "What is your full name?";
                    case "currentRole":
                        return "What is your current role?";
                    case "skills":
                        return "What are your skills?";
                    case "education":
                        return "What is your education background?";
                    case "teamExperience":
                        return "Describe your team experience.";
                    case "achievements":
                        return "What are your achievements?";
                    case "careerGoals":
                        return "What are your career goals?";
                    case "hobbies":
                        return "What are your hobbies?";
                    case "location":
                        return "Where are you located?";
                    default:
                        return "";
                }
            });

            // Add the missing questions to the chat
            const updatedMessages = [
                ...messages,
                ...missingQuestions.map((question) => ({
                    role: "system",
                    content: question,
                })),
            ];
            setMessages(updatedMessages);

            alert(
                "Some details are missing. Please answer the additional questions to complete your resume."
            );
            return;
        }

        // If all fields are filled, proceed to save the data
        fetch("http://localhost:5001/save-resume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resumeData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to save resume data");
                }
                return response.json();
            })
            .then((data) => {
                alert("Resume data has been saved successfully!");
                localStorage.setItem("resumeData", JSON.stringify(resumeData)); // Save to localStorage
            })
            .catch((error) =>
                console.error("Error saving resume data:", error)
            );
    };

    return (
        <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Job Interview Chat
            </Typography>
            <Box sx={{ height: "60vh", overflowY: "auto", marginBottom: 2 }}>
                {messages.map((message, index) => (
                    <Box key={index} sx={{ display: "flex", marginBottom: 2 }}>
                        {message.role === "user" ? (
                            <>
                                <Avatar
                                    sx={{ bgcolor: blue[500], marginRight: 1 }}
                                >
                                    U
                                </Avatar>
                                <Box
                                    sx={{
                                        backgroundColor: "gray",
                                        padding: 1,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography>{message.content}</Typography>
                                </Box>
                            </>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        backgroundColor: "black",
                                        padding: 1,
                                        borderRadius: 2,
                                        marginLeft: "auto",
                                    }}
                                >
                                    <Typography>{message.content}</Typography>
                                </Box>
                                <Avatar
                                    sx={{ bgcolor: "grey.500", marginLeft: 1 }}
                                >
                                    A
                                </Avatar>
                            </>
                        )}
                    </Box>
                ))}
            </Box>

            {/* <Typography variant="h6" align="center" gutterBottom>
                {questions[messages.length - 1]?.role === "system"
                    ? questions[0]
                    : questions[messages.length] || ""}
            </Typography> */}

            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <TextField
                        fullWidth
                        label="Type your response"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={loading}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => sendMessage(messages.length)}
                        fullWidth
                        startIcon={<SendIcon />}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Send"}
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={endConversation}
                        fullWidth
                    >
                        End Conversation
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default ChatPage;

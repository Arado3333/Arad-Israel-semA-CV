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
    const sysPrompt = `Welcome to the job interview assistant! I'll guide you through several questions to create your professional resume. I'll help you format your responses into a polished CV when we're done.`;

    const [token] = useState(import.meta.env.VITE_HF_TOKEN);

    const [text, setText] = useState("");
    const [messages, setMessages] = useState([
        { role: "assistant", content: sysPrompt },
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
        summary: "", // Added field for AI-generated professional summary
        jobHistory: "", // Added field for structured work experience
        keyQualifications: "", // Added field for highlighted qualifications
    });
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track which question we're on
    const [loading, setLoading] = useState(false);
    const [userResponses, setUserResponses] = useState([]); // Track all user responses for AI processing

    useEffect(() => {
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
    }, [resumeData]);

    // Initialize chat with first question
    useEffect(() => {
        // Add the first question to messages after a short delay
        const timer = setTimeout(() => {
            const firstQuestion = {
                role: "assistant",
                content: questions[0],
            };
            setMessages((prevMessages) => [...prevMessages, firstQuestion]);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

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

    // Field names corresponding to each question
    const fieldNames = [
        "fullName",
        "currentRole",
        "skills",
        "education",
        "teamExperience",
        "achievements",
        "careerGoals",
        "hobbies",
        "location",
    ];

    const askNextQuestion = () => {
        // Check if we have more questions to ask
        if (currentQuestionIndex < questions.length - 1) {
            const nextQuestionIndex = currentQuestionIndex + 1;
            const nextQuestion = {
                role: "assistant",
                content: questions[nextQuestionIndex],
            };

            setMessages((prevMessages) => [...prevMessages, nextQuestion]);
            setCurrentQuestionIndex(nextQuestionIndex);
            setLoading(false);
        } else if (currentQuestionIndex === questions.length - 1) {
            // If all questions are answered, process with AI
            const processingMessage = {
                role: "assistant",
                content:
                    "Thank you for providing all the information. I'm now processing your responses to create a professional CV summary...",
            };
            setMessages((prevMessages) => [...prevMessages, processingMessage]);
            setCurrentQuestionIndex((nextIndex) => nextIndex + 1); // Move to a final state

            // Process with AI
            processWithAI();
        }
    };

    // We need to use AI for the final processing step
    const processUserResponse = (updatedMessages) => {
        setLoading(true);
        // Add a simple acknowledgment response
        setTimeout(() => {
            askNextQuestion();
        }, 500); // Short delay to simulate processing
    };

    // Process all user responses with AI to create professional CV content
    const processWithAI = async () => {
        setLoading(true);
        const client = new HfInference(token);

        // Construct AI prompt with all user responses
        const aiPrompt = constructAIPrompt();

        try {
            // Make AI call with constructed prompt
            const answer = await client.chatCompletion({
                model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a professional CV writer. Transform the user's interview responses into concise, professional CV content. Capitalize names of cities, businesses, and the start of sentences. Use a professional tone similar to the example provided.",
                    },
                    { role: "user", content: aiPrompt },
                ],
                temperature: 0.7,
                max_tokens: 2048,
                top_p: 0.9,
            });

            const aiResponse = answer.choices[0].message.content;

            // Parse the AI response and update resumeData
            processAIResponse(aiResponse);

            // Display the finalization message
            const completionMessage = {
                role: "assistant",
                content:
                    "I've processed your information into professional CV content! You can now click 'End Conversation' to save your resume data.",
            };
            setMessages((prevMessages) => [...prevMessages, completionMessage]);
        } catch (error) {
            console.error("Error during AI processing:", error);
            const errorMessage = {
                role: "assistant",
                content:
                    "I encountered an error while processing your resume. You can still save your responses by clicking 'End Conversation'.",
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    // Construct prompt for AI with all user responses
    const constructAIPrompt = () => {
        let prompt =
            "Create professional CV content from these interview responses. Capitalize only the first letter of each sentence. Use a professional tone similar to the example provided below:\n\n";

        // Example CV tone
        prompt += `Example:\n
        Full Name: Israel Aniti
        Current Role: CEO of Tech Innovations Inc.
        Skills: Leadership, Strategic Planning, Software Development, AI, Machine Learning, Business Development, Risk Management, Public Speaking
        Education: M.Sc. in Computer Science from Tel Aviv University, MBA from Stanford University
        Team Experience: Led a team of over 500 engineers across multiple continents. Successfully scaled operations and expanded to 10 countries.
        Achievements: Built and sold a tech startup for $500M. Developed cutting-edge AI solutions for Fortune 500 companies. Speaker at global tech conferences.
        Career Goals: To continue leading innovation in the tech industry, focusing on AI and sustainable tech solutions. Aspires to create the next unicorn in the tech sector.
        Hobbies: Investing in startups, traveling the world, playing chess, and mentoring young entrepreneurs.
        Location: Silicon Valley, USA\n\n`;

        // Add all the fields from resumeData
        Object.entries(resumeData).forEach(([key, value]) => {
            if (value) {
                const questionIndex = fieldNames.indexOf(key);
                const question = questionIndex >= 0 ? questions[questionIndex] : key;
                prompt += `${question}\nResponse: ${value}\n\n`;
            }
        });

        prompt += "Based on these responses, please create:\n";
        prompt += "1. A professional summary (2-3 sentences)\n";
        prompt += "2. Structured job history highlights\n";
        prompt += "3. Key qualifications/skills section (bullet points)\n";
        prompt += "4. Beautify all other fields individually.\n";
        prompt += "Format your response like this:\n";
        prompt += "SUMMARY: [professional summary]\n";
        prompt += "JOB_HISTORY: [structured work experience]\n";
        prompt += "KEY_QUALIFICATIONS: [qualifications and skills]\n";

        return prompt;
    };

    // Process the AI response to extract formatted sections
    const processAIResponse = (aiResponse) => {
        // Extract sections using regex
        const summaryMatch = aiResponse.match(/SUMMARY:(.*?)(?=JOB_HISTORY:|$)/s);
        const jobHistoryMatch = aiResponse.match(/JOB_HISTORY:(.*?)(?=KEY_QUALIFICATIONS:|$)/s);
        const qualificationsMatch = aiResponse.match(/KEY_QUALIFICATIONS:(.*?)(?=$)/s);

        // Parse job history into specific fields
        const jobHistory = jobHistoryMatch ? jobHistoryMatch[1].trim() : "";
        const parsedJobHistory = parseJobHistory(jobHistory);

        // Parse key qualifications into specific fields
        const keyQualifications = qualificationsMatch ? qualificationsMatch[1].trim() : "";
        const parsedKeyQualifications = parseKeyQualifications(keyQualifications);

        // Shorten the professional summary to 3 sentences
        const fullSummary = summaryMatch ? summaryMatch[1].trim() : "";
        const shortenedSummary = fullSummary
            .split(". ")
            .slice(0, 3)
            .join(". ") + ".";

        // Move teamExperience to skills if it contains skills-related content
        const updatedSkills = `${capitalizeSentences(parsedKeyQualifications.skills || "")} ${
            capitalizeSentences(parsedJobHistory.teamExperience || "")
        }`.trim();

        // Update resumeData with AI-generated content
        setResumeData((prevData) => ({
            ...prevData,
            summary: capitalizeSentences(shortenedSummary),
            skills: updatedSkills || prevData.skills,
            education: capitalizeSentences(prevData.education),
            teamExperience: capitalizeSentences(parsedJobHistory.teamExperience || prevData.teamExperience),
            achievements: capitalizeSentences(parsedJobHistory.achievements || prevData.achievements),
            careerGoals: capitalizeSentences(prevData.careerGoals),
            hobbies: capitalizeSentences(prevData.hobbies),
            location: capitalizeSentences(prevData.location),
        }));
    };

    // Helper function to parse job history
    const parseJobHistory = (jobHistory) => {
        const teamExperienceMatch = jobHistory.match(/Team Experience:(.*?)(?=Achievements:|$)/s);
        const achievementsMatch = jobHistory.match(/Achievements:(.*?)(?=$)/s);

        return {
            teamExperience: teamExperienceMatch ? teamExperienceMatch[1].trim() : "",
            achievements: achievementsMatch ? achievementsMatch[1].trim() : "",
        };
    };

    // Helper function to parse key qualifications
    const parseKeyQualifications = (keyQualifications) => {
        const skillsMatch = keyQualifications.match(/Skills:(.*?)(?=$)/s);

        return {
            skills: skillsMatch ? skillsMatch[1].trim() : "",
        };
    };

    const capitalizeSentences = (text) => {
        if (!text) return "";
        return text
            .split(". ")
            .map((sentence) => sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase())
            .join(". ");
    };

    const sendMessage = () => {
        if (text.trim()) {
            const newMessage = { role: "user", content: text };
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);

            // Add response to userResponses array for later AI processing
            setUserResponses((prev) => [...prev, text]);

            // Update the resumeData with the current response
            if (currentQuestionIndex < fieldNames.length) {
                const field = fieldNames[currentQuestionIndex];
                setResumeData((prevData) => ({
                    ...prevData,
                    [field]: text,
                }));
            }

            processUserResponse(updatedMessages);
            setText("");
        } else {
            alert("Please provide a valid response before proceeding.");
        }
    };

    const endConversation = () => {
        // Add AI-generated summaries to messages for the user to see
        if (resumeData.summary || resumeData.keyQualifications) {
            const summaryMessage = {
                role: "assistant",
                content: `Here's your professional CV summary:\n\n${resumeData.summary}\n\nKey Qualifications:\n${resumeData.keyQualifications}`,
            };
            setMessages((prevMessages) => [...prevMessages, summaryMessage]);
        }

        // Send the resume data to the server
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
                // Add a message from the bot confirming the save
                const saveConfirmation = {
                    role: "assistant",
                    content:
                        "Your resume data has been saved successfully! Thank you for completing the interview.",
                };
                setMessages((prevMessages) => [
                    ...prevMessages,
                    saveConfirmation,
                ]);

                localStorage.setItem("resumeData", JSON.stringify(resumeData)); // Save to localStorage
            })
            .catch((error) => {
                console.error("Error saving resume data:", error);
                // Add error message from the bot
                const errorMessage = {
                    role: "assistant",
                    content:
                        "I'm sorry, there was an error saving your resume data. Please try again later.",
                };
                setMessages((prevMessages) => [...prevMessages, errorMessage]);
            });
    };

    return (
        <Paper elevation={3} sx={{ 
            padding: 3, 
            margin: 3,
            // Only add z-index to buttons but don't change overflow behavior
            "& .MuiButtonBase-root": {
                position: "relative",
                zIndex: 10
            }
        }}>
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
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography data-cy="user-message">{message.content}</Typography>
                                </Box>
                            </>
                        ) : message.role === "system" ? (
                            <>
                                <Box
                                    sx={{
                                        backgroundColor: "black",
                                        padding: 1,
                                        borderRadius: 2,
                                        marginLeft: "auto"
                                    }}
                                >
                                    <Typography data-cy="system-message">{message.content}</Typography>
                                </Box>
                                <Avatar
                                    sx={{ bgcolor: "grey.500", marginLeft: 1 }}
                                >
                                    A
                                </Avatar>
                            </>
                        ) : (
                            <>
                                <Box
                                    sx={{
                                        backgroundColor: "black",
                                        padding: 1,
                                        borderRadius: 2,
                                        marginLeft: "auto"
                                    }}
                                >
                                    <Typography data-cy="assistant-message">{message.content}</Typography>
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

            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <TextField
                        fullWidth
                        label="Type your response"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !loading) {
                                sendMessage(); // Trigger the sendMessage function
                            }
                        }}
                        disabled={loading}
                        data-cy="chat-input"
                        inputProps={{ "data-cy": "chat-input-field" }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendMessage}
                        fullWidth
                        startIcon={<SendIcon />}
                        disabled={loading}
                        data-cy="send-button"
                    >
                        {loading ? "Loading..." : "Send"}
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ 
                marginTop: 2, 
                position: "relative",
                "& .MuiButton-root": {
                    zIndex: 10
                } 
            }}>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={endConversation}
                        fullWidth
                        disabled={currentQuestionIndex <= questions.length - 1}
                        data-cy="end-conversation-button"
                        sx={{ 
                            position: "relative",
                            zIndex: 20
                        }}
                    >
                        End Conversation
                    </Button>
                </Grid>
            </Grid>

            {/* Display progress indicator */}
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                    Question{" "}
                    {Math.min(currentQuestionIndex + 1, questions.length)} of{" "}
                    {questions.length}
                </Typography>
            </Box>
        </Paper>
    );
}

export default ChatPage;

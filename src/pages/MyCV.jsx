import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Divider,
    Box,
    Button,
} from "@mui/material";

function MapPage() {
    const [cvData, setCvData] = useState([]); // Store all CVs
    const [loading, setLoading] = useState(true);

    // Fetch CV data from the server
    useEffect(() => {
        const fetchCvData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5001/get-resume"
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch CV data");
                }
                const data = await response.json();
                setCvData(data); // Store all CV entries
            } catch (error) {
                console.error("Error fetching CV data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCvData();
    }, []);

    // Delete a CV by ID
    const deleteCv = async (index) => {
        try {
            const response = await fetch(
                `http://localhost:5001/delete-resume/${index}`,
                {
                    method: "DELETE",
                }
            );
            const result = await response.json();
            if (result.success) {
                // Remove the deleted CV from the state
                setCvData((prevData) => prevData.filter((_, i) => i !== index));
            } else {
                console.error("Failed to delete CV:", result.message);
            }
        } catch (error) {
            console.error("Error deleting CV:", error);
        }
    };

    if (loading) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                Loading CVs...
            </Typography>
        );
    }

    if (!cvData || cvData.length === 0) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No CV data available. Please complete the chat first.
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, margin: "auto", padding: 4, overflow: "visible" }}>
            {cvData.map((resumeData, index) => (
                <Card
                    key={index}
                    sx={{
                        marginBottom: 4,
                        padding: 4,
                        borderRadius: 2,
                        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                        position: "relative",
                        overflow: "visible"
                    }}
                >
                    <CardContent sx={{ overflow: "visible" }}>
                        {/* Header Section */}
                        <Box sx={{ textAlign: "left", marginBottom: 4 }}>
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                {resumeData.fullName ||
                                    "Full Name Not Provided"}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {resumeData.location || "Location Not Provided"}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {resumeData.currentRole ||
                                    "Current Role Not Provided"}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Professional Summary Section */}
                        <Box sx={{ marginBottom: 4 }}>
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                PROFESSIONAL SUMMARY
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {resumeData.summary ||
                                    "A brief professional summary is not provided."}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Work History Section */}
                        <Box sx={{ marginBottom: 4 }}>
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                WORK HISTORY
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {resumeData.teamExperience ||
                                    "Work history details are not provided."}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Education Section */}
                        <Box sx={{ marginBottom: 4 }}>
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                EDUCATION
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {resumeData.education ||
                                    "Education details are not provided."}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Skills Section */}
                        <Box sx={{ marginBottom: 4, overflow: "visible" }}>
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ fontWeight: "bold", overflow: "visible" }}
                                data-cy="skills-heading"
                            >
                                SKILLS
                            </Typography>
                            <ul style={{ overflow: "visible" }}>
                                {resumeData.skills
                                    ? resumeData.skills
                                          .split(",")
                                          .map((skill, index) => (
                                              <li key={index} style={{ overflow: "visible" }}>
                                                  <Typography
                                                      variant="body1"
                                                      color="text.secondary"
                                                      sx={{ overflow: "visible" }}
                                                  >
                                                      {skill.trim()}
                                                  </Typography>
                                              </li>
                                          ))
                                    : "Skills are not provided."}
                            </ul>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Achievements Section */}
                        <Box sx={{ marginBottom: 4 }}>
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                ACHIEVEMENTS
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {resumeData.achievements ||
                                    "Achievements are not provided."}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Career Goals Section */}
                        <Box sx={{ marginBottom: 4 }}>
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                CAREER GOALS
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {resumeData.careerGoals ||
                                    "Career goals are not provided."}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Hobbies Section */}
                        <Box sx={{ marginBottom: 4 }}>
                            <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                HOBBIES
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {resumeData.hobbies ||
                                    "Hobbies are not provided."}
                            </Typography>
                        </Box>
                    </CardContent>

                    {/* Delete Button at the Bottom-Right */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            padding: 2,
                            overflow: "visible", // Ensure overflow is visible for Cypress tests
                            zIndex: 1, // Add z-index to ensure button appears above other elements
                        }}
                    >
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => deleteCv(index)}
                            sx={{ 
                                overflow: "visible", // Ensure button content is visible
                                position: "relative" // Establish positioning context
                            }}
                            data-cy="delete-cv-button" // Add data attribute for easier testing
                        >
                            Delete CV
                        </Button>
                    </Box>
                </Card>
            ))}
        </Box>
    );
}

export default MapPage;

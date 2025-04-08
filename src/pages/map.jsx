import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Divider } from "@mui/material";

function MapPage() {
    const [resumeData, setResumeData] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem("resumeData");
        if (storedData) {
            setResumeData(JSON.parse(storedData));
        }
    }, []);

    if (!resumeData) {
        return (
            <Typography align="center" sx={{ mt: 5 }}>
                No resume data available. Please complete the chat first.
            </Typography>
        );
    }

    return (
        <Card sx={{ maxWidth: 900, margin: "auto", padding: 3 }}>
            <CardContent>
                <Typography variant="h4" gutterBottom>
                    {resumeData.fullName || "Full Name Not Provided"}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    {resumeData.currentRole || "Current Role Not Provided"}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" gutterBottom>
                    <strong>Skills:</strong>{" "}
                    {resumeData.skills || "Not Provided"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Education:</strong>{" "}
                    {resumeData.education || "Not Provided"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Team Experience:</strong>{" "}
                    {resumeData.teamExperience || "Not Provided"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Achievements:</strong>{" "}
                    {resumeData.achievements || "Not Provided"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Career Goals:</strong>{" "}
                    {resumeData.careerGoals || "Not Provided"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Hobbies:</strong>{" "}
                    {resumeData.hobbies || "Not Provided"}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    <strong>Location:</strong>{" "}
                    {resumeData.location || "Not Provided"}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default MapPage;

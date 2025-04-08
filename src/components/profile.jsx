import React, { useState, useEffect } from "react";
import { 
  Card, CardContent, Grid, Avatar, Divider, Typography 
} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";

const fetchProfileData = async () => {
    try {
      const response = await fetch(`resumeData.json?timestamp=${new Date().getTime()}`);
      if (!response.ok) throw new Error("Error loading data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching profile data:", error);
      return null;
    }
};

export default function ResumeCard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadProfileData = async () => {
        const profileData = await fetchProfileData();
        setData(profileData || []);
        setLoading(false);
      };
      
      loadProfileData();  
    }, []);

    if (loading) {
      return <Typography align="center" sx={{ mt: 5 }}>Loading data...</Typography>;
    }

    if (!data || data.length === 0) {
      return (
        <Card sx={{ maxWidth: 900, margin: "auto", padding: "40px", borderRadius: 2 }}>
          <Typography align="center" sx={{ mt: 5 }}>
            No data found, please try again later.
          </Typography>
        </Card>
      );
    }

    const profile = data[0]; // Display the first profile  

    // תאריך אוטומטי
    const todayDate = new Date().toLocaleDateString();

    return (
      <Card sx={{ maxWidth: 900, margin: "auto", padding: "40px", borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <Avatar
              alt="User Image"
              src={profile.image || "default-image.jpg"}
              sx={{
                width: 150,
                height: 150,
                margin: "auto",
                borderRadius: "50%",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.1)",
                  cursor: "pointer",
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={9}>
            <CardContent>
              <Typography gutterBottom variant="h4" component="div" align="center">
                {profile.fullName || "No name found"}
              </Typography>
              <Typography variant="body1" paragraph>
                {profile.currentRole || "No current role found"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Location:</strong> {profile.location || "No location found"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>Date:</strong> {todayDate}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                Skills
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {profile.skills || "No skills found"}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                Education
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {profile.education || "No education found"}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                Team Experience
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {profile.teamExperience || "No team experience found"}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                Achievements
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {profile.achievements || "No achievements found"}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                Career Goals
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {profile.careerGoals || "No career goals found"}
              </Typography>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary" gutterBottom>
                Hobbies
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {profile.hobbies || "No hobbies found"}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>

        <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 3 }}>
          Work Experience
        </Typography>

        {profile.workExperience && Array.isArray(profile.workExperience) && profile.workExperience.length > 0 ? (
          <Timeline>
            {profile.workExperience.map((job, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot />
                  {index < profile.workExperience.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6">{job.position || "No position found"}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.company || "No company found"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.duration || "No duration found"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {job.description || "No description found"}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No work experience found
          </Typography>
        )}
      </Card>
    );
}

export class CV {
    fullName;
    currentRole;
    skills;
    education;
    teamExperience;
    achievements;
    careerGoals;
    hobbies;
    location;
    summary;
    jobHistory;
    keyQualifications;

    constructor(details) {
        this.fullName = details.fullName;
        this.currentRole = details.currentRole;
        this.skills = details.skills;
        this.education = details.education;
        this.teamExperience = details.teamExperience;
        this.achievements = details.achievements;
        this.careerGoals = details.careerGoals;
        this.hobbies = details.hobbies;
        this.location = details.location;
        this.summary = details.summary;
        this.jobHistory = details.jobHistory;
        this.keyQualifications = details.keyQualifications;
    }
}

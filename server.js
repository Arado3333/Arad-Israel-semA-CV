import express from "express";
import cors from "cors";
import fs from "fs/promises";
import { User } from "./models/User.model.js";
import { CV } from "./models/CV.model.js";

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json()); // מאפשר קריאת JSON בבקשות

// Endpoint לשמירת נתונים לתוך JSON בלי למחוק את הישנים
app.post("/save-resume", async (req, res) => {
    const resumeData = req.body;

    let cv = new CV(resumeData);

    const filePath = "resumeData.json";

    try {
        // Check if the file exists, if not, initialize it with an empty array
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, JSON.stringify([], null, 2));
        }

        // Read the existing data
        const data = await fs.readFile(filePath, "utf8");
        let existingData = JSON.parse(data);

        // Ensure the data is an array
        if (!Array.isArray(existingData)) {
            existingData = [];
        }

        // Add the new data
        existingData.push(cv);

        // Write the updated data back to the file
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

        res.status(200).json({
            message: "Resume data saved successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error saving resume data:", error);
        res.status(500).json({
            message: "Error saving resume data",
            success: false,
            error,
        });
    }
});

// Endpoint לשליפת הנתונים מהקובץ
app.get("/get-resume", async (req, res) => {
    try {
        const data = await fs.readFile("resumeData.json", "utf8");
        const parsedData = JSON.parse(data);
        res.status(200).json(parsedData);
    } catch (error) {
        console.error("Error reading resume data:", error);
        res.status(500).json({ message: "Error reading resume data", error });
    }
});

// Endpoint to delete a CV by index
app.delete("/delete-resume/:index", async (req, res) => {
    const index = parseInt(req.params.index, 10);
    const filePath = "resumeData.json";

    try {
        // Read the existing data
        const data = await fs.readFile(filePath, "utf8");
        let existingData = JSON.parse(data);

        // Ensure the data is an array
        if (!Array.isArray(existingData)) {
            return res.status(400).json({
                message: "Invalid data format",
                success: false,
            });
        }

        // Check if the index is valid
        if (index < 0 || index >= existingData.length) {
            return res.status(404).json({
                message: "CV not found",
                success: false,
            });
        }

        // Remove the CV at the specified index
        existingData.splice(index, 1);

        // Write the updated data back to the file
        await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));

        res.status(200).json({
            message: "CV deleted successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error deleting CV:", error);
        res.status(500).json({
            message: "Error deleting CV",
            success: false,
            error,
        });
    }
});

app.post("/users/register", async (req, res) => {
    let { fName, lName, email, username, password } = req.body;

    let users = await fs.readFile("./data/users.json", "utf-8");
    users = JSON.parse(users); //"importing" the json file as an array of objects

    let userExist = users.find(
        (user) => user.username === username || user.email === email
    );

    if (userExist) {
        res.status(400).json({
            message: "User already exists",
            success: false,
        });
    } else {
        const newUser = new User(
            fName || null,
            lName || null,
            email || null,
            username || null,
            password || null
        );

        let maxId = users.length;
        newUser.id = maxId + 1;

        users.push(newUser);

        await fs.writeFile(
            "./data/users.json",
            JSON.stringify(users, null, 2),
            (err) => console.log(err)
        );
        res.status(200).json({
            message: "User created successfully",
            success: true,
        });
    }
});

app.post("/users/login", async (req, res) => {
    let { username, password } = req.body;
    let users = await fs.readFile("./data/users.json", "utf-8");
    users = JSON.parse(users); //"importing" the json file as an array of objects

    let userExist = users.find((user) => user.username === username);
    let passCorrect = users.find((user) => user.password === password);

    if (userExist && passCorrect) {
        res.status(200).json({
            message: "Authentication successful, Logging in",
            success: true,
        });
    } else {
        res.status(401).json({
            message: "Incorrect credentials or unregistered",
            success: false,
        });
    }
});

// Endpoint to update user information
app.put("/users/update", async (req, res) => {
    let { username, fName, lName, email } = req.body;

    try {
        // Read all users
        let users = await fs.readFile("./data/users.json", "utf-8");
        users = JSON.parse(users);

        // Find the user by username
        const userIndex = users.findIndex((user) => user.username === username);

        if (userIndex === -1) {
            return res.status(404).json({
                message: "User not found",
                
                success: false,
            });
        }

        // Update user information
        users[userIndex].fName = fName || users[userIndex].fName;
        users[userIndex].lName = lName || users[userIndex].lName;
        users[userIndex].email = email || users[userIndex].email;

        // Save updated users
        await fs.writeFile(
            "./data/users.json",
            JSON.stringify(users, null, 2)
        );

        // Return success response with updated user data
        res.status(200).json({
            message: "User information updated successfully",
            success: true,
            user: {
                fName: users[userIndex].fName,
                lName: users[userIndex].lName,
                email: users[userIndex].email,
                username: users[userIndex].username
            }
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            message: "Error updating user information",
            success: false,
            error,
        });
    }
});

// Endpoint to get user information by username
app.get("/users/:username", async (req, res) => {
    const { username } = req.params;

    try {
        // Read all users
        let users = await fs.readFile("./data/users.json", "utf-8");
        users = JSON.parse(users);

        // Find the user by username
        const user = users.find((user) => user.username === username);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Return user information (excluding password)
        res.status(200).json({
            success: true,
            user: {
                fName: user.fName,
                lName: user.lName,
                email: user.email,
                username: user.username
            }
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            message: "Error fetching user information",
            success: false,
            error,
        });
    }
});

// הפעלת השרת
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

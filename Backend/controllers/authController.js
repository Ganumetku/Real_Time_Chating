import User from '../models/user.model.js';
import Contact from '../models/contacts.model.js';
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match." });
        }

        const user = await User.findOne({ username: new RegExp('^' + username + '$', 'i') });
       

        if (user) {
            
            return res.status(400).json({ error: "Username already exists." });
        }

        const existingEmail = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already registered." });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        if (newUser) {
            console.log(newUser);
            await newUser.save();

            // Create a contact list for the new user
            const newContactList = new Contact({ user: newUser._id, contacts: [] });
            await newContactList.save();

            // Generate JWT token
            console.log(newUser._id);
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in SignUp controller", error.message);
        res.status(500).json({ error: 'Internal Server Error ${error.message}' });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: new RegExp('^' + username + '$', 'i') });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Incorrect username or password." });
        }

        // Check if the contact list exists
        let contactList = await Contact.findOne({ user: user._id });
        if (!contactList) {
            contactList = new Contact({ user: user._id, contacts: [] });
            await contactList.save();
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("Error in login Controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

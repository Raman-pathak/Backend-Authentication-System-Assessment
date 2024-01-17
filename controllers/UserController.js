const { model } = require("mongoose");
const User = require("../model/User");
const nodemailer = require('nodemailer');
const crypto = require('crypto'); 
const cron = require('node-cron');
const bcrypt = require("bcrypt");
const salt=10;
const env = require("dotenv").config();
exports.register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      //  user is present 
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      
      const encrptedPaasword=bcrypt.hashSync(req.body.password,salt);


    //  await User.create({...req.body,password:encrptedPaasword});
      

      const newUser = new User({...req.body,password:encrptedPaasword});
      await newUser.save();
     

      // Generate a verification token
      const verificationToken = crypto.randomBytes(20).toString('hex');
      newUser.verificationToken = verificationToken;

      //save data in tha database
      await newUser.save();
  
      // Send a verification email (Task 2)npm
      await sendVerificationEmail(email, verificationToken);
  
      res.status(201).json({ message: 'User registered successfully. Check your email for verification.' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // Task 2: Verification Email
  const sendVerificationEmail = async (userEmail, verificationToken) => {
    try{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'gopeshpathak322@gmail.com',
          pass: "yfss zewm gwhp ceju"
        }
      });
      
      var mailOptions = {
        from: 'raman_codetikki@gmail',
        to: 'myfriend@yahook',
        subject: 'Sending Email',
        text: 'hello raman !'
      };
      
      const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};


  // Task 3: Account Verification
exports.verifytoken = async (req, res) => {
    const { token } = req.params;
  
    try {
      const user = await User.findOne({ verificationToken: token });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
      }
  
      // if token is expired in 10 min 
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      if (user.registrationTimestamp < tenMinutesAgo) {
        return res.status(400).json({ message: 'Token expired. Please register again.' });
      }
      // user is verified take the mark 
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Account verified successfully.' });
    } catch (error) {
      console.error('Error verifying account:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // Task 4: Automatic Account Deletion
  
  cron.schedule('*/10 * * * *', async () => {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  
      // Find and delete unverified accounts older than 10 minutes
      await User.deleteMany({
        isVerified: false,
        registrationTimestamp: { $lt: tenMinutesAgo },
      });
  
      console.log('Unverified accounts deleted successfully.');
    } catch (error) {
      console.error('Error deleting unverified accounts:', error);
    }
  });
  
  // Task 5: Home Page Access
 exports.home = async (req, res) => {
    const user = req.user; 
  
    if (user && user.isVerified) {
      res.status(200).json({ message: 'Welcome to the home page!' });
    } else {
      res.status(403).json({ message: 'Access denied. Please verify your account.' });
    }
  };
  
// const express = require('express');
import express from "express"

// const cors = require('cors');
import cors from "cors"

// require('dotenv').config();
import dotenv from "dotenv"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000; 


app.listen(PORT, () => {
 console.log(`Server is running on port http://localhost:${PORT}`);
});
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes"); 
const uploadRoute = require("./routes/uploadRoute");
const EmotionRoute = require("./routes/EmotionRoute");



dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',  // or "*" for all origins in development
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // <-- add this line
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));


app.use("/api/user", userRoutes);

app.use("/api/emotion", EmotionRoute);

app.use("/api/upload", uploadRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

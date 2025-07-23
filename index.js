const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("./connection");
require("dotenv").config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

const UserRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const NotificationRoutes = require("./routes/notification");
const commentRoutes = require("./routes/comment");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");

app.use(cors());
app.use("/api/auth", UserRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", NotificationRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/message", messageRoutes);

// app.get("/", (req, res) => {
//   res.send({
//     messsage: "congratulation your server is running now",
//   });
// });

app.listen(PORT, () => {
  console.log("backend server is running on PORT", `${PORT}`);
});

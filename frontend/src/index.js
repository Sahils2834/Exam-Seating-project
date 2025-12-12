import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./styles/global.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/student.css";
import "./styles/teacher.css";

createRoot(document.getElementById("root")).render(<App />);

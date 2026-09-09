import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./FilterBubbles.css";
import "./DoctorCards.css";
import "./ProfileModal.css";
import "./BookingModal.css";
import "./MyAppointments.css";
import "./AuthModal.css";

import App from "./App.tsx";
import SmartSearchChat from "./SmartSearchChat.tsx";

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <App />
    <SmartSearchChat />
  </StrictMode>
);
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./FilterBubbles.css";
import "./DoctorCards.css";
import "./ProfileModal.css";
import "./BookingModal.css";
import "./MyAppointments.css";
import "./AuthModal.css";
import "./Header.css";
import "./Hero.css";
import "./HeroFeedback.css";

import App from "./App.tsx";
import SmartSearchChat from "./SmartSearchChat.tsx";
import BookingSuccessToast from "./BookingSuccessToast.tsx";

createRoot(
  document.getElementById("root")!
).render(
  <StrictMode>
    <App />
    <SmartSearchChat />
    <BookingSuccessToast />
  </StrictMode>
);
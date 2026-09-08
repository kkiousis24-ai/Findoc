import { useEffect, useState } from "react";
import "./App.css";

/* =====================================================
   TYPES
===================================================== */

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  city: string;
  address: string;
  bio: string;
  consultationPrice: number;
  rating: number;
  imageUrl: string;
}

interface AvailabilitySlot {
  startsAt: string;
  time: string;
}

interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  createdAtUtc?: string;
}

interface AuthResponse {
  token: string;
  expiresIn: number;
  user: AuthUser;
}

interface AppointmentDoctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  city: string;
  address: string;
  consultationPrice: number;
  rating: number;
}

interface MyAppointment {
  id: number;
  startsAt: string;
  status: string;
  patientName: string;
  patientEmail: string;
  doctor: AppointmentDoctor;
}

interface ApiMessage {
  message?: string;
}

type AuthMode = "login" | "register";

/* =====================================================
   CONFIG
===================================================== */

const API_URL = "http://localhost:5087";

/* =====================================================
   SPECIALTY LABELS
===================================================== */

const specialtyLabels: Record<string, string> = {
  Cardiologist: "Καρδιολόγος",
  Dermatologist: "Δερματολόγος",
  Neurologist: "Νευρολόγος",
  Pediatrician: "Παιδίατρος",
  Orthopedic: "Ορθοπαιδικός",
};

/* =====================================================
   DEMO DOCTOR PHOTOS
===================================================== */

const doctorPhotoMap: Record<number, string> = {
  // Maria Papadopoulou
  1: "https://randomuser.me/api/portraits/women/44.jpg",

  // Giorgos Nikolaidis
  2: "https://randomuser.me/api/portraits/men/32.jpg",

  // Eleni Markou
  3: "https://randomuser.me/api/portraits/women/65.jpg",

  // Dimitris Vrettos
  4: "https://randomuser.me/api/portraits/men/46.jpg",

  // Sofia Antonopoulou
  5: "https://randomuser.me/api/portraits/women/68.jpg",

  // Nikos Karagiannis
  6: "https://randomuser.me/api/portraits/men/52.jpg",

  // Anna Georgiou
  7: "https://randomuser.me/api/portraits/women/47.jpg",

  // Panagiotis Zervas
  8: "https://randomuser.me/api/portraits/men/36.jpg",
};

function getDoctorImageUrl(
  doctorId: number,
  imageUrl?: string
) {
  if (doctorPhotoMap[doctorId]) {
    return doctorPhotoMap[doctorId];
  }

  if (
    imageUrl &&
    imageUrl.trim() !== "" &&
    !imageUrl.includes("example.com")
  ) {
    return imageUrl;
  }

  return "";
}

/* =====================================================
   DATE HELPERS
===================================================== */

function formatDateForInput(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getNextAvailableDate() {
  const date = new Date();

  date.setDate(date.getDate() + 1);

  while (
    date.getDay() === 0 ||
    date.getDay() === 6
  ) {
    date.setDate(date.getDate() + 1);
  }

  return formatDateForInput(date);
}

function formatAppointmentDate(
  value: string
) {
  const date = new Date(value);

  return new Intl.DateTimeFormat(
    "el-GR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

/* =====================================================
   APP
===================================================== */

function App() {
  /* ===================================================
     SEARCH
  =================================================== */

  const [
    doctors,
    setDoctors,
  ] = useState<Doctor[]>([]);

  const [
    specialties,
    setSpecialties,
  ] = useState<string[]>([]);

  const [
    specialty,
    setSpecialty,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");

  const [
    insurance,
    setInsurance,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    searched,
    setSearched,
  ] = useState(false);

  /* ===================================================
     PROFILE
  =================================================== */

  const [
    profileDoctor,
    setProfileDoctor,
  ] = useState<Doctor | null>(
    null
  );

  const [
    profileLoading,
    setProfileLoading,
  ] = useState(false);

  /* ===================================================
     BOOKING
  =================================================== */

  const [
    selectedDoctor,
    setSelectedDoctor,
  ] = useState<Doctor | null>(
    null
  );

  const [
    appointmentDate,
    setAppointmentDate,
  ] = useState(
    getNextAvailableDate()
  );

  const [
    availability,
    setAvailability,
  ] = useState<
    AvailabilitySlot[]
  >([]);

  const [
    selectedSlot,
    setSelectedSlot,
  ] = useState<
    AvailabilitySlot | null
  >(null);

  const [
    patientName,
    setPatientName,
  ] = useState("");

  const [
    patientEmail,
    setPatientEmail,
  ] = useState("");

  const [
    availabilityLoading,
    setAvailabilityLoading,
  ] = useState(false);

  const [
    bookingLoading,
    setBookingLoading,
  ] = useState(false);

  const [
    bookingMessage,
    setBookingMessage,
  ] = useState("");

  const [
    bookingSuccess,
    setBookingSuccess,
  ] = useState(false);

  /* ===================================================
     AUTH
  =================================================== */

  const [
    authUser,
    setAuthUser,
  ] = useState<AuthUser | null>(
    null
  );

  const [
    authToken,
    setAuthToken,
  ] = useState<string | null>(
    localStorage.getItem(
      "findoc_token"
    )
  );

  const [
    authOpen,
    setAuthOpen,
  ] = useState(false);

  const [
    authMode,
    setAuthMode,
  ] = useState<AuthMode>(
    "login"
  );

  const [
    authFullName,
    setAuthFullName,
  ] = useState("");

  const [
    authEmail,
    setAuthEmail,
  ] = useState("");

  const [
    authPassword,
    setAuthPassword,
  ] = useState("");

  const [
    authLoading,
    setAuthLoading,
  ] = useState(false);

  const [
    authMessage,
    setAuthMessage,
  ] = useState("");

  /* ===================================================
     MY APPOINTMENTS
  =================================================== */

  const [
    appointmentsOpen,
    setAppointmentsOpen,
  ] = useState(false);

  const [
    myAppointments,
    setMyAppointments,
  ] = useState<
    MyAppointment[]
  >([]);

  const [
    appointmentsLoading,
    setAppointmentsLoading,
  ] = useState(false);

  const [
    appointmentsMessage,
    setAppointmentsMessage,
  ] = useState("");

  const [
    cancellingAppointmentId,
    setCancellingAppointmentId,
  ] = useState<number | null>(
    null
  );

  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {
    void loadSpecialties();
    void restoreSession();
  }, []);

  /* ===================================================
     AUTH FUNCTIONS
  =================================================== */

  async function restoreSession() {
    const token =
      localStorage.getItem(
        "findoc_token"
      );

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        logout();
        return;
      }

      const user: AuthUser =
        await response.json();

      setAuthToken(token);
      setAuthUser(user);
    } catch (error) {
      console.error(
        "Restore session error:",
        error
      );
    }
  }

  function openAuth(
    mode: AuthMode
  ) {
    setAuthMode(mode);

    setAuthFullName("");
    setAuthEmail("");
    setAuthPassword("");
    setAuthMessage("");

    setAuthOpen(true);
  }

  function closeAuth() {
    if (authLoading) {
      return;
    }

    setAuthOpen(false);
    setAuthMessage("");
  }

  async function submitAuth() {
    if (
      authMode === "register" &&
      !authFullName.trim()
    ) {
      setAuthMessage(
        "Γράψε το ονοματεπώνυμό σου."
      );

      return;
    }

    if (!authEmail.trim()) {
      setAuthMessage(
        "Γράψε το email σου."
      );

      return;
    }

    if (!authPassword) {
      setAuthMessage(
        "Γράψε τον κωδικό σου."
      );

      return;
    }

    if (
      authMode === "register" &&
      authPassword.length < 8
    ) {
      setAuthMessage(
        "Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες."
      );

      return;
    }

    try {
      setAuthLoading(true);
      setAuthMessage("");

      const url =
        authMode === "register"
          ? `${API_URL}/api/auth/register`
          : `${API_URL}/api/auth/login`;

      const body =
        authMode === "register"
          ? {
              fullName:
                authFullName.trim(),

              email:
                authEmail
                  .trim()
                  .toLowerCase(),

              password:
                authPassword,
            }
          : {
              email:
                authEmail
                  .trim()
                  .toLowerCase(),

              password:
                authPassword,
            };

      const response = await fetch(
        url,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(body),
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        if (
          response.status ===
          401
        ) {
          setAuthMessage(
            "Λάθος email ή κωδικός."
          );
        } else if (
          response.status ===
          409
        ) {
          setAuthMessage(
            "Υπάρχει ήδη λογαριασμός με αυτό το email."
          );
        } else {
          setAuthMessage(
            data.message ||
              "Δεν ήταν δυνατή η ολοκλήρωση της ενέργειας."
          );
        }

        return;
      }

      const authData =
        data as AuthResponse;

      localStorage.setItem(
        "findoc_token",
        authData.token
      );

      setAuthToken(
        authData.token
      );

      setAuthUser(
        authData.user
      );

      setAuthOpen(false);

      setAuthFullName("");
      setAuthEmail("");
      setAuthPassword("");
      setAuthMessage("");
    } catch (error) {
      console.error(
        "Authentication error:",
        error
      );

      setAuthMessage(
        "Δεν ήταν δυνατή η σύνδεση με τον server."
      );
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem(
      "findoc_token"
    );

    setAuthToken(null);
    setAuthUser(null);

    setAppointmentsOpen(false);
    setMyAppointments([]);
    setAppointmentsMessage("");
  }

  /* ===================================================
     MY APPOINTMENTS
  =================================================== */

  async function openMyAppointments() {
    if (!authToken) {
      openAuth("login");
      return;
    }

    setAppointmentsOpen(true);

    await loadMyAppointments();
  }

  function closeMyAppointments() {
    if (
      cancellingAppointmentId !==
      null
    ) {
      return;
    }

    setAppointmentsOpen(false);
    setAppointmentsMessage("");
  }

  async function loadMyAppointments() {
    if (!authToken) {
      return;
    }

    try {
      setAppointmentsLoading(
        true
      );

      setAppointmentsMessage("");

      const response = await fetch(
        `${API_URL}/api/appointments/my`,
        {
          headers: {
            Authorization:
              `Bearer ${authToken}`,
          },
        }
      );

      if (
        response.status === 401
      ) {
        logout();
        openAuth("login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Could not load appointments"
        );
      }

      const data:
        MyAppointment[] =
        await response.json();

      setMyAppointments(data);
    } catch (error) {
      console.error(
        "My appointments error:",
        error
      );

      setAppointmentsMessage(
        "Δεν ήταν δυνατή η φόρτωση των ραντεβού σου."
      );
    } finally {
      setAppointmentsLoading(
        false
      );
    }
  }

  /* ===================================================
     CANCEL APPOINTMENT
  =================================================== */

  async function cancelAppointment(
    appointmentId: number
  ) {
    if (!authToken) {
      return;
    }

    const confirmed =
      window.confirm(
        "Θέλεις σίγουρα να ακυρώσεις αυτό το ραντεβού;"
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingAppointmentId(
        appointmentId
      );

      setAppointmentsMessage("");

      const response = await fetch(
        `${API_URL}/api/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",

          headers: {
            Authorization:
              `Bearer ${authToken}`,
          },
        }
      );

      const text =
        await response.text();

      let data: ApiMessage = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = {
            message: text,
          };
        }
      }

      if (
        response.status === 401
      ) {
        logout();
        openAuth("login");
        return;
      }

      if (
        response.status === 403
      ) {
        setAppointmentsMessage(
          "Δεν έχεις δικαίωμα να ακυρώσεις αυτό το ραντεβού."
        );

        return;
      }

      if (
        response.status === 404
      ) {
        setAppointmentsMessage(
          "Το endpoint ακύρωσης δεν βρέθηκε."
        );

        return;
      }

      if (!response.ok) {
        setAppointmentsMessage(
          data.message ||
            `Η ακύρωση απέτυχε. HTTP ${response.status}`
        );

        return;
      }

      await loadMyAppointments();

      setAppointmentsMessage(
        "Το ραντεβού ακυρώθηκε επιτυχώς."
      );
    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error
      );

      setAppointmentsMessage(
        "Δεν ήταν δυνατή η επικοινωνία με το backend."
      );
    } finally {
      setCancellingAppointmentId(
        null
      );
    }
  }

  /* ===================================================
     SPECIALTIES
  =================================================== */

  async function loadSpecialties() {
    try {
      const response = await fetch(
        `${API_URL}/api/specialties`
      );

      if (!response.ok) {
        throw new Error(
          "Could not load specialties"
        );
      }

      const data: string[] =
        await response.json();

      setSpecialties(data);
    } catch (error) {
      console.error(
        "Specialties error:",
        error
      );
    }
  }

  /* ===================================================
     SEARCH
  =================================================== */

  async function searchDoctors() {
    try {
      setLoading(true);

      const params =
        new URLSearchParams();

      if (specialty) {
        params.append(
          "specialty",
          specialty
        );
      }

      if (city) {
        params.append(
          "city",
          city
        );
      }

      const query =
        params.toString();

      const url = query
        ? `${API_URL}/api/doctors?${query}`
        : `${API_URL}/api/doctors`;

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          "Could not load doctors"
        );
      }

      const data: Doctor[] =
        await response.json();

      setDoctors(data);
      setSearched(true);

      window.setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
    } catch (error) {
      console.error(
        "Doctors search error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /* ===================================================
     DOCTOR PROFILE
  =================================================== */

  async function openDoctorProfile(
    doctorId: number
  ) {
    try {
      setProfileLoading(true);

      const response = await fetch(
        `${API_URL}/api/doctors/${doctorId}`
      );

      if (!response.ok) {
        throw new Error(
          "Could not load doctor"
        );
      }

      const data: Doctor =
        await response.json();

      setProfileDoctor(data);
    } catch (error) {
      console.error(
        "Doctor profile error:",
        error
      );
    } finally {
      setProfileLoading(false);
    }
  }

  function closeDoctorProfile() {
    setProfileDoctor(null);
  }

  function bookFromProfile() {
    if (!profileDoctor) {
      return;
    }

    const doctor =
      profileDoctor;

    setProfileDoctor(null);

    openBooking(doctor);
  }

  /* ===================================================
     AVAILABILITY
  =================================================== */

  async function loadAvailability(
    doctor: Doctor,
    date: string
  ) {
    try {
      setAvailabilityLoading(
        true
      );

      setSelectedSlot(null);

      const response = await fetch(
        `${API_URL}/api/doctors/${doctor.id}/availability?date=${date}`
      );

      if (!response.ok) {
        throw new Error(
          "Could not load availability"
        );
      }

      const data:
        AvailabilitySlot[] =
        await response.json();

      setAvailability(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Availability error:",
        error
      );

      setAvailability([]);

      setBookingSuccess(false);

      setBookingMessage(
        "Δεν ήταν δυνατή η φόρτωση των διαθέσιμων ωρών."
      );
    } finally {
      setAvailabilityLoading(
        false
      );
    }
  }

  function openBooking(
    doctor: Doctor
  ) {
    const defaultDate =
      getNextAvailableDate();

    setSelectedDoctor(doctor);

    setAppointmentDate(
      defaultDate
    );

    setPatientName(
      authUser?.fullName || ""
    );

    setPatientEmail(
      authUser?.email || ""
    );

    setSelectedSlot(null);

    setBookingMessage("");
    setBookingSuccess(false);

    void loadAvailability(
      doctor,
      defaultDate
    );
  }

  function closeBooking() {
    if (bookingLoading) {
      return;
    }

    setSelectedDoctor(null);

    setAvailability([]);
    setSelectedSlot(null);

    setPatientName("");
    setPatientEmail("");

    setBookingMessage("");
    setBookingSuccess(false);
  }

  async function changeAppointmentDate(
    date: string
  ) {
    setAppointmentDate(date);

    setBookingMessage("");
    setBookingSuccess(false);

    setSelectedSlot(null);

    if (
      !selectedDoctor ||
      !date
    ) {
      return;
    }

    await loadAvailability(
      selectedDoctor,
      date
    );
  }

  /* ===================================================
     CREATE APPOINTMENT
  =================================================== */

  async function createAppointment() {
    if (!selectedDoctor) {
      return;
    }

    if (!selectedSlot) {
      setBookingSuccess(false);

      setBookingMessage(
        "Επίλεξε πρώτα μία διαθέσιμη ώρα."
      );

      return;
    }

    if (!patientName.trim()) {
      setBookingSuccess(false);

      setBookingMessage(
        "Γράψε το ονοματεπώνυμό σου."
      );

      return;
    }

    if (!patientEmail.trim()) {
      setBookingSuccess(false);

      setBookingMessage(
        "Γράψε το email σου."
      );

      return;
    }

    try {
      setBookingLoading(true);

      setBookingMessage("");
      setBookingSuccess(false);

      const headers:
        Record<string, string> = {
        "Content-Type":
          "application/json",
      };

      if (authToken) {
        headers.Authorization =
          `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${API_URL}/api/appointments`,
        {
          method: "POST",

          headers,

          body: JSON.stringify({
            doctorId:
              selectedDoctor.id,

            patientName:
              patientName.trim(),

            patientEmail:
              patientEmail
                .trim()
                .toLowerCase(),

            startsAt:
              selectedSlot.startsAt,
          }),
        }
      );

      const data:
        ApiMessage =
        await response.json();

      if (!response.ok) {
        setBookingMessage(
          data.message ||
            "Δεν ήταν δυνατή η κράτηση."
        );

        return;
      }

      await loadAvailability(
        selectedDoctor,
        appointmentDate
      );

      setBookingSuccess(true);

      setBookingMessage(
        "Το ραντεβού σου έκλεισε επιτυχώς!"
      );

      setSelectedSlot(null);
    } catch (error) {
      console.error(
        "Booking error:",
        error
      );

      setBookingSuccess(false);

      setBookingMessage(
        "Παρουσιάστηκε πρόβλημα κατά την κράτηση."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  /* ===================================================
     UI
  =================================================== */

  return (
    <div className="findoc-app">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="topbar">
        <div className="page-width navbar">

          <a
            className="brand"
            href="#search"
          >
            <div className="brand-icon">
              ♡
            </div>

            <div className="brand-name">
              Fin<span>doc</span>
            </div>
          </a>

          <nav className="main-nav">
            <a href="#search">
              Βρες γιατρό
            </a>

            <a href="#how">
              Πώς λειτουργεί
            </a>

            <a href="#doctors">
              Για γιατρούς
            </a>
          </nav>

          <div className="nav-actions">

            <button
              type="button"
              className="language-button"
            >
              EL
            </button>

            {!authUser ? (
              <button
                type="button"
                className="login-button"
                onClick={() =>
                  openAuth("login")
                }
              >
                Σύνδεση
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="my-appointments-nav"
                  onClick={() =>
                    void openMyAppointments()
                  }
                >
                  Τα ραντεβού μου
                </button>

                <div className="account-chip">
                  <span>
                    {authUser.fullName
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <div>
                    <strong>
                      {authUser.fullName}
                    </strong>

                    <small>
                      {authUser.email}
                    </small>
                  </div>
                </div>

                <button
                  type="button"
                  className="logout-button"
                  onClick={logout}
                >
                  Έξοδος
                </button>
              </>
            )}

          </div>
        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main>

        {/* HERO */}

        <section
          className="page-width hero"
          id="search"
        >
          <div className="decor-circle" />
          <div className="decor-bottom" />

          <div className="hero-left">

            <div className="hero-badge">
              <span>✦</span>
              Η υγεία σου, πιο απλά
            </div>

            <h1>
              Ο σωστός γιατρός.

              <em>
                Τη στιγμή που τον
                χρειάζεσαι.
              </em>
            </h1>

            <p className="hero-description">
              Βρες διαθέσιμους γιατρούς
              κοντά σου, σύγκρινε
              αξιολογήσεις και κλείσε
              ραντεβού online — χωρίς
              αναμονή στο τηλέφωνο.
            </p>

          </div>

          {/* HERO VISUAL */}

          <div className="hero-visual">

            <div className="portrait-arch">
              <div className="doctor-head">
                <div className="doctor-hair" />
              </div>

              <div className="doctor-neck" />
              <div className="doctor-body" />
            </div>

            <div className="rating-card">
              <span className="star">
                ★
              </span>

              <div>
                <strong>
                  4,9
                </strong>

                <small>
                  από ασθενείς
                </small>
              </div>
            </div>

            <div className="appointment-card">
              <div className="check-circle">
                ✓
              </div>

              <div>
                <strong>
                  Το ραντεβού έκλεισε!
                </strong>

                <small>
                  Σήμερα, 18:30
                </small>
              </div>
            </div>

            <div className="dot-pattern">
              {Array.from({
                length: 24,
              }).map(
                (_, index) => (
                  <span
                    key={index}
                  />
                )
              )}
            </div>

          </div>

          {/* SEARCH PANEL */}

          <div className="search-panel">

            {/* SPECIALTY */}

            <div className="search-item">

              <div className="search-icon">
                ♧
              </div>

              <div>
                <label>
                  ΤΙ ΧΡΕΙΑΖΕΣΑΙ;
                </label>

                <select
                  value={specialty}
                  onChange={(event) =>
                    setSpecialty(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Όλες οι ειδικότητες
                  </option>

                  {specialties.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {specialtyLabels[
                          item
                        ] || item}
                      </option>
                    )
                  )}
                </select>

              </div>
            </div>

            {/* CITY */}

            <div className="search-item">

              <div className="search-icon">
                ⌖
              </div>

              <div>
                <label>
                  ΠΟΥ;
                </label>

                <select
                  value={city}
                  onChange={(event) =>
                    setCity(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Όλη η Ελλάδα
                  </option>

                  <option value="Athens">
                    Αθήνα
                  </option>

                  <option value="Thessaloniki">
                    Θεσσαλονίκη
                  </option>

                  <option value="Patras">
                    Πάτρα
                  </option>

                  <option value="Ioannina">
                    Ιωάννινα
                  </option>

                </select>
              </div>

            </div>

            {/* INSURANCE */}

            <div className="search-item">

              <div className="search-icon">
                ♢
              </div>

              <div>
                <label>
                  ΑΣΦΑΛΙΣΗ
                </label>

                <select
                  value={insurance}
                  onChange={(event) =>
                    setInsurance(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Όλες
                  </option>

                  <option value="EOPYY">
                    ΕΟΠΥΥ
                  </option>

                  <option value="Private">
                    Ιδιωτική
                  </option>

                </select>
              </div>

            </div>

            <button
              type="button"
              className="main-search-button"
              disabled={loading}
              onClick={() =>
                void searchDoctors()
              }
            >
              {loading
                ? "Αναζήτηση..."
                : "Αναζήτηση"}
            </button>

          </div>

          {/* TRUST ROW */}

          <div className="trust-row">

            <span>
              <b>✓</b>{" "}
              Επαληθευμένες
              αξιολογήσεις
            </span>

            <span>
              <b>◷</b>{" "}
              Διαθεσιμότητα σε
              πραγματικό χρόνο
            </span>

            <span>
              <b>♢</b>{" "}
              Ασφαλής κράτηση
            </span>

          </div>

        </section>

        {/* =================================================
            RESULTS
        ================================================= */}

        {searched && (
          <section
            className="results-section"
            id="results"
          >
            <div className="page-width">

              <div className="results-heading">

                <div>
                  <span>
                    FINDOC
                  </span>

                  <h2>
                    Γιατροί για εσένα
                  </h2>
                </div>

                <p>
                  {doctors.length}{" "}
                  αποτελέσματα
                </p>

              </div>

              {doctors.length === 0 ? (
                <div className="empty-results">
                  Δεν βρέθηκαν γιατροί
                  με αυτά τα κριτήρια.
                </div>
              ) : (
                <div className="doctor-results">

                  {doctors.map(
                    (doctor) => {
                      const doctorImage =
                        getDoctorImageUrl(
                          doctor.id,
                          doctor.imageUrl
                        );

                      return (
                        <article
                          className="doctor-card"
                          key={doctor.id}
                        >

                          {/* PHOTO */}

                          <div className="doctor-card-avatar">

                            {doctorImage ? (
                              <img
                                src={
                                  doctorImage
                                }
                                alt={`${doctor.firstName} ${doctor.lastName}`}
                              />
                            ) : (
                              <>
                                {doctor.firstName
                                  .charAt(0)
                                  .toUpperCase()}

                                {doctor.lastName
                                  .charAt(0)
                                  .toUpperCase()}
                              </>
                            )}

                          </div>

                          <div className="doctor-card-content">

                            <div className="doctor-rating">
                              ★{" "}
                              {doctor.rating.toFixed(
                                1
                              )}
                            </div>

                            <h3>
                              {
                                doctor.firstName
                              }{" "}
                              {
                                doctor.lastName
                              }
                            </h3>

                            <strong className="doctor-specialty">
                              {specialtyLabels[
                                doctor.specialty
                              ] ||
                                doctor.specialty}
                            </strong>

                            <p>
                              {doctor.city}
                              {" · "}
                              {doctor.address}
                            </p>

                            {doctor.bio && (
                              <p>
                                {doctor.bio}
                              </p>
                            )}

                            <div className="doctor-bottom">

                              <span>
                                από{" "}
                                <b>
                                  €
                                  {
                                    doctor.consultationPrice
                                  }
                                </b>
                              </span>

                              <div className="doctor-actions">

                                <button
                                  type="button"
                                  className="profile-button"
                                  onClick={() =>
                                    void openDoctorProfile(
                                      doctor.id
                                    )
                                  }
                                >
                                  Προφίλ
                                </button>

                                <button
                                  type="button"
                                  className="availability-button"
                                  onClick={() =>
                                    openBooking(
                                      doctor
                                    )
                                  }
                                >
                                  Δες
                                  διαθεσιμότητα
                                </button>

                              </div>

                            </div>

                          </div>

                        </article>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          </section>
        )}

      </main>

      {/* =================================================
          AUTH MODAL
      ================================================= */}

      {authOpen && (
        <div
          className="auth-overlay"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAuth();
            }
          }}
        >

          <section className="auth-modal">

            <button
              type="button"
              className="auth-close"
              onClick={closeAuth}
            >
              ×
            </button>

            <div className="auth-logo">

              <div className="brand-icon">
                ♡
              </div>

              <div className="brand-name">
                Fin<span>doc</span>
              </div>

            </div>

            <span className="auth-eyebrow">

              {authMode === "login"
                ? "ΚΑΛΩΣ ΗΡΘΕΣ ΠΙΣΩ"
                : "ΔΗΜΙΟΥΡΓΙΑ ΛΟΓΑΡΙΑΣΜΟΥ"}

            </span>

            <h2>
              {authMode === "login"
                ? "Σύνδεση στο Findoc"
                : "Ξεκίνα με το Findoc"}
            </h2>

            <p className="auth-description">
              {authMode === "login"
                ? "Συνδέσου για να διαχειρίζεσαι τα ραντεβού σου."
                : "Δημιούργησε λογαριασμό για εύκολη και γρήγορη κράτηση ραντεβού."}
            </p>

            <div className="auth-tabs">

              <button
                type="button"
                className={
                  authMode ===
                  "login"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setAuthMode(
                    "login"
                  );

                  setAuthMessage("");
                }}
              >
                Σύνδεση
              </button>

              <button
                type="button"
                className={
                  authMode ===
                  "register"
                    ? "active"
                    : ""
                }
                onClick={() => {
                  setAuthMode(
                    "register"
                  );

                  setAuthMessage("");
                }}
              >
                Εγγραφή
              </button>

            </div>

            {authMode ===
              "register" && (
              <div className="auth-field">

                <label>
                  Ονοματεπώνυμο
                </label>

                <input
                  type="text"
                  placeholder="π.χ. Κώστας Κιούσης"
                  value={
                    authFullName
                  }
                  onChange={(
                    event
                  ) =>
                    setAuthFullName(
                      event.target.value
                    )
                  }
                />

              </div>
            )}

            <div className="auth-field">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="name@example.com"
                value={authEmail}
                onChange={(
                  event
                ) =>
                  setAuthEmail(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="auth-field">

              <label>
                Κωδικός
              </label>

              <input
                type="password"
                placeholder={
                  authMode ===
                  "register"
                    ? "Τουλάχιστον 8 χαρακτήρες"
                    : "Ο κωδικός σου"
                }
                value={
                  authPassword
                }
                onChange={(
                  event
                ) =>
                  setAuthPassword(
                    event.target.value
                  )
                }
                onKeyDown={(
                  event
                ) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    void submitAuth();
                  }
                }}
              />

            </div>

            {authMessage && (
              <div className="auth-message">
                {authMessage}
              </div>
            )}

            <button
              type="button"
              className="auth-submit"
              disabled={
                authLoading
              }
              onClick={() =>
                void submitAuth()
              }
            >
              {authLoading
                ? "Παρακαλώ περίμενε..."
                : authMode ===
                    "login"
                  ? "Σύνδεση"
                  : "Δημιουργία λογαριασμού"}
            </button>

            <p className="auth-bottom-text">

              {authMode === "login"
                ? "Δεν έχεις λογαριασμό;"
                : "Έχεις ήδη λογαριασμό;"}

              <button
                type="button"
                onClick={() => {
                  setAuthMode(
                    authMode ===
                      "login"
                      ? "register"
                      : "login"
                  );

                  setAuthMessage("");
                }}
              >
                {authMode === "login"
                  ? " Εγγραφή"
                  : " Σύνδεση"}
              </button>

            </p>

          </section>
        </div>
      )}

      {/* =================================================
          MY APPOINTMENTS
      ================================================= */}

      {appointmentsOpen &&
        authUser && (
          <div
            className="appointments-overlay"
            onMouseDown={(
              event
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeMyAppointments();
              }
            }}
          >

            <section className="appointments-modal">

              <button
                type="button"
                className="appointments-close"
                onClick={
                  closeMyAppointments
                }
              >
                ×
              </button>

              <div className="appointments-header">

                <span>
                  Ο ΛΟΓΑΡΙΑΣΜΟΣ ΜΟΥ
                </span>

                <h2>
                  Τα ραντεβού μου
                </h2>

                <p>
                  Δες και διαχειρίσου
                  τις κρατήσεις σου
                  στο Findoc.
                </p>

              </div>

              <div className="appointments-user">

                <div>
                  {authUser.fullName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <section>

                  <strong>
                    {
                      authUser.fullName
                    }
                  </strong>

                  <small>
                    {authUser.email}
                  </small>

                </section>

              </div>

              {appointmentsMessage && (
                <div className="appointments-message">
                  {
                    appointmentsMessage
                  }
                </div>
              )}

              {appointmentsLoading ? (
                <div className="appointments-empty">
                  Φόρτωση
                  ραντεβού...
                </div>
              ) : myAppointments.length ===
                0 ? (
                <div className="appointments-empty">

                  <div>
                    ◷
                  </div>

                  <strong>
                    Δεν έχεις ακόμη
                    ραντεβού
                  </strong>

                  <p>
                    Όταν κλείσεις ένα
                    ραντεβού, θα
                    εμφανιστεί εδώ.
                  </p>

                </div>
              ) : (
                <div className="appointments-list">

                  {myAppointments.map(
                    (
                      appointment
                    ) => {
                      const appointmentImage =
                        getDoctorImageUrl(
                          appointment
                            .doctor.id
                        );

                      return (
                        <article
                          className="my-appointment-card"
                          key={
                            appointment.id
                          }
                        >

                          <div className="appointment-top-line">

                            <span
                              className={
                                appointment.status ===
                                "Cancelled"
                                  ? "appointment-status cancelled"
                                  : "appointment-status confirmed"
                              }
                            >
                              {appointment.status ===
                              "Cancelled"
                                ? "Ακυρωμένο"
                                : "Επιβεβαιωμένο"}
                            </span>

                            <small>
                              #
                              {
                                appointment.id
                              }
                            </small>

                          </div>

                          <div className="appointment-doctor-row">

                            <div className="appointment-doctor-avatar">

                              {appointmentImage ? (
                                <img
                                  src={
                                    appointmentImage
                                  }
                                  alt={`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                                />
                              ) : (
                                <>
                                  {appointment.doctor.firstName
                                    .charAt(0)
                                    .toUpperCase()}

                                  {appointment.doctor.lastName
                                    .charAt(0)
                                    .toUpperCase()}
                                </>
                              )}

                            </div>

                            <div>

                              <h3>
                                {
                                  appointment
                                    .doctor
                                    .firstName
                                }{" "}
                                {
                                  appointment
                                    .doctor
                                    .lastName
                                }
                              </h3>

                              <p>
                                {specialtyLabels[
                                  appointment
                                    .doctor
                                    .specialty
                                ] ||
                                  appointment
                                    .doctor
                                    .specialty}
                              </p>

                            </div>

                          </div>

                          <div className="appointment-information">

                            <div>

                              <span>
                                ΗΜΕΡΟΜΗΝΙΑ
                              </span>

                              <strong>
                                {formatAppointmentDate(
                                  appointment.startsAt
                                )}
                              </strong>

                            </div>

                            <div>

                              <span>
                                ΤΟΠΟΘΕΣΙΑ
                              </span>

                              <strong>
                                {
                                  appointment
                                    .doctor
                                    .city
                                }
                              </strong>

                              <small>
                                {
                                  appointment
                                    .doctor
                                    .address
                                }
                              </small>

                            </div>

                            <div>

                              <span>
                                ΚΟΣΤΟΣ
                              </span>

                              <strong>
                                €
                                {
                                  appointment
                                    .doctor
                                    .consultationPrice
                                }
                              </strong>

                            </div>

                          </div>

                          {appointment.status !==
                            "Cancelled" &&
                            new Date(
                              appointment.startsAt
                            ) >
                              new Date() && (
                              <button
                                type="button"
                                className="cancel-appointment-button"
                                disabled={
                                  cancellingAppointmentId ===
                                  appointment.id
                                }
                                onClick={() =>
                                  void cancelAppointment(
                                    appointment.id
                                  )
                                }
                              >
                                {cancellingAppointmentId ===
                                appointment.id
                                  ? "Γίνεται ακύρωση..."
                                  : "Ακύρωση ραντεβού"}
                              </button>
                            )}

                        </article>
                      );
                    }
                  )}

                </div>
              )}

            </section>

          </div>
        )}

      {/* =================================================
          PROFILE LOADING
      ================================================= */}

      {profileLoading && (
        <div className="profile-overlay">
          <div className="profile-loading">
            Φόρτωση προφίλ...
          </div>
        </div>
      )}

      {/* =================================================
          DOCTOR PROFILE
      ================================================= */}

      {profileDoctor && (
        <div
          className="profile-overlay"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeDoctorProfile();
            }
          }}
        >

          <section className="profile-modal">

            <button
              type="button"
              className="profile-close"
              onClick={
                closeDoctorProfile
              }
            >
              ×
            </button>

            <div className="profile-top">

              <div className="profile-avatar">

                {getDoctorImageUrl(
                  profileDoctor.id,
                  profileDoctor.imageUrl
                ) ? (
                  <img
                    src={getDoctorImageUrl(
                      profileDoctor.id,
                      profileDoctor.imageUrl
                    )}
                    alt={`${profileDoctor.firstName} ${profileDoctor.lastName}`}
                  />
                ) : (
                  <>
                    {profileDoctor.firstName
                      .charAt(0)
                      .toUpperCase()}

                    {profileDoctor.lastName
                      .charAt(0)
                      .toUpperCase()}
                  </>
                )}

              </div>

              <div className="profile-main-info">

                <span className="verified-doctor">
                  ✓ Επαληθευμένος
                  γιατρός
                </span>

                <h2>
                  {
                    profileDoctor.firstName
                  }{" "}
                  {
                    profileDoctor.lastName
                  }
                </h2>

                <p className="profile-specialty">
                  {specialtyLabels[
                    profileDoctor.specialty
                  ] ||
                    profileDoctor.specialty}
                </p>

                <div className="profile-rating">

                  ★{" "}
                  {profileDoctor.rating.toFixed(
                    1
                  )}

                  <span>
                    {" "}
                    αξιολόγηση ασθενών
                  </span>

                </div>

              </div>

            </div>

            <div className="profile-divider" />

            <div className="profile-details-grid">

              <div className="profile-detail">

                <span>
                  ΤΟΠΟΘΕΣΙΑ
                </span>

                <strong>
                  {
                    profileDoctor.city
                  }
                </strong>

                <p>
                  {
                    profileDoctor.address
                  }
                </p>

              </div>

              <div className="profile-detail">

                <span>
                  ΚΟΣΤΟΣ ΕΠΙΣΚΕΨΗΣ
                </span>

                <strong>
                  €
                  {
                    profileDoctor.consultationPrice
                  }
                </strong>

                <p>
                  ανά επίσκεψη
                </p>

              </div>

            </div>

            <div className="profile-about">

              <span>
                ΣΧΕΤΙΚΑ ΜΕ ΤΟΝ ΓΙΑΤΡΟ
              </span>

              <h3>
                Επαγγελματικό προφίλ
              </h3>

              <p>
                {profileDoctor.bio ||
                  "Δεν υπάρχει διαθέσιμο βιογραφικό."}
              </p>

            </div>

            <div className="profile-features">

              <div>
                <b>✓</b>
                Online κράτηση
              </div>

              <div>
                <b>✓</b>
                Επιβεβαιωμένο προφίλ
              </div>

              <div>
                <b>✓</b>
                Άμεση διαθεσιμότητα
              </div>

            </div>

            <div className="profile-footer">

              <div>

                <small>
                  Κόστος επίσκεψης
                </small>

                <strong>
                  €
                  {
                    profileDoctor.consultationPrice
                  }
                </strong>

              </div>

              <button
                type="button"
                onClick={
                  bookFromProfile
                }
              >
                Κλείσε ραντεβού
              </button>

            </div>

          </section>

        </div>
      )}

      {/* =================================================
          BOOKING MODAL
      ================================================= */}

      {selectedDoctor && (
        <div
          className="booking-overlay"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeBooking();
            }
          }}
        >

          <section
            className="booking-modal"
            role="dialog"
            aria-modal="true"
          >

            <button
              type="button"
              className="booking-close"
              onClick={
                closeBooking
              }
            >
              ×
            </button>

            <div className="booking-header">

              <span>
                ΚΛΕΙΣΕ ΡΑΝΤΕΒΟΥ
              </span>

              <h2>
                {
                  selectedDoctor.firstName
                }{" "}
                {
                  selectedDoctor.lastName
                }
              </h2>

              <p>
                {specialtyLabels[
                  selectedDoctor.specialty
                ] ||
                  selectedDoctor.specialty}

                {" · "}

                {selectedDoctor.city}
              </p>

            </div>

            {authUser && (
              <div className="booking-user">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Κράτηση ως{" "}
                    {
                      authUser.fullName
                    }
                  </strong>

                  <small>
                    {
                      authUser.email
                    }
                  </small>

                </div>

              </div>
            )}

            {/* DATE */}

            <div className="booking-section">

              <label>
                Ημερομηνία
              </label>

              <input
                className="booking-input"
                type="date"
                value={
                  appointmentDate
                }
                min={
                  formatDateForInput(
                    new Date()
                  )
                }
                onChange={(
                  event
                ) =>
                  void changeAppointmentDate(
                    event.target.value
                  )
                }
              />

            </div>

            {/* AVAILABLE TIMES */}

            <div className="booking-section">

              <label>
                Διαθέσιμες ώρες
              </label>

              {availabilityLoading ? (
                <p className="booking-muted">
                  Φόρτωση
                  διαθεσιμότητας...
                </p>
              ) : availability.length ===
                0 ? (
                <p className="booking-muted">
                  Δεν υπάρχουν
                  διαθέσιμα ραντεβού
                  αυτή την ημέρα.
                </p>
              ) : (
                <div className="time-grid">

                  {availability.map(
                    (slot) => (
                      <button
                        type="button"
                        key={
                          slot.startsAt
                        }
                        className={
                          selectedSlot
                            ?.startsAt ===
                          slot.startsAt
                            ? "time-slot active"
                            : "time-slot"
                        }
                        onClick={() => {
                          setSelectedSlot(
                            slot
                          );

                          setBookingMessage(
                            ""
                          );

                          setBookingSuccess(
                            false
                          );
                        }}
                      >
                        {slot.time}
                      </button>
                    )
                  )}

                </div>
              )}

            </div>

            {/* PATIENT DETAILS */}

            <div className="booking-section">

              <label>
                Στοιχεία ασθενή
              </label>

              <input
                className="booking-input"
                type="text"
                placeholder="Ονοματεπώνυμο"
                value={
                  patientName
                }
                onChange={(
                  event
                ) =>
                  setPatientName(
                    event.target.value
                  )
                }
              />

              <input
                className="booking-input"
                type="email"
                placeholder="Email"
                value={
                  patientEmail
                }
                onChange={(
                  event
                ) =>
                  setPatientEmail(
                    event.target.value
                  )
                }
              />

            </div>

            {selectedSlot && (
              <div className="booking-muted">

                Επιλεγμένο
                ραντεβού:{" "}

                <strong>
                  {
                    appointmentDate
                  }{" "}
                  στις{" "}
                  {
                    selectedSlot.time
                  }
                </strong>

              </div>
            )}

            {bookingMessage && (
              <div
                className={
                  bookingSuccess
                    ? "booking-message success"
                    : "booking-message"
                }
              >
                {bookingMessage}
              </div>
            )}

            <button
              type="button"
              className="confirm-booking-button"
              disabled={
                bookingLoading ||
                availabilityLoading
              }
              onClick={() =>
                void createAppointment()
              }
            >
              {bookingLoading
                ? "Γίνεται κράτηση..."
                : "Κλείσε ραντεβού"}
            </button>

          </section>

        </div>
      )}

    </div>
  );
}

export default App;
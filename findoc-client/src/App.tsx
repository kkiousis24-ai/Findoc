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
  subspecialty: string;
  city: string;
  area: string;
  address: string;
  bio: string;
  phone: string;
  email: string;
  website: string;
  consultationPrice: number;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  acceptsInsurance: boolean;
  insuranceProviders: string;
  offersOnlineConsultation: boolean;
  isVerified: boolean;
  isActive: boolean;
  latitude: number | null;
  longitude: number | null;
  languages: string;
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
  area?: string;
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

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5087";

/* =====================================================
   LABELS
===================================================== */

const specialtyLabels: Record<
  string,
  string
> = {
  Cardiologist: "Καρδιολόγος",
  Dermatologist: "Δερματολόγος",
  Neurologist: "Νευρολόγος",
  Pediatrician: "Παιδίατρος",
  Orthopedic: "Ορθοπαιδικός",
};

const cityLabels: Record<
  string,
  string
> = {
  Athens: "Αθήνα",
  Thessaloniki: "Θεσσαλονίκη",
  Patras: "Πάτρα",
  Ioannina: "Ιωάννινα",
};

/* =====================================================
   DEMO DOCTOR PHOTOS
===================================================== */

const doctorPhotoMap: Record<
  number,
  string
> = {
  1: "https://randomuser.me/api/portraits/women/44.jpg",
  2: "https://randomuser.me/api/portraits/men/32.jpg",
  3: "https://randomuser.me/api/portraits/women/65.jpg",
  4: "https://randomuser.me/api/portraits/men/46.jpg",
  5: "https://randomuser.me/api/portraits/women/68.jpg",
  6: "https://randomuser.me/api/portraits/men/52.jpg",
  7: "https://randomuser.me/api/portraits/women/47.jpg",
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

function formatDateForInput(
  date: Date
) {
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

  date.setDate(
    date.getDate() + 1
  );

  while (
    date.getDay() === 0 ||
    date.getDay() === 6
  ) {
    date.setDate(
      date.getDate() + 1
    );
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
    searchText,
    setSearchText,
  ] = useState("");

  const [
    specialty,
    setSpecialty,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");

  const [
    area,
    setArea,
  ] = useState("");

  const [
    insurance,
    setInsurance,
  ] = useState("");

  const [
    maxPrice,
    setMaxPrice,
  ] = useState("");

  const [
    minRating,
    setMinRating,
  ] = useState("");

  const [
    language,
    setLanguage,
  ] = useState("");

  const [
    onlineOnly,
    setOnlineOnly,
  ] = useState(false);

  const [
    verifiedOnly,
    setVerifiedOnly,
  ] = useState(false);

  const [
    sort,
    setSort,
  ] = useState("rating");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    searched,
    setSearched,
  ] = useState(false);

  const [
    searchMessage,
    setSearchMessage,
  ] = useState("");

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
  ] = useState<
    number | null
  >(null);

  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {
    void loadSpecialties();
    void restoreSession();
  }, []);

  /* ===================================================
     AUTH
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
      const response =
        await fetch(
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

      const response =
        await fetch(
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

      const data =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        if (
          response.status === 401
        ) {
          setAuthMessage(
            "Λάθος email ή κωδικός."
          );
        } else if (
          response.status === 409
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
     SPECIALTIES
  =================================================== */

  async function loadSpecialties() {
    try {
      const response =
        await fetch(
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
     ADVANCED SEARCH
  =================================================== */

  async function searchDoctors() {
    try {
      setLoading(true);
      setSearchMessage("");

      const params =
        new URLSearchParams();

      if (searchText.trim()) {
        params.append(
          "q",
          searchText.trim()
        );
      }

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

      if (area.trim()) {
        params.append(
          "area",
          area.trim()
        );
      }

      if (maxPrice) {
        params.append(
          "maxPrice",
          maxPrice
        );
      }

      if (minRating) {
        params.append(
          "minRating",
          minRating
        );
      }

      if (insurance) {
        if (
          insurance ===
          "any-insurance"
        ) {
          params.append(
            "acceptsInsurance",
            "true"
          );
        } else {
          params.append(
            "insurance",
            insurance
          );
        }
      }

      if (onlineOnly) {
        params.append(
          "online",
          "true"
        );
      }

      if (verifiedOnly) {
        params.append(
          "verified",
          "true"
        );
      }

      if (language) {
        params.append(
          "language",
          language
        );
      }

      if (sort) {
        params.append(
          "sort",
          sort
        );
      }

      const query =
        params.toString();

      const url =
        query
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
          .getElementById(
            "results"
          )
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

      setSearchMessage(
        "Δεν ήταν δυνατή η αναζήτηση γιατρών."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setSearchText("");
    setSpecialty("");
    setCity("");
    setArea("");
    setInsurance("");
    setMaxPrice("");
    setMinRating("");
    setLanguage("");
    setOnlineOnly(false);
    setVerifiedOnly(false);
    setSort("rating");
  }

  /* ===================================================
     DOCTOR PROFILE
  =================================================== */

  async function openDoctorProfile(
    doctorId: number
  ) {
    try {
      setProfileLoading(true);

      const response =
        await fetch(
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

      const response =
        await fetch(
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

      const response =
        await fetch(
          `${API_URL}/api/appointments`,
          {
            method: "POST",

            headers,

            body:
              JSON.stringify({
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

      const response =
        await fetch(
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

      const response =
        await fetch(
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
          data =
            JSON.parse(text);
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
     UI
  =================================================== */

  return (
    <div className="findoc-app">

      {/* NAVBAR */}

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
              ραντεβού online.
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
                  Άμεσα και online
                </small>
              </div>
            </div>

          </div>

          {/* MAIN SEARCH */}

          <div className="search-panel">

            <div className="search-item">
              <div className="search-icon">
                ⌕
              </div>

              <div>
                <label>
                  ΑΝΑΖΗΤΗΣΗ
                </label>

                <input
                  type="text"
                  placeholder="Όνομα, ειδικότητα, περιοχή..."
                  value={searchText}
                  onChange={(event) =>
                    setSearchText(
                      event.target.value
                    )
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      void searchDoctors();
                    }
                  }}
                />
              </div>
            </div>

            <div className="search-item">
              <div className="search-icon">
                ♧
              </div>

              <div>
                <label>
                  ΕΙΔΙΚΟΤΗΤΑ
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
                    Όλες
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

            <div className="search-item">
              <div className="search-icon">
                ⌖
              </div>

              <div>
                <label>
                  ΠΟΛΗ
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

          {/* ADVANCED FILTERS */}

          <div className="search-panel">

            <div className="search-item">
              <div>
                <label>
                  ΠΕΡΙΟΧΗ
                </label>

                <input
                  type="text"
                  placeholder="π.χ. Kolonaki"
                  value={area}
                  onChange={(event) =>
                    setArea(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="search-item">
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

                  <option value="any-insurance">
                    Δέχεται ασφάλιση
                  </option>

                  <option value="EOPYY">
                    ΕΟΠΥΥ
                  </option>

                  <option value="Interamerican">
                    Interamerican
                  </option>

                  <option value="Generali">
                    Generali
                  </option>

                  <option value="Eurolife">
                    Eurolife
                  </option>
                </select>
              </div>
            </div>

            <div className="search-item">
              <div>
                <label>
                  MAX ΤΙΜΗ
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="π.χ. 50"
                  value={maxPrice}
                  onChange={(event) =>
                    setMaxPrice(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="search-item">
              <div>
                <label>
                  RATING
                </label>

                <select
                  value={minRating}
                  onChange={(event) =>
                    setMinRating(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Όλα
                  </option>

                  <option value="4">
                    4.0+
                  </option>

                  <option value="4.5">
                    4.5+
                  </option>

                  <option value="4.8">
                    4.8+
                  </option>

                  <option value="4.9">
                    4.9+
                  </option>
                </select>
              </div>
            </div>

            <div className="search-item">
              <div>
                <label>
                  ΓΛΩΣΣΑ
                </label>

                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Όλες
                  </option>

                  <option value="Greek">
                    Ελληνικά
                  </option>

                  <option value="English">
                    Αγγλικά
                  </option>

                  <option value="French">
                    Γαλλικά
                  </option>

                  <option value="German">
                    Γερμανικά
                  </option>
                </select>
              </div>
            </div>

            <div className="search-item">
              <div>
                <label>
                  ΤΑΞΙΝΟΜΗΣΗ
                </label>

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(
                      event.target.value
                    )
                  }
                >
                  <option value="rating">
                    Καλύτερη αξιολόγηση
                  </option>

                  <option value="reviews">
                    Περισσότερες κριτικές
                  </option>

                  <option value="experience">
                    Περισσότερη εμπειρία
                  </option>

                  <option value="price_asc">
                    Χαμηλότερη τιμή
                  </option>

                  <option value="price_desc">
                    Υψηλότερη τιμή
                  </option>
                </select>
              </div>
            </div>

          </div>

          <div className="trust-row">

            <label>
              <input
                type="checkbox"
                checked={onlineOnly}
                onChange={(event) =>
                  setOnlineOnly(
                    event.target.checked
                  )
                }
              />
              {" "}
              Online consultation
            </label>

            <label>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(event) =>
                  setVerifiedOnly(
                    event.target.checked
                  )
                }
              />
              {" "}
              Μόνο επαληθευμένοι
            </label>

            <button
              type="button"
              onClick={clearFilters}
            >
              Καθαρισμός φίλτρων
            </button>

          </div>

          {searchMessage && (
            <div className="empty-results">
              {searchMessage}
            </div>
          )}

        </section>

        {/* RESULTS */}

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
                              {" · "}
                              {doctor.reviewCount}
                              {" κριτικές"}
                            </div>

                            <h3>
                              {doctor.firstName}{" "}
                              {doctor.lastName}

                              {doctor.isVerified &&
                                " ✓"}
                            </h3>

                            <strong className="doctor-specialty">
                              {specialtyLabels[
                                doctor.specialty
                              ] ||
                                doctor.specialty}
                            </strong>

                            {doctor.subspecialty && (
                              <p>
                                {doctor.subspecialty}
                              </p>
                            )}

                            <p>
                              {cityLabels[
                                doctor.city
                              ] ||
                                doctor.city}

                              {doctor.area &&
                                ` · ${doctor.area}`}
                            </p>

                            <p>
                              {doctor.address}
                            </p>

                            <p>
                              {doctor.yearsOfExperience}
                              {" χρόνια εμπειρίας"}
                            </p>

                            <p>
                              🌐{" "}
                              {doctor.languages}
                            </p>

                            {doctor.acceptsInsurance && (
                              <p>
                                ✓ Ασφάλιση:{" "}
                                {
                                  doctor.insuranceProviders
                                }
                              </p>
                            )}

                            {doctor.offersOnlineConsultation && (
                              <p>
                                ✓ Online consultation
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
                                  Δες διαθεσιμότητα
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

      {/* AUTH MODAL */}

      {authOpen && (
        <div
          className="auth-overlay"
          onMouseDown={(event) => {
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

            {authMode ===
              "register" && (
              <div className="auth-field">

                <label>
                  Ονοματεπώνυμο
                </label>

                <input
                  type="text"
                  value={
                    authFullName
                  }
                  onChange={(event) =>
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
                value={authEmail}
                onChange={(event) =>
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
                value={
                  authPassword
                }
                onChange={(event) =>
                  setAuthPassword(
                    event.target.value
                  )
                }
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

          </section>
        </div>
      )}

      {/* MY APPOINTMENTS */}

      {appointmentsOpen &&
        authUser && (
          <div
            className="appointments-overlay"
            onMouseDown={(event) => {
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
                  Φόρτωση...
                </div>
              ) : myAppointments.length ===
                0 ? (
                <div className="appointments-empty">
                  Δεν έχεις ακόμη
                  ραντεβού.
                </div>
              ) : (
                <div className="appointments-list">

                  {myAppointments.map(
                    (appointment) => (
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
                          {formatAppointmentDate(
                            appointment.startsAt
                          )}
                        </p>

                        <p>
                          {
                            appointment
                              .doctor
                              .city
                          }
                          {" · "}
                          {
                            appointment
                              .doctor
                              .address
                          }
                        </p>

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
                              Ακύρωση ραντεβού
                            </button>
                          )}

                      </article>
                    )
                  )}

                </div>
              )}

            </section>
          </div>
        )}

      {/* PROFILE LOADING */}

      {profileLoading && (
        <div className="profile-overlay">
          <div className="profile-loading">
            Φόρτωση προφίλ...
          </div>
        </div>
      )}

      {/* DOCTOR PROFILE */}

      {profileDoctor && (
        <div
          className="profile-overlay"
          onMouseDown={(event) => {
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

                {profileDoctor.isVerified && (
                  <span className="verified-doctor">
                    ✓ Επαληθευμένος γιατρός
                  </span>
                )}

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

                <p>
                  {
                    profileDoctor.subspecialty
                  }
                </p>

                <div className="profile-rating">
                  ★{" "}
                  {profileDoctor.rating.toFixed(
                    1
                  )}

                  <span>
                    {" "}
                    (
                    {
                      profileDoctor.reviewCount
                    }{" "}
                    κριτικές)
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
                  {cityLabels[
                    profileDoctor.city
                  ] ||
                    profileDoctor.city}
                </strong>

                <p>
                  {profileDoctor.area}
                  {" · "}
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
              </div>

              <div className="profile-detail">
                <span>
                  ΕΜΠΕΙΡΙΑ
                </span>

                <strong>
                  {
                    profileDoctor.yearsOfExperience
                  }{" "}
                  χρόνια
                </strong>
              </div>

              <div className="profile-detail">
                <span>
                  ΓΛΩΣΣΕΣ
                </span>

                <strong>
                  {
                    profileDoctor.languages
                  }
                </strong>
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

              {profileDoctor
                .acceptsInsurance && (
                <div>
                  <b>✓</b>
                  {" "}
                  {
                    profileDoctor.insuranceProviders
                  }
                </div>
              )}

              {profileDoctor
                .offersOnlineConsultation && (
                <div>
                  <b>✓</b>
                  {" "}
                  Online consultation
                </div>
              )}

              {profileDoctor
                .isVerified && (
                <div>
                  <b>✓</b>
                  {" "}
                  Επιβεβαιωμένο προφίλ
                </div>
              )}

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

      {/* BOOKING MODAL */}

      {selectedDoctor && (
        <div
          className="booking-overlay"
          onMouseDown={(event) => {
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
                onChange={(event) =>
                  void changeAppointmentDate(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="booking-section">

              <label>
                Διαθέσιμες ώρες
              </label>

              {availabilityLoading ? (
                <p className="booking-muted">
                  Φόρτωση...
                </p>
              ) : availability.length ===
                0 ? (
                <p className="booking-muted">
                  Δεν υπάρχουν διαθέσιμα
                  ραντεβού.
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
                        onClick={() =>
                          setSelectedSlot(
                            slot
                          )
                        }
                      >
                        {slot.time}
                      </button>
                    )
                  )}

                </div>
              )}

            </div>

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
                onChange={(event) =>
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
                onChange={(event) =>
                  setPatientEmail(
                    event.target.value
                  )
                }
              />

            </div>

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
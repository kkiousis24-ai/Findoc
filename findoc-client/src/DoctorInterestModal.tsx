import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";


const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5087";


interface DoctorInterestModalProps {
  open: boolean;
  onClose: () => void;
}


interface ApiResponse {
  message?: string;
}


const greekCopy = {
  eyebrow:
    "FINDOC ΓΙΑ ΓΙΑΤΡΟΥΣ",

  title:
    "Εκδήλωση ενδιαφέροντος",

  description:
    "Συμπλήρωσε τα στοιχεία σου και η ομάδα του Findoc θα επικοινωνήσει μαζί σου σχετικά με την ένταξη στην πλατφόρμα.",

  fullName:
    "Ονοματεπώνυμο",

  specialty:
    "Ειδικότητα",

  city:
    "Πόλη",

  area:
    "Περιοχή",

  email:
    "Email",

  phone:
    "Τηλέφωνο",

  message:
    "Μήνυμα",

  optional:
    "Προαιρετικό",

  consent:
    "Συμφωνώ να επικοινωνήσει μαζί μου η ομάδα του Findoc σχετικά με την αίτησή μου.",

  submit:
    "Αποστολή ενδιαφέροντος",

  submitting:
    "Αποστολή...",

  successTitle:
    "Η αίτησή σου καταχωρήθηκε.",

  successDescription:
    "Σε ευχαριστούμε για το ενδιαφέρον σου. Η ομάδα του Findoc θα επικοινωνήσει μαζί σου.",

  close:
    "Κλείσιμο",

  requiredError:
    "Συμπλήρωσε όλα τα υποχρεωτικά πεδία.",

  consentError:
    "Χρειάζεται να αποδεχτείς την επικοινωνία.",

  genericError:
    "Δεν ήταν δυνατή η αποστολή της αίτησης.",

  serverError:
    "Δεν ήταν δυνατή η σύνδεση με τον server.",

  placeholders: {
    fullName:
      "π.χ. Ιωάννης Παπαδόπουλος",

    specialty:
      "π.χ. Καρδιολόγος",

    city:
      "π.χ. Αθήνα",

    area:
      "π.χ. Κολωνάκι",

    email:
      "doctor@example.com",

    phone:
      "69XXXXXXXX",

    message:
      "Πρόσθεσε οποιαδήποτε πληροφορία θεωρείς χρήσιμη...",
  },
};


const englishCopy = {
  eyebrow:
    "FINDOC FOR DOCTORS",

  title:
    "Register your interest",

  description:
    "Complete your details and the Findoc team will contact you regarding joining the platform.",

  fullName:
    "Full name",

  specialty:
    "Specialty",

  city:
    "City",

  area:
    "Area",

  email:
    "Email",

  phone:
    "Phone",

  message:
    "Message",

  optional:
    "Optional",

  consent:
    "I agree to be contacted by the Findoc team regarding my application.",

  submit:
    "Submit interest",

  submitting:
    "Submitting...",

  successTitle:
    "Your request has been submitted.",

  successDescription:
    "Thank you for your interest. The Findoc team will contact you.",

  close:
    "Close",

  requiredError:
    "Please complete all required fields.",

  consentError:
    "You need to consent to being contacted.",

  genericError:
    "The request could not be submitted.",

  serverError:
    "Could not connect to the server.",

  placeholders: {
    fullName:
      "e.g. John Papadopoulos",

    specialty:
      "e.g. Cardiologist",

    city:
      "e.g. Athens",

    area:
      "e.g. Kolonaki",

    email:
      "doctor@example.com",

    phone:
      "Phone number",

    message:
      "Add any additional information you would like us to know...",
  },
};


function DoctorInterestModal({
  open,
  onClose,
}: DoctorInterestModalProps) {
  const {
    i18n,
  } =
    useTranslation();


  const currentLanguage =
    i18n.language
      .split("-")[0]
      .toLowerCase();


  const copy =
    currentLanguage === "el"
      ? greekCopy
      : englishCopy;


  const [
    fullName,
    setFullName,
  ] =
    useState("");


  const [
    specialty,
    setSpecialty,
  ] =
    useState("");


  const [
    city,
    setCity,
  ] =
    useState("");


  const [
    area,
    setArea,
  ] =
    useState("");


  const [
    email,
    setEmail,
  ] =
    useState("");


  const [
    phone,
    setPhone,
  ] =
    useState("");


  const [
    message,
    setMessage,
  ] =
    useState("");


  const [
    consent,
    setConsent,
  ] =
    useState(false);


  const [
    loading,
    setLoading,
  ] =
    useState(false);


  const [
    formMessage,
    setFormMessage,
  ] =
    useState("");


  const [
    success,
    setSuccess,
  ] =
    useState(false);


  /* =====================================================
     CLOSE WITH ESC / LOCK BODY
  ===================================================== */

  useEffect(() => {
    if (!open) {
      return;
    }


    const previousOverflow =
      document.body.style.overflow;


    document.body.style.overflow =
      "hidden";


    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape" &&
        !loading
      ) {
        onClose();
      }
    }


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {
      document.body.style.overflow =
        previousOverflow;


      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    loading,
    onClose,
  ]);


  /* =====================================================
     RESET
  ===================================================== */

  function resetForm() {
    setFullName("");
    setSpecialty("");
    setCity("");
    setArea("");
    setEmail("");
    setPhone("");
    setMessage("");
    setConsent(false);
    setFormMessage("");
    setSuccess(false);
  }


  function closeModal() {
    if (loading) {
      return;
    }


    resetForm();
    onClose();
  }


  /* =====================================================
     SUBMIT
  ===================================================== */

  async function submitInterest(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();


    setFormMessage("");


    if (
      !fullName.trim() ||
      !specialty.trim() ||
      !city.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      setFormMessage(
        copy.requiredError
      );

      return;
    }


    if (!consent) {
      setFormMessage(
        copy.consentError
      );

      return;
    }


    try {
      setLoading(true);


      const response =
        await fetch(
          `${API_URL}/api/doctor-interests`,
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                fullName:
                  fullName.trim(),

                specialty:
                  specialty.trim(),

                city:
                  city.trim(),

                area:
                  area.trim(),

                email:
                  email
                    .trim()
                    .toLowerCase(),

                phone:
                  phone.trim(),

                message:
                  message.trim(),

                consentToContact:
                  consent,
              }),
          }
        );


      const data:
        ApiResponse =
        await response
          .json()
          .catch(
            () => ({})
          );


      if (!response.ok) {
        setFormMessage(
          data.message ||
            copy.genericError
        );

        return;
      }


      setSuccess(true);
      setFormMessage("");
    } catch (
      error
    ) {
      console.error(
        "Doctor interest error:",
        error
      );


      setFormMessage(
        copy.serverError
      );
    } finally {
      setLoading(false);
    }
  }


  if (!open) {
    return null;
  }


  /* =====================================================
     UI
  ===================================================== */

  return (
    <div
      className="doctor-interest-overlay"
      onMouseDown={(
        event
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          closeModal();
        }
      }}
    >
      <section
        className="doctor-interest-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-interest-title"
      >
        <button
          type="button"
          className="doctor-interest-close"
          onClick={
            closeModal
          }
          disabled={
            loading
          }
          aria-label={
            copy.close
          }
        >
          ×
        </button>


        {!success ? (
          <>
            <div className="doctor-interest-heading">
              <span>
                {copy.eyebrow}
              </span>

              <h2
                id="doctor-interest-title"
              >
                {copy.title}
              </h2>

              <p>
                {copy.description}
              </p>
            </div>


            <form
              className="doctor-interest-form"
              onSubmit={
                submitInterest
              }
            >
              <div className="doctor-interest-grid">

                <label className="doctor-interest-field">
                  <span>
                    {copy.fullName}
                    {" *"}
                  </span>

                  <input
                    type="text"
                    value={
                      fullName
                    }
                    onChange={(
                      event
                    ) =>
                      setFullName(
                        event.target.value
                      )
                    }
                    placeholder={
                      copy.placeholders.fullName
                    }
                    autoComplete="name"
                  />
                </label>


                <label className="doctor-interest-field">
                  <span>
                    {copy.specialty}
                    {" *"}
                  </span>

                  <input
                    type="text"
                    value={
                      specialty
                    }
                    onChange={(
                      event
                    ) =>
                      setSpecialty(
                        event.target.value
                      )
                    }
                    placeholder={
                      copy.placeholders.specialty
                    }
                  />
                </label>


                <label className="doctor-interest-field">
                  <span>
                    {copy.city}
                    {" *"}
                  </span>

                  <input
                    type="text"
                    value={
                      city
                    }
                    onChange={(
                      event
                    ) =>
                      setCity(
                        event.target.value
                      )
                    }
                    placeholder={
                      copy.placeholders.city
                    }
                    autoComplete="address-level2"
                  />
                </label>


                <label className="doctor-interest-field">
                  <span>
                    {copy.area}

                    <small>
                      {copy.optional}
                    </small>
                  </span>

                  <input
                    type="text"
                    value={
                      area
                    }
                    onChange={(
                      event
                    ) =>
                      setArea(
                        event.target.value
                      )
                    }
                    placeholder={
                      copy.placeholders.area
                    }
                    autoComplete="address-level3"
                  />
                </label>


                <label className="doctor-interest-field">
                  <span>
                    {copy.email}
                    {" *"}
                  </span>

                  <input
                    type="email"
                    value={
                      email
                    }
                    onChange={(
                      event
                    ) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder={
                      copy.placeholders.email
                    }
                    autoComplete="email"
                  />
                </label>


                <label className="doctor-interest-field">
                  <span>
                    {copy.phone}
                    {" *"}
                  </span>

                  <input
                    type="tel"
                    value={
                      phone
                    }
                    onChange={(
                      event
                    ) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder={
                      copy.placeholders.phone
                    }
                    autoComplete="tel"
                  />
                </label>

              </div>


              <label className="doctor-interest-field doctor-interest-message-field">
                <span>
                  {copy.message}

                  <small>
                    {copy.optional}
                  </small>
                </span>

                <textarea
                  value={
                    message
                  }
                  onChange={(
                    event
                  ) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  placeholder={
                    copy.placeholders.message
                  }
                  rows={4}
                />
              </label>


              <label className="doctor-interest-consent">
                <input
                  type="checkbox"
                  checked={
                    consent
                  }
                  onChange={(
                    event
                  ) =>
                    setConsent(
                      event.target.checked
                    )
                  }
                />

                <span>
                  {copy.consent}
                </span>
              </label>


              {formMessage && (
                <div className="doctor-interest-error">
                  {formMessage}
                </div>
              )}


              <button
                type="submit"
                className="doctor-interest-submit"
                disabled={
                  loading
                }
              >
                {loading
                  ? copy.submitting
                  : copy.submit}

                {!loading && (
                  <span
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </button>

            </form>
          </>
        ) : (
          <div className="doctor-interest-success">

            <div className="doctor-interest-success-icon">
              ✓
            </div>


            <span className="doctor-interest-success-eyebrow">
              FINDOC
            </span>


            <h2
              id="doctor-interest-title"
            >
              {copy.successTitle}
            </h2>


            <p>
              {copy.successDescription}
            </p>


            <button
              type="button"
              className="doctor-interest-submit"
              onClick={
                closeModal
              }
            >
              {copy.close}
            </button>

          </div>
        )}

      </section>
    </div>
  );
}


export default DoctorInterestModal;
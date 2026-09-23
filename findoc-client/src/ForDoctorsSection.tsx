import {
  useState,
} from "react";

import {
  useTranslation,
} from "react-i18next";

import DoctorInterestModal
  from "./DoctorInterestModal";

import "./DoctorInterestModal.css";


const greekCopy = {
  eyebrow:
    "ΓΙΑ ΓΙΑΤΡΟΥΣ",

  title:
    "Ανάπτυξε την παρουσία σου με το Findoc.",

  description:
    "Δημιούργησε μια σύγχρονη ψηφιακή παρουσία, διαχειρίσου τα ραντεβού σου και γίνε πιο εύκολα προσβάσιμος σε νέους ασθενείς.",

  benefits: [
    {
      number:
        "01",

      title:
        "Επαγγελματικό προφίλ",

      description:
        "Παρουσίασε την ειδικότητα, την εμπειρία, τις υπηρεσίες και τις πληροφορίες του ιατρείου σου.",
    },

    {
      number:
        "02",

      title:
        "Online ραντεβού",

      description:
        "Δώσε στους ασθενείς τη δυνατότητα να βλέπουν τη διαθεσιμότητά σου και να κλείνουν ραντεβού online.",
    },

    {
      number:
        "03",

      title:
        "Μεγαλύτερη προβολή",

      description:
        "Γίνε πιο εύκολα διαθέσιμος σε ανθρώπους που αναζητούν γιατρό με βάση την ειδικότητα και την περιοχή τους.",
    },
  ],

  cta:
    "Εκδήλωση ενδιαφέροντος",

  note:
    "Η εγγραφή γιατρών στο Findoc θα είναι διαθέσιμη σύντομα.",

  portal:
    "Findoc Doctor Portal",

  portalStatus:
    "Doctor profile",

  portalStatusValue:
    "Verified",

  portalAppointments:
    "Ραντεβού",

  portalAppointmentsValue:
    "24",

  portalRating:
    "Αξιολόγηση",

  portalRatingValue:
    "4.9",

  portalAvailability:
    "Διαθεσιμότητα",

  portalAvailabilityValue:
    "Ενεργή",

  portalAction:
    "Διαχείριση προφίλ",
};


const englishCopy = {
  eyebrow:
    "FOR DOCTORS",

  title:
    "Grow your presence with Findoc.",

  description:
    "Build a modern digital presence, manage your appointments and make it easier for new patients to discover you.",

  benefits: [
    {
      number:
        "01",

      title:
        "Professional profile",

      description:
        "Present your specialty, experience, services and practice information in one modern profile.",
    },

    {
      number:
        "02",

      title:
        "Online appointments",

      description:
        "Allow patients to view your availability and book appointments online.",
    },

    {
      number:
        "03",

      title:
        "Greater visibility",

      description:
        "Become easier to discover by people searching for a doctor based on specialty and location.",
    },
  ],

  cta:
    "Register your interest",

  note:
    "Doctor registration on Findoc will be available soon.",

  portal:
    "Findoc Doctor Portal",

  portalStatus:
    "Doctor profile",

  portalStatusValue:
    "Verified",

  portalAppointments:
    "Appointments",

  portalAppointmentsValue:
    "24",

  portalRating:
    "Rating",

  portalRatingValue:
    "4.9",

  portalAvailability:
    "Availability",

  portalAvailabilityValue:
    "Active",

  portalAction:
    "Manage profile",
};


function ForDoctorsSection() {
  const {
    i18n,
  } =
    useTranslation();


  const [
    interestModalOpen,
    setInterestModalOpen,
  ] =
    useState(false);


  const currentLanguage =
    i18n.language
      .split("-")[0]
      .toLowerCase();


  const copy =
    currentLanguage === "el"
      ? greekCopy
      : englishCopy;


  return (
    <>
      <section
        className="for-doctors-section"
        id="doctors"
      >
        <div className="page-width for-doctors-inner">

          {/* ============================================
              LEFT CONTENT
          ============================================ */}

          <div className="for-doctors-content">

            <span className="for-doctors-eyebrow">
              {copy.eyebrow}
            </span>


            <h2>
              {copy.title}
            </h2>


            <p className="for-doctors-description">
              {copy.description}
            </p>


            <div className="for-doctors-benefits">

              {copy.benefits.map(
                benefit => (
                  <article
                    className="for-doctors-benefit"
                    key={
                      benefit.number
                    }
                  >
                    <span className="for-doctors-benefit-number">
                      {benefit.number}
                    </span>


                    <div>
                      <h3>
                        {benefit.title}
                      </h3>

                      <p>
                        {
                          benefit.description
                        }
                      </p>
                    </div>

                  </article>
                )
              )}

            </div>


            <div className="for-doctors-actions">

              <button
                type="button"
                className="for-doctors-button"
                onClick={() =>
                  setInterestModalOpen(
                    true
                  )
                }
              >
                {copy.cta}

                <span
                  aria-hidden="true"
                >
                  →
                </span>
              </button>


              <small className="for-doctors-note">
                {copy.note}
              </small>

            </div>

          </div>


          {/* ============================================
              DOCTOR PORTAL PREVIEW
          ============================================ */}

          <div
            className="for-doctors-visual"
            aria-hidden="true"
          >
            <div className="for-doctors-dashboard">

              <div className="for-doctors-dashboard-top">

                <div>
                  <span className="for-doctors-dashboard-label">
                    FINDOC
                  </span>

                  <strong>
                    {copy.portal}
                  </strong>
                </div>


                <div className="for-doctors-dashboard-avatar">
                  DR
                </div>

              </div>


              <div className="for-doctors-dashboard-profile">

                <div className="for-doctors-dashboard-doctor">

                  <div className="for-doctors-dashboard-photo">
                    <span>
                      +
                    </span>
                  </div>


                  <div>
                    <small>
                      {
                        copy.portalStatus
                      }
                    </small>

                    <strong>
                      {
                        copy.portalStatusValue
                      }
                    </strong>
                  </div>

                </div>


                <span className="for-doctors-dashboard-verified">
                  ✓
                </span>

              </div>


              <div className="for-doctors-dashboard-stats">

                <div>
                  <small>
                    {
                      copy.portalAppointments
                    }
                  </small>

                  <strong>
                    {
                      copy.portalAppointmentsValue
                    }
                  </strong>
                </div>


                <div>
                  <small>
                    {
                      copy.portalRating
                    }
                  </small>

                  <strong>
                    ★{" "}
                    {
                      copy.portalRatingValue
                    }
                  </strong>
                </div>


                <div>
                  <small>
                    {
                      copy.portalAvailability
                    }
                  </small>

                  <strong>
                    {
                      copy.portalAvailabilityValue
                    }
                  </strong>
                </div>

              </div>


              <div className="for-doctors-dashboard-chart">

                <div className="for-doctors-chart-header">
                  <span>
                    {
                      currentLanguage ===
                      "el"
                        ? "Ραντεβού"
                        : "Appointments"
                    }
                  </span>

                  <small>
                    {
                      currentLanguage ===
                      "el"
                        ? "Τελευταίες 7 ημέρες"
                        : "Last 7 days"
                    }
                  </small>
                </div>


                <div className="for-doctors-chart-bars">

                  <span
                    style={{
                      height:
                        "38%",
                    }}
                  />

                  <span
                    style={{
                      height:
                        "62%",
                    }}
                  />

                  <span
                    style={{
                      height:
                        "48%",
                    }}
                  />

                  <span
                    style={{
                      height:
                        "78%",
                    }}
                  />

                  <span
                    style={{
                      height:
                        "58%",
                    }}
                  />

                  <span
                    style={{
                      height:
                        "90%",
                    }}
                  />

                  <span
                    style={{
                      height:
                        "72%",
                    }}
                  />

                </div>

              </div>


              <div className="for-doctors-dashboard-action">
                {copy.portalAction}

                <span>
                  →
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* ================================================
          DOCTOR INTEREST FORM
      ================================================ */}

      <DoctorInterestModal
        open={
          interestModalOpen
        }
        onClose={() =>
          setInterestModalOpen(
            false
          )
        }
      />
    </>
  );
}


export default ForDoctorsSection;
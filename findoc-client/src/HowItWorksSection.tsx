import {
  useTranslation,
} from "react-i18next";


const greekCopy = {
  eyebrow:
    "ΠΩΣ ΛΕΙΤΟΥΡΓΕΙ",

  title:
    "Ο σωστός γιατρός, σε λίγα λεπτά.",

  description:
    "Από την αναζήτηση μέχρι το ραντεβού, το Findoc κάνει όλη τη διαδικασία απλή και ξεκάθαρη.",

  steps: [
    {
      number:
        "01",

      title:
        "Βρες τον κατάλληλο γιατρό",

      description:
        "Αναζήτησε ανά ειδικότητα, πόλη, περιοχή, ασφάλιση, γλώσσα και άλλα κριτήρια.",
    },

    {
      number:
        "02",

      title:
        "Σύγκρινε πριν αποφασίσεις",

      description:
        "Δες προφίλ, εμπειρία, αξιολογήσεις, κόστος επίσκεψης και διαθέσιμες ώρες.",
    },

    {
      number:
        "03",

      title:
        "Κλείσε το ραντεβού σου",

      description:
        "Επίλεξε ημέρα και ώρα και διαχειρίσου εύκολα τα ραντεβού σου μέσα από τον λογαριασμό σου.",
    },
  ],

  cta:
    "Βρες γιατρό",
};


const englishCopy = {
  eyebrow:
    "HOW IT WORKS",

  title:
    "The right doctor, in just a few minutes.",

  description:
    "From search to appointment, Findoc makes the entire process simple and transparent.",

  steps: [
    {
      number:
        "01",

      title:
        "Find the right doctor",

      description:
        "Search by specialty, city, area, insurance, language and other criteria.",
    },

    {
      number:
        "02",

      title:
        "Compare before you decide",

      description:
        "View profiles, experience, ratings, consultation prices and available appointment times.",
    },

    {
      number:
        "03",

      title:
        "Book your appointment",

      description:
        "Choose a date and time and easily manage your appointments from your account.",
    },
  ],

  cta:
    "Find a doctor",
};


function HowItWorksSection() {
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


  return (
    <section
      className="how-it-works-section"
      id="how"
    >
      <div className="page-width how-it-works-inner">

        <div className="how-it-works-heading">

          <span className="how-it-works-eyebrow">
            {copy.eyebrow}
          </span>


          <h2>
            {copy.title}
          </h2>


          <p>
            {copy.description}
          </p>

        </div>


        <div className="how-it-works-grid">

          {copy.steps.map(
            step => (
              <article
                className="how-it-works-card"
                key={
                  step.number
                }
              >
                <div className="how-it-works-number">
                  {step.number}
                </div>


                <div className="how-it-works-line" />


                <h3>
                  {step.title}
                </h3>


                <p>
                  {
                    step.description
                  }
                </p>

              </article>
            )
          )}

        </div>


        <div className="how-it-works-action">

          <a
            href="#search"
            className="how-it-works-button"
          >
            {copy.cta}

            <span
              aria-hidden="true"
            >
              →
            </span>
          </a>

        </div>

      </div>
    </section>
  );
}


export default HowItWorksSection;
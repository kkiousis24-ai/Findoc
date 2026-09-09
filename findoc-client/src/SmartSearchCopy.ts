export interface SmartSearchCopy {
  greeting: string;

  newSearchGreeting: string;

  placeholder: string;

  send: string;

  reset: string;

  searching: string;

  noResults: string;

  error: string;

  foundOne: string;

  foundMany: string;

  activeFilters: string;

  remember: string;

  memoryActive: string;

  newConversation: string;

  close: string;

  openAssistant: string;

  closeAssistant: string;

  withInsurance: string;

  insurance: string;

  maxPrice: string;

  yearsExperience: string;

  cheapestFirst: string;

  mostExpensiveFirst: string;

  mostExperience: string;

  mostReviews: string;

  verified: string;

  online: string;

  profile: string;

  priceFrom: string;

  footerNote: string;

  quickPrompts: string[];
}


/* =====================================================
   GREEK
===================================================== */

const greekCopy:
  SmartSearchCopy = {
  greeting:
    "Γεια σου! 👋 Είμαι ο Findoc Assistant. Πες μου τι γιατρό ψάχνεις και θα σε βοηθήσω να βρεις την καλύτερη επιλογή.",

  newSearchGreeting:
    "Ξεκινάμε νέα αναζήτηση. Πες μου τι γιατρό χρειάζεσαι.",

  placeholder:
    "Συνέχισε τη συζήτηση...",

  send:
    "Αποστολή",

  reset:
    "Νέα αναζήτηση",

  searching:
    "Ψάχνω τους καλύτερους γιατρούς για εσένα...",

  noResults:
    "Δεν βρήκα γιατρό που να καλύπτει όλα αυτά τα κριτήρια. Δοκίμασε να αφαιρέσεις ή να αλλάξεις κάποιο φίλτρο.",

  error:
    "Δεν μπόρεσα να επικοινωνήσω με το Findoc αυτή τη στιγμή. Έλεγξε ότι το backend λειτουργεί και δοκίμασε ξανά.",

  foundOne:
    "Βρήκα 1 γιατρό που ταιριάζει με όσα μου έχεις ζητήσει:",

  foundMany:
    "Βρήκα {{count}} γιατρούς που ταιριάζουν με όσα μου έχεις ζητήσει:",

  activeFilters:
    "Ενεργά φίλτρα",

  remember:
    "Θυμάμαι:",

  memoryActive:
    "Μνήμη συνομιλίας ενεργή",

  newConversation:
    "Νέα συνομιλία",

  close:
    "Κλείσιμο",

  openAssistant:
    "Άνοιγμα Findoc Assistant",

  closeAssistant:
    "Κλείσιμο Findoc Assistant",

  withInsurance:
    "Με ασφάλιση",

  insurance:
    "Ασφάλιση",

  maxPrice:
    "έως €{{price}}",

  yearsExperience:
    "{{years}} χρόνια εμπειρίας",

  cheapestFirst:
    "φθηνότεροι πρώτα",

  mostExpensiveFirst:
    "ακριβότεροι πρώτα",

  mostExperience:
    "περισσότερη εμπειρία",

  mostReviews:
    "περισσότερες κριτικές",

  verified:
    "Επαληθευμένος",

  online:
    "Online",

  profile:
    "Προφίλ",

  priceFrom:
    "από",

  footerNote:
    "Findoc Assistant · Έξυπνη αναζήτηση γιατρού",

  quickPrompts: [
    "Θέλω καρδιολόγο στην Αθήνα",
    "μόνο με ΕΟΠΥΥ",
    "και μέχρι 50€",
    "μόνο online",
  ],
};


/* =====================================================
   ENGLISH
===================================================== */

const englishCopy:
  SmartSearchCopy = {
  greeting:
    "Hi! 👋 I'm the Findoc Assistant. Tell me what kind of doctor you're looking for and I'll help you find the best match.",

  newSearchGreeting:
    "Let's start a new search. Tell me what kind of doctor you need.",

  placeholder:
    "Continue the conversation...",

  send:
    "Send",

  reset:
    "New search",

  searching:
    "Searching for the best doctors for you...",

  noResults:
    "I couldn't find a doctor matching all of those criteria. Try removing or changing one of the filters.",

  error:
    "I couldn't connect to Findoc right now. Make sure the backend is running and try again.",

  foundOne:
    "I found 1 doctor matching what you've asked for:",

  foundMany:
    "I found {{count}} doctors matching what you've asked for:",

  activeFilters:
    "Active filters",

  remember:
    "I remember:",

  memoryActive:
    "Conversation memory active",

  newConversation:
    "New conversation",

  close:
    "Close",

  openAssistant:
    "Open Findoc Assistant",

  closeAssistant:
    "Close Findoc Assistant",

  withInsurance:
    "Accepts insurance",

  insurance:
    "Insurance",

  maxPrice:
    "up to €{{price}}",

  yearsExperience:
    "{{years}} years of experience",

  cheapestFirst:
    "cheapest first",

  mostExpensiveFirst:
    "most expensive first",

  mostExperience:
    "most experience",

  mostReviews:
    "most reviews",

  verified:
    "Verified",

  online:
    "Online",

  profile:
    "Profile",

  priceFrom:
    "from",

  footerNote:
    "Findoc Assistant · Conversational smart search",

  quickPrompts: [
    "I need a cardiologist in Athens",
    "only with EOPYY",
    "and under €50",
    "online only",
  ],
};


/* =====================================================
   GET COPY
===================================================== */

export function getSmartSearchCopy(
  language: string
): SmartSearchCopy {
  const normalized =
    language
      .split("-")[0]
      .toLowerCase();


  if (
    normalized ===
    "el"
  ) {
    return greekCopy;
  }


  /*
   * Για τις υπόλοιπες γλώσσες
   * χρησιμοποιούμε προσωρινά English fallback.
   *
   * Στη συνέχεια μπορούμε να προσθέσουμε
   * τα πλήρη language packs.
   */
  return englishCopy;
}


/* =====================================================
   TEMPLATE REPLACEMENT
===================================================== */

export function replaceCopyValue(
  text: string,
  key: string,
  value:
    string | number
) {
  return text.replace(
    `{{${key}}}`,
    String(
      value
    )
  );
}
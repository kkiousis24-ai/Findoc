import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import HowItWorksSection
  from "./HowItWorksSection";


function HowItWorksMount() {
  const [
    mountNode,
    setMountNode,
  ] =
    useState<HTMLDivElement | null>(
      null
    );


  useEffect(() => {
    const searchSection =
      document.getElementById(
        "search"
      );


    if (!searchSection) {
      return;
    }


    const existing =
      document.querySelector(
        ".how-it-works-slot"
      );


    if (
      existing instanceof
      HTMLDivElement
    ) {
      setMountNode(
        existing
      );

      return;
    }


    const slot =
      document.createElement(
        "div"
      );


    slot.className =
      "how-it-works-slot";


    searchSection.insertAdjacentElement(
      "afterend",
      slot
    );


    setMountNode(
      slot
    );


    return () => {
      slot.remove();
    };
  }, []);


  if (!mountNode) {
    return null;
  }


  return createPortal(
    <HowItWorksSection />,
    mountNode
  );
}


export default HowItWorksMount;
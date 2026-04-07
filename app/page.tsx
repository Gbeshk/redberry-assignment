"use client";
import { useState } from "react";

import CoursesSection from "./components/CoursesSection/CoursesSection";
import SignUpModal from "./components/SignUpModal/SignUpModal";
import SignInModal from "./components/SignInModal/SignInModal";
import ProfileModal from "./components/ProfileModal/ProfileModal";
import CurrentCourses from "./components/CurrentCourses/CurrentCourses";
import HeroSlider from "./components/HeroSlider/HeroSlider";

export default function Home() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ avatar?: string } | null>(null);

  return (
    <>
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSuccess={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
        }}
      />
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignUpClick={() => {
          setShowSignInModal(false);
          setShowSignUpModal(true);
        }}
        onSuccess={async () => {
          setIsLoggedIn(true);
          setShowSignInModal(false);
          try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(
              "https://api.redclass.redberryinternship.ge/api/me",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: "application/json",
                },
              },
            );
            const json = await res.json();
            setUserData(json.data);
          } catch (e) {}
        }}
      />
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <HeroSlider />
      <CoursesSection />
      <CurrentCourses />
    </>
  );
}

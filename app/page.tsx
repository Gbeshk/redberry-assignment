"use client";
import { useState, useEffect } from "react";

import CoursesSection from "./components/CoursesSection/CoursesSection";
import SignUpModal from "./components/SignUpModal/SignUpModal";
import SignInModal from "./components/SignInModal/SignInModal";
import ProfileModal from "./components/ProfileModal/ProfileModal";
import CurrentCourses from "./components/CurrentCourses/CurrentCourses";
import HeroSlider from "./components/HeroSlider/HeroSlider";
import EnrolledCoursesDrawer from "./components/EnrolledCoursesDrawer/EnrolledCoursesDrawer";

export default function Home() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEnrolledDrawer, setShowEnrolledDrawer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ avatar?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      fetchUserData(token);
    }

    const handleAuthUpdated = () => {
      const t = localStorage.getItem("authToken");
      if (t) {
        setIsLoggedIn(true);
        fetchUserData(t);
      }
    };
    window.addEventListener("auth-updated", handleAuthUpdated);
    return () => window.removeEventListener("auth-updated", handleAuthUpdated);
  }, []);

  const fetchUserData = async (token: string) => {
    try {
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
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  return (
    <>
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSuccess={() => {
          setShowSignUpModal(false);
          setIsLoggedIn(true);
          const token = localStorage.getItem("authToken");
          if (token) fetchUserData(token);
        }}
        onSignInClick={() => {
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
          const token = localStorage.getItem("authToken");
          if (token) {
            await fetchUserData(token);
          }
        }}
      />
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      <EnrolledCoursesDrawer
        isOpen={showEnrolledDrawer}
        onClose={() => setShowEnrolledDrawer(false)}
      />
      <HeroSlider />
      <div
        className={`flex ${isLoggedIn ? "flex-col-reverse" : "flex-col"}`}
      >
        <CoursesSection />
        <CurrentCourses
          onSignInClick={() => setShowSignInModal(true)}
          onSeeAllClick={() => setShowEnrolledDrawer(true)}
        />
      </div>
    </>
  );
}

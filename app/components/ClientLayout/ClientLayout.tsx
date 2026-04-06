"use client";
import { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SignUpModal from "../SignUpModal/SignUpModal";
import SignInModal from "../SignInModal/SignInModal";
import ProfileModal from "../ProfileModal/ProfileModal";
import EnrolledCoursesDrawer from "../EnrolledCoursesDrawer/EnrolledCoursesDrawer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<{ avatar?: string } | null>(null);
  const [showEnrolledDrawer, setShowEnrolledDrawer] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("userData");
    if (token) {
      setIsLoggedIn(true);
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    }
  }, []);
  return (
    <>
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSuccess={() => {
          setShowSignUpModal(false);
          setShowSignInModal(true);
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
            localStorage.setItem("userData", JSON.stringify(json.data));
          } catch (e) {}
        }}
      />
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <Header
        isLoggedIn={isLoggedIn}
        userData={userData}
        onSignInClick={() => setShowSignInModal(true)}
        onSignUpClick={() => setShowSignUpModal(true)}
        onProfileClick={() => setShowProfileModal(true)}
        onEnrolledCoursesClick={() => setShowEnrolledDrawer(true)} // 👈 add this
      />
      <EnrolledCoursesDrawer
        isOpen={showEnrolledDrawer}
        onClose={() => setShowEnrolledDrawer(false)}
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

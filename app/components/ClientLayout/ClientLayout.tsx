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
  const [userData, setUserData] = useState<{
    avatar?: string;
    profileComplete?: boolean;
  } | null>(null);
  const [showEnrolledDrawer, setShowEnrolledDrawer] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await fetch("https://api.redclass.redberryinternship.ge/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        });
      } catch (e) {}
    }
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setUserData(null);
    window.dispatchEvent(new Event("auth-updated-logout"));
  };

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;
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
      const u = json.data?.user ?? json.data;
      setUserData(u);
      localStorage.setItem("userData", JSON.stringify(u));
    } catch (e) {}
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      refreshUser();
    }
    const handleAuthUpdated = () => {
      setIsLoggedIn(true);
      refreshUser();
    };
    window.addEventListener("auth-updated", handleAuthUpdated);
    window.addEventListener("profile-updated", refreshUser);
    return () => {
      window.removeEventListener("auth-updated", handleAuthUpdated);
      window.removeEventListener("profile-updated", refreshUser);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      showSignUpModal || showSignInModal || showProfileModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSignUpModal, showSignInModal, showProfileModal]);

  return (
    <>
      <SignUpModal
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSuccess={() => {
          setShowSignUpModal(false);
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
          await refreshUser();
        }}
      />
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onProfileUpdated={refreshUser}
      />
      <Header
        isLoggedIn={isLoggedIn}
        userData={userData}
        onSignInClick={() => setShowSignInModal(true)}
        onSignUpClick={() => setShowSignUpModal(true)}
        onProfileClick={() => setShowProfileModal(true)}
        onEnrolledCoursesClick={() => setShowEnrolledDrawer(true)}
        onLogoutClick={handleLogout}
        profileCompleted={userData?.profileComplete}
      />
      <EnrolledCoursesDrawer
        isOpen={showEnrolledDrawer}
        onClose={() => setShowEnrolledDrawer(false)}
      />
      <main className="flex-1">{children}</main>
      <Footer
        onEnrolledCoursesClick={() => {
          if (isLoggedIn) setShowEnrolledDrawer(true);
          else setShowSignInModal(true);
        }}
        onMyProfileClick={() => {
          if (isLoggedIn) setShowProfileModal(true);
          else setShowSignInModal(true);
        }}
      />
    </>
  );
}

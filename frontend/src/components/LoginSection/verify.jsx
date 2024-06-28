import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Popup from "./Popups";

const Verify = () => {
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const { id, secret } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/register/pending", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, secret }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/");  // Assuming you have a login route
          }, 3000);
        } else {
          setMessage(data.message || "Verification failed.");
          setShowPopup(true);
        }
      } catch (error) {
        setMessage("An error occurred during verification.");
        setShowPopup(true);
      }
    };

    if (id && secret) {
      verifyUser();
    }
  }, [id, secret, navigate]);

  return (
    <div>
      <h2>Account Verification</h2>
      {showPopup && <Popup message={message} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Verify;

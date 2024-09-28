import React, { useEffect } from "react";
import { IconBrandGoogle } from "@tabler/icons-react";

export function SignUp() {
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_KEY,
      callback: handleCallbackResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleCallbackResponse = (response) => {
    const formData = new FormData();
    formData.append("token", response.credential);

    fetch("https://2403-43-231-238-206.ngrok-free.app/login/", {
      method: "POST",
      body: formData,  
    })
      .then(res => res.json())
      .then(data => {
        console.log("Backend response: ", data);
        localStorage.setItem("User", JSON.stringify(data));
      })
      .catch(err => console.error("Error in Google login: ", err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center dark:from-gray-900 dark:via-red-900 dark:to-blue-900">
      <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Welcome to MedWell
          </h2>
            <div className="mt-6" id="signInDiv">
              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition duration-200 ease-in-out"
              >
                <IconBrandGoogle className="h-5 w-5 mr-2" />
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
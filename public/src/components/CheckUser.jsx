import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const CheckUser = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if ( 
      localStorage.getItem("chat-app-user") &&
      JSON.parse(localStorage.getItem("chat-app-user"))?.isAvatarImageSet
    ) {
      navigate("/");
    } else if (localStorage.getItem("chat-app-user")) {
      navigate("/setAvatar");
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
};

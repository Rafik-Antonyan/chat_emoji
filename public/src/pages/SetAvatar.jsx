import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { styled } from "styled-components";
import { Buffer } from "buffer";
import Loader from "../assets/loader.gif";
import { ToastOptions } from "../utils/ToastOptions";
import { setAvatarRoute } from "../utils/APIRoutes";

export const SetAvatar = () => {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  useEffect(() => {
    if (
      localStorage.getItem("chat-app-user") &&
      JSON.parse?.(localStorage.getItem("chat-app-user"))?.isAvatarImageSet
    ) {
      navigate("/");
    }
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === null) {
      toast.error("Please select a Avatar for profile", ToastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      if (data.status) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.user.avatarImage;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error on avatar setting", ToastOptions);
      }
    }
  };

  const getRandomImage = async () => {
    try {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        if (!image) return;
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    getRandomImage();
  }, []);

  return (
    <>
      {!isLoading ? (
        <Container>
          <div className="title-container">
            <h1>Pick an avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
        </Container>
      ) : (
        <Container>
          <img src={Loader} alt="loader" className="loader" />
        </Container>
      )}
      <ToastContainer />
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      &:hover {
        opacity: 0.6;
        transform: scale(1.3);
        cursor: pointer;
      }
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #997af0;
    }
  }
`;

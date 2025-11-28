import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const EditProfile = ({user}) => {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [age, setAge] = useState(user?.age || "")
  const [gender, setGender] = useState(user?.gender || "")
  const [about, setAbout] = useState(user?.about || "")
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "")
  const [error, setError] = useState()
  const [showToast, setShowToast] = useState(false)
  const dispatch = useDispatch();


  const saveProfile = async () => {
    setError('')

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age,
          gender,
          about,
          photoUrl,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(addUser(res?.data?.data))
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 3000);
    } 
    catch (error) {
      setError(error.response.data)
    }

  }


  return (
    <div className="flex justify-center items-start">

      {/* Edit Profile Form */}
      <div className="flex justify-center my-10 mx-10">
        <div className="card bg-base-300 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center">Edit Profile</h2>

            {/* Fields to be editted */}
            <div>
              {/* Edit first name */}
              <label className="form-control w-full max-w-xs py-4">
                <div className="label py-2">
                  <span className="label-text">FirstName</span>
                </div>

                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="input input-bordered outline-0 w-full max-w-xs mb-6"
                />
              </label>

              {/* Edit last name */}
              <label className="form-control w-full max-w-xs">
                <div className="label py-2">
                  <span className="label-text">LastName</span>
                </div>

                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input input-bordered outline-0 w-full max-w-xs mb-6"
                />
              </label>

              {/* Edit age */}
              <label className="form-control w-full max-w-xs py-4">
                <div className="label py-2">
                  <span className="label-text">Age</span>
                </div>

                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="input input-bordered outline-0 w-full max-w-xs mb-6"
                />
              </label>

              {/* Edit gender */}
              <label className="form-control w-full max-w-xs py-4">
                <div className="label py-2">
                  <span className="label-text">Gender</span>
                </div>

                <input
                  type="text"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input input-bordered outline-0 w-full max-w-xs mb-6"
                />
              </label>

              {/* Edit about */}
              <label className="form-control w-full max-w-xs py-4">
                <div className="label py-2">
                  <span className="label-text">About</span>
                </div>

                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="input input-bordered outline-0 w-full max-w-xs mb-6"
                />
              </label>

              {/* Edit photoUrl */}
              <label className="form-control w-full max-w-xs py-4">
                <div className="label py-2">
                  <span className="label-text">Photo URL</span>
                </div>

                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="input input-bordered outline-0 w-full max-w-xs mb-6"
                />
              </label>
            </div>

            {/* Show Error */}
            <p className="text-red-500 py-2">{error}</p>

            {/* Save Profile Button */}
            <div className="card-actions justify-center mt-0.5">
              <button onClick={saveProfile} className="btn btn-primary">
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* User Card Side by Side */}
      <UserCard user={{ firstName, lastName, photoUrl, age, about, gender }} />


      {/* Toast */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-info">
            <span>Profile updated successfully</span>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default EditProfile;

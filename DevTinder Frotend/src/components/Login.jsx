import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true)
  const [error, setError] = useState('')
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      setError(error?.response?.data || "Something went wrong!!")
      console.log("Error in handleLogin function : " + error);
    }
  };


  const handleSignUp = async (params) => {
    
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      return navigate('/profile')
    } catch (error) {
      setError(error?.response?.data || "Something went wrong!!")
    }

  }


  return (
    <div className="flex justify-center my-20">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>
          <div>
            {!isLoginForm && (
              <>
                <label className="form-control w-full max-w-xs py-4">
                  <div className="label py-2">
                    <span className="label-text">First Name</span>
                  </div>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input input-bordered outline-0 w-full max-w-xs mb-6"
                  />
                </label>

                <label className="form-control w-full max-w-xs py-4">
                  <div className="label py-2">
                    <span className="label-text">Last Name</span>
                  </div>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input input-bordered outline-0 w-full max-w-xs mb-6"
                  />
                </label>
              </>
            )}

            <label className="form-control w-full max-w-xs py-4">
              <div className="label py-2">
                <span className="label-text">Email ID</span>
              </div>

              <input
                type="text"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                className="input input-bordered outline-0 w-full max-w-xs mb-6"
              />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label py-2">
                <span className="label-text">Password</span>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered outline-0 w-full max-w-xs"
              />
            </label>
          </div>

          <p className="text-red-500 py-2">{error}</p>

          <div className="card-actions justify-center mt-6">
            <button onClick={isLoginForm ? handleLogin: handleSignUp} className="btn btn-primary">
              {isLoginForm ? "Login": "Sign Up"}
            </button>
          </div>

          <p onClick={() => setIsLoginForm(isLoginForm => !isLoginForm)} className="flex justify-center py-4 cursor-pointer">{isLoginForm ? "New User? Sign Up Here": "Existing User? Login Here"}</p>

        </div>
      </div>
    </div>
  );
};

export default Login;

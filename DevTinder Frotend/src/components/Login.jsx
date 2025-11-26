import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("anupam.chacha@gmail.com");
  const [password, setPassword] = useState("Anupam@123");
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

  return (
    <div className="flex justify-center my-20">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div>
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
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered outline-0 w-full max-w-xs"
              />
            </label>
          </div>
          <p className="text-red-500 py-2">{error}</p>
          <div className="card-actions justify-center mt-6">
            <button onClick={handleLogin} className="btn btn-primary">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

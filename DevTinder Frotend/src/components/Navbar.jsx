import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const navigate= useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((store) => store?.user);
  // console.log('LoggedInUser : ', user);

  const handleLogout = async (params) => {
    
    try {
      await axios.post(BASE_URL + '/logout', {}, {withCredentials: true})
      dispatch(removeUser())
      navigate('/login')
    } catch (error) {
      console.log('Error in handleLogout() in Navabar Component : ' + error.message);
    }

  }

  return (
    <div className="navbar bg-neutral shadow-sm">
      <div className="flex-1">
        <Link to='/' className="btn btn-ghost text-xl">🧑‍💻DevTinder</Link>
      </div>
      {user && (
        <div className="flex gap-2">
            <div className="form-control mt-2">Welcome, <b>{user.firstName}</b></div>
            <div className="dropdown dropdown-end mx-5 flex">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={user.photoUrl}
                  />
                </div>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to='/profile' className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <Link to='/connections'>Connections</Link>
                </li>
                <li>
                  <Link to='/requests'>Requests</Link>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;

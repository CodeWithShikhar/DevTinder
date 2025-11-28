import React from "react";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const UserCard = ({user}) => {
    const dispatch = useDispatch()
    const feed = useSelector((store) => store.feed)
    const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

    const handleSendRequest = async (status, userId) => {
      try {  
        const res = await axios.post(
          BASE_URL + "/request/send/" + status + "/" + userId,
          {},
          { withCredentials: true }
        );
        
        dispatch(removeUserFromFeed(userId));
      } catch (error) {}
    };


    if (!feed) return

    if(feed.length <= 0 ) return <h1 className="flex justify-center my-10">No New Users Found!!</h1>


  return (
    <div className="card bg-base-300 w-96 shadow-xl my-10">
      <figure>
        <img
          src={photoUrl}
          alt="Profile Pic"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + " , " + gender}</p>}
        <p>
          {about}
        </p>
        <div className="card-actions justify-center my-4">
          <button className="btn btn-primary" onClick={() => handleSendRequest("interested", _id)}>Interested</button>
          <button className="btn btn-secondary" onClick={() => handleSendRequest("ignored", _id)}>Ignore</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;


// import React from "react";

// const UserCard = ({ user }) => {
//   if (!user) return null;

//   const {
//     firstName,
//     lastName,
//     photoUrl,
//     age,
//     gender,
//     about,
//     skills = [],
//   } = user;

//   const fullName = [firstName, lastName].filter(Boolean).join(" ");

//   // Fallback initials if no photo
//   const initials = (firstName?.[0] || "") + (lastName?.[0] || "");

//   return (
//     <div className="card bg-base-200 w-96 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-300">
//       {/* Image / Avatar */}
//       <figure className="relative h-60 w-full overflow-hidden">
//         {photoUrl ? (
//           <img
//             src={photoUrl}
//             alt={fullName || "Profile Pic"}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
//             <span className="text-4xl font-bold text-base-100">
//               {initials || "U"}
//             </span>
//           </div>
//         )}

//         {/* Small pill badge on image */}
//         <div className="absolute bottom-3 left-3 badge badge-neutral badge-lg bg-black/60 text-white border-none backdrop-blur">
//           {age ? `${age} yrs` : "Profile"}
//         </div>
//       </figure>

//       {/* Body */}
//       <div className="card-body gap-3">
//         {/* Name + gender */}
//         <div className="flex items-center justify-between gap-2">
//           <h2 className="card-title text-lg">
//             {fullName || "Unknown User"}
//           </h2>
//           {gender && (
//             <span className="badge badge-outline badge-sm uppercase">
//               {gender}
//             </span>
//           )}
//         </div>

//         {/* About */}
//         {about && (
//           <p className="text-sm text-base-content/80 leading-relaxed line-clamp-3">
//             {about}
//           </p>
//         )}

//         {/* Skills chips */}
//         {skills.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-1">
//             {skills.slice(0, 4).map((skill, idx) => (
//               <span
//                 key={idx}
//                 className="badge badge-primary badge-outline text-xs"
//               >
//                 {skill}
//               </span>
//             ))}
//             {skills.length > 4 && (
//               <span className="badge badge-ghost badge-xs">
//                 +{skills.length - 4} more
//               </span>
//             )}
//           </div>
//         )}

//         {/* Actions */}
//         <div className="card-actions justify-between mt-4">
//           <button className="btn btn-outline btn-sm flex-1">
//             Ignore
//           </button>
//           <button className="btn btn-secondary btn-sm flex-1">
//             Interested
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserCard;

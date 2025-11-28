import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '../utils/constants'
import { addRequests, removeRequest } from '../utils/requestSlice'

const Requests = () => {
    const dispatch = useDispatch()
    const requests = useSelector((store) => store.requests)


    // Show all the requests
    const fetchRequests = async () => {
        
        try {
            const res = await axios.get(BASE_URL + '/user/requests/recieved', {
                withCredentials: true
            })
            // console.log('Requests 👉', res?.data.pendingConnectionRequest);
            
            dispatch(addRequests(res?.data.pendingConnectionRequest))
        } catch (error) {
            
        }

    }


    useEffect(() => {
        fetchRequests()
    }, [])


    // Review a request - Accept it or Reject it
    const reviewRequest = async (status, requestId) => {

      try {
        const res = await axios.post(BASE_URL + "/request/review/" + status + "/" + requestId, 
          {}, 
          {
            withCredentials: true
          })
          dispatch(removeRequest(requestId))
      } catch (error) {
        
      }

    }


  if(!requests) return;


  if(requests.length == 0) return <h1 className='flex justify-center text-bold text-2xl my-10'>No Requests Found</h1>
  

  return (
    <div className='text-center my-10'>
      <h1 className='text-bold text-white text-2xl'>Requests</h1>

      {
        requests.map((request) => {
          const {_id, firstName, lastName, about, age, gender, photoUrl} = request.fromUserId

          return (
            <div key={_id} className="flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 w-2/3 mx-auto">

              <div>
                <img className="h-20 w-20 rounded-full object-contain" src={photoUrl} alt="photo" />
              </div>

              <div className='text-left mx-4'>
                <h2 className='font-bold'>{firstName + "  " + lastName}</h2>
                {age && gender && <p> {age + " , " + gender} </p>}
                <p>{about}</p>
              </div>

              <div>
                <button className='btn btn-primary mx-2' onClick={() => reviewRequest("accepted", request._id)}>Accept</button>
                <button className='btn btn-secondary mx-2' onClick={() => reviewRequest("rejected", request._id)}>Reject</button>
              </div>

            </div>
          );
        })
      }

    </div>
  )
}

export default Requests

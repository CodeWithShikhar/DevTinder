import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'

const Connections = () => {
  const dispatch = useDispatch()
  const connections = useSelector((store) => store.connections)

  const fetchConnections = async () => {
    
    try {
      const res = await axios.get(BASE_URL + '/user/connections', {
        withCredentials: true
      })

      console.log(res?.data.myAllConnections);
      dispatch(addConnections(res?.data.myAllConnections))
      
    } catch (error) {
      
    }

  }

  useEffect(() => {
    fetchConnections()
  }, [])

  if(!connections) return

  if(connections.length === 0) <h1 className='text-bold text-2xl'>No Connections Found</h1>

  return (
    <div className='text-center my-10'>
      <h1 className='text-bold text-white text-2xl'>Connections</h1>

      {
        connections.map((connection) => {
          const {_id, firstName, lastName, about, age, gender, photoUrl} = connection

          return (
            <div key={_id} className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto">

              <div>
                <img className="h-20 w-20 rounded-full object-contain" src={photoUrl} alt="photo" />
              </div>

              <div className='text-left mx-4'>
                <h2 className='font-bold'>{firstName + "  " + lastName}</h2>
                {age && gender && <p> {age + "  " + gender} </p>}
                <p>{about}</p>
              </div>

            </div>
          );
        })
      }

    </div>
  )
}

export default Connections

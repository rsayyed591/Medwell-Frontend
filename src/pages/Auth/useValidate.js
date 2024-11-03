import {useEffect,useState} from 'react'
import axios from 'axios'
export const useValidate = ({Token}) => {
  const [status, setStatus] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(()=>{
    const validate = async () => {
      try {
        const response = await axios.post(
          `${google_ngrok_url}/auth/validate/`,
          { Checking: "OK" },
          {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
          }
        )
        setStatus(response.data.status)
      } catch (error) {
        console.error('Error:', error)
        setError(error.response?.data?.message || error.message || 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    validate()
  }, [])
  return {error,isLoading,status}
}

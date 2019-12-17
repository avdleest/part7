import axios from 'axios'
const baseUrl = `${BACKEND_URL}/users`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}


export default { getAll }
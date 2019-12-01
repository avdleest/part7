import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
  //   const source = axios.CancelToken.source()

  //   try {
  //     const response = await axios.get(baseUrl, {
  //       cancelToken: source.token
  //     })
  //     return ({
  //       users: response.data,
  //       source
  //     })
  //   } catch (error) {
  //     if (axios.isCancel(error)) {
  //       //
  //     } else {
  //       throw error
  //     }
  //   }
  // }
}


export default { getAll }
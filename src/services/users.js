import axios from 'axios'

const baseUrl = `/api/users`

let token = null

const setToken = (tokenToSet) => {
    token = `bearer ${tokenToSet}`
}

const removeToken = () => {
    token = null
}

const createNew = async (user) => {
    const response = await axios.post(baseUrl, user)
    return response.data
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getOne = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    console.log(response.data)
    return response.data
}

const getStoresCreatedByUser = async (userId) => {
    const response = await axios.get(`${baseUrl}/${userId}/stores`)
    return response.data
}

const getStoresCreatedByUserWithProducts = async (userId) => {
    const response = await axios.get(`${baseUrl}/${userId}/stores/all`)
    return response.data
}

const deleteUserAccount = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    console.log(response)
    return response
}

export default {
    setToken,
    removeToken,
    createNew,
    getAll,
    getOne,
    getStoresCreatedByUser,
    getStoresCreatedByUserWithProducts,
    deleteUserAccount
}
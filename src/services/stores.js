import axios from 'axios'
import { formatListOfObjects } from './imageFormatting'

let token = null

const baseUrl = `/api/stores`

const setToken = (tokenToSet) => {
    token = `bearer ${tokenToSet}`
}

const removeToken = () => {
    token = null
}

const createNew = async (newStore) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post(baseUrl, newStore, config)
    return response.data
}

const getOne = async (storeId) => {
    const response = await axios.get(`${baseUrl}/${storeId}`)
    const formatted = formatListOfObjects(response.data)
    return formatted
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    const formatted = formatListOfObjects(response.data)
    return formatted
}

const getAllProductsOfAStore = async (storeId) => {
    const response = await axios.get(`${baseUrl}/${storeId}/products`)
    const formatted = formatListOfObjects(response.data)
    return formatted
}


const update = async (updatedStore) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.put(`${baseUrl}/${updatedStore._id}`, updatedStore, config)
    const formatted = formatListOfObjects(response.data)
    return formatted
}


const deleteStore = async (storeId) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.delete(`${baseUrl}/${storeId}`, config)
    return response.data
}

export default {
    setToken,
    removeToken,
    createNew,
    getOne,
    getAll,
    getAllProductsOfAStore,
    update,
    deleteStore
}
import axios from 'axios'
import { formatListOfObjects } from './imageFormatting'

let token = null
const baseUrl = `/api/products`

const setToken = (tokenToSet) => {
    token = `bearer ${tokenToSet}`
}

const removeToken = () => {
    token = null
}

const createNew = async (newProduct) => {
    const config = {
        headers: { Authorization: token}
    }
    const response = await axios.post(baseUrl, newProduct, config)
    return response.data
}

const getAll = async () => {
    const response = await axios.get(baseUrl)
    const formatted = formatListOfObjects(response.data)
    return formatted
}

const getOne = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    const formatted = formatListOfObjects(response.data)
    return formatted
}

const update = async (updatedProduct) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.put(`${baseUrl}/${updatedProduct._id}`, updatedProduct, config)
    return response.data
}

const deleteProduct = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

export default {
    setToken,
    removeToken,
    createNew,
    getOne,
    getAll,
    update,
    deleteProduct
}
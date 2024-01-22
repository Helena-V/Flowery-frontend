import axios from 'axios'
import { formatListOfImages } from './imageFormatting'

let token = null

const baseUrl = `/api/images`

const setToken = (tokenToSet) => {
    token = `bearer ${tokenToSet}`
}

const removeToken = () => {
    token = null
}

const uploadNew = async (imageData) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.post(baseUrl, imageData, config)
    return response
}

const getOne = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response
}

const getAllByUser = async (userId) => {
    const response = await axios.get(`${baseUrl}/user/${userId}`)
    const formatted = formatListOfImages(response.data)
    return response.data
}


const deleteImage = async (id) => {
    const config = {
        headers: { Authorization: token }
    }
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

export default {
    setToken,
    removeToken,
    uploadNew,
    getOne,
    getAllByUser,
    deleteImage
}
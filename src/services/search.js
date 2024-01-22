import axios from 'axios'
import { formatListOfObjects } from './imageFormatting'

const baseUrl = `/api/search`

const searchProducts = async (word) => {
    const toSearch = {
        word: word
    }
    console.log(toSearch)
    const result = await axios.post(`${baseUrl}/products`, toSearch)
    const formatted = formatListOfObjects(result.data)
    return formatted
}

const searchStores = async (word) => {
    const toSearch = {
        word: word
    }
    console.log(toSearch)
    const result = await axios.post(`${baseUrl}/stores`, toSearch)
    const formatted = formatListOfObjects(result.data)
    return formatted
}

const searchAll = async (word) => {
    const toSearch = {
        word: word
    }
    console.log(toSearch)
    const result = await axios.post(`${baseUrl}/all`, toSearch)
    const products = formatListOfObjects(result.data.products)
    const stores = formatListOfObjects(result.data.stores)
    return { products, stores }
}

export default {
    searchProducts,
    searchStores,
    searchAll
}
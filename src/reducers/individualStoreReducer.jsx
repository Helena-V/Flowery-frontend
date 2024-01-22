import storeService from '../services/stores'
import productService from '../services/products'

const initialState = null

export const setStoreWithQuery = (storeId) => {
    return async dispatch => {
        const response = await storeService.getOne(storeId)
        console.log(response)
        dispatch({
            type: 'SET_STORE',
            payload: response
        })
    }
}

export const getAllProductsOfAStoreWithQuery = (storeId) => {
    return async dispatch => {
        const allProducts = await storeService.getAllProductsOfAStore(storeId)
        console.log(allProducts)
        dispatch({
            type: 'GET_ALL_PRODUCTS_OF_A_STORE',
            payload: allProducts
        })
    }
}

export const setProductsOfAStore = (store, products) => {
    const newStore = { ...store, products: products }
    return {
        type: 'SET_STORE',
        payload: newStore
    }
}

export const setStoreWithoutQuery = (store) => {
    return {
        type: 'SET_STORE',
        payload: store
    }
}

export const resetStateOfStore = () => {
    return {
        type: 'SET_STORE',
        payload: null
    }
}

export const createProductAndAddProductToStore = (store, product, token) => {
    return async dispatch => {
        productService.setToken(token)
        const created = await productService.createNew(product)
        const newProducts = store.products.concat(created._id)
        const newState = { ...store, products: newProducts }
        dispatch({
            type: 'ADD_PRODUCT_TO_STORE',
            payload: newState
        })
    }
}

export const deleteProductFromStore = (store, productToRemove, token) => {
    console.log(store, productToRemove)
    return async dispatch => {
        productService.setToken(token)
        await productService.deleteProduct(productToRemove._id)
        const filtered = store[0].products.filter(product => !product._id === productToRemove._id)
        const newStore = { ...store, products: filtered }
        dispatch({
            type: 'SET_STORE',
            payload: newStore
        })

    }
}

const individualStoreReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_STORE': {
            const newState = action.payload
            return newState            
        }
        case 'ADD_PRODUCT_TO_STORE': {
            const newState2 = action.payload
            return newState2            
        }
        case 'GET_ALL_PRODUCTS_OF_A_STORE': {
            const altered = { ...state, products: action.payload }
            return altered            
        }
        default:
            return state
    }
}

export default individualStoreReducer
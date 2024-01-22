import productService from '../services/products'

const initialState = {
    recentlyViewed: [],
    justAdded: [],
    productAtHand: null
}

export const setProductWithQuery = (productId) => {
    return async dispatch => {
        const response = await productService.getOne(productId)
        dispatch({
            type: 'SET_PRODUCT',
            payload: response
        })
    }
}

export const setProductWithoutQueryAndUpdateViews = (product) => {
    return {
        type: 'SET_PRODUCT_AND_UPDATE_VIEWS',
        payload: product
    }
}

export const resetProductAtHand = () => {
    return {
        type: 'RESET_PRODUCT_AT_HAND',
        payload: null
    }
}

export const resetAll = () => {
    return {
        type: 'RESET_ALL',
        payload: null
    }
}

export const updateJustAdded = (product) => {
    console.log(product)
    return {
        type: 'UPDATE_JUST_ADDED',
        payload: product
    }
}

export const updateRecentlyViewed = (product) => {
    return {
        type: 'UPDATE_RECENTLY_VIEWED',
        payload: product
    }
}

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PRODUCT': {
            const newState = { ...state, productAtHand: action.payload }
            console.log('SET_PRODUCT:', newState)
            return newState            
        }
        case 'UPDATE_JUST_ADDED': {
            const newArray = state.justAdded.concat(action.payload)
            const newState2 = { ...state, justAdded: newArray }
            return newState2            
        }
        case 'UPDATE_RECENTLY_VIEWED': {
            const newArray2 = state.recentlyViewed.concat(action.payload)
            const newState3 = { ...state, recentlyViewed: newArray2 }
            return newState3            
        }
        case 'RESET_PRODUCT_AT_HAND': {
            const newState4 = { ...state, productAtHand: null }
            return newState4            
        }
        case 'RESET_ALL':
            return initialState
        case 'SET_PRODUCT_AND_UPDATE_VIEWS': {
            const newState5 = { ...state, productAtHand: action.payload }
            newState5.recentlyViewed = state.recentlyViewed.concat(action.payload)
            console.log('SET_PRODUCT_AND_UPDATE_VIEWS', newState5)
            return newState5            
        }
        default:
            return state
    }
}

export default productReducer
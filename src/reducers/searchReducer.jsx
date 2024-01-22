import searchService from '../services/search'

const initialState = {
    word: '',
    option: '',
    products: [],
    stores: [],
    loadingReady: false
}

export const resetSearchValues = () => {
    console.log('reducer, reset ')
    return {
        type: 'RESET_SEARCH',
        payload: {
            word: '',
            option: '',
            products: [],
            stores: [],
            loadingReady: false
        }
    }
}

export const setSearchValues = (word, option) => {
    console.log('reducer, set search values: ', word, option)
    let searchOption = null
    if (option === '') {
        searchOption ='all'
    } else {
        searchOption = option
    }
    return {
        type: 'SET_SEARCH',
        payload: {
            word: word,
            option: searchOption,
            products: [],
            stores: [],
            loadingReady: false
        }
    }
}

export const searchProducts2 = (word) => {
    return async dispatch => {
        console.log('täällä')
        const result = await searchService.searchProducts(word)
        console.log(result)
        dispatch({
            type: 'SEARCH_PRODUCTS',
            payload: {
                word: word,
                option: 'products',
                products: result,
                stores: [],
                loadingReady: false
            }
        })
    }
}

export const searchStores2 = (word) => {
    return async dispatch => {
        console.log('tässä')
        const result = await searchService.searchStores(word)
        console.log(result)
        dispatch({
            type: 'SEARCH_STORES',
            payload: {
                word: word,
                option: 'stores',
                products: [],
                stores: result,
                loadingReady: false
            }
        })
    }
}

export const searchAll2 = (word) => {
    console.log('reducer, search all2: ', word)
    return async dispatch => {
        const result = await searchService.searchAll(word)
        dispatch({
            type: 'SEARCH_ALL',
            payload: {
                word: word,
                option: 'all',
                products: result.products,
                stores: result.stores,
                loadingReady: false
            }
        })
    }
}

export const setLoadingReady = () => {
    return {
        type: 'SET_LOADING_READY',
        payload: {
            loadingReady: true
        }
    }
}
 
const searchReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'RESET_SEARCH':
            return initialState
        case 'SET_SEARCH':
        case 'SEARCH_ALL':
        case 'SEARCH_PRODUCTS':
        case 'SEARCH_STORES':
            const newState = action.payload
            return newState
        case 'SET_LOADING_READY':
            const newOne = {...state, loadingReady: action.payload.loadingReady}
            return newOne
        default:
            return state
    }
}

export default searchReducer
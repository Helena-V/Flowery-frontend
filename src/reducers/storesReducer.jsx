import storeService from '../services/stores'

export const getAllStores = () => {
    return async dispatch => {
        const stores = await storeService.getAll()    
        dispatch({
            type: 'ALL_STORES',
            payload: stores
        })
    }
}

export const newStore = (store, token) => {
    return async dispatch => {
        storeService.setToken(token)
        const response = await storeService.createNew(store)
        dispatch({
            type: 'NEW_STORE',
            payload: response
        })
    }
}

const storeReducer = (state = [], action) => {
    switch (action.type) {
        case 'NEW_STORE':
            state = state.concat(action.payload)
            return state
        case 'ALL_STORES':
            const newState = action.payload
            return newState
        default:
            return state
    }
}

export default storeReducer
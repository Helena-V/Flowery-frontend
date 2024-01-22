
const initialState = []

export const addProductToCart = (product) => {
    return {
        type: 'ADD_PRODUCT',
        payload: product
    }
}

export const removeProductFromCart = (productId) => {
    return {
        type: 'REMOVE_FROM_CART',
        payload: productId
    }
}

export const resetShoppingCart = () => {
    return {
        type: 'RESET_CART',
        payload: null
    }
}

export const setStateOfACart = (listOfItems) => {
    return {
        type: 'SET_STATE_OF_A_CART',
        payload: listOfItems
    }
}

const shoppingCartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_STATE_OF_A_CART':
            state = action.payload
            window.localStorage.setItem('shoppingCart', JSON.stringify(state))
            return state
        case 'RESET_CART':
            state = initialState
            window.localStorage.removeItem('shoppingCart')
            return state
        case 'ADD_PRODUCT': {
            console.log(action.payload)
            let found = state.find(product => product._id === action.payload._id)
            console.log(found)
            if (found) {
                if (found.itemsInCart) {
                    found.itemsInCart ++
                } else {
                    found.itemsInCart = 2
                }
                state = state.filter(product => product._id === action.payload)
                state = state.concat(found)
                window.localStorage.setItem('shoppingCart', JSON.stringify(state))
                return state
            }
            const newState = state.concat(action.payload)
            window.localStorage.setItem('shoppingCart', JSON.stringify(newState))
            console.log(newState)
            return newState            
        }
        case 'REMOVE_FROM_CART': {
            let foundItem  = state.find(product => product._id === action.payload)
            window.localStorage.removeItem('shoppingCart')
            if (foundItem.itemsInCart) {
                foundItem.itemsInCart --
                if (foundItem.itemsInCart < 2) {
                    state.filter(product => !(product._id === action.payload))
                    window.localStorage.setItem('shoppingCart', JSON.stringify(state))
                    return state
                } else {
                    state.filter(product => !(product._id === action.payload))
                    state.concat(foundItem)
                    window.localStorage.setItem('shoppingCart', JSON.stringify(state))
                    return state                
                }
            } else {
                state = state.filter(product => !(product._id === action.payload))
                window.localStorage.setItem('shoppingCart', JSON.stringify(state))
                return state
            }            
        }
        default:
            return state
    }
}

export default shoppingCartReducer
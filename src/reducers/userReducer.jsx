import userService from '../services/users'
import storeService from '../services/stores'

const initialState = {
    user: null,
    token: null
}

export const setUser = (userinfo) => {
    window.localStorage.setItem('userLoggedIn', JSON.stringify(userinfo))
    return {
        type: 'SET_USER',
        payload: {
            user: userinfo.user,
            token: userinfo.token
        }
    }
}

export const logoutUser = () => {
    userService.removeToken()
    storeService.removeToken()
    window.localStorage.removeItem('userLoggedIn')
    return {
        type: 'REMOVE_USER',
        payload: null
    }
}

export const deleteStoreCreatedByUser = (userinfo, storeId) => {
    return async dispatch => {
        try {
            storeService.setToken(userinfo.token)
            await storeService.deleteStore(storeId)
            const filtered = userinfo.user.stores.filter(store => !(store._id === storeId))
            const newUser = { ...userinfo.user, stores: filtered }
            window.localStorage.setItem('userLoggedIn', JSON.stringify(userinfo))           
            dispatch({
                type: 'SET_USER',
                payload: {
                    user: newUser,
                    token: userinfo.token
                }
            })
        } catch (error) {
            throw error
        }

    }
}


export const updateUser = (oldUserinfo) => {
    return async dispatch => {
        try {
            const user = await userService.getOne(oldUserinfo.user._id)
            const userinfo = { user: user, token: oldUserinfo.token }
            window.localStorage.setItem('userLoggedIn', JSON.stringify(userinfo))
            dispatch({
                type: 'SET_USER',
                payload: {
                    user: user,
                    token: oldUserinfo.token
                }
            })
        } catch (error) {
            throw error
        }
    }
}


const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            const newState = action.payload
            return newState
        case 'REMOVE_USER':
            return initialState
        default:
            return state
    }
}

export default userReducer
import { configureStore } from '@reduxjs/toolkit'
import messageReducer from './reducers/messageReducer'
import userReducer from './reducers/userReducer'
import storesReducer from './reducers/storesReducer'
import individualStoreReducer from './reducers/individualStoreReducer'
import productReducer from './reducers/productReducer'
import shoppingCartReducer from './reducers/shoppingCartReducer'
import searchReducer from './reducers/searchReducer'


const store = configureStore({
    reducer: {
        messages: messageReducer,
        userinfo: userReducer,
        allStores: storesReducer,
        thisStore: individualStoreReducer,
        thisProduct: productReducer,
        shoppingCart: shoppingCartReducer,
        searchStatus: searchReducer
    }
})

export default store
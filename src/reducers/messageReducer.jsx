
const initialState = {
    text: '',
    style: '',
    visibility: false
}

export const newMessage = (message, color) => {
    const str = 'ui ' + color + ' message'
    return async dispatch => {
        dispatch({
            type: 'NEW_MESSAGE',
            payload: {
                text: message,
                style: str,
                visibility: true
            }
        })
        await setTimeout(() => {
            dispatch({
                type: 'RESET',
                payload: {
                    text: '',
                    style: '',
                    visibility: false
                }
            })
        }, 5000)
    }
}

export const resetMessage = () => {
    return {
        type: 'RESET'
    }
}

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'NEW_MESSAGE':
            state = action.payload
            return state
        case 'RESET':
            state = initialState
            return state
        default:
            return state
    }
}

export default messageReducer
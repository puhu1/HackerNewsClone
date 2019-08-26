import { createStore, combineReducers } from 'redux'

const storyReducer = (state = [], action) => {
    switch (action.type) {
        case "TOP_STORIES": {
            // console.log("ini",state)
            state[action.payload.id] = action.payload
            // console.log(state[action.payload.id])
        }
    }
    return state

}

const commentReducer = (state = [], action) => {
    switch (action.type) {
        case "COMMENT": {
            state[action.payload.id] = action.payload
            break
        }
        case "CLEAR_COMMENT": {
            state = []
        }
    }
    return state
}

export const store = createStore(combineReducers({ commentReducer, storyReducer }))

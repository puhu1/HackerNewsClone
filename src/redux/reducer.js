import {createStore, combineReducers} from 'redux'

const storyReducer = (state=[],action)=>{
    switch(action.type){
        case "TOP_STORIES": {
            state = state.concat(action.payload)
        }
    }
    return state

}

const commentReducer = (state=[], action)=>{
    switch(action.type){
        case "COMMENT":{
            state = state.concat(action.payload)
        }
    }
    return state
}

export const store = createStore(combineReducers({commentReducer, storyReducer}))
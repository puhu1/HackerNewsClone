import { TOP_STORY_URL, ITEM_URL } from "../common/constants";
import { store } from "../redux/reducer";

export const fetchStoryIds = () => {
    fetch(TOP_STORY_URL)
        .then(response => response.json())
        .then(response => {
            response.forEach((val, index) => {
                fetchInfoById(val)
            })
        })
}

export const fetchInfoById = (id) => {
    fetch(`${ITEM_URL + id}.json?print=pretty`)
        .then(res => res.json())
        .then((res) => {
            store.dispatch({
                type:"TOP_STORIES",
                payload:res
            })
            if(res.kids && res.kids.length>0){
                fetchNestedChildComments(res.kids)
            }
        })
}

export const fetchNestedChildComments = (ids)=>{
    ids.map(id=>{
        fetch(`${ITEM_URL + id}.json?print=pretty`)
        .then(res => res.json())
        .then((res) => {
            if (res.deleted === undefined){
                store.dispatch({
                    type:"COMMENT",
                    payload:res
                })
            } 
            if(res.kids && res.kids.length>0){
                fetchNestedChildComments(res.kids)
            }
        })
    })
}
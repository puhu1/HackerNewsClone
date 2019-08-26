import { TOP_STORY_URL, ITEM_URL } from "../common/constants";
import { store } from "../redux/reducer";

export const fetchStoryIds = () => {
    fetch(TOP_STORY_URL)
        .then(response => response.json())
        .then(response => {
            response.forEach((val, index) => {
                if (index < 20)
                    fetchInfoById(val, "TOP_STORIES")
            })
        })
}

export const fetchInfoById = (id, type) => {
    fetch(`${ITEM_URL + id}.json?print=pretty`)
        .then(res => res.json())
        .then((res) => {
            if (res) {
                store.dispatch({
                    type: type,
                    payload: res
                })
                if (type == "COMMENT" && res.kids) {
                    res.kids.map(val => {
                        fetchInfoById(val, "COMMENT")
                    })
                }
            }
        })
}

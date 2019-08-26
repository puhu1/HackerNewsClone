import React, { Component } from 'react'
import ContainerHeader from './ContainerHeader';
import { Card, CardContent, Button } from '@material-ui/core';
import { timeAgo } from '../common/timeFormat'
import { fetchInfoById } from "../redux/apiDataFetch";
import { store } from "../redux/reducer";

export class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page_title: "Comments",
            by: '',
            url: '',
            comment_text: '',
            score: 0,
            story_id: '',
            kids_comment: [],
            comments: [],
            story:''
        }
    }

    componentDidMount() {
        let story_id = this.props.match.params['id']
        this.setState({ story_id: story_id })
        store.subscribe(() => {
            this.setState({ comments: store.getState()['commentReducer'] })
        })
        if(this.state.story===''){
            let data = store.getState()['storyReducer'][story_id]
            this.setState({
                by: data.by, 
                url: data.url, 
                comment_text: data.title,
                score: data.score,
                time: timeAgo(data.time), 
                kids_comment: data.kids ? data.kids : [],
                story : data
             })
            data.kids.map(val=>{
                fetchInfoById(val, "COMMENT")
            })
        }
    }

    componentWillUnmount() {
        store.dispatch({
            type: 'CLEAR_COMMENT',
            payload: []
        })
    }

    displayComments(ids, margin) {
        let all_comments = ids.map(id => {
            let current_comment = this.state.comments[id]
            if (current_comment) {
                return (
                    <div>
                        <Card>
                            <CardContent>
                                <p style={{ fontStyle: 'italic', color: '#A5A5A5', float: "left" }}> {current_comment.by} commented {timeAgo(current_comment.time)} </p>
                                <br /><br /><p style={{ padding: '5px' }}>{current_comment.text}</p>
                            </CardContent>
                            <div>
                                {current_comment.kids ?
                                    <span style={{ float: 'left' }}>{current_comment.kids.length} comments</span> : <span style={{ float: 'left' }}>0 comments</span>
                                }
                                <br /><br /><div style={{ marginLeft: `${margin}%` }}>
                                    {
                                        current_comment.kids ? this.displayComments(current_comment.kids, margin + 3) : ''
                                    }
                                </div>
                            </div>
                        </Card>
                    </div>
                )
            }
        })
        return all_comments
    }

    render() {
        const { page_title, url, score, by, kids_comment, comment_text, time } = this.state
        const comments_to_display = this.displayComments(kids_comment, 3)
        return (
            <div>
                <ContainerHeader title={page_title} />
                <span>
                    <h3 style={{ paddig: "2px" }}>{comment_text}  <a href={url}>({url})</a></h3>
                    <p style={{ color: '#808080' }}>by {by} | {score} points | {kids_comment.length} comments | {time}</p>
                </span>
                <span>
                    {
                        comments_to_display
                    }
                </span>
            </div>
        )
    }
}
export default Comments
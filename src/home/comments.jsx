import React, { Component } from 'react'
import ContainerHeader from './ContainerHeader';
import { Card, CardContent } from '@material-ui/core';
import { timeAgo } from '../common/timeFormat'

import { ITEM_URL } from '../common/constants'

export class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page_title: "Comments",
            by: '',
            kids: [],
            kids_comment: [],
            kids_comment_kids: [],
            inner_comments: {},
            comment_id: [],
            active_id: '',
            score: ''
        }
    }

    componentDidMount() {
        this.getStroyId()
    }

    getStroyId() {
        let split_id = window.location.pathname.split("/")
        let story_id = split_id[split_id.length - 1]
        this.fetchCommentWidStoryId(story_id)
    }
    fetchCommentWidStoryId(id) {
        fetch(`${ITEM_URL + id}.json?print=pretty`)
            .then(res => res.json())
            .then(parentCommentData => {
                this.setState({
                    by: parentCommentData.by,
                    text: parentCommentData.title,
                    kids: parentCommentData.kids,
                    score: parentCommentData.score,
                    url: parentCommentData.url
                })
                this.fetchKidsComment()
            })
    }
    fetchKidsComment (node = null){
        if (node) {
            if (node.id === this.state.active_id) {
                return
            }
            this.setState({ active_id: node.id })
            var kids = node.kids
        }
        else {
            var kids = this.state.kids
        }
        if (kids !== undefined && kids.length !== 0) {
            kids.map(value => {
                fetch(`${ITEM_URL + value}.json?print=pretty`)
                    .then(res => res.json())
                    .then(kidsComment => {
                        if (kidsComment.deleted === undefined) {
                            var commentObject = {}
                            commentObject["text"] = kidsComment.text
                            commentObject['kids'] = kidsComment.kids
                            commentObject['by'] = kidsComment.by
                            commentObject['time'] = timeAgo(kidsComment.time)
                            commentObject['parent'] = kidsComment.parent
                            commentObject['id'] = kidsComment.id
                            if (node===null) {
                                this.setState({
                                    kids_comment: this.state.kids_comment.concat(commentObject)
                                })
                            }
                            else {
                                this.setState({
                                    kids_comment_kids: this.state.kids_comment_kids.concat(commentObject)
                                })
                                if (this.state.kids_comment_kids.length === kids.length) {
                                    let comment = []
                                    for (var i = 0; i < this.state.kids_comment_kids.length; i++) {
                                        let text = this.state.kids_comment_kids[i]
                                        let card =

                                            <Card style={{ width: "70%", float: "right" }}>
                                                <CardContent>
                                                    <br /><br /><p style={{ fontStyle: 'italic', color: '#A5A5A5', float: "left" }}> {text.by} commented {text.time} </p>
                                                    <br /><br />
                                                    <span style={{ padding: '5px' }}>{text.text}</span><br /><br />
                                                    {text.kids ?
                                                        <span onClick={(event) => this.fetchKidsComment(text)} style={{ cursor: "pointer", fontStyle: 'italic', color: '#A5A5A5', float: "right" }}>{text.kids.length} comments </span>
                                                        : <span style={{ fontStyle: 'italic', color: '#A5A5A5', float: "right" }}>0 comments </span>}
                                                    {this.state.comment_id.includes(text.parent) || this.state.comment_id.includes(text.id) ? this.state.inner_comments[text.id] : []}
                                                </CardContent>
                                            </Card>

                                        comment.push(card)
                                        let dict_ = this.state.inner_comments
                                        dict_[text.id] = card
                                        this.setState({ inner_comments: dict_ })
                                    }
                                    var dict_ = this.state.inner_comments
                                    dict_[node.id] = comment
                                    this.setState({ inner_comments: dict_ })
                                    if (this.state.comment_id.includes(node.parent)) {
                                        this.setState({ comment_id: this.state.comment_id.concat(node.id) })
                                    }
                                    else {
                                        this.setState({ comment_id: [node.id] })

                                    }

                                    this.setState({ kids_comment_kids: [] })
                                }
                            }

                        }
                    })
            })
        }
    }

    render() {
        let comment = []
        this.state.kids_comment.forEach(text => {
            comment.push(
                <Card>
                    <CardContent>
                        <br /><br /> <p style={{ fontStyle: 'italic', color: '#A5A5A5', float: "left" }}> {text.by} commented {text.time} </p>
                        <br /><br />
                        <span style={{ pfetchKidsCommentadding: '5px' }}>{text.text}</span><br /><br />
                        {text.kids ?
                            <span onClick={(event) => this.fetchKidsComment(text)} style={{ cursor: "pointer", fontStyle: 'italic', color: '#A5A5A5', float: "right" }}>{text.kids.length} comments </span>
                            : <span style={{ fontStyle: 'italic', color: '#A5A5A5', float: "right" }}>0 comments </span>}
                        {this.state.comment_id.includes(text.parent) || this.state.comment_id.includes(text.id) ? this.state.inner_comments[text.id] : []}
                    </CardContent>
                </Card>

            )
        })

        return (
            <div>
                <ContainerHeader title={this.state.page_title} />
                {this.state.text ?
                    <span>
                        <h3 style={{ paddig: "2px" }}>{this.state.text}  <a href={this.state.url}>({this.state.url})</a></h3>
                        <p style={{ color: '#808080' }}>{this.state.score} points by {this.state.by}  | {this.state.kids_comment.length} comments</p>
                    </span> : "Loading...please wait or refresh the page"}
                <span>{comment}</span>
            </div>
        )
    }

}
export default Comments
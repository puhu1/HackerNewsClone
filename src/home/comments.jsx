import React, { Component } from 'react'
import ContainerHeader from './ContainerHeader';
import { Card, CardContent } from '@material-ui/core';
import { Story, Comment } from "./data";
import { timeAgo } from './timeFormat'

export class Comments extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page_title: "Comments",
            story_id: '',
            by: '',
            parent_text: '',
            kids: [],
            kids_comment: [],
            kids_comment_kids: [],
            parentof_kids: '',
            grand_parent: '',
            kidsOfkids: '',
            api_call: false,
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
        this.setState({ story_id: story_id })
        this.fetchCommentWidStoryId(story_id)


    }
    fetchCommentWidStoryId(id) {
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
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
    fetchKidsComment = () => {
        let kids = this.state.kids
        if (kids !== undefined && kids.length !== 0) {
            kids.map((value, i) => {
                fetch(`https://hacker-news.firebaseio.com/v0/item/${value}.json?print=pretty`)
                    .then(res => res.json())
                    .then(kidsComment => {
                        if (kidsComment.deleted === undefined) {
                            var dd = {}
                            dd["text"] = kidsComment.text
                            dd['kids'] = kidsComment.kids
                            dd['by'] = kidsComment.by
                            dd['time'] = timeAgo(kidsComment.time)
                            dd['parent'] = kidsComment.parent
                            dd['id'] = kidsComment.id
                            this.setState({
                                grand_parent: kidsComment.parent,
                                kids_comment: this.state.kids_comment.concat(dd)
                            })
                        }
                    })
            })
        }
    }

    fetchChildComment(event, node) {
        if (node.id === this.state.active_id) {
            return
        }
        this.setState({ active_id: node.id })
        let kids = node.kids
        this.setState({ api_call: true })
        if (kids !== undefined && kids.length !== 0) {
            for (var i = 0; i < kids.length; i++) {
                let value = kids[i]
                fetch(`https://hacker-news.firebaseio.com/v0/item/${value}.json?print=pretty`)
                    .then(res => res.json())
                    .then(kidsComment => {
                        var dd = {}
                        dd["text"] = kidsComment.text
                        dd['kids'] = kidsComment.kids
                        dd['by'] = kidsComment.by
                        dd['id'] = kidsComment.id
                        dd['time'] = timeAgo(kidsComment.time)
                        dd['parent'] = kidsComment.parent

                        this.setState({
                            kids_comment_kids: this.state.kids_comment_kids.concat(dd)
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
                                                <span onClick={(event) => this.fetchChildComment(event, text)} style={{ cursor: "pointer", fontStyle: 'italic', color: '#A5A5A5', float: "right" }}>{text.kids.length} comments </span>
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

                    })
            }
        }
    }
    render() {
        let comment = []
        let kids_comment = this.state.kids_comment.forEach(text => {
            comment.push(
                <Card>
                    <CardContent>
                        <br /><br /> <p style={{ fontStyle: 'italic', color: '#A5A5A5', float: "left" }}> {text.by} commented {text.time} </p>
                        <br /><br />
                        <span style={{ padding: '5px' }}>{text.text}</span><br /><br />
                        {text.kids ?
                            <span onClick={(event) => this.fetchChildComment(event, text)} style={{ cursor: "pointer", fontStyle: 'italic', color: '#A5A5A5', float: "right" }}>{text.kids.length} comments </span>
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
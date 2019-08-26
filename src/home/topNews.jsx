import React, { Component } from 'react'
import { Card, CardContent, Button } from '@material-ui/core';
import ContainerHeader from './ContainerHeader';
import { Link } from 'react-router-dom'
import { timeAgo } from '../common/timeFormat'
import { fetchStoryIds } from "../redux/apiDataFetch";
import { store } from '../redux/reducer'

export class topNews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            news_stories: [],
            page_title: "Top Hacker-News",
        }
    }
    componentDidMount() {
        store.subscribe(() => {
            this.setState({ news_stories: store.getState()['storyReducer'] })
        })
        if (store.getState()['storyReducer'].length == 0) {
            fetchStoryIds()
        }
        else {
            this.setState({ news_stories: store.getState()['storyReducer'] })
        }
    }


    render() {
        const { page_title, news_stories } = this.state
        console.log("toppppppp",   Object.entries(news_stories))
        return (
            <div>
                <ContainerHeader title={page_title} />
                {
                    Object.entries(news_stories).map(([key,val]) => {
                        return (<Card color="primary" text="white" style={{ width: 'auto', height: 'auto', marginTop: '5px' }}>
                            <CardContent >
                                {val.title}
                                <span>
                                    <p style={{ color: '#A5A5A5' }}>{val.score} points by {val.by} | posted {timeAgo(val.time)}</p>
                                    {val.kids ?
                                        <Link to={"/comment/" + val.id}>{val.kids.length} Comments</Link> :
                                        <Link to="/">0 Comments</Link>
                                    }
                                </span>
                            </CardContent>
                        </Card>)
                    })
                }
            </div>
        )
    }
}

export default topNews

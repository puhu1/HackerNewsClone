import React, { Component } from 'react'
import { Card, CardContent} from '@material-ui/core';
import ContainerHeader from './ContainerHeader';
import { Link } from 'react-router-dom'
import Comments from './comments';
import {timeAgo} from './timeFormat'

const TOP_STORY_URL ='https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
const ITEM_URL ='https://hacker-news.firebaseio.com/v0/item/'
export class topNews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            story_id: [],
            news_stories: [],
            start_index: 0,
            content_page: 15,
            page_title: "Top Hacker-News",
            open_comment: false,
        }
        this._isMounted = false

    }
    componentDidMount() {
        this._isMounted = true
        this.fetchStoryIds()

    }
    componentWillUnmount(){
        this._isMounted = false
    }

    fetchStoryIds = () => {
        fetch(TOP_STORY_URL)
            .then(response => response.json())
            .then(response => {
                
                response.forEach((val, index) => {
                    if(this._isMounted)
                    this.fetchInfoById(val)
                })
            })
    }

    fetchInfoById = (id) => {
        fetch(`${ITEM_URL+id}.json?print=pretty`)
            .then(res => res.json())
            .then((res) => {
        if(this._isMounted)
                this.setState({ news_stories: this.state.news_stories.concat(res) })
            })
    }
    compareValue(val1, val2) {
        if (val1.score == val2.score) {
            return 0
        }
        if (val1.score > val2.score) {
            return -1
        }
        else {
            return +1
        }
    }

    render() {
        var news_stories = this.state.news_stories
        var stories = news_stories.map(val => {
            return (
                <Card color="primary" text="white" style={{ width: 'auto', height: 'auto', marginTop: '5px' }}>
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
                </Card>
            )
        }, this)

        return (
            <div>
                {this.state.current_id ? <Comments id={this.state.current_id}/>:
                
                <div><ContainerHeader title={this.state.page_title} />
                
                {stories}
                </div>
                
            }
                
            </div>

        )
    }
}

export default topNews

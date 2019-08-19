import React, { Component } from 'react'
import { Card, CardContent } from '@material-ui/core';
import ContainerHeader from './ContainerHeader';
import { Link } from 'react-router-dom'
import Comments from './comments';
import { timeAgo } from '../common/timeFormat'
import { fetchStoryIds } from "../redux/apiDataFetch";
import {store} from '../redux/reducer'

export class topNews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            news_stories: [],
            page_title: "Top Hacker-News",
        }
    }
    componentDidMount() {
        store.subscribe(()=>{
            this.setState({news_stories:this.state.news_stories.concat(store.getState()['storyReducer'])})
            console.log(store.getState());
            
        })
        
        if(store.getState()['storyReducer'].length == 0){
            fetchStoryIds()
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
            })
        return (
            <div>
                  <ContainerHeader title={this.state.page_title} />
                        {stories}
                {/* {this.state.current_id ? <Comments id={this.state.current_id} /> :
                    <div>
                      
                    </div>
                } */}
            </div>

        )
    }
}

export default topNews

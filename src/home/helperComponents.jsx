import React, { Component } from 'react'
export class OuterComment extends Component{

    constructor(props){
        super(props)
    }
    render(){
      console.log("inner",this.props);
      
        var comment = this.props.comment.state;
        return (<div>
          <p>{comment.commented_by} says {comment.text}</p>
          <InnerComment comments={comment.child_comments} all_comments={this.props.all_comments} />
        </div>)
    }

}

export class InnerComment extends Component{
    constructor(props){
        super(props)
    }
    render(){
      console.log(this.props)
        return (<div>
          {this.props.comments ?
            this.props.comments.map(function(comment){
            return <OuterComment comment={this.props.all_comments[comment]} all_comments={this.props.all_comments} />
          }):''}
        </div>)
      }
}
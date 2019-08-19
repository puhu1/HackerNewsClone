
        export class Story {
            constructor(props){
                this.state = {
                    title : '',
                    posted_by : '',
                    time : 0,
                    id:0,
                    score : 0,
                    url:'',
                    type:'',
                    comments:[]
                }
            }
            
        }



        export class Comment{
            constructor(props){
                this.state={
                    commented_by:'',
                    time:0,
                    id:'',
                    type:'',
                    child_comments :[],
                    text:''
                }
            }
            
        }

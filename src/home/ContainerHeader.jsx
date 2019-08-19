import React, { Component } from 'react'
import  {App} from '../App.css';


export class ContainerHeader extends Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                            <header className="App-header">
                                {this.props.title}
                            </header>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContainerHeader

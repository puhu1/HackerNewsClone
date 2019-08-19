import React from 'react';
// import logo from './logo.svg';
import './App.css';
import TopNews from './home/topNews';
import Comments from './home/comments'
import { BrowserRouter, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <header className="App-header"></header> */}
          <Switch>
          <Route path="/comment/:id" component={Comments}/>
          <Route path="/" component={TopNews}/>
          
          </Switch>
          
        
      </div>
    </BrowserRouter>

  );
}

export default App;

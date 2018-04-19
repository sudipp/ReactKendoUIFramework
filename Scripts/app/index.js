import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App';

import MessageAPI from './services/MessageAPI';
import AppStartupAPI from './services/AppStartupAPI';

const debug = require('debug');



debug.log = console.info.bind(console);
localStorage.debug = 'sei.*';



//load all syatem messages
MessageAPI.ld();

//bootstart the app
AppStartupAPI.start();

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.querySelector('my-app'));


kendo.culture("en-US");

/*
const Index = (props) => (    
  <div>    
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </div>
)
//export default App
ReactDOM.render( <Index Name="sudip" /> , document.querySelector('my-app'));*/
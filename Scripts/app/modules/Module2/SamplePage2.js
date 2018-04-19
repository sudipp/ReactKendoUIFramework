import React from 'react';
import ReactDOM from 'react-dom';
import AppConfig from 'AppConfig';
import conf from "./../../../../config/web.config";

class SamplePage2 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        
                //<br/>property value passed from caller {this.props.Name}
        return ( <div>
                
                <h1>Sereen2</h1>
                
                <br/>{conf}    
                <br/>config value - {AppConfig.ServiceBaseUrl}                
                
            </div>
        );
    }

    componentDidMount(e) {
    }

    componentWillUnmount() {
    }
};

export default SamplePage2;
//ReactDOM.render( < SamplePage1 / > , document.querySelector('my-app'));

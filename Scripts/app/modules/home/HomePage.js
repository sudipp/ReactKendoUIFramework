import React from 'react';
import ReactDOM from 'react-dom';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return ( < div ><h1>Home page</h1></div>
        );
    }

    componentDidMount(e) {
    }

    componentWillUnmount() {
    }
};

export default HomePage
//ReactDOM.render( < SamplePage1 / > , document.querySelector('my-app'));

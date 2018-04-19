import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import AppConfig from 'AppConfig';
import AppStartupAPI from './../services/AppStartupAPI';


export default class SeiWfState extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            statusArray: [
                'Submit To Manager',
                'Manager Approval',
                'SEI Manager Approval',
            ],
            currentStateIndex: this.props.currentStateIndex,
        }
        
        //setting default properties
        this.setDefaultConfigs();
    }


    /**
     * @private - Set default config for the component.
     * @param [in|out] type parameter_name Parameter description.
     * @param [in|out] type parameter_name Parameter description.
     * @return void.
     */
    setDefaultConfigs = () => {
        //setting id, if not set
        //if (this.props.id == null)
        //    this.props.id = new kendo.util.guid().getNew();
    }

    /*@public - to be used for caller to update any specifc state
     */
    setControlState = (name, value) => {
        this.setState({ [name]: value });
    }
    
    deleteMYMT = (mymt) => {        
        this.state.mymts.splice(mymt, 1);
        this.setControlState("mymts", this.state.mymts);
        
        const element = ReactDOM.findDOMNode(this);
        $(element).trigger("changed", {mymts : this.state.mymts, sender: this});        
    }
    
    /**
     * @private - render wf steps
     */
    renderWFSteps =(status, index)=>{
        if (index <= this.state.currentStateIndex) {
            return (
                <div className="stepwizard-step" id={"WFSteps" +status} >
                    <a href="#" type="button" className="btn btn-success btn-circle glyphicon glyphicon-ok"></a>
                    <p>{status}</p>
                </div>
            );
        } else {
            return ( 
                <div className="stepwizard-step" id={"WFSteps" +status}>
                    <a href="#" type="button" className="btn btn-default btn-circle" >&nbsp;</a>
                    <p>{status}</p>
                </div>
            );
        }
    }
    
    /**
     * @private components render implementation
     */
    render() {
        let currentStateIndex = this.state.currentStateIndex;
        return ( 
            <div className="stepwizard col-md-offset-0">
                <div className="stepwizard-row setup-panel">            
                    {
                        this.state.statusArray.map((status, i) =>
                            this.renderWFSteps(status,i)
                        )
                    }
                </div>
            </div>
        );
    }
    
    /**
     * @private component's shouldComponentUpdate implementation
     */
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }
    /**
     * @private component's componentDidUpdate implementation
     */
    componentDidUpdate(prevProps, prevState, snapshot) {            
    }
    
    
    componentDidMount(e) {
        /*const element = ReactDOM.findDOMNode(this);
        //attach events
        var options= this.props.options || {};        
        if (options.changed != undefined){
            $(element).unbind("changed", options.changed)
                .bind("changed", options.changed);
        }*/
    }

    componentWillUnmount() {
    }
};


SeiWfState.propTypes = {
    currentStateIndex: PropTypes.number, 
    currentStateIndex: PropTypes.func.isRequired
}

/**
 * @private - defaultProps for the component.
 * @return void.
 */

SeiWfState.defaultProps = {
    currentStateIndex : 0,
    id : new kendo.util.guid().getNew()
};
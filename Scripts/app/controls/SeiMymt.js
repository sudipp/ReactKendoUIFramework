import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import kendo from '@progress/kendo-ui';
import './kendo.common.js';
import AppConfig from 'AppConfig';
import AppStartupAPI from './../services/AppStartupAPI';
import SeiMasterList from './SeiMasterList';

let SelectedMake = "";
let SelectedModel = "";
let SelectedTrim = "";
let SelectedYear = "";
let SubModel = "";
let SelectedMYMTSK = 0;

class SeiMymt extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            mymts: this.props.mymts,
            mymt: kendo.data.Model.define({
                id: "Make",
                fields: {
                    Make: { type: "string" },
                    Year: { type: "string" },
                    Model: { type: "string" },
                    Trim: { type: "string" },
                    SubModel: { type: "string" }
                }
            })
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

    
    MakeDDlOptions = {
        master: {
            tableName: "MYMT",
            key: "Make",
            value: "Make",
            where: ""
        },
        dataTextField: "Value",
        dataValueField: "Key",
        optionLabel: "-- Select --",
        autobind: true,
        placeholder: "Select an item...",
        dataBind : function(){
            debugger;
        },
        change: (e)=>{            
            SelectedMake = e.sender.value();
            this.ModelDDL.updateWhereClause("MAKE ='" + SelectedMake + "'");
            this.ModelDDL.kList.dataSource.read();
        }
    }
    ModelDDlOptions = { 
        master: {
            tableName: "MYMT",
            key: "Model",
            value: "Model",
            where: "MAKE ='" + SelectedMake + "'"
        },
        dataTextField: "Value",
        dataValueField: "Key",    
        optionLabel: "-- Select --",
        autobind: true,
        placeholder: "Select an item...",
        dataBind : function(){
            debugger;
        },
        change: ((e)=>{
            SelectedModel = e.sender.value();  
            this.YearDDL.updateWhereClause("MAKE ='" + SelectedMake + "' AND Model = '" + SelectedModel + "'");
            this.YearDDL.kList.dataSource.read();
        })
    }
    YearDDLOptions = {
        master: {
            tableName: "MYMT",
            key: "YEAR",
            value: "YEAR",
            where: "MAKE ='" + SelectedMake + "' AND Model = '" + SelectedModel + "'"
        },
        dataTextField: "Value",
        dataValueField: "Key",
        optionLabel: "-- Select --",
        autobind: true,
        autoClose: false,
        placeholder: "Select an item...",
        change: (e)=>{
            SelectedMYMTSK = e.sender.value();
            SelectedYear = e.sender.value();        
            if (SelectedYear.length > 1)
                this.TrimDDL.updateWhereClause("MAKE ='" + SelectedMake + "' AND YEAR in (" + SelectedYear + ") AND Model = '" + SelectedModel + "'");
            else
                this.TrimDDL.updateWhereClause("MAKE ='" + SelectedMake + "' AND YEAR =  '" + SelectedYear + "' AND Model = '" + SelectedModel + "'");
            
            this.TrimDDL.kList.dataSource.read();
        }
    }    
    TrimDDLOptions = {
        master: {
            tableName: "MYMT",
            key: "MYMT_SK",
            value: "Trim",
            where: "MAKE ='" + SelectedMake + "' AND YEAR = '" + SelectedYear + "' AND Model = '" + SelectedModel + "'"
        },
        dataTextField: "Value",
        dataValueField: "Key",
        optionLabel: "-- Select --",
        autobind: true,
        placeholder: "Select an item...",
        addSelectAll: true,
        change: function (e) {
            SelectedTrim = e.sender.text();        
        }
    }
    
    addNewMYMTEvHandler = (e) => {
        
        var mymts = this.state.mymts;    
        var mymt= this.state.mymt;
        
        var duplicatemymt = $.grep(mymts, function (e) {
            return (e.Make == SelectedMake && e.Model == SelectedModel &&
                (e.Year == (SelectedYear.length > 1 ? SelectedYear.join(', ') : SelectedYear))
                && e.Trim == SelectedTrim &&
                e.SubModel == $("#txtSubModel").val());
        }).length > 0;
        
        if (duplicatemymt) {
            alert("A combination of Make/Year/Model/Trim/Sub Model is already exist.");
            return;
        }
        
        var validateTrimAll = $.grep(mymts, function (e) {
            return (e.Make == SelectedMake && e.Model == SelectedModel &&
                (e.Year == (SelectedYear.length > 1 ? SelectedYear.join(', ') : SelectedYear))
                && SelectedTrim == '--ALL--')
                ||
                (e.Make == SelectedMake && e.Model == SelectedModel &&
                    (e.Year == (SelectedYear.length > 1 ? SelectedYear.join(', ') : SelectedYear))
                    && e.Trim == '--ALL--');
        }).length > 0;

        if (validateTrimAll) {
            alert("Please delete existing Trims for this make/model/year if you select Trim as ALL");
            return;
        }
            
        
        var emptyMymt = new mymt();// model.createEmptyMYMT();
        emptyMymt.set("Make", SelectedMake);
        emptyMymt.set("Year", SelectedYear.length > 1 ? (SelectedYear.join(', ')) : (SelectedYear));
        emptyMymt.set("Model", SelectedModel);
        emptyMymt.set("Trim", SelectedTrim);
        emptyMymt.set("SubModel", $("#txtSubModel").val());        
        mymts.unshift(emptyMymt);

        //clear values
        this.MakeDDL.kList.select(0);
        this.ModelDDL.kList.select(0);
        this.YearDDL.kList.value("");//select(0);
        this.TrimDDL.kList.select(0);
        $("#txtSubModel").val("");
        
        
        SelectedMYMTSK = 0;
        SelectedMake = "";
        SelectedModel = "";
        SelectedTrim = "";
        SelectedYear = "";
        SubModel = "";
        
        this.setControlState("mymts", mymts);
        
        const element = ReactDOM.findDOMNode(this);
        $(element).trigger("changed",{mymts : mymts, sender: this});
    }
    
    deleteMYMT = (mymt) => {        
        this.state.mymts.splice(mymt, 1);
        this.setControlState("mymts", this.state.mymts);
        
        const element = ReactDOM.findDOMNode(this);
        $(element).trigger("changed", {mymts : this.state.mymts, sender: this});        
    }
    renderMYMT() {  
        
        return (
            <div className="row">
                <div className="col-md-9">
                    <table>
                        <thead className="k-grid-header">
                            <tr>
                                <th></th>
                                <th className="quoteheader">Make</th>
                                <th className="quoteheader">Model</th>
                                <th className="quoteheader">Year</th>
                                <th className="quoteheader">Trim</th>
                                <th className="quoteheader">SubModel</th>
                            </tr>
                        </thead>
                        <tbody >            
                            {
                                this.state.mymts.map((object, i) =>
                                    <tr>
                                        <td>
                                            <img className="deleteMymt" onClick = {() => this.deleteMYMT(object)} />
                                        </td>
                                        <td data-bind="text: Make">{object.Make}</td>
                                        <td data-bind="text: Model">{object.Model}</td>
                                        <td data-bind="text: Year">{object.Year}</td>
                                        <td data-bind="text: Trim">{object.Trim}</td>
                                        <td data-bind="text: SubModel">{object.SubModel}</td>
                                    </tr>
                                )
                            }            
                        </tbody>            
                    </table>
                </div>
            </div>
        );
    }

    /**
     * @private components render implementation
     */
    render() {
        return (                 
            <div id = { "Seimymt_" + this.props.id } >
                <div className="form-group row">
                        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Make</label>
                        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Model</label>
                        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Year</label>
                        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Trim</label>
                        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Sub-Model</label>
                        <div className="col-auto my-1"></div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-2">
                            <SeiMasterList ref={instance => {this.MakeDDL = instance;}} id="Make" listType="dropdownlist" 
                                listOptions= {this.MakeDDlOptions} />
                        </div>
                        <div className="col-sm-2">
                            <SeiMasterList ref={instance => {this.ModelDDL = instance;}} id="Model" listType="dropdownlist" 
                                listOptions= {this.ModelDDlOptions} />
                        </div>
                        <div className="col-sm-2">
                            <SeiMasterList ref={instance => {this.YearDDL = instance;}} id="Year" listType="multiselect" 
                                listOptions= {this.YearDDLOptions} />                            
                        </div>
                        <div className="col-sm-2">
                            <SeiMasterList ref={instance => {this.TrimDDL = instance;}} id="Trim" listType="dropdownlist" 
                                listOptions= {this.TrimDDLOptions} /> 
                        </div>
                        <div className="col-sm-2">
                            <input id="txtSubModel" type="text" maxLength="30" className="form-control input-sm" name="Sub Model" />
                        </div>
                        <div className="col-auto my-1">
                            <button className="k-button" id="btnAddMYMT" title="AddMYMT" onClick={this.addNewMYMTEvHandler} >Add</button>
                        </div>
                    </div>
                    {this.renderMYMT()}
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
        const element = ReactDOM.findDOMNode(this);
        //attach events
        var options= this.props.options || {};        
        if (options.changed != undefined){
            $(element).unbind("changed", options.changed)
                .bind("changed", options.changed);
        }
    }

    componentWillUnmount() {
    }
};


SeiMymt.propTypes = {
    //mymts: PropTypes.Array,
}

/**
 * @private - defaultProps for the component.
 * @return void.
 */

SeiMymt.defaultProps = {
    mymts : [],
    id : new kendo.util.guid().getNew()
};


export default SeiMymt;
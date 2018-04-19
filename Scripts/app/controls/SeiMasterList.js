import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import kendo from '@progress/kendo-ui';
import './kendo.common.js';
import AppConfig from 'AppConfig';
import AppStartupAPI from './../services/AppStartupAPI';
//import MessageAPI from './../services/MessageAPI';

var masterDropdownDataSource = function () {

    //keep self reference
    var self = this;
    //input for kendo data source
    this.input = {};

    this.noRecords = null;

    this.kendoDataSource = new kendo.data.DataSource({
        transport: {
            read: AppStartupAPI.CreateTransport(function () {
                if (self.input.master.srvUri != undefined)
                    //return crudServiceBaseUrl + "/" + self.input.master.srvUri;
                    return self.input.master.srvUri;
                else
                    return "http://torahmd66x10m2:10002/api/MasterData/GetDropdownListMasterData/"
                    //return crudServiceBaseUrl + "/api/MasterData/GetDropdownListMasterData/"
                        + self.input.master.tableName + "/"
                        + self.input.master.where + "/"
                        + self.input.master.key + "/"
                        + self.input.master.value;

            }, "get")
        },
        //Fix for Defect #1911
        schema: {
            data: function (data,event) {
                //debugger;
                //'dataLoaded' custom event, triggered, with number of record bound to the control
                self.kendoDataSource.trigger("dataLoaded", {
                    data: data,
                    srcEvent:event
                });

                return data;
            }
        },
    });
};
//caller will set input through setInput()
masterDropdownDataSource.prototype.setInput = function (inputParam) {
    this.input = inputParam;
};


class SeiMasterList extends React.Component {
    constructor(props) {
        super(props);

        //setting default properties
        this.setDefaultConfigs();

        if (this.props.listOptions.dataSource != null && this.props.listOptions.master != null) {
            throw new Error("listOptions for Master List[" + this.props.id + "]" + " should have either have 'dataSource' or 'master' defined");
        }
    }


    /**
     * @private - Set default config for the component.
     * @param [in|out] type parameter_name Parameter description.
     * @param [in|out] type parameter_name Parameter description.
     * @return void.
     */
    setDefaultConfigs = () => {
        //setting id, if not set
        if (this.props.id == null)
            this.props.id = new kendo.util.guid().getNew();

    }

    /*@public - to be used for caller to update any specifc state
     */
    setControlState = (name, value) => {
        this.setState({ [name]: value });
    }

    /**
     * @private component's shouldComponentUpdate implementation
     */
    shouldComponentUpdate(nextProps, nextState) {
        return true;
        /*if (this.props.color !== nextProps.color) {
          return true;
        }*/
        if (this.state.searchShow !== nextState.searchShow) {
            return true;
        }
        return false;
    }
    /**
     * @private component's componentDidUpdate implementation
     */
    componentDidUpdate(prevProps, prevState, snapshot) {            
    }

    /**
     * @private components render implementation
     */
    render() {
        return (                 
            <div id = { "eqMasterList_" + this.props.id } ></div>
        );
    }

    attachEventHandlers = () => {
        
        
    }
    
    updateWhereClause = (updatedWhereClause) => {        
        this.props.listOptions.master.where = encodeURIComponent(updatedWhereClause);
    }
    updateSrvUri = (updatedSrvUri) => {        
        this.props.listOptions.master.srvUri = updatedSrvUri;
    }
    
    componentDidMount(e) {

        //const element = ReactDOM.findDOMNode(this);
        
        if (this.props.listOptions.dataSource == null) {
            if (this.props.listOptions.master.srvUri != undefined) {
                if (this.props.listOptions.master.tableName != undefined || this.props.listOptions.master.key != undefined ||
                    this.props.listOptions.master.value != undefined || this.props.listOptions.master.where != undefined)
                    throw new Error("listOptions for Master List[" + this.props.id + "]" + " should have either 'master:{srvUri}' or 'master:{tableName/key/value/where}' defined");
            } else {
                if (this.props.listOptions.master.tableName == undefined || this.props.listOptions.master.key == undefined ||
                    this.props.listOptions.master.value == undefined || this.props.listOptions.master.where == undefined)
                    throw new Error("listOptions for Master List[" + this.props.id + "]" + " should have 'master:{tableName/key/value/where}' defined");

                if (this.props.listOptions.master.where === "" || this.props.listOptions.master.where == null)
                    this.props.listOptions.master.where = "null";
            }
            //debugger;
            //if dataSource is not specified, then we assume it would be loaded from database (master data)
            var ds = new masterDropdownDataSource();
            
            //'dataLoaded' custom event, triggered, with number of record bound to the control
            if(this.props.listOptions.dataLoaded != undefined)
                this.kList.dataSource.bind("dataLoaded", this.props.listOptions.dataLoaded);

            ds.setInput(this.props.listOptions);
            this.props.listOptions.dataSource = ds.kendoDataSource;
        }
        

        if(this.props.listType =="dropdownlist"){
            $("#eqMasterList_" + this.props.id).kendoDropDownList(this.props.listOptions);
            this.kList = $("#eqMasterList_" + this.props.id).data('kendoDropDownList');
        }
        if(this.props.listType =="combobox"){
            $("#eqMasterList_" + this.props.id).kendoComboBox(this.props.listOptions);
            this.kList = $("#eqMasterList_" + this.props.id).data('kendoComboBox');
        }
        if(this.props.listType =="multiselect"){
            $("#eqMasterList_" + this.props.id).kendoMultiSelect(this.props.listOptions);            
            this.kList = $("#eqMasterList_" + this.props.id).data('kendoMultiSelect');            
        }
        this.kList.SeiMasterList = this;
        
        //attaching event handlers
        //{ this.attachEventHandlers() };
    }

    componentWillUnmount() {

        //destroy the kendo control
        if(this.props.listType =="dropdownlist")
            $("#eqMasterList_" + this.props.id).data('kendoDropDownList').destroy();
        if(this.props.listType =="combobox")
            $("#eqMasterList_" + this.props.id).data('kendoComboBox').destroy();
        if(this.props.listType =="multiselect")
            $("#eqMasterList_" + this.props.id).data('kendoMultiSelect').destroy();
    }
};


SeiMasterList.propTypes = {
    listOptions: PropTypes.object,
}

/**
 * @private - defaultProps for the component.
 * @return void.
 */
SeiMasterList.defaultProps = {
    listType : "dropdownlist"
};

export default SeiMasterList;
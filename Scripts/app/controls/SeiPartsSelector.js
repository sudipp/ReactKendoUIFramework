import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import kendo from '@progress/kendo-ui';
import './kendo.common.js';
import AppConfig from 'AppConfig';
import AppStartupAPI from './../services/AppStartupAPI';
import SeiMasterList from './SeiMasterList';
import Seigrid from './Seigrid';
import MySeigridSearch from './../modules/Module1/MySeigridSearch';

class SeiPartsSelector extends React.Component {
    
    constructor(props) {
        super(props);
        
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
    
    PartsSelectorService = {
        transport: {            
            //read: AppStartupAPI.CreateTransport("http://localhost:1337/api/parts", "get"),
            read: AppStartupAPI.CreateTransport(AppConfig.PartsServiceBaseUrl + "/api/parts", "get"),
            update: {
                url: "https://demos.telerik.com/kendo-ui/service/Products/Update",
                dataType: "jsonp"
            },
            destroy: {
                url: "https://demos.telerik.com/kendo-ui/service/Products/Destroy",
                dataType: "jsonp"
            },
            /*create: {
                url: "https://demos.telerik.com/kendo-ui/service/Products/Create",
                dataType: "jsonp"
            },*/
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return {
                        models: kendo.stringify(options.models)
                    };
                }
            }
        },
        batch: true,
        //pageSize: 20,
        schema: {
            data: function (data) {
                var dbdata = data.map(dataItem => Object.assign({
                    IsSelectable: true
                }, dataItem));                
                return dbdata;
            },
            total: function (data) {
                return data.length;
            },
            model: {
                id: "partid",
                /*fields: {
                    ProductID: {
                        editable: false,
                        nullable: true
                    },
                    ProductName: {
                        validation: {
                            required: true
                        }
                    },
                    UnitPrice: {
                        type: "number",
                        validation: {
                            required: true,
                            min: 1
                        }
                    },
                    Discontinued: {
                        type: "boolean"
                    },
                    UnitsInStock: {
                        type: "number",
                        validation: {
                            min: 0,
                            required: true
                        }
                    }
                }*/
            }
        }
    }    

    gridOptions = {

        dataSource: this.PartsSelectorService,
        //persistSelection: true,
        //navigatable: true,
        pageable: false,
        filterable: false,
        sortable: true,
        resizable: true,
        edit: function (e) {            
        },

        change: function (e) {
        },
        dataBound: function(e) {
            //AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse("dataBound event triggered - " , { type: "BusinessException", isNavigatable: false })), "info");
        },
        init: function (e) {
            //debugger;  
        },
        allRowsSelected: function (e) {            
            //AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse("All Record selected event triggered - " + e.selected, { type: "BusinessException", isNavigatable: false })), "info");
        },
        RowSelected: function (e) {
            if (e.selected) {
                this.Seigrid.kGrid.EditSelectedRows();
            } else {
                this.Seigrid.kGrid.CancelEdit();
            }            
            //AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse("RowSelected event triggered - " + e.selected, { type: "BusinessException", isNavigatable: false })), "info");
        },
        height: 200,
        //toolbar: ["create", "save", "cancel"],
        selectableColumn: {
            show: true,
            singleMode: true,
            checked: true,
            width: 35
        },
        columns: [
            {
                field: "PartNumber",
                width: 120
            },
            {
                field: "Description",
                title: "Description",
                format: "{0:c}",
                width: 320
            },
            {
                field: "SS",
                title: "SS",
                width: 75
            }, 
            {
                field: "IB",
                title: "IB",
                width: 75
            }, 
            {
                field: "N",
                title: "N",
                width: 75
            }, 
            {
                field: "G",
                title: "G",
                width: 75
            },
            {
                /*command: "destroy",
                title: "&nbsp;",
                width: 150,*/
                
                width: 80,
                attributes: { "class": "text-center" },
                template: '<div class="deleteMymt" title="Delete" style="color:red;text-alignment:center;" onClick="alert()" ></div>'
            }
        ],
        editable: false,
        excel: {
            fileName: "requestGridName.xlsx",
            filterable: true,
            allPages: true,
            exportGrdNm: "requestGridName"
        },
        id: "SeiPartsSelector_Seigrid",
    }

    crudOptions = {
        /*add: {
            templateFile: "/Views/add.html",
            windowTile: "Add : Service Request",
            successText: "Add Successful"
        },*/
        edit: {
            recordLimit: 1,
            templateFile: "/Views/SeiEditParts.html",
            recordLimitViolationText: 'Only 1 rows may be updated at a time. Deselect some rows and try again.',
            windowTile: "Edit : Edit Part",
            successText: "Edit Part Successful"
        },
        destroy: {
            recordLimit: 1,
            recordLimitViolationText: "Only 1 rows may be deleted at a time. Deselect some rows and try again.",
            successText: "Delete Successful"
        },
        width: 1400,
        height: 350,
        editMode: "form"
    }
        
    ToolbarOptions = {
        gridHeaderText: 'Selected Parts Data',
        showExport: false,
        showExportOnCRUD: true,
        showRefresh: true,
        search: {
            show: false,            
            /*panelExpanded: false,
            templateFile: "/Views/search.html",
            open: function (e) {
                AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse("Search Opened", { type: "BusinessException", isNavigatable: false })), "info");
            },
            close: function (e) {
                AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse("Search Closed", { type: "BusinessException", isNavigatable: false })), "info");
            }*/
        },
        showGridFiltersummary: false,
        showClearGridFilter: false
    }

    
    /**
     * @private components render implementation
     */
    render() {
        return ( 
            <div className="row" >
                <div className="col-md-10">
                    <Seigrid ref={instance => {this.Seigrid = instance;}} 
                        gridOptions = { this.gridOptions } 
                        toolbarOptions = { this.ToolbarOptions}
                        crudOptions = { this.crudOptions }
                        searchTemplate = { this.MySeigridSearch} ></Seigrid>
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
        //this.Seigrid.kGrid.refresh();
    }

    componentWillUnmount() {
    }
};


SeiPartsSelector.propTypes = {
    //mymts: PropTypes.Array,
}

/**
 * @private - defaultProps for the component.
 * @return void.
 */

SeiPartsSelector.defaultProps = {
    //mymts : [],
    id : new kendo.util.guid().getNew()
};


export default SeiPartsSelector;
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import Seigrid from './../../controls/Seigrid';
import MySeigridSearch from './MySeigridSearch';
import Module1Service from './../../services/Module1Service';

import MessageAPI from './../../services/MessageAPI';
import AppStartupAPI from './../../services/AppStartupAPI';

const ToolbarOptions = {
    gridHeaderText: 'Service Requests',
    showExport: true,
    showExportOnCRUD: true,
    search: {
        show: true,
        panelExpanded: false,
        templateFile: "/Views/search.html",
        open: function (e) {
                        
            AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse("Search Opened", { type: "BusinessException", isNavigatable: false })), "info");
            
            //debugger;
            /*var grid = scrmAppStartupService.getDirective("scrm-grid", "requestGridName").scope.eqgGrid;
            grid.CancelEdit(true);
            //hide selectable column
            grid.options.selectableColumn.show = false;
            $scope.SetGridHeight();*/
        },
        close: function (e) {
            
            AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse("Search Closed", { type: "BusinessException", isNavigatable: false })), "info");
            
            
            //debugger;
            /*
            var grid = scrmAppStartupService.getDirective("scrm-grid", "requestGridName").scope.eqgGrid;
            //show selectable column
            grid.options.selectableColumn.show = true;
            $scope.SetGridHeight();*/
        }
    },
    showGridFiltersummary: false,
    showClearGridFilter: true
};

const crudOptions = {
    add: {
        templateFile: "/Views/add.html",
        windowTile: "Add : Service Request",
        successText: "Add Successful"
    },
    edit: {
        recordLimit: 1,
        templateFile: "/Views/edit.html",
        recordLimitViolationText: 'Only 1 rows may be updated at a time. Deselect some rows and try again.',
        windowTile: "Edit : Service Request",
        successText: "Edit Successful"
    },
    destroy: {
        recordLimit: 1,
        recordLimitViolationText: "Only 1 rows may be deleted at a time. Deselect some rows and try again.",
        successText: "Delete Successful"
    },
    width: 1400,
    height: 350,
    editMode: "form"
};

const gridOptions = {

    dataSource: Module1Service,
    //persistSelection: true,
    //navigatable: true,
    pageable: true,
    filterable: true,
    sortable: true,
    resizable: true,
    edit: function (e) {
        var numeric = $(e.container).find('[data-role="numerictextbox"]').data('kendoNumericTextBox')
        if (numeric !== undefined) {
            numeric.bind("spin", function (e) {
                console.log("spin event handler");
            });
        }
    },

    change: function (e) {
        /*var grid = e.sender;
        var items = grid.items();
        items.each(function (idx, row) {
            var idValue = grid.dataItem(row).get(idField);
            if (row.className.indexOf("k-state-selected") >= 0) {
                selectedOrders[idValue] = true;
            } else if (selectedOrders[idValue]) {
                delete selectedOrders[idValue];
            }
        });*/
    },
    dataBound: function(e) {
        AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse("dataBound event triggered - " , { type: "BusinessException", isNavigatable: false })), "info");
    },
    init: function (e) {
        //debugger;  
    },
    allRowsSelected: function (e) {
        AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse("All Record selected event triggered - " + e.selected, { type: "BusinessException", isNavigatable: false })), "info");
    },
    RowSelected: function (e) {
        if (e.selected) {
            this.Seigrid.kGrid.EditSelectedRows();
        } else {
            this.Seigrid.kGrid.CancelEdit();
        }
        AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse("RowSelected event triggered - " + e.selected, { type: "BusinessException", isNavigatable: false })), "info");
    },
    height: 550,
    //toolbar: ["create", "save", "cancel"],
    selectableColumn: {
        show: true,
        singleMode: true,
        checked: true,
        width: 35
    },
    columns: [

        /*{
            width: 50,

            //headerTemplate: "<input type='checkbox' id='header-chb' class='k-checkbox header-checkbox'><label class='k-checkbox-label' for='header-chb'></label>", 

            //headerTemplate: "<span id='masterLabelSelectAllCheckBox_eqg_' style='text-align:center;margin-left:8px!important;'>All</span><br/><input type='checkbox' id='header-chb' style='margin-left:8px;'/>",


            headerTemplate: "#if (gridOptions.selectableColumn.singleMode) {# ww #} else {#<span id='masterLabelSelectAllCheckBox_eqg_" + "' style='text-align:center;margin-left:8px!important;'>All</span><br/><input type='checkbox' id='masterSelectAllCheckBox_eqg_" + "' style='margin-left:8px;'/>#}#",

            template: "# if(data.IsSelectable == 1){ # <input type='checkbox' class='rowSelectCheckbox' /> #} # ",
            //width: (gridOptions.selectableColumn.width == undefined) ? 35 : gridOptions.selectableColumn.width,
            resizable: false,
            headerAttributes: { "class": "disable-reorder" },
            lockable: false,
            locked: true,
            filterable: false,
            sortable: false,


        },*/
        {
            field: "ProductName",
            width: 320
        },
        {
            field: "UnitPrice",
            title: "Unit Price",
            format: "{0:c}",
            width: 150
        },
        {
            field: "UnitsInStock",
            title: "Units In Stock",
            width: 150
        },
        {
            field: "Discontinued",
            width: 150
        },
        {
            command: "destroy",
            title: "&nbsp;",
            width: 150
        }
    ],
    /*editable: {
        mode: "popup"
    },*/
    editable: false,

    excel: {
        fileName: "requestGridName.xlsx",
        filterable: true,
        allPages: true,
        exportGrdNm: "requestGridName"
    },

    id: "requestGridName",

    /*toolbarOptions: {
        gridHeaderText: 'Service Requests',
        showExport: true,
        search: {
            show: true,
            panelExpanded: false,
            templateFile: "/Views/Request/search.html",
            open: function(e) {
                var grid = scrmAppStartupService.getDirective("scrm-grid", "requestGridName").scope.eqgGrid;
                grid.CancelEdit(true);
                //hide selectable column
                grid.options.selectableColumn.show = false;
            },
            close: function(e) {
                var grid = scrmAppStartupService.getDirective("scrm-grid", "requestGridName").scope.eqgGrid;
                //show selectable column
                grid.options.selectableColumn.show = true;
                $scope.SetGridHeight();
            }
        },
        showGridFiltersummary: false
    }*/
}

class SamplePage1 extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddNew = this.handleAddNew.bind(this);
        this.handleCancelChanges = this.handleCancelChanges.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(e) {
        this.Seigrid.kGrid.DeleteSelectedRows();
        AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(AppStartupAPI.buildJsonResponse(MessageAPI.messages.info.I031 , { type: "BusinessException", isNavigatable: false })), "info");            
    }

    handleAddNew() {
        this.Seigrid.kGrid.AddRow();
    }
    handleCancelChanges = (e) => {
        this.Seigrid.kGrid.CancelEdit();
    }

    render() {
        return ( < div className="row" >
                <div className="col-md-12">
                    <button className = "k-button"
                    id = "btnAdd"
                    title = "Add New"
                    onClick = { this.handleAddNew} > Add New < /button>

                    <button className = "k-button"
                    id = "btnAdd"
                    title = "cancel Changes"
                    onClick = { this.handleCancelChanges} > cancel Changes < /button>

                    <button className = "k-button"
                    id = "btnAdd"
                    title = "Delete"
                    onClick = { this.handleDelete} > Delete < /button>

                    <Seigrid ref={instance => {this.Seigrid = instance;}} 
                        gridOptions = { gridOptions } 
                        toolbarOptions = {ToolbarOptions}
                        crudOptions = { crudOptions }
                        searchTemplate = { MySeigridSearch} ></Seigrid>
                </div>
            </div>
        );
    }

    componentDidMount(e) {
    }

    componentWillUnmount() {
    }
};

export default SamplePage1
//ReactDOM.render( < SamplePage1 / > , document.querySelector('my-app'));

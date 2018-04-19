import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

//import Seigrid;
//import '@progress/Seigrid.js';
//import { Seigrid } from '@progress/Seigrid.js';
//var Seigrid = require ('@progress/Seigrid');
//import {Seigrid} from 'sei-components/grid/test';

//var Seigrid = require ('sei-components/grid/test');
import Seigrid from './controls/Seigrid';
import MySeigridSearch from './modules/Module1/MySeigridSearch';
import Module1Service from './services/Module1Service';
import SamplePage1 from './modules/Module1/SamplePage1';
import SamplePage2 from './modules/Module2/SamplePage2';
import HomePage from './modules/home/HomePage';



import AppConfig from 'AppConfig';
//import conf from "./../../config/web.config";

import { BrowserRouter } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'

import {Menu} from './Menu';
import {Header} from './Header';

const ToolbarOptions = {
    gridHeaderText: 'Service Requests',
    showExport: true,
    showExportOnCRUD: true,
    search: {
        show: true,
        panelExpanded: false,
        templateFile: "/Views/search.html",
        open: function (e) {
            debugger;
            /*var grid = scrmAppStartupService.getDirective("scrm-grid", "requestGridName").scope.eqgGrid;
            grid.CancelEdit(true);
            //hide selectable column
            grid.options.selectableColumn.show = false;
            $scope.SetGridHeight();*/
        },
        close: function (e) {
            debugger;
            /*
            var grid = scrmAppStartupService.getDirective("scrm-grid", "requestGridName").scope.eqgGrid;
            //show selectable column
            grid.options.selectableColumn.show = true;
            $scope.SetGridHeight();*/
        }
    },
    showGridFiltersummary: false,
    showClearGridFilter:true
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
    /*dataBound: function(e) {
        /*var grid = e.sender;
        var items = grid.items();
        var itemsToSelect = [];
        items.each(function (idx, row) {
          var dataItem = grid.dataItem(row);
          if (selectedOrders[dataItem[idField]]) {
            itemsToSelect.push(row);
          }
        });
        e.sender.select(itemsToSelect);

        var grid = e.sender;
        var thatScope = grid.$angular_scope;
        if (thatScope.TempSelectedRowPKIds.length() == 0) {

            var isSelectAllChecked = grid.wrapper.find("#masterSelectAllCheckBox_" + grid.wrapper.context.id).is(':checked');

            var view = this.dataSource.view();
            for (var i = 0; i < view.length; i++) {
                if (view[i].IsSelectable) {
                    if (thatScope.selectedRowPKIds.get(view[i].id) || view[i].ishighlighted ||
                        (this.dataSource.options.serverPaging && isSelectAllChecked && thatScope.TempDeSelectedRowPKIds.get(view[i].id) == undefined))

                        this.selectRow(view[i], true);
                }
            }
        }

    },*/
    init: function (e) {
        //debugger;  
    },
    allRowsSelected: function (e) {
        debugger;
    },
    RowSelected: function (e) {        
        if(e.selected){
            this.Seigrid.kGrid.EditSelectedRows();
        }else{
            this.Seigrid.kGrid.CancelEdit();
        }
        
    },
    height: 550,
    //toolbar: ["create", "save", "cancel"],
    selectableColumn: {
        show: true,
        singleMode: false,
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

class Sampleapp extends React.Component {
    constructor(props) {
        //debugger;       

        super(props);
        
        
        
        this.state = {text: '', inputText: '', mode:'view'};
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        
        this.handleAddNew = this.handleAddNew.bind(this);
        
        this.handleCancelChanges = this.handleCancelChanges.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    
    handleDelete(e) {
        this.Seigrid.kGrid.DeleteSelectedRows();
    }
    
    handleChange(e) {
        this.setState({ inputText: e.target.value });
      }

      handleSave() {
        this.setState({text: this.state.inputText, mode: 'view'});
      }

      handleEdit() {
        this.setState({mode: 'edit'});
      }
    
    handleAddNew() {
        
        this.Seigrid.kGrid.AddRow();
        //this.Seigrid
        //get reference of the SeiGrid    
    }
    handleCancelChanges  = (e) => {
        this.Seigrid.kGrid.CancelEdit();
    }
    
    renderInputField() {
    if(this.state.mode === 'view') {
      return <div></div>;
    } else {
      return (
          <p>
            <input
              onChange={this.handleChange}
              value={this.state.inputText}
            />
          </p>
      );
    }
  }
  
  renderButton() {
    if(this.state.mode === 'view') {
      return (
          <button onClick={this.handleEdit}>
            Edit
          </button>
      );
    } else {
      return (
          <button onClick={this.handleSave}>
            Save
          </button>
      );
    }
  }

/*render () {
    return (
        <Cart />
        /*
      <div>
        <p>Text: {this.state.text}</p>
        {this.renderInputField()}
        {this.renderButton()}
      </div>
    );
  }*/
    
  
    render() {
        //debugger;
        return ( 
            < div >
            
                <button class = "k-button"
                id = "btnAdd"
                title = "Add New"
                onClick = { this.handleAddNew} > Add New < /button>
                
                <button class = "k-button"
                id = "btnAdd"
                title = "cancel Changes"
                onClick = { this.handleCancelChanges} > cancel Changes < /button>
            
                <button class = "k-button"
                id = "btnAdd"
                title = "Delete"
                onClick = { this.handleDelete} > Delete < /button>
            
                <Seigrid ref={instance => {this.Seigrid = instance;}} 
                    gridOptions = { gridOptions } 
                    toolbarOptions = {ToolbarOptions}
                    crudOptions = { crudOptions }
                    searchTemplate = { MySeigridSearch} ></Seigrid>
            
                
            </div>
        );
    }

    componentDidMount(e) {
        //debugger;
        //var grid = $("[data-role='grid']").data("kendoGrid");        
    }

    componentWillUnmount() {

    }
};

//ReactDOM.render( <Sampleapp /> , document.querySelector('my-app'));

const App = (props) => (    
  <div>
    <Header/>
    <hr/>
    <div className="container-fluid body-content" >
        <Switch>
          <Route exact path='/' component={HomePage}/>
          <Route path='/page1' component={SamplePage1}/>
          <Route path='/createnote' component={SamplePage2}/>
        </Switch>
    </div>
    
    
  </div>
)
export default App;
//ReactDOM.render( <App Name="sudip" /> , document.querySelector('my-app'));




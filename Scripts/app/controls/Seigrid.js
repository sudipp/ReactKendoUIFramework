import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import kendo from '@progress/kendo-ui';
import {
    Grid,
    GridColumn
} from '@progress/kendo-grid-react-wrapper';

import './kendo.grid.ext.js';
import './kendo.common.js';

//import './jszip.min.js';

import SeigridSearchTemplate from './SeigridSearchTemplate';

import AppConfig from 'AppConfig';
import MessageAPI from './../services/MessageAPI';

//import '@progress/kendo-ui/css/web/kendo.common.core.min.css';
//import '@progress/kendo-ui/css/web/kendo.default.min.css';


class Seigrid extends React.Component {
        constructor(props) {
            super(props);

            //setting default properties
            this.setDefaultConfigs();

            this.state = {
                searchShow: this.props.toolbarOptions.search.show,
                searchPanelExpanded: this.props.toolbarOptions.search.panelExpanded,
                showExport: this.props.toolbarOptions.showExport,
                showRefresh: this.props.toolbarOptions.showRefresh,
                showExportOnCRUD: this.props.toolbarOptions.showExportOnCRUD,
                showClearGridFilter: false
            }

            // This binding is necessary to make `this` work in the callback
            this.openSearchEvHandler = this.openSearchEvHandler.bind(this);
            this.refreshGridEvHandler = this.refreshGridEvHandler.bind(this);
            this.closeSearchEvHandler = this.closeSearchEvHandler.bind(this);
            this.attachEventHandlers = this.attachEventHandlers.bind(this);
            this.attachSearchPanelEventHandlers = this.attachSearchPanelEventHandlers.bind(this);
            this.addSelectAllColumn = this.addSelectAllColumn.bind(this);
            this.addRecordSelectionDisplay = this.addRecordSelectionDisplay.bind(this);
            this.addCRUDTemplates = this.addCRUDTemplates.bind(this);
            this.dataBoundEvHandler = this.dataBoundEvHandler.bind(this);
            this.selectAllRowsEvHandler = this.selectAllRowsEvHandler.bind(this);
            this.selectRowEvHandler = this.selectRowEvHandler.bind(this);
            this.clearGridFilterEvHandler = this.clearGridFilterEvHandler.bind(this);
            this.onEditPopupOpenEvHander = this.onEditPopupOpenEvHander.bind(this);
            this.onEditPopupCloseEvHander = this.onEditPopupCloseEvHander.bind(this);
        }

        
        /**
         * @private - Set default config for the component.
         * @param [in|out] type parameter_name Parameter description.
         * @param [in|out] type parameter_name Parameter description.
         * @return void.
         */
        setDefaultConfigs = () => {

            if (this.props.toolbarOptions.showClearGridFilter == null)
                this.props.toolbarOptions.showClearGridFilter = true;

            //if (this.props.gridOptions.selectableColumn == null) {
            this.props.gridOptions.selectableColumn = this.props.gridOptions.selectableColumn || {
                show: true,
                singleMode: false,
                checked: true,
                width: 35
            };
            //}
            if (this.props.gridOptions.sortable) {
                this.props.gridOptions.sortable = {
                    mode: "single",
                    allowUnsort: true
                };
            }
            
            if (this.props.gridOptions.pageable != false) {
                this.props.gridOptions.pageable = {
                    pageSize: 20,
                    input: true,
                    messages: {
                        display: "Showing {0}-{1} of {2}"
                    },
                    numeric: false,
                    info: true,
                    /*change: function (e) {
                        //defect fix - 1679 - resetting the scroll top for grid on Page change
                        scrmAppStartupService.getDirective("equote-grid", $scope.gridId).scope.eqgGrid
                            .content.scrollTop(0);
                    }*/
                };
            }
            if (this.props.toolbarOptions.showRefresh == undefined)
                this.props.toolbarOptions.showRefresh = false;

            //setting grid id, if not set
            if (this.props.gridOptions.id == null)
                this.props.gridOptions.id = new kendo.util.guid().getNew();
        }
        
        /**
         * @private - Event handler for Clear grid Filter.
         * @param [in|out] type parameter_name Parameter description.
         * @param [in|out] type parameter_name Parameter description.
         * @return Description of returned value.
         */
        clearGridFilterEvHandler = (e) => {
            var grid = this.kGrid;
            grid.dataSource.filter([]);
        }
        
        /**
         * @private - Event handler for Reload grid data.
         * @param [in|out] type parameter_name Parameter description.
         * @param [in|out] type parameter_name Parameter description.
         * @return Description of returned value.
         */
        refreshGridEvHandler= (e) => {
            var grid = this.kGrid;
            grid.dataSource.read();
        }
        
        /**
         * @private event hander for open search panel.
         * @return Description of returned value.
         */
        openSearchEvHandler = (e) => {
            var grid = this.kGrid;

            if (grid.$angular_scope.selectedRowPKIds.length() > 0) {
                if (!confirm("Upon completion of selected action and return to this screen, all currently selected items on the screen will be de-selected. To proceed, select OK"))
                    return;
            }

            //cancel any pending edit
            grid.CancelEdit();
            grid.selectDeselectRows(false, true, grid.dataSource, 0, grid.dataSource.length);

            if (this.props.gridOptions.selectableColumn.show)
                grid.hideColumn(0); //hide select column

            //this.props.toolbarOptions.search.show = false;        
            //this.setState({searchPanelExpanded: true});
            this.setControlState("searchPanelExpanded", true);

            //if ($("#gridSerachPanel_" + grid.getOptions().id).length > 0)
            //    $("#gridSerachPanel_" + grid.getOptions().id).trigger("open", e);
        }
        /**
         * @private event handler for clsing search panel.
         * @return Description of returned value.
         */
        closeSearchEvHandler = (e) => {
            var grid = this.kGrid;

            //trigger closed event
            $("#gridSerachPanel_" + grid.getOptions().id).trigger("close", e);

            //remove the above handlers
            if (this.props.toolbarOptions.search.close != undefined)
                $("#gridSerachPanel_" + grid.getOptions().id).unbind("close", this.props.toolbarOptions.search.close);
            if (this.props.toolbarOptions.search.open != undefined)
                $("#gridSerachPanel_" + grid.getOptions().id).unbind("open", this.props.toolbarOptions.search.open);

            if (this.props.gridOptions.selectableColumn.show)
                grid.showColumn(0); //show select column

            //this.props.toolbarOptions.search.show = true;        
            //this.setState({searchPanelExpanded: false}); 
            this.setControlState("searchPanelExpanded", false);
        }
        
        /*@public - to be used for close search panel from caller
         */
        closeSearch = (e) => {
            this.closeSearchEvHandler(e);
        }
        /*@private - hander for open edit popup dialog
         */
        onEditPopupOpenEvHander = (e) => {

            /*
            if (e.sender.wrapper.find('.sys-message').length == 0)  //.error_content_panel
                throw new Error("Error display panel [id:popup_errordisplay_panel] inside popup is not defined.");
        
            scope.$root.startup.settings.current_app_errordisplay_panelId = "popup_errordisplay_panel_" + scope.gridId;
            scope.$root.startup.settings.current_app_fullerrordisplay_panelId = "popup_expandederrordisplay_panel_" + scope.gridId;
            //this.$root.startup.settings.current_app_errordisplay_panelId = "popup_errordisplay_panel_" + scope.gridId;
            */
        }
        /*@private - hander for close edit popup dialog
         */
        onEditPopupCloseEvHander = (e) => {

            this.kGrid.dataSource.cancelChanges();

            this.kGrid.CancelEdit();
            /*
            scope.$root.startup.settings.current_app_errordisplay_panelId =
                scope.$root.startup.settings.app_errordisplay_panelId;

            scope.$root.startup.settings.current_app_fullerrordisplay_panelId =
                scope.$root.startup.settings.app_fullerrordisplay_panelId;

            //this.$root.startup.settings.current_app_errordisplay_panelId =
            //    this.$root.startup.settings.app_errordisplay_panelId;
            */

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
            //ensuring event handers are attached for search panels
            this.attachSearchPanelEventHandlers();
        }
        
        /**
         * @private responsible for rendering search panel
         */
        renderSearchPanel() {
            if (this.state.searchPanelExpanded === true) 
            {
                return ( < div id = { 'gridSerachPanel_' + this.props.gridOptions.id} >
                    <div role = "alert" className = "alert alert-search alert-dismissible animate-hide" >
                    <button type = "button" className = "close" aria-label = "Close" > < span aria-hidden = "true" onClick = {this.closeSearchEvHandler} > &times; </span></button >
                    <div id = {'search_panel_' + this.props.gridOptions.id} > 
                        {(this.props.searchTemplate) && < this.props.searchTemplate Seigrid = {this} /> } 
                    </div> 
                </div> 
                </div>);
            }
            else {
                return <div > < /div>;
            }
        }
        /**
         * @private responsible for rendering Icon
         */
        renderSearchIcon() {
            if (this.state.searchPanelExpanded === true || this.state.searchShow === false) {
                return <div > < /div>;
            } else {
                return ( 
                    < div >
                    <div className = "separator" > | < /div> 
                        <div title = "Search" className = "search" onClick = { this.openSearchEvHandler } >
                    < /div>
                    </div>

                );
            }
        }

        /**
         * @private responsible for rendering Icon
         */
        renderRefreshIcon() {
            if (this.state.searchPanelExpanded === true || this.state.showRefresh ==false) {
                return <div > < /div>;
            } else {
                return ( 
                    <div>
                    <div className = "separator" > | < /div> 
                        <div title = "Refresh" className = "glyphicon glyphicon-refresh" onClick = { this.refreshGridEvHandler } >
                    < /div>
                    </div>
                );
            }
        }


        /**
         * @private responsible for rendering Clear grid filter icon
         */
        renderClearGridFilterIcon() {

            var grid = this.kGrid;

            if (this.state.showClearGridFilter) //.props.toolbarOptions.showClearGridFilter) 
            {
                var el = null;
                if (this.props.toolbarOptions.showExportOnCRUD) {
                    el = < div className = "pull-right-grid separator" > | < /div>;    
                }
                return ( 
                    <div > 
                        {
                            el
                        } 
                        <div className = "pull-right-grid" >
                            <div title = "Clear all Filters" className = "k-menubar k-ResetFilter" onClick = { this.clearGridFilterEvHandler} >
                            < /div>
                        </div>
                        <div className = "separator" > | < /div> 
                    </div>
                );
            } else {
                return <div > < /div>;            
            }
        }
        /**
         * @private responsible for rendering Export to excel icon
         */
        renderExportToExcelIcon() {

            if (this.state.showExportOnCRUD && this.state.showExport) {
                return ( <div className = "pull-right-grid" >
                        <div title = "Export to Excel" className = "exportXls" onClick = {this.exportGridDataEvHander} >
                        </div>
                    </div>
                );
            } else {
                return <div > < /div>;            
            }
        }
        /**
         * @private components render implementation
         */
        render() {

            return ( 
                <div id = { "seigridContainer_" + this.props.gridOptions.id } >
                    
                    { this.renderSearchPanel()}

                    {
                        (this.props.toolbarOptions.gridHeaderText != '' || this.props.toolbarOptions.showExportOnCRUD || this.props.toolbarOptions.showGridFiltersummary || this.state.showGridSerach) &&
                        <div className = "row gridHeader" >
                            <div className = "col-md-12" >

                            <div id = {"gridLabelHolder_" + this.props.gridOptions.id} >
                                <label className = "gridLabel grid-header-label-text" > {this.props.toolbarOptions.gridHeaderText} < /label> 
                            </div>

                            { this.renderSearchIcon() }
                        
                            { this.renderRefreshIcon() }

                            < div style = {(this.props.toolbarOptions.showGridFiltersummary || !this.state.showGridSerach) ? {} : { display: 'none' }} >
                                <span id = { "eqggridtooltip_" + this.props.gridOptions.id } kendo-tooltip = "eqgGridTooltip" options = "gridtoolbarFilterDisplayOptions" className = "k-group" >
                                    <span className = "allrec-grid-tooltip" ng-bind-html = "toolbarFilterDisplayText" > </span> 
                                </span>
                            </div>
                            { this.renderExportToExcelIcon()}

                            { this.renderClearGridFilterIcon()}

                            </div>
                        </div>
                    }


                    <div id = {"seigrid_" + this.props.gridOptions.id } />

                    <div id = {'eqgeditform_' + this.props.gridOptions.id} />

                    <div id = {'popup_window_' + this.props.gridOptions.id} />  
                </div>
            );
        }

        exportGridDataEvHander = e => {

            //var grid = $(e.container).find('[data-role="grid"]').data('kendoGrid')
            var grid = $("[data-role='grid']").data("kendoGrid")
            var grdNameForExport = (grid.options.excel.exportGrdNm) ? grid.options.excel.exportGrdNm : grid.options.id;
            grid.options.excel = {
                fileName: grdNameForExport + "_" + kendo.toString(new Date(), "yyyyMMddHHmmss") + ".xlsx",
                allPages: true,
                //proxyURL: "/Home/GridExport", //defect fix - 1348
                //forceProxy: true
            };
            grid.saveAsExcel();
        }

        selectAllRowsEvHandler = ev => {
            var checked = ev.target.checked;

            var grd = this.kGrid; //$("[data-role='grid']").data("kendoGrid");
            var ds = grd.dataSource;
            var fltrdata = kendo.data.Query.process(ds.data(), {
                filter: ds.filter(),
                sort: ds.sort()
            }).data;
            grd.selectDeselectRows(checked, true, fltrdata, 0, fltrdata.length);

            var event = {
                    sender: grd,
                    selected: checked
                };
            
            grd.trigger("allRowsSelected", event);
        }

        selectRowEvHandler = (ev) => {

            var grid = ev.data.grid;


            //grid.wrapper.on("click", ".rowSelectCheckbox", function(e) {
            var checked = ev.target.checked,
                row = $(ev.target).closest("tr"),
                that = this,
                model = grid.dataItem(row),
                event = {
                    model: model,
                    row: row,
                    selected: checked
                };

            //we need to identify if the RowSelected event is cancelled by UI,
            //if it is cancelled, we dont need to select new records

            grid.$angular_scope.TempSelectedRowPKIds.set(model.id, checked);


            //trigger RowSelected event
            //grd.trigger("RowSelected", event);
            var triggerEvent = true;
            if (grid.dataSource.hasChanges()) {
                //var r = ;//"There are unsaved changes. Would like to proceed?");
                if (!confirm("There are unsaved changes. Would like to proceed?"))
                    triggerEvent = false;
            }

            if (!triggerEvent || (event._defaultPrevented != null && event.isDefaultPrevented())) { // event.isDefaultPrevented()) {
                e.preventDefault();
                grid.$angular_scope.TempSelectedRowPKIds.clear();
                return false;
            }


            //find the row again, as it might be rebuilt on dataChnages.cancel
            //get model
            model = grid.dataSource.get(grid.$angular_scope.TempSelectedRowPKIds.idArray()[0]);

            grid.$angular_scope.TempSelectedRowPKIds.clear();

            //deselect any previous selection, in case of SingleMode
            if (grid.options.selectableColumn.singleMode && checked) {
                grid.selectDeselectRows(false, true, grid.dataSource, 0, grid.dataSource.length);
            }

            if (model != undefined) {

                //2340 - for server side pagination only
                if (grid.dataSource.options.serverPaging) {
                    if (!checked)
                        grid.$angular_scope.TempDeSelectedRowPKIds.set(model.id, checked);
                    else
                        grid.$angular_scope.TempDeSelectedRowPKIds.remove(model.id);
                }
                //2340 - for server side pagination only


                grid.selectRow(model, checked);
            }

            //if (triggerEvent)
            //    grd.trigger("RowSelectedCompleted", event);

            if (triggerEvent)
                grid.trigger("RowSelected", event);

            //});

        }

        dataBoundEvHandler = (e) => {

            var grid = e.sender;
            var thatScope = grid.$angular_scope;
            var options = grid.options;

            if (thatScope.TempSelectedRowPKIds.length() == 0) {
                var isSelectAllChecked = grid.wrapper.find("#masterSelectAllCheckBox_" + options.id).is(':checked');
                var view = grid.dataSource.view();
                for (var i = 0; i < view.length; i++) {
                    if (view[i].IsSelectable) {
                        if (thatScope.selectedRowPKIds.get(view[i].id) || view[i].ishighlighted ||
                            (grid.dataSource.options.serverPaging && isSelectAllChecked && thatScope.TempDeSelectedRowPKIds.get(view[i].id) == undefined))

                            grid.selectRow(view[i], true);
                    }
                }
            }

            if (this.props.toolbarOptions.showClearGridFilter) { //updating showClearGridFilter state variable 
                var currentFilter = grid.dataSource.filter();
                this.setControlState("showClearGridFilter", (currentFilter != null && currentFilter.filters.length > 0));
            }
        }

        attachSearchPanelEventHandlers = (e) => {
            if (this.state.searchPanelExpanded === true) {
                if (this.props.toolbarOptions.search.close != undefined)
                    $("#gridSerachPanel_" + this.kGrid.getOptions().id).bind("close", this.props.toolbarOptions.search.close);

                if (this.props.toolbarOptions.search.open != undefined) {
                    $("#gridSerachPanel_" + this.kGrid.getOptions().id).bind("open", this.props.toolbarOptions.search.open);
                    //trigger it immediately, as the search is opened
                    $("#gridSerachPanel_" + this.kGrid.getOptions().id).trigger("open", e);
                }
            }
        }

        attachEventHandlers = () => {
            //var grid = this.grid.widgetInstance;

            var grid = this.kGrid;
            var options = grid.getOptions();

            grid.wrapper.on("click", "#masterSelectAllCheckBox_eqg_" + options.id, this.selectAllRowsEvHandler);
            grid.wrapper.on("click", ".rowSelectCheckbox", { grid: grid }, this.selectRowEvHandler);

            grid.bind("dataBound", this.dataBoundEvHandler);
            
            //this.getDOMNode().addEventListener("the-graph-group-move", this.moveGroup);

            if (options.allRowsSelected != undefined)
                grid.bind("allRowsSelected", options.allRowsSelected);
            if (options.RowSelected != undefined)
                grid.bind("RowSelected", options.RowSelected);

            //*******************************
            
            var beforeFilterHandler = function (event) {
                var triggerEvent = true;
                if (grid.$angular_scope.selectedRowPKIds.length() > 0) {                    
                    if (!confirm(MessageAPI.messages.wanring.W027)) {
                        triggerEvent = false;
                        event.preventDefault();
                    }
                }

                if (triggerEvent)
                    grid.trigger("BeforeFilter", event);  //trigger grids BeforeFilter event

                //Causing filter, on grid with selected rows, will clear all record selection
                if (event != undefined && !event.isDefaultPrevented()
                    && grid.$angular_scope.selectedRowPKIds.length() > 0) {
                    grid.CancelEdit(true);
                }
            };            
            //attach 'BeforeFilter' to dataSource
            grid.dataSource.unbind("BeforeFilter", beforeFilterHandler)
                .bind("BeforeFilter", beforeFilterHandler);
            
            
            var afterFilterHandler = function (event) {
                if (AppConfig.storeLdUsrGrdPreference) {
                    localStorageService.set(options.id + "-kendo-grid", widget.getUserPrefFromOptions());
                }
                grid.trigger("AfterFilter", event);  //trigger grids AfterFilter event
            };            
            //attach 'AfterFilter' to dataSource
            grid.dataSource.unbind("AfterFilter", afterFilterHandler)
                .bind("AfterFilter", afterFilterHandler);            
            
        }

        addRecordSelectionDisplay = () => {
            
            var grid = this.kGrid;
            var options = grid.getOptions();
            /////////////////////
            if (options.pageable && $("#selectedRecordCount_" + options.id).length == 0) 
            {
                grid.pager.element.append("<span id=\"selectedRecordCount_" + options.id + "\" style=\"margin-left:20px;\"></span>");
                grid.updateSelectedRecordCount();
            }            
        }

        addSelectAllColumn = () => {

            var grid = this.kGrid;
            var options = grid.getOptions();

            var newColumns = [];
            newColumns.push({
                headerTemplate: "<span id='masterLabelSelectAllCheckBox_eqg_" + options.id + "' style='text-align:center;margin-left:8px!important;'>All</span><br/><input type='checkbox' id='masterSelectAllCheckBox_eqg_" + options.id + "' style='margin-left:8px;' />",
                template: "# if(data.IsSelectable == 1){ # <input type='checkbox' class='rowSelectCheckbox' /> #} # ",
                width: (options.selectableColumn.width == undefined) ? 35 : options.selectableColumn.width,
                resizable: false,
                headerAttributes: { "class": "disable-reorder" },
                lockable: false,
                locked: true,
                filterable: false,
                sortable: false
            });

            //for single mode, reset header template
            if (options.selectableColumn.singleMode)
                newColumns[0].headerTemplate = "";

            //setting disable reorder for all locked columns
            $(options.columns).each(function (index, col) {
                if (col.locked) col.headerAttributes = {
                    "class": "disable-reorder"
                };
            });

            var isSelectAllColumnAttached = $.grep(options.columns, function (col) {
                return (col.template !== undefined) && typeof (col.template) !== 'function' && col.template.indexOf("rowSelectCheckbox") > -1;
            });

            if (isSelectAllColumnAttached.length === 0)
                options.columns = newColumns.concat(grid.options.columns);

            grid.setOptions(options);

            if (options.selectableColumn.show) {
                grid.showColumn(0);
            } else {
                grid.hideColumn(0);
            }
        }

        addCRUDTemplates = () => {

            var that = this;

            if (this.props.crudOptions) {
                if (this.props.crudOptions.add) {
                    $.get(this.props.crudOptions.add.templateFile)
                        .then(function (response) {
                            that.kGrid.$angular_scope.AddTemplate = kendo.template(response);
                        }, function (response) {
                            console.log('unable to load Template : ' + this.props.crudOptions.add.templateFile);
                            alert('unable to load Template : ' + this.props.crudOptions.add.templateFile);
                        });
                }
                if (this.props.crudOptions.edit) {
                    $.get(this.props.crudOptions.edit.templateFile)
                        .then(function (response) {
                            that.kGrid.$angular_scope.EditTemplate = kendo.template(response);
                        }, function (response) {
                            console.log('unable to load Template : ' + this.props.crudOptions.edit.templateFile);
                            alert('unable to load Template : ' + this.props.crudOptions.edit.templateFile);
                        });
                }
            }
        }

        componentDidMount(e) {

            //var grid = this.grid.widgetInstance;//.dataSource.read())
            //var grid = $("[data-role='grid']").data("kendoGrid");
            const element = ReactDOM.findDOMNode(this);

            //this.grid1 = $(element).kendoGrid(this.props.gridOptions);
            $("#seigrid_" + this.props.gridOptions.id).kendoGrid(this.props.gridOptions);
            this.kGrid = $("#seigrid_" + this.props.gridOptions.id).data('kendoGrid');


            this.kGrid.Seigrid = this;
            this.kGrid.$angular_scope.gridCrudOptions = this.props.crudOptions;
            this.kGrid.$angular_scope.gridToolbarOptions = this.props.toolbarOptions;
            this.kGrid.$angular_scope.gridOptions = this.props.gridOptions;


            $("#popup_window_" + this.props.gridOptions.id).kendoWindow({
                title: "'AJAX content'",
                width: 600,
                height: 200,
                visible: false,
                modal: true,
                resizable: false,
                open: this.onEditPopupOpenEvHander,
                close: this.onEditPopupCloseEvHander
            });
            this.kPopup = $("#popup_window_" + this.props.gridOptions.id).data("kendoWindow");

            //e.targetScope.eqgGridPopup.bind("open", this.onEditPopupOpenEvHander);
            //e.targetScope.eqgGridPopup.bind("close", this.onEditPopupCloseEvHander);

            this.kGrid.Popup = this.kPopup;
            this.kPopup.Grid = this.kGrid;

            this.kGrid.editform = $("#eqgeditform_" + this.props.gridOptions.id);


            //if(this.props.gridOptions.id)
            //    grid.wrapper.id= this.props.gridOptions.id;

            //added select all columun
            {
                this.addSelectAllColumn()
            };

            //attaching event handlers
            {
                this.attachEventHandlers()
            }; 
            {
                this.attachSearchPanelEventHandlers()
            };

            //added selected rows diaplay
            this.addRecordSelectionDisplay();

            //added crud temoplates
            this.addCRUDTemplates();

            //debugger;

            //ReactDOM.findDOMNode(this).addEventListener('nv-focus', this.handleNVFocus);
            //ReactDOM.findDOMNode(this).addEventListener('nv-enter', this.handleNVEnter);
            //ReactDOM.findDOMNode(this).addEventListener('nv-right', this.handleNVEnter);
            //this.refs.nv.addEventListener('nv-focus', this.handleNVFocus);
            //this.refs.nv.addEventListener('nv-enter', this.handleNVEnter);
            //this.refs.nv.addEventListener('nv-right', this.handleNVEnter);
        }

        componentWillUnmount() {

            //debugger;

            //destroy the grid
            $("#seigrid_" + this.props.gridOptions.id).data('kendoGrid').destroy();

            //ReactDOM.findDOMNode(this).removeEventListener('nv-focus', this.handleNVFocus);
            //ReactDOM.findDOMNode(this).removeEventListener('nv-enter', this.handleNVEnter);
            //ReactDOM.findDOMNode(this).removeEventListener('nv-right', this.handleNVRight);
            //this.refs.nv.removeEventListener('nv-focus', this.handleNVFocus);
            //this.refs.nv.removeEventListener('nv-enter', this.handleNVEnter);
            //this.refs.nv.removeEventListener('nv-right', this.handleNVEnter);
        }
    };


    Seigrid.propTypes = {
        //searchTemplate: PropTypes.object,//PropTypes.objectOf(SeigridSearchTemplate),
        gridOptions: PropTypes.object,
        toolbarOptions: PropTypes.object,
        crudOptions: PropTypes.object
    }

    //ReactDOM.render(<Seigrid gridOptions = {gridOptions } toolbarOptions = { ToolbarOptions } crudOptions = { crudOptions} />, document.querySelector('Seigrid'));
    //ReactDOM.render(<Seigrid />, document.querySelector('Seigrid'));
    //ReactDOM.render(<Seigrid />,document.getElementById('Seigrid'));
    //Seigrid.renderToDOM(document.getElementById('Seigrid'));

    /**
     * @private - defaultProps for the component.
     * @return void.
     */
    Seigrid.defaultProps = {
        gridOptions: {
            selectableColumn: {
                show: true,
                singleMode: false,
                checked: true,
                width: 35
            },
            excel: {
                fileName: "grid.xlsx",
                filterable: true,
                allPages: true,
                exportGrdNm: "grid"
            },
            columns: [
                {
                    title: "sample column"
                }
            ]
        },
        toolbarOptions: {
            gridHeaderText: 'Grid Title',
            showExport: true,
            showRefresh : true,
            showExportOnCRUD: true,
            search: {
                show: false,
                panelExpanded: false,
            },
            showGridFiltersummary: false,
            showClearGridFilter: true
        },
        crudOptions: {
            add: {
                windowTile: "Add : Service Request",
                successText: "Add Successful"
            },
            edit: {
                recordLimit: 1,
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
            editMode: "popup"
        }
};

export default Seigrid;
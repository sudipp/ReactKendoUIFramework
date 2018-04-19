
// A simple data API that will be used to get the data for our
// components. On a real website, a more robust data fetching
// solution would be more appropriate.


var $ = kendo.jQuery;
import X2JS from './../../lib/xml2json.js';
import xmlxlsTransformer from './../../lib/xmlxlstTransformer.js';
import AppConfig from 'AppConfig';
import MessageAPI from './MessageAPI';

const debug = require('debug')('sei:AppStartupAPI');

//path for all XSLTs to render the messages to be displayed on UI
var xslClientError = AppConfig.xlstUri + '/clientError.xslt';
var xslLinkedClientError = AppConfig.xlstUri + '/clientErrorWithLink.xslt';
var xslClientInfo = AppConfig.xlstUri + '/clientInfo.xslt';


const AppStartupAPI = {
    
    /**
     * @Start up scripts.
     */
    start: function () {
        //debugger;
        this.isRlImprsntd =false;
    },

    xmlxlsTransformer: new xmlxlsTransformer(),
    getLocalDateFormat: function (dt) {
        var date = kendo.toString(dt, "yyyy-MM-dd");
        return date;
    },
    dataLossWarning: function () {

        function getScop4IsViewDirty() { //for isViewDirty()
            //var executingViewScope = angular.element(document.querySelector('#eQuoteView')).scope();
            var vwScope = angular.element(document.querySelector('#eQuoteView')).scope();
            var scevTbScope = angular.element(document.querySelector('[chevron-tab]')).scope();
            if (vwScope != null && vwScope.isViewDirty !== undefined && typeof vwScope.isViewDirty === "function")
                return vwScope;
            else if (scevTbScope != null && scevTbScope.isViewDirty !== undefined && typeof scevTbScope.isViewDirty === "function")
                return scevTbScope;
            return null;
        };

        function getScop4UndoViewChanges() { //for undoViewChanges()
            var vwScope = angular.element(document.querySelector('#eQuoteView')).scope();
            var scevTbScope = angular.element(document.querySelector('[chevron-tab]')).scope();
            if (vwScope != null && vwScope.undoViewChanges !== undefined && typeof vwScope.undoViewChanges === "function")
                return vwScope;
            else if (scevTbScope != null && scevTbScope.undoViewChanges !== undefined && typeof scevTbScope.undoViewChanges === "function")
                return scevTbScope;
            return null;
        };

        this.isViewDirty = function () {
            var currentConrollerScope = getScop4IsViewDirty();
            return (currentConrollerScope != null) ? currentConrollerScope.isViewDirty() : false;
        }
        this.dirtyWarnMsg = function () {
            return MessageAPI.messages.wanring.W064;
        }

        if (this.isViewDirty()) {
            if (confirm(this.dirtyWarnMsg())) {
                var currentConrollerScope = getScop4UndoViewChanges();
                (currentConrollerScope != null) && currentConrollerScope.undoViewChanges();
                return false;

            } else
                return true;
        }
        return false;
    },
    clearMessage: function () {
        $('#' + this.settings.current_app_errordisplay_panelId).hide();
        $('#' + this.settings.app_errordisplay_panelId).hide();
        $('#' + this.settings.current_app_fullerrordisplay_panelId).hide();
        $('#' + this.settings.app_fullerrordisplay_panelId).hide();
    },
    TransformToHtmlText: function (xmlDoc, xsltfile) {
        var transformedString = this.xmlxlsTransformer.transform(xmlDoc, xsltfile);
        return transformedString;
    },

    beforeServiceCall: function (xhr, settings) {
        
        //send all headers
        xhr.setRequestHeader("hondaHeaderTypemessageId", new kendo.util.guid().getNew());
        xhr.setRequestHeader("hondaHeaderTypesiteId", AppConfig.SiteId);
        xhr.setRequestHeader("hondaHeaderTypebusinessId", AppConfig.LoggedInUserId);
        xhr.setRequestHeader("hondaHeaderTypecollectedTimestamp", kendo.toString(new Date(), "MM/dd/yyyy HH:mm:ss tt")); //moment().format('MM/DD/YYYY, hh:mm:ss a')); //'12/12/2015 12:12:09 AM'

        xhr.setRequestHeader("hondaHeaderTypeuserBackup", this.isRlImprsntd);
    },

    settings: {
        app_errordisplay_panelId: AppConfig.app_errordisplay_panelId,
        current_app_errordisplay_panelId: AppConfig.current_app_errordisplay_panelId,
        app_fullerrordisplay_panelId: AppConfig.app_fullerrordisplay_panelId,
        current_app_fullerrordisplay_panelId: AppConfig.current_app_fullerrordisplay_panelId,

        //usr Info Css name
        usrInfoCss: AppConfig.usrInfoCss,

        // Configure/customize these variables.
        showChar: AppConfig.showChar, // How many characters are shown by default
        ellipsestext: AppConfig.ellipsestext,
        moretext: AppConfig.moretext,
        moretextMultiple: AppConfig.moretextMultiple,
        lesstext: AppConfig.lesstext,
        dateFormat: AppConfig.dateFormat,
        currencyFormat: AppConfig.currencyFormat,
        gridPageSize: AppConfig.GridPageSize,
        storeLdUsrGrdPreference: AppConfig.storeLdUsrGrdPreference
    },
    onServiceRequestStart: function (jqXhr) {
        //debugger;
    },
    onServiceRequestEnd: function (jqXhr) {
        //debugger;
    },
    afterAjaxCallComplete: function (jqXHR, status) {

    },
    CreateTransport: function (apiUrl, protocolVerb) {
        debug ('CreateTransport - %s - %s', apiUrl, protocolVerb);        
        var crudOperationDef = {
            url: apiUrl,
            dataType: "json",
            type: protocolVerb,
            //async:false,
            contentType: "application/json",
            //beforeSend: this.beforeServiceCall, //adi
            complete: this.afterAjaxCallComplete,
            //error: this.afterAjaxCallError,
            //ajaxError: this.afterAjaxCallError,
            //global :true,
        };
        return crudOperationDef;
    },
    ExpandSysErrorpanel: function (expand, messageType) {
        if (messageType == "error") {
            $('#' + this.settings.current_app_fullerrordisplay_panelId)[0].className = "sys-message-expanded errorMessage";
            $('#' + this.settings.current_app_fullerrordisplay_panelId).find(".k-icon")[0].className = "k-icon k-warning";
            $('#' + this.settings.current_app_fullerrordisplay_panelId).find(".k-errormessage")[0].className = "k-errormessage errorMessage";
        } else if (messageType == "info") {
            $('#' + this.settings.current_app_fullerrordisplay_panelId)[0].className = "sys-message-expanded infoMessage";
            $('#' + this.settings.current_app_fullerrordisplay_panelId).find(".k-icon")[0].className = "k-icon k-info";
            $('#' + this.settings.current_app_fullerrordisplay_panelId).find(".k-errormessage")[0].className = "k-errormessage infoMessage";
        }
        if (expand) {
            //$('.sysinfo-pane .sys-message-expanded').slideDown(500);
            $('#' + this.settings.current_app_fullerrordisplay_panelId).show().find(".k-errormessage").slideDown(500);
            $('#' + this.settings.current_app_errordisplay_panelId).hide();
        } else {
            //$('.sysinfo-pane .sys-message-expanded').slideUp(500);    
            $('#' + this.settings.current_app_fullerrordisplay_panelId).hide();
            $('#' + this.settings.current_app_errordisplay_panelId).show();
        }
    },

    //Displays exception text in error panel (text /hyperlink)
    displaySystemMessageText: function (formattedError, messageType) {

        debug ('displaySystemMessageText -  %s - %s', formattedError, messageType);   
        
        var sysMsgExpandedPanel = $('#' + this.settings.current_app_fullerrordisplay_panelId).hide().find(".k-errormessage");
        var errorPanel = $('#' + this.settings.current_app_errordisplay_panelId).show().find(".k-errormessage");
        errorPanel.html('<div class="' + messageType + 'Message">' + formattedError + '</div>');

        if (messageType == "error") {
            $('#' + this.settings.current_app_errordisplay_panelId)[0].className = "sys-message errorMessage";
            $('#' + this.settings.current_app_fullerrordisplay_panelId).find(".k-errormessage")[0].className = "k-errormessage errorMessage";
            $('#' + this.settings.current_app_errordisplay_panelId).find(".k-icon")[0].className = "k-icon k-warning";
        } else if (messageType == "info") {
            $('#' + this.settings.current_app_errordisplay_panelId)[0].className = "sys-message infoMessage";
            $('#' + this.settings.current_app_fullerrordisplay_panelId).find(".k-errormessage")[0].className = "k-errormessage infoMessage";
            $('#' + this.settings.current_app_errordisplay_panelId).find(".k-icon")[0].className = "k-icon k-info";
        }
        //$('#' + this.settings.current_app_errordisplay_panelId).show().find(".k-errormessage").html(formattedError);
        //$(window).trigger("resize");

        //find all messages
        var errors = $(errorPanel).find(".eQuoteAppMessage");
        if (errors.length > 0) {
            //pick the 1st message
            var errorcontent = $(errors[0]).html();


            if (errorcontent.length > (this.settings.showChar + this.settings.ellipsestext.length + this.settings.moretext.length) || errors.length > 1) {

                //var sysMsgExpandedPanel = $('#' + this.settings.current_app_fullerrordisplay_panelId).find(".k-errormessage");
                sysMsgExpandedPanel.html(errorPanel.html() + '<div class="sys-message-expanded-item"><a class="toggleSysErrorpanel" href="javascript:angular.element(\'#' +
                    this.settings.current_app_fullerrordisplay_panelId + '\').scope().$root.startup.ExpandSysErrorpanel(false,' + '\'' + messageType + '\'' + ')">' + this.settings.lesstext + '</a><div>');

                var showmoretext = (errors.length > 1) ? this.settings.moretextMultiple.replace("{0}", errors.length) :
                    this.settings.moretext;

                var c = errorcontent.substr(0, this.settings.showChar);
                var html = "<div class='sys-message-expanded-item " + messageType + "Message'>" + c + this.settings.ellipsestext + '</div><div class="sys-message-expanded-item" ><a class="toggleSysErrorpanel" href="javascript:angular.element(\'#' +
                    this.settings.current_app_errordisplay_panelId + '\').scope().$root.startup.ExpandSysErrorpanel(true, ' + '\'' + messageType + '\'' + ')">' + showmoretext + '</a><div>';
                $(errorPanel).html(html);
            }
        }
    },

    buildJsonResponse: function (responseText, eventDetail) {

        //if array ?
        var isArray = Array.isArray(responseText);
        //if (isBizError) {
        if (eventDetail.type == "info" || eventDetail.type == "BusinessException" || eventDetail.type == "warning") {
            if (isArray) {
                var x = 0;
                $(responseText).each(function () {
                    if (Array.isArray(this)) // ***** if inner item is aray, then expected that 1st element is RecordId
                    {
                        if (this.length == 1)
                            responseText[x] = "{\"RecordId\":\"" + this[0] + "\"}";
                        else if (this.length == 2)
                            responseText[x] = "{\"RecordId\":\"" + this[0] + "\",\"Message\":\"" + this[1] + "\"}";
                        //else if (this.length == 3)
                        //    responseText[x] = "{\"RecordId\":\"" + this[0] + "\",\"Message\":\"" + this[1] + "\",\"FieldName\":\"" + this[2] + "\"}";
                    } else {
                        responseText[x] = "{\"Message\":\"" + this + "\"}";
                    }
                    x++;
                });
                responseText = responseText.join(",");
            } else
                responseText = "{\"Message\":\"" + responseText + "\"}";

            //for multiple messages
            responseText = "[" + responseText + "]";
        } else //technical messages
            responseText = "\"" + responseText + "\"";

        var exceptionType = eventDetail.type; //(isBizError) ? "BusinessException" : "TechnicalException";

        var jqXhr = {
            "xhr": {
                //"responseText": "{\"Message\":" + responseText + ", \"Type\": \"" + exceptionType + "\"" + ((isBizError) ? ",\"HasNavigation\":" + isBizErrorNavigatable : "") + "}"
                "responseText": "{\"Message\":" + responseText + ", \"Type\": \"" + exceptionType + "\"" + ((eventDetail.type == "BusinessException") ? ",\"HasNavigation\":" + eventDetail.isNavigatable : "") + "}"
            }
        };

        return jqXhr;
    },
    parseResponse: function (jqXhr) {

        // Create x2js instance with default config
        var x2js = new X2JS();
        var httpError;
        try {
            httpError = (jqXhr.xhr != null) ? JSON.parse(jqXhr.xhr.responseText) : JSON.parse(jqXhr.responseText);
        } catch (ex) { // somehow JSON.parse cannot parse some of jqXHR.xhr.responseText, it gets an error --> Invalid char. There is a work around to directly get an original error message from jqXHR.xhr.statusText.
            httpError = new Object();
            httpError.Type = "TechnicalException"; //"TechnicalException";
            httpError.HasNavigation = false;
            httpError.Message = (jqXhr.xhr != null) ? jqXhr.xhr.statusText : jqXhr.statusText;
        }

        var xml = null;
        var linkedError = httpError.HasNavigation; //false;
        if (httpError.Type === "BusinessException" || httpError.Type === "info" || httpError.Type === "warning") { // "BusinessException") {
            xml = this.xmlxlsTransformer.getXmlDocFromXml('<Messages>' + x2js.json2xml_str(httpError.Message) + '</Messages>');
        } else { //for technical exception
            //build the xml from SINGLE exception message
            xml = this.xmlxlsTransformer.getXmlDocFromXml('<Messages><item><Message>' + kendo.util.escapeXmlChars(httpError.Message) + '</Message></item></Messages>');
        }
        
        //linkedError = (this.settings.current_app_errordisplay_panelId == this.settings.app_errordisplay_panelId);
        var xsl = null;
        if (httpError.Type == "info")
            xsl = xslClientInfo;
        else
            xsl = (!linkedError) ? xslClientError : xslLinkedClientError;

        //$("#" + this.settings.app_errordisplay_panelId).html(this.TransformToHtmlText(xml, xsl));
        return this.TransformToHtmlText(xml, xsl);
    },
    onServiceError: function (jqXhr) {
        
        debug ('onServiceError -  %O', jqXhr);   
        
        //debugger;
        //for any reason if 404 error is thrown or responseText is empty
        if (jqXhr.xhr != null && (jqXhr.xhr.status === 404 || jqXhr.xhr.responseText == null))
            jqXhr.xhr.responseText = "{\"Message\":" + "\"" + jqXhr.xhr.statusText + "\"" + "}";
        else if (jqXhr.responseText == null)
            jqXhr.responseText = "{\"Message\":" + "\"" + jqXhr.errorThrown + "\"" + "}";
        
        this.displaySystemMessageText(this.parseResponse(jqXhr), "error");
    }
}

$.ajaxSetup({
    beforeSend: AppStartupAPI.beforeServiceCall,
});
$(document).ajaxSend(function (event, xhr, options) {
    //debugger;
    //if (xhr!=undefined)
    xhr.withCredentials = true;
    AppStartupAPI.beforeServiceCall(xhr);
});
window.onbeforeunload = function (e) {
    if (AppStartupAPI.isViewDirty != undefined && AppStartupAPI.isViewDirty()) {
        return AppStartupAPI.dirtyWarnMsg();
    }// else
    //   return;
};


export default AppStartupAPI;

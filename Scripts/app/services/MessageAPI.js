// A simple data API that will be used to get the data for our
// components. On a real website, a more robust data fetching
// solution would be more appropriate.
import AppConfig from 'AppConfig';
import AppStartupAPI from './AppStartupAPI';
//import conf from "./../../config/web.config";
var $ = kendo.jQuery;

const debug = require('debug')('sei:MessageAPI');


const MessageAPI = {
    
  ld : function() {
      
        debug("ld is called");
      
        return;
        var that = this;
        $.get({
            method: 'GET',
            url: AppConfig.ServiceBaseUrl + "/api/GetSysMessages",
        }).then(function successCallback(response) {
            debugger;
            angular.forEach(response.data, function (value) {
                if (value.type === 'info') that.messages.info[value.code]= value.text;
                if (value.type === 'error') that.messages.error[value.code] = value.text;
                if (value.type === 'warning') that.messages.wanring[value.code] = value.text;
                if (value.type === 'comment') that.messages.comment[value.code] = value.text;
            });

        }, function errorCallback(response) {
            response.responseText = JSON.stringify(response.data);
            AppStartupAPI.displaySystemMessageText(AppStartupAPI.parseResponse(response), "error");
        });
  },
  messages: {
        info: {
            "I028": "Selected data deleted successfully.",
            "I005": "Updated data saved successfully.",
            "I029": "Add successful.",
            "I030": "Update successful.",
            "I031": "Delete successful.",
        },
        error: {
            "E001": "{0} is required.",
            "E900": "File upload failed for one or more files. Possible cause includes invalid file type, mismatched file type/extension, network issue. File: {0}.",
            "E034": "Attachment file size exceeds the maximum allowed.",
            "E035": "Number of attached files exceeds the maximum allowed.",
            "E107": "Current browser is not supported by eQuote. Please switch to a supported browser with the specified version number or higher: {0}.",
        },
        wanring: {
            "W002": "The selected item(s) will be deleted from the system. Select \"OK\" to continue processing.",
            "W019": "Selected action will cause unsaved data changes to be lost. Select \"OK\" to continue processing.",
            "W027": "Applying filter to grid will deselect and remove previously selected rows from the display. Select \"OK\" to continue processing.",
            "W055": "Selected Request rule will be deleted immediately from the system. Select \"OK\" to continue or \"Cancel\" to stop.",
            "W064": "Selected action will cause unsaved data changes to be lost. Select appropriate button to leave the screen or to stay.",
        },
        comment: {}
    },
}

export default MessageAPI

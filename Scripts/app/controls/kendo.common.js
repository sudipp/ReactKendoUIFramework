import MessageAPI from './../services/MessageAPI';
import AppStartupAPI from './../services/AppStartupAPI';


kendo.data.Model.prototype.ishighlighted = false;
kendo.data.Model.prototype.highlight = function () {
    //this.set("ishighlighted", true); // this will make this record dirty, so we dont want it
    this.ishighlighted = true;
    var tr = $("tr[data-uid='" + this.uid + "']");
    tr.each(function () {
        $(this).addClass("k-state-highlighted").find("td input").attr("checked", "checked");
    });
}
kendo.data.Model.prototype.dehighlight = function () {
    //this.set("ishighlighted", false); // this will make this record dirty, so we dont want it
    this.ishighlighted = false;
    var tr = $("tr[data-uid='" + this.uid + "']");
    tr.each(function () {
        $(this).removeClass("k-state-highlighted");//.find("td input").removeAttr("checked");
    });
}
////////////////////////////////////////////

kendo.data.DataSource.prototype.options.error = function (jqXhr) {
    AppStartupAPI.onServiceError(jqXhr);
};
kendo.data.DataSource.prototype.options.requestStart = function (jqXhr) {
    AppStartupAPI.onServiceRequestStart(jqXhr);
};
kendo.data.DataSource.prototype.options.requestEnd = function (jqXhr) {
    AppStartupAPI.onServiceRequestEnd(jqXhr);
};

kendo.util.escapeXmlChars = function (str) {
    if (typeof (str) == "string")
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
    else
        return str;
};

kendo.util.guid = function () {
    this.S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    this.getNew = function () {
        return (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0, 3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();
    };
};
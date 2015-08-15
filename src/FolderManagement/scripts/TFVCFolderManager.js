//---------------------------------------------------------------------
// <copyright file="TFVCFolderManager.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
// TypeScript class that creates a TFVC folder after the user hits create.
// </summary>
//---------------------------------------------------------------------
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TFVCFolderManager = (function (_super) {
    __extends(TFVCFolderManager, _super);
    function TFVCFolderManager(actionContext) {
        var _this = this;
        _super.call(this, actionContext);
        this.dialogCallback = function (result) {
            var self = _this;
            VSS.require(["VSS/Authentication/Services"], function (service) {
                var authTokenManager = service.authTokenManager;
                authTokenManager.getToken().then(function (token) {
                    var header = authTokenManager.getAuthorizationHeader(token);
                    $.ajaxSetup({
                        headers: { 'Authorization': header }
                    });
                    var path = self.actionContext.item.path;
                    path += "/" + result.folderName;
                    var vsoContext = VSS.getWebContext();
                    var collectionUri = vsoContext.collection.uri;
                    var tfvcChangesetApiUri = collectionUri + "_apis/tfvc/changesets?api-version=2.0-preview";
                    var tfvcItemsApiUri = collectionUri + "_apis/tfvc/items?api-version=1.0-preview&recursionLevel=OneLevel&scopePath=" + path;
                    $.ajax(tfvcItemsApiUri).then(function (changesets) {
                        for (var i = 0; i < changesets.value.length; i++) {
                            var current = changesets.value[i];
                            if (current.isFolder && current.path.indexOf(path) === 0) {
                                return;
                            }
                        }
                        var data = {
                            comment: result.comment,
                            changes: [
                                {
                                    changeType: 1,
                                    item: {
                                        path: path + "/" + result.placeHolderFileName,
                                        contentMetadata: { encoding: 65001 }
                                    },
                                    newContent: {
                                        content: "Placeholder file for new folder",
                                        contentType: 0
                                    }
                                }]
                        };
                        $.ajax({
                            type: "POST",
                            url: tfvcChangesetApiUri,
                            contentType: "application/json",
                            data: JSON.stringify(data)
                        }).then(_this.refreshBrowserWindow);
                    });
                });
            });
        };
    }
    return TFVCFolderManager;
})(FolderManager);
//# sourceMappingURL=TFVCFolderManager.js.map
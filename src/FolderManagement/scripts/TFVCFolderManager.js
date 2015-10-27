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
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "scripts/FolderManager"], function (require, exports, FolderManager) {
    var TFVCFolderManager = (function (_super) {
        __extends(TFVCFolderManager, _super);
        function TFVCFolderManager(actionContext) {
            var _this = this;
            _super.call(this, actionContext);
            this.dialogCallback = function (result) {
                var self = _this;
                VSS.require(["VSS/Service", "TFS/VersionControl/TfvcRestClient", "TFS/VersionControl/Contracts"], function (Service, RestClient, Contracts) {
                    var tfvcClient = Service.getClient(RestClient.TfvcHttpClient);
                    var path = self.actionContext.item.path;
                    path += "/" + result.folderName;
                    var vsoContext = VSS.getWebContext();
                    tfvcClient.getItem(undefined, undefined, undefined, undefined, path, Contracts.VersionControlRecursionType.OneLevel, undefined).then(function (itemsMetaData) {
                        // check and see if folder already exists, if it does, just return out of here
                        for (var i = 0; i < itemsMetaData.value.length; i++) {
                            var current = itemsMetaData.value[i];
                            if (current.isFolder && current.path.indexOf(path) === 0) {
                                return;
                            }
                        }
                        // folder doesn't exist, go and create one
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
                        tfvcClient.createChangeset(data, undefined).then(function () {
                            self.refreshBrowserWindow();
                        });
                    });
                });
            };
        }
        return TFVCFolderManager;
    })(FolderManager.FolderManager);
    exports.TFVCFolderManager = TFVCFolderManager;
});
//# sourceMappingURL=TFVCFolderManager.js.map
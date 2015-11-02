//---------------------------------------------------------------------
// <copyright file="TFVCFolderManager.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
// TypeScript class that creates a TFVC folder.
// </summary>
//---------------------------------------------------------------------
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "scripts/FolderManager", "TFS/VersionControl/TfvcRestClient", "TFS/VersionControl/Contracts"], function (require, exports, FolderManager, RestClient, VCContracts) {
    var TFVCFolderManager = (function (_super) {
        __extends(TFVCFolderManager, _super);
        function TFVCFolderManager(actionContext) {
            var _this = this;
            _super.call(this, actionContext);
            this.dialogCallback = function (result) {
                var tfvcClient = RestClient.getClient();
                var path = _this.actionContext.item.path + "/" + result.folderName;
                var vsoContext = VSS.getWebContext();
                tfvcClient.getItems(undefined, path, VCContracts.VersionControlRecursionType.OneLevel, false, undefined).then(function (itemsMetaData) {
                    if (_this.checkFolderExists(tfvcClient, path, itemsMetaData))
                        return;
                    _this.createNewFolder(tfvcClient, path, result);
                });
            };
        }
        TFVCFolderManager.prototype.checkFolderExists = function (tfvcClient, path, itemsMetaData) {
            for (var i = 0; i < itemsMetaData.length; i++) {
                var current = itemsMetaData[i];
                if (current.isFolder && current.path.indexOf(path) === 0) {
                    return true;
                }
            }
            return false;
        };
        TFVCFolderManager.prototype.createNewFolder = function (tfvcClient, path, result) {
            var _this = this;
            var data = {
                comment: result.comment,
                changes: [
                    {
                        changeType: VCContracts.VersionControlChangeType.Add,
                        item: {
                            path: path + "/" + result.placeHolderFileName,
                            contentMetadata: { encoding: 65001 },
                        },
                        newContent: {
                            content: "Placeholder file for new folder",
                            contentType: VCContracts.ItemContentType.RawText
                        }
                    }]
            };
            tfvcClient.createChangeset(data).then(function () {
                _this.refreshBrowserWindow();
            });
        };
        return TFVCFolderManager;
    })(FolderManager.FolderManager);
    exports.TFVCFolderManager = TFVCFolderManager;
});

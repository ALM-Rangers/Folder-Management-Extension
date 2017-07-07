var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "VSS/Context", "./FolderManager", "TFS/VersionControl/TfvcRestClient", "TFS/VersionControl/Contracts", "q"], function (require, exports, Context, FolderManager, RestClient, VCContracts, Q) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TFVCFolderManager = (function (_super) {
        __extends(TFVCFolderManager, _super);
        function TFVCFolderManager(actionContext) {
            var _this = _super.call(this, actionContext) || this;
            _this.dialogCallback = function (result) {
                var tfvcClient = RestClient.getClient();
                var path = _this.actionContext.item.path + "/" + result.folderName;
                var data;
                if (Context.getPageContext().webAccessConfiguration.isHosted) {
                    data = _this.getDataForHostedVSTS(result, path);
                }
                else {
                    data = _this.getDataForOnPremesisTFS(result, path);
                }
                tfvcClient.createChangeset(data).then(function () {
                    //TelemetryClient.TelemetryClient.getClient().trackEvent("TFVC_Folder_Added");
                    _this.refreshBrowserWindow();
                });
            };
            return _this;
        }
        TFVCFolderManager.prototype.getDataForOnPremesisTFS = function (result, path) {
            return {
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
                    }
                ]
            };
        };
        TFVCFolderManager.prototype.getDataForHostedVSTS = function (result, path) {
            return {
                comment: result.comment,
                changes: [
                    {
                        changeType: VCContracts.VersionControlChangeType.Add,
                        item: {
                            path: path,
                            isFolder: true
                        }
                    }
                ]
            };
        };
        TFVCFolderManager.prototype.checkDuplicateFolder = function (folderName) {
            var _this = this;
            var deferred = Q.defer();
            var tfvcClient = RestClient.getClient();
            var path = this.actionContext.item.path + "/" + folderName;
            tfvcClient.getItems(undefined, path, VCContracts.VersionControlRecursionType.OneLevel, false, undefined).then(function (itemsMetaData) {
                if (_this.checkFolderExists(tfvcClient, path, itemsMetaData)) {
                    deferred.resolve(true);
                }
                else {
                    deferred.resolve(false);
                }
            });
            return deferred.promise;
        };
        TFVCFolderManager.prototype.checkFolderExists = function (tfvcClient, path, itemsMetaData) {
            for (var i = 0; i < itemsMetaData.length; i++) {
                var current = itemsMetaData[i];
                if (current.isFolder && current.path.indexOf(path) === 0) {
                    return true;
                }
            }
            return false;
        };
        return TFVCFolderManager;
    }(FolderManager.FolderManager));
    exports.TFVCFolderManager = TFVCFolderManager;
});
//# sourceMappingURL=TFVCFolderManager.js.map
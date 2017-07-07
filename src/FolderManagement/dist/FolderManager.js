define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FolderManager = (function () {
        function FolderManager(actionContext) {
            this.actionContext = actionContext;
        }
        FolderManager.prototype.refreshBrowserWindow = function () {
            VSS.getService(VSS.ServiceIds.Navigation)
                .then(function (navigationService) {
                navigationService.reload();
            });
        };
        FolderManager.prototype.showDuplicateFolderError = function (folderName) {
            //   TelemetryClient.TelemetryClient.getClient().trackEvent("Duplicate_Folder_Name_Entered");    
            $(".error-container").text("The folder " + folderName + " already exists");
        };
        FolderManager.prototype.hideDuplicateFolderError = function () {
            // TelemetryClient.TelemetryClient.getClient().trackEvent("Duplicate_Folder_Name_Resolved");
            $(".error-container").text("");
        };
        return FolderManager;
    }());
    exports.FolderManager = FolderManager;
});
//# sourceMappingURL=FolderManager.js.map
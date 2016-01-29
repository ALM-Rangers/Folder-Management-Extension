define(["require", "exports"], function (require, exports) {
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
            $(".error-container").text("The folder " + folderName + " already exists");
        };
        FolderManager.prototype.hideDuplicateFolderError = function () {
            $(".error-container").text("");
        };
        return FolderManager;
    })();
    exports.FolderManager = FolderManager;
});
//# sourceMappingURL=FolderManager.js.map
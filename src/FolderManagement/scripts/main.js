//---------------------------------------------------------------------
// <copyright file="main.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
// TypeScript class that adds the menu action and shows the dialog.
// </summary>
//---------------------------------------------------------------------
/// <reference path='ref/VSS.d.ts' />
var AddFolderMenu = (function () {
    function AddFolderMenu() {
    }
    AddFolderMenu.prototype.execute = function (actionContext) {
        this.actionContext = actionContext;
        this.showDialog();
    };
    AddFolderMenu.prototype.getSourceControlType = function () {
        var sourceControlType = "TFVC";
        if (this.actionContext.gitRepository) {
            sourceControlType = "Git";
        }
        return sourceControlType;
    };
    AddFolderMenu.prototype.showDialog = function () {
        var _this = this;
        VSS.getService("ms.vss-web.dialog-service").then(function (dialogSvc) {
            var createNewFolderDialog;
            var sourceControlType = _this.getSourceControlType();
            var extInfo = VSS.getExtensionContext();
            var dialogContributionId = extInfo.publisherId + "." + extInfo.extensionId + "." + "createNewFolderDialog";
            var callBack;
            if (sourceControlType == "Git") {
                callBack = new GitFolderManager(_this.actionContext).dialogCallback;
            }
            else {
                callBack = new TFVCFolderManager(_this.actionContext).dialogCallback;
            }
            var dialogOptions = {
                title: "Create new folder",
                draggable: true,
                modal: true,
                okText: "Create",
                cancelText: "Cancel",
                okCallback: callBack,
                getDialogResult: function () {
                    return createNewFolderDialog ? createNewFolderDialog.getFormInputs() : null;
                },
            };
            dialogSvc.openDialog(dialogContributionId, dialogOptions).then(function (dialog) {
                dialog.getContributionInstance("createNewFolderDialog").then(function (createNewFolderDialogInstance) {
                    createNewFolderDialog = createNewFolderDialogInstance;
                    createNewFolderDialog.setVersionControl(sourceControlType);
                    var path = _this.actionContext.serverItem ?
                        _this.actionContext.serverItem : _this.actionContext.path;
                    if (sourceControlType == "Git") {
                        path = _this.actionContext.repositoryName + path;
                    }
                    createNewFolderDialog.setCurrentPath(path);
                    createNewFolderDialog.onStateChanged(function (isValid) {
                        dialog.updateOkButton(isValid);
                    });
                    dialog.updateOkButton(true);
                });
            });
        });
    };
    return AddFolderMenu;
})();
VSS.register("addFolder", function (context) {
    return new AddFolderMenu();
});

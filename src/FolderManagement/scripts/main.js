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
define(["require", "exports", "scripts/GitFolderManager", "scripts/TFVCFolderManager"], function (require, exports, GitFolderManager, TFVCFolderManager) {
    (function (SourceControl) {
        SourceControl[SourceControl["Git"] = 0] = "Git";
        SourceControl[SourceControl["TFVC"] = 1] = "TFVC";
    })(exports.SourceControl || (exports.SourceControl = {}));
    var SourceControl = exports.SourceControl;
    ;
    var AddFolderMenu = (function () {
        function AddFolderMenu() {
        }
        AddFolderMenu.prototype.execute = function (actionContext) {
            this.actionContext = actionContext;
            this.showDialog();
        };
        AddFolderMenu.prototype.getSourceControlType = function () {
            if (this.actionContext.gitRepository) {
                return SourceControl.Git;
            }
            else {
                return SourceControl.TFVC;
            }
        };
        AddFolderMenu.prototype.showDialog = function () {
            var _this = this;
            VSS.getService("ms.vss-web.dialog-service").then(function (dialogSvc) {
                var createNewFolderDialog;
                var sourceControlType = _this.getSourceControlType();
                var extInfo = VSS.getExtensionContext();
                var dialogContributionId = extInfo.publisherId + "." + extInfo.extensionId + "." + "createNewFolderDialog";
                var callBack;
                if (sourceControlType == SourceControl.Git) {
                    callBack = new GitFolderManager.GitFolderManager(_this.actionContext).dialogCallback;
                }
                else {
                    callBack = new TFVCFolderManager.TFVCFolderManager(_this.actionContext).dialogCallback;
                }
                var dialogOptions = {
                    title: "Create new folder",
                    draggable: true,
                    modal: true,
                    okText: "Create",
                    cancelText: "Cancel",
                    okCallback: callBack,
                    defaultButton: "ok",
                    getDialogResult: function () {
                        return createNewFolderDialog ? createNewFolderDialog.getFormInputs() : null;
                    },
                };
                dialogSvc.openDialog(dialogContributionId, dialogOptions).then(function (dialog) {
                    dialog.getContributionInstance("createNewFolderDialog").then(function (createNewFolderDialogInstance) {
                        createNewFolderDialog = createNewFolderDialogInstance;
                        createNewFolderDialog.setVersionControl(sourceControlType);
                        var path = "";
                        if (sourceControlType == SourceControl.Git) {
                            path = _this.actionContext.gitRepository.name + _this.actionContext.item.path;
                        }
                        else {
                            path = _this.actionContext.item.path;
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
    exports.AddFolderMenu = AddFolderMenu;
    VSS.register("addFolder", function (context) {
        return new AddFolderMenu();
    });
    VSS.notifyLoadSucceeded();
});

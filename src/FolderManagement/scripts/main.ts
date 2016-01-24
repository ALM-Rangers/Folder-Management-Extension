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
import GitFolderManager = require("scripts/GitFolderManager");
import TFVCFolderManager = require("scripts/TFVCFolderManager");
import Dialog = require("scripts/dialog");

export enum SourceControl { Git, TFVC };

export class AddFolderMenu { 
    private actionContext;

    public execute(actionContext) {
        actionContext.getSourceItemContext().then((sourceContext) => {
            this.actionContext = sourceContext;
            this.showDialog();
        });
    }

    private getSourceControlType() {
        if (this.actionContext.gitRepository) {
            return SourceControl.Git;
        }
        else {
            return SourceControl.TFVC
        }
    }
    
    private showDialog() {
        VSS.getService("ms.vss-web.dialog-service").then((dialogSvc: IHostDialogService) => {
            var createNewFolderDialog: Dialog.AddFolderDialog;
            var sourceControlType = this.getSourceControlType();
            
            // contribution info
            var extInfo = VSS.getExtensionContext();
            var dialogContributionId = extInfo.publisherId + "." + extInfo.extensionId + "." + "createNewFolderDialog";

            var callBack;
            var folderManager = null;
            if (sourceControlType == SourceControl.Git) {
                folderManager = new GitFolderManager.GitFolderManager(this.actionContext);
                callBack = folderManager.dialogCallback;
            }
            else {
                folderManager = new TFVCFolderManager.TFVCFolderManager(this.actionContext);
                callBack = folderManager.dialogCallback;
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

            dialogSvc.openDialog(dialogContributionId, dialogOptions).then((dialog) => {
                dialog.getContributionInstance("createNewFolderDialog").then((createNewFolderDialogInstance: Dialog.AddFolderDialog) => {
                    createNewFolderDialog = createNewFolderDialogInstance;
                    createNewFolderDialog.setVersionControl(sourceControlType);
                    createNewFolderDialog.setFolderManager(folderManager);

                    var path = "";

                    if (sourceControlType == SourceControl.Git) {
                        path = this.actionContext.gitRepository.name + this.actionContext.item.path;
                    }
                    else {
                        path = this.actionContext.item.path;
                    }

                    createNewFolderDialog.setCurrentPath(path);
                    createNewFolderDialog.onStateChanged(function (isValid) {
                        dialog.updateOkButton(isValid);
                    });

                    createNewFolderDialog.initialValidate();
                });
            })
        })
    }
}

VSS.register("addFolder", function (context) {
    return new AddFolderMenu();
});
VSS.notifyLoadSucceeded();

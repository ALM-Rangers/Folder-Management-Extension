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

class AddFolderMenu {
    private actionContext;

    public execute(actionContext) {
        this.actionContext = actionContext;
        this.showDialog();
    }

    private getSourceControlType() {
        var sourceControlType = "TFVC";

        if (this.actionContext.gitRepository) {
            sourceControlType = "Git";
        }

        return sourceControlType;
    }


    private showDialog() {
        VSS.getService("ms.vss-web.dialog-service").then((dialogSvc: IHostDialogService) => {
            var createNewFolderDialog;
            var sourceControlType = this.getSourceControlType();

            // contribution info
            var extInfo = VSS.getExtensionContext();
            var dialogContributionId = extInfo.publisherId + "." + extInfo.extensionId + "." + "createNewFolderDialog";

            //var controlContributionInfo: IContribution = {
            //    id: "createNewFolderDialog",
            //    extensionId: VSS.getExtensionContext().id,
            //    pointId: VSS.getExtensionContext().namespace + "#dialog"
            //};

            var callBack;
            if (sourceControlType == "Git") {
                callBack = new GitFolderManager(this.actionContext).dialogCallback;
            }
            else {
                callBack = new TFVCFolderManager(this.actionContext).dialogCallback;
            }

            var dialogOptions: IHostDialogOptions = {
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

            dialogSvc.openDialog(dialogContributionId, dialogOptions).then((dialog) => {
                dialog.getContributionInstance("createNewFolderDialog").then((createNewFolderDialogInstance) => {
                    createNewFolderDialog = createNewFolderDialogInstance;
                    createNewFolderDialog.setVersionControl(sourceControlType);

                    var path = this.actionContext.serverItem ?
                        this.actionContext.serverItem : this.actionContext.path;

                    if (sourceControlType == "Git") {
                        path = this.actionContext.repositoryName + path;
                    }

                    createNewFolderDialog.setCurrentPath(path);
                    createNewFolderDialog.onStateChanged(function (isValid) {
                        dialog.updateOkButton(isValid);
                    });

                    dialog.updateOkButton(true);
                });
            })
        })
    }
}

VSS.register("addFolder", function (context) {
    return new AddFolderMenu();
});

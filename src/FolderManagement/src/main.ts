// ---------------------------------------------------------------------
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
// ---------------------------------------------------------------------
import GitFolderManager = require("./GitFolderManager");
import TFVCFolderManager = require("./TFVCFolderManager");
import Dialog = require("./dialog");
// import TelemetryClient = require("./TelemetryClient");

export enum SourceControl { Git, TFVC }

export class AddFolderMenu {
	private actionContext;
	//    public TelemetryClient = TelemetryClient.TelemetryClient.getClient();

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
		return SourceControl.TFVC;
	}

	private showDialog() {
		VSS.getService("ms.vss-web.dialog-service").then((dialogSvc: IHostDialogService) => {
			let createNewFolderDialog: Dialog.AddFolderDialog;
			const sourceControlType = this.getSourceControlType();
			const extInfo = VSS.getExtensionContext();
			const dialogContributionId = extInfo.publisherId + "." + extInfo.extensionId + "." + "createNewFolderDialog";

			let callBack;
			let folderManager = null;
			if (sourceControlType === SourceControl.Git) {
				folderManager = new GitFolderManager.GitFolderManager(this.actionContext);
				callBack = folderManager.dialogCallback;
				//                this.TelemetryClient.trackEvent("Git_Dialog_Opened");
			} else {
				folderManager = new TFVCFolderManager.TFVCFolderManager(this.actionContext);
				callBack = folderManager.dialogCallback;
				//                this.TelemetryClient.trackEvent("TFVC_Dialog_Opened");
			}

			const dialogOptions = {
				cancelText: "Cancel",
				defaultButton: "ok",
				draggable: true,
				getDialogResult() {
					return createNewFolderDialog ? createNewFolderDialog.getFormInputs() : null;
				},
				modal: true,
				okCallback: callBack,
				okText: "Create",
				title: "Create new folder",
			};

			dialogSvc.openDialog(dialogContributionId, dialogOptions).then((dialog) => {
				dialog.getContributionInstance("createNewFolderDialog").then(
					(createNewFolderDialogInstance: Dialog.AddFolderDialog) => {
						createNewFolderDialog = createNewFolderDialogInstance;
						createNewFolderDialog.setVersionControl(sourceControlType);
						createNewFolderDialog.setFolderManager(folderManager);

						let path = "";

						if (sourceControlType === SourceControl.Git) {
							path = this.actionContext.gitRepository.name + this.actionContext.item.path;
						} else {
							path = this.actionContext.item.path;
						}

						createNewFolderDialog.setCurrentPath(path);
						createNewFolderDialog.onStateChanged((isValid) => {
							dialog.updateOkButton(isValid);
						});

						createNewFolderDialog.initialValidate();
					});
			});
		});
	}
}

VSS.register("addFolder", (context) => {
	return new AddFolderMenu();
});
VSS.notifyLoadSucceeded();

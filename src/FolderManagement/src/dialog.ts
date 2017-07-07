// ---------------------------------------------------------------------
// <copyright file="dialog.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
// TypeScript class for the dialog. Handles user input and returns this to the callback.
// <summary>
// ---------------------------------------------------------------------
import Main = require("./main");
import FolderManager = require("./FolderManager");
import Context = require("VSS/Context");

export interface IFormInput {
	folderName: string;
	addPlaceHolderFile: boolean;
	placeHolderFileName: string;
	comment: string;
}

export class AddFolderDialog {
	private formChangedCallbacks = [];
	private stateChangedCallback = [];
	private versionControlType: Main.SourceControl;
	private folderManager: FolderManager.IFolderManager;

	constructor() {
		$("#folderName").on("input propertychange paste", (event: any) => {
			if (window.event && event.type === "propertychange" && event.propertyName !== "value") {
				return;
			}
			window.clearTimeout(($(this) as any).data("timeout"));
			$(this).data("timeout", setTimeout(() => {
				this.triggerCallbacks();
			}, 500));
		});
	}

	public getFormInputs() {
		return this.getFormInput();
	}
	public setFolderManager(folderManager: FolderManager.IFolderManager) {
		this.folderManager = folderManager;

	}
	public setVersionControl(type: Main.SourceControl) {
		this.versionControlType = type;

		if (type === Main.SourceControl.TFVC
			// added because TFS 2015.2 doesn't have the REST api yet for adding an empty folder. Remove in future version
			&& Context.getPageContext().webAccessConfiguration.isHosted) {
				$(".git-file").html("<br/>");
		}
	}

	public setCurrentPath(path: string) {
		$(".directory").text(path + ".");
	}

	public onFormChanged(callback) {
		this.formChangedCallbacks.push(callback);
	}
	public onStateChanged(callback) {
		this.stateChangedCallback.push(callback);
	}

	public initialValidate() {
		this.triggerCallbacks();
	}

	private getFormInput(): IFormInput {
		return {
			addPlaceHolderFile: this.versionControlType === Main.SourceControl.Git,
			comment: $("#comment").val(),
			folderName: $("#folderName").val(),
			placeHolderFileName: "_placeHolderFile.md",
		};
	}

	private triggerCallbacks() {
		const formInput = this.getFormInput();
		this.formChangedCallbacks.forEach((callback) => {
			callback(formInput);
		});

		this.validateState();
	}

	private validateState() {
		const formInput = this.getFormInput();

		let isValid = true;

		if (!formInput.folderName
			|| !formInput.folderName.trim()) {
			isValid = false;
		}

		const invalidCharactersRegEx = /[<>:"\\|?*\x00-\x1F]|^\\(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9]\\)$/i;

		if (invalidCharactersRegEx.test(formInput.folderName)) {
			$(".error-container").text("The folder name contains invalid characters");
			$(".error-container").css("visibility", "visible");
			$(".error-container").show();
			isValid = false;
		}

		if (formInput.folderName.length > 255) {
			$(".error-container").text("The folder name cannot be longer than 255 characters");
			$(".error-container").css("visibility", "visible");
			$(".error-container").show();
			isValid = false;
		}

		if (!isValid) {
			this.stateChanged(false);
		} else {
			this.folderManager.checkDuplicateFolder(formInput.folderName).then((isDuplicate) => {
				if (isDuplicate) {
					this.stateChanged(false);
					$(".error-container").text("A folder with the name " + formInput.folderName + " already exists");
					$(".error-container").css("visibility", "visible");
					$(".error-container").show();
				} else {
					this.stateChanged(true);
					$(".error-container").hide();
				}
			});
		}
	}

	private stateChanged(state) {
		this.stateChangedCallback.forEach((callback) => {
			callback(state);
		});
	}
}

VSS.register("createNewFolderDialog", (context) => {
	return new AddFolderDialog();
});

VSS.notifyLoadSucceeded();

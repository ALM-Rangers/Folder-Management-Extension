/// <reference path="../typings/main.d.ts" />
//---------------------------------------------------------------------
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
//--------------------------------------------------------------------- 
import Main = require("scripts/main");
import FolderManager = require("scripts/FolderManager")
import Context = require("VSS/Context");

export interface IFormInput {
    folderName: string;
    addPlaceHolderFile: boolean;
    placeHolderFileName: string;
    comment: string;
}

export class AddFolderDialog {

    constructor() {
        $("#folderName").on('input propertychange paste', (event: any) => {
            if (window.event && event.type == "propertychange" && event.propertyName != "value")
                return;

            window.clearTimeout((<any>$(this).data("timeout")));
            $(this).data("timeout", setTimeout(() => {
                this.triggerCallbacks();
            }, 500));
        });
    }

    private formChangedCallbacks = [];
    private stateChangedCallback = [];
    private versionControlType: Main.SourceControl;
    private folderManager: FolderManager.IFolderManager;


    private getFormInput(): IFormInput {
        return {
            folderName: $("#folderName").val(),
            addPlaceHolderFile: this.versionControlType == Main.SourceControl.Git,
            placeHolderFileName: "_placeHolderFile.md",
            comment: $("#comment").val(),
        };
    }

    private triggerCallbacks() {
        var formInput = this.getFormInput();
        this.formChangedCallbacks.forEach(function (callback) {
            callback(formInput);
        });

        this.validateState();
    }

    private validateState() {
        var formInput = this.getFormInput();

        var isValid = true;

        if (!formInput.folderName
            || !formInput.folderName.trim()) {
            isValid = false;
        }

        var invalidCharactersRegEx = /[<>:"\\|?*\x00-\x1F]|^\\(?:aux|con|clock\$|nul|prn|com[1-9]|lpt[1-9]\\)$/i;

        if (invalidCharactersRegEx.test(formInput.folderName)) {
            $(".error-container").text("The folder name contains invalid characters");
            $(".error-container").css('visibility', 'visible');
            $(".error-container").show();
            isValid = false;
        }

        if (formInput.folderName.length > 255) {
            $(".error-container").text("The folder name cannot be longer than 255 characters");
            $(".error-container").css('visibility', 'visible');
            $(".error-container").show();
            isValid = false;
        }

        if (!isValid) {
            this.stateChanged(false);
        }
        else {
            this.folderManager.checkDuplicateFolder(formInput.folderName).then((isDuplicate) => {
                if (isDuplicate) {
                    this.stateChanged(false);
                    $(".error-container").text("A folder with the name " + formInput.folderName + " already exists");
                    $(".error-container").css('visibility', 'visible');
                    $(".error-container").show();
                }
                else {
                    this.stateChanged(true);
                    $(".error-container").hide();
                }
            })
        }
    }

    private stateChanged(state) {
        this.stateChangedCallback.forEach(function (callback) {
            callback(state);
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
            && Context.getPageContext().webAccessConfiguration.isHosted) { // added because TFS 2015.2 doesn't have the REST api yet for adding an empty folder. Remove in future version
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
}

VSS.register("createNewFolderDialog", function (context) {
    return new AddFolderDialog();
});

VSS.notifyLoadSucceeded();
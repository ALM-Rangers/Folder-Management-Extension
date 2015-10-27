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

/// <reference path='ref/VSS.d.ts' />
import Main = require("scripts/main");

export interface IFormInput {
    folderName: string;
    addPlaceHolderFile: boolean;
    placeHolderFileName: string;
    comment: string;
}

export class AddFolderDialog {

    constructor() {
        $("#folderName").on('input propertychange paste', () => {
            this.triggerCallbacks();
        });
    }

    private formChangedCallbacks = [];
    private stateChangedCallback = [];
    private versionControlType: Main.SourceControl;

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
    
    private removePlaceHolderMesssage() {
        $(".git-file").html("<br/>");
    }

    private validateState() {
        var formInput = this.getFormInput();

        var isValid = true;

        if (!formInput.folderName
            || !formInput.folderName.trim()) {
            isValid = false;
        }

        if (formInput.folderName.indexOf('/') > -1) {
            isValid = false;
        }

        this.stateChangedCallback.forEach(function (callback) {
            callback(isValid);
        });
    }


    public getFormInputs() {
        return this.getFormInput();
    }
    public setVersionControl(type: Main.SourceControl) {
        this.versionControlType = type;

        if (type == Main.SourceControl.TFVC) {
            this.removePlaceHolderMesssage();
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
}

VSS.register("createNewFolderDialog", function (context) {
    return new AddFolderDialog();
});

VSS.notifyLoadSucceeded();
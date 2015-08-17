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
var AddFolderDialog = (function () {
    function AddFolderDialog() {
        var _this = this;
        this.formChangedCallbacks = [];
        this.stateChangedCallback = [];
        $("#folderName").on('input propertychange paste', function () {
            _this.triggerCallbacks();
        });
    }
    AddFolderDialog.prototype.getFormInput = function () {
        return {
            folderName: $("#folderName").val(),
            addPlaceHolderFile: this.versionControlType === "Git",
            placeHolderFileName: "_placeHolderFile.md",
            comment: $("#comment").val(),
        };
    };
    AddFolderDialog.prototype.triggerCallbacks = function () {
        var formInput = this.getFormInput();
        this.formChangedCallbacks.forEach(function (callback) {
            callback(formInput);
        });
        this.validateState();
    };
    AddFolderDialog.prototype.validateState = function () {
        var formInput = this.getFormInput();
        var isValid = true;
        if (!formInput.folderName
            || !formInput.folderName.trim()) {
            isValid = false;
        }
        this.stateChangedCallback.forEach(function (callback) {
            callback(isValid);
        });
    };
    AddFolderDialog.prototype.getFormInputs = function () {
        return this.getFormInput();
    };
    AddFolderDialog.prototype.setVersionControl = function (type) {
        this.versionControlType = type;
    };
    AddFolderDialog.prototype.setCurrentPath = function (path) {
        $(".directory").text(path + ".");
    };
    AddFolderDialog.prototype.onFormChanged = function (callback) {
        this.formChangedCallbacks.push(callback);
    };
    AddFolderDialog.prototype.onStateChanged = function (callback) {
        this.stateChangedCallback.push(callback);
    };
    return AddFolderDialog;
})();
VSS.register("createNewFolderDialog", function (context) {
    return new AddFolderDialog();
});
VSS.notifyLoadSucceeded();

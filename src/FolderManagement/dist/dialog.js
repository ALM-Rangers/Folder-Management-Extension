define(["require", "exports", "./main", "VSS/Context"], function (require, exports, Main, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AddFolderDialog = (function () {
        function AddFolderDialog() {
            var _this = this;
            this.formChangedCallbacks = [];
            this.stateChangedCallback = [];
            $("#folderName").on('input propertychange paste', function (event) {
                if (window.event && event.type === "propertychange" && event.propertyName !== "value")
                    return;
                window.clearTimeout($(_this).data("timeout"));
                $(_this).data("timeout", setTimeout(function () {
                    _this.triggerCallbacks();
                }, 500));
            });
        }
        AddFolderDialog.prototype.getFormInput = function () {
            return {
                folderName: $("#folderName").val(),
                addPlaceHolderFile: this.versionControlType === Main.SourceControl.Git,
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
            var _this = this;
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
                this.folderManager.checkDuplicateFolder(formInput.folderName).then(function (isDuplicate) {
                    if (isDuplicate) {
                        _this.stateChanged(false);
                        $(".error-container").text("A folder with the name " + formInput.folderName + " already exists");
                        $(".error-container").css('visibility', 'visible');
                        $(".error-container").show();
                    }
                    else {
                        _this.stateChanged(true);
                        $(".error-container").hide();
                    }
                });
            }
        };
        AddFolderDialog.prototype.stateChanged = function (state) {
            this.stateChangedCallback.forEach(function (callback) {
                callback(state);
            });
        };
        AddFolderDialog.prototype.getFormInputs = function () {
            return this.getFormInput();
        };
        AddFolderDialog.prototype.setFolderManager = function (folderManager) {
            this.folderManager = folderManager;
        };
        AddFolderDialog.prototype.setVersionControl = function (type) {
            this.versionControlType = type;
            if (type === Main.SourceControl.TFVC
                && Context.getPageContext().webAccessConfiguration.isHosted) {
                $(".git-file").html("<br/>");
            }
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
        AddFolderDialog.prototype.initialValidate = function () {
            this.triggerCallbacks();
        };
        return AddFolderDialog;
    }());
    exports.AddFolderDialog = AddFolderDialog;
    VSS.register("createNewFolderDialog", function (context) {
        return new AddFolderDialog();
    });
    VSS.notifyLoadSucceeded();
});
//# sourceMappingURL=dialog.js.map
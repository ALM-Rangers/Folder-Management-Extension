//---------------------------------------------------------------------
// <copyright file="FolderManager.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
// Base TypeScript class for the Git and TFVC Folder Manager classes.
// </summary>
//---------------------------------------------------------------------
define(["require", "exports"], function (require, exports) {
    var FolderManager = (function () {
        function FolderManager(actionContext) {
            this.actionContext = actionContext;
        }
        FolderManager.prototype.refreshBrowserWindow = function () {
            VSS.getService(VSS.ServiceIds.Navigation)
                .then(function (navigationService) {
                navigationService.reload();
            });
        };
        return FolderManager;
    })();
    exports.FolderManager = FolderManager;
});

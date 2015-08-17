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
var FolderManager = (function () {
    function FolderManager(actionContext) {
        this.actionContext = actionContext;
    }
    FolderManager.prototype.refreshBrowserWindow = function () {
        VSS.getService("ms.vss-web.navigation-service").then(function (historyService) {
            historyService.reload();
        });
    };
    return FolderManager;
})();
//# sourceMappingURL=FolderManager.js.map
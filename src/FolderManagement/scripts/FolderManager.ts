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

export interface IFolderManager {
    dialogCallback;
}

export class FolderManager {
    protected actionContext;

    constructor(actionContext) {
        this.actionContext = actionContext;
    }

    protected refreshBrowserWindow() {
        VSS.getService<IHostNavigationService>(VSS.ServiceIds.Navigation).then((navigationService) => {
            navigationService.reload();
        });
    }

}
    
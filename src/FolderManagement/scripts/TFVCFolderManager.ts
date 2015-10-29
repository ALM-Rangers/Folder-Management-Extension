//---------------------------------------------------------------------
// <copyright file="TFVCFolderManager.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
// TypeScript class that creates a TFVC folder after the user hits create.
// </summary>
//---------------------------------------------------------------------

import Dialog = require("scripts/Dialog");
import FolderManager = require("scripts/FolderManager");
import RestClient = require("TFS/VersionControl/TfvcRestClient");
import VCContracts = require("TFS/VersionControl/Contracts");

export class TFVCFolderManager extends FolderManager.FolderManager
    implements FolderManager.IFolderManager {

    constructor(actionContext) {
        super(actionContext);
    }

    public dialogCallback: (result: Dialog.IFormInput) => void = (result) => {
        var tfvcClient = RestClient.getClient();

        var path = this.actionContext.item.path + "/" + result.folderName;
        var vsoContext = VSS.getWebContext();
        
        //tfvcClient.getItem(undefined, undefined, undefined,
        //    undefined, path, VCContracts.VersionControlRecursionType.OneLevel,
        //    undefined).then((itemsMetaData) => {
        //        // check and see if folder already exists, if it does, just return out of here
        //        for (var i = 0; i < itemsMetaData.value.length; i++) {
        //            var current = itemsMetaData.value[i];
        //            if (current.isFolder && current.path.indexOf(path) === 0) {
        //                return;
        //            }
        //        }

        var data = {
            comment: result.comment,
            changes: [
                {
                    changeType: VCContracts.VersionControlChangeType.Add,
                    item: {
                        path: path + "/" + result.placeHolderFileName,
                        contentMetadata: { encoding: 65001 },
                    },
                    newContent: {
                        content: "Placeholder file for new folder",
                        contentType: VCContracts.ItemContentType.RawText
                    }
                }]
        };

        (<any>tfvcClient).createChangeset(data, undefined).then(
            () => {
                this.refreshBrowserWindow();
            });
        //});
        //});
    }
}

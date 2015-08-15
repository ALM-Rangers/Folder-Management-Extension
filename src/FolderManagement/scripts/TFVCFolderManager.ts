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

class TFVCFolderManager extends FolderManager implements IFolderManager {
    constructor(actionContext) {
        super(actionContext);
    }

    public dialogCallback: (result: IFormInput) => void = (result) => {
        var self = this;

        VSS.require(["VSS/Service", "TFS/VersionControl/TfvcRestClient", "TFS/VersionControl/Contracts"], (Service, RestClient, Contracts) => {
            var tfvcClient = Service.getClient(RestClient.TfvcHttpClient);

            var path = self.actionContext.item.path;
            path += "/" + result.folderName;
            var vsoContext = VSS.getWebContext();

            tfvcClient.getItem(undefined, undefined, undefined,
                undefined, path, Contracts.VersionControlRecursionType.OneLevel,
                undefined).then(

                    function (itemsMetaData) {
                        // check and see if folder already exists, if it does, just return out of here
                        for (var i = 0; i < itemsMetaData.value.length; i++) {
                            var current = itemsMetaData.value[i];
                            if (current.isFolder && current.path.indexOf(path) === 0) {
                                return;
                            }
                        }

                        // folder doesn't exist, go and create one
                        var data = {
                            comment: result.comment,
                            changes: [
                                {
                                    changeType: 1,
                                    item: {
                                        path: path + "/" + result.placeHolderFileName,
                                        contentMetadata: { encoding: 65001 },
                                    },
                                    newContent: {
                                        content: "Placeholder file for new folder",
                                        contentType: 0
                                    }
                                }]
                        };

                        tfvcClient.createChangeset(data, undefined).then(
                            function () {
                                self.refreshBrowserWindow();
                            });
                    });
        });
    }
}
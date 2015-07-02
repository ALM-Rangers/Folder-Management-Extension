//---------------------------------------------------------------------
 // <copyright file="GitFolderManager.ts">
 //    This code is licensed under the MIT License.
 //    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
 //    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
 //    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 //    PARTICULAR PURPOSE AND NONINFRINGEMENT.
 // </copyright>
// <summary>
// TypeScript class that creates a Git folder after the user hits create.
// </summary>

 //---------------------------------------------------------------------

class GitFolderManager extends FolderManager implements IFolderManager {

    constructor(actionContext) {
        super(actionContext);
    }

    private getCommitData(branchName: string, oldCommitId: string, basePath: string, folderName: string, placeHolderFileName: string, comment: string) {
        return {
            refUpdates: [
                {
                    name: "refs/heads/" + branchName,
                    oldObjectId: oldCommitId
                }
            ],
            commits: [
                {
                    comment: comment,
                    changes: [
                        {
                            changeType: "add",
                            item: {
                                path: basePath + "/" + folderName + "/" + placeHolderFileName
                            },
                            newContent: {
                                content: "Git placeholder file",
                                contentType: "rawtext"
                            }
                        }
                    ]
                }
            ]
        }
    }

    public dialogCallback: (result: IFormInput) => void = (result) => {
        var folderName = result.folderName;
        var placeHolderFileName = result.placeHolderFileName;
        var repositoryId = this.actionContext.repositoryId;
        var branchName = this.actionContext.version.branchName;
        var basePath = this.actionContext.serverItem ? this.actionContext.serverItem : "";
        var comment = result.comment;

        VSS.require(["VSS/Authentication/Services"],(service) => {
            var authTokenManager = service.authTokenManager;
            authTokenManager.getToken().then((token) => {
                var header = authTokenManager.getAuthorizationHeader(token);

                var vsoContext = VSS.getWebContext();
                var collectionUri = vsoContext.collection.uri;
                var gitApiUri = collectionUri + "_apis/git/repositories/" + repositoryId + "/";
                var getCommitRequestUri = gitApiUri + "commits?api-version=1.0";
                var postCommitRequestUri = gitApiUri + "pushes?api-version=2.0-preview";

                var getItemsRequestUri = gitApiUri + "items?api-version=1.0&includeContentMetadata=true&recursionLevel=Full&scopePath=" + basePath;

                $.ajaxSetup({
                    headers: { 'Authorization': header }
                });

                $.ajax(getItemsRequestUri).then((result) => {
                    var folderPath = basePath ? basePath + "/" + folderName : folderName;
                    for (var i = 0; i < result.value.length; i++) {
                        var current = result.value[i];
                        if (current.isFolder && current.path.indexOf(folderPath) === 0) {
                            return;
                        }
                    }

                    $.ajax(getCommitRequestUri).then(
                        (result) => {
                            var oldCommitId = result.value[0].commitId
                            var data = this.getCommitData(branchName, oldCommitId, basePath, folderName, placeHolderFileName, comment);

                            $.ajax({
                                type: "POST",
                                url: postCommitRequestUri,
                                data: JSON.stringify(data),
                                contentType: "application/json"
                            }).then(this.refreshBrowserWindow)
                        });
                });
            });
        });
    }
}
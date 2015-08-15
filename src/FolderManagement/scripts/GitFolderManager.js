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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
//---------------------------------------------------------------------
var GitFolderManager = (function (_super) {
    __extends(GitFolderManager, _super);
    function GitFolderManager(actionContext) {
        var _this = this;
        _super.call(this, actionContext);
        this.dialogCallback = function (result) {
            var actionContext = _this.actionContext;
            var folderName = result.folderName;
            var placeHolderFileName = result.placeHolderFileName;
            var repositoryId = actionContext.gitRepository.id;
            var branchName = actionContext.version;
            var basePath = _this.actionContext.item ? _this.actionContext.item.path : "";
            var comment = result.comment;
            VSS.require(["VSS/Authentication/Services"], function (service) {
                var self = _this;
                var authTokenManager = service.authTokenManager;
                authTokenManager.getToken().then(function (token) {
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
                    $.ajax(getItemsRequestUri).then(function (result) {
                        // check and see if the folder already exists
                        var folderPath = basePath ? basePath + "/" + folderName : folderName;
                        for (var i = 0; i < result.value.length; i++) {
                            var current = result.value[i];
                            if (current.isFolder && current.path.indexOf(folderPath) === 0) {
                                return;
                            }
                        }
                        $.ajax(getCommitRequestUri).then(function (result) {
                            var oldCommitId = result.value[0].commitId;
                            var data = _this.getCommitData(branchName, oldCommitId, basePath, folderName, placeHolderFileName, comment);
                            $.ajax({
                                type: "POST",
                                url: postCommitRequestUri,
                                data: JSON.stringify(data),
                                contentType: "application/json"
                            }).then(function () {
                                self.refreshBrowserWindow();
                            }, function (x, y, z) {
                                alert("Couldn't commit new folder: " + y);
                            });
                        });
                    });
                });
            });
        };
    }
    GitFolderManager.prototype.getCommitData = function (branchName, oldCommitId, basePath, folderName, placeHolderFileName, comment) {
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
        };
    };
    return GitFolderManager;
})(FolderManager);
//# sourceMappingURL=GitFolderManager.js.map
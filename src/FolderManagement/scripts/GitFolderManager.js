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
var GitFolderManager = (function (_super) {
    __extends(GitFolderManager, _super);
    function GitFolderManager(actionContext) {
        var _this = this;
        _super.call(this, actionContext);
        this.dialogCallback = function (result) {
            var self = _this;
            var actionContext = self.actionContext;
            var folderName = result.folderName;
            var placeHolderFileName = result.placeHolderFileName;
            var repositoryId = actionContext.gitRepository.id;
            var branchName = actionContext.version;
            var basePath = self.actionContext.item ? self.actionContext.item.path : "";
            var comment = result.comment;
            VSS.require(["VSS/Service", "TFS/VersionControl/GitRestClient", "TFS/VersionControl/Contracts"], function (Service, RestClient, Contracts) {
                var gitClient = Service.getClient(RestClient.GitHttpClient);
                gitClient.getItems(repositoryId, undefined, basePath, Contracts.VersionControlRecursionType.Full, true, undefined, undefined, undefined, undefined).then(function (result) {
                    var folderPath = basePath ? basePath + "/" + folderName : folderName;
                    for (var i = 0; i < result.length; i++) {
                        var current = result[i];
                        if (current.isFolder && current.path.indexOf(folderPath) === 0) {
                            return;
                        }
                    }
                    gitClient.getCommits(repositoryId, { $top: 1 }, undefined, undefined, undefined).then(function (commits) {
                        var oldCommitId = commits[0].commitId;
                        var data = self.getCommitData(branchName, oldCommitId, basePath, folderName, placeHolderFileName, comment);
                        gitClient.createPush(data, repositoryId, undefined).then(function () {
                            self.refreshBrowserWindow();
                        }, function (x, y, z) {
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

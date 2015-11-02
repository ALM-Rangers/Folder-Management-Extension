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
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "TFS/VersionControl/Contracts", "TFS/VersionControl/GitRestClient", "scripts/FolderManager"], function (require, exports, VCContracts, RestClient, FolderManager) {
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
                var gitClient = RestClient.getClient();
                gitClient.getItems(repositoryId, undefined, basePath, VCContracts.VersionControlRecursionType.Full, true, undefined, undefined, undefined, undefined).then(function (result) {
                    var folderPath = basePath ? basePath + "/" + folderName : folderName;
                    for (var i = 0; i < result.length; i++) {
                        var current = result[i];
                        if (current.isFolder && current.path.indexOf(folderPath) === 0) {
                            return;
                        }
                    }
                    var criteria = { $top: 1, };
                    gitClient.getCommits(repositoryId, criteria, undefined, undefined, undefined).then(function (commits) {
                        var oldCommitId = commits[0].commitId;
                        var data = _this.getCommitData(branchName, oldCommitId, basePath, folderName, placeHolderFileName, comment);
                        gitClient.createPush(data, repositoryId, undefined).then(function () {
                            _this.refreshBrowserWindow();
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
    })(FolderManager.FolderManager);
    exports.GitFolderManager = GitFolderManager;
});

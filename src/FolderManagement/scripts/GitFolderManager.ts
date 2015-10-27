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

import VCContracts = require("TFS/VersionControl/Contracts");
import RestClient = require("TFS/VersionControl/GitRestClient");
import Dialog = require("scripts/Dialog");
import FolderManager = require("scripts/FolderManager");

export class GitFolderManager extends FolderManager.FolderManager implements FolderManager.IFolderManager {

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

    public dialogCallback: (result: Dialog.IFormInput) => void = (result) => {
        var actionContext = this.actionContext;

        var folderName = result.folderName;
        var placeHolderFileName = result.placeHolderFileName;
        var repositoryId = actionContext.gitRepository.id;
        var branchName = actionContext.version;
        var basePath = this.actionContext.item ? this.actionContext.item.path : "";
        var comment = result.comment;

        var gitClient = RestClient.getClient();

        gitClient.getItems(repositoryId, undefined, basePath, VCContracts.VersionControlRecursionType.Full, true, undefined, undefined, undefined, undefined).then(
            (result) => {
                // check and see if the folder already exists
                var folderPath = basePath ? basePath + "/" + folderName : folderName;
                for (var i = 0; i < result.length; i++) {
                    var current = result[i];
                    if (current.isFolder && current.path.indexOf(folderPath) === 0) {
                        return;
                    }
                }

                var criteria = <VCContracts.GitQueryCommitsCriteria>{ $top: 1, };
                
                // folder doesn't exist, create it
                gitClient.getCommits(repositoryId, criteria, undefined, undefined, undefined).then(
                    (commits) => {
                        var oldCommitId = commits[0].commitId

                        var data = this.getCommitData(branchName, oldCommitId, basePath, folderName, placeHolderFileName, comment);

                        (<any>gitClient).createPush(data, repositoryId, undefined).then(
                            () => {
                                this.refreshBrowserWindow();
                            });
                    });
            });
    }
}
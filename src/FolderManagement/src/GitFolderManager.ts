// ---------------------------------------------------------------------
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
// ---------------------------------------------------------------------

import VCContracts = require("TFS/VersionControl/Contracts");
import RestClient = require("TFS/VersionControl/GitRestClient");
import Dialog = require("./Dialog");
// import TelemetryClient = require("./TelemetryClient");
import FolderManager = require("./FolderManager");
import Q = require("q");

export class GitFolderManager extends FolderManager.FolderManager implements FolderManager.IFolderManager {

	constructor(actionContext) {
		super(actionContext);
	}

	public checkDuplicateFolder(folderName: string): IPromise<boolean> {

		const deferred = Q.defer<boolean>();
		const actionContext = this.actionContext;

		const repositoryId = actionContext.gitRepository.id;
		const branchName = actionContext.version;
		let basePath = this.actionContext.item.path;

		const gitClient = RestClient.getClient();

		const versionDescriptor: VCContracts.GitVersionDescriptor = {
			version: branchName,
			versionOptions: VCContracts.GitVersionOptions.None,
			versionType: VCContracts.GitVersionType.Branch,
		};

		gitClient.getItems(repositoryId, null, null, VCContracts.VersionControlRecursionType.Full,
			true, false, false, false, versionDescriptor)
			.then((result) => {
				if (basePath === "/") {
					basePath = "";
				}
				const folderPath = basePath + "/" + folderName;
				for (const current of result) {
					if (current.isFolder
						&& current.path.length <= folderPath.length
						&& current.path.indexOf(folderPath) === 0) {
						deferred.resolve(true);
						return;
					}
				}

				deferred.resolve(false);

			});
		return deferred.promise;
	}

	public dialogCallback: (result: Dialog.IFormInput) => void = (result) => {
		const actionContext = this.actionContext;

		const folderName = result.folderName;
		const placeHolderFileName = result.placeHolderFileName;
		const repositoryId = actionContext.gitRepository.id;
		const branchName = actionContext.version;
		const basePath = this.actionContext.item ? this.actionContext.item.path : "";
		const comment = result.comment;

		const gitClient = RestClient.getClient();

		const criteria = { $top: 1 } as VCContracts.GitQueryCommitsCriteria;

		gitClient.getRefs(repositoryId, undefined, "heads/" + branchName).then(
			(refs) => {
				const oldCommitId = refs[0].objectId;

				const data = this.getCommitData(branchName, oldCommitId, basePath, folderName, placeHolderFileName, comment);

				(gitClient as any).createPush(data, repositoryId, undefined).then(
					() => {
						// TelemetryClient.TelemetryClient.getClient().trackEvent("Git_Folder_Added");
						this.refreshBrowserWindow();
					});
			});
	}

	private getCommitData(
		branchName: string, oldCommitId: string, basePath: string,
		folderName: string, placeHolderFileName: string, comment: string) {

		return {
			commits: [
				{
					changes: [
						{
							changeType: "add",
							item: {
								path: basePath + "/" + folderName + "/" + placeHolderFileName,
							},
							newContent: {
								content: "Git placeholder file",
								contentType: "rawtext",
							},
						},
					],
					comment,
				},
			],
			refUpdates: [
				{
					name: "refs/heads/" + branchName,
					oldObjectId: oldCommitId,
				},
			],
		};
	}
}

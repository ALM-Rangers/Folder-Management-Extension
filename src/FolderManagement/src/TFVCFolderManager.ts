// ---------------------------------------------------------------------
// <copyright file="TFVCFolderManager.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
// TypeScript class that creates a TFVC folder.
// </summary>
// ---------------------------------------------------------------------
import Context = require("VSS/Context");
import Dialog = require("./Dialog");
import FolderManager = require("./FolderManager");
import RestClient = require("TFS/VersionControl/TfvcRestClient");
import VCContracts = require("TFS/VersionControl/Contracts");
import Q = require("q");
import * as tc from "telemetryclient-team-services-extension";
import telemetryClientSettings = require("./telemetryClientSettings");

export class TFVCFolderManager extends FolderManager.FolderManager
	implements FolderManager.IFolderManager {

	constructor(actionContext) {
		super(actionContext);
	}

	public dialogCallback: (result: Dialog.IFormInput) => void = (result) => {
		const tfvcClient = RestClient.getClient();

		const path = this.actionContext.item.path + "/" + result.folderName;
		let data;

		if (Context.getPageContext().webAccessConfiguration.isHosted) {
			data = this.getDataForHostedVSTS(result, path);
		} else {
			data = this.getDataForOnPremesisTFS(result, path);
		}

		(tfvcClient as any).createChangeset(data).then(
			() => {
				tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackEvent("TFVC_Folder_Added");
				this.refreshBrowserWindow();
			});
	}

	public checkDuplicateFolder(folderName: string): IPromise<boolean> {
		const deferred = Q.defer<boolean>();

		const tfvcClient = RestClient.getClient();

		const path = this.actionContext.item.path + "/" + folderName;

		tfvcClient.getItems(undefined, path, VCContracts.VersionControlRecursionType.OneLevel,
			false, undefined).then((itemsMetaData) => {
				if (this.checkFolderExists(tfvcClient, path, itemsMetaData)) {
					deferred.resolve(true);
				} else {
					deferred.resolve(false);

				}
			});

		return deferred.promise;
	}

	private getDataForOnPremesisTFS(result, path) {
		return {
			changes: [
				{
					changeType: VCContracts.VersionControlChangeType.Add,
					item: {
						contentMetadata: { encoding: 65001 },
						path: path + "/" + result.placeHolderFileName,
					},
					newContent: {
						content: "Placeholder file for new folder",
						contentType: VCContracts.ItemContentType.RawText,
					},
				}],
			comment: result.comment,
		};
	}

	private getDataForHostedVSTS(result, path) {
		return {
			changes: [
				{
					changeType: VCContracts.VersionControlChangeType.Add,
					item: {
						isFolder: true,
						path,
					},
				}],
			comment: result.comment,
		};
	}

	private checkFolderExists(
		tfvcClient: RestClient.TfvcHttpClient3,
		path: string,
		itemsMetaData: VCContracts.TfvcItem[]) {
		for (const current of itemsMetaData) {
			if (current.isFolder && current.path.indexOf(path) === 0) {
				return true;
			}
		}

		return false;
	}
}

// ---------------------------------------------------------------------
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
// ---------------------------------------------------------------------
import Q = require("q");
import * as tc from "telemetryclient-team-services-extension";
import telemetryClientSettings = require("./telemetryClientSettings");

export interface IFolderManager {
	dialogCallback;
	checkDuplicateFolder(folderName: string): IPromise<boolean>;
}

export class FolderManager {
	protected actionContext;

	constructor(actionContext) {
		this.actionContext = actionContext;
	}

	protected refreshBrowserWindow() {
		VSS.getService<IHostNavigationService>(VSS.ServiceIds.Navigation)
			.then((navigationService) => {
				navigationService.reload();
			});
	}

	protected showDuplicateFolderError(folderName: string) {
		tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackEvent("Duplicate_Folder_Name_Entered");
		$(".error-container").text("The folder " + folderName + " already exists");
	}

	protected hideDuplicateFolderError() {
		tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackEvent("Duplicate_Folder_Name_Resolved");
		$(".error-container").text("");
	}
}

import Context = require("VSS/Context");

export class TelemetryClient {

    private static telemetryClient: TelemetryClient;
    public static getClient(): TelemetryClient {
        if (!this.telemetryClient) {
            this.telemetryClient = new TelemetryClient();
            this.telemetryClient.Init();
        }
        return this.telemetryClient;
    }

    private appInsightsClient: Microsoft.ApplicationInsights.AppInsights;

    private Init() {
        try {
            var snippet: any = {
                config: {
                    instrumentationKey: "__INSTRUMENTATIONKEY__"
                }
            };
            var x = VSS.getExtensionContext();

            var init = new Microsoft.ApplicationInsights.Initialization(snippet);
            this.appInsightsClient = init.loadAppInsights();

            var webContext = VSS.getWebContext();
            this.appInsightsClient.setAuthenticatedUserContext(
                webContext.user.id, webContext.collection.id);
        }
        catch (e) {
            this.appInsightsClient = null;
            console.log(e);
        }
    }

    public startTrackPageView(name?: string) {
        try {
            if (this.appInsightsClient != null) {
                this.appInsightsClient.startTrackPage(name);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    public stopTrackPageView(name?: string) {
        try {
            if (this.appInsightsClient != null) {
                this.appInsightsClient.stopTrackPage(name);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    public trackPageView(name?: string, url?: string, properties?: Object, measurements?: Object, duration?: number) {
        try {
            if (this.appInsightsClient != null) {
                this.appInsightsClient.trackPageView("FolderManagement." + name, url, properties, measurements, duration);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    public trackEvent(name: string, properties?: Object, measurements?: Object) {
        try {
            if (this.appInsightsClient != null) {
                this.appInsightsClient.trackEvent("FolderManagement." + name, properties, measurements);
                this.appInsightsClient.flush();
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    public trackException(exception: Error, handledAt?: string, properties?: Object, measurements?: Object) {
        try {
            if (this.appInsightsClient != null) {
                this.appInsightsClient.trackException(exception, handledAt, properties, measurements);
                this.appInsightsClient.flush();
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    public trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number, properties?: Object) {
        try {
            if (this.appInsightsClient != null) {
                this.appInsightsClient.trackMetric("FolderManagement." + name, average, sampleCount, min, max, properties);
                this.appInsightsClient.flush();
            }
        }
        catch (e) {
            console.log(e);
        }
    }

}

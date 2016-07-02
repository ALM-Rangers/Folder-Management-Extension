import Context = require("VSS/Context");

export class TelemetryClient {
                              
    private static DevLabs = "34dcf687-abc9-413a-b8d2-54f85a8496ba";
    private static telemetryClient: TelemetryClient;
    private static ExtensionContext = "FolderManagement";
    private IsAvailable = false;

    public static getClient(): TelemetryClient {
        if (!this.telemetryClient) {
            this.telemetryClient = new TelemetryClient();
            this.telemetryClient.Init();
        }

        return this.telemetryClient;
    }

    private appInsightsClient: Microsoft.ApplicationInsights.AppInsights;

    private Init() {
        var snippet: any = {
            config: {
                instrumentationKey: TelemetryClient.DevLabs
            }
        };

        // AI is only supported if hosted at this stage
        this.IsAvailable = Context.getPageContext().webAccessConfiguration.isHosted;

        if (Context.getPageContext().webAccessConfiguration.isHosted) {
            var init = new Microsoft.ApplicationInsights.Initialization(snippet);
            var webContext = VSS.getWebContext();

            this.appInsightsClient = init.loadAppInsights();
            this.appInsightsClient.setAuthenticatedUserContext(webContext.user.id, webContext.collection.id);
        }
    }

    public trackPageView(name?: string, url?: string, properties?: Object, measurements?: Object, duration?: number) {
        if (this.IsAvailable) {
            this.appInsightsClient.trackPageView(TelemetryClient.ExtensionContext + "." + name, url, properties, measurements, duration);
            this.appInsightsClient.flush();
        }
    }

    public trackEvent(name: string, properties?: Object, measurements?: Object) {
        if (this.IsAvailable) {
            this.appInsightsClient.trackEvent(TelemetryClient.ExtensionContext + "." + name, properties, measurements);
            this.appInsightsClient.flush();
        }
    }

    public trackException(exceptionMessage: string, handledAt?: string, properties?: Object, measurements?: Object) {
        if (this.IsAvailable) {
            console.error(exceptionMessage);

            var error: Error = {
                name: TelemetryClient.ExtensionContext + "." + handledAt,
                message: exceptionMessage
            };

            this.appInsightsClient.trackException(error, handledAt, properties, measurements);
            this.appInsightsClient.flush();
        }
    }

    public trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number, properties?: Object) {
        if (this.IsAvailable) {
            this.appInsightsClient.trackMetric(TelemetryClient.ExtensionContext + "." + name, average, sampleCount, min, max, properties);
            this.appInsightsClient.flush();
        }
    }

}
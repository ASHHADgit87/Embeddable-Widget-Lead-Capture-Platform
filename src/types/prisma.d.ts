declare module "@prisma/client" {
  export const PrismaClient: any;
  export type WidgetType = "SIGNUP_FORM" | "CONTACT_FORM" | "CTA_POPOVER";
  export interface Widget {
    id: string;
    tenantId: string;
    type: WidgetType;
    title: string;
    description: string | null;
    buttonText: string;
    fields: any;
    displayOptions: any;
    honeypotFieldName: string;
    bundleVersion: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  export interface Submission {
    id: string;
    widgetId: string;
    tenantId: string;
    data: any;
    ipAddress: string | null;
    country: string | null;
    region: string | null;
    city: string | null;
    geoProvider: string | null;
    geoFailed: boolean;
    notifySent: boolean;
    notifyError: string | null;
    createdAt: Date;
  }
}

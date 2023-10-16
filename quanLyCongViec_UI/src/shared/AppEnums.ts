import { TenantAvailabilityState } from '@shared/service-proxies/service-proxies';


export class AppTenantAvailabilityState {
    static Available: number = TenantAvailabilityState._1;
    static InActive: number = TenantAvailabilityState._2;
    static NotFound: number = TenantAvailabilityState._3;
}

export enum CheckPermissionConst {
    PM = 1,
    DEV
}

export enum WorkReportStatus {
    WaitForAppoval = 0,
    Approved,
    Rejected
}

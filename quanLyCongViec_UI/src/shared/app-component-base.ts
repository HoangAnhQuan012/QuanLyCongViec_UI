import { Injector, ElementRef } from '@angular/core';
import { AppConsts } from '@shared/AppConsts';
import {
    LocalizationService,
    PermissionCheckerService,
    FeatureCheckerService,
    NotifyService,
    SettingService,
    MessageService,
    AbpMultiTenancyService
} from 'abp-ng2-module';

import { AppSessionService } from '@shared/session/app-session.service';
import { Table } from 'primeng/table';
import Swal from 'sweetalert2/dist/sweetalert2.js';

export abstract class AppComponentBase {

    localizationSourceName = AppConsts.localization.defaultLocalizationSourceName;

    localization: LocalizationService;
    permission: PermissionCheckerService;
    feature: FeatureCheckerService;
    notify: NotifyService;
    setting: SettingService;
    message: MessageService;
    multiTenancy: AbpMultiTenancyService;
    appSession: AppSessionService;
    elementRef: ElementRef;
    swal: Swal;

    typeFileUpload = '.doc,.docx,application/pdf, application/vnd.ms-excel,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

    confirmButtonColor = '#3085d6';
    cancelButtonColor = '#d33';
    cancelButtonText = 'Cancel';
    confirmButtonText = 'Yes';

    constructor(injector: Injector) {
        this.localization = injector.get(LocalizationService);
        this.permission = injector.get(PermissionCheckerService);
        this.feature = injector.get(FeatureCheckerService);
        this.notify = injector.get(NotifyService);
        this.setting = injector.get(SettingService);
        this.message = injector.get(MessageService);
        this.multiTenancy = injector.get(AbpMultiTenancyService);
        this.appSession = injector.get(AppSessionService);
        this.elementRef = injector.get(ElementRef);
    }

    l(key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, this.localizationSourceName);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }

    getSortField(table?: Table): string {
        return table && table.sortField ? (table.sortField + (table.sortOrder === 1 ? ' ASC' : ' DESC')) : undefined;
    }

    showCreateMessage() {
        this.notify.success('Saved Successfully!');
    }

    showUpdateMessage() {
        this.notify.warn('Updated Successfully!');
    }

    showDeleteMessage() {
        this.notify.error('Deleted Successfully!');
    }

    getLinkFile(res, fileName) {
        if (res) {
            const linkFile = res['result'][res['result'].findIndex(e => e.includes(fileName))];
            if (linkFile.includes('\\'))
            {
                return '\\' + linkFile.split('\\').slice(-2).join('\\');
            } else {
                return '/' + linkFile.split('/').slice(-2).join('/');
            }
        } else {
            return '';
        }
    }

    showExistMessage(message: string) {
        this.swal.fire(
            undefined,
            message,
            'warning'
        );
    }

    blobToFile = (theBlob: Blob, fileName: string): File => {
        const b: any = theBlob;
        // A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;

        // Cast to a File() type
        return <File>theBlob;
    }

    isGranted(permissionName: string): boolean {
        return this.permission.isGranted(permissionName);
    }
}

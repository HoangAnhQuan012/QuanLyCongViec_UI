import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { LocalizePipe } from '@shared/pipes/localize.pipe';

import { AbpPaginationControlsComponent } from './components/pagination/abp-pagination-controls.component';
import { AbpValidationSummaryComponent } from './components/validation/abp-validation.summary.component';
import { AbpModalHeaderComponent } from './components/modal/abp-modal-header.component';
import { AbpModalFooterComponent } from './components/modal/abp-modal-footer.component';
import { LayoutStoreService } from './layout/layout-store.service';

import { BusyDirective } from './directives/busy.directive';
import { EqualValidator } from './directives/equal-validator.directive';

// ngx-bootstrap
import { NgxDropzoneModule } from 'ngx-dropzone';

// primeNG
import {AccordionModule} from 'primeng/accordion';
import {ButtonModule} from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule} from 'primeng/calendar';
import {InputSwitchModule} from 'primeng/inputswitch';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CheckboxModule} from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgxPaginationModule,
        ButtonModule,
        AccordionModule,
        TableModule,
        InputTextModule,
        CalendarModule,
        InputSwitchModule,
        NgxDropzoneModule,
        AutoCompleteModule,
        CheckboxModule,
        InputNumberModule
    ],
    declarations: [
        AbpPaginationControlsComponent,
        AbpValidationSummaryComponent,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        BusyDirective,
        EqualValidator
    ],
    exports: [
        AbpPaginationControlsComponent,
        AbpValidationSummaryComponent,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        BusyDirective,
        EqualValidator,

        // ngx-bootstrap
        NgxDropzoneModule,

        // primeNG
        TableModule,
        ButtonModule,
        InputTextModule,
        CalendarModule,
        InputSwitchModule,
        AutoCompleteModule,
        CheckboxModule,
        InputNumberModule
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                AppSessionService,
                AppUrlService,
                AppAuthService,
                AppRouteGuard,
                LayoutStoreService
            ]
        };
    }
}

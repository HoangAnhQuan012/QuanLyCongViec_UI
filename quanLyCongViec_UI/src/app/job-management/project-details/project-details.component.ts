import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WorkReportComponent } from '../workReport/workReport.component';
import { AddModuleComponent } from './add-module/add-module.component';
import { AddSprintComponent } from './add-sprint/add-sprint.component';
import { AddJobComponent } from './add-job/add-job.component';
import { GetAllWorkReportForViewDto, WorkReportServiceProxy } from '@shared/service-proxies/service-proxies';
import { ConfirmationService, LazyLoadEvent, Message } from 'primeng/api';
import { Table } from 'primeng/table';
import * as models from '@shared/AppModels';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  keyword = '';
  id: number;
  records: GetAllWorkReportForViewDto[] = [];
  msgs: Message[] = [];
  routeSub: any;
  loading = false;
  totalRecords: number;
  projectStatus = models.ProjectStatus;

  constructor(
    private injector: Injector,
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    private _router: Router,
    private _workReportService: WorkReportServiceProxy,
    private confirmationService: ConfirmationService
  ) {
    super(injector);
   }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.getAllReport();
  }

  getAllReport(lazyLoad ?: LazyLoadEvent) {
    this.loading = true;
    this._workReportService.getAllWorkReport(
      this.id,
      lazyLoad ? lazyLoad.first : this.table.first,
      lazyLoad ? lazyLoad.rows : this.table.rows
    ).subscribe((result) => {
      this.records = result.items;
      this.totalRecords = result.totalCount;
      this.loading = false;
    });
  }

  viewWorkReport(workReportId ?: number, statusId ?: number) {
    this.showWorkReport(this.id, workReportId, statusId, true);
  }

  createWorkReport(workReportId?: number) {
    this.showWorkReport(this.id, workReportId);
  }

  deleteWorkReport(workReportId?: number) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this work report?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
          this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'Work report deleted'}];
          this._workReportService.deleteWorkReport(workReportId).subscribe(() => {
            this.showDeleteMessage();
            this.getAllReport();
          });
      },
      reject: () => {
          this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
    });
  }

  addModule() {
    this.showModule(this.id);
  }

  addSprint() {
    this.showSprint(this.id);
  }

  addJob() {
    this.showJob(this.id);
  }

  backLine() {
    this._router.navigate(['/app/job-management']);
  }

  private showWorkReport(projectId?: number, workReportId ?: number, statusId ?: number, isView = false) {
    let workReport: BsModalRef;
    workReport = this._modalService.show(
      WorkReportComponent,
      {
        class: 'modal-xl',
        initialState: {
          projectId,
          workReportId,
          statusId,
          isView
        }
      }
    );

    workReport.content.onSave.subscribe(() => {
      this.getAllReport();
    });
  }

  private showSprint(id?: number) {
    let sprint: BsModalRef;
    sprint = this._modalService.show(
      AddSprintComponent,
      {
        class: 'modal-lg',
        initialState: {
          id
        }
      }
    );
  }

  private showJob(id?: number) {
    let job: BsModalRef;
    job = this._modalService.show(
      AddJobComponent,
      {
        class: 'modal-lg',
        initialState: {
          id
        }
      }
    );
  }

  private showModule(id?: number) {
    let module: BsModalRef;
    module = this._modalService.show(
      AddModuleComponent,
      {
        class: 'modal-lg',
        initialState: {
          id
        }
      }
    );
  }

}

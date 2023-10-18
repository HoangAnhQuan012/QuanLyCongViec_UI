import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmEventType, ConfirmationService, LazyLoadEvent, Message, MessageService, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { CreateProjectComponent } from './create-project/create-project.component';
import { GetAllInputDto, ProjectManagementServiceProxy, ProjectsForViewDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';
import { FileDownloadService } from '@shared/file-download.service';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.scss']
})
export class JobManagementComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  loading = false;
  totalRecords: number;
  keyword = '';
  records: ProjectsForViewDto[] = [];
  msgs: Message[] = [];
  exporting = false;
  input: GetAllInputDto;
  lazyLoad: LazyLoadEvent;
  checkGrant: boolean;
  checkViewProject = false;

  constructor(
    injector: Injector,
    private _router: Router,
    private modalService: BsModalService,
    private _projectService: ProjectManagementServiceProxy,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _fileDownloadService: FileDownloadService
  ) {
    super(injector);
   }

  ngOnInit() {
    this.totalRecords = this.records.length;
    this.checkGrant = this.isGranted('Pages.ProjectManager.Create');
  }

  getDataPage(LazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._projectService.getAllProject(
      this.keyword,
      this.getSortField(this.table),
      LazyLoad ? LazyLoad.first : this.table.first,
      LazyLoad ? LazyLoad.rows : this.table.rows
    ).pipe(finalize(() => { this.loading = false; }))
    .subscribe(res => {
      this.records = res.items;
      this.totalRecords = res.totalCount;
    });
  }

  ProjectDetails(id: number) {
    this._projectService.checkViewProject(id).subscribe(result => {
      this.checkViewProject = result;
      if (this.checkViewProject) {
        this._router.navigate([`app/job-management/project-details/${id}`]);
      }
    });
  }

  createProject(id?: number) {
    this._showCreateDialog(id);
  }

  viewProject(id?: number, statusId?: number) {
    this._showCreateDialog(id, statusId, true);
  }

  deleteProject(record: ProjectsForViewDto) {
    this.confirmationService.confirm({
      message: 'Do you want to delete this project?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
          this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'Record deleted'}];
          this._projectService.deleteProject(record.id).subscribe(() => {
            this.showDeleteMessage();
            this.getDataPage();
          });
      },
      reject: () => {
          this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
    });
  }

  ExportExcel() {
    this.exporting = true;
    this.input = new GetAllInputDto();
    this.input.keyword = this.keyword || undefined;
    this.input.sorting = this.getSortField(this.table);
    this.input.skipCount = this.lazyLoad ? this.lazyLoad.first : this.table.first;
    this.input.maxResultCount = this.lazyLoad ? this.lazyLoad.rows : this.table.rows;
    this._projectService.exportToExcel(this.input).subscribe(result => {
      this._fileDownloadService.downloadTempFile(result);
      this.exporting = false;
    }, () => {
      this.exporting = false;
    });
  }

  private _showCreateDialog(id?: number, statusId?: number, isView = false): void {
    let createDialog: BsModalRef;
    createDialog = this.modalService.show(
      CreateProjectComponent,
      {
        class: 'modal-xl',
        ignoreBackdropClick: true,
        initialState: {
          id,
          statusId,
          isView
        },
      }
    );

    createDialog.content.onSave.subscribe(() => {
      this.getDataPage();
    });
  }
}

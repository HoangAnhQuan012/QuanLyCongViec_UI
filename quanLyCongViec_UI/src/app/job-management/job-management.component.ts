import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectManagementServiceProxy, ProjectsForViewDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
import { finalize } from 'rxjs/operators';

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

  constructor(
    ịnector: Injector,
    private _router: Router,
    private modalService: BsModalService,
    private _projectService: ProjectManagementServiceProxy
  ) {
    super(ịnector);
   }

  ngOnInit() {
    this.totalRecords = this.records.length;
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
    this._router.navigate([`app/job-management/project-details/${id}`]);
  }

  createProject(id?: number) {
    // this._router.navigate([`app/job-management/create-project`]);
    this._showCreateDialog(id);
  }

  ExportExcel() {}

  private _showCreateDialog(id?: number): void {
    let createDialog: BsModalRef;
    createDialog = this.modalService.show(
      CreateProjectComponent,
      {
        class: 'modal-xl',
        ignoreBackdropClick: true,
        initialState: {
          id
        },
      }
    );
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WorkReportComponent } from '../workReport/workReport.component';
import { AddModuleComponent } from './add-module/add-module.component';
import { AddSprintComponent } from './add-sprint/add-sprint.component';
import { AddJobComponent } from './add-job/add-job.component';
import { GetAllWorkReportForViewDto, WorkReportServiceProxy } from '@shared/service-proxies/service-proxies';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild('dt') table: Table;
  keyword = '';
  id: number;
  project: any[];
  routeSub: any;
  loading = false;
  totalRecords: number;
  records: GetAllWorkReportForViewDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    private _router: Router,
    private _workReportService: WorkReportServiceProxy,
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  getAllReport(lazyLoad ?: LazyLoadEvent) {
    this.loading = true;
    this._workReportService.getAllWorkReport(
      lazyLoad ? lazyLoad.first : this.table.first,
      lazyLoad ? lazyLoad.rows : this.table.rows
    ).subscribe((result) => {
      this.records = result.items;
      this.totalRecords = result.totalCount;
      this.loading = false;
    });
  }

  workReport() {
    this.showWorkReport(this.id);
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

  private showWorkReport(id?: number) {
    let workReport: BsModalRef;
    workReport = this._modalService.show(
      WorkReportComponent,
      {
        class: 'modal-xl',
        initialState: {
          id
        }
      }
    );
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

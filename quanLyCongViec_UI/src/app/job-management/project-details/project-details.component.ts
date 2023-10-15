import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WorkReportComponent } from '../workReport/workReport.component';
import { AddModuleComponent } from './add-module/add-module.component';
import { AddSprintComponent } from './add-sprint/add-sprint.component';
import { AddJobComponent } from './add-job/add-job.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  keyword = '';
  id: number;
  project: any[];
  routeSub: any;
  loading = false;
  totalRecords: 10;
  records = [];

  constructor(
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  load(event) {}

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

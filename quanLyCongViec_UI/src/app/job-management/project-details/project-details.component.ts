import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WorkReportComponent } from '../workReport/workReport.component';
import { AddLogworkComponent } from './add-logwork/add-logwork.component';

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
  records = [
    { id: 1 , name: 'Job 1', description: 'Job 1 description', status: 'Active',
      created: '2019-01-01', modified: '2019-01-01', email: 'mail@mail.com',
      product: [
        { id: 1, name: 'Product 1', description: 'Product 1 description', status: 'Active' },
        { id: 2, name: 'Product 2', description: 'Product 2 description', status: 'Deactive' },
        { id: 3, name: 'Product 3', description: 'Product 3 description', status: 'started' },
      ] },
    { id: 2, name: 'Job 2', description: 'Job 2 description', status: 'Deactive',
      created: '2019-01-01', modified: '2019-01-01', email: 'mail@123.com' },
    { id: 3, name: 'Job 3', description: 'Job 3 description', status: 'started',
      created: '2019-01-01', modified: '2019-01-01', email: '' },
    { id: 4, name: 'Job 4', description: 'Job 4 description', status: 'finished',
      created: '2019-01-01', modified: '2019-01-01', email: '' },
    { id: 5, name: 'Job 5', description: 'Job 5 description', status: 'ended',
      created: '2019-01-01', modified: '2019-01-01', email: '' },
    { id: 6, name: 'Job 6', description: 'Job 6 description', status: 'good',
      created: '2019-01-01', modified: '2019-01-01', email: '' },
    { id: 7, name: 'Job 7', description: 'Job 7 description', status: 'bad',
      created: '2019-01-01', modified: '2019-01-01', email: '' },
    { id: 8, name: 'Job 8', description: 'Job 8 description', status: 'great',
      created: '2019-01-01', modified: '2019-01-01', email: '' },
    { id: 9, name: 'Job 9', description: 'Job 9 description', status: 'excellent',
      created: '2019-01-01', modified: '2019-01-01', email: '' },
    { id: 10, name: 'Job 10', description: 'Job 10 description', status: 'Active',
      created: '2019-01-01', modified: '2019-01-01', email: '' },
    { id: 11, name: 'Job 11', description: 'Job 11 description', status: 'Active',
      created: '2019-01-01', modified: '2019-01-01', email: '' }
  ];

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

  addLogWork() {
    this.showLogWork(this.id);
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

  private showLogWork(id?: number) {
    let logWork: BsModalRef;
    logWork = this._modalService.show(
      AddLogworkComponent,
      {
        class: 'modal-xl',
        initialState: {
          id
        }
      }
    );
  }

}

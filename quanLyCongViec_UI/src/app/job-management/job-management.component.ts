import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { CreateProjectComponent } from './create-project/create-project.component';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.scss']
})
export class JobManagementComponent implements OnInit {
  @ViewChild('dt') table: Table;
  loading = false;
  totalRecords: number;

  records = [
    { id: 1 , name: 'Job 1', description: 'Job 1 description', status: 'Active',
      created: '2019-01-01', modified: '2019-01-01', email: 'mail@mail.com' },
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
    private _router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.totalRecords = this.records.length;
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        const value1 = data1[event.field];
        const value2 = data2[event.field];
        let result = null;

        if (value1 == null && value2 != null) {
            result = -1;
        } else if (value1 != null && value2 == null) {
            result = 1;
        } else if (value1 == null && value2 == null) {
            result = 0;
        } else if (typeof value1 === 'string' && typeof value2 === 'string') {
            result = value1.localeCompare(value2);
        } else {
          result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
        }
        return (event.order * result);
    });
}

  load(Lazy: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 0);
  }

  ProjectDetails(id: number) {
    this._router.navigate([`app/job-management/project-details/${id}`]);
  }

  createProject(id?: number) {
    // this._router.navigate([`app/job-management/create-project`]);
    this._showCreateDialog(id);
  }

  private _showCreateDialog(id?: number): void {
    let createDialog: BsModalRef;
    createDialog = this.modalService.show(
      CreateProjectComponent,
      {
        class: 'modal-lg',
        ignoreBackdropClick: true,
        initialState: {
          id
        },
      }
    );
  }
}

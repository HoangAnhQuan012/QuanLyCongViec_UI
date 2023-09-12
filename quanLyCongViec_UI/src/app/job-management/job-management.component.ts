import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-job-management',
  templateUrl: './job-management.component.html',
  styleUrls: ['./job-management.component.scss']
})
export class JobManagementComponent implements OnInit {
  @ViewChild('dt') table: Table;
  loading = false;

  records = [
    { name: 'Job 1', description: 'Job 1 description', status: 'Active',
      created: '2019-01-01', modified: '2019-01-01', email: 'mail@mail.com' },
    { name: 'Job 2', description: 'Job 2 description', status: 'Active',
      created: '2019-01-01', modified: '2019-01-01', email: 'mail@123.com' },
  ];

  constructor() { }

  ngOnInit() {
  }

}

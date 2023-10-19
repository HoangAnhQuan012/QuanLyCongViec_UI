import { Component, OnInit } from '@angular/core';
import { ReportsServiceProxy } from '@shared/service-proxies/service-proxies';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  listUserName: string[] = [];
  listHoursWorked: any[] = [];
  listDaysLogged: number[] = [];
  basicData: any;
  basicOptions: any;

  constructor(
    private reportService: ReportsServiceProxy
  ) { }

  ngOnInit() {
    this.getAllData();
  }

  getAllData() {
    this.reportService.getAllDataReports().subscribe((result) => {
      this.listUserName = result.listUserName;
      this.listHoursWorked = result.hoursWorked;
      this.listDaysLogged = result.daysLogged;
    });
    this.basicData = {
      labels: this.listUserName, // User
      datasets: [
          {
              label: 'Number of days logged for work',
              backgroundColor: '#6E85B7',
              data: this.listDaysLogged
          },
          {
            label: 'Hours worked',
            backgroundColor: '#FFE194',
            data: this.listDaysLogged
        }
      ]
  };
  }

}

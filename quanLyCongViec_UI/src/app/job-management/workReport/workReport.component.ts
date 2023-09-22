import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-workReport',
  templateUrl: './workReport.component.html',
  styleUrls: ['./workReport.component.scss']
})
export class WorkReportComponent implements OnInit {
  formData: FormGroup;
  SubJobs: FormArray = new FormArray([]);
  filesAllFile: File[] = [];
  demoDto: any = {};
  dateFormat = 'dd/MM/yyyy';
  hours: number;
  isModified = false;

  constructor(
    public bsModalRef: BsModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.CreateForm();
  }

  CreateForm() {
    this.formData = this.fb.group({
      subJobs: this.fb.array([]),
      sprint: ['', [Validators.required]],
      module: ['', [Validators.required]],
      declarationDate: ['', [Validators.required]],
    });
  }

  createItem(): FormGroup {
    return this.fb.group({
      subJobs: [''],
      job: ['', [Validators.required]],
      kindOfJob: ['', [Validators.required]],
      type: ['', [Validators.required]],
      onSite: [''],
      hours: ['', [Validators.required]],
      note: [''],
    });
  }

  AddItem() {
    this.SubJobs = this.formData.get('subJobs') as FormArray;
    this.SubJobs.push(this.createItem());
  }

  removeJob(index: number) {
    this.SubJobs.removeAt(index);
  }

  getControls() {
    return (this.formData.get('subJobs') as FormArray).controls;
  }

  xoaListFile() {}

  onSelectAllFile(event) {}

  onRemoveAllFile(event) {}

  onDownloadFile(event) {}

  save() {}

}

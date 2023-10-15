import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateWorkReportInputDto, JobList, LookupTableDto, WorkReportServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-workReport',
  templateUrl: './workReport.component.html',
  styleUrls: ['./workReport.component.scss']
})
export class WorkReportComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  formData: FormGroup;
  SubJobs: FormArray = new FormArray([]);
  filesAllFile: File[] = [];
  demoDto: any = {};
  dateFormat = 'dd/MM/yyyy';
  hours = 0;
  isModified = false;
  sprintItems: LookupTableDto[] = [];
  moduleItems: LookupTableDto[] = [];
  jobItems: LookupTableDto[] = [];
  kindOfJobItems: LookupTableDto[] = [];
  typeItems: LookupTableDto[] = [];
  createWorkReportInput: CreateWorkReportInputDto = new CreateWorkReportInputDto();
  saving = false;
  id: number;

  constructor(
    private injector: Injector,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private _workReportService: WorkReportServiceProxy,
  ) {
    super(injector);
   }

  ngOnInit() {
    this.CreateForm();
    forkJoin(
      this._workReportService.getAllSprint(),
      this._workReportService.getAllModule(),
      this._workReportService.getAllKindOfJob(),
      this._workReportService.getAllType(),
    ).subscribe(([sprint, module, kindOfJob, type]) => {
      this.sprintItems = sprint;
      this.moduleItems = module;
      this.kindOfJobItems = kindOfJob;
      this.typeItems = type;
    });

    this.formData.controls.subJobs.valueChanges.subscribe((value): number => {
      let totalHours = 0;
      value.forEach((item) => {
        totalHours += item.hours;
      });
      return this.hours = totalHours;
    });
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

  onSprintChane(event) {
    const sprintId = event.value.id;
    this._workReportService.getAllJobBySprintId(sprintId).subscribe((res) => {
      this.jobItems = res;
    });
  }

  // onHoursChange(event) {
  //   let totalHours = 0;
  //   totalHours += event.value;
  //   this.hours = totalHours;
  // }

  xoaListFile() {}

  onSelectAllFile(event) {}

  onRemoveAllFile(event) {}

  onDownloadFile(event) {}

  save() {
    this.getValueForSave();
    this._workReportService.createOrEditWorkReport(this.createWorkReportInput).pipe(
      finalize(() => {
        this.saving = true;
      })).subscribe(() => {
        this.showCreateMessage();
        this.bsModalRef.hide();
        this.onSave.emit();
      });
  }

  private getValueForSave() {
    this.createWorkReportInput.projectId = this.id;
    this.createWorkReportInput.sprintId = this.formData.controls.sprint.value.id;
    this.createWorkReportInput.moduleId = this.formData.controls.module.value.id;
    this.createWorkReportInput.declarationDate = this.formData.controls.declarationDate.value;
    const list = this.formData.controls.subJobs.value;
    console.log(list);

    this.createWorkReportInput.jobList = [];
    list.forEach((item) => {
      const jobListItem = new JobList();
      jobListItem.jobId = item.job.id;
      jobListItem.kindOfJob = item.kindOfJob.id;
      jobListItem.type = item.type.id;
      jobListItem.onSite = item.onSite;
      jobListItem.hours = item.hours;
      jobListItem.note = item.note;
      console.log(jobListItem);
      debugger;
      this.createWorkReportInput.jobList.push(jobListItem);
    });
  }

}

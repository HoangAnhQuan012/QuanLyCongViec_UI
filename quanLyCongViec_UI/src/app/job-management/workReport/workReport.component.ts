import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/components/common.component';
import { StatusStr } from '@shared/pipes/statusStr.pipe';
import { CreateWorkReportInputDto, LookupTableDto, WorkReportForViewDto, WorkReportServiceProxy } from '@shared/service-proxies/service-proxies';
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
  projectId: number;
  workReportId: number;
  isView = false;
  workReportDto: any = {};
  getForEdit: WorkReportForViewDto = new WorkReportForViewDto();

  constructor(
    private injector: Injector,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private _workReportService: WorkReportServiceProxy,
    private http: HttpClient,
  ) {
    super(injector);
   }

  ngOnInit() {
    this.CreateForm();
    forkJoin(
      this._workReportService.getAllSprint(this.projectId),
      this._workReportService.getAllModule(this.projectId),
      this._workReportService.getAllKindOfJob(),
      this._workReportService.getAllType(),
    ).subscribe(([sprint, module, kindOfJob, type]) => {
      this.sprintItems = sprint;
      this.moduleItems = module;
      this.kindOfJobItems = kindOfJob;
      this.typeItems = type;
    });

    // this.formData.controls.subJobs.valueChanges.subscribe((value): number => {
    //   let totalHours = 0;
    //   value.forEach((item) => {
    //     totalHours += item.hours;
    //   });
    //   return this.hours = totalHours;
    // });

    if (!this.workReportId) {

    } else {
      this._workReportService.getForEdit(this.workReportId).subscribe((res) => {
        this.getForEdit = res;
        this.setValueForEdit();
      });
    }
    if (this.isView) {
      this.formData.disable();
    } else {
      this.formData.enable();
    }
  }

  CreateForm() {
    this.formData = this.fb.group({
      subJobs: this.fb.array([]),
      sprint: ['', [Validators.required]],
      module: ['', [Validators.required]],
      declarationDate: ['', [Validators.required]],
      job: ['', [Validators.required]],
      kindOfJob: ['', [Validators.required]],
      type: ['', [Validators.required]],
      onSite: [''],
      hours: ['', [Validators.required]],
      note: [''],
    });
  }

  // createItem(): FormGroup {
  //   return this.fb.group({
  //     subJobs: [''],
  //     job: ['', [Validators.required]],
  //     kindOfJob: ['', [Validators.required]],
  //     type: ['', [Validators.required]],
  //     onSite: [''],
  //     hours: ['', [Validators.required]],
  //     note: [''],
  //   });
  // }

  // AddItem() {
  //   this.SubJobs = this.formData.get('subJobs') as FormArray;
  //   this.SubJobs.push(this.createItem());
  // }

  // removeJob(index: number) {
  //   this.SubJobs.removeAt(index);
  // }

  // getControls() {
  //   return (this.formData.get('subJobs') as FormArray).controls;
  // }

  onSprintChane(event) {
    const sprintId = event.value.id;
    this._workReportService.getAllJobBySprintId(sprintId).subscribe((res) => {
      this.jobItems = res;
    });
  }

  onHoursChange(event) {
    let totalHours = 0;
    totalHours += event.value;
    this.hours = totalHours;
  }

  xoaListFile() {}

  onSelectAllFile(event) {}

  onRemoveAllFile(event) {}

  onDownloadFile(event) {}

  save() {
    const pipe = new StatusStr();
    this.getValueForSave();
    this.createWorkReportInput.status = pipe.transform(this.createWorkReportInput.status);
    if (this.isView) {
      this.approvedStatus();
    }
    this._workReportService.createOrEditWorkReport(this.createWorkReportInput).pipe(
      finalize(() => {
        this.saving = true;
      })).subscribe(() => {
        if (!this.workReportId) {
          this.showCreateMessage();
          this.bsModalRef.hide();
          this.onSave.emit();
        } else {
          this.showUpdateMessage();
          this.bsModalRef.hide();
          this.onSave.emit();
        }
      });
  }

  private getValueForSave() {
    this.createWorkReportInput.projectId = this.projectId;
    this.createWorkReportInput.sprintId = this.formData.controls.sprint.value.id;
    this.createWorkReportInput.moduleId = this.formData.controls.module.value.id;
    this.createWorkReportInput.declarationDate = this.formData.controls.declarationDate.value;
    this.createWorkReportInput.jobId = this.formData.controls.job.value.id;
    this.createWorkReportInput.kindOfJob = this.formData.controls.kindOfJob.value.id;
    this.createWorkReportInput.type = this.formData.controls.type.value.id;
    this.createWorkReportInput.onSite = this.formData.controls.onSite.value;
    this.createWorkReportInput.hours = this.formData.controls.hours.value;
    this.createWorkReportInput.note = this.formData.controls.note.value;
    // const list = this.formData.controls.subJobs.value;
    // this.createWorkReportInput.jobList = [];
    // list.forEach((item) => {
    //   const jobListItem = new JobList();
    //   jobListItem.jobId = item.job.id;
    //   jobListItem.kindOfJob = item.kindOfJob.id;
    //   jobListItem.type = item.type.id;
    //   jobListItem.onSite = item.onSite ? true : false;
    //   jobListItem.hours = item.hours;
    //   jobListItem.note = item.note;
    //   this.createWorkReportInput.jobList.push(jobListItem);
    // });
  }

  // tslint:disable-next-line:member-ordering
  approvedStatus() {}

  private setValueForEdit() {
    this.formData.controls.sprint.setValue(this.getForEdit.spintName);
    this.formData.controls.module.setValue(this.getForEdit.moduleName);
    this.formData.controls.declarationDate.setValue(CommonComponent.getDateForEditFromMoment(this.getForEdit.declarationDate));
    this.formData.controls.job.setValue(this.getForEdit.jobName);
    this.formData.controls.kindOfJob.setValue(this.getForEdit.kindOfJobName);
    this.formData.controls.type.setValue(this.getForEdit.typeName);
    this.formData.controls.onSite.setValue(this.getForEdit.onSite);
    this.formData.controls.hours.setValue(this.getForEdit.hours);
    this.formData.controls.note.setValue(this.getForEdit.note);

    for (const file of this.getForEdit.listFile) {
      const path = AppConsts.remoteServiceBaseUrl + '\\Upload\\WorkReport' + file.filePath;
      this.http.get(path, { responseType: 'blob' }).subscribe((data) => {
        this.filesAllFile.push(this.blobToFile(data, file.fileName));
      });
    }
  }

}

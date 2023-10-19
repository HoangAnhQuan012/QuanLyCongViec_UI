import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConsts } from '@shared/AppConsts';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';
import { StatusStr } from '@shared/pipes/statusStr.pipe';
import { CreateWorkReportInputDto, LookupTableDto, UpdateReportStatusInput, WorkReportAttachedFiles,
         WorkReportForViewDto, WorkReportServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ConfirmationService, Message } from 'primeng/api';
import { finalize, forkJoin } from 'rxjs';
const URL = AppConsts.remoteServiceBaseUrl + '/api/Upload/WorkReportUpload';

@Component({
  selector: 'app-workReport',
  templateUrl: './workReport.component.html',
  styleUrls: ['./workReport.component.scss']
})
export class WorkReportComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  formData: FormGroup;
  dateFormat = 'dd/MM/yyyy';
  hours = 0;
  sprintItems: LookupTableDto[] = [];
  moduleItems: LookupTableDto[] = [];
  jobItems: LookupTableDto[] = [];
  kindOfJobItems: LookupTableDto[] = [];
  typeItems: LookupTableDto[] = [];
  filesAllFile: File[] = [];
  attachedFile: File[] = [];
  msgs: Message[] = [];
  createWorkReportInput: CreateWorkReportInputDto = new CreateWorkReportInputDto();
  getForEdit: WorkReportForViewDto = new WorkReportForViewDto();
  workReport: UpdateReportStatusInput = new UpdateReportStatusInput();
  projectId: number;
  workReportId: number;
  statusId: number;
  saving = false;
  isView = false;
  uploading = false;
  isApprovedStatus = false;
  saveHidden = false;
  projectName = '';
  // SubJobs: FormArray = new FormArray([]);

  constructor(
    private injector: Injector,
    public bsModalRef: BsModalRef,
    private fb: FormBuilder,
    private _workReportService: WorkReportServiceProxy,
    private http: HttpClient,
    private _fileDownloadService: FileDownloadService,
    private confirmationService: ConfirmationService
  ) {
    super(injector);
   }

  ngOnInit() {
    this.isApprovedStatus = this.statusId === 0;
    this.saveHidden = this.statusId === 2;

    this.CreateForm();
    forkJoin(
      this._workReportService.getAllSprint(this.projectId),
      this._workReportService.getAllModule(this.projectId),
      this._workReportService.getAllKindOfJob(),
      this._workReportService.getAllType(),
      this._workReportService.getProjectName(this.projectId)
    ).subscribe(([sprintValue, moduleValue, kindOfJobValue, typeValue, projectName]) => {
      this.sprintItems = sprintValue;
      this.moduleItems = moduleValue;
      this.kindOfJobItems = kindOfJobValue;
      this.typeItems = typeValue;
      this.projectName = projectName;
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
        this._workReportService.getAllJobBySprintId(this.getForEdit.sprintId).subscribe((val) => {
          this.jobItems = val;
          this.setValueForEdit();
        });
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
      sprint: ['', [Validators.required]],
      module: ['', [Validators.required]],
      declarationDate: ['', [Validators.required]],
      job: ['', [Validators.required]],
      kindOfJob: ['', [Validators.required]],
      type: ['', [Validators.required]],
      onSite: [''],
      hours: ['', [Validators.required]],
      note: [''],
      // subJobs: this.fb.array([]),
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

  deleteListFile() {
    this.attachedFile = [];
  }

  onSelectAllFile(event) {
    this.attachedFile.push(...event.addedFiles);
  }

  onRemoveAllFile(event) {
    this.attachedFile.splice(this.attachedFile.indexOf(event), 1);
  }

  onDownloadFile(url) {
    this._workReportService.downloadFileUpload(url).subscribe(result => {
      this._fileDownloadService.downloadTempFile(result);
    });
  }

  save() {
    this.saving = true;
    const pipe = new StatusStr();
    const formdata = new FormData();
    formdata.append('sprint', this.formData.controls.sprint.value);
    for (let i = 0; i < this.attachedFile.length; i++) {
      const item = new File([this.attachedFile[i]], this.attachedFile[i].name);
      formdata.append((i + 1) + '', item);
    }
    this.http.post(URL, formdata).subscribe(res => {
      this.getValueForSave();
      this.createWorkReportInput.attachedFiles = [];
      this.FileProcessing(res);
      if (this.formData.controls.job.value.id === undefined || this.formData.controls.job.value.id === null ||
        this.formData.controls.job.value.id === 0) {
          this.createWorkReportInput.jobId = this.getForEdit.jobId;
      }
      this.createWorkReportInput.status = pipe.transform(this.createWorkReportInput.status);
      if (this.isView) {
        this.approvedStatus();
      } else {
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
    });
  }

  private getValueForSave() {
    this.createWorkReportInput.id = this.workReportId;
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
  approvedStatus() {
    this.confirmationService.confirm({
      message: 'Do you want to update this work report?',
      header: 'Update Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
          this.msgs = [{severity: 'info', summary: 'Confirmed', detail: 'Record deleted'}];
          this.workReport.id =  this.getForEdit.id;
          this.workReport.status = this.getForEdit.statusId;
          this._workReportService.updateWorkReportStatus(this.workReport).pipe(
            finalize(() => {
              this.saving = false;
            })
          ).subscribe(() => {
            this.showUpdateMessage();
            this.bsModalRef.hide();
            this.onSave.emit();
          });
      },
      reject: () => {
          this.msgs = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
      }
    });
  }

  private setValueForEdit() {
    this.formData.controls.sprint.setValue(this.sprintItems.find(
      x => x.displayName === this.getForEdit.spintName || x.id === this.getForEdit.sprintId
    ));
    this.formData.controls.module.setValue(this.moduleItems.find(
      x => x.displayName === this.getForEdit.moduleName || x.id === this.getForEdit.moduleId
    ));
    // this.formData.controls.job.setValue(this.jobItems.find(
    //   x => x.displayName === this.getForEdit.jobName || x.id === this.getForEdit.jobId
    // )?.displayName);
    this.formData.controls.job.setValue(this.getForEdit.jobName);

    this.formData.controls.kindOfJob.setValue(this.kindOfJobItems.find(
      x => x.displayName === this.getForEdit.kindOfJobName || x.id === this.getForEdit.kindOfJobId
    ));
    this.formData.controls.type.setValue(this.typeItems.find(
      x => x.displayName === this.getForEdit.typeName || x.id === this.getForEdit.typeId
    ));
    this.formData.controls.declarationDate.setValue(CommonComponent.getDateForEditFromMoment(this.getForEdit.declarationDate));
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

  private FileProcessing(res) {
    for (const file of this.attachedFile) {
      const item = new WorkReportAttachedFiles();
      item.fileName = file.name;
      item.filePath = this.getLinkFile(res, file.name);
      this.createWorkReportInput.attachedFiles.push(item);
    }
  }

}

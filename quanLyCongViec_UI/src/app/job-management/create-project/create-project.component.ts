import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConsts } from '@shared/AppConsts';
import { CheckPermissionConst } from '@shared/AppEnums';
import { AppComponentBase } from '@shared/app-component-base';
import { FileDownloadService } from '@shared/file-download.service';
import { ProjectAttachedFiles, ProjectInputDto, ProjectManagementServiceProxy, ProjectUser, ProjectsForViewDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';
import * as models from '@shared/AppModels';
import { CommonComponent } from '@shared/components/common.component';

const URL = AppConsts.remoteServiceBaseUrl + '/api/Upload/ProjectUpload';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  control: FormControl;
  formData: FormGroup;
  attachedFile: File[] = [];
  id: number;
  saving = false;
  createInputDto: ProjectInputDto = new ProjectInputDto();
  isEdit = false;
  getForEdit: ProjectsForViewDto = new ProjectsForViewDto();
  userList = [];
  isView = false;
  projectName = '';
  filesAllFile: File[] = [];
  uploading = false;

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder,
    private _projectService: ProjectManagementServiceProxy,
    private http: HttpClient,
    private _fileDownloadService: FileDownloadService
  ) {
    super(injector);
  }

  ngOnInit() {
    this.createForm();
    this._projectService.checkAdmin().subscribe(result => {
      if (result === CheckPermissionConst.PM) {
        this._projectService.getListUserDev().subscribe(res => {
          this.userList = res;
        });
      }
    });

    if (!this.id) {
      // Add new
      this.createInputDto = new ProjectInputDto();
      this.isEdit = false;
      this._projectService.getPMbyUserId().subscribe(res => {
        this.formData.controls.pm.setValue(res);
        this.formData.controls.pm.disable();
      });
      this._projectService.getStatusStart().subscribe(res => {
        this.formData.controls.status.setValue(res);
        this.formData.controls.status.disable();
      });
    } else {
      this.isEdit = true;
      this._projectService.getProjectName(this.id).subscribe(val => {
        this.projectName = val;
        this._projectService.getForEdit(this.id, this.projectName).subscribe(res => {
          this.getForEdit = res;
          this.setValueForEdit();
        });
      });
    }
    if (this.isView) {
      this.formData.disable();
    } else {
      this.formData.enable();
      this.formData.controls.pm.disable();
      this.formData.controls.status.disable();
    }

  }

  createForm() {
    this.formData = this._fb.group({
      pm: ['', Validators.required],
      projectName: ['', Validators.required],
      customer: ['', Validators.required],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      employee: ['', Validators.required],
      note: [''],
    });
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
    this._projectService.downloadFileUpload(url).subscribe(result => {
      this._fileDownloadService.downloadTempFile(result);
    });
  }

  save() {
    this.saving = true;
    const formdata = new FormData();
    formdata.append('projectName', this.formData.controls.projectName.value);
    for (let i = 0; i < this.attachedFile.length; i++) {
      const item = new File([this.attachedFile[i]], this.attachedFile[i].name);
      formdata.append((i + 1) + '', item);
    }
    this.http.post(URL, formdata).subscribe(res => {
      this.getValueForSave();
      this.createInputDto.projectAttachedFiles = [];
      this.FileProcessing(res);
      this._projectService.createOrEditProject(this.createInputDto).pipe(
        finalize(() => {
          this.saving = false;
        })
      ).subscribe(val => {
        if (!this.id) {
          this.showCreateMessage();
          this.bsModalRef.hide();
          this.onSave.emit();
        } else {
          this.showUpdateMessage();
          this.bsModalRef.hide();
          this.onSave.emit();
        }
      });
    });
  }

  private getValueForSave() {
    this.createInputDto.id = this.id;
    this.createInputDto.projectName = this.formData.controls.projectName.value;
    this.createInputDto.customer = this.formData.controls.customer.value;
    this.createInputDto.startDate = this.formData.controls.startDate.value;
    this.createInputDto.endDate = this.formData.controls.endDate.value;
    this.createInputDto.projectUsers = [];
    for (const item of this.formData.controls.employee.value) {
      const projectUser = new ProjectUser();
      projectUser.userId = item.id;
      projectUser.projectsId = this.id;
      this.createInputDto.projectUsers.push(projectUser);
    }
    this.createInputDto.note = this.formData.controls.note.value;
    console.log(this.createInputDto.projectUsers);

  }

  private setValueForEdit() {
    this.formData.controls.projectName.setValue(this.getForEdit.projectName);
    this.formData.controls.customer.setValue(this.getForEdit.customer);
    this.formData.controls.pm.setValue(this.getForEdit.projectManagerName);
    this.formData.controls.startDate.setValue(CommonComponent.getDateForEditFromMoment(this.getForEdit.startDate));
    this.formData.controls.endDate.setValue(CommonComponent.getDateForEditFromMoment(this.getForEdit.endDate));
    this.formData.controls.status.setValue(models.ProjectStatus[this.getForEdit.status]);
    this.formData.controls.note.setValue(this.getForEdit.note);
    this.formData.controls.employee.setValue(this.getForEdit.listUsers);


    for (const file of this.getForEdit.listFile) {
      const path = AppConsts.remoteServiceBaseUrl + '\\Upload\\Project' + file.filePath;
      this.http.get(path, { responseType: 'blob' }).subscribe((data) => {
        this.filesAllFile.push(this.blobToFile(data, file.fileName));
      });
    }

  }

  private FileProcessing(res) {
    for (const file of this.attachedFile) {
      const item = new ProjectAttachedFiles();
      item.fileName = file.name;
      item.filePath = this.getLinkFile(res, file.name);
      this.createInputDto.projectAttachedFiles.push(item);
    }
  }

}

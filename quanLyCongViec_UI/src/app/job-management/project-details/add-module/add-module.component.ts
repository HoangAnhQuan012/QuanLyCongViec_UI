import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateModuleInputDto, ModuleServiceProxy, ProjectManagementServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.scss']
})
export class AddModuleComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  formData: FormGroup;
  createModuleInput: CreateModuleInputDto = new CreateModuleInputDto();
  id: number;
  saving = false;

  constructor(
    private injector: Injector,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder,
    private _moduleService: ModuleServiceProxy,
  ) {
    super(injector);
   }

  ngOnInit() {
    this.createForm();
    this._moduleService.getUserId().subscribe((res) => {
      this.formData.controls.pm.setValue(res);
      this.formData.controls.pm.disable();
    });
  }

  createForm() {
    this.formData = this._fb.group({
      pm: ['', Validators.required],
      module: ['', Validators.required],
    });
  }

  save() {
    this.getValueForSave();
    this._moduleService.createModule(this.createModuleInput).pipe(
      finalize(() => {
        this.saving = true;
      })
    ).subscribe((val) => {
        this.showCreateMessage();
        this.bsModalRef.hide();
        this.onSave.emit();
    });
  }

  private getValueForSave() {
    this.createModuleInput.projectId = this.id;
    this.createModuleInput.moduleName = this.formData.controls.module.value;
  }

}

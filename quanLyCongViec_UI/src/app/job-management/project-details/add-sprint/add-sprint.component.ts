import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateSprintInputDto, ModuleServiceProxy, SprintServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-sprint',
  templateUrl: './add-sprint.component.html',
  styleUrls: ['./add-sprint.component.scss']
})
export class AddSprintComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  formData: FormGroup;
  createSprintInput: CreateSprintInputDto = new CreateSprintInputDto();
  id: number;
  saving = false;
  constructor(
    private injector: Injector,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder,
    private _sprintService: SprintServiceProxy,
    private _moduleService: ModuleServiceProxy
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
      sprint: ['', Validators.required],
    });
  }
  save() {
    this.getValueForSave();
    this._sprintService.createSprint(this.createSprintInput).pipe(
      finalize(() => {
        this.saving = true;
      })
    ).subscribe(() => {
      this.showCreateMessage();
      this.bsModalRef.hide();
      this.onSave.emit();
    });
  }

  private getValueForSave() {
    this.createSprintInput.projectId = this.id;
    this.createSprintInput.sprintName = this.formData.controls.sprint.value;
  }

}

import { Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { CreateJobInputDto, JobServiceProxy, LookupTableDto, ModuleServiceProxy } from '@shared/service-proxies/service-proxies';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss']
})
export class AddJobComponent extends AppComponentBase implements OnInit {
  @Output() onSave = new EventEmitter<any>();
  formData: FormGroup;
  id: number;
  createJobInput: CreateJobInputDto = new CreateJobInputDto();
  saving = false;
  sprintList: LookupTableDto[];
  constructor(
    private injector: Injector,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder,
    private _jobService: JobServiceProxy,
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

    this._jobService.getAllSprint(this.id).subscribe((result) => {
      this.sprintList = result;
    });
  }

  createForm() {
    this.formData = this._fb.group({
      pm: ['', Validators.required],
      sprint: ['', Validators.required],
      job: ['', Validators.required],
    });
  }

  save() {
    this.getValueForSave();
    this._jobService.createJob(this.createJobInput).pipe(
      finalize(() => {
        this.saving = true;
      })
    ).subscribe(() => {
      this.showCreateMessage();
      this.bsModalRef.hide();
      this.onSave.emit();
    });
  }

  searchUnit(event) {
    const query = event.query;
    this._jobService.getAllSprint(this.id).subscribe((result) => {
      this.sprintList = this.filterSprint(query, result);
    });
  }

  filterSprint(query, SprintItems: LookupTableDto[]): any[] {
    const filtered: any[] = [];
    for (const iterator of SprintItems) {
      if (iterator.displayName.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) === 0) {
        filtered.push(iterator);
      }
    }
    return filtered;
  }

  private getValueForSave() {
    this.createJobInput.jobName = this.formData.controls.job.value;
    this.createJobInput.sprintId = this.formData.controls.sprint.value.id;
    console.log(this.createJobInput.sprintId);

  }

}

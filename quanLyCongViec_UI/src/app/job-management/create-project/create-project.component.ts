import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent extends AppComponentBase implements OnInit {
  control: FormControl;
  formData: FormGroup;
  filesAllImg: File[] = [];
  filesAllFile: File[] = [];
  demoDto: any;

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formData = this._fb.group({
      pm: ['', Validators.required],
      projectName: ['', Validators.required],
      customer: ['', Validators.required],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      note: [''],
    });
  }

  xoaListHA() {}

  xoaListFile() {}

  onSelectAllHA(event) {}

  onSelectAllFile(event) {}

  onRemoveAllHA(event) {}

  onRemoveAllFile(event) {}

  onDownloadFile(event) {}

  save() {
    this.notify.success('Saved successfully');
  }

}

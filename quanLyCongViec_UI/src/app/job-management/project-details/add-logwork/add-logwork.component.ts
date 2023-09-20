import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-logwork',
  templateUrl: './add-logwork.component.html',
  styleUrls: ['./add-logwork.component.scss']
})
export class AddLogworkComponent implements OnInit {
  formData: FormGroup;

  constructor(
    public bsModalRef: BsModalRef,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formData = this._fb.group({
      pm: ['', [Validators.required]],
      sprint: ['', [Validators.required]],
      module: ['', [Validators.required]],
      job: ['', [Validators.required]],
      kindOfJob: ['', [Validators.required]],
      type: ['', [Validators.required]],
      note: [''],
    });
  }

  save() {}

}

import { Component, Injector, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent extends AppComponentBase implements OnInit {
  control: FormControl;
  filesAllImg: File[] = [];
  filesAllFile: File[] = [];
  demoDto: any;

  constructor(
    injector: Injector,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit() {
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

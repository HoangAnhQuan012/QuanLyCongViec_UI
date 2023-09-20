import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, includes as _includes, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/app-component-base';
import {
  UserServiceProxy,
  UserDto,
  RoleDto,
  LookupTableServiceProxy,
  LookupTableDto,
  GetUserOutputDto
} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
})
export class EditUserDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  user = new UserDto();
  roles: RoleDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  id: number;
  unitName: string;
  UnitsItems: LookupTableDto[] = [];

  @Output() onSave = new EventEmitter<any>();
  formData: FormGroup;

  constructor(
    injector: Injector,
    public _userService: UserServiceProxy,
    public bsModalRef: BsModalRef,
    private _lookupTableService: LookupTableServiceProxy,
    private _fb: FormBuilder
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.createForm();
    this._userService.get(this.id).subscribe((result) => {
      this.user = result;
      this._userService.getRoles().subscribe((result2) => {
        this.roles = result2.items;
        this.setInitialRolesStatus();
      });
      this.setValueForEdit();
    });

    this._lookupTableService.getAllUnitsLookupTable().subscribe((res) => {
      this.UnitsItems = res;
    });
  }

  createForm(): void {
    this.formData = this._fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      userName: ['', Validators.required],
      emailAddress: ['', Validators.required],
      isActive: [],
      unit: ['', Validators.required],
    });
  }

  searchUnit(event) {
    const query = event.query;
    this._lookupTableService.getAllUnitsLookupTable().subscribe((result) => {
      this.UnitsItems = this.filterUnit(query, result);
    });
  }

  filterUnit(query, UnitsItems: LookupTableDto[]): any[] {
    const filtered: any[] = [];
    for (const iterator of UnitsItems) {
      if (iterator.displayName.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) === 0) {
        filtered.push(iterator);
      }
    }
    return filtered;
  }

  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    return _includes(this.user.roleNames, normalizedName);
  }

  onRoleChange(role: RoleDto, $event) {
    this.checkedRolesMap[role.normalizedName] = $event.target.checked;
  }

  getCheckedRoles(): string[] {
    const roles: string[] = [];
    _forEach(this.checkedRolesMap, function (value, key) {
      if (value) {
        roles.push(key);
      }
    });
    return roles;
  }

  save(): void {
    this.saving = true;

    this.user.roleNames = this.getCheckedRoles();

    this._userService.update(this.user).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }

  private setValueForEdit() {
    this.formData.controls.name.setValue(this.user.name);
    this.formData.controls.surname.setValue(this.user.surname);
    this.formData.controls.userName.setValue(this.user.userName);
    this.formData.controls.emailAddress.setValue(this.user.emailAddress);
    this.formData.controls.isActive.setValue(this.user.isActive);
    this.formData.controls.unit.setValue(this.user.unitName);

  }
}

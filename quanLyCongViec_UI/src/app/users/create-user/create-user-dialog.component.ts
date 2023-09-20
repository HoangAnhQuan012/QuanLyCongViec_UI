import {
  Component,
  Injector,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { forEach as _forEach, map as _map } from 'lodash-es';
import { AppComponentBase } from '@shared/app-component-base';
import {
  UserServiceProxy,
  CreateUserDto,
  RoleDto,
  LookupTableServiceProxy,
  LookupTableDto
} from '@shared/service-proxies/service-proxies';
import { AbpValidationError } from '@shared/components/validation/abp-validation.api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss'],
})
export class CreateUserDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  user = new CreateUserDto();
  roles: RoleDto[] = [];
  checkedRolesMap: { [key: string]: boolean } = {};
  defaultRoleCheckedStatus = false;
  passwordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'pattern',
      localizationKey:
        'PasswordsMustBeAtLeast8CharactersContainLowercaseUppercaseNumber',
    },
  ];
  confirmPasswordValidationErrors: Partial<AbpValidationError>[] = [
    {
      name: 'validateEqual',
      localizationKey: 'PasswordsDoNotMatch',
    },
  ];

  @Output() onSave = new EventEmitter<any>();
  form: FormGroup;
  UnitsItems: LookupTableDto[] = [];

  constructor(
    injector: Injector,
    public _userService: UserServiceProxy,
    public bsModalRef: BsModalRef,
    private _formBuilder: FormBuilder,
    private lookupTableService: LookupTableServiceProxy
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.user.isActive = true;
    this.createForm();

    this._userService.getRoles().subscribe((result) => {
      this.roles = result.items;
      this.setInitialRolesStatus();
    });
  }

  setInitialRolesStatus(): void {
    _map(this.roles, (item) => {
      this.checkedRolesMap[item.normalizedName] = this.isRoleChecked(
        item.normalizedName
      );
    });
  }

  isRoleChecked(normalizedName: string): boolean {
    // just return default role checked status
    // it's better to use a setting
    return this.defaultRoleCheckedStatus;
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

  createForm() {
    this.form = this._formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.pattern(/(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/)])],
      confirmPassword: ['', Validators.compose([
        Validators.required, Validators.pattern(/(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/)
      ])],
      emailAddress: ['', Validators.compose([Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,})+$/)])],
      TinhTrang: [true],
      unit: ['', Validators.required]
    });
  }

  searchUnit(event) {
    const query = event.query;
    this.lookupTableService.getAllUnitsLookupTable().subscribe((result) => {
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

  save(): void {
    this.saving = true;

    this.user.roleNames = this.getCheckedRoles();
    this.getValueForSave();
    this._userService.create(this.user).subscribe(
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

  private getValueForSave() {
    this.user.name = this.form.controls.name.value;
    this.user.surname = this.form.controls.surname.value;
    this.user.userName = this.form.controls.userName.value;
    this.user.password = this.form.controls.password.value;
    this.user.emailAddress = this.form.controls.emailAddress.value;
    this.user.unitId = this.form.controls.unit.value.id;
    this.user.isActive = this.form.controls.TinhTrang.value;
  }
}

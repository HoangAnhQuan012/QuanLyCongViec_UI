import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from 'shared/paged-listing-component-base';
import {
  UserServiceProxy,
  UserDto,
  UserDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password/reset-password.component';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppComponentBase } from '@shared/app-component-base';

class PagedUsersRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  templateUrl: './users.component.html',
  animations: [appModuleAnimation()]
})
// export class UsersComponent extends PagedListingComponentBase<UserDto> {
export class UsersComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  users: UserDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;
  loading = false;
  totalRecords: number;

  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.getDataPage();
  }

  createUser(): void {
    this.showCreateOrEditUserDialog();
  }

  editUser(user: UserDto): void {
    this.showCreateOrEditUserDialog(user.id);
  }

  public resetPassword(user: UserDto): void {
    this.showResetPasswordUserDialog(user.id);
  }

  clearFilters(): void {
    this.keyword = '';
    this.isActive = undefined;
    this.getDataPage();
  }

  protected list(
    request: PagedUsersRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
  //   request.keyword = this.keyword;
  //   request.isActive = this.isActive;

  //   this._userService
  //     .getAll(
  //       request.keyword,
  //       request.isActive,
  //       request.skipCount,
  //       request.maxResultCount
  //     )
  //     .pipe(
  //       finalize(() => {
  //         finishedCallback();
  //       })
  //     )
  //     .subscribe((result: UserDtoPagedResultDto) => {
  //       this.users = result.items;
  //       this.showPaging(result, pageNumber);
  //     });
  }

  // tslint:disable-next-line:member-ordering
  getDataPage(lazyLoad?: LazyLoadEvent) {
      this.loading = true;
      this._userService.getAll(
        this.keyword,
        this.isActive,
        lazyLoad ? lazyLoad?.first : this.table?.first,
        lazyLoad ? lazyLoad?.rows : this.table?.rows,
      ).pipe(
        finalize(() => {
          this.loading = false;
        })).subscribe((result) => {
        this.users = result.items;
        this.totalRecords = result.totalCount;
      });
  }

  protected delete(user: UserDto): void {
    abp.message.confirm(
      this.l('UserDeleteWarningMessage', user.fullName),
      undefined,
      (result: boolean) => {
        if (result) {
          this._userService.delete(user.id).subscribe(() => {
            abp.notify.success(this.l('SuccessfullyDeleted'));
            // this.refresh();
            this.getDataPage();
          });
        }
      }
    );
  }

  private showResetPasswordUserDialog(id?: number): void {
    this._modalService.show(ResetPasswordDialogComponent, {
      class: 'modal-lg',
      initialState: {
        id: id,
      },
    });
  }

  private showCreateOrEditUserDialog(id?: number): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateUserDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditUserDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      // this.refresh();
      this.getDataPage();
    });
  }
}

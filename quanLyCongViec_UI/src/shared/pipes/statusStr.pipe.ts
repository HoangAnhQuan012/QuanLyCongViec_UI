import { Injector, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statusStr'
})
export class StatusStr implements PipeTransform {

    constructor() {
    }

    transform(value: any): any {
        switch (value) {
          case 'Rejected':
            return 2;
          case 'Approved':
            return 1;
          case 'Wait for approval':
            return 0;
          default:
            break;
        }
      }
}

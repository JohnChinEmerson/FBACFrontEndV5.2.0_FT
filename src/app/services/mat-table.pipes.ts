import { Pipe, PipeTransform } from '@angular/core';
import { MatTableService } from 'src/app/services/mat-table.service';

@Pipe({ name: 'rowDisplay', pure: true })
export class RowDisplayPipe implements PipeTransform {
  constructor(private matTableService: MatTableService) {}
  transform(element: any, dc: string, type: string): any {
    return this.matTableService.getRowDisplayTransform(dc, type, element);
  }
}

@Pipe({ name: 'rowClasses', pure: true })
export class RowClassesPipe implements PipeTransform {
  constructor(private matTableService: MatTableService) {}
  transform(element: any, dc: string, type: string): any {
    return this.matTableService.getRowClasses(dc, type, element);
  }
}

@Pipe({ name: 'columnTotal', pure: true })
export class ColumnTotalPipe implements PipeTransform {
  constructor(private matTableService: MatTableService) {}
  transform(listData: any, dc: string): number {
    return this.matTableService.getTotal(dc, listData);
  }
}

@Pipe({ name: 'rowTotal', pure: true })
export class RowTotalPipe implements PipeTransform {
  transform(element: any, branches: any[]): number {
    let total = 0;
    branches.forEach(branch => {
      if (branch.BranchName.toLocaleLowerCase() != 'all') {
        total += +element[branch.BranchName] || 0;
      }
    });
    return total;
  }
}
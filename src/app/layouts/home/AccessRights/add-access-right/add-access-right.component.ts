import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { AccessRightsService } from 'src/app/services/User/access-rights.service';
import { AuthService } from 'src/app/services/auth.service';
import { ColumnTypeConfig, MatTableService } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-add-access-right',
  templateUrl: './add-access-right.component.html',
  styleUrls: ['./add-access-right.component.css']
})
export class AddAccessRightComponent implements OnInit {

  accessRights: any[];
  searchKey: string = "";
  recordStatus: string = "active";
  listData: MatTableDataSource<any>;
  defaultColumns: string[] = [
    'AccessRightName',
    'IsBuiltIn',
    'actions'
  ];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  branches                : any;
  BranchId                : string = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: any, // passing data here from update
    private dialog: MatDialog,
    private acService: AccessRightsService,
    private notif: NotificationService,
    private matTableService    : MatTableService,
    public auth              : AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.BranchId = this.updateData;
    // await this.GetBranches();
    this.FetchRecords();
    this.acService.requiredRefresh.subscribe(x=>{
      this.FetchRecords();
    })
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  private async FetchRecords() {
    this.accessRights = await firstValueFrom(this.acService.getCBOAccessRights(this.BranchId));
    this.DisplayRecords();
  }

  DisplayRecords() {
    var data = this.accessRights;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
  }
  clearSearch() {
    this.searchKey ="";
    this.applyFilter();
  }
  selectedStatus() {
    this.DisplayRecords();
  }
  onSubmit() {
    if(!this.searchKey)
      return this.notif.toastrWarning('Empty Field.');
    if(this.searchKey == '')
      return this.notif.toastrWarning('Empty Field.');

    var data:any= {
      'AccessRightName' : this.searchKey,
      'IsBuiltIn' : 'no',
    };
    this.acService.addAccessRight(data, this.BranchId).subscribe({
      next: (res)=>{
        this.notif.toastrSuccess(res.message);
        this.searchKey ="";
      },
      error: (res)=>{
        this.notif.toastrWarning(res.error.message);
      }
    })
  }
  onDelete(id: string, data) {
    if(data.IsBuiltIn == 'yes'){
      return this.notif.toastrWarning('Cant edit this record.');
    }
    
    this.notif.popupWarning("Delete Record","Are you sure to this record ?").then((result) => {
      if (result.value) {
        this.acService.deleteAccessRight(id).subscribe({
            next:(res)=>{
              this.notif.toastrSuccess(res.message);
            },
            error:(err)=>{
              this.notif.toastrError(err.error);
            },
        });
      }
    });
  }

}

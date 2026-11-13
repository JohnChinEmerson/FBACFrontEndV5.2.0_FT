import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { SubMenusService } from 'src/app/services/User/sub-menus.service';
import { SelectedSubMenuUIComponent } from '../selected-sub-menu-ui/selected-sub-menu-ui.component';
import { ColumnTypeConfig, MatTableService } from 'src/app/services/mat-table.service';

@Component({
  selector: 'app-sub-menus',
  templateUrl: './sub-menus.component.html',
  styleUrls: ['./sub-menus.component.css']
})
export class SubMenusComponent implements OnInit {

  subMenus: any[];
  searchKey: string = "";
  btnTxt : string= 'Save';
  btnTxt2: string= 'New';
  RecordStatus: string = "active";
  icon : string = 'add_circle';
  IsNew : boolean = false;
  listData: MatTableDataSource<any>;
  BranchId : any;
  defaultColumns: string[] = [
    'Order',
    'SubMenuName',
    'RouteName',
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

  subMenuForm = new FormGroup({
    id: new FormControl(''),
    MenuId : new FormControl(''),
    MenuName : new FormControl(''),
    SubMenu: new FormControl(''),
    RouteName: new FormControl(''),
  })
  errorMessage:string = "";
  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: any, // passing data here from update
    private dialog: MatDialog,
    private subMenuService: SubMenusService,
    private notif: NotificationService,
    private matTableService : MatTableService, 
  ) { }

  ngOnInit(): void {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    this.BranchId = this.updateData[1];
    this.FetchRecords();
    this.subMenuService.requiredRefresh.subscribe(x=>{
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
    this.subMenus = await firstValueFrom(this.subMenuService.getSubMenusByMenuId(this.updateData[0].id, this.BranchId));
    this.DisplayRecords();
  }

  DisplayRecords() {
    var data = this.subMenus.filter(x => x.RecordStatus === this.RecordStatus.toLowerCase());
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
  }
  clearSearch() {
    this.subMenuForm.reset();
    this.btnTxt = 'Save';
    this.applyFilter();
  }

  clearSearch2() {
    this.applyFilter();
  }

  selectedStatus() {
    this.DisplayRecords();
  }
  
  onCreate(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = (['', this.updateData[0], this.BranchId]);
    this.dialog.open(SelectedSubMenuUIComponent,dialogConfig);
  }

  setUpdate(data){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = ([data, this.updateData[0], this.BranchId]);
    this.dialog.open(SelectedSubMenuUIComponent,dialogConfig);
  }

  onDelete(id: string) {
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.subMenuService.deleteSubMenuById(id).subscribe({
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

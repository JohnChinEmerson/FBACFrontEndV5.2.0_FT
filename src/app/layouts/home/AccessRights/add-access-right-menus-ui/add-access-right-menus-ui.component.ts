import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AccessRightMenusService } from 'src/app/services/User/access-right-menus.service';
import { MenusService } from 'src/app/services/User/menus.service';

@Component({
  selector: 'app-add-access-right-menus-ui',
  templateUrl: './add-access-right-menus-ui.component.html',
  styleUrls: ['./add-access-right-menus-ui.component.css']
})
export class AddAccessRightMenusUIComponent implements OnInit {

  Menus: any [];
  accessMenus: any [];
  searchKey: string = "";
  recordStatus: string = "active";
  listData: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'select',
    'MenuName',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  errorMessage:string = "";
  branches                : any;
  BranchId                : string = "";
  pageSizeOptions     : number[] = [5, 10, 25, 100];
  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: any, // passing data here from update
    private dialog: MatDialog,
    private MenuService : MenusService,
    private acMenuService: AccessRightMenusService,
    private notif: NotificationService,
    private dialogRef: MatDialogRef<AddAccessRightMenusUIComponent>,
    private branch_service    : BranchesService,
    public auth              : AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.BranchId = this.updateData[1];
    this.LoadMenus();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }
  fMenus:any[] = [];
  private async LoadMenus(){
    this.Menus = await firstValueFrom(this.MenuService.getMenusNotByAccessRightId(this.updateData[0], this.BranchId));
    this.accessMenus = await firstValueFrom(this.acMenuService.getAccessRightMenusByAccessRightId(this.updateData[0], this.BranchId));
    this.DisplayRecords();
  }

  DisplayRecords() {
    this.listData = new MatTableDataSource(this.Menus);
  }

  onSubmit() {
    this.acMenuService.addAccessRightMenu(this.selection.selected, this.updateData[0],  this.updateData[1]).subscribe({
      next: (res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close();
      },
      error: (res)=>{
        this.notif.toastrWarning(res.error.message);
      }
    })
  }
  isAllSelected() {
    if(this.listData == undefined) return false;
    const numSelected = this.selection.selected.length;
    const numRows = this.listData.data.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.listData.data);
  }
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}

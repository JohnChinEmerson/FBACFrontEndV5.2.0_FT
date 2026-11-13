import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AccessRightSubMenusService } from 'src/app/services/User/access-right-sub-menus.service';
import { SubMenusService } from 'src/app/services/User/sub-menus.service';

@Component({
  selector: 'app-add-access-right-sub-menus-ui',
  templateUrl: './add-access-right-sub-menus-ui.component.html',
  styleUrls: ['./add-access-right-sub-menus-ui.component.css']
})
export class AddAccessRightSubMenusUIComponent implements OnInit {

  subMenus: any [];
  accessMenus: any [];
  searchKey: string = "";
  recordStatus: string = "active";
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'select',
    'SubMenuName',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selection = new SelectionModel<any>(true, []);
  errorMessage:string = "";
  BranchId : any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: any, // passing data here from update
    private dialog: MatDialog,
    private subMenuService: SubMenusService,
    private acSubMenuService: AccessRightSubMenusService,
    private notif: NotificationService,
    private dialogRef: MatDialogRef<AddAccessRightSubMenusUIComponent>
  ) { }

  ngOnInit(): void {
    this.BranchId = this.updateData[1];
    this.LoadMenus();
  }

  fsubMenus:any[] = [];
  accessSubMenus:any[];
  private async LoadMenus(){
    this.subMenus = await firstValueFrom(this.subMenuService.getSubMenusByMenuIdNotByAccessRightId(this.updateData[0].MenuId, this.updateData[0].AccessRightId, this.BranchId ));
    this.DisplayRecords();
  }
  DisplayRecords() {
    var data = this.subMenus;

    this.listData = new MatTableDataSource(data);
  }
  onSubmit() {
    this.acSubMenuService.addAccessRightSubMenu(this.selection.selected, this.updateData[0].AccessRightId, this.BranchId).subscribe({
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

import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { AccessRightSubMenuButtonsService } from 'src/app/services/User/access-right-sub-menu-buttons.service';
import { SubMenuButtonsService } from 'src/app/services/User/sub-menu-buttons.service';
import { SubMenuButtonsUIComponent } from '../sub-menu-buttons-ui/sub-menu-buttons-ui.component';
import { MatTableService } from 'src/app/services/mat-table.service';

@Component({
  selector: 'app-add-access-right-sub-menu-buttons-ui',
  templateUrl: './add-access-right-sub-menu-buttons-ui.component.html',
  styleUrls: ['./add-access-right-sub-menu-buttons-ui.component.css']
})
export class AddAccessRightSubMenuButtonsUIComponent implements OnInit {

  subMenuButtons: any [];
  accessMenus: any [];
  searchKey: string = "";
  recordStatus: string = "active";
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'select',
    'SubMenuButtonName',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
 toolButtons     = [
    {'Label'   : 'Set Buttons','Function'            : () => this.onClickButtons(),'Disabled': true,}, 
  ];
  selection = new SelectionModel<any>(true, []);
  errorMessage:string = "";
  BranchId : any;
  SubMenu: any;
  Menu: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public updateData: any, // passing data here from update
    private subMenuButtonService: SubMenuButtonsService,
    private acSubMenuButtonService: AccessRightSubMenuButtonsService,
    private notif: NotificationService,
    private dialogRef: MatDialogRef<AddAccessRightSubMenuButtonsUIComponent>,
    private dialog            : MatDialog,
    private matTableService : MatTableService, 
    
  ) { }

  ngOnInit(): void {
    console.log(this.updateData)
    this.SubMenu = {
      'id':this.updateData[0].SubMenuId,
      'SubMenuName':this.updateData[0].SubMenuName,
    };
    
    this.Menu = {
      'id':this.updateData[0].MenuId,
      'MenuName':this.updateData[0].MenuName,
    };
    this.BranchId = this.updateData[1];
    this.LoadMenus();
  }

  fsubMenus:any[] = [];
  accessSubMenus:any[];
  private async LoadMenus(){
    this.subMenuButtons = await firstValueFrom(this.subMenuButtonService.getSubMenuButtonsBySubMenuIdNotByAccessRightId(this.updateData[0].SubMenuId, this.updateData[0].AccessRightId, this.BranchId ));
    this.DisplayRecords();
  }
  DisplayRecords() {
    var data = this.subMenuButtons;

    this.listData = new MatTableDataSource(data);
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  onSubmit() {
    this.acSubMenuButtonService.addAccessRightSubMenuButton(this.selection.selected, this.updateData[0].AccessRightId, this.BranchId).subscribe({
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

  onClickButtons() {
      const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '600px';
      dialogConfig.data         = ([this.SubMenu, this.Menu, this.BranchId]);
      this.dialog.open(SubMenuButtonsUIComponent,dialogConfig).beforeClosed().subscribe(x =>{
        this.LoadMenus();
      });
  }

}

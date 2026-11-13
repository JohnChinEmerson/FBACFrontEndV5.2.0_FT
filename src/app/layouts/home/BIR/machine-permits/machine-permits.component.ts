import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SelectedMachinePermitComponent } from '../selected-machine-permit/selected-machine-permit.component';
import { HomeComponent } from '../../home.component';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';
import { PrintService } from 'src/app/services/print.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-machine-permits',
  templateUrl: './machine-permits.component.html',
  styleUrls: ['./machine-permits.component.css']
})
export class MachinePermitsComponent implements OnInit {
  MachinePermits    : any[];
  selectedData      : any;
  searchKey         : string = "";
  selectedId        : number = 0;
  pageSizeOptions   :any = this.matTableService.pageSizeOptions();
  listData          : MatTableDataSource<any>;
  isLoading         : boolean = false;
  branches          : any = [];
  BranchId          : string = "";

  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'New','Function'             : () => this.onClickNew(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'           : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  contextButtons  =  [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Delete','Function'          : () => this.onClickDelete(),'Disabled': true,}, 
  ];
  defaultColumns  = ['PermitNo','RDOCode','DateIssued','ExpiryDate','ComputerName','SerialNo', 'MachineNo','PSINo', 'SILastNo', 'PSRNo', 'SRNo', 'SRLastNo'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['DateIssued','ExpiryDate']
  };
  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog          : MatDialog,
    private mp_service    : MachinePermitsService,
    private notif           : NotificationService,
    public auth           : AuthService,
    private branch_service    : BranchesService,
    private homeTs              : HomeComponent,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService : PrintService,
    private router  : Router,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.getBranches();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.mp_service.requiredRefresh.subscribe(()=>{
      this.onClickView();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }

  async getBranches(){
    this.branches = await firstValueFrom(this.branch_service.getBranchesCBO());
    var data:any = {
      BranchId : "",
      BranchName : 'NA'
    };
    this.branches.push(data);
    this.BranchId = (this.auth.Branch) ? this.auth.Branch.BranchId: "";
  }

  async onClickView(){
    this.isLoading = true;
    this.MachinePermits = await firstValueFrom(this.mp_service.getMachinePermitsToDisplay(this.BranchId ));
    if(this.MachinePermits)
      this.isLoading = false;
    this.displayRecords();
  }

  applyFilter(){
    this.matTableService.applyFilter(this.listData, this.searchKey);
  }

  clearSearch(){
    this.searchKey =  this.matTableService.clearSearch(this.listData);
  }

  getRecord(data : any){
    this.selectedId = data.id;
    this.selectedData = data;
  }

  displayRecords(){
    var data      = this.MachinePermits;
    this.listData = new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
  }

  onClickNew(){
     if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    this.dialog.open(SelectedMachinePermitComponent,dialogConfig);
  }

  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var machinePermit:any = await firstValueFrom(this.mp_service.getMachinePermitById(this.selectedData.id));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data        = machinePermit;
    this.dialog.open(SelectedMachinePermitComponent,dialogConfig);
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.mp_service.deleteMachinePermitById(this.selectedId).subscribe({
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
  onClickPrint(){
    var url = this.router.serializeUrl(
      this.router.createUrlTree(['print/printmachinepermits'])
    );
    var data:any = this.listData.filteredData;
    this.printService.popupWindow(url, 'MachinePermits', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', 'MACHINE PERMITS');
  }

  onContextMenu(event: MouseEvent, data: any) {
    this.getRecord(data);
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'data': data };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

}

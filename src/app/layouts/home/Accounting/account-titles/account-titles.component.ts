import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AccountTitlesService } from 'src/app/services/Accounting/account-titles.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { _url } from 'src/global-variables';
import { BarcodeItemsUIComponent } from '../../Files/barcode-items-ui/barcode-items-ui.component';
import { ItemPriceCategorysUIComponent } from '../../Files/item-price-categorys-ui/item-price-categorys-ui.component';
import { ItemUIComponent } from '../../Files/item-ui/item-ui.component';
import { HomeComponent } from '../../home.component';
import { AccountTitleUIComponent } from '../account-title-ui/account-title-ui.component';

@Component({
  selector: 'app-account-titles',
  templateUrl: './account-titles.component.html',
  styleUrls: ['./account-titles.component.css']
})
export class AccountTitlesComponent implements OnInit {
  accountTitles           : any[];
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  photoUrl        : string = _url+"img/accountTitles/";

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
  defaultColumns  = ['AccountCode','AccountTitle','AccountType', 'NormalColumn', 'IsBuiltIn'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  constructor(
    private dialog              : MatDialog,
    private accountTitlesService        : AccountTitlesService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    public matTableService     : MatTableService,
    private printService        : PrintService,
    private router              : Router,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.contextButtons, this.toolButtons, null, null);
    this.accountTitlesService.requiredRefresh.subscribe(()=>{
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


  async onClickView(){
    this.isLoading = true;
    this.accountTitles = await firstValueFrom(this.accountTitlesService.getAccountTitles());
    if(this.accountTitles)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.accountTitles;
    this.listData =  new MatTableDataSource(data);
    this.listData.paginator = this.paginator;
    this.listData.sort = this.sort;
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

  onClickNew(){
   if (!this.matTableService.CommonTransaction()) {
      return;
    }
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = (['',this.accountTitles]);
    this.dialog.open(AccountTitleUIComponent,dialogConfig).beforeClosed().subscribe(accountTitles => {
      this.accountTitles = accountTitles; 
      this.selectedId  = null;
      this.selectedData = null;
      this.displayRecords();
    });

  }

  async onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var isBuiltIn = this.selectedData.IsBuiltIn;
    if (isBuiltIn.toLowerCase() == "yes")
    {
      return this.notificationService.toastrWarning("Built-in AccountTitles cannot be Edited.");
    }

    var data:any = await firstValueFrom(this.accountTitlesService.getAccountTitleById(this.selectedData.id));
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([data,this.accountTitles]);
    this.dialog.open(AccountTitleUIComponent,dialogConfig).beforeClosed().subscribe(x => {
        if(x){
          this.populateChanges(x);
        }
      });
  }

  onClickDelete(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    var isBuiltIn = this.selectedData.IsBuiltIn;
    if (isBuiltIn.toLowerCase() == "yes")
    {
      return this.notificationService.toastrWarning("Built-in AccountTitles cannot be deleted.");
    }

    this.notificationService.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.accountTitlesService.deleteAccountTitle(this.selectedData.id).subscribe({
            next:(res)=>{
              this.notificationService.toastrSuccess(res.message);
              this.accountTitles = this.accountTitles.filter(x => x.id != this.selectedData.id);
              this.selectedId  = null;
              this.selectedData = null;
              this.displayRecords();
            },
            error:(err)=>{
              this.notificationService.toastrError(err.error);
            },
        });
      }
    });
  }

  populateChanges(accountTitle){
    this.selectedId  = null;
    this.selectedData = null;
    const accountTitleIndex = this.accountTitles.findIndex(detail => detail.id === accountTitle.id);
    if (accountTitleIndex !== -1) {
      this.accountTitles[accountTitleIndex] = accountTitle;  
    }
    this.displayRecords();
  }


  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printaccounttitles']));
    var data  = this.listData.filteredData;
    this.printService.popupWindow(url, 'printaccounttitles', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', 'LIST OF ACCOUNT TITLES');
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

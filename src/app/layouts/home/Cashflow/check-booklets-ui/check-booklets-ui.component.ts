import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CheckBookletsService } from 'src/app/services/Cashflow/check-booklets.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { CheckBookletUIComponent } from '../check-booklet-ui/check-booklet-ui.component';

@Component({
  selector: 'app-check-booklets-ui',
  templateUrl: './check-booklets-ui.component.html',
  styleUrls: ['./check-booklets-ui.component.css']
})
export class CheckBookletsUIComponent implements OnInit {
    checkBooklets: any=[];
    bankAccount:any=[];
    branchId :any;
    selectedData    : any;
    selectedId      : number = 0;
    searchKey       : string = "";
    listData        : MatTableDataSource<any>;
    pageSizeOptions :any = this.matTableService.pageSizeOptions();
    isLoading       : boolean = false;
    @ViewChild(MatSort) sort              : MatSort;
    @ViewChild(MatPaginator) paginator    : MatPaginator;  
    @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
   
    
    contextMenuPosition = { x: '0px', y: '0px' };
    toolButtons     = [
      {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
      {'Label'   : 'New','Function'            : () => this.onClickNew(),'Disabled': true,}, 
    ];
    contextButtons     = [
      {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
      {'Label'   : 'Delete','Function'            : () => this.onClickDelete(),'Disabled': true,}, 
    ];
    defaultColumns  = ['Prefix', 'StartNo', 'Issued', 'EndNo'];
    columnConfig: ColumnTypeConfig = {
      decimalColumns: [],
      intColumns: [],
      dateTimeColumns: [],
      dateColumns: []
    };

    columnTypeMap: { [key: string]: string } = {};
    constructor(
      private checkBookletsService : CheckBookletsService,
      private toolBoxService : ToolBoxService,
      private notificationService : NotificationService,
      public matTableService     : MatTableService,
      private printService        : PrintService,
      private router              : Router,
      private dialog              : MatDialog,
      private dialogRef              : MatDialogRef<CheckBookletsUIComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
      
    ) { }
  
    async ngOnInit(): Promise<void> {
      this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
      this.bankAccount =this.data[0];
      this.branchId =this.data[1];
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
      this.checkBooklets = await firstValueFrom(this.checkBookletsService.getCheckBookletsByCashAccount(this.bankAccount.CashAccount, this.branchId));
      if(this.checkBooklets)
        this.isLoading = false;
      this.displayRecords();
    }
    displayRecords() {
      var data= this.checkBooklets;
      this.listData = new MatTableDataSource(data);
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
      dialogConfig.data        = (['',this.checkBooklets, this.bankAccount, this.branchId]);
      this.dialog.open(CheckBookletUIComponent,dialogConfig).beforeClosed().subscribe(x=>{
        if(x){
          this.checkBooklets = x;
          this.displayRecords();
        }
      });
    }
  
  
  
    async onClickEdit(){
       if (!this.matTableService.checkNull(this.selectedId)) return;
      
        var checkBooklet:any = await firstValueFrom(this.checkBookletsService.getCheckBookletsById(this.selectedData.id));
        const dialogConfig        = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus    = true;
        dialogConfig.width        = '600px';
        dialogConfig.data        = checkBooklet;
        dialogConfig.data        = ([checkBooklet,this.checkBooklets, this.bankAccount, this.branchId]);
        this.dialog.open(CheckBookletUIComponent,dialogConfig).beforeClosed().subscribe(checkBooklet=>{
          if(checkBooklet){
  
          //update checkBookletsDisplay
          const checkBookletIndex = this.checkBooklets.findIndex(ca => ca.id === checkBooklet.id);
          if (checkBookletIndex !== -1) {
            this.checkBooklets[checkBookletIndex] = checkBooklet;  
          }
          this.displayRecords();
          }
        });
    }
  
    onClickDelete(){
      if (!this.matTableService.checkNull(this.selectedId)) return;

      var prefix = this.selectedData.Prefix;
      var startNo = this.selectedData.StartNo;
      var endNo = this.selectedData.EndNo;
      var series = prefix + startNo.toString() + "-" + prefix + endNo.toString();
      var msg = "Series  "+ series  + " will be DELETED. Continue?";

      this.notificationService.popupWarning("Delete Record",msg).then((result) => {
        if (result.value) {
          this.checkBookletsService.deleteCheckBooklet(this.selectedData.id, this.branchId).subscribe({
              next:(res)=>{
                this.notificationService.toastrSuccess(res.message);
                this.checkBooklets = this.checkBooklets.filter(x => x.id != this.selectedData.id);
                this.displayRecords();
              },
              error:(err)=>{
                this.notificationService.toastrError(err.error);
              },
          });
        }
      });
    }
  
    // onClickCheckBooklets(){
    //   const dialogConfig        = new MatDialogConfig();
    //   dialogConfig.disableClose = true;
    //   dialogConfig.autoFocus    = true;
    //   dialogConfig.width        = '600px';
    //   this.dialog.open(CheckBookletsUIComponent,dialogConfig);
    // }

    onClose(){
    this.dialogRef.close();
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

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ReceivableDuesService } from 'src/app/services/Receivables/receivable-dues.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { ReceivableStatementsService } from 'src/app/services/Receivables/receivable-statements.service';

@Component({
  selector: 'app-receivable-dues',
  templateUrl: './receivable-dues.component.html',
  styleUrls: ['./receivable-dues.component.css']
})
export class ReceivableDuesComponent implements OnInit {

  receivableDues : any=[];
  targets:any =['Date Range', 'This Month', 'Last 1-30 Days', 'Last 30-60 Days', 'Last 60-90 Days', 'Last 90-120 Days', 'Over 120 Days', 'Bad Debt'];
  target:string = 'Date Range';
   selectedData    : any;
   selectedId      : number = 0;
   searchKey       : string = "";
   btnText       : string = "Bad Debt";
   listData        : MatTableDataSource<any>;
   pageSizeOptions :any = this.matTableService.pageSizeOptions();
   isLoading       : boolean = false;
   dateFrom        : any = new Date();
   dateTo          : any = new Date();
   dtDateFromEnabled : boolean = false;
   dtDateToEnabled : boolean = false;
   @ViewChild(MatSort) sort              : MatSort;
   @ViewChild(MatPaginator) paginator    : MatPaginator;  
   @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
 
   contextMenuPosition = { x: '0px', y: '0px' };
   toolButtons     = [
     {'Label'   : 'View','Function'                : () => this.onClickView(),'Disabled': true,}, 
     {'Label'   : 'Print','Function'               : () => this.onClickPrint(),'Disabled': true,}, 
   ];  

   contextButtons     = [
     {'Label'   : 'Bad/Good Debt','Function'                : () => this.onClickBadDebt(),'Disabled': true,}, 
   ];
   defaultColumns    = ['CustomerName', 'ContactNo', 'Address','SourceTransNo','TransDate', 'DueDate','TotalDue', 'AmountPaid', 'Balance'];
   columnConfig: ColumnTypeConfig = {
    decimalColumns: ['TotalDue', 'AmountPaid', 'Balance'],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: ['TransDate', 'DueDate']
  };
  columnTypeMap: { [key: string]: string } = {};
   constructor(
     private dialog              : MatDialog,
     private receivableDuesService        : ReceivableDuesService,
     private receivableStatementsService        : ReceivableStatementsService,
     private toolBoxService      : ToolBoxService,
     private dateTimesService      : DateTimesService,
     public matTableService     : MatTableService,
     private printService        : PrintService,
     private router              : Router,
     private homeTs              : HomeComponent,
     private notificationService : NotificationService,
   ) { }
 
   async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
     await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.toolButtons, this.contextButtons, null, null);
     this.onChangeTarget('Date Range');
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
     this.receivableDues = await firstValueFrom(this.receivableDuesService.getReceivableDuesByDateFromByDateToByTarget(
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
       this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
       this.target,
     ));
     if(this.receivableDues)
       this.isLoading = false;
     this.displayRecords();
   }
 
   displayRecords(){
     var data = this.receivableDues;
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
     this.selectedId = data.SourceTransNo;
     this.selectedData = data;
   }

   getTotal(column){
    let sum = 0;
      this.listData?.filteredData.forEach(x => {
        sum += +x[column];
      });
     return sum;
   }
  ToggleDate(value)
   {
       this.dtDateFromEnabled = value;
       this.dtDateToEnabled = value;
   }

   onChangeTarget(target)
   {
    if(target.toLowerCase() == 'bad debt')
        this.btnText = 'Good Debt';
      var currentDate = new Date();
       this.ToggleDate(target == "Date Range" || target == "Bad Debt" || target == "Over 120 Days");
       switch (target)
       { 
           case "Date Range":
              this.dateFrom = new Date(currentDate);
              this.dateTo = new Date(currentDate);
              this.dateTo.setDate(this.dateTo.getDate() + 7);
              break;
           case "This Month":
              this.dateFrom = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
              this.dateTo = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
              break;
           case "Last 1-30 Days":
              this.dateFrom = new Date(currentDate);
              this.dateFrom.setDate(this.dateFrom.getDate() - 30);
              this.dateTo = new Date(currentDate);
              break;
           case "Last 30-60 Days":
              this.dateFrom = new Date(currentDate);
              this.dateFrom.setDate(this.dateFrom.getDate() - 60);
              this.dateTo = new Date(currentDate);
              this.dateTo.setDate(this.dateTo.getDate() - 31);
              break;
           case "Last 60-90 Days":
              this.dateFrom = new Date(currentDate);
              this.dateFrom.setDate(this.dateFrom.getDate() - 90);
              this.dateTo = new Date(currentDate);
              this.dateTo.setDate(this.dateTo.getDate() - 61);
              break;
           case "Last 90-120 Days":
              this.dateFrom = new Date(currentDate);
              this.dateFrom.setDate(this.dateFrom.getDate() - 120);
              this.dateTo = new Date(currentDate);
              this.dateTo.setDate(this.dateTo.getDate() - 91);
              break;
           case "Over 120 Days":
              this.dateFrom = new Date(currentDate);
              this.dateFrom.setDate(this.dateFrom.getDate() - 240);
              this.dateTo = new Date(currentDate);
              this.dateTo.setDate(this.dateTo.getDate() - 121);
              this.dtDateToEnabled = false; 
              break;
           default:
            this.dateFrom = new Date(currentDate);
            this.dateFrom.setDate(this.dateFrom.getDate() - 360);
            this.dateTo = new Date(currentDate);
            this.dateTo.setDate(this.dateTo.getDate() - 121);
            break;
       }
   }


   onClickBadDebt(){
    if(!this.matTableService.checkNull(this.selectedId)) return;

    var value = this.btnText == "Bad Debt" ? "yes" : "no";
    this.notificationService.popupWarning(this.btnText.toUpperCase()+" Record","Record " + this.selectedId + " will be marked as "+this.btnText.toUpperCase()+". Continue?").then(async (result) => {
      if (result.value) {
         this.receivableStatementsService.updateBadDebt(this.selectedData.SourceTransNo,this.selectedData.TableName , value).subscribe({
           next:(res)=>{
             this.notificationService.toastrSuccess(res.message);
             this.onClickView();
           },
           error:(err)=>{
             this.notificationService.toastrError(err.error);
           },
         });
      }
    });
   }

    onClickPrint(){
      var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printreceivabledues']));
      var data  = this.listData.filteredData;
      var title = 'RECEIVABLES DUES FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)) +' ('+this.target+')' ;
      if(this.target.toLocaleLowerCase() == 'date range')
         title = 'RECEIVABLES DUES FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      if(this.target.toLocaleLowerCase() == 'bad debt')
         title = this.target+' FROM ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)) + ' TO ' + this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo))  ;
      this.printService.popupWindow(url, 'printreceivabledues', window, 800, 800);

      localStorage.setItem('HasPrintReceivableDues', 'no');
      localStorage.setItem('ReceivableDues', JSON.stringify(data));
      localStorage.setItem('Data2', JSON.stringify(data));
      localStorage.setItem('Title', title);
      localStorage.setItem('Title2', title);
      localStorage.setItem('Type2', 'Title');

    }
   
   onContextMenu(event: MouseEvent, data: any) {
     if(this.contextButtons.length > 0){
       this.getRecord(data);
       event.preventDefault();
       this.contextMenuPosition.x = event.clientX + 'px';
       this.contextMenuPosition.y = event.clientY + 'px';
       this.contextMenu.menuData = { 'data': data };
       this.contextMenu.menu.focusFirstItem('mouse');
       this.contextMenu.openMenu();
     }
   }

}

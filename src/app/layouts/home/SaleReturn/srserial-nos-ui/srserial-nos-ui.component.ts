import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { SerialNosService } from 'src/app/services/Inventory/serial-nos.service';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaleReturnTransactionService } from 'src/app/services/SaleReturn/sale-return-transaction.service';
import { SRSerialNosService } from 'src/app/services/SaleReturn/srserial-nos.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-srserial-nos-ui',
  templateUrl: './srserial-nos-ui.component.html',
  styleUrls: ['./srserial-nos-ui.component.css']
})
export class SRSerialNosUIComponent implements OnInit {

  sRDetail         : any=[];
  sRDetailSerialNo : any=[];
  ui              : string;
  loading         : boolean = false;
  type            : string; 
  serialNos       : any;
  fserialNos      : any;
  sRSerialNos   : any=[];
  displayed       : boolean = false;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  listData        : MatTableDataSource<any>;
  pageSizeOptions : any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  btnText : string = 'Add';
  contextMenuPosition = { x: '0px', y: '0px' };
  toolButtons     = [
    {'Label'   : this.btnText,'Function'  : () => this.onClickAdd(),'Disabled': true,}, 
  ];  
  contextButtons  =  [
    {'Label'   : 'Delete','Function'          : () => this.onClickDelete(),'Disabled': true,}, 
  ];
  defaultColumns  = ['SerialNo','Reason'];
  columnConfig: ColumnTypeConfig = {
    decimalColumns: [],
    intColumns: [],
    dateTimeColumns: [],
    dateColumns: []
  };

  columnTypeMap: { [key: string]: string } = {};
  displaySerialNos = (value: string): string => value || '';
  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<SRSerialNosUIComponent>,
    private saleReturnTransactionService     : SaleReturnTransactionService,
    private serialNosService            : SerialNosService,
    private sRSerialNosService        : SRSerialNosService,
    private notif                       : NotificationService,
    public matTableService : MatTableService, 
    private dateTimesService : DateTimesService, 
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  async ngOnInit(): Promise<void> {
    this.columnTypeMap = this.buildColumnTypeMap(this.defaultColumns);
     await this.homeTs.getButtons();
     this.toolBoxService.disableButtons(this.toolButtons,null, this.contextButtons, null);
    if (this.data) {
      this.sRDetail = this.data[0];
      this.ui = this.data[1];
      this.sRDetailSerialNo = this.data[2];
    }

    await this.getSRSerialNos();
    this.loadSerialNosByTransDetailIdByTransName();
    this.sRSerialNosService.requiredRefresh.subscribe(()=>{
      this.getSRSerialNos();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }
  async getSRSerialNos(){
    this.loading = true;
    this.sRSerialNos = await firstValueFrom(this.sRSerialNosService.getSRSerialNosBySRDetailId(this.sRDetail.id)) ;
    if(this.sRSerialNos)
      this.loading = false;
    this.displayRecords();
    
    
    this.displayed = true;
  }

  async loadSerialNosByTransDetailIdByTransName(){
    this.serialNos = await firstValueFrom(this.serialNosService.loadSerialNosByTransDetailIdByTransName(this.sRDetail.SaleDetailId, 'sales'));
  }

  displayRecords(){
    var data = this.sRSerialNos;
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

  onClickEdit(){
    if (!this.matTableService.checkNull(this.selectedId)) return;

    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data         = ([this.sRDetail, 'salestransaction', this.selectedData]);
    this.dialog.open(SRSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.getSRSerialNos();
    });
  }
  onClickDelete(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.sRSerialNosService.deleteSRSerialNo(this.selectedId).subscribe({
            next:(res)=>{
              this.notif.toastrSuccess(res.message);
              this.loadSerialNosByTransDetailIdByTransName();
            },
            error:(err)=>{
              this.notif.toastrError(err.error);
            },
        });
      }
    });
  }
 
  async onClickAdd(){
    if (!this.searchKey || this.searchKey == "" ) 
      return this.notif.toastrWarning("No Record Selected.");
    if(this.btnText.toLowerCase() == 'add'){
       var s:any = await firstValueFrom(this.serialNosService.getSerialNosByItemIdBySerialNoByTransDetailIdByTransName(this.sRDetail.ItemId, this.searchKey, this.sRDetail.SaleDetailId, 'sales')); 
        if(s == null){
          this.notif.toastrWarning("SerialNo Not Found");
        }else{
             var data:any = {
                'sRDetail' : this.sRDetail, 
                'sId'     : s.id, 
                'serialNo' : this.searchKey, 
              };
              this.sRSerialNosService.saveSRSerialNos(data).subscribe({
                next:(res)=>{
                  this.notif.toastrSuccess(res.message);
                  this.loadSerialNosByTransDetailIdByTransName();
                  this.resetForm();
                },
                error:(err)=> {
                  this.notif.toastrError(err.error.message);
                },
              });
        }
    }
    else{
      var data:any = {
          'sRDetail' : this.sRDetail, 
          'sId'     : this.sRDetailSerialNo.id, 
          'serialNo' : this.searchKey, 
        };
        this.sRSerialNosService.saveSRSerialNos(data).subscribe({
          next:(res)=>{
            this.notif.toastrSuccess(res.message);
            this.dialogRef.close(this.sRDetail);
          },
          error:(err)=> {
            this.notif.toastrError(err.error.message);
          },
        });
    }
   
  }

  checkQty(){
    if(this.btnText.toLowerCase() == 'add'){
      //  setTimeout(() => {
            if (this.sRSerialNos.length == this.sRDetail.Qty){
                this.notif.toastrInfo("SerialNo Count is Equal to Qty.");
                this.dialogRef.close(this.sRDetail);
            }else{
                this.notif.popupWarning("SerialNo Count Is Not Equal To SaleReturnQty","Adjust SaleReturnQty?").then((result) => {
                  if (result.value) {
                        var newQty = +this.sRSerialNos.length;
                        this.sRDetail.Qty = +this.sRSerialNos.length;
                          this.saleReturnTransactionService.updateElementSaleReturnDetail(this.sRDetail.id, 'Qty', newQty).subscribe({
                          next: (res) => {
                            this.notif.toastrSuccess(res.message);
                            this.dialogRef.close(this.sRDetail);
                          },
                          error: (err) => {
                            this.notif.toastrError(err.error.message);
                          }
                        });
                  }else{
                    this.dialogRef.close(this.sRDetail);
                  }
                });
            }
      // }, 2000);
    }
  }

  resetForm(){
    this.searchKey = '';
  }

  onClose(){
     if(this.sRSerialNos.length > 0)
      this.checkQty();
    else
      this.dialogRef.close(this.sRDetail);
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

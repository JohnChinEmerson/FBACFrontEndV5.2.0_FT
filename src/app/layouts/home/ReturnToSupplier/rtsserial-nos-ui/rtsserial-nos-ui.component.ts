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
import { ReturnToSupplierTransactionService } from 'src/app/services/ReturnToSupplier/return-to-supplier-transaction.service';
import { RTSSerialNosService } from 'src/app/services/ReturnToSupplier/rtsserial-nos.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

@Component({
  selector: 'app-rtsserial-nos-ui',
  templateUrl: './rtsserial-nos-ui.component.html',
  styleUrls: ['./rtsserial-nos-ui.component.css']
})
export class RTSSerialNosUIComponent implements OnInit {

  rTSDetail         : any=[];
  rTSDetailSerialNo : any=[];
  ui              : string;
  loading         : boolean = false;
  type            : string; 
  serialNos       : any;
  fserialNos      : any;
  rTSSerialNos   : any=[];
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
  defaultColumns  = ['SerialNo','RTSReason'];
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
    private dialogRef                   : MatDialogRef<RTSSerialNosUIComponent>,
    private returnToSupplierTransactionService     : ReturnToSupplierTransactionService,
    private serialNosService            : SerialNosService,
    private rTSSerialNosService        : RTSSerialNosService,
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
      this.rTSDetail = this.data[0];
      this.ui = this.data[1];
      this.rTSDetailSerialNo = this.data[2];
    }

    await this.getRTSSerialNos();
    this.loadSerialNosByTransDetailIdByTransName();
    this.rTSSerialNosService.requiredRefresh.subscribe(()=>{
      this.getRTSSerialNos();
    });
  }

  private buildColumnTypeMap(columns: string[]): { [key: string]: string } {
    const map: { [key: string]: string } = {};
    for (const col of columns) {
      map[col] = this.matTableService.getColumnType(col, this.columnConfig);
    }
    return map;
  }


  async getRTSSerialNos(){
    this.loading = true;
    this.rTSSerialNos = await firstValueFrom(this.rTSSerialNosService.getRTSSerialNosByRTSDetailId(this.rTSDetail.id)) ;
    if(this.rTSSerialNos)
      this.loading = false;
    this.displayRecords();
    
    
    this.displayed = true;
  }

  async loadSerialNosByTransDetailIdByTransName(){
    this.serialNos = await firstValueFrom(this.serialNosService.loadSerialNosByTransDetailIdByTransName(this.rTSDetail.RRDetailId, 'receiving'));
  }

  displayRecords(){
    var data = this.rTSSerialNos;
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
    dialogConfig.data         = ([this.rTSDetail, 'receivingtransaction', this.selectedData]);
    this.dialog.open(RTSSerialNosUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      this.getRTSSerialNos();
    });
  }
  onClickDelete(){
     if (!this.matTableService.checkNull(this.selectedId)) return;
    this.notif.popupWarning("Delete Record","Are you sure to delete this record?").then((result) => {
      if (result.value) {
        this.rTSSerialNosService.deleteRTSSerialNo(this.selectedId).subscribe({
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
       var s:any = await firstValueFrom(this.serialNosService.getSerialNosByItemIdBySerialNoByTransDetailIdByTransName(this.rTSDetail.ItemId, this.searchKey, this.rTSDetail.RRDetailId, 'receiving')); 
        if(s == null){
          this.notif.toastrWarning("SerialNo Not Found");
        }else{
             var data:any = {
                'rTSDetail' : this.rTSDetail, 
                'sId'     : s.id, 
                'serialNo' : this.searchKey, 
              };
              this.rTSSerialNosService.saveRTSSerialNos(data).subscribe({
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
          'rTSDetail' : this.rTSDetail, 
          'sId'     : this.rTSDetailSerialNo.id, 
          'serialNo' : this.searchKey, 
        };
        this.rTSSerialNosService.saveRTSSerialNos(data).subscribe({
          next:(res)=>{
            this.notif.toastrSuccess(res.message);
            this.dialogRef.close(this.rTSDetail);
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
            if (this.rTSSerialNos.length == this.rTSDetail.Qty){
                this.notif.toastrInfo("SerialNo Count is Equal to Qty.");
                this.dialogRef.close(this.rTSDetail);
            }else{
                this.notif.popupWarning("SerialNo Count Is Not Equal To RTSQty","Adjust RTSQty?").then((result) => {
                  if (result.value) {
                        var newQty = +this.rTSSerialNos.length;
                        this.rTSDetail.Qty = +this.rTSSerialNos.length;
                          this.returnToSupplierTransactionService.updateElementReturnToSupplierDetail(this.rTSDetail.id, 'Qty', newQty).subscribe({
                          next: (res) => {
                            this.notif.toastrSuccess(res.message);
                            this.dialogRef.close(this.rTSDetail);
                          },
                          error: (err) => {
                            this.notif.toastrError(err.error.message);
                          }
                        });
                  }else{
                    this.dialogRef.close(this.rTSDetail);
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
     if(this.rTSSerialNos.length > 0)
      this.checkQty();
    else
      this.dialogRef.close(this.rTSDetail);
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

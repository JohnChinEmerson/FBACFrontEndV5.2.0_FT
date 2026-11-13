import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MatTableService, ColumnTypeConfig  } from 'src/app/services/mat-table.service';
import { MultiplePaymentHeadersService } from 'src/app/services/MultiplePayments/multiple-payment-headers.service';
import { MultiplePaymentUIComponent } from '../multiple-payment-ui/multiple-payment-ui.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-multiple-payment-details-ui',
  templateUrl: './multiple-payment-details-ui.component.html',
  styleUrls: ['./multiple-payment-details-ui.component.css']
})
export class MultiplePaymentDetailsUIComponent implements OnInit {
  sHeader : any;
  payments : any;
  listData        : MatTableDataSource<any>;
  pageSizeOptions :any = this.matTableService.pageSizeOptions();
  isLoading       : boolean = false;
  selectedData    : any;
  selectedId      : number = 0;
  searchKey       : string = "";
  @ViewChild(MatSort) sort              : MatSort;
  @ViewChild(MatPaginator) paginator    : MatPaginator;  
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };
  contextButtons      = [
    {'Label'   : 'Edit','Function'            : () => this.onClickEdit(),'Disabled': true,}, 
    {'Label'   : 'Void/Open','Function'       : () => this.onClickVoid(),'Disabled': true,}, 
  ];
  numberColumns       = ['AmountPaid'];
  defaultColumns       = ['PaymentType', 'DepositTo', 'ReferenceNo', 'CheckNo', 'CheckDate', 'BankName'];
  mergeColumns        = this.numberColumns.concat( this.defaultColumns);
  constructor(
    private dialog : MatDialog,
    private dialogRef : MatDialogRef<MultiplePaymentDetailsUIComponent>,
    private multiplePaymentHeadersService : MultiplePaymentHeadersService,
    public matTableService     : MatTableService,
    private notificationService : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update
  ) { }

  ngOnInit(): void {
    this.sHeader = this.data;
    this.onClickView();
  }

  async onClickView(){
    this.isLoading = true;
    this.payments = await firstValueFrom(this.multiplePaymentHeadersService.getMultiplePaymentsBySourceTransCode(this.sHeader.TransCode));
    if(this.payments)
      this.isLoading = false;
    this.displayRecords();
  }

  displayRecords(){
    var data = this.payments;
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

    this.dialogRef.close();
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '600px';
    dialogConfig.data = ([this.sHeader, 'multiplepaymentdetails', 'Update', this.selectedData, 'Save']);
    this.dialog.open(MultiplePaymentUIComponent,dialogConfig).beforeClosed().subscribe(x => {
      if(x){
        this.onClickView();
      }
    });
  }

  onClickVoid(){
    if(!this.matTableService.checkNull(this.selectedId)) return;
    var action = (this.selectedData?.RecordStatus == 'open' || this.selectedData?.RecordStatus == 'pending') ? 'void' : 'open';
        this.notificationService.popupWarning(action.toUpperCase()+" Record","All Items  under " + this.selectedData.SourceTransCode + " will be " + action.toUpperCase () + ". Continue?").then(async (result) => {
          if (result.value) {
            this.multiplePaymentHeadersService.updateMultiplePaymentHeaderRecordStatus(this.selectedId, action).subscribe({
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

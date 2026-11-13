import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { StockAdjustmentDetailsService } from 'src/app/services/StockAdjustments/stock-adjustment-details.service';
import { ItemExpiryDatesUIComponent } from '../../Inventory/item-expiry-dates-ui/item-expiry-dates-ui.component';
import { firstValueFrom } from 'rxjs';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';

@Component({
  selector: 'app-stock-adjustment-detail-ui',
  templateUrl: './stock-adjustment-detail-ui.component.html',
  styleUrls: ['./stock-adjustment-detail-ui.component.css']
})
export class StockAdjustmentDetailUIComponent implements OnInit {
  @ViewChild('qtyInput') qtyInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  stockAdjustmentDetail: any=[];
  priceTypes: any=['price','cost', 'avecost'];
  priceType:string = 'price';
  expiryDates: any=[];
  stock:any=[];
  action:string;
  adjustmentType:string;
  chkExpiry:boolean = false;
  unitMeasures                   : any=[];
  UM : string;
  multipleUM : any;
  stockAdjustmentDetailForm = new FormGroup({
      id            : new FormControl(''),
      TransNo       : new FormControl(''),
      TransCode     : new FormControl(''),
      ItemId        : new FormControl(''),
      ItemName      : new FormControl(''),
      UM            : new FormControl(''),
      Price         : new FormControl(''),
      PriceType     : new FormControl(''),
      Qty           : new FormControl(''),
      ExpiryDate    : new FormControl(''),
      ExpiryDate2   : new FormControl(''),
      BatchLotNo    : new FormControl(''),
      ReasonId      : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<StockAdjustmentDetailUIComponent>,
    private dialog            : MatDialog,
    private stockAdjustmentDetailsService: StockAdjustmentDetailsService,
    private dateTimesService: DateTimesService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    private multipleUMsService    : MultipleUMsService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data) {
      this.stockAdjustmentDetail = this.data[0];
      this.stock = this.data[1];
      this.action = this.data[2];
      this.adjustmentType = this.data[3];

      this.UM = this.stock.UM;
      await this.getMultipleUMs();

      if (!this.stockAdjustmentDetail && (this.action.toLowerCase() == 'additemstockadjustmenttransaction' )) {
        this.btnText = "Save";
        this.getStockAdjustmentDetailForm1();
      }

      if (this.stockAdjustmentDetail && (this.action.toLowerCase() == 'updatestockadjustmenttransaction' || this.action.toLowerCase() == 'editstockadjustmentrecord' )) {
        this.btnText = "Update";
        this.getStockAdjustmentDetailForm2();
      }
      
      if (!this.stockAdjustmentDetail && (this.action.toLowerCase() == 'additemstockadjustmentreceipts' )) {
        this.btnText = "Add";
        this.getStockAdjustmentDetailForm3();
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.qtyInput.nativeElement.focus();  
      this.qtyInput.nativeElement.select(); 
    }, 500);
  }

  async getMultipleUMs(){
    this.unitMeasures = await firstValueFrom(this.multipleUMsService.loadMultipleUMsByItemId(this.stock.ItemId));
  }
  async onChangeUM(data){
    this.UM = data.UM;
    await this.selectPrice();
  }

  selectPrice(){
    this.multipleUM = this.unitMeasures.find(x => x.UM.toLowerCase() == this.UM.toLowerCase());

    switch (this.priceType){
        case "avecost" :
          this.stockAdjustmentDetailForm.controls['Price'].setValue(this.multipleUM.AveCost);
          break;
        case "cost" :
          this.stockAdjustmentDetailForm.controls['Price'].setValue(this.multipleUM.Cost);
          break;
        case "price" :
          this.stockAdjustmentDetailForm.controls['Price'].setValue(this.multipleUM.Price);
          break;
      }
  }

  getStockAdjustmentDetailForm1(){
    this.stockAdjustmentDetailForm.controls['TransCode'].setValue(this.stock.TransCode);
    this.stockAdjustmentDetailForm.controls['ReasonId'].setValue(this.stock.ReasonId);
    this.stockAdjustmentDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.stockAdjustmentDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.stockAdjustmentDetailForm.controls['UM'].setValue(this.stock.UM);
    this.stockAdjustmentDetailForm.controls['Price'].setValue( this.numbersService.Convert4Decimal(this.stock.Price) );
    this.stockAdjustmentDetailForm.controls['PriceType'].setValue('price');
    this.stockAdjustmentDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));

    if(this.adjustmentType.toLowerCase() == 'stockin'){
      this.stockAdjustmentDetailForm.controls['ExpiryDate'].setValue('na');
      this.stockAdjustmentDetailForm.controls['ExpiryDate2'].setValue(null);
      this.stockAdjustmentDetailForm.controls['BatchLotNo'].setValue('na');
    }else{
      this.stockAdjustmentDetailForm.controls['ExpiryDate'].setValue('na');
      this.stockAdjustmentDetailForm.controls['ExpiryDate2'].setValue('na');
      this.stockAdjustmentDetailForm.controls['BatchLotNo'].setValue('na');
    }

    if(this.stock.Qty > 0){
      this.stockAdjustmentDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.stock.Qty));
    }
  }
  
  getStockAdjustmentDetailForm2(){
    this.stockAdjustmentDetailForm.controls['id'].setValue(this.stockAdjustmentDetail.id);
    this.stockAdjustmentDetailForm.controls['TransNo'].setValue(this.stockAdjustmentDetail.TransNo);
    this.stockAdjustmentDetailForm.controls['TransCode'].setValue(this.stockAdjustmentDetail.TransCode);
    this.stockAdjustmentDetailForm.controls['ItemId'].setValue(this.stockAdjustmentDetail.ItemId);
    this.stockAdjustmentDetailForm.controls['ItemName'].setValue(this.stockAdjustmentDetail.ItemName);
    this.stockAdjustmentDetailForm.controls['UM'].setValue(this.stockAdjustmentDetail.UM);

    this.stockAdjustmentDetailForm.controls['Price'].setValue(this.numbersService.Convert4Decimal(this.stockAdjustmentDetail.Price));
    this.stockAdjustmentDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.stockAdjustmentDetail.Qty));
    this.stockAdjustmentDetailForm.controls['PriceType'].setValue(this.stockAdjustmentDetail.PriceType);

    if(this.adjustmentType.toLowerCase() == 'stockin'){
      this.stockAdjustmentDetailForm.controls['ExpiryDate'].setValue(this.stockAdjustmentDetail.ExpiryDate);
      this.stockAdjustmentDetailForm.controls['ExpiryDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.stockAdjustmentDetail.ExpiryDate2)));
      this.stockAdjustmentDetailForm.controls['BatchLotNo'].setValue(this.stockAdjustmentDetail.BatchLotNo);
    }else{
      this.stockAdjustmentDetailForm.controls['ExpiryDate'].setValue(this.stockAdjustmentDetail.ExpiryDate);
      this.stockAdjustmentDetailForm.controls['ExpiryDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.stockAdjustmentDetail.ExpiryDate2)));
      this.stockAdjustmentDetailForm.controls['BatchLotNo'].setValue(this.stockAdjustmentDetail.BatchLotNo);
    }
    
    if(this.adjustmentType.toLowerCase() == 'stockin'){
      this.onCheckExpiryDate(this.stockAdjustmentDetail.ExpiryDate?.toLowerCase() != 'na');
    }

    this.UM = this.stockAdjustmentDetail.UM;
  }

  getStockAdjustmentDetailForm3(){
    this.stockAdjustmentDetailForm.controls['TransCode'].setValue(this.stock.TransCode);
    this.stockAdjustmentDetailForm.controls['TransNo'].setValue(this.stock.TransNo);
    this.stockAdjustmentDetailForm.controls['ReasonId'].setValue(this.stock.ReasonId);
    this.stockAdjustmentDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.stockAdjustmentDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.stockAdjustmentDetailForm.controls['UM'].setValue(this.stock.UM);
    this.stockAdjustmentDetailForm.controls['Price'].setValue( this.numbersService.Convert4Decimal(this.stock.Price) );
    this.stockAdjustmentDetailForm.controls['PriceType'].setValue('price');
    this.stockAdjustmentDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    if(this.adjustmentType.toLowerCase() == 'stockin'){
      this.stockAdjustmentDetailForm.controls['ExpiryDate'].setValue('na');
      this.stockAdjustmentDetailForm.controls['ExpiryDate2'].setValue(null);
      this.stockAdjustmentDetailForm.controls['BatchLotNo'].setValue('na');
    }else{
      this.stockAdjustmentDetailForm.controls['ExpiryDate'].setValue('na');
      this.stockAdjustmentDetailForm.controls['ExpiryDate2'].setValue(null);
      this.stockAdjustmentDetailForm.controls['BatchLotNo'].setValue('na');
    }
    if(this.adjustmentType.toLowerCase() == 'stockin'){
      this.onCheckExpiryDate(false);
    }

  }

  onClickExpiry(){
     const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '800px';
      dialogConfig.data        = [this.stock, 'transaction'];
      this.dialog.open(ItemExpiryDatesUIComponent,dialogConfig).beforeClosed().subscribe(x=>{
        if(x){
          this.stockAdjustmentDetailForm.controls['ExpiryDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(x.ExpiryDate)));  
          this.stockAdjustmentDetailForm.controls['ExpiryDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(x.ExpiryDate2)));  
          this.stockAdjustmentDetailForm.controls['BatchLotNo'].setValue(x.BatchLotNo);  
        }
      });
  }

  onCheckExpiryDate(check){
    this.chkExpiry = check;
    if(check){
      this.stockAdjustmentDetailForm.controls['ExpiryDate'].enable();
    }else{
      this.stockAdjustmentDetailForm.controls['ExpiryDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date()));
      this.stockAdjustmentDetailForm.controls['ExpiryDate'].disable();
    }
  }

  onChangePriceType(event){
    this.priceType = event.value;
    this.stockAdjustmentDetailForm.controls['PriceType'].setValue(this.priceType);

    this.selectPrice();
    
    // switch (this.priceType){
    //   case "avecost" :
    //     this.stockAdjustmentDetailForm.controls['Price'].setValue(this.stock.AveCost);
    //     break;
    //   case "cost" :
    //     this.stockAdjustmentDetailForm.controls['Price'].setValue(this.stock.Cost);
    //     break;
    //   case "price" :
    //     this.stockAdjustmentDetailForm.controls['Price'].setValue(this.stock.Price);
    //     break;
    // }
  }

  onSubmit(){
    if(this.adjustmentType.toLowerCase() == 'stockin'){
      if(this.chkExpiry){
        this.stockAdjustmentDetailForm.controls['ExpiryDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.stockAdjustmentDetailForm.controls['ExpiryDate'].value)));
      }else{
        this.stockAdjustmentDetailForm.controls['ExpiryDate'].setValue('na');
      }
    }
    
    this.loading = true;
    this.stockAdjustmentDetailsService.updateStockAdjustmentDetail(this.stockAdjustmentDetailForm.getRawValue(), this.action, this.adjustmentType).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.stockAdjustmentDetail);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  onEnterQty() {
    this.onSubmit();  
  }

}

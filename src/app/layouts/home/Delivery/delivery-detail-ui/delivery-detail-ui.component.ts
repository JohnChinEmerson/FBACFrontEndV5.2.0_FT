import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DeliveryConfigService } from 'src/app/services/Delivery/delivery-config.service';
import { DeliveryDetailsService } from 'src/app/services/Delivery/delivery-details.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { ItemPriceCategorysUIComponent } from '../../Files/item-price-categorys-ui/item-price-categorys-ui.component';

@Component({
  selector: 'app-delivery-detail-ui',
  templateUrl: './delivery-detail-ui.component.html',
  styleUrls: ['./delivery-detail-ui.component.css']
})
export class DeliveryDetailUIComponent implements OnInit {
  @ViewChild('qtyInput') qtyInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  deliveryDetail: any=[];
  discountPersons: any=[];
  expiryDates: any=[];
  itemPriceCategories: any=[];
  saleDetail:any=[];
  action:string;
  deliveryConfig:any=[];
  deliveryDetailForm = new FormGroup({
      id            : new FormControl(''),
      TransNo       : new FormControl(''),
      TransCode     : new FormControl(''),
      ItemId        : new FormControl(''),
      ItemName      : new FormControl(''),
      UM            : new FormControl(''),
      Price         : new FormControl(''),
      PriceCategory : new FormControl(''),
      Qty           : new FormControl(''),
      Discount      : new FormControl(''),
      DiscountValue : new FormControl(''),
      DiscountType  : new FormControl(''),
      Amount        : new FormControl(''),
      ExpiryDate    : new FormControl(''),
      ExpiryDate2   : new FormControl(''),
      BatchLotNo    : new FormControl(''),
      CustomerId    : new FormControl(''),
      SaleDetailId    : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<DeliveryDetailUIComponent>,
    private dialog            : MatDialog,
    private deliveryDetailsService: DeliveryDetailsService,
    private notif             : NotificationService,
    private deliveryConfigService : DeliveryConfigService,
    private numbersService    : NumbersService,
    private dateTimesService    : DateTimesService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.deliveryDetail = this.data[0];
      this.saleDetail = this.data[1];
      this.action = this.data[2];

    this.deliveryDetailForm.controls['DiscountType'].disable();


      if (this.deliveryDetail && (this.action.toLowerCase() == 'updatedeliverytransaction' || this.action.toLowerCase() == 'editdeliveryrecord' )) {
        this.btnText = "Update";
        this.getDeliveryDetailForm2();
      }
      
      if (!this.deliveryDetail && (this.action.toLowerCase() == 'additemdeliveryreceipts' )) {
        this.btnText = "Add";
        this.getDeliveryDetailForm3();
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.qtyInput.nativeElement.focus();  
      this.qtyInput.nativeElement.select(); 
    }, 500);
  }
  
  getDeliveryDetailForm2(){
    this.deliveryDetailForm.controls['id'].setValue(this.deliveryDetail.id);
    this.deliveryDetailForm.controls['TransNo'].setValue(this.deliveryDetail.TransNo);
    this.deliveryDetailForm.controls['TransCode'].setValue(this.deliveryDetail.TransCode);
    this.deliveryDetailForm.controls['ItemId'].setValue(this.deliveryDetail.ItemId);
    this.deliveryDetailForm.controls['ItemName'].setValue(this.deliveryDetail.ItemName);
    this.deliveryDetailForm.controls['UM'].setValue(this.deliveryDetail.UM);
    this.deliveryDetailForm.controls['PriceCategory'].setValue(this.deliveryDetail.PriceCategory);

    this.deliveryDetailForm.controls['Price'].setValue(this.numbersService.Convert2Decimal(this.deliveryDetail.Price));
    this.deliveryDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.deliveryDetail.Qty));
    this.deliveryDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(this.deliveryDetail.Discount));
    this.deliveryDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.deliveryDetail.DiscountValue));

    this.deliveryDetailForm.controls['DiscountType'].setValue(this.deliveryDetail.DiscountType);
    this.deliveryDetailForm.controls['ExpiryDate'].setValue(this.deliveryDetail.ExpiryDate);
    this.deliveryDetailForm.controls['ExpiryDate2'].setValue(this.deliveryDetail.ExpiryDate2);
    this.deliveryDetailForm.controls['BatchLotNo'].setValue(this.deliveryDetail.BatchLotNo);
    this.deliveryDetailForm.controls['SaleDetailId'].setValue(this.deliveryDetail.SaleDetailId);
    this.computeDeliveryDetailAmount();
  }

  getDeliveryDetailForm3(){
    this.deliveryDetailForm.controls['TransCode'].setValue(this.saleDetail.TransCode);
    this.deliveryDetailForm.controls['TransNo'].setValue(this.saleDetail.TransNo);
    this.deliveryDetailForm.controls['CustomerId'].setValue(this.saleDetail.CustomerId);
    this.deliveryDetailForm.controls['ItemId'].setValue(this.saleDetail.ItemId);
    this.deliveryDetailForm.controls['ItemName'].setValue(this.saleDetail.ItemName);
    this.deliveryDetailForm.controls['UM'].setValue(this.saleDetail.UM);
    this.deliveryDetailForm.controls['Price'].setValue( this.numbersService.Convert2Decimal(this.saleDetail.Price) );
    this.deliveryDetailForm.controls['DiscountType'].setValue(this.saleDetail.DiscountType);
    this.deliveryDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.saleDetail.DiscountValue));
    this.deliveryDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.saleDetail.TobeDelivered));
    this.deliveryDetailForm.controls['PriceCategory'].setValue(this.saleDetail.PriceCategory);
    this.deliveryDetailForm.controls['ExpiryDate'].setValue(this.saleDetail.ExpiryDate);
    this.deliveryDetailForm.controls['ExpiryDate2'].setValue(this.saleDetail.ExpiryDate2);
    this.deliveryDetailForm.controls['BatchLotNo'].setValue(this.saleDetail.BatchLotNo);
    this.deliveryDetailForm.controls['SaleDetailId'].setValue(this.saleDetail.id);
    this.computeDeliveryDetailAmount();
  }



  computeDeliveryDetailAmount(){
    var price = +this.deliveryDetailForm.controls['Price'].value;
    var discountValue = +this.deliveryDetailForm.controls['DiscountValue'].value;
    var discountType = this.deliveryDetailForm.controls['DiscountType'].value;
    var qty = +this.deliveryDetailForm.controls['Qty'].value;

    var vATType="";
    if (this.saleDetail != null)
        vATType = this.saleDetail.VATType;
    else
        vATType = this.deliveryDetail.VATType;

    this.deliveryDetailsService.computeDeliveryDetailAmount(price, discountValue, qty, discountType, vATType)
    .subscribe((amounts: any) => {

    this.deliveryDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(amounts.Discount));
    this.deliveryDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(amounts.Amount));
    });

  }

  onClickOtherPriceCategories(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data        = ([this.saleDetail, 'delivery', this.saleDetail.UM]);
    this.dialog.open(ItemPriceCategorysUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
          this.deliveryDetailForm.controls['Price'].setValue(this.numbersService.Convert2Decimal(res.Price));
          this.deliveryDetailForm.controls['PriceCategory'].setValue(res.PriceCategory);
      }
    });
  }
 
  onSubmit(){
    this.loading = true;
    this.deliveryDetailsService.updateDeliveryDetail(this.deliveryDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.deliveryDetail);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  onClose(){
    this.dialogRef.close();
  }
  
  onEnterQty() {
    this.computeDeliveryDetailAmount();
    this.onSubmit();  
  }

}

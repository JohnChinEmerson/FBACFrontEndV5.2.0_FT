import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { DateTimesService } from 'src/app/services/date-times.service';
import { ItemPriceCategorysService } from 'src/app/services/Files/item-price-categorys.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { OrderConfigService } from 'src/app/services/Orders/order-config.service';
import { OrderDetailsService } from 'src/app/services/Orders/order-details.service';
import { ItemPriceCategorysUIComponent } from '../../Files/item-price-categorys-ui/item-price-categorys-ui.component';
import { ItemExpiryDatesUIComponent } from '../../Inventory/item-expiry-dates-ui/item-expiry-dates-ui.component';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';

@Component({
  selector: 'app-order-detail-ui',
  templateUrl: './order-detail-ui.component.html',
  styleUrls: ['./order-detail-ui.component.css']
})
export class OrderDetailUIComponent implements OnInit {
  @ViewChild('qtyInput') qtyInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  orderDetail           : any=[];
  discountPersons       : any=[];
  expiryDates           : any=[];
  itemPriceCategories   : any=[];
  stock                 : any=[];
  action                : string;
  orderConfig           : any=[];
  unitMeasures                   : any=[];
  UM : string;
  orderDetailForm = new FormGroup({
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
      CustomerId    : new FormControl(''),
      Conversion    : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<OrderDetailUIComponent>,
    private dialog            : MatDialog,
    private orderDetailsService: OrderDetailsService,
    private notif             : NotificationService,
    private itemPriceCategorysService    : ItemPriceCategorysService,
    private multipleUMsService    : MultipleUMsService,
    private orderConfigService : OrderConfigService,
    private numbersService    : NumbersService,
    private dateTimesService    : DateTimesService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data) {
      this.orderDetail = this.data[0];
      this.stock = this.data[1];
      this.action = this.data[2];

      this.UM = this.stock.UM;
      await this.getMultipleUMs();
      if (!this.orderDetail && (this.action.toLowerCase() == 'additemordertransaction' )) {
        this.btnText = "Save";
        this.getOrderDetailForm1();
      }

      if (this.orderDetail && (this.action.toLowerCase() == 'updateordertransaction' || this.action.toLowerCase() == 'editorderrecord')) {
        this.btnText = "Update";
        this.getOrderDetailForm2();
      }
      if (!this.orderDetail && (this.action.toLowerCase() == 'additemorderreceipts' )) {
        this.btnText = "Add";
        this.getOrderDetailForm3();
      }
      
      this.getOrderConfig();
    }

    this.getItemPriceCategorys();
   
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
  onChangeUM(data){
    this.orderDetailForm.controls['Price'].setValue(data.Price);
    this.orderDetailForm.controls['PriceCategory'].setValue('Regular');
    this.UM = data.UM;
    this.computeOrderDetailAmount();
  }

  async getOrderConfig(){
    this.orderConfig = await firstValueFrom(this.orderConfigService.getOrderConfig());
    this.setUpFields();
  }

  setUpFields(){
    if(this.orderConfig.DisableItemDiscount.toLowerCase() == 'yes'){
      this.orderDetailForm.controls['DiscountValue'].disable();
      this.orderDetailForm.controls['DiscountType'].disable();
    }else{
      this.orderDetailForm.controls['DiscountValue'].enable();
      this.orderDetailForm.controls['DiscountType'].enable();
    }
    if(this.orderConfig.EditPrice.toLowerCase() == 'no'){
      this.orderDetailForm.controls['Price'].disable();
      this.orderDetailForm.controls['PriceCategory'].disable();
    }else{
      this.orderDetailForm.controls['Price'].enable();
      this.orderDetailForm.controls['PriceCategory'].enable();
    }
  }

  async getItemPriceCategorys(){
    if(this.orderDetail){
      this.itemPriceCategories = await firstValueFrom(this.itemPriceCategorysService.getItemPriceCategoryByPriceCategoryByItemIdByUM(this.orderDetail.Category, this.orderDetail.ItemId, this.UM));
    }else{
      this.itemPriceCategories = await firstValueFrom(this.itemPriceCategorysService.getItemPriceCategoryByPriceCategoryByItemIdByUM(this.stock.Category, this.stock.ItemId, this.UM));
    }
  }

  getOrderDetailForm1(){
    this.orderDetailForm.controls['TransCode'].setValue(this.stock.TransCode);
    this.orderDetailForm.controls['CustomerId'].setValue(this.stock.CustomerId);
    this.orderDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.orderDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.orderDetailForm.controls['UM'].setValue(this.stock.UM);
    this.orderDetailForm.controls['Price'].setValue( this.numbersService.Convert4Decimal(this.stock.Price) );
    this.orderDetailForm.controls['DiscountType'].setValue('percent');
    this.orderDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.orderDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.orderDetailForm.controls['PriceCategory'].setValue(this.stock.PriceCategory);
     if(this.stock.Qty > 0){
      this.orderDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.stock.Qty));
    }
    this.computeOrderDetailAmount();
  }
  
  getOrderDetailForm2(){
    this.orderDetailForm.controls['id'].setValue(this.orderDetail.id);
    this.orderDetailForm.controls['TransNo'].setValue(this.orderDetail.TransNo);
    this.orderDetailForm.controls['TransCode'].setValue(this.orderDetail.TransCode);
    this.orderDetailForm.controls['ItemId'].setValue(this.orderDetail.ItemId);
    this.orderDetailForm.controls['ItemName'].setValue(this.orderDetail.ItemName);
    this.orderDetailForm.controls['UM'].setValue(this.orderDetail.UM);
    this.orderDetailForm.controls['PriceCategory'].setValue(this.orderDetail.PriceCategory);

    this.orderDetailForm.controls['Price'].setValue(this.numbersService.Convert4Decimal(this.orderDetail.Price));
    this.orderDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.orderDetail.Qty));
    this.orderDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(this.orderDetail.Discount));
    this.orderDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.orderDetail.DiscountValue));
    this.orderDetailForm.controls['DiscountType'].setValue(this.orderDetail.DiscountType);

    this.computeOrderDetailAmount();
  }

  getOrderDetailForm3(){
    this.orderDetailForm.controls['TransCode'].setValue(this.stock.TransCode);
    this.orderDetailForm.controls['TransNo'].setValue(this.stock.TransNo);
    this.orderDetailForm.controls['CustomerId'].setValue(this.stock.CustomerId);
    this.orderDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.orderDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.orderDetailForm.controls['UM'].setValue(this.stock.UM);
    this.orderDetailForm.controls['Price'].setValue( this.numbersService.Convert4Decimal(this.stock.Price) );
    this.orderDetailForm.controls['DiscountType'].setValue('percent');
    this.orderDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.orderDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.orderDetailForm.controls['PriceCategory'].setValue(this.stock.PriceCategory);
    this.computeOrderDetailAmount();
  }


  computeOrderDetailAmount(){
    var price = +this.orderDetailForm.controls['Price'].value;
    var discountValue = +this.orderDetailForm.controls['DiscountValue'].value;
    var discountType = this.orderDetailForm.controls['DiscountType'].value;
    var qty = +this.orderDetailForm.controls['Qty'].value;

    var vATType="";
    if (this.stock != null)
        vATType = this.stock.VATType;
    else
        vATType = this.orderDetail.VATType;

    this.orderDetailsService.computeOrderDetailAmount(price, discountValue, qty, discountType, vATType)
    .subscribe((amounts: any) => {

    this.orderDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(amounts.Discount));
    this.orderDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(amounts.Amount));
    });

  }

  onClickOtherPriceCategories(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data        = ([this.stock, 'order', this.orderDetailForm.controls['UM'].value ]);
    this.dialog.open(ItemPriceCategorysUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
          this.orderDetailForm.controls['Price'].setValue(this.numbersService.Convert4Decimal(res.Price));
          this.orderDetailForm.controls['PriceCategory'].setValue(res.PriceCategory);
      }
    });
  }

  onSubmit(){
    this.loading = true;
    this.orderDetailsService.updateOrderDetail(this.orderDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.orderDetail);
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
    this.computeOrderDetailAmount();
    this.onSubmit();  
  }

}

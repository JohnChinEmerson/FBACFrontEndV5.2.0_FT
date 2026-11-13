import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ItemPriceCategorysService } from 'src/app/services/Files/item-price-categorys.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaleDetailsService } from 'src/app/services/Sales/sale-details.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { ItemPriceCategorysUIComponent } from '../../Files/item-price-categorys-ui/item-price-categorys-ui.component';
import { NumbersService } from 'src/app/services/numbers.service';
import { ItemExpiryDatesUIComponent } from '../../Inventory/item-expiry-dates-ui/item-expiry-dates-ui.component';
import { DateTimesService } from 'src/app/services/date-times.service';
import { SaleConfigAccessRightsService } from 'src/app/services/Sales/sale-config-access-rights.service';
import { AuthService } from '../../../../services/auth.service';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';

@Component({
  selector: 'app-sale-detail-ui',
  templateUrl: './sale-detail-ui.component.html',
  styleUrls: ['./sale-detail-ui.component.css']
})
export class SaleDetailUIComponent implements OnInit {
  @ViewChild('qtyInput') qtyInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  saleDetail: any=[];
  discountPersons: any=[];
  expiryDates: any=[];
  itemPriceCategories: any=[];
  stock:any=[];
  action:string;
  saleConfig:any=[];
  saleConfigAccessRight:any=[];
  unitMeasures                   : any=[];
  UM : string;
  disablePriceCategoryButton : boolean = false;
  saleDetailForm = new FormGroup({
              id            : new FormControl(''),
              TransNo       : new FormControl(''),
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
              RecordStatusCashiering   : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<SaleDetailUIComponent>,
    private dialog            : MatDialog,
    private saleDetailsService: SaleDetailsService,
    private notif             : NotificationService,
    private itemPriceCategorysService    : ItemPriceCategorysService,
    private saleConfigService : SaleConfigService,
    private saleConfigAccessRightsService : SaleConfigAccessRightsService,
    private authService : AuthService, 
    private numbersService    : NumbersService,
    private dateTimesService    : DateTimesService,
    private multipleUMsService    : MultipleUMsService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data) {
      this.saleDetail = this.data[0];
      this.stock = this.data[1];
      this.action = this.data[2];

      this.UM = this.stock.UM;
      await this.getMultipleUMs();
      this.saleDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1)); // add focus on input

      if (!this.saleDetail && (this.action.toLowerCase() == 'additemsalestransaction' )) {
        this.btnText = "Save";
        this.getSaleDetailForm1();
      }

      if (this.saleDetail && (this.action.toLowerCase() == 'updatesalestransaction' || this.action.toLowerCase() == 'editsalerecord' )) {
        this.btnText = "Update";
        this.getSaleDetailForm2();
      }
      
      if (!this.saleDetail && (this.action.toLowerCase() == 'additemsalereceipts' )) {
        this.btnText = "Add";
        this.getSaleDetailForm3();
      }
      this.getSaleConfig();
    }

    this.getItemPriceCategorys();
    this.getExpiryDates();
   
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
    this.saleDetailForm.controls['Price'].setValue(data.Price);
    this.saleDetailForm.controls['PriceCategory'].setValue('Regular');
    this.UM = data.UM;
    this.computeSaleDetailAmount();
  }

  async getSaleConfig(){
    this.saleConfig = await firstValueFrom(this.saleConfigService.getSaleConfig());
    this.saleConfigAccessRight = await firstValueFrom(this.saleConfigAccessRightsService.getSaleConfigAccessRightByAccessRightName(this.authService.UserAccount.AccessRightName));
    this.setUpFields();
  }

  setUpFields(){
    if((this.saleConfigAccessRight.DisableItemDiscount || '').toLowerCase() == 'yes'){
      this.saleDetailForm.controls['DiscountValue'].disable();
      this.saleDetailForm.controls['DiscountType'].disable();
    }else{
      this.saleDetailForm.controls['DiscountValue'].enable();
      this.saleDetailForm.controls['DiscountType'].enable();
    }
    if((this.saleConfigAccessRight.EditPrice || '').toLowerCase() == 'no'){
      this.saleDetailForm.controls['Price'].disable();
      this.saleDetailForm.controls['PriceCategory'].disable();
      this.disablePriceCategoryButton = true;
    }else{
      this.saleDetailForm.controls['Price'].enable();
      this.saleDetailForm.controls['PriceCategory'].enable();
      this.disablePriceCategoryButton = false;
    }
  }

  async getExpiryDates(){
    this.expiryDates = [];
  }

  async getItemPriceCategorys(){
    if(this.saleDetail){
      this.itemPriceCategories = await firstValueFrom(this.itemPriceCategorysService.getItemPriceCategoryByPriceCategoryByItemIdByUM(this.saleDetail.Category, this.saleDetail.ItemId, this.UM));
    }else{
      this.itemPriceCategories = await firstValueFrom(this.itemPriceCategorysService.getItemPriceCategoryByPriceCategoryByItemIdByUM(this.stock.Category, this.stock.ItemId, this.UM));
    }
  }

  getSaleDetailForm1(){
    this.saleDetailForm.controls['TransNo'].setValue(this.stock.TransNo);
    this.saleDetailForm.controls['CustomerId'].setValue(this.stock.CustomerId);
    this.saleDetailForm.controls['RecordStatusCashiering'].setValue(this.stock.RecordStatusCashiering);
    this.saleDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.saleDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.saleDetailForm.controls['UM'].setValue(this.stock.UM);
    this.saleDetailForm.controls['Price'].setValue( this.numbersService.Convert4Decimal(this.stock.Price) );
    this.saleDetailForm.controls['DiscountType'].setValue('percent');
    this.saleDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.saleDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.saleDetailForm.controls['PriceCategory'].setValue(this.stock.PriceCategory);
    this.saleDetailForm.controls['ExpiryDate'].setValue('na');
    this.saleDetailForm.controls['ExpiryDate2'].setValue('na');
    this.saleDetailForm.controls['BatchLotNo'].setValue('na');
    if(this.stock.Qty > 0){
      this.saleDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.stock.Qty));
    }
    this.computeSaleDetailAmount();
  }
  
  getSaleDetailForm2(){
    this.saleDetailForm.controls['id'].setValue(this.saleDetail.id);
    this.saleDetailForm.controls['TransNo'].setValue(this.saleDetail.TransNo);
    this.saleDetailForm.controls['ItemId'].setValue(this.saleDetail.ItemId);
    this.saleDetailForm.controls['ItemName'].setValue(this.saleDetail.ItemName);
    this.saleDetailForm.controls['UM'].setValue(this.saleDetail.UM);
    this.saleDetailForm.controls['PriceCategory'].setValue(this.saleDetail.PriceCategory);

    this.saleDetailForm.controls['Price'].setValue(this.numbersService.Convert4Decimal(this.saleDetail.Price));
    this.saleDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.saleDetail.Qty));
    this.saleDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(this.saleDetail.Discount));
    this.saleDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(this.saleDetail.DiscountValue));

    this.saleDetailForm.controls['DiscountType'].setValue(this.saleDetail.DiscountType);
    this.saleDetailForm.controls['ExpiryDate'].setValue(this.saleDetail.ExpiryDate);
    this.saleDetailForm.controls['ExpiryDate2'].setValue(this.saleDetail.ExpiryDate2);
    this.saleDetailForm.controls['BatchLotNo'].setValue(this.saleDetail.BatchLotNo);
    this.computeSaleDetailAmount();
  }

  getSaleDetailForm3(){
    this.saleDetailForm.controls['TransNo'].setValue(this.stock.TransNo);
    this.saleDetailForm.controls['TransNo'].setValue(this.stock.TransNo);
    this.saleDetailForm.controls['CustomerId'].setValue(this.stock.CustomerId);
    this.saleDetailForm.controls['RecordStatusCashiering'].setValue(this.stock.RecordStatusCashiering);
    this.saleDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.saleDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.saleDetailForm.controls['UM'].setValue(this.stock.UM);
    this.saleDetailForm.controls['Price'].setValue( this.numbersService.Convert4Decimal(this.stock.Price) );
    this.saleDetailForm.controls['DiscountType'].setValue('percent');
    this.saleDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.saleDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.saleDetailForm.controls['PriceCategory'].setValue(this.stock.PriceCategory);
    this.saleDetailForm.controls['ExpiryDate'].setValue('na');
    this.saleDetailForm.controls['ExpiryDate2'].setValue('na');
    this.saleDetailForm.controls['BatchLotNo'].setValue('na');
    this.computeSaleDetailAmount();
  }


  computeSaleDetailAmount(){
    var price = +this.saleDetailForm.controls['Price'].value;
    var discountValue = +this.saleDetailForm.controls['DiscountValue'].value;
    var discountType = this.saleDetailForm.controls['DiscountType'].value;
    var qty = +this.saleDetailForm.controls['Qty'].value;

    var vATType="";
    if (this.stock != null)
        vATType = this.stock.VATType;
    else
        vATType = this.saleDetail.VATType;

    this.saleDetailsService.computeSaleDetailAmount(price, discountValue, qty, discountType, vATType)
    .subscribe((amounts: any) => {

    this.saleDetailForm.controls['Discount'].setValue(this.numbersService.Convert2Decimal(amounts.Discount));
    this.saleDetailForm.controls['Amount'].setValue(this.numbersService.Convert2Decimal(amounts.Amount));
    });

  }

  onClickOtherPriceCategories(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data        = ([this.stock, 'sales', this.saleDetailForm.controls['UM'].value]);
    this.dialog.open(ItemPriceCategorysUIComponent,dialogConfig).beforeClosed().subscribe(res => {
      if(res){
          this.saleDetailForm.controls['Price'].setValue(this.numbersService.Convert4Decimal(res.Price));
          this.saleDetailForm.controls['PriceCategory'].setValue(res.PriceCategory);
      }
    });
  }

  onClickExpiry(){
     const dialogConfig        = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus    = true;
      dialogConfig.width        = '800px';
      dialogConfig.data        = [this.stock, 'transaction'];
      this.dialog.open(ItemExpiryDatesUIComponent,dialogConfig).beforeClosed().subscribe(x=>{
        if(x){
          if(x.id == 0){
            this.saleDetailForm.controls['ExpiryDate'].setValue('na');
            this.saleDetailForm.controls['ExpiryDate2'].setValue('na');
            this.saleDetailForm.controls['BatchLotNo'].setValue('na');
          }else{  
            this.saleDetailForm.controls['ExpiryDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(x.ExpiryDate)));  
            this.saleDetailForm.controls['ExpiryDate2'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(x.ExpiryDate2)));  
            this.saleDetailForm.controls['BatchLotNo'].setValue(x.BatchLotNo);  
          }
           
        }
      });
  }

  onSubmit(){
    this.loading = true;
    this.saleDetailsService.updateSaleDetail(this.saleDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.saleDetail);
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
    this.computeSaleDetailAmount();
    this.onSubmit();  
  }
}

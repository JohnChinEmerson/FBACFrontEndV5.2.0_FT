import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { MultipleUMsService } from 'src/app/services/Files/multiple-ums.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NumbersService } from 'src/app/services/numbers.service';
import { ReceivingConfigAccessRightsService } from 'src/app/services/Receiving/receiving-config-access-rights.service';
import { ReceivingDetailsService } from 'src/app/services/Receiving/receiving-details.service';
import { UpdatePriceUIComponent } from '../update-price-ui/update-price-ui.component';

@Component({
  selector: 'app-receiving-detail-ui',
  templateUrl: './receiving-detail-ui.component.html',
  styleUrls: ['./receiving-detail-ui.component.css']
})
export class ReceivingDetailUIComponent implements OnInit {
  @ViewChild('qtyInput') qtyInput!: ElementRef;
  btnText               : string = "Save";
  loading               : boolean = false;
  receivingDetail: any=[];
  discountPersons: any=[];
  expiryDates: any=[];
  stock:any=[];
  action:string;
  chkExpiry:boolean = false;
  unitMeasures                   : any=[];
  UM : string;
  receivingConfigAccessright      : any=[];
  priceType : string = 'text';
  costType : string = 'text';
  readOnlyPrice : boolean = false;
  readOnlyDiscount : boolean = false;
  receivingDetailForm = new FormGroup({
              id            : new FormControl(''),
              TransNo       : new FormControl(''),
              TransCode     : new FormControl(''),
              ItemId        : new FormControl(''),
              ItemName      : new FormControl(''),
              UM            : new FormControl(''),
              Price         : new FormControl(''),
              Cost          : new FormControl(''),
              Qty           : new FormControl(''),
              Discount      : new FormControl(''),
              DiscountValue : new FormControl(''),
              DiscountType  : new FormControl(''),
              Amount        : new FormControl(''),
              ExpiryDate    : new FormControl(''),
              BatchLotNo    : new FormControl(''),
              SupplierId    : new FormControl(''),
  });

  constructor(
    private dialogRef         : MatDialogRef<ReceivingDetailUIComponent>,
    private dialog            : MatDialog,
    private receivingDetailsService: ReceivingDetailsService,
    private dateTimesService: DateTimesService,
    private notif             : NotificationService,
    private numbersService    : NumbersService,
    private multipleUMsService    : MultipleUMsService,   
    private receivingConfigAccessRightsService      : ReceivingConfigAccessRightsService,
    private auth_service    : AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data) {
      this.receivingDetail = this.data[0];
      this.stock = this.data[1];
      this.action = this.data[2];

      this.UM = this.stock.UM;
      await this.getMultipleUMs();
      await this.getReceivingConfigAccessRights();
      if (!this.receivingDetail && (this.action.toLowerCase() == 'additemreceivingtransaction' )) {
        this.btnText = "Save";
        this.getReceivingDetailForm1();
      }

      if (this.receivingDetail && (this.action.toLowerCase() == 'updatereceivingtransaction'  || this.action.toLowerCase() == 'editreceivingrecord'  )  ) {
        this.btnText = "Update";
        this.getReceivingDetailForm2();
      }
      
      if (!this.receivingDetail && (this.action.toLowerCase() == 'additemreceivingreceipts' )) {
        this.btnText = "Add";
        this.getReceivingDetailForm3();
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.qtyInput.nativeElement.focus();  
      this.qtyInput.nativeElement.select(); 
    }, 500);
  }


   async getReceivingConfigAccessRights(){
    this.receivingConfigAccessright = await firstValueFrom(this.receivingConfigAccessRightsService.getReceivingConfigAccessRightByAccessRightName(this.auth_service.UserAccount.AccessRightName));
    this.setUpFields();
  }

  setUpFields(){
    if(this.receivingConfigAccessright.HideCost?.toLowerCase() == 'yes'){
      this.costType = 'password';
    }else{
      this.costType = 'text';
    }
    if(this.receivingConfigAccessright.HidePrice?.toLowerCase() == 'yes'){
      this.priceType = 'password';
    }else{
      this.priceType = 'text';
    }

    this.readOnlyDiscount = this.receivingConfigAccessright.HideCost?.toLowerCase() == 'yes';
    this.readOnlyPrice = this.receivingConfigAccessright.EditPrice?.toLowerCase() == 'no';
  }
  async getMultipleUMs(){
    this.unitMeasures = await firstValueFrom(this.multipleUMsService.loadMultipleUMsByItemId(this.stock.ItemId));
  }
  onChangeUM(data){
    this.receivingDetailForm.controls['Price'].setValue(data.Price);
    this.receivingDetailForm.controls['Cost'].setValue(data.Cost);
    this.UM = data.UM;
    this.computeReceivingDetailAmount();
  }

  getReceivingDetailForm1(){
    this.receivingDetailForm.controls['TransCode'].setValue(this.stock.TransCode);
    this.receivingDetailForm.controls['SupplierId'].setValue(this.stock.SupplierId);
    this.receivingDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.receivingDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.receivingDetailForm.controls['UM'].setValue(this.stock.UM);
    this.receivingDetailForm.controls['Price'].setValue( this.numbersService.Convert4Decimal(this.stock.Price) );
    this.receivingDetailForm.controls['DiscountType'].setValue('percent');
    this.receivingDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.receivingDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.receivingDetailForm.controls['Cost'].setValue(this.numbersService.Convert4Decimal(this.stock.Cost) );
    this.receivingDetailForm.controls['ExpiryDate'].setValue('na');
    this.receivingDetailForm.controls['BatchLotNo'].setValue('na');
    if(this.stock.Qty > 0){
      this.receivingDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(this.stock.Qty));
    }
    this.onCheckExpiryDate(false);
    this.computeReceivingDetailAmount();
  }
  
  getReceivingDetailForm2(){
    this.receivingDetailForm.controls['id'].setValue(this.receivingDetail.id);
    this.receivingDetailForm.controls['TransNo'].setValue(this.receivingDetail.TransNo);
    this.receivingDetailForm.controls['TransCode'].setValue(this.receivingDetail.TransCode);
    this.receivingDetailForm.controls['ItemId'].setValue(this.receivingDetail.ItemId);
    this.receivingDetailForm.controls['ItemName'].setValue(this.receivingDetail.ItemName);
    this.receivingDetailForm.controls['UM'].setValue(this.receivingDetail.UM);

    this.receivingDetailForm.controls['Cost'].setValue(this.receivingDetail.Cost);
    this.receivingDetailForm.controls['Price'].setValue(this.receivingDetail.Price);
    this.receivingDetailForm.controls['Qty'].setValue(this.receivingDetail.Qty);
    this.receivingDetailForm.controls['Discount'].setValue(this.receivingDetail.Discount);
    this.receivingDetailForm.controls['DiscountValue'].setValue(this.receivingDetail.DiscountValue);

    this.receivingDetailForm.controls['DiscountType'].setValue(this.receivingDetail.DiscountType);
    this.receivingDetailForm.controls['ExpiryDate'].setValue(this.receivingDetail.ExpiryDate);
    this.receivingDetailForm.controls['BatchLotNo'].setValue(this.receivingDetail.BatchLotNo);
    this.onCheckExpiryDate(this.receivingDetail.ExpiryDate?.toLowerCase() != 'na');
    this.computeReceivingDetailAmount();
  }

  getReceivingDetailForm3(){
    this.receivingDetailForm.controls['TransCode'].setValue(this.stock.TransCode);
    this.receivingDetailForm.controls['TransNo'].setValue(this.stock.TransNo);
    this.receivingDetailForm.controls['SupplierId'].setValue(this.stock.SupplierId);
    this.receivingDetailForm.controls['ItemId'].setValue(this.stock.ItemId);
    this.receivingDetailForm.controls['ItemName'].setValue(this.stock.ItemName);
    this.receivingDetailForm.controls['UM'].setValue(this.stock.UM);
    this.receivingDetailForm.controls['Price'].setValue( this.numbersService.Convert4Decimal(this.stock.Price) );
    this.receivingDetailForm.controls['DiscountType'].setValue('percent');
    this.receivingDetailForm.controls['DiscountValue'].setValue(this.numbersService.Convert2Decimal(0));
    this.receivingDetailForm.controls['Qty'].setValue(this.numbersService.Convert2Decimal(1));
    this.receivingDetailForm.controls['Cost'].setValue( this.numbersService.Convert4Decimal(this.stock.Cost) );
    this.receivingDetailForm.controls['ExpiryDate'].setValue('na');
    this.receivingDetailForm.controls['BatchLotNo'].setValue('na');
    this.onCheckExpiryDate(false);
    this.computeReceivingDetailAmount();
  }


  computeReceivingDetailAmount(){
    var cost = +this.receivingDetailForm.controls['Cost'].value;
    var discountValue = +this.receivingDetailForm.controls['DiscountValue'].value;
    var discountType = this.receivingDetailForm.controls['DiscountType'].value;
    var qty = +this.receivingDetailForm.controls['Qty'].value;

    var vATType="";
    if (this.stock != null)
        vATType = this.stock.VATType;
    else
        vATType = this.receivingDetail.VATType;

    this.receivingDetailsService.computeReceivingDetailAmount(cost, discountValue, qty, discountType,vATType)
    .subscribe((amounts: any) => {

    this.receivingDetailForm.controls['Discount'].setValue(amounts.Discount);
    this.receivingDetailForm.controls['Amount'].setValue(amounts.Amount);
    });

  }

  onCheckExpiryDate(check){
    this.chkExpiry = check;
    if(check){
      this.receivingDetailForm.controls['ExpiryDate'].enable();
    }else{
      this.receivingDetailForm.controls['ExpiryDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date()));
      this.receivingDetailForm.controls['ExpiryDate'].disable();
    }
  }

  onSubmit(){
    if(this.chkExpiry){
      this.receivingDetailForm.controls['ExpiryDate'].setValue(this.dateTimesService.ConvertToDateFormat(new Date(this.receivingDetailForm.controls['ExpiryDate'].value)));
    }else{
      this.receivingDetailForm.controls['ExpiryDate'].setValue('na');
    }
    this.loading = true;
    this.receivingDetailsService.updateReceivingDetail(this.receivingDetailForm.getRawValue(), this.action).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.dialogRef.close(res.receivingDetail);
        this.loading = false;
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  onClickUpdatePrice(){
    var um = this.unitMeasures.find(x => x.UM == this.UM);
    um.Price = this.receivingDetailForm.controls['Price'].value;
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true; 
    dialogConfig.width        = '500px';
    dialogConfig.data        = um;
    this.dialog.open(UpdatePriceUIComponent,dialogConfig).beforeClosed().subscribe(price => {
        if(price){
          this.receivingDetailForm.controls['Price'].setValue(this.numbersService.Convert4Decimal(price));
        }
    });
  }

  onClose(){
    this.dialogRef.close();
  }

  onEnterQty() {
    this.computeReceivingDetailAmount();
    this.onSubmit();  
  }

}

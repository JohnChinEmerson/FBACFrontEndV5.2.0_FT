import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { BusinessStylesService } from 'src/app/services/Files/business-styles.service';
import { CustomersService } from 'src/app/services/Files/customers.service';
import { DiscountPersonsService } from 'src/app/services/Files/discount-persons.service';
import { PriceCategorysService } from 'src/app/services/Files/price-categorys.service';
import { NotificationService } from 'src/app/services/notification.service';
import { BusinessStylesUIComponent } from '../business-styles-ui/business-styles-ui.component';


@Component({
  selector: 'app-customer-ui',
  templateUrl: './customer-ui.component.html',
  styleUrls: ['./customer-ui.component.css']
})
export class CustomerUIComponent implements OnInit {
  btnText               : string = "Save";
  btnTextToEdit         : boolean = false;
  loading               : boolean = false;
  customer: any=[];
  customers: any=[];
  priceCategorys: any=[];
  discountPersons: any=[];
  businessStyles: any=[];
  type:string;
  readonlyDiscountPercent : boolean = true;
  customerForm = new FormGroup({
        id            : new FormControl(''),
        CustomerId    : new FormControl('generated'),
        CustomerName  : new FormControl(''),
        BusinessStyle : new FormControl('-'),
        ContactNo     : new FormControl('-'),
        Address       : new FormControl('-'),
        CustomerTIN   : new FormControl('-'),
        TermDays      : new FormControl(0),
        PriceCategory : new FormControl('Regular Price'),
        HasRebate     : new FormControl('no'),
        IdPresented   : new FormControl('-'),
        DiscountId   : new FormControl('-'),
        DiscountPerson   : new FormControl('No Discount'),
        DiscountPercent   : new FormControl(0),
        BeginningRebate   : new FormControl(0),
        CreditLimit   : new FormControl(0),
  });

  constructor(
    private dialogRef         : MatDialogRef<CustomerUIComponent>,
    private dialog                      : MatDialog,
    private customersService  : CustomersService,
    private notif             : NotificationService,
    private priceCategorysService    : PriceCategorysService,
    private discountPersonsService    : DiscountPersonsService,
    private businessStylesService    : BusinessStylesService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    this.getPriceCategorys();
    this.getDiscountPersons();
    this.getBusinessStyles();
    this.onChangeHasRebate('no');
    this.businessStylesService.requiredRefresh.subscribe(()=>{
      this.getBusinessStyles();
    });
    if (this.data) {
      this.customer = this.data[0];
      this.type     = this.data[1];
      this.customers     = this.data[2];
      if (this.customer) {
        this.btnText = "Update";
        this.getcustomerFormData();
      }
    }
  }

  async getDiscountPersons(){
    this.discountPersons = await firstValueFrom(this.discountPersonsService.getCBODiscountPersons());
  }

  async getPriceCategorys(){
    this.priceCategorys = await firstValueFrom(this.priceCategorysService.getCBOPriceCategorys());
    var rP:any= {
       'PriceCategoryId' : 'Regular Price',
       'PriceCategory' : 'Regular Price',
    };
    this.priceCategorys.push(rP);
    if (!this.customer) {
      this.customerForm.controls['PriceCategory'].setValue(rP.PriceCategory);
    }
  }

  async getBusinessStyles(){
    this.businessStyles = await firstValueFrom(this.businessStylesService.getBusinessStyles());
  }
  
  getcustomerFormData(){
    this.customerForm.controls['id'].setValue(this.customer.id);
    this.customerForm.controls['CustomerId'].setValue(this.customer.CustomerId);
    this.customerForm.controls['CustomerName'].setValue(this.customer.CustomerName);
    this.customerForm.controls['BusinessStyle'].setValue(this.customer.BusinessStyle);
    this.customerForm.controls['ContactNo'].setValue(this.customer.ContactNo);
    this.customerForm.controls['Address'].setValue(this.customer.Address);
    this.customerForm.controls['CustomerTIN'].setValue(this.customer.CustomerTIN);
    this.customerForm.controls['TermDays'].setValue(this.customer.TermDays);
    this.customerForm.controls['PriceCategory'].setValue(this.customer.PriceCategory);
    this.customerForm.controls['DiscountId'].setValue(this.customer.DiscountId);
    this.customerForm.controls['DiscountPerson'].setValue(this.customer.DiscountPerson);
    this.customerForm.controls['DiscountPercent'].setValue(this.customer.DiscountPercent);
    this.customerForm.controls['BeginningRebate'].setValue(this.customer.BeginningRebate);
    this.customerForm.controls['HasRebate'].setValue(this.customer.HasRebate);
    this.customerForm.controls['CreditLimit'].setValue(this.customer.CreditLimit);
    this.onChangeHasRebate(this.customer.HasRebate);
  }
  
  onChangeDiscountPerson(discountPerson){
    var dP = this.discountPersons.filter(x => x.DiscountPerson == discountPerson);
    this.customerForm.controls['DiscountPercent'].setValue(dP[0].DiscountPercent);

    if(discountPerson.toLowerCase() == 'no discount')
        this.readonlyDiscountPercent = true;
    else
        this.readonlyDiscountPercent = false;
        
  }

  onClickBusinessStyle(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(BusinessStylesUIComponent,dialogConfig);
  }

  onSubmit(){
    this.loading = true;
    this.customersService.saveEditCustomers(this.customerForm.getRawValue(),this.btnText).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        if(this.btnText == "Save"){
          this.customers = [res.customer,...this.customers]; 
          this.ResetForm();
          this.loading = false;
          if(this.type == 'sales' || this.type == 'order'){
            this.dialogRef.close(res.customer);
          }
        }
        else{
          this.dialogRef.close(res.customer);
          this.loading = false;
        }
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }


  ResetForm(){
    this.customerForm.controls['id'].setValue('');
    this.customerForm.controls['CustomerId'].setValue('generated');
    this.customerForm.controls['CustomerName'].setValue('');
    this.customerForm.controls['BusinessStyle'].setValue('-');
    this.customerForm.controls['ContactNo'].setValue('-');
    this.customerForm.controls['Address'].setValue('-');
    this.customerForm.controls['CustomerTIN'].setValue('-');
    this.customerForm.controls['TermDays'].setValue('0');
    this.customerForm.controls['PriceCategory'].setValue('');
  }

  onClose(){
    if(this.type == 'customers'){
      this.dialogRef.close(this.customers);
    }else{
      this.dialogRef.close();
    }
  }

  onChangeHasRebate(value){
    if(value.toLowerCase() == 'yes'){
      this.customerForm.controls['BeginningRebate'].enable();

    }else{
      this.customerForm.controls['BeginningRebate'].disable();
      this.customerForm.controls['BeginningRebate'].setValue('0');

    }
  }

}

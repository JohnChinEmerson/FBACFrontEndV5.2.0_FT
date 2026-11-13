import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NumbersService } from '../../../../services/numbers.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaleHeadersService } from 'src/app/services/Sales/sale-headers.service';
import { SaleConfigService } from 'src/app/services/Sales/sale-config.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';
import { VendorPermitsService } from 'src/app/services/Config/vendor-permits.service';

@Component({
  selector: 'app-change-ui',
  templateUrl: './change-ui.component.html',
  styleUrls: ['./change-ui.component.css']
})
export class ChangeUIComponent implements OnInit {

  loading               : boolean = false;
  saleHeader: any=[];
  saleConfig: any=[];
  caller: any;
  totalDue : number = 0;
  tendered : number = 0;
  change : number = 0;
  readonly : boolean = true;
  printReceipt : boolean = true;
  constructor(
    private dialogRef         : MatDialogRef<ChangeUIComponent>,
    private dialog                      : MatDialog,
    private notificationService : NotificationService,
    private saleHeadersService : SaleHeadersService,
    private saleConfigService : SaleConfigService,
    private numbersService : NumbersService,
    private router : Router,
    private printService  : PrintService,
    private machinePermitsService : MachinePermitsService,
    private vendorPermitsService : VendorPermitsService,
    @Inject(MAT_DIALOG_DATA) public data: any, // passing data here from update

  ) { }

  ngOnInit(): void {
    this.getSaleConfig();
      if (this.data) {
        this.saleHeader = this.data[0];
        this.caller = this.data[1];

        if( this.caller == 'cashiering'){
          this.readonly = false;
        }
        this.totalDue   =  this.numbersService.Convert2Decimal(+this.saleHeader.TotalDue);
        this.tendered = this.numbersService.Convert2Decimal(+this.saleHeader.AmountPaid);
        this.change = this.numbersService.Convert2Decimal(+this.saleHeader.AmountPaid - +this.saleHeader.TotalDue );
    }
  }

  async getSaleConfig(){
    this.saleConfig = await firstValueFrom(this.saleConfigService.getSaleConfig());
  }
  
  onChangeTenderedAmount(){
    this.change = this.numbersService.Convert2Decimal(+this.tendered- +this.totalDue );
  }

  onCloseSubmit(){
    if (this.caller.toLowerCase() == "cashiering")
    {
          if (this.change < 0 && this.saleHeader.PaymentType.toLowerCase() != "charge")
          {
            return this.notificationService.toastrWarning("Invalid Tender Amount.");
          }
          else{
            this.saleHeader.AmountPaid = this.tendered;
            this.saleHeadersService.updateSaleHeaderFromSalesCashiering(this.saleHeader, this.saleHeader.TransNo).subscribe({
              next:(res)=>{
                var saleHeader = res.saleHeader;
                var saleDetails = res.saleDetails;
        
                if(this.saleConfig.PrintReceipt){
                  this.print(saleHeader, saleDetails);
                }
                this.dialogRef.close(res.saleHeader);
                this.loading = false;
              },
              error:(err)=> {
                this.notificationService.toastrError(err.error.message);
                this.loading = false;
              },
            });
          }
    }
    else{
      this.onClose();
    }
  }

  onClose(){
    this.dialogRef.close();
  }

  
  async print(saleHeader, saleDetails) {
    // if(saleHeader.BIRRegistered.toLowerCase() == "no"){
    //   var url = this.router.serializeUrl(
    //     this.router.createUrlTree(['print/printpos'])
    //   );
    // }else{
    //   var url = this.router.serializeUrl(
    //     this.router.createUrlTree(['print/printposbir'])
    //   );
    // }

    // this.printService.popupWindow(url, 'POSPrint', window, 1000, 700);
    // localStorage.setItem('Header', JSON.stringify(saleHeader));
    // localStorage.setItem('Details', JSON.stringify(saleDetails));
    // localStorage.setItem('Config', JSON.stringify(this.saleConfig));
    // localStorage.setItem('Reprint', 'false');

    // header, lines, discounts and permits as saved (desktop POSPrintBIR / POSPrint)
    var receipt:any = await firstValueFrom(this.saleHeadersService.getSaleReceiptForPrint(saleHeader.TransNo));
    var bir = (receipt.saleHeader.BIRRegistered || '').toLowerCase() == "yes";
    var url = this.router.serializeUrl(this.router.createUrlTree([bir ? 'print/printposbir' : 'print/printpos']));
    localStorage.setItem('Header', JSON.stringify(receipt.saleHeader));
    localStorage.setItem('Details', JSON.stringify(receipt.saleDetails));
    localStorage.setItem('Discounts', JSON.stringify(receipt.discountApplications));
    localStorage.setItem('machinePermit', JSON.stringify(receipt.machinePermit));
    localStorage.setItem('vendorPermit', JSON.stringify(receipt.vendorPermit));
    localStorage.setItem('Config', JSON.stringify(this.saleConfig));
    localStorage.setItem('Title', bir ? 'SALES INVOICE' : 'SALES RECEIPT');
    localStorage.setItem('ReceiptType', 'sale');
    localStorage.setItem('Reprint', 'false');
    this.printService.popupWindow(url, 'POSPrint', window, 1000, 700);
  }

}

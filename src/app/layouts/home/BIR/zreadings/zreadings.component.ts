import { Component, OnInit } from '@angular/core';
import { MachinePermitsService } from '../../../../services/Config/machine-permits.service';
import { firstValueFrom } from 'rxjs';
import { DateSalesService } from 'src/app/services/BIR/date-sales.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { DateVATSalesService } from 'src/app/services/BIR/date-vatsales.service';
import { DateSaleTypesService } from 'src/app/services/BIR/date-sale-types.service';
import { DateDiscountSalesService } from 'src/app/services/BIR/date-discount-sales.service';
import { DateSaleReturnsService } from 'src/app/services/BIR/date-sale-returns.service';
import { DateCustomersService } from 'src/app/services/BIR/date-customers.service';
import { DateVoidSalesService } from 'src/app/services/BIR/date-void-sales.service';
import { XZReadingsService } from 'src/app/services/BIR/xzreadings.service';
import { AuthService } from 'src/app/services/auth.service';
import { HomeComponent } from '../../home.component';
import { NotificationService } from 'src/app/services/notification.service';
import { DateZReadingsService } from 'src/app/services/BIR/date-zreadings.service';
import { ZReadingsUIComponent } from '../zreadings-ui/zreadings-ui.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { ReceiptLine, ReceiptLinesService } from 'src/app/services/receipt-lines.service';

@Component({
  selector: 'app-zreadings',
  templateUrl: './zreadings.component.html',
  styleUrls: ['./zreadings.component.css']
})
export class ZReadingsComponent implements OnInit {
  reportLabel : string = 'Z-Reading Report';
  terminals : any=[];
  terminal : string;
  machinePermit : any;
  date          : any = new Date();
  zReadings : any = [];
  previewLines : ReceiptLine[] = [];
  dateSI : any = [];
  dateSales : any = [];
  dateVATSales : any = [];
  dateSaleTypes : any = [];
  dateDiscountSales : any = [];
  dateSaleReturns : any = [];
  dateVoidSales : any = [];
  dateCustomers: any = [];
  isLoading       : boolean = false;
  loaded       : boolean = false;
  disbleDate : boolean = true; 
  line : string = '__________________________________';
  toolButtons     = [
    {'Label'   : 'Preview','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Generate','Function'                : () => this.onClickGenerate(),'Disabled': true,}, 
    {'Label'   : 'ZReadings','Function'               : () => this.onClickZReadings(),'Disabled': true,}, 
  ]; 
  constructor(
    private machinePermitsService : MachinePermitsService,
    private xZReadingsService : XZReadingsService,
    private dateZReadingsService : DateZReadingsService,
    private dateTimesService : DateTimesService,
    private homeTs : HomeComponent,
    private toolBoxService : ToolBoxService,
    private notificationService : NotificationService,
    private dialog  : MatDialog,
    private router  : Router,
    private printService : PrintService,
    private receiptLinesService : ReceiptLinesService,
    private authService : AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCBOTerminals();
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, null, null, null);
  }

  async getCBOTerminals(){
    this.terminals = await firstValueFrom(this.machinePermitsService.getCBOTerminals());
  }

  async onClickView(){
    if(!this.terminal)
        return this.notificationService.toastrWarning("Terminal not Found.");
    this.isLoading = true;
    this.loaded = false;
    this.zReadings = await firstValueFrom(this.xZReadingsService.getXZReadingsByTerminalByDate(this.terminal, this.dateTimesService.ConvertToDateFormat(new Date(this.date)), this.reportLabel));
    
      
    this.dateSI = this.zReadings['dateSI'];
    this.dateSales = this.zReadings['dateSales'];
    this.dateVATSales = this.zReadings['dateVATSales'];
    this.dateSaleTypes = this.zReadings['dateSaleTypes'];
    this.dateDiscountSales = this.zReadings['dateDiscountSales'];
    this.dateSaleReturns = this.zReadings['dateSaleReturns'];
    this.dateVoidSales = this.zReadings['dateVoidSales'];
    this.dateCustomers = this.zReadings['dateCustomers'];
    this.machinePermit = this.zReadings['machinePermit'];
    this.previewLines = this.receiptLinesService.zReading(this.zReadings, this.authService.BusinessInfo, this.authService.UserAccount?.UserFullName, '');

    this.isLoading = false;
    this.loaded = true;
  }

  async onClickGenerate(){
    if (!this.terminal == null)
      this.onClickView();

      var ZReading = await firstValueFrom(this.dateZReadingsService.getDateZReadingsByTerminalByDate(this.terminal, this.dateTimesService.ConvertToDateFormat(new Date(this.date))));
      if (ZReading != null)
      {
        return this.notificationService.toastrError("ZReading Already Exists.");
      }

     this.notificationService.popupWarning("Generate ZReading","ZReading from Terminal " + this.terminal.toUpperCase() + " on " + this.dateTimesService.ConvertToDateFormat(new Date(this.date)) + " will be generated. You can no longer perform sales transaction with this terminal today. Continue?").then(async (result) => {
          if (result.value) {
              var data:any = {
                 dateSI : this.zReadings['dateSI'],
                 dateSales : this.zReadings['dateSales'],
                 dateVATSales : this.zReadings['dateVATSales'],
                 dateSaleTypes : this.zReadings['dateSaleTypes'],
                 dateDiscountSales : this.zReadings['dateDiscountSales'],
                 dateSaleReturns : this.zReadings['dateSaleReturns'],
                 dateVoidSales : this.zReadings['dateVoidSales'],
                 dateCustomers : this.zReadings['dateCustomers'],
                 machinePermit : this.zReadings['machinePermit'],
              };
              this.dateZReadingsService.generateZReading(data, this.dateTimesService.ConvertToDateFormat(new Date(this.date))).subscribe({
                next:(res)=>{
                  this.notificationService.toastrSuccess(res.message);
                  // Desktop XZReading.Generate: "Ready to print the Z-Reading. Continue?"
                  this.notificationService.popupWarning("Print Z-Reading", "Ready to print the Z-Reading. Continue?").then((print) => {
                    if (print.value) {
                      var url = this.router.serializeUrl(this.router.createUrlTree(['print/printzreadingpos']));
                      localStorage.setItem('Data', JSON.stringify(res.ZReading));
                      localStorage.setItem('MachinePermit', JSON.stringify(this.machinePermit));
                      localStorage.setItem('Reprint', 'false');
                      this.printService.popupWindow(url, 'printzreadingpos', window, 800, 800);
                    }
                  });
                  this.setZReadingDate();
                  this.onClickView();
                },
                error:(err)=>{
                  this.notificationService.toastrError(err.error?.message ?? err.error);
                },
              });
          }
        });
  }

 async setZReadingDate(){
    var result = await firstValueFrom(this.dateZReadingsService.getLastZReading(this.terminal));
    this.date = this.dateTimesService.ConvertToDateFormat(new Date());
    const lastZReading = result?.transDate;
    if (lastZReading) {
      const lastDate = this.dateTimesService.ConvertToDateFormat(new Date(lastZReading));
      if (lastDate < this.date) {
        this.date = new Date(lastDate);
        this.date.setDate(this.date.getDate() + 1);
      }
    } else {
      this.disbleDate = false;
    }
  }

  async onClickZReadings(){
    if(!this.terminal)
      return this.notificationService.toastrWarning("Terminal not Found.");
    
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data        = this.terminal;
    this.dialog.open(ZReadingsUIComponent,dialogConfig);

  }


}

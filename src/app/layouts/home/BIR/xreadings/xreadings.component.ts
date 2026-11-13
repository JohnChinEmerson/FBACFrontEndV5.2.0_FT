import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { DateZReadingsService } from 'src/app/services/BIR/date-zreadings.service';
import { XZReadingsService } from 'src/app/services/BIR/xzreadings.service';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { ZReadingsUIComponent } from '../zreadings-ui/zreadings-ui.component';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { ReceiptLine, ReceiptLinesService } from 'src/app/services/receipt-lines.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-xreadings',
  templateUrl: './xreadings.component.html',
  styleUrls: ['./xreadings.component.css']
})
export class XReadingsComponent implements OnInit {
  reportLabel : string = 'X-Reading Report';
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
  line : string = '__________________________________';
  toolButtons     = [
    {'Label'   : 'Preview','Function'                : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'                : () => this.onClickPrint(),'Disabled': true,}, 
    {'Label'   : 'Print POS','Function'                : () => this.onClickPrintPOS(),'Disabled': true,}, 
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
    private printService        : PrintService,
    private router              : Router,
    private receiptLinesService : ReceiptLinesService,
    private authService         : AuthService,
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
    this.previewLines = this.receiptLinesService.xReading(this.zReadings, this.authService.BusinessInfo, this.authService.UserAccount?.UserFullName);

    this.isLoading = false;
    this.loaded = true;
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printxreadingreceipt']));
    var title = 'X Reading Report'  ;
    var data:any = {
      Terminal : this.machinePermit.ComputerName,
      MachineNo : this.machinePermit.MachineNo,
      PermitNo : this.machinePermit.PermitNo,
      TransDate : this.dateSI.TransDate,
      ZReadingNo : this.dateSI.ZReadingNo,
      StartingSI : this.dateSI.StartingSI,
      EndingSI : this.dateSI.EndingSI,
      GrossSales : this.dateSales.GrossSales,
      SeniorDiscount : this.dateSales.SeniorDiscount,
      PWDDiscount : this.dateSales.PWDDiscount,
      RegularDiscount : this.dateSales.RegularDiscount,
      LessVATSenior : this.dateSales.LessVATSenior,
      LessVATDiplomat : this.dateSales.LessVATDiplomat,
      NetSales : this.dateSales.NetSales,
      VATSales : this.dateVATSales.VATSales,
      VATAmount : this.dateVATSales.VATAmount,
      VATExemptSales : this.dateVATSales.VATExemptSales,
      ZeroRatedSales : this.dateVATSales.ZeroRatedSales,
      CashSales : this.dateSaleTypes.CashSales,
      BankDepositSales : this.dateSaleTypes.BankDepositSales,
      CheckPaymentSales : this.dateSaleTypes.CheckPaymentSales,
      SeniorSales : this.dateDiscountSales.SeniorSales,
      PWDSales : this.dateDiscountSales.PWDSales,
      DiplomatSales : this.dateDiscountSales.DiplomatSales,
      SalesReturn : this.dateSaleReturns.TotalAmount,
      SRCount : this.dateSaleReturns.TotalCount,
      TotalCustomers : this.dateCustomers.TotalCount,
      Regular : this.dateCustomers.Regular,
      Senior : this.dateCustomers.Senior,
      PWD : this.dateCustomers.PWD,
      Diplomat : this.dateCustomers.Diplomat,
    };
    this.printService.popupWindow(url, 'printzreadingreceipt', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(data));
    localStorage.setItem('Title', title);
  }

  
  // Desktop XZReading.POSPrint("") -> DateZReadingsBAL.POSPrintXReading (the whole reading, incl. cash drawer)
  onClickPrintPOS(){
    if (!this.loaded)
      return this.notificationService.toastrWarning("Preview the X-Reading first.");
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printxreadingpos']));
    localStorage.setItem('Data', JSON.stringify(this.zReadings));
    localStorage.setItem('Title', 'X READING REPORT');
    this.printService.popupWindow(url, 'printxreadingpos', window, 800, 800);
  }

}

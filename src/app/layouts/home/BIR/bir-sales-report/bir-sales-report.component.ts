import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BIRSalesReportService } from 'src/app/services/BIR/bir-sales-report.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { BIRSalesReportTablesComponent } from '../bir-sales-report-tables/bir-sales-report-tables.component';

// Desktop BIRSalesReportUI: BIR Sales Summary / Detailed and the discount sales books of a period
@Component({
  selector: 'app-bir-sales-report',
  templateUrl: './bir-sales-report.component.html',
  styleUrls: ['./bir-sales-report.component.css']
})
export class BIRSalesReportComponent implements OnInit {
  sections      = [
    { key: 'summary', label: 'Summary' },
    { key: 'detailed', label: 'Detailed' },
    { key: 'senior', label: 'Senior Citizen' },
    { key: 'pwd', label: 'PWD' },
    { key: 'naac', label: 'NAAC' },
    { key: 'soloParent', label: 'Solo Parent' },
    { key: 'mov', label: 'MOV' },
  ];
  selectedIndex : number = 0;
  data          : any = null;
  dateFrom      : any = new Date();
  dateTo        : any = new Date();
  isLoading     : boolean = false;
  periodLabel   : string = '';
  toolButtons   = [
    {'Label'   : 'View','Function'  : () => this.onClickView(),'Disabled': true,},
    {'Label'   : 'Print','Function' : () => this.onClickPrint(),'Disabled': true,},
  ];
  constructor(
    private bIRSalesReportService : BIRSalesReportService,
    private dateTimesService : DateTimesService,
    private notificationService : NotificationService,
    private printService : PrintService,
    private router : Router,
    private homeTs : HomeComponent,
    private toolBoxService : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, null, null, null);
  }

  async onClickView(){
    var dateFrom = this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom));
    var dateTo = this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo));
    this.isLoading = true;
    try {
      this.data = await firstValueFrom(this.bIRSalesReportService.getBIRSalesReportByDateFromByDateTo(dateFrom, dateTo));
      this.periodLabel = dateFrom + ' TO ' + dateTo;
    } catch (err: any) {
      this.notificationService.toastrError(err.error?.message);
    }
    this.isLoading = false;
  }

  count(key: string): number {
    return this.data?.[key]?.length ?? 0;
  }

  // the tab shown is printed (landscape), as the desktop prints one report viewer at a time
  onClickPrint(){
    if (!this.data)
      return this.notificationService.toastrWarning("View the report first.");
    var section = this.sections[this.selectedIndex].key;
    localStorage.setItem('Data', JSON.stringify(this.data));
    localStorage.setItem('Section', section);
    localStorage.setItem('Title', BIRSalesReportTablesComponent.labels[section] + ' FROM ' + this.periodLabel);
    var url = this.router.serializeUrl(this.router.createUrlTree(['print/printbirsalesreport']));
    this.printService.popupWindow(url, 'printbirsalesreport', window, 1200, 800);
  }
}

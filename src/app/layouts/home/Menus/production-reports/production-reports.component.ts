import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MenuReportsService } from 'src/app/services/Menus/menu-reports.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';

// Desktop Mariosoft.Costing.UI ProductionReportsUI (Stock In "From Production" by item, plus the components consumed)
@Component({
  selector: 'app-production-reports',
  templateUrl: './production-reports.component.html',
  styleUrls: ['../menus-shared.css']
})
export class ProductionReportsComponent implements OnInit {
  dateFrom    : any = new Date();
  dateTo      : any = new Date();
  produced    : any[] = null;
  consumed    : any[] = null;
  isLoading   : boolean = false;

  constructor(
    private menuReportsService  : MenuReportsService,
    private dateTimesService    : DateTimesService,
    private notificationService : NotificationService,
    private router              : Router,
    private printService        : PrintService,
  ) { }

  ngOnInit(): void {
  }

  private fmt(date: any){
    return this.dateTimesService.ConvertToDateFormat(new Date(date));
  }

  sum(rows: any[], key: string){
    return (rows || []).reduce((total, row) => total + (+row[key] || 0), 0);
  }

  async onClickGo(){
    this.isLoading = true;
    try {
      var res: any = await firstValueFrom(this.menuReportsService.getProductionReport(this.fmt(this.dateFrom), this.fmt(this.dateTo)));
      this.produced = res.produced;
      this.consumed = res.consumed;
    } catch (err: any) {
      this.notificationService.toastrHttpError(err, 'Unable to load the report.');
    } finally {
      this.isLoading = false;
    }
  }

  onClickPrint(which: string){
    var rows = which == 'produced' ? this.produced : this.consumed;
    if (!rows) return;
    var url = this.router.serializeUrl(this.router.createUrlTree(['print/printdatalist']));
    localStorage.setItem('PrintDataList', JSON.stringify({
      'Title'   : (which == 'produced' ? 'PRODUCTION REPORTS' : 'PRODUCTION COMPONENTS USED') + ' FROM ' + this.fmt(this.dateFrom) + ' TO ' + this.fmt(this.dateTo),
      'Columns' : [
        { 'Key': 'ItemName', 'Label': 'ItemName' },
        { 'Key': 'Category', 'Label': 'Category' },
        { 'Key': 'UM', 'Label': 'UM' },
        { 'Key': 'Qty', 'Label': 'Qty', 'Type': 'decimal' },
        { 'Key': 'Amount', 'Label': 'Amount', 'Type': 'decimal' },
      ],
      'Data'    : rows,
      'Totals'  : { 'Qty': this.sum(rows, 'Qty'), 'Amount': this.sum(rows, 'Amount') },
    }));
    this.printService.popupWindow(url, 'ProductionReports', window, 1000, 800);
  }
}

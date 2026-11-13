import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ESalesBookService } from 'src/app/services/BIR/esales-book.service';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { HelperService } from 'src/app/services/helper.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { Router } from '@angular/router';
import { PrintService } from 'src/app/services/print.service';
import { report } from 'process';

@Component({
  selector: 'app-esales-book',
  templateUrl: './esales-book.component.html',
  styleUrls: ['./esales-book.component.css']
})
export class ESalesBookComponent implements OnInit {
  years :any; 
  months :any; 
  year :any = new Date().getFullYear();
  month:any = new Date().getMonth() + 1;
  terminals : any=[];
  terminal : string;
  reportLabel : string = 'E Sales Book';
  isLoading       : boolean = false;
  loaded       : boolean = false;
  eSalesBook : any=[];
  machinePermit : any=[];
  readings : any=[];
  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'            : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  constructor(
      private helperService : HelperService,
      private machinePermitsService : MachinePermitsService,
      private eSalesBookService : ESalesBookService,
      private router : Router,
      private printService : PrintService,
      private homeTs : HomeComponent,
      private toolBoxService : ToolBoxService,
      private notificationService : NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, null, null, null);
    this.getYears();
    this.getMonths();
    this.getCBOTerminals();
  }

  async getMonths(){
    this.months = await firstValueFrom(this.helperService.getMonthsWithValue());
  }

  async getYears(){
    this.years = await firstValueFrom(this.helperService.getYears());
  }

  async getCBOTerminals(){
    this.terminals = await firstValueFrom(this.machinePermitsService.getCBOTerminals());
  }

  async onClickView(){
    if(!this.terminal)
      return this.notificationService.toastrWarning("Terminal not Found.");

    this.isLoading = true;
    this.loaded = false;

    this.eSalesBook = await firstValueFrom(this.eSalesBookService.getESalesBookByTerminalByMonthByYear(this.terminal, this.month, this.year));
    this.machinePermit = this.eSalesBook['machinePermit'];
    this.readings = this.eSalesBook['readings'];
    var monthName:any = await firstValueFrom(this.helperService.getMonthName(this.month));
    this.reportLabel = "E-SALES BOOK AS OF " + monthName.toUpperCase()+ " " + this.year;
    this.isLoading = false;
    this.loaded = true;
  }
getTotal(field: string): number {
    return this.readings.reduce((total, item) => {
        return total + (Number(item[field]) || 0);
    }, 0);
}
  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printesalesbook']));
    this.printService.popupWindow(url, 'printesalesbook', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(this.readings));
    localStorage.setItem('MachinePermit', JSON.stringify(this.machinePermit));
    localStorage.setItem('Title', this.reportLabel);
  }

}

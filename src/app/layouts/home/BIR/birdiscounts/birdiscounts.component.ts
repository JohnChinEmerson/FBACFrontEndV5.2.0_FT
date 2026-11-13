import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BIRDiscountsService } from 'src/app/services/BIR/birdiscounts.service';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';
import { HelperService } from 'src/app/services/helper.service';
import { NotificationService } from 'src/app/services/notification.service';
import { PrintService } from 'src/app/services/print.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';
import { DateTimesService } from 'src/app/services/date-times.service';

@Component({
  selector: 'app-birdiscounts',
  templateUrl: './birdiscounts.component.html',
  styleUrls: ['./birdiscounts.component.css']
})
export class BIRDiscountsComponent implements OnInit {
  terminals : any=[];
  terminal : string;
  reportLabel : string = 'DISCOUNTS';
  isLoading       : boolean = false;
  loaded       : boolean = false;
  data : any=[];
  machinePermit : any=[];
  discounts : any=[];
  dateFrom : any = new Date();
  dateTo : any = new Date();
  toolButtons     = [
    {'Label'   : 'View','Function'            : () => this.onClickView(),'Disabled': true,}, 
    {'Label'   : 'Print','Function'            : () => this.onClickPrint(),'Disabled': true,}, 
  ];
  constructor(
      private helperService : HelperService,
      private machinePermitsService : MachinePermitsService,
      private bIRDiscountsService : BIRDiscountsService,
      private router : Router,
      private printService : PrintService,
      private homeTs : HomeComponent,
      private toolBoxService : ToolBoxService,
      private dateTimesService : DateTimesService,
      private notificationService : NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(this.toolButtons, null, null, null);
    this.getCBOTerminals();
  }

  async getCBOTerminals(){
    this.terminals = await firstValueFrom(this.machinePermitsService.getCBOTerminals());
  }

  async onClickView(){
    if(!this.terminal)
      return this.notificationService.toastrWarning("Terminal not Found.");

    this.isLoading = true;
    this.loaded = false;

    this.data = await firstValueFrom(this.bIRDiscountsService.getBIRDiscountsByTerminalByDateFromByDateTo(this.terminal, this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom) ), this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo) )));
    this.machinePermit = this.data['machinePermit'];
    this.discounts = this.data['discounts'];
    this.reportLabel = "DISCOUNTS  FROM " + this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom) )+ " TO " +  this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo) );
    this.isLoading = false;
    this.loaded = true;
  }

  onClickPrint(){
    var url   = this.router.serializeUrl(this.router.createUrlTree(['print/printbirdiscounts']));
    this.printService.popupWindow(url, 'printbirdiscounts', window, 800, 800);
    localStorage.setItem('Data', JSON.stringify(this.discounts));
    localStorage.setItem('MachinePermit', JSON.stringify(this.machinePermit));
    localStorage.setItem('Title', this.reportLabel);
  }

}

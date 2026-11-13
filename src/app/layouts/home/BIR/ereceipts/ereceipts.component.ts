import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { EReceiptsService } from 'src/app/services/BIR/ereceipts.service';
import { MachinePermitsService } from 'src/app/services/Config/machine-permits.service';
import { DateTimesService } from 'src/app/services/date-times.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-ereceipts',
  templateUrl: './ereceipts.component.html',
  styleUrls: ['./ereceipts.component.css']
})
export class EReceiptsComponent implements OnInit {
  loading                   : boolean = false;
  dateFrom : any = new Date();
  dateTo : any = new Date();
  terminal    : any;
  terminals : any=[];
  eReceipts  : any= [];
  btnText : string = 'Generate';
  constructor(
    private eReceiptsService        : EReceiptsService,
    private notif               : NotificationService,
    private toolBoxService    : ToolBoxService,
    private dateTimesService    : DateTimesService,
    private machinePermitsService    : MachinePermitsService,
    private notificationService : NotificationService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCBOTerminals();

  }
    async getCBOTerminals(){
      this.terminals = await firstValueFrom(this.machinePermitsService.getCBOTerminals());
    }

   async onSubmit() {
      if (!this.terminal) {
        return this.notificationService.toastrWarning("Terminal not Found.");
      }
    
      this.loading = true;
    
      this.eReceipts = await firstValueFrom(this.eReceiptsService.generateEReceiptsByTerminalByDateFromByDateTo(
            this.dateTimesService.ConvertToDateFormat(new Date(this.dateFrom)),
            this.dateTimesService.ConvertToDateFormat(new Date(this.dateTo)),
            this.terminal,
    ));

    this.downloadFile(this.eReceipts.content, this.eReceipts.filename);
    this.loading = false;
    }
    

  private downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  onClose(){
    this.toolBoxService.onHome();
  }
}

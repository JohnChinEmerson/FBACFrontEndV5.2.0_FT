import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ClientLicenseService } from 'src/app/services/client-license.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SuggestionBoxService } from 'src/app/services/Support/suggestion-box.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';

@Component({
  selector: 'app-suggestion-box-ui',
  templateUrl: './suggestion-box-ui.component.html',
  styleUrls: ['./suggestion-box-ui.component.css']
})
export class SuggestionBoxUIComponent implements OnInit {
 btnText                   : string = "Submit";
  scores                    : any=[1,2,3,4,5];
  techSupports              : any=[];
  clientLicense             : any=[];
  loading                   : boolean = false;
  btnTechSupportDisable     : boolean = true;
  btnTechSupportText        : string = 'Load Tech Supports';
  suggestionBoxForm        = new FormGroup({
    Suggestion             : new FormControl(''),
        ClientName              : new FormControl(''),
  });
  constructor(
    private suggestionBoxService      : SuggestionBoxService,
    private clientLicenseService          : ClientLicenseService,
    private notif                         : NotificationService,
    private toolBoxService                : ToolBoxService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.getClientLicense();
  }


  async getClientLicense(){
    this.clientLicense = await firstValueFrom(this.clientLicenseService.getClientLicense());
    this.btnTechSupportDisable = false;
    this.getsuggestionBoxFormData();
  }

  getsuggestionBoxFormData(){
    this.suggestionBoxForm.controls['ClientName'].setValue(this.clientLicense.ClientName);
  }

  
  onSubmit(){
    this.loading = true;
    this.suggestionBoxService.saveSuggestionBoxes(this.suggestionBoxForm.getRawValue()).subscribe({
      next:(res)=>{
        this.loading = false;
        this.notif.toastrSuccess(res.message);
        this.onClose();
      },
      error:(err)=>{
        this.notif.toastrError(err.error);
        this.loading = false;
      },
    })
  }

  onClose(){
    this.toolBoxService.onHome();
  }

}

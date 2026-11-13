import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { FileConfigsService } from 'src/app/services/Files/file-configs.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToolBoxService } from 'src/app/services/tool-box.service';
import { HomeComponent } from '../../home.component';

// Desktop Mariosoft.Files.UI FilesConfigUI: MultipleTable (tables grouped by Table Category) and HasProduction.
// Uses the Sales Config popup form (checkbox + value rows, Save, close).
@Component({
  selector: 'app-files-config-ui',
  templateUrl: './files-config-ui.component.html',
  styleUrls: ['../../Sales/sales-config/sales-config.component.css']
})
export class FilesConfigUIComponent implements OnInit {
  btnText         : string = "Save";
  config          : any = null;
  loading         : boolean = false;
  fileConfigForm  = new FormGroup({
      MultipleTable : new FormControl({ value: 'no', disabled: true }),
      HasProduction : new FormControl({ value: 'yes', disabled: true }),
  });

  // keeps the existing "Update" access right on the save button
  toolButtons     = [
    {'Label'   : 'Update','Function'          : () => this.onSubmit(),'Disabled': true},
  ];

  constructor(
    private fileConfigsService  : FileConfigsService,
    private notificationService : NotificationService,
    private toolBoxService      : ToolBoxService,
    private homeTs              : HomeComponent,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.homeTs.getButtons();
    this.toolBoxService.disableButtons(null, this.toolButtons, null, null);
    await this.loadConfig();
  }

  async loadConfig(){
    this.config = await firstValueFrom(this.fileConfigsService.getFileConfig());
    this.fileConfigForm.controls['MultipleTable'].setValue((this.config?.MultipleTable || 'no').toLowerCase());
    this.fileConfigForm.controls['HasProduction'].setValue((this.config?.HasProduction || 'yes').toLowerCase());
  }

  // Sales Config onCheck for yes/no settings
  onCheck(column: string, check: boolean){
    this.fileConfigForm.controls[column].setValue(check ? 'yes' : 'no');
  }

  onSubmit(){
    var data = this.fileConfigForm.getRawValue();
    var multipleTableChanged = data.MultipleTable != (this.config?.MultipleTable || 'no').toLowerCase();
    if (!multipleTableChanged) return this.saveConfig(data);
    // Desktop FilesConfigUI deletes all tables when MultipleTable changes; confirm before doing it.
    this.notificationService.popupWarning('Change MultipleTable', 'Changing MultipleTable will DELETE ALL TABLES. They must be generated again under their Table Categories. Continue?').then((result) => {
      if (result.value) this.saveConfig(data);
      else this.loadConfig();
    });
  }

  saveConfig(data: any){
    this.loading = true;
    this.fileConfigsService.updateFileConfig({ 'MultipleTable': data.MultipleTable, 'HasProduction': data.HasProduction }).subscribe({
      next:(res) => {
        this.loading = false;
        this.notificationService.toastrSuccess(res.message + (res.tablesDeleted ? ' All tables were deleted.' : ''));
        this.loadConfig();
      },
      error:(err) => {
        this.loading = false;
        this.notificationService.toastrError(err.error.message);
        this.loadConfig();
      }
    });
  }

  onClose(){
    this.toolBoxService.onHome();
  }
}

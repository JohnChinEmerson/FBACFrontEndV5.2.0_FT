import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrintersService } from 'src/app/services/Files/printers.service';
import { NotificationService } from 'src/app/services/notification.service';

// Desktop Mariosoft.Files.UI PrinterUI
@Component({
  selector: 'app-printer-ui',
  templateUrl: './printer-ui.component.html',
  styleUrls: ['../table-ui/table-ui.component.css']
})
export class PrinterUIComponent implements OnInit {
  printerForm : FormGroup;
  printer     : any;
  isSaving    : boolean = false;

  constructor(
    private fb                  : FormBuilder,
    private printersService     : PrintersService,
    private notificationService : NotificationService,
    private dialogRef           : MatDialogRef<PrinterUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { }

  ngOnInit(): void {
    this.printer = this.data[0];
    var isCashier = this.printer?.Area?.toLowerCase() == 'cashier';
    this.printerForm = this.fb.group({
      id          : [this.printer ? this.printer.id : 0],
      Area        : [{ value: this.printer ? this.printer.Area : '', disabled: isCashier }, Validators.required],
      PrinterName : [this.printer ? this.printer.PrinterName : '', Validators.required],
    });
  }

  onSubmit(){
    if (this.printerForm.invalid) {
      this.printerForm.markAllAsTouched();
      return this.notificationService.toastrWarning('Empty Field.');
    }
    this.isSaving = true;
    this.printersService.savePrinter(this.printerForm.getRawValue()).subscribe({
      next:(res) => {
        this.isSaving = false;
        this.notificationService.toastrSuccess(res.message);
        if (this.printer) {
          this.dialogRef.close(res.printer);
        } else {
          this.printerForm.patchValue({ Area: '', PrinterName: '' });
        }
      },
      error:(err) => {
        this.isSaving = false;
        this.notificationService.toastrError(err.error.message);
      }
    });
  }

  onClose(){
    this.dialogRef.close();
  }
}

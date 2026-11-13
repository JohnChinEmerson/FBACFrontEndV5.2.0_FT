import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MenuReportsService } from 'src/app/services/Menus/menu-reports.service';
import { NotificationService } from 'src/app/services/notification.service';

// Desktop Mariosoft.Costing.UI IngredientsUsedUI: recipe ingredients consumed by the day's sales;
// only PhysicalCount is editable, Variance = PhysicalCount - (Available - QtyUsed).
@Component({
  selector: 'app-ingredients-used-ui',
  templateUrl: './ingredients-used-ui.component.html',
  styleUrls: ['../menus-shared.css']
})
export class IngredientsUsedUIComponent implements OnInit {
  inputDate   : string;
  rows        : any[] = [];
  isLoading   : boolean = false;
  isSaving    : boolean = false;

  constructor(
    private menuReportsService  : MenuReportsService,
    private notificationService : NotificationService,
    private dialogRef           : MatDialogRef<IngredientsUsedUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { }

  async ngOnInit(): Promise<void> {
    this.inputDate = this.data[0];
    this.isLoading = true;
    try {
      this.rows = await firstValueFrom(this.menuReportsService.getIngredientsUsedByDate(this.inputDate));
    } finally {
      this.isLoading = false;
    }
  }

  updatePhysicalCount(event: any, row: any){
    var value = parseFloat(String(event.target.value).replace(/,/g, ''));
    if (isNaN(value) || value < 0) {
      event.target.value = row.PhysicalCount;
      return this.notificationService.toastrWarning('Invalid PhysicalCount.');
    }
    row.PhysicalCount = value;
    row.Variance = value - (+row.SystemCount);
  }

  get totalCost(){
    return this.rows.reduce((total, row) => total + (+row.TotalCost || 0), 0);
  }

  onClickSave(){
    if (this.rows.length == 0) return this.notificationService.toastrWarning('No records found.');
    this.notificationService.popupWarning('Save', 'Ingredients used will be deducted from the stocks and variances booked as stock adjustments. Continue?').then((result) => {
      if (!result.value) return;
      this.isSaving = true;
      var payload = {
        'InputDate' : this.inputDate,
        'rows'      : this.rows.map(r => ({ 'ItemId': r.ItemId, 'PhysicalCount': r.PhysicalCount })),
      };
      this.menuReportsService.saveEndOfDayInventory(payload).subscribe({
        next:(res) => {
          this.isSaving = false;
          this.notificationService.toastrSuccess(res.message);
          this.dialogRef.close(true);
        },
        error:(err) => {
          this.isSaving = false;
          this.notificationService.toastrError(err.error.message);
        }
      });
    });
  }

  onClose(){
    this.dialogRef.close();
  }
}

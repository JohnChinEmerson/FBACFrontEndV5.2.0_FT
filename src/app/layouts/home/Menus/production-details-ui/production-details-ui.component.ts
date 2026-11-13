import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MenuReportsService } from 'src/app/services/Menus/menu-reports.service';
import { NotificationService } from 'src/app/services/notification.service';

// Desktop Mariosoft.Costing.UI ProductionDetailsUI: produced items (Stock In) and the components used (Stock Out).
@Component({
  selector: 'app-production-details-ui',
  templateUrl: './production-details-ui.component.html',
  styleUrls: ['../menus-shared.css']
})
export class ProductionDetailsUIComponent implements OnInit {
  receipt     : any;
  produced    : any[] = [];
  consumed    : any[] = [];
  selected    : any = null;
  isLoading   : boolean = false;

  constructor(
    private menuReportsService  : MenuReportsService,
    private notificationService : NotificationService,
    private dialogRef           : MatDialogRef<ProductionDetailsUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { }

  ngOnInit(): void {
    this.receipt = this.data[0];
    this.loadDetails();
  }

  async loadDetails(){
    this.isLoading = true;
    try {
      var details: any[] = await firstValueFrom(this.menuReportsService.getProductionDetails(this.receipt.ProductionNo));
      this.produced = details.filter(x => x.AdjustmentType?.toLowerCase() == 'stockin');
      this.consumed = details.filter(x => x.AdjustmentType?.toLowerCase() == 'stockout');
    } finally {
      this.isLoading = false;
    }
    this.selected = null;
  }

  onClickDelete(){
    if (!this.selected) return this.notificationService.toastrWarning('No Record Selected.');
    if (this.selected.RecordStatus != 'open') return this.notificationService.toastrWarning('Item is already ' + this.selected.RecordStatus + '.');
    this.notificationService.popupWarning('Delete', this.selected.ItemName + ' under ' + this.receipt.ProductionNo + ' will be DELETED and its components put back. Continue?').then((result) => {
      if (result.value) {
        this.menuReportsService.deleteProductionDetail(this.selected.id).subscribe({
          next:(res) => {
            this.notificationService.toastrSuccess(res.message);
            this.loadDetails();
          },
          error:(err) => this.notificationService.toastrHttpError(err)
        });
      }
    });
  }

  onClose(){
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { MenuCostingService } from 'src/app/services/Menus/menu-costing.service';
import { NotificationService } from 'src/app/services/notification.service';

// Desktop Mariosoft.Costing.UI UMConvertionUI (+ Files.UI ConversionsUI / ConversionUI), opened by
// double-clicking the UM of a menu component:
//  - pick the unit the component's QtyUsed is entered in; new cost = old cost x rate(from) / rate(to)
//  - add / edit / delete the item's conversions "1 UnitFrom = ConvertionRate UnitTo"
@Component({
  selector: 'app-um-convertion-ui',
  templateUrl: './um-convertion-ui.component.html',
  styleUrls: ['../menus-shared.css', './um-convertion-ui.component.css']
})
export class UMConvertionUIComponent implements OnInit {
  component       : any;
  info            : any = null;
  units           : any[] = [];
  unitTo          : string = null;
  convertions     : any[] = [];
  unitCategories  = ['Weight', 'Volume', 'Count/Piece', 'Length'];
  form            : any = { id: 0, UnitTo: '', ConvertionRate: null, UnitCategory: null };
  selectedId      : number = null;
  loading         : boolean = false;
  changed         : boolean = false;

  constructor(
    private menuCostingService  : MenuCostingService,
    private notificationService : NotificationService,
    private dialogRef           : MatDialogRef<UMConvertionUIComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { }

  async ngOnInit(): Promise<void> {
    this.component = this.data[0];
    await this.loadUnits();
  }

  // Desktop LoadUMs + DisplayConvertion
  async loadUnits(){
    this.loading = true;
    try {
      this.info = await firstValueFrom(this.menuCostingService.getComponentUMs(this.component.id));
      this.units = this.info.Units || [];
      this.convertions = this.info.Convertions || [];
      if (!this.unitTo || !this.units.some(u => u.UnitTo == this.unitTo)) this.unitTo = this.info.UnitFrom;
    } catch (err: any) {
      this.notificationService.toastrError(err?.error?.message);
    } finally {
      this.loading = false;
    }
  }

  get toRate(): number {
    return +(this.units.find(u => u.UnitTo == this.unitTo)?.ConvertionRate || 1);
  }

  // Desktop cboUnitTo_SelectedIndexChanged: newCost = oldCost * oldConvertionRate / convertionRate
  get newCost(): number {
    if (!this.info) return 0;
    return +this.info.Cost * +this.info.FromRate / this.toRate;
  }

  get description(): string {
    var rate = this.form.ConvertionRate == null || this.form.ConvertionRate === '' ? 0 : +this.form.ConvertionRate;
    return '1 ' + (this.info?.BaseUM || '') + ' = ' + rate + ' ' + (this.form.UnitTo || '');
  }

  // Desktop btnUpdate_Click
  onClickUpdate(){
    if (!this.unitTo) return this.notificationService.toastrWarning('Select the Unit To.');
    if (this.unitTo == this.info.UnitFrom) return this.dialogRef.close(this.changed);
    this.loading = true;
    this.menuCostingService.updateComponentUM(this.component.id, this.unitTo).subscribe({
      next:(res) => {
        this.loading = false;
        this.notificationService.toastrSuccess('UM changed to ' + this.unitTo + '.');
        this.dialogRef.close(res);
      },
      error:(err) => {
        this.loading = false;
        this.notificationService.toastrError(err.error.message);
      }
    });
  }

  // ---------- conversions (Desktop ConversionsUI / ConversionUI) ----------
  onSelectConvertion(c: any){
    this.selectedId = c.id;
    this.form = { id: c.id, UnitTo: c.UnitTo, ConvertionRate: +c.ConvertionRate, UnitCategory: c.UnitCategory };
  }

  onClickNew(){
    this.selectedId = null;
    this.form = { id: 0, UnitTo: '', ConvertionRate: null, UnitCategory: null };
  }

  onSaveConvertion(){
    var unitTo = (this.form.UnitTo || '').trim();
    var rate = +this.form.ConvertionRate;
    if (!unitTo) return this.notificationService.toastrWarning('Input UnitTo.');
    if (!(rate > 0)) return this.notificationService.toastrWarning('ConvertionRate should be greater than zero.');
    if (!this.form.UnitCategory) return this.notificationService.toastrWarning('Select the Category.');
    this.loading = true;
    this.menuCostingService.saveUMConvertion({
      'id'             : this.form.id,
      'UnitId'         : this.info.UnitId,
      'ItemId'         : this.info.ComponentId,
      'UnitTo'         : unitTo,
      'ConvertionRate' : rate,
      'UnitCategory'   : this.form.UnitCategory,
    }).subscribe({
      next:async (res) => {
        this.notificationService.toastrSuccess(res.message);
        this.changed = true;
        this.onClickNew();
        await this.loadUnits();
      },
      error:(err) => {
        this.loading = false;
        this.notificationService.toastrError(err.error.message);
      }
    });
  }

  onDeleteConvertion(c: any, event?: any){
    if (event) event.stopPropagation();
    this.notificationService.popupWarning('Delete', c.UnitTo + ' will be DELETED. Continue?').then((result) => {
      if (!result.value) return;
      this.menuCostingService.deleteUMConvertion(c.id).subscribe({
        next:async (res) => {
          this.notificationService.toastrSuccess(res.message);
          if (this.selectedId == c.id) this.onClickNew();
          await this.loadUnits();
        },
        error:(err) => this.notificationService.toastrError(err.error.message)
      });
    });
  }

  onClose(){
    this.dialogRef.close(this.changed);
  }
}

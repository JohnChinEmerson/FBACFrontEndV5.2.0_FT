import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ItemsService } from 'src/app/services/Files/items.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ItemCategorysUIComponent } from '../item-categorys-ui/item-categorys-ui.component';
import { ItemUnitsUIComponent } from '../item-units-ui/item-units-ui.component';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { ItemUnitsService } from 'src/app/services/Files/item-units.service';
import { ItemTypesUIComponent } from '../item-types-ui/item-types-ui.component';
import { ItemTypesService } from 'src/app/services/Files/item-types.service';
import { VATTypesService } from 'src/app/services/Files/vattypes.service';
import { ItemExpiryDatesUIComponent } from '../../Inventory/item-expiry-dates-ui/item-expiry-dates-ui.component';
import { ItemPriceCategorysUIComponent } from '../item-price-categorys-ui/item-price-categorys-ui.component';
import { ReceivingAveCostHistoryUIComponent } from '../../Receiving/receiving-ave-cost-history-ui/receiving-ave-cost-history-ui.component';
import { SerialNosUIComponent } from '../serial-nos-ui/serial-nos-ui.component';
import { BranchUpdateUIComponent } from '../branch-update-ui/branch-update-ui.component';
import { FileConfigsService } from 'src/app/services/Files/file-configs.service';

@Component({
  selector: 'app-item-ui',
  templateUrl: './item-ui.component.html',
  styleUrls: ['./item-ui.component.css']
})
export class ItemUIComponent implements OnInit {
  btnText               : string = "Save";
  unitMeasures          : any=[];
  vATTypes              : any=[];
  categorys             : any=[];
  itemTypes             : any=[];
  item                 : any=[];
  items                 : any=[];
  // Desktop ItemUI opened from Receiving / PO / Canvass / Stock Adjustment (stock-in): Available stays 0, the transaction adds the stock
  lockAvailable         : boolean = false;
  btnTextToEdit         : boolean = false;
  loading               : boolean = false;
  chkSerial             : boolean = false;
  chkMultiple           : boolean = false;
  chkExpiry             : boolean = false;
  aliasEdited           : boolean = false;
  type                  : string;
  itemForm = new FormGroup({
      id            : new FormControl(''),
      ItemId        : new FormControl('generated'),
      ItemName      : new FormControl(''),
      Alias         : new FormControl(''),
      UM            : new FormControl(''),
      Category      : new FormControl(''),
      Cost          : new FormControl(0),
      AveCost          : new FormControl(0),
      Price         : new FormControl(0),
      Available     : new FormControl(0),
      AlertQty      : new FormControl(0),
      HasInventory  : new FormControl('yes'),
      Consumable    : new FormControl('yes'),
      ForSale       : new FormControl('yes'),
      HasMultiplePrice : new FormControl('no'),
      HasExpiry : new FormControl('no'),
      // not shown on the form any more; an edited item keeps its saved UseFor (see getItemFormData)
      UseFor : new FormControl(null),
      ItemType     : new FormControl(''),
      AveCostMethod      : new FormControl('Average Costing Method'),
      VATType       : new FormControl('VAT'),
      VATValue      : new FormControl(1.12),
  });

  constructor(
    private dialog                      : MatDialog,
    private dialogRef                   : MatDialogRef<ItemUIComponent>,
    private itemService                 : ItemsService,
    private itemCategorysService        : ItemCategorysService,
    private itemUnitsService            : ItemUnitsService,
    private itemTypesService            : ItemTypesService,
    private vATTypesService           : VATTypesService,
    private fileConfigsService         : FileConfigsService,
    private notif                       : NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.getUnitMeasures();
    this.getCategory();
    this.getItemTypes();
    this.getVATTypes();
    this.itemUnitsService.requiredRefresh.subscribe(()=>{
      this.getUnitMeasures();
    });
    this.itemCategorysService.requiredRefresh.subscribe(()=>{
      this.getCategory();
    });
    this.itemTypesService.requiredRefresh.subscribe(()=>{
      this.getItemTypes();
    });
    if (this.data) {
      this.item = this.data[0];
      this.type = this.data[1];
      this.items = this.data[2];
      this.lockAvailable = ['receiving', 'po', 'canvass'].includes(this.type)
                          || (this.type == 'stockadjustment' && (this.data[3] ?? '').toLowerCase() == 'stockin');
      if (this.item) {
        this.btnText = "Update";
        this.getItemFormData();
      }
    }
  }

  async getCategory(){
    this.categorys      = await firstValueFrom(this.itemCategorysService.getCategorys());
  }
  async getUnitMeasures(){
    this.unitMeasures   = await firstValueFrom(this.itemUnitsService.getUnitMeasures());
  }
  async getItemTypes(){
    const itemTypes     = await firstValueFrom(this.itemTypesService.getItemTypes());
    const config        = await firstValueFrom(this.fileConfigsService.getFileConfig());
    const hasProduction = config?.HasProduction?.toLowerCase() != 'no';
    // Desktop ItemUI.LoadItemTypes removes production item types when Files Config HasProduction = no
    // (an edited item keeps its current type so the field is not blanked)
    this.itemTypes      = itemTypes.filter(x => (x.ItemType ?? '').toLowerCase() != 'item'
                            && (hasProduction || (x.ForProduction ?? '').toLowerCase() != 'yes' || this.sameItemType(x.ItemType, this.item?.ItemType)));
    // items from desktop data may say "Ad-on" where the web list says "Add-on": show the list's spelling
    const listed = this.itemTypes.find(x => this.sameItemType(x.ItemType, this.itemForm.controls['ItemType'].value));
    if(listed) this.itemForm.controls['ItemType'].setValue(listed.ItemType);
    // Desktop ItemUI.LoadItemTypes defaults new items to "Finish Product"
    if(this.btnText == 'Save' && !this.itemTypes.some(x => x.ItemType == this.itemForm.controls['ItemType'].value)){
      const defaultType = this.itemTypes.find(x => x.ItemType == 'Finish Product');
      this.itemForm.controls['ItemType'].setValue(defaultType ? defaultType.ItemType : '');
    }
    this.onChangeItemType(this.itemForm.controls['ItemType'].value);
  }
  async getVATTypes(){
    this.vATTypes      = await firstValueFrom(this.vATTypesService.getCBOVATTypes());
  }
  getItemFormData(){
    this.itemForm.controls['id'].setValue(this.item.id);
    this.itemForm.controls['ItemId'].setValue(this.item.ItemId);
    this.itemForm.controls['Category'].setValue(this.item.Category);
    this.itemForm.controls['ItemName'].setValue(this.item.ItemName);
    this.itemForm.controls['Alias'].setValue(this.item.Alias || this.createAlias(this.item.ItemName || ''));
    // a saved alias that differs from the generated one was typed by the user: keep it when the name changes
    this.aliasEdited = !!this.item.Alias && this.item.Alias != this.createAlias(this.item.ItemName || '');
    this.itemForm.controls['Cost'].setValue(this.item.Cost);
    this.itemForm.controls['Price'].setValue(this.item.Price);
    this.itemForm.controls['Available'].setValue(this.item.Available);
    this.itemForm.controls['HasInventory'].setValue(this.item.HasInventory);
    this.itemForm.controls['Consumable'].setValue(this.item.Consumable);
    this.itemForm.controls['ForSale'].setValue(this.item.ForSale);
    this.itemForm.controls['ItemType'].setValue(this.item.ItemType);
    this.itemForm.controls['VATType'].setValue(this.item.VATType);
    this.itemForm.controls['VATValue'].setValue(this.item.VATValue);
    this.itemForm.controls['AlertQty'].setValue(this.item.AlertQty);
    this.itemForm.controls['UM'].setValue(this.item.UM);
    // an item saved as not tagged ('unset') shows the field empty
    this.itemForm.controls['UseFor'].setValue((this.item.UseFor || '').toLowerCase() == 'unset' ? null : this.item.UseFor || null);
    this.itemForm.controls['AveCost'].setValue(this.item.AveCost);
    this.itemForm.controls['AveCostMethod'].setValue(this.item.AveCostMethod);

    this.chkMultiple = this.item.HasMultiplePrice == 'yes';
    this.chkExpiry = this.item.HasExpiry == 'yes';
    this.chkSerial = this.item.SerializedQty == 'yes';

    this.onChangeHasInventory(this.item.HasInventory);
    this.onChangeItemType(this.item.ItemType);
  }

  onSubmit(){
    this.loading = true;
    this.itemService.saveEditItems(this.itemForm.getRawValue(), this.btnText).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);

        if(this.btnText == 'Save'){
          this.items = [res.item,...this.items];
          this.resetForm();
          this.loading = false;
          if(this.type == 'order' || this.type == 'sales' ||this.type == 'canvass'||this.type == 'receiving'||this.type == 'po'||this.type == 'stockadjustment' ){
            this.dialogRef.close(res.item);
          }else{
            if(this.chkMultiple){
              this.onClickOtherPriceCategories(res.item);
            }
            if(this.chkExpiry){
              this.onClickExpiryDates(res.item);
            }
            if(this.chkSerial){
              this.onClickSerialNos(res.item);
            }
          }
        }
        else{
          if(this.chkMultiple){
            this.onClickOtherPriceCategories(res.item);
          }
           if(this.chkExpiry){
            this.onClickExpiryDates(res.item);
          }
          if(this.chkSerial){
            this.onClickSerialNos(res.item);
          }
          this.dialogRef.close(res.item);
          this.loading = false;
        }
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  onClickUM(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(ItemUnitsUIComponent,dialogConfig);
  }

  onClickCategory(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = 'items';
    this.dialog.open(ItemCategorysUIComponent,dialogConfig);
  }

  onClickItemType(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    this.dialog.open(ItemTypesUIComponent,dialogConfig);
  }

  onChangeHasInventory(hasInventory){
    const locked = (hasInventory ?? '').toLowerCase() == 'no';
    this.setEnabled(['Available', 'AlertQty'], !locked);
    if(this.lockAvailable) this.itemForm.controls['Available'].disable();
  }

  // Desktop ItemUI.cboItemType_SelectedIndexChanged / ToogleAvailable / TooglePriceCost:
  // HasInventory and ForSale come from the item type; Available / AlertQty are read-only when the type has no inventory,
  // Cost / Price only enabled when the type is not ForCosting (computed by Menu Costing).
  // A new item starts these four fields at 0 on every type change; an edited item gets its saved values back,
  // so changing the type never posts an Inventory Variance.
  onChangeItemType(itemType){
    const selected = this.itemTypes.find(x => this.sameItemType(x.ItemType, itemType));
    if(!selected) return;

    this.itemForm.controls['HasInventory'].setValue((selected.HasInventory ?? 'yes').toLowerCase());
    this.itemForm.controls['ForSale'].setValue((selected.ForSale ?? 'yes').toLowerCase());
    this.onChangeHasInventory(this.itemForm.controls['HasInventory'].value);
    this.setEnabled(['Cost', 'Price'], (selected.ForCosting ?? '').toLowerCase() == 'no');

    const editing = this.btnText == 'Update' && this.item;
    this.itemForm.patchValue({
      Available : editing ? this.item.Available : 0,
      AlertQty  : editing ? this.item.AlertQty : 0,
      Cost      : editing ? this.item.Cost : 0,
      Price     : editing ? this.item.Price : 0,
    });
    if(!editing) this.itemForm.controls['AveCost'].setValue(0);
  }

  private setEnabled(controls: string[], enabled: boolean){
    controls.forEach(c => enabled ? this.itemForm.controls[c].enable() : this.itemForm.controls[c].disable());
  }

  // desktop data spells the add-on type "Ad-on", the web item types "Add-on": both are the same type
  sameItemType(a: string, b: string){
    const norm = (t: string) => (t ?? '').trim().toLowerCase().replace(/^add-on$/, 'ad-on');
    return !!a && norm(a) == norm(b);
  }

  onClickAveCostHistory(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1500px';
    dialogConfig.data        = this.item;
    this.dialog.open(ReceivingAveCostHistoryUIComponent,dialogConfig);

  }
  // Desktop ItemUI.txtItemName_TextChanged: the alias follows the item name until the user edits it
  onChangeItemName(){
    if(this.aliasEdited) return;
    this.itemForm.controls['Alias'].setValue(this.createAlias(this.itemForm.controls['ItemName'].value || ''));
  }

  onChangeAlias(){
    // clearing the alias hands it back to the automatic value
    this.aliasEdited = (this.itemForm.controls['Alias'].value || '') != '';
    if(!this.aliasEdited) this.onChangeItemName();
  }

  // Desktop ItemUI.CreateAlias: first word + first 3 letters of each middle word + last word
  createAlias(itemName: string){
    const words = itemName.split(' ');
    const shortWords = [words[0]];
    for(let i = 1; i < words.length - 1; i++){
      shortWords.push(words[i].length > 3 ? words[i].substring(0, 3) : words[i]);
    }
    if(words.length > 1) shortWords.push(words[words.length - 1]);
    return shortWords.join('');
  }

  onChangeVATType(data){
    this.itemForm.controls['VATValue'].setValue(data.VATValue);
  }

  onCheckMultiple(value){
    this.chkMultiple  = value;
  }

  onCheckWithExpiry(value){
    this.chkExpiry  = value;
  }

  onChangeAveCost(event){
    this.itemForm.controls['AveCost'].setValue(event.target.value);
  }
  onCheckWSerial(value){
    this.chkSerial  = value;

  }

  onClickExpiryDates(data){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data        = [data, 'items'];
    this.dialog.open(ItemExpiryDatesUIComponent,dialogConfig);
  }

  onClickOtherPriceCategories(data){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '800px';
    dialogConfig.data        = ([data, 'items', data.UM]);
    this.dialog.open(ItemPriceCategorysUIComponent,dialogConfig);
  }

  onClickSerialNos(data){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '1000px';
    dialogConfig.data        = ([data, 'items']);
    this.dialog.open(SerialNosUIComponent,dialogConfig);
  }

  onClickBranchUpdateUI(){
    const dialogConfig        = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = '500px';
    dialogConfig.data        = false;
    this.dialog.open(BranchUpdateUIComponent,dialogConfig);
  }

  // Desktop ItemUI.ResetForm: UM, Category and ItemType stay for the next item, Consumable goes back to "yes"
  resetForm(){
    this.itemForm.controls['id'].setValue('');
    this.itemForm.controls['ItemId'].setValue('generated');
    this.itemForm.controls['ItemName'].setValue('');
    this.itemForm.controls['Alias'].setValue('');
    this.aliasEdited = false;
    this.itemForm.controls['Consumable'].setValue('yes');
    this.itemForm.controls['Cost'].setValue('0');
    this.itemForm.controls['Price'].setValue('0');
    this.itemForm.controls['Available'].setValue('0');
    this.itemForm.controls['AlertQty'].setValue('0');
  }



  onClose(){
    if(this.type == 'items'){
      this.dialogRef.close(this.items);
    }else{
      this.dialogRef.close();
    }
  }
}

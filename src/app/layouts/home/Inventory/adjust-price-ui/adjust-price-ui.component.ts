import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ItemCategorysService } from 'src/app/services/Files/item-categorys.service';
import { StocksTotalsService } from 'src/app/services/Inventory/stocks-totals.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-adjust-price-ui',
  templateUrl: './adjust-price-ui.component.html',
  styleUrls: ['./adjust-price-ui.component.css']
})
export class AdjustPriceUIComponent implements OnInit {
  btnText     : string = "Save";
  categorys   : any=[];
  loading     : boolean = false;

  adjustPriceForm = new FormGroup({
      Category    : new FormControl(''),
      MarkUp      : new FormControl(''),
      MarkUpType  : new FormControl('percent'),
      IsRoundOff  : new FormControl(''),
  });

  constructor(
    private dialogRef : MatDialogRef<AdjustPriceUIComponent>,
    private itemCategorysService : ItemCategorysService,
    private stocksTotalsService : StocksTotalsService,
    private notif : NotificationService,
  ) { }

  ngOnInit(): void {
    this.getCategory();
    this.itemCategorysService.requiredRefresh.subscribe(()=>{
      this.getCategory();
    });
    this.onCheck(true);
  }

  async getCategory(){
    this.categorys      = await firstValueFrom(this.itemCategorysService.getCategorys());
    var a:any = {
      'Category' : 'All',
    }
    this.categorys.push(a);
  }

  onSubmit(){
    this.loading = true;
    this.stocksTotalsService.adjustMarkUp(this.adjustPriceForm.getRawValue()).subscribe({
      next:(res)=>{
        this.notif.toastrSuccess(res.message);
        this.loading = false;
        this.dialogRef.close();
        localStorage.removeItem('Category');
      },
      error:(err)=> {
        this.notif.toastrError(err.error.message);
        this.loading = false;
      },
    });
  }

  onCheck(check){
    this.adjustPriceForm.controls['IsRoundOff'].setValue(check);
  }

  onChangeCategory(category){
    localStorage.setItem('Category', category.Category);
    this.stocksTotalsService.requiredRefresh.next();
  }

}

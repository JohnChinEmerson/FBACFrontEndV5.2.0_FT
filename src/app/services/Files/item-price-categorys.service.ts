import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class ItemPriceCategorysService {

  private _refreshrequired=new Subject<void>();
  branch = new HttpHeaders({
    'Content-Type': 'application/json',
    'AuthBranchId': `${this.auth.Branch ? this.auth.Branch.BranchId : ""}`,
    'UserId': `${this.auth.LoginId}`,
    'Edition': `${this.auth.Edition}`,
     
    'Token': `${localStorage.getItem('SessionToken')}`
  });

  BranchId : any;
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private toolbox: ToolBoxService,
  ) { 
    this.BranchId ={ headers: this.branch};
  }

  get requiredRefresh(){
    return this._refreshrequired;
  }

  getItemPriceCategoryByPriceCategoryByItemIdByUM(priceCategoryId, itemId, UM) : Observable<any>{
    return this.http.get<any>(_url+'getItemPriceCategoryByPriceCategoryByItemIdByUM/'+priceCategoryId+'/'+itemId+'/'+UM, this.BranchId);
  }
  getItemPriceCategoryByItemIdByUMByPriceCategoryByPriceWithMinimumQty(itemId, um, priceCategoryId, price, withMinimumQty) : Observable<any>{
    return this.http.get<any>(_url+'getItemPriceCategoryByItemIdByUMByPriceCategoryByPriceWithMinimumQty/'+itemId+'/'+um+'/'+priceCategoryId+'/'+price+'/'+withMinimumQty, this.BranchId);
  }
  saveItemPriceCategorysByPriceCategoryIdByItemId(data, itemId, um) : Observable<any>{
    return this.http.post<any>(_url+'saveItemPriceCategorysByPriceCategoryIdByItemId/'+itemId+'/'+um, data, this.BranchId);
  }
  deleteItemPriceCategory(itemPriceCategoryId) : Observable<any>{
    return this.http.get<any>(_url+'deleteItemPriceCategory/'+itemPriceCategoryId, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
   
}

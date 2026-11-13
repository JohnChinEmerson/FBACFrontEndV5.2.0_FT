import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenuCostingService {

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
  ) {
    this.BranchId ={ headers: this.branch};
  }

  get requiredRefresh(){
    return this._refreshrequired;
  }

  getItemTypesForCosting() : Observable<any>{
    return this.http.get<any>(_url+'getItemTypesForCosting',this.BranchId);
  }

  getItemsForCosting(itemType) : Observable<any>{
    return this.http.get<any>(_url+'getItemsForCosting/'+encodeURIComponent(itemType),this.BranchId);
  }

  updateMenuPrice(itemId, price) : Observable<any>{
    return this.http.post<any>(_url+'updateMenuPrice/'+itemId,{ 'Price': price }, this.BranchId);
  }

  getItemComponentsByProductId(productId) : Observable<any>{
    return this.http.get<any>(_url+'getItemComponentsByProductId/'+productId,this.BranchId);
  }

  getItemTypesForComponents() : Observable<any>{
    return this.http.get<any>(_url+'getItemTypesForComponents',this.BranchId);
  }

  getItemsForComponents(productId, itemType) : Observable<any>{
    return this.http.get<any>(_url+'getItemsForComponents/'+productId+'/'+encodeURIComponent(itemType),this.BranchId);
  }

  // every component change recomputes the product cost, so the costing list refreshes
  addItemComponents(productId, itemIds: any[]) : Observable<any>{
    return this.http.post<any>(_url+'addItemComponents',{ 'ProductId': productId, 'ItemIds': itemIds }, this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  updateQtyMade(productId, qtyMade) : Observable<any>{
    return this.http.post<any>(_url+'updateQtyMade/'+productId,{ 'QtyMade': qtyMade }, this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  updateComponentQtyUsed(id, qtyUsed) : Observable<any>{
    return this.http.post<any>(_url+'updateComponentQtyUsed/'+id,{ 'QtyUsed': qtyUsed }, this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  getComponentUMs(id) : Observable<any>{
    return this.http.get<any>(_url+'getComponentUMs/'+id,this.BranchId);
  }

  updateComponentUM(id, um) : Observable<any>{
    return this.http.post<any>(_url+'updateComponentUM/'+id,{ 'UM': um }, this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  // Desktop ConversionsUI / ConversionUI (UMConvertions of a component item)
  saveUMConvertion(data: any) : Observable<any>{
    return this.http.post<any>(_url+'saveUMConvertion', data, this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  deleteUMConvertion(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteUMConvertion/'+id,this.BranchId);
  }

  toggleComponentReturnable(id) : Observable<any>{
    return this.http.get<any>(_url+'toggleComponentReturnable/'+id,this.BranchId);
  }

  deleteItemComponent(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteItemComponent/'+id,this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }

  deleteItemComponentsByProductId(productId) : Observable<any>{
    return this.http.get<any>(_url+'deleteItemComponentsByProductId/'+productId,this.BranchId).pipe(
      tap(()=>{ this.requiredRefresh.next(); })
    );
  }
}

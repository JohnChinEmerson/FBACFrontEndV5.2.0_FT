import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class MultipleUMsService {

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

  getMultipleUMsByItemId(itemId) : Observable<any>{
    return this.http.get<any>(_url+'getMultipleUMsByItemId/'+itemId, this.BranchId);
  }

  loadMultipleUMsByItemId(itemId) : Observable<any>{
    return this.http.get<any>(_url+'loadMultipleUMsByItemId/'+itemId, this.BranchId);
  }

  getMultipleUMsItemsToBarcoding() : Observable<any>{
    return this.http.get<any>(_url+'getMultipleUMsItemsToBarcoding', this.BranchId);
  }

  saveEditMultipleUM(data,btnText) : Observable<any>{
    return this.http.post<any>(_url+'saveEditMultipleUM/'+btnText, data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  deleteMultipleUM(MultipleUMId) : Observable<any>{
    return this.http.get<any>(_url+'deleteMultipleUM/'+MultipleUMId, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  updateMultipleUMBarcode(ItemId,UM,  barcode) : Observable<any>{
    return this.http.get<any>(_url+'updateMultipleUMBarcode/'+ItemId+'/'+UM+'/'+barcode, this.BranchId);
    // .pipe(
    //   tap(()=>{
    //     this.requiredRefresh.next();
    //   })
    // );
  }
  updateMultipleUMPrice(itemId,um,  newPrice) : Observable<any>{
    return this.http.get<any>(_url+'updateMultipleUMPrice/'+itemId+'/'+um+'/'+newPrice,this.BranchId);
  }
}

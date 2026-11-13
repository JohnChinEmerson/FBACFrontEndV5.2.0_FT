import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class PrintersService {

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

  getPrinters() : Observable<any>{
    return this.http.get<any>(_url+'getPrinters',this.BranchId);
  }

  getPrinterById(id) : Observable<any>{
    return this.http.get<any>(_url+'getPrinterById/'+id,this.BranchId);
  }

  savePrinter(data: any) : Observable<any>{
    return this.http.post<any>(_url+'savePrinter',data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deletePrinter(id) : Observable<any>{
    return this.http.get<any>(_url+'deletePrinter/'+id,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  getPrinterItemsByPrinterId(printerId) : Observable<any>{
    return this.http.get<any>(_url+'getPrinterItemsByPrinterId/'+printerId,this.BranchId);
  }

  getUnassignedItemsByPrinterIdByCategory(printerId, category) : Observable<any>{
    return this.http.get<any>(_url+'getUnassignedItemsByPrinterIdByCategory/'+printerId+'/'+encodeURIComponent(category),this.BranchId);
  }

  assignPrinterItems(data: any) : Observable<any>{
    return this.http.post<any>(_url+'assignPrinterItems',data, this.BranchId);
  }

  deletePrinterItem(id) : Observable<any>{
    return this.http.get<any>(_url+'deletePrinterItem/'+id,this.BranchId);
  }

  deletePrinterItemsByPrinterId(printerId) : Observable<any>{
    return this.http.get<any>(_url+'deletePrinterItemsByPrinterId/'+printerId,this.BranchId);
  }
}

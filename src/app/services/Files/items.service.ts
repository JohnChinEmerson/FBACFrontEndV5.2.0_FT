import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
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

  getCBOItems() : Observable<any>{
    return this.http.get<any>(_url+'getCBOItems', this.BranchId);
  }
  getCBOItemsByCategory(category) : Observable<any>{
    return this.http.get<any>(_url+'getCBOItemsByCategory/'+category, this.BranchId);
  }
  getCBOItemsToSale() : Observable<any>{
    return this.http.get<any>(_url+'getCBOItemsToSale', this.BranchId);
  }

  getItemsToDisplay() : Observable<any>{
    return this.http.get<any>(_url+'getItemsToDisplay', this.BranchId);
  }
  getItemsToBarcoding() : Observable<any>{
    return this.http.get<any>(_url+'getItemsToBarcoding', this.BranchId);
  }
  getItemByItemId(ItemId) : Observable<any>{
    return this.http.get<any>(_url+'getItemByItemId/'+ItemId, this.BranchId);
  }
  
  // Desktop UploadExcelFileUI: every sheet of the items template; commit = false only checks it (preview)
  uploadItems(sheets: any[], commit: boolean) : Observable<any>{
    return this.http.post<any>(_url+'uploadItems', { sheets, commit }, this.BranchId).pipe(
      tap(()=>{
        if (commit) this.requiredRefresh.next();
      })
    );
  }

  saveEditItems(data: any, btnText) : Observable<any>{
    return this.http.post<any>(_url+'saveEditItems/'+btnText,data, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deleteItem(id) : Observable<any>{
    return this.http.get<any>(_url+'deleteItem/'+id, this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
 
  updateBarcode(ItemId, barcode) : Observable<any>{
    return this.http.get<any>(_url+'updateBarcode/'+ItemId+'/'+barcode, this.BranchId);
    // .pipe(
    //   tap(()=>{
    //     this.requiredRefresh.next();
    //   })
    // );
  }

  updateBranchBarcode(itemName, barcode) : Observable<any>{
    return this.http.get<any>(_url+'updateBranchBarcode/'+itemName+'/'+barcode, this.BranchId);
    // .pipe(
    //   tap(()=>{
    //     this.requiredRefresh.next();
    //   })
    // );
  }

  addItemPhoto(data: any) : Observable<any>{
    return this.http.post<any>(_url+'addItemPhoto',data);
  }
}

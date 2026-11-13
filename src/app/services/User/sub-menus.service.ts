import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class SubMenusService {

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
  getList() : Observable<any>{
    
    return this.http.get<any>(_url+'getSubMenus',this.BranchId);
  }

  getSubMenusByMenuId(MenuId:string, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getSubMenusByMenuId/'+MenuId,this.BranchId);
  }

  getSubMenusByMenuIdNotByAccessRightId(MenuId:string, AccessRightId, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getSubMenusByMenuIdNotByAccessRightId/'+MenuId+'/'+AccessRightId,this.BranchId);
  }

  saveEditSubMenu(data: any, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.post<any>(_url+'saveEditSubMenu',data,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }

  deleteSubMenuById(id:string) : Observable<any>{
    return this.http.get<any>(_url+'deleteSubMenuById/'+id,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
}

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { _url } from 'src/global-variables';
import { AuthService } from '../auth.service';
import { ToolBoxService } from '../tool-box.service';

@Injectable({
  providedIn: 'root'
})
export class AccessRightSubMenuButtonsService {

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
  getAccessRightSubMenuButtonsByAccessRightIdBySubMenuId(AccessRightId, SubMenuId, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getAccessRightSubMenuButtonsByAccessRightIdBySubMenuId/'+AccessRightId+'/'+SubMenuId,this.BranchId);
  }

  getAccessRightSubMenuButtonsByAccessRightIdBySubMenuIdForAction(AccessRightId, SubMenuId, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.get<any>(_url+'getAccessRightSubMenuButtonsByAccessRightIdBySubMenuIdForAction/'+AccessRightId+'/'+SubMenuId,this.BranchId);
  }
  getListByIdSubMenuId(accessRightId:string,subMenuButtonId:string) : Observable<any>{
    return this.http.get<any>(_url+'GetAccessRightSubMenuButtonsByIdSubMenuId/'+accessRightId+'/'+subMenuButtonId,this.BranchId);
  }
  getListById(id:string) : Observable<any>{
    return this.http.get<any>(_url+'GetAccessRightSubMenuButtonsById/'+id,this.BranchId);
  }
  addAccessRightSubMenuButton(data: any, AcesssRight, BranchId) : Observable<any>{
    this.BranchId = this.toolbox.updateAuthorizationHeader(BranchId);
    return this.http.post<any>(_url+'addAccessRightSubMenuButton/'+AcesssRight,data,this.BranchId).pipe(
      tap(()=>{
        this.requiredRefresh.next();
      })
    );
  }
  deleteAccessRightSubMenuButtonById(id:string): Observable<any> {
    return this.http.get<any>(_url + 'deleteAccessRightSubMenuButtonById/'+id, this.BranchId).pipe(
      tap(() => {
        this.requiredRefresh.next();
      })
    );
  }
  
}

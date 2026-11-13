import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-sales-reports',
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.css']
})
export class SalesReportsComponent implements OnInit {
  branchId  : any;
  constructor(
    private authService : AuthService,
    private route : ActivatedRoute,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.branchId = params['branchId'];
    });
  }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-aprint-footer',
  templateUrl: './aprint-footer.component.html',
  styleUrls: ['./aprint-footer.component.css']
})
export class AprintFooterComponent implements OnInit {
  @Input() totalRecords: number;  // Input to receive total record count
  constructor() { }

  ngOnInit(): void {
  }

}

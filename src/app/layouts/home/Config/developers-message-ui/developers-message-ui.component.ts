import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _codingStandard, _systemTitle } from 'src/global-variables';

@Component({
  selector: 'app-developers-message-ui',
  templateUrl: './developers-message-ui.component.html',
  styleUrls: ['./developers-message-ui.component.css']
})
export class DevelopersMessageUIComponent implements OnInit {
  _systemTitle   = _systemTitle;
  _codingStandard = _codingStandard;
  constructor(
    private router: Router, 
  ) { }

  ngOnInit(): void {
  }
  onClose(){
    this.router.navigate(['home']);
  }

}

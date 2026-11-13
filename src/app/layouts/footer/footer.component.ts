import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from '../../services/auth.service';
import { UserGuideComponent } from '../home/UserGuide/user-guide/user-guide.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  // phones show the footer at the bottom of the side menu instead of fixed over the screen
  @Input() inSidenav: boolean = false;

  loginUser: string = this.authService.UserAccount.UserFullName.toUpperCase();
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  openLink() {
    window.open('https://mariosoftsolutions.ph/');
  }

  onClickDevelopersMessage() {
    this.router.navigate(['/home/config/developers_message']);
  }

  // opens the in-app User Guide popup; it shows the guide of the logged-in edition (all editions for NA / Default)
  onClickUserGuide() {
    this.dialog.open(UserGuideComponent, {
      width: '95vw',
      maxWidth: '1400px',
      height: '90vh',
      maxHeight: '90vh',
      autoFocus: false,
      panelClass: 'user-guide-dialog',
    });
  }

  onClickBackup() {
    this.router.navigate(['/home/config/backup']);
  }
}

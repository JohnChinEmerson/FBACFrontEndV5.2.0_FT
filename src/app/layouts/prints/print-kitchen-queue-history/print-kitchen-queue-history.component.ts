import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';

// Sales > Kitchen Queue > HISTORY print: the rows on screen (localStorage 'KitchenQueueHistory'), the filters used
// and who printed it / when.
@Component({
  selector: 'app-print-kitchen-queue-history',
  templateUrl: './print-kitchen-queue-history.component.html',
  styleUrls: ['./print-kitchen-queue-history.component.css']
})
export class PrintKitchenQueueHistoryComponent implements OnInit {
  history: any[] = [];
  Title: any;
  filters: string = '';
  printedBy: string = '';
  printedAt: Date = new Date();

  constructor(
    private auth: AuthService,
  ) { }

  @ViewChild('tableToExport') table: any;

  ngOnInit(): void {
    this.history = JSON.parse(localStorage.getItem('KitchenQueueHistory') || '[]');
    this.filters = localStorage.getItem('KitchenQueueHistoryFilters') || '';
    this.Title = localStorage.getItem('Title');
    this.printedBy = this.auth.UserAccount?.UserFullName || '';
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    localStorage.removeItem('KitchenQueueHistory');
    localStorage.removeItem('KitchenQueueHistoryFilters');
    localStorage.removeItem('Title');
  }

  getTotal(column){
    let sum = 0;
    this.history.forEach(x => {
      sum += +x[column];
    });
    return sum;
  }

  onClickPrint() {
    this.printedAt = new Date();
    setTimeout(() => window.print());
  }

  onClickExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.Title+'.xlsx');
  }
}

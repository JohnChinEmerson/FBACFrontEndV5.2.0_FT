import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { firstValueFrom } from 'rxjs';
import { DebtToCashCoverageService } from 'src/app/services/Accounting/debt-to-cash-coverage.service';
import { AuthService } from 'src/app/services/auth.service';
import { BranchesService } from 'src/app/services/Config/branches.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { HelperService } from 'src/app/services/helper.service';
import { MonthlyNetCashService } from 'src/app/services/Reports/monthly-net-cash.service';
import { ProfitPerformanceComponent } from '../home/Accounting/profit-performance/profit-performance.component';
import { ProfitPerformanceService } from 'src/app/services/Accounting/profit-performance.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  chartRef: Highcharts.Chart;
  chart2: Highcharts.Options = {
    title: {
      text: 'Transactions',
    },
    accessibility: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: true
    },
    xAxis: {
      categories: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Amount',
      },
    },
    series: [],
    chart: {
      type: 'column',
    }
  };
  selectedYear: string = new Date().getFullYear().toString();
  years: any = [] 
  totals: any =
  {
    SalesTotal: 0.00,
    PurchasesTotal: 0.00,
    PaymentsTotal: 0.00,
    SupplierPaymentsTotal: 0.00,
    ExpensesTotal: 0.00,
    ReceivablesTotal: 0.00,
    PayablesTotal: 0.00,
  };
  totalDash: any;
  branches : any;
  branchId : any; 
  type : string;
  fnbBranchId : any;
  financialsLoaded : boolean = false;
  topSellingProducts : any;
  debtToCashCoverage: any;
  profitPerformance: any;

  Highcharts2: typeof Highcharts = Highcharts;
  chartRef2!: Highcharts.Chart; // Reference to the Highcharts instance
  chartOptions2: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'white',  
    },
    title: {
      text: 'Net Cash',
    },
    xAxis: {
      categories: [], // X-axis categories (months)
      title: {
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Net Income',
      },
    },
    tooltip: {
      valueDecimals: 2,
    },
    series: [], // Initialize with empty series
    exporting: {
      enabled: true,
    },
  };
  
  Highcharts3: typeof Highcharts = Highcharts;
  chartRef3!: Highcharts.Chart; // Reference to the Highcharts instance
  chartOptionsPie: Highcharts.Options = {
    chart: { type: 'pie' },
    title: { text: 'Receivables vs. Payables' },
    plotOptions: {
      pie: {
        size: '80%',         // Make the pie larger
        innerSize: '50%',    // Optional: Make it a donut chart
        dataLabels: {
          enabled: true,     // Ensure labels are visible
          format: '{point.name}: {point.y:.2f}'
        }
      }
    },
    series: [{
      name: 'Amount',
      type: 'pie',
      data: []               // Will be updated dynamically
    }]
  };

  Highcharts4: typeof Highcharts = Highcharts;
  chartRef4: Highcharts.Chart;
  chart4: Highcharts.Options = {
    title: {
      text: 'Top Selling Products',
    },
    accessibility: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Qty',
      },
    },
    series: [],
    chart: {
      type: 'column',
    }
  };

  Highcharts5: typeof Highcharts = Highcharts;
  chartRef5: Highcharts.Chart;
  chart5: Highcharts.Options = {
    title: {
      text: 'Debt To Cash Coverage',
    },
    accessibility: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: true
    },
    xAxis: {
      categories: [], // will be set dynamically
    },
    yAxis: {
      title: {
        text: 'Amount',
      },
    },
    series: [],
    chart: {
      type: 'column',
    }
  };

  Highcharts6: typeof Highcharts = Highcharts;
  chartRef6: Highcharts.Chart;
  chart6: Highcharts.Options = {
    title: {
      text: 'Profit Performance',
    },
    accessibility: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: true
    },
    xAxis: {
      categories: [], // will be set dynamically
    },
    yAxis: {
      title: {
        text: 'Amount',
      },
    },
    series: [],
    chart: {
      type: 'column',
    }
  };

  total: any;
  profitLoss: any;

  constructor(
    private branchesService    : BranchesService,
    public auth               : AuthService,
    private dashboardService : DashboardService,
    private helperService : HelperService,
    private monthlyNetCashService : MonthlyNetCashService,
    private debtToCashCoverageService : DebtToCashCoverageService, 
    private profitPerformanceService : ProfitPerformanceService,
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getCBOBranches();
    this.DisplayTab('Dashboard');
  }

  // Dashboard = F&B owner view (one request); the yearly Financials charts load each time their tab is opened
  // (the tab is rebuilt by *ngIf, so its charts start empty again)
  DisplayTab(type){
    this.type = type.toLowerCase();
    if(this.type == 'financials') {
      if(!this.financialsLoaded) { this.financialsLoaded = true; this.getYears(); }
      this.FetchRecords();
    }
  }

  async getYears(){
    this.years = await firstValueFrom(this.helperService.getYears());
  }

  async getCBOBranches(){
    this.branches = await firstValueFrom(this.branchesService.getBranchesCBO());
    this.branchId = this.branches[0].BranchId;
    // the F&B dashboard is per branch: the logged-in branch, else the first real one
    this.fnbBranchId = this.auth.Branch?.BranchId || this.branchesWithoutAll[0]?.BranchId;
  }

  get branchesWithoutAll(){
    return (this.branches || []).filter(b => (b.BranchId || '').toString().toLowerCase() != 'all');
  }

  async FetchRecords() {
    // independent reports: fetched together
    var data:any;
    [this.totalDash, this.totals, this.topSellingProducts, this.debtToCashCoverage, this.profitPerformance, data] = await Promise.all([
      firstValueFrom(this.dashboardService.getDashboardYearlyTotals(this.selectedYear, this.branchId)),
      firstValueFrom(this.dashboardService.getDashboardTotalsByYear( this.selectedYear, this.branchId)),
      firstValueFrom(this.dashboardService.getDashboardTopSellingProductsByYear( this.selectedYear, this.branchId)),
      firstValueFrom(this.debtToCashCoverageService.getDebtToCashCoverageByYear(this.selectedYear,this.branchId)),
      firstValueFrom(this.profitPerformanceService.getProfitPerformanceByYear(this.selectedYear,this.branchId)),
      firstValueFrom(this.monthlyNetCashService.getMonthlyNetCashReportByYearByView( this.selectedYear, 'graph',this.branchId)),
    ]);
    this.profitLoss = data.profitLoss;
    this.total = data.total;
    if(this.type != 'financials') return;   // tab left before the reports came back: its charts are gone

    this.assignColumm(this.totalDash);
    this.assignColumm2(this.profitLoss);
    this.assignColumm3();
    this.assignColumm4(this.topSellingProducts);
    this.assignColumm5(this.debtToCashCoverage);
    this.assignColumm6(this.profitPerformance);
  }
  chartCallback: Highcharts.ChartCallbackFunction = chart => {
    this.chartRef = chart;
  };
  chartCallback2: Highcharts.ChartCallbackFunction = chart2 => {
    this.chartRef2 = chart2;
  };
  chartCallback3: Highcharts.ChartCallbackFunction = chart3 => {
    this.chartRef3 = chart3;
  };
  chartCallback4: Highcharts.ChartCallbackFunction = chart4 => {
    this.chartRef4 = chart4;
  };
   
  chartCallback5: Highcharts.ChartCallbackFunction = chart5 => {
    this.chartRef5 = chart5;
  };

  chartCallback6: Highcharts.ChartCallbackFunction = chart6 => {
    this.chartRef6 = chart6;
  };

  private assignColumm(data: any) {
    const chart = this.chartRef;
    if (chart.series.length > 0) {
      for (var i = chart.series.length - 1; i > -1; i--) {
        chart.series[i].remove();
      }
    }
    for (var i = 0; i < data.length; i++) {
      chart.addSeries({
        name: data[i].TransactionType,
        type: 'column',
        data: data[i].Data,
        tooltip: {
          pointFormatter: function () {
            return `<b>${Highcharts.numberFormat(this.y, 2, '.', ',')}</b>`;
          }
        }
      }, true, true);
    }
  }

  private assignColumm2(data: any) {

    const chart = this.chartRef2;

    while (this.chartRef2.series.length > 0) {
      this.chartRef2.series[0].remove(true);
    }

    const months = data.map((d) => d.Month);
    const amounts = data.map((d) => (d.NetIncome ? parseFloat(d.NetIncome) : 0));
    this.chartRef2.xAxis[0].setCategories(months, true);
    this.chartRef2.addSeries(
      {
        name: 'Net Income',
        type: 'line',
        data: amounts,
        tooltip: {
          pointFormatter: function () {
            return `<b>${Highcharts.numberFormat(this.y, 2, '.', ',')}</b>`;
          }
        }
      },
      true
    );
  }

  private assignColumm3() {
    if (this.chartRef3) {
      while (this.chartRef3.series.length > 0) {
        this.chartRef3.series[0].remove(true);
      }
  
      let receivables = this.totals.ReceivablesTotal;
      let payables = this.totals.PayablesTotal;
  
      this.chartRef3.addSeries({
        name: 'Amount',
        type: 'pie',
        data: [
          { name: 'Receivables', y: receivables, color: '#90ED7D' },
          { name: 'Payables', y: payables, color: '#F7A35C' }
        ],
        dataLabels: {
          enabled: true,
          formatter: function () {
            return `${this.point.name}: ${Highcharts.numberFormat(this.y, 2, '.', ',')}`;
          }
        },
        tooltip: {
          pointFormatter: function () {
            return `<b>${Highcharts.numberFormat(this.y, 2, '.', ',')}</b>`;
          }
        }
      }, true);
    }
  }

  private assignColumm4(data: any) {
    const chart = this.chartRef4;
  
    while (chart.series.length > 0) {
      chart.series[0].remove(true);
    }
  
    const categories = data.map((d) => d.Category);
    const amounts = data.map((d) => (d.Qty ? parseFloat(d.Qty) : 0));
  
    chart.xAxis[0].setCategories(categories, true);
  
    chart.addSeries(
      {
        name: 'Categories', 
        type: 'column',
        // color : 
        data: amounts,
        tooltip: {
          pointFormatter: function () {
            return `<b>${Highcharts.numberFormat(this.y, 2, '.', ',')}</b>`;
          }
        }
      },
      true
    );
  }

  private assignColumm5(data: any) {
    const chart = this.chartRef5;

    // Clear previous series
    while (chart.series.length > 0) {
      chart.series[0].remove(false);
    }

    const categories = data.map(d => d.Quarter);
    const debt = data.map(d => d.Debt);
    const cash = data.map(d => d.Cash);

    chart.xAxis[0].setCategories(categories);

    chart.addSeries({
      name: 'Debt',
      type: 'column',
      data: debt,
      tooltip: {
          pointFormatter: function () {
            return `<b>${Highcharts.numberFormat(this.y, 2, '.', ',')}</b>`;
          }
        },
      color: '#CD5C5C', // indianred
    }, false);

    chart.addSeries({
      name: 'Cash',
      type: 'column',
      data: cash,
      tooltip: {
          pointFormatter: function () {
            return `<b>${Highcharts.numberFormat(this.y, 2, '.', ',')}</b>`;
          }
        },
      color: '#7CB5EC', // blue
    }, false);

    chart.redraw();
  }

  private assignColumm6(data: any) {
    const chart = this.chartRef6;

    // Clear previous series
    while (chart.series.length > 0) {
      chart.series[0].remove(false);
    }

    const categories = data.map(d => d.Quarter);
    const netRevenue = data.map(d => d.NetRevenue);
    const netExpense = data.map(d => d.NetExpense);
    const netProfit = data.map(d => d.NetProfit);

    chart.xAxis[0].setCategories(categories);

    chart.addSeries({
      name: 'Net Revenue',
      type: 'column',
      data: netRevenue,
      tooltip: {
        pointFormatter: function () {
          return `<b>${Highcharts.numberFormat(this.y, 2, '.', ',')}</b>`;
        }
      },
      color: '#7CB5EC', // blue
    }, false);

    chart.addSeries({
      name: 'Net Expense',
      type: 'column',
      data: netExpense,
      tooltip: {
        pointFormatter: function () {
          return `<b>${Highcharts.numberFormat(this.y, 2, '.', ',')}</b>`;
        }
      },
      color: '#CD5C5C', // indianred
    }, false);

    chart.addSeries({
      name: 'Net Profit',
      type: 'column',
      data: netProfit,
      tooltip: {
        pointFormatter: function () {
          return `<b>${Highcharts.numberFormat(this.y, 2, '.', ',')}</b>`;
        }
      },
      color: '#90ED7D', // green
    }, false);

    chart.redraw();
  }
  
  

}

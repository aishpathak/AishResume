import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChildren, QueryList } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent,
  NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcDataTableComponent, DateTimeKey
} from 'ngc-framework';
import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from '../dashboard.service';
import { SearchForMssDetails, SearchForMssFlightDetails } from '../dashboard.sharedmodel';
import { Subscription, Observable, interval } from 'rxjs';

@Component({
  selector: 'app-mss-dashboard',
  templateUrl: './mss-dashboard.component.html',
  styleUrls: ['./mss-dashboard.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class MssDashboardComponent extends NgcPage implements OnInit {


  @ViewChildren('MssDashboadViewTable') MssDashboadViewTable: QueryList<NgcDataTableComponent>;
  @ViewChildren('releasedtable') releasetable: QueryList<NgcDataTableComponent>;

  titleSATS: any = [];
  titleDNATA: any;
  resp: any;
  flightResponse: any;
  isFlightAvailable: boolean = false;
  isOpen: false;
  showForSats: boolean = false;
  showForDnata: boolean = false;
  private autoRefreshSubscription: Subscription;
  currentPageIndex = 0;
  pageSize = 10;
  tabIndex = 0;
  tabFlightAray: any;
  arrayToCheckFlightDetail: any = [];
  private newTabs = {
    title: '',
    flightKey: '',
    flightDate: '',
    headerLabel: 'Balah head',
    flightDetailArray: [{
      dispatch: '',
      origin: '',
      destination: '',
      pieces: '',
      mailType: '',
      truckDocColor: '',
      infeedColor: '',
      releaseToDnata: '',
      a: '',
      b: '',
      mailbagInfo: [{
      }]
    }],
    flightDetailDNATAArray: [{
      dispatch: '',
      origin: '',
      destination: '',
      pieces: '',
      mailType: '',
      truckDocColor: '',
      infeedColor: '',
      releaseToDnata: ''
    }],
    responseForMssDashboard: [{
      dispatch: '',
      origin: '',
      destination: '',
      pieces: '',
      mailType: '',
      truckDocColor: '',
      infeedColor: '',
      releaseToDnata: ''
    }],
    mailBagDetailArray: [{
      rsn: '001',
      mailBagNumber: '',
      truckDocMailColor: '',
      infeedMailColor: '',
      manifestMailColor: ''
    }],
    mailBagDetailsDNATA: [{
      rsn: '001',
      mailBagNumber: '',
      truckDocMailColor: '',
      infeedMailColor: '',
      manifestMailColor: ''
    }]
  }

  private FlightDetail = {
    flight: this.newTabs.headerLabel
  }

  private mssDashboardForm: NgcFormGroup = new NgcFormGroup({

    auto: new NgcFormControl(false),
    sats: new NgcFormControl(true),
    dnata: new NgcFormControl(),
    fromDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (0 * 60) + 0, DateTimeKey.MINUTES)),
    toDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),
  })

  private mssDashboardFormResponse: NgcFormGroup = new NgcFormGroup({
    FlightDetailsFormArray: new NgcFormArray([
      new NgcFormGroup({
        title: new NgcFormControl(''),

        responseForSATSMssDashboard: new NgcFormArray([]),
        flightMssDetailArray: new NgcFormArray([
          new NgcFormGroup({
            flag: new NgcFormControl(false),
            mailBagDetails: new NgcFormArray([])
          })
        ])
      })
    ]),
    FlightDetailsDnataFormArray: new NgcFormArray([
      new NgcFormGroup({
        title: new NgcFormControl(''),
        responseForDNATAMssDashboard: new NgcFormArray([]),
        flightDetailDNATAArray: new NgcFormArray([
          new NgcFormGroup({
            mailBagDetails: new NgcFormArray([])
          })
        ])
      })
    ])
    //FlightDetailsDnataFormArray: new NgcFormArray ([])
    //responseForMssDashboard: new NgcFormArray([])
    // FlightDetailsFormArray: new NgcFormArray([])
  })

  /**
   *
   * @param appZone
   * @param appElement
   * @param appContainerElement
   * @param router
   * @param activated
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private dashboardService: DashboardService) { super(appZone, appElement, appContainerElement); }


  ngOnInit() {
    this.onSwitchChange(this.mssDashboardForm.get('auto').value);

  }

  //ngOnInit() { }

  public onSearch() {
    let value;
    let search: SearchForMssDetails = new SearchForMssDetails();
    search = this.mssDashboardForm.getRawValue();
    if (search.sats) {
      for (let i = (<NgcFormArray>this.mssDashboardFormResponse.get(['FlightDetailsFormArray'])).length - 1; i >= 0; i--) {
        if (i != 0) {
          (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsFormArray']).removeAt(i);
        }
      }
      this.tabIndex = 0;
      (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsFormArray']).addValue(null);
    } else {
      for (let i = (<NgcFormArray>this.mssDashboardFormResponse.get(['FlightDetailsDnataFormArray'])).length - 1; i >= 0; i--) {
        if (i != 0) {
          (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsDnataFormArray']).removeAt(i);
        }
      }
      this.tabIndex = 0;
      (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsDnataFormArray']).addValue(null);

    }
    this.arrayToCheckFlightDetail = new Array();
    this.resetFormMessages();

    this.dashboardService.getMssDashBoard(search).subscribe(data => {
      this.showForSats = false;
      this.showForDnata = false;
      if (!this.showResponseErrorMessages(data)) {

        if (search.fromDate != null || search.toDate != null) {
          if (search.sats) {
            this.showForSats = true;
            this.showForDnata = false;
          } else {
            this.showForDnata = true;
            this.showForSats = false;
          }
          this.resp = data.data;
          this.resp.forEach(value => value.tabFlag = false);
          for (let obj of this.resp) {
            if (obj.dateATD) {

            }
            else if (obj.dateETD) {
              obj.dateATD = obj.dateETD;
            }
            else {
              obj.dateATD = obj.dateSTD;
            }

          }

          (<NgcFormArray>this.mssDashboardFormResponse.get(['FlightDetailsFormArray', 0, 'responseForSATSMssDashboard'])).patchValue(this.resp);
          (<NgcFormArray>this.mssDashboardFormResponse.get(['FlightDetailsDnataFormArray', 0, 'responseForDNATAMssDashboard'])).patchValue(this.resp);

        }
      }
    },
      error => {
        this.showErrorStatus(error);
      })
  }

  /**
* On SwitchChange
*/
  public onSwitchChange(event) {
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
    if (event === true) {
      //this.onSearch();

      //-------------------------------- AutoPaginate on every 10 seconds--------------------------------
      this.currentPageIndex = 0;

      interval(1000 * 7).subscribe(x => {
        this.currentPageIndex++;
        if (this.currentPageIndex >= (
          (this.resp.length + (this.pageSize - (this.resp.length % this.pageSize)
          )) / this.pageSize)) {
          this.currentPageIndex = 0;
        }
        // this.MssDashboadViewTable.goToPage(this.currentPageIndex);
      });

      // this.autoRefreshSubscription = this.getTimer(30000).subscribe((data) => {
      //   this.onSearch();
      // });
    }

  }

  returnSvg(rowData, column) {
    return `
            <div>
                <svg height="20" width="20">
                  <circle cx="10" cy="10" r="10" style = "fill : ${rowData[column]} " />
                </svg>
            </div>
            `
  }

  /**
    * Cells Renderer
    * @param value Value
    * @param rowData Row Data
    * @param level Level
    */
  public cellsRenderer = (row: number, column: string, value: any, rowData: any): string => {
    return this.returnSvg(rowData, column);
  };

  public onBack() {
    this.navigateBack(this.mssDashboardForm.getRawValue);
  }

  public onLinkClick(event, index) {
    var innerArray: any[];
    let searchFlight: SearchForMssFlightDetails = new SearchForMssFlightDetails();
    searchFlight.paFlightKey = event.record.flightKey;
    searchFlight.paFlightDate = event.record.flightDate;
    this.dashboardService.getMssFlightDetails(searchFlight).subscribe(data => {
      if (data.data) {

        this.flightResponse = data.data;
        for (var element of this.flightResponse) {
          let sum = 0;
          let weightSum = 0;
          if (element.mailBagDetails) {
            for (var ele of element.mailBagDetails) {
              sum += ele.piece;
              weightSum += ele.bagWeight;
            }
            element.Piece = sum;
            element.Weight = Number.parseFloat(NgcUtility.getDisplayWeight(weightSum));
          }
        }
      }
      const title: string = event.record.flightKey + '/' + NgcUtility.getDateAsString(NgcUtility.getDateTime(event.record.flightDate));
      var addFlightData = true;
      if (!this.arrayToCheckFlightDetail.length)
        this.arrayToCheckFlightDetail = (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsFormArray']).getRawValue();

      this.arrayToCheckFlightDetail[0].responseForSATSMssDashboard.forEach(element => {
        if (element.flightKey == event.record.flightKey && !element.tabFlag && NgcUtility.getDateAsString(element.flightDate) == NgcUtility.getDateAsString(event.record.flightDate)) {
          this.newTabs.title = title;
          this.newTabs.flightDate = element.flightDate;
          this.newTabs.flightKey = element.flightKey;
          this.newTabs.flightDetailArray = this.flightResponse;
          this.isFlightAvailable = true;
          (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsFormArray']).addValue([this.newTabs]);
          this.tabIndex++;
          element.tabFlag = true;
        }
      },
        error => {
          this.showErrorStatus(error);
        })

    });
  }
  onLinkClickDnata(event, index) {
    var innerArray: any[];
    var innerArray: any[];
    let searchFlight: SearchForMssFlightDetails = new SearchForMssFlightDetails();
    searchFlight.paFlightKey = event.record.flightKey;
    searchFlight.paFlightDate = event.record.flightDate;
    this.dashboardService.getMssFlightDetailsDnata(searchFlight).subscribe(data => {
      if (data.data) {
        this.flightResponse = data.data;
        for (var element of this.flightResponse) {
          let sum = 0;
          if (element.mailBagDetails) {
            for (var ele of element.mailBagDetails) {
              sum += ele.piece;
            }
            element.Piece = sum;
          }
        }
      }
      const title: string = event.record.flightKey + '/' + NgcUtility.getDateAsString(NgcUtility.getDateTime(event.record.flightDate));
      var addFlightData = true;
      if (!this.arrayToCheckFlightDetail.length)
        this.arrayToCheckFlightDetail = (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsDnataFormArray']).getRawValue();

      this.arrayToCheckFlightDetail[0].responseForDNATAMssDashboard.forEach(element => {
        if (element.flightKey == event.record.flightKey && !element.tabFlag && NgcUtility.getDateAsString(element.flightDate) == NgcUtility.getDateAsString(event.record.flightDate)) {
          this.newTabs.title = title;
          this.newTabs.flightDate = element.flightDate;
          this.newTabs.flightKey = element.flightKey;
          this.newTabs.flightDetailDNATAArray = this.flightResponse;
          this.isFlightAvailable = true;

          (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsDnataFormArray']).addValue([this.newTabs]);
          this.tabIndex++;

          element.tabFlag = true;
        }
      },
        error => {
          this.showErrorStatus(error);
        })

    });

  }
  onCloseSats(event) {
    let flightValue;
    let indexOfElemnet;
    (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsFormArray']).controls.forEach((element, index) => {
      if (index == event.index) {
        flightValue = element;
        indexOfElemnet = index;

      }
    });
    (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsFormArray']).removeAt(indexOfElemnet);

    this.arrayToCheckFlightDetail[0].responseForSATSMssDashboard.forEach(element => {
      if (element.flightKey == flightValue.fullProperties.flightKey && element.tabFlag && NgcUtility.getDateAsString(element.flightDate) == NgcUtility.getDateAsString(flightValue.fullProperties.flightDate)) {
        this.tabIndex--;
        element.tabFlag = false;
        (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsFormArray']).addValue(null);

      }
    });
  }

  onCloseDnata(event) {
    let flightValue;
    let indexOfElemnet;
    (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsDnataFormArray']).controls.forEach((element, index) => {
      if (index == event.index) {
        flightValue = element;
        indexOfElemnet = index;

      }
    });
    (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsDnataFormArray']).removeAt(indexOfElemnet);

    this.arrayToCheckFlightDetail[0].responseForDNATAMssDashboard.forEach(element => {
      if (element.flightKey == flightValue.fullProperties.flightKey && element.tabFlag && NgcUtility.getDateAsString(element.flightDate) == NgcUtility.getDateAsString(flightValue.fullProperties.flightDate)) {
        this.tabIndex--;
        element.tabFlag = false;
        (<NgcFormArray>this.mssDashboardFormResponse.controls['FlightDetailsDnataFormArray']).addValue(null);

      }
    });
  }


  releaseEvent(event) {
    if (event.index < this.MssDashboadViewTable.length) {
      this.MssDashboadViewTable.toArray()[event.index].render();
    }

    let releasedTables: NgcDataTableComponent[] = this.releasetable ? this.releasetable.toArray() : [];
    for (let index: number = 0; index < releasedTables.length; index++) {
      if ((releasedTables[index].getControlElementRef().nativeElement as HTMLElement).id == String(event.index)) {
        releasedTables[index].render();
      }
    }
  }
}

/**
 * @copyright SATS Singapore 2017-18
 */
// Angular
import {
  Component, NgZone, ElementRef, ViewContainerRef, ReflectiveInjector, ViewChildren, QueryList,
  ChangeDetectorRef, Pipe, PipeTransform, ContentChildren, forwardRef, ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroupDirective, FormArray, FormGroup, FormControl,
  FormControlName, Validators, AbstractControl, ValidatorFn
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Jsonp, URLSearchParams } from '@angular/http';
// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, BaseComponent,
  NotificationMessage, StatusMessage, MessageType,
  DropDownListRequest, BaseResponse, NgcWindowComponent,
  NgcUtility, NgcTabsComponent, Log, PageConfiguration, TrackProgress,
  NgcReportComponent, NgcControl,
  DateTimeKey, Save,
  ReactiveModel, Model, IsArrayOf,
  NotBlank, NotFalse, Min, Max, MinLength, MaxLength, Pattern, ULD, AWB, EventSubject, SystemBroadcastEvents,
  NgcCapturePhotoComponent, NgcWrapperComponent, TreeNode
} from 'ngc-framework';
// Playground
import { PlaygroundService } from '../playground.service';
import { EAcceptanceSearchRequest, EAcceptanceSearchResponseData, EAcceptanceSearchResultBO } from '../playground.shared';
// Environment/Configuration
import { Environment, CFG_ENV } from '../../../environments/environment';

declare let $: any;
declare let moment: any;
declare let CodeMirror: any;

@Model()
export class SHCModel {
  shc: string = null;
}

@Model()
export class CustomerAddressModel {
  @NotBlank()
  houseNo: string = null;
  buildingName: string = null;
  area: string = null;
  street: string = null;
  city: string = null;
  country: string = null;
  pinCode: string = null;
}

@Model()
export class CustomerModel {
  @NotBlank()
  name: string = null;
  address: CustomerAddressModel = new CustomerAddressModel();

  @IsArrayOf(CustomerAddressModel)
  otherAddresses: Array<CustomerAddressModel> = new Array<CustomerAddressModel>();
}

@Model()
export class SearchModel {
  flightNo: string = null;
  carrier: string = null;
  rating: number = null;
  flightDate: string = null;
  @NotBlank()
  remarks: string = null;

  @IsArrayOf(SHCModel)
  shc1: Array<SHCModel> = new Array<SHCModel>();

  shc2: Array<string> = ['PER', 'VAL'];
  fileUpload: string = "521772ACB2747E674F891708";
  signature: string = null;
  flightId: number = 10003;
  image: string = null;
  specialHandlingCodes: string = null;
  color: string = null;
  style: Array<string> = ['BOLD'];
  @NotBlank()
  alpha: string = null;
  alphaWithSpace: string = null;
  @NotBlank()
  alphanum: string = null;
  alphanumWithSpace: string = null;
  @NotBlank()
  digit: string = null;
  @NotBlank()
  phoneNo: string = "839929992999";
  phoneNoDisplay: string = "839929992999";
  phoneNoWithoutCountry: string = "9892892992";
  phoneNoWithoutCountryDisplay: string = "9892892992";
  @NotBlank()
  pinCode: string = "090292";
  pinCodeDisplay: string = "090292";
  @NotBlank()
  faxNo: string = "092090290222";
  faxNoDisplay: string = "092090290222";
  faxNoWithoutCountry: string = "982989289";
  faxNoWithoutCountryDisplay: string = "982989289";
  @NotBlank()
  email: string = null;
  @NotBlank()
  mask: string = "231000";
  editor: string = null;
  paymentType: Array<string> = ["CASH"];
  displayCarrier: string = "SQ";
}

@Model()
export class FlightSchedule {
  schedule: string = null;
  fromDate: Date = null;
  toDate: Date = null;
  apron: string = null;
}

@Model()
export class DetailResultModel {
  awbNo: string = "61872993892";
  awbDate: Date = null;
  dest: string = null;
  carr: string = null;
  firstOffPt: string = null;
  secondOffPt: string = null;

  @NotBlank()
  pcs: string = null;
  @NotBlank()
  wt: string = null;

  nog: string = null;
  rcar: string = null;
  awbChargeCode: string = null;
  fwb: boolean = false;
  eawb: boolean = false;
  rcarKcToTarget: boolean = false;
  awbReceived: boolean = false;
  pouch: boolean = false;
  scInd: boolean = false;
  status: string = null;
  flagCRUD: string = null;

  @IsArrayOf(DetailResultModel)
  childRecords: Array<DetailResultModel> = new Array<DetailResultModel>();
}

@Model()
export class DetailModel {
  flightNo: string = null;
  carrier: string = null;
  flightDate: string = null;
  serviceNo: string = null;
  serviceCategory: string = null;
  @NotBlank()
  dropDown1: string = null;
  dropDown2: string = null;
  dropDown3: string = null;
  dropDown4: string = "OOPS";
  serviceType: string = "SIA";
  @NotBlank()
  numberOnly: number = null;
  numberOnlyWithOutDecimal: number = 678.78;
  @NotBlank()
  pieces: number = 839;
  piecesDisplay: number = 7837;
  @NotBlank()
  weight: number = 8322.1;
  weightDisplay: number = 8782.8992;
  @NotBlank()
  currencyOnly: number = 76767.989;
  currencyDisplay: number = 4757658.7687;
  @NotBlank()
  terminal: string = "T1";
  warehouseLocation: string = "L1";
  warehouseZone: string = "Z1";
  @NotBlank()
  @ULD()
  uldKey: string = 'AKE10001SQ';
  @NotBlank()
  shipment: string = null;
  shipmentDisplay: Date = new Date();
  @NotBlank()
  @AWB()
  awbNo: string = '61801001000';
  awbNoDisplay: string = '1608282882';
  awbNoNoWrap: string = '1608282882981208012983013098120938098123809812001203809';
  awbDate: Date = NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 1, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES);
  @NotBlank()
  separatedDateTime: Date = new Date();
  @NotBlank()
  onlyDate: string = null;
  @NotBlank()
  onlyTime: string = "12:45:23";
  onlyTimeWithDate: Date = new Date();
  awbTypeImport: boolean = false
  awbTypeExport: boolean = false;
  awbTypeCheckImport: boolean = false;
  awbTypeCheckExport: boolean = false;
  agentCode: string = null;
  agentName: string = null;
  @NotBlank()
  agentPassword: string = "hello";
  agentZip: string = null;
  agentPhone: string = null;
  serviceCreateDate: string = null;
  serviceCreateTime: string = null;
  contractorIC: string = null;
  contractorName: string = null;
  autoRefresh: boolean = false;
  code: string = `FFM/1
HEEELO
SINHKG27MAR2018
TS/199
9300FF00002
OPS29929DF0
`;

  @IsArrayOf(DetailResultModel)
  resultList: Array<DetailResultModel> = new Array<DetailResultModel>();

  @IsArrayOf(FlightSchedule)
  flightScheduleGroupList: Array<FlightSchedule> = new Array<FlightSchedule>();

  customerGroup: CustomerModel = new CustomerModel();

  @IsArrayOf(SHCModel)
  email: Array<SHCModel> = new Array<SHCModel>();

  shc: Array<any> = ['PER'];
}

/**
 * Playground Page
 */
@Component({
  templateUrl: "./playground.html",
  providers: [PlaygroundService]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true,
  focusToBlank: true
})
export class PlaygroundPage extends NgcPage {
  @ReactiveModel(SearchModel)
  public searchForm: NgcFormGroup;
  @ReactiveModel(DetailModel)
  public form: NgcFormGroup;
  private displayFlight: boolean = false;

  @ViewChild('carouselWindow')
  private carouselWindow: NgcWindowComponent;
  @ViewChild('reportWindow')
  private reportWindow: NgcReportComponent;
  @ViewChild(NgcCapturePhotoComponent)
  private capturePhoto: NgcCapturePhotoComponent;

  private labelName: string = "Initial Label";
  private autoRefreshSubscription: Subscription;
  public serviceCategoryCriteria: any;
  public timezoneTest: any;
  public searched: boolean = false;
  private reportURL: string;
  private entityDate: Date = new Date();
  private treeSource: Array<TreeNode> = new Array<TreeNode>();
  private signature1: any = "data:image/png;base64,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";

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(appZone: NgZone,
    appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private playService: PlaygroundService,
    private jsonp: Jsonp) {
    //
    super(appZone, appElement, appContainerElement);
    //
    const treeNodes: Array<TreeNode> = new Array<TreeNode>();
    //
    for (let index = 0; index < 10; index++) {
      const node: TreeNode = new TreeNode();
      //
      node.label = `Node ${index + 1}`;
      node.children = [];
      node.icon = "fa fa-bank wh-terminal";

      for (let childIndex = 0; childIndex < 10; childIndex++) {
        const childNode: TreeNode = new TreeNode();
        //
        childNode.label = `Child Node ${childIndex + 1}`;
        childNode.children = [];
        childNode.icon = "fa fa-cube wh-sector";
        //
        for (let child2Index = 0; child2Index < 10; child2Index++) {
          const child2Node: TreeNode = new TreeNode();
          //
          child2Node.label = `Child Node ${child2Index + 1}`;
          child2Node.icon = "fa fa-cube wh-sector";
          //
          childNode.children.push(child2Node);
        }
        //
        node.children.push(childNode);
      }
      //
      treeNodes.push(node);
    }
    this.treeSource = treeNodes;
  }

  /**
   * On Initialization
   */
  public ngOnInit(): void {
    super.ngOnInit();
    //
    this.initialize();
    //
    this.form.get('serviceCategory').disable();
    this.searched = false;
    this.form.get("weight").setValue(3342.3);
  }

  private onCode() {
    (this.capturePhoto as any).open();
  }

  /**
   * Initialize
   */
  @TrackProgress()
  public initialize() {
    console.log("initializing the playground");
  }

  public ngAfterViewInit() {
    super.ngAfterViewInit();
    //
    // Track Service No. Changes to Populate Drop Down
    this.trackServiceNoChanges();

  }

  /**
   * On Destroy
   */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /**
   * Track Service No. Changes.
   */
  private trackServiceNoChanges(): void {
    if (!this.form.controls["serviceNo"]) {
      return;
    }
    this.form.get("serviceNo").valueChanges.subscribe(changedValue => {
      let value: string = changedValue;
      //
      if (value && value.length > 5) {
        this.serviceCategoryCriteria = {};
        //
        if (value.startsWith("IV7", 0)) {
          this.serviceCategoryCriteria = this.createSourceParameter("A");
        }
        else if (value.startsWith("IV8", 0)) {
          this.serviceCategoryCriteria = this.createSourceParameter("B");
        } else {
          this.serviceCategoryCriteria = this.createSourceParameter("A", "B");
        }
      }
    });
  }

  /**
   * On Add Row
   *
   * @param event Event
   */
  public onAddRow(event) {
    const awbDetail: DetailResultModel = new DetailResultModel();
    //
    awbDetail.awbNo = "6189989898";
    //
    (<NgcFormArray>this.form.controls["resultList"]).addValue([awbDetail]);
  }

  /**
   * On Add Multi Row
   *
   * @param event Event
   */
  public onAddMultiRows(event) {
    const awbDetail1: DetailResultModel = new DetailResultModel();
    const awbDetail2: DetailResultModel = new DetailResultModel();
    //
    awbDetail1.awbNo = "6187638873";
    awbDetail2.awbNo = "6187567363";
    //
    (<NgcFormArray>this.form.controls["resultList"]).addValue([awbDetail1, awbDetail2]);
  }

  /**
   * On Reset
   *
   * @param event Event
   */
  public onRemoveAll(event) {
    (<NgcFormArray>this.form.controls["resultList"]).resetValue([]);
  }

  /**
   * On AWB Click
   *
   * @param value Value
   */
  public onAWBClick(value) {
    this.sendNotificationMessage(new NotificationMessage(MessageType.WARNING, value
      + ". Please collect the cargo ASAP.", new Date()));
    this.showWarningStatus(`Please collect the cargo ${value} ASAP. Otherwise, somebody will take it to home.`);
  }

  /**
   * Delete
   *
   * @param value Value
   */
  public onDelete(value) {
    (<NgcFormArray>this.form.controls["resultList"]).deleteValue([{
      awbNo: value
    }]);
  }

  /**
   * On Search
   */
  @TrackProgress()
  public onSearch(event) {
    let request: EAcceptanceSearchRequest = this.form.getRawValue() as EAcceptanceSearchRequest;
    // Reset Form Messages Just Before Search
    this.resetFormMessages();
    // Service Call for Search
    this.playService.getAWBList(CFG_ENV.serviceBaseURL, request).subscribe(response => {
      // Patch Value If Successful
      if (!this.showResponseErrorMessages(response)) {
        this.refreshFormMessages(response.data);// Deprecated
        this.form.patch(response.data, DetailModel);
      }
    }, error => {
      this.showErrorStatus(error);
    });
    this.searched = true;
  }

  /**
   * On Validate
   *
   * @param event Event
   */
  public onValidate(event) {
    let request: EAcceptanceSearchRequest = new EAcceptanceSearchRequest();
    //
    this.resetFormMessages();
    //
    request.serviceNo = this.form.getRawValue().serviceNo;
    //
    this.playService.validateEAccept(CFG_ENV.serviceBaseURL, request).subscribe(responseBean => {
      console.log(responseBean);
      this.showResponseErrorMessages(responseBean);
    }, error => {
      this.showErrorStatus("error.validate.awb");
    });
  }

  /**
   * On Validate Multi Form
   *
   * @param event Event
   */
  public onValidateMultiForm(event) {
    let request: EAcceptanceSearchRequest = new EAcceptanceSearchRequest();
    //
    this.resetFormMessages();
    //
    request.serviceNo = this.form.getRawValue().serviceNo;
    //
    this.playService.validateEAccept(CFG_ENV.serviceBaseURL, request).subscribe(responseBean => {
      this.showResponseErrorMessages(responseBean, "searchForm"); // Add Form Name to Form in HTML
    }, error => {
      this.showErrorStatus("error.validate.awb");
    });
  }

  /**
   * On Clear
   *
   * @param event Event
   */
  public onClear(event) {
    this.resetFormMessages();
    this.form.reset();
  }

  /**
     * Verify for Matches
     *
     * @param value Value
     * @param regex Regular Expression
     */
  public isMatches(value: string, regEx: string) {
    let isMatches: boolean = false;
    const matchedIndexes: RegExpMatchArray = value.match(new RegExp(regEx, 'g'));
    console.log(matchedIndexes)
    // Verify for Exact Match
    if (matchedIndexes !== null && matchedIndexes.length > 0) {
      let matchedString: string = '';
      // Consolidated Matched Values
      matchedIndexes.forEach((matchedValue: string) => {
        matchedString += matchedValue;
      });
      console.log(`matchedString = ${matchedString}, value = ${value}`)
      // Both the Input & Consolidated Value Must Match Exactly
      if (matchedString === value) {
        isMatches = true;
      }
    }
    //
    return isMatches;
  }

  /**
   * On Save
   *
   * @param event Event
   */
  @Save()
  public onSave(event) {
    this.showErrorMessage("EXPMNFST02", null, ["998989998", 991918282, 54464663])

    // this.form.get("awbDate").setValue(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 10, DateTimeKey.DAYS));
    // console.log(this.isMatches('SQ19999999', "([a-zA-Z0-9]{0,3}[0-9]{0,5}){0,3}"));
    // this.labelName = "Label Name Changed";
    // this.retrieveLOVRecord("DOC", "SERVICE-TYPE-LIST").subscribe((record) => {
    //   console.log('LOV..........');
    //   console.log(record);
    // });
    // this.form.get("awbTypeImport").setValue(true);
    // this.form.get("awbTypeCheckImport").setValue(true);
    // this.form.get("pieces").setValue(null);
    // this.form.get("weight").setValue(Math.random() * 100);
    // this.form.get("currencyOnly").setValue(null);
    // this.form.get("dropDown1").setValue('');
    // this.form.get("dropDown2").setValue('');
    // let dateTime: number[] = [2017, 1, 2, 3, 4, 5, 6];
    // this.showSuccessStatus("Operation Successful");
    // this.showErrorStatus("abc.xyz.service");
    // this.showFormControlErrorMessage(<NgcFormControl>this.form.get('awbNo'), "ERR-01", null, ['Carrier', 'S', 'Q']);
    // this.showFormControlWarningMessage(<NgcFormControl>this.form.get('carrier'), "ERR-01", null, ['Carrier', 'S', 'Q']);
    // this.showFormControlErrorMessage(<NgcFormControl>this.searchForm.get('editor'), "ERR-01", null, ['Carrier', 'S', 'Q']);
    // console.log(this.form);
    // console.log(this.searchForm);
    // console.log(this.router.url);
    // console.log(NgcUtility.getTimeAsString(new Date));
  }

  /**
   * On Next (Data Table)
   *
   * @param event Event
   */
  public onNextDataTable(event) {
    this.navigateTo(this.router, "/playground/nextToDatatable", this.form.getRawValue());
  }

  /**
   * On Next (Data Grid)
   *
   * @param event Event
   */
  public onNextDataGrid(event) {
    this.navigateTo(this.router, "/playground/nextToDataGrid", this.form.getRawValue());
  }

  /**
   * On Next (Grid)
   *
   * @param event Event
   */
  public onNextGrid(event) {
    this.navigateTo(this.router, "/playground/nextToGrid", this.form.getRawValue());
  }

  /**
   * On Next (Table)
   *
   * @param event Event
   */
  public onNextTable(event) {
    this.navigateTo(this.router, "/playground/nextToTable", this.form.getRawValue());
  }

  /**
   * On Confirmation
   *
   * @param event Event
   */
  @Log()
  public onConfirm(event) {
    let self = this;
    //
    this.showConfirmMessage("error.delete.selected.record").then(fulfilled => {
      self.showInfoStatus("" + fulfilled);
    }).catch(reason => {
      self.showErrorStatus(reason);
    });
  }

  /**
   * On Alert
   *
   * @param event Event
   */
  @Log()
  public onAlert(event) {
    this.showMessage("g.completed.successfully");
  }

  /**
   * On Service Type Select
   *
   * @param data Data
   */
  public onServiceTypeSelect(data) {
    if (data) {
      this.showInfoStatus(JSON.stringify(data));
    }
  }

  /**
   * On Window Open
   *
   * @param data Data
   */
  public onWindowOpen(data) {
    this.carouselWindow.open();
  }

  /**
   * On Disable/Enable
   */
  public onDisableEnable(event) {
    let resultList = (<NgcFormArray>this.form.controls["resultList"]).controls;
    //
    if (resultList.length > 0) {
      if (resultList[0].enabled) {
        resultList[0].disable();
      } else {
        resultList[0].enable();
      }
    }
  }

  /**
   * On Text Blur
   */
  public onTextBlur(event) {
    this.showInfoStatus("on blur")
  }

  /**
   * On Add Carousel
   *
   * @param event Event
   */
  public onAddCarousel(event) {
    (<NgcFormArray>this.form.controls["flightScheduleGroupList"]).addValue([
      {
        flightScheduleList: [
          {
            schedule: "SCHEDULE X",
            fromDate: new Date(),
            toDate: new Date(),
            apron: true
          },
          {
            schedule: "SCHEDULE X",
            fromDate: new Date(),
            toDate: new Date(),
            apron: false
          },
          {
            schedule: "SCHEDULE X",
            fromDate: new Date(),
            toDate: new Date(),
            apron: true
          }
        ]
      }
    ]);
  }

  public onAccordionDelete(index) {
    this.showInfoStatus("Index = " + index);
    (<NgcFormArray>this.form.get("resultList")).deleteValueAt(index);
  }

  public onResetPassword(event) {
    this.form.reset();
  }

  public onReset(event) {
    this.searchForm.reset();
    this.form.reset();
    this.form.get('awbDate').setValue(new Date());
  }

  public onNewWindow(event) {
    this.navigateToWindow('/playground/nextToTable', this.form.getRawValue());
  }

  public onValidateForm(event) {
    this.form.validate();
  }

  public onReport(event) {
    // this.reportURL = "http://www.ovh.net/files/1Mb.dat?random=" + Math.random();
    this.reportURL = "http://localhost:8084/reports/report/stock_report.rptdesign/pdf";
  }

  public onReportWindow(event) {
    this.reportWindow.open();
  }

  public onImageSelect(event) {
    console.log(event);
    this.searchForm.get('image').setValue(event.document);
  }

  public onDropDownSelect(event) {
    console.log(event);
  }

  public onInputSelect(event) {
    console.log(event);
  }

  public onFlightSelect(event) {
    console.log(event);
  }

  public addTab(event) {
    console.log('Clicked on Add Tab')
  }

  public onTC(event) {
    this.showTermsAndCondition("T92989");
  }

  public onSwitchChange(event) {
    console.log(`Auto Refresh ${event}`)
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = null;
    }
    if (event === true) {
      this.autoRefreshSubscription = this.getTimer(10000).subscribe((data) => {
        console.log('refreshed');
      });
    }
  }

  public onShipmentSelect(event) {
    console.log(event);
  }

  public onScrollTop(event) {
    this.raiseEvent(EventSubject.PAGE_NOTIFICATION, SystemBroadcastEvents.PAGE_SCROLL_TO_TOP_REQUESTED);
  }

  public onWiki() {
    const wikiUrl = 'http://en.wikipedia.org/w/api.php';
    const params = new URLSearchParams();
    //
    params.set('page', "india"); // the user's search value
    params.set('action', 'parse');
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');

    // TODO: Add error handling
    return this.jsonp
      .get(wikiUrl, { search: params }).subscribe((response) => {
        console.log(response);
      });
  }

}

import { Component, ElementRef, NgZone, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, PageConfiguration, NgcReportComponent, NgcUtility, NgcCheckBoxComponent, UserProfile } from 'ngc-framework';
import { ImportService } from '../import.service';
import { CargoPreAnnouncementGroup, CargoPreAnnouncementRequest, CargoPreAnnouncement } from './../import.shared';
import { debug } from 'util';

@Component({
  selector: 'app-preannouncement',
  templateUrl: './preannouncement.component.html',
  styleUrls: ['./preannouncement.component.scss']
})
/**
     * PreannouncementComponent on searchs on the flightkey and Date.
     *
     * @param insertData
     * @param index
*/
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true
})
export class PreannouncementComponent extends NgcPage implements OnInit {

  finalizeUnfinalizeName: string = 'Finalize';
  private dataSyncSearch: number = 0;
  reportParameters: any = new Object();
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild("reportMail") reportMail: NgcReportComponent;
  @ViewChild("report") report: NgcReportComponent;
  @ViewChild('firstField') firstField: NgcCheckBoxComponent;
  changeButtonName(event) {
    if (event !== null) {
      if (event.target.innerText === 'Finalize') {
        this.finalizeandandUnFinalize(event, true)
        this.finalizeUnfinalizeName = 'UnFinalize';
      } if (event.target.innerText === 'UnFinalize') {
        this.finalizeandandUnFinalize(event, false);
        this.finalizeUnfinalizeName = 'Finalize';
      }
    }

  }
  cargoPreAnnouncementDeleteList: any[] = [];
  locationTypeArray: any[] = [];
  cargoPreAnnouncementList: any[];
  resp: any;
  isPreAnnoumentTableDatatableVisible: Boolean;
  isFlightDetails: Boolean;
  finalizebutton: Boolean;
  unfinalizebutton: Boolean;
  screenFunction: any;
  terminal: any;
  focusFlight: boolean = false;
  editShcs: boolean = false;
  printFlag: boolean = false;
  saveFlag: boolean = false;
  finalize: boolean = false;
  routedInformation: any;

  private screenFunctionParameter = {};

  private form: NgcFormGroup = new NgcFormGroup({
    flight: new NgcFormControl(),
    date: new NgcFormControl(new Date()),
    finalizedAt: new NgcFormControl(),
    finalizedBy: new NgcFormControl,
    flightDetails: new NgcFormGroup({
      flight: new NgcFormControl(),
      date: new NgcFormControl(),
      sta: new NgcFormControl(),
      eta: new NgcFormControl(),
      ata: new NgcFormControl(),
      flightId: new NgcFormControl(),
      flightSeg: new NgcFormControl(),
      segment: new NgcFormControl(),
      status: new NgcFormControl(),
      bulk: new NgcFormControl(),
      bulkShipments: new NgcFormControl(),
      stBulkShipments: new NgcFormControl(),
      finalzeAndunFinalize: new NgcFormControl(),
      cargoPreAnnouncementBulkShipmentList: new NgcFormArray([]),
    }),
    cargoPreAnnouncementList: new NgcFormArray([
      new NgcFormGroup({
        checkboxFlag: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        uldBoardPoint: new NgcFormControl(),
        contentCode: new NgcFormControl(),
        uldOffPoint: new NgcFormControl(),
        uldStatus: new NgcFormControl(),
        transferType: new NgcFormControl(),
        phcFlag: new NgcFormControl(),
        shcCode: new NgcFormControl(),
        specialHandlingCodes: new NgcFormArray([
          new NgcFormGroup({
            preSpecialHandlingCode: new NgcFormControl(),
          })
        ]),
        connectingFlightId: new NgcFormControl(),
        flight: new NgcFormControl(),
        date: new NgcFormControl(),
        handlingMode: new NgcFormControl(),
        icsOutputLocation: new NgcFormControl(),

        handlingAreaCode: new NgcFormControl(),
        cargoTerminalCode: new NgcFormControl(),
        warehouseLocationCode: new NgcFormControl(),
        rampHandlingInstructions: new NgcFormControl(),
        warehouseHandlingInstructions: new NgcFormControl(),
        announcementSourceType: new NgcFormControl(),
        remarks: new NgcFormControl(),
        editShcs: new NgcFormControl(),
        handlingWerehouseValidation: new NgcFormControl()
      })
    ]),
  });
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private importService: ImportService, private activatedRoute: ActivatedRoute, private router: Router,
    private route: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
    this.route.params.subscribe(params => this.screenFunction = params.screenFunction);

  }

  ngOnInit() {
    this.dataSyncSearch = 0;
    this.screenFunctionParameter = this.createSourceParameter(this.screenFunction);
    let transferData = this.getNavigateData(this.activatedRoute);
    this.routedInformation = this.getNavigateData(this.activatedRoute);
    if (transferData != null) {
      this.form.get('flight').setValue(transferData.flight);
      this.form.get('date').setValue(transferData.flightDate);
      this.getPreannoucementTable();
    }
    this.terminal = this.getUserProfile().terminalId;
  }

  onRequestEdit(event, index) {
    console.log(index);
    this.form.get(['cargoPreAnnouncementList', index, 'editShcs']).setValue(true);
  }

  public saveUpdatePreannoucementTable() {
    this.resetFormMessages();
    (<NgcFormArray>this.form.get('cargoPreAnnouncementList')).controls.forEach((formGroup: NgcFormGroup, index) => {
      formGroup.get('handlingMode').clearValidators();
      formGroup.get('warehouseLocationCode').clearValidators();
    });
    console.log(this.form.getRawValue());

    //this.form.validate();
    if (this.form.invalid) {
      this.showWarningStatus('import.warn110');
      return;
    }

    const cargoPreAnnouncementGroup = new CargoPreAnnouncementGroup();
    cargoPreAnnouncementGroup.flight = this.form.controls['flight'].value;
    cargoPreAnnouncementGroup.date = this.form.controls['date'].value;
    cargoPreAnnouncementGroup.flightId = this.form.get('flightDetails.flightId').value;
    cargoPreAnnouncementGroup.screenFunction = this.screenFunction;
    cargoPreAnnouncementGroup.cargoPreAnnouncementList = (this.form.get(['cargoPreAnnouncementList']) as NgcFormArray).getRawValue();
    this.importService.saveUpdatePreannoucementTable(cargoPreAnnouncementGroup).subscribe(data => {
      if (!this.showResponseErrorMessages(data, null, 'flightDetails')) {
        this.getPreannoucementTable();
        this.showSuccessStatus('g.completed.successfully');
      }
    });

  }


  public getPreannoucementTable() {
    this.finalize = false;
    if (!this.form.get("flight").value) {
      this.form.validate();
      this.showErrorStatus("mandatory.field.not.empty")
      return;
    }
    this.editShcs = false;
    (<NgcFormArray>this.form.get(['cargoPreAnnouncementList'])).patchValue([]);
    this.isFlightDetails = false;
    const cargoPreAnnouncementRequest: CargoPreAnnouncementRequest = new CargoPreAnnouncementRequest();
    cargoPreAnnouncementRequest.screenFunction = this.screenFunction;
    cargoPreAnnouncementRequest.flight = this.form.get('flight').value;
    cargoPreAnnouncementRequest.date = this.form.get('date').value;
    this.resetFormMessages();
    this.importService.getPreannoucementTable(cargoPreAnnouncementRequest).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.resp = data;
        console.log(this.resp.data);


        if (data.data != null) {
          this.printFlag = true;
          this.saveFlag = true;
          this.isFlightDetails = false;
          if (this.resp.data.finalzeAndunFinalize === true) {
            this.finalizebutton = true;
            this.unfinalizebutton = false;
            this.form.get('finalizedAt').setValue(this.resp.data.finalizedAt);
            this.form.get('finalizedBy').setValue(this.resp.data.finalizedBy);
          } else if (this.resp.data.finalzeAndunFinalize === false) {
            this.unfinalizebutton = true;
            this.finalizebutton = false;
          }

        } else {
          this.refreshFormMessages(this.resp.data);
          this.showErrorStatus('no.record.found');
          this.isFlightDetails = false;
        }

        if (this.resp.data != null && this.resp.data.cargoPreAnnouncementList.length < 1) {
          this.showInfoStatus('import.info121');
        }
        if (this.resp.data.handlinginSystem && this.dataSyncSearch == 0) {
          this.showConfirmMessage('entered.flight.not.handled.in.cosys').then(reason => {
            this.bindata();
            this.dataSyncSearch++;
          }).catch(reason => {
            this.isFlightDetails = false;
          });
        } else {
          this.bindata();
        }
      }
    }, error => {
      this.showErrorStatus(error);
    })
  }

  bindata() {
    this.form.get(['flightDetails', 'flight']).setValue(this.resp.data.flight);
    this.form.get(['flightDetails', 'date']).setValue(this.resp.data.date);
    this.form.get(['flightDetails', 'sta']).setValue(this.resp.data.sta);
    this.form.get(['flightDetails', 'eta']).setValue(this.resp.data.eta);
    this.form.get(['flightDetails', 'ata']).setValue(this.resp.data.ata);
    this.form.get(['flightDetails', 'flightSeg']).setValue(this.resp.data.flightSeg);
    this.form.get(['flightDetails', 'segment']).setValue(this.resp.data.segment);
    this.form.get(['flightDetails', 'flightId']).setValue(this.resp.data.flightId);
    this.form.get(['flightDetails', 'status']).setValue(this.resp.data.status);
    this.form.get(['flightDetails', 'bulk']).setValue(this.resp.data.bulk);
    this.form.get(['flightDetails', 'bulkShipments']).setValue(this.resp.data.bulkShipments);
    this.form.get(['flightDetails', 'stBulkShipments']).setValue(this.resp.data.stBulkShipments);
    this.form.get(['cargoPreAnnouncementList']).patchValue(this.resp.data.cargoPreAnnouncementList);
    console.log((this.form.get(['cargoPreAnnouncementList']) as NgcFormArray).getRawValue());
    if (this.resp.data.flightId != null) {
      this.isFlightDetails = true;
    }
    if (this.resp.data.finalzeAndunFinalize === true) {
      (<NgcFormArray>this.form.get('cargoPreAnnouncementList')).controls.forEach((formGroup: NgcFormGroup, index) => {
        formGroup.disable();
      });
    }
  }

  public addRow() {
    this.createEmptyRow();
  }

  /**
   * 
   * Function will add empty record in the data table
  */
  public createEmptyRow() {
    let userInfo: UserProfile = this.getUserProfile();
    (<NgcFormArray>this.form.get('cargoPreAnnouncementList')).addValue([
      {
        uldNumber: '',
        incomingFlightId: '',
        uldBoardPoint: '',
        uldOffPoint: '',
        contentCode: 'C',
        uldStatus: '',
        transferType: '',
        uldLoadedWith: '',
        phcFlag: false,
        icsOutputLocation: '',
        handlingAreaCode: userInfo.terminalId,
        handlingMode: '',

        cargoTerminalCode: '',
        warehouseLocationCode: '',
        connectingFlightId: '',
        specialHandlingCodes: [],
        shcCode: '',
        editShcs: true,
        rampHandlingInstructions: '',
        warehouseHandlingInstructions: '',
        announcementSourceType: 'MANUAL',
        auditTrail: '',
        flight: '',
        date: '',
        manualFlag: true,
        selectFlag: true,
        flagInsert: 'Y',
        flagDelete: 'N',
        checkboxFlag: false,
        handlingWerehouseValidation: false,
        remarks: ''
      }
    ]);
  }

  onDelete() {
    this.cargoPreAnnouncementDeleteList = [];
    let notManulaUldList = [];
    const cargoPreAnnouncementGroup = new CargoPreAnnouncementGroup();
    cargoPreAnnouncementGroup.screenFunction = this.screenFunction;
    this.cargoPreAnnouncementList = (<NgcFormArray>this.form.get('cargoPreAnnouncementList')).getRawValue();
    for (let item of this.cargoPreAnnouncementList) {
      if (item.checkboxFlag === true) {
        item['flagCRUD'] = 'D';
        this.cargoPreAnnouncementDeleteList.push(item);
      }
    }

    cargoPreAnnouncementGroup['flightId'] = this.form.get(['flightDetails', 'flightId']).value;
    cargoPreAnnouncementGroup['flight'] = this.form.get(['flightDetails', 'flight']).value;
    cargoPreAnnouncementGroup['date'] = this.form.get(['flightDetails', 'date']).value;

    cargoPreAnnouncementGroup.cargoPreAnnouncementList = this.cargoPreAnnouncementDeleteList;
    this.showConfirmMessage('delete.selected.records').then(fulfilled => {
      this.importService.deletePreannoucementTable(cargoPreAnnouncementGroup).subscribe(data => {
        this.getPreannoucementTable();
        this.showSuccessStatus('g.completed.successfully');
      });
    }).catch(reason => {
    });
  }

  finalizeandandUnFinalize(event, check: any) {
    this.finalize = true;
    let handlingWerehouseValidationUldCheck: any = false;
    (<NgcFormArray>this.form.get('cargoPreAnnouncementList')).controls.forEach((formGroup: NgcFormGroup, index) => {
      let handlingWerehouseValidation = formGroup.get('handlingWerehouseValidation').value;
      let handlingMode = formGroup.get('handlingMode').value;
      let warehouseLocationCode = formGroup.get('warehouseLocationCode').value;
      if (handlingWerehouseValidation && (handlingMode == null || handlingMode == '' || warehouseLocationCode == null || warehouseLocationCode == '')) {
        handlingWerehouseValidationUldCheck = true;
      }
    });
    if (handlingWerehouseValidationUldCheck) {
      this.showWarningStatus('import.please.enter.all.mandatory.fileds');
      return;
    }
    if (this.form.get('cargoPreAnnouncementList').dirty && !this.finalizebutton) {
      this.showErrorMessage('import.save.details.before.finalize')
      return;
    }
    if (this.form.invalid) {
      this.showWarningStatus('import.please.enter.all.mandatory.fileds');
      return;
    }
    this.showConfirmMessage('want.to.finalize.unfinalize').then(fulfilled => {
      let cargoPreAnnouncementRequest: CargoPreAnnouncementRequest = new CargoPreAnnouncementRequest();
      cargoPreAnnouncementRequest.screenFunction = this.screenFunction;
      cargoPreAnnouncementRequest.flight = this.form.get('flight').value;
      cargoPreAnnouncementRequest.date = this.form.get('date').value;
      cargoPreAnnouncementRequest.flightId = this.form.get('flightDetails.flightId').value;
      cargoPreAnnouncementRequest.finalzeAndunFinalize = check;
      cargoPreAnnouncementRequest.bulk = this.form.get(['flightDetails', 'bulk']).value;
      cargoPreAnnouncementRequest.cargoPreAnnouncementList = (<NgcFormArray>this.form.get('cargoPreAnnouncementList')).getRawValue();
      this.importService.isfinalzeAndunFinalize(cargoPreAnnouncementRequest).subscribe(data => {
        this.resp = data;
        if (this.resp.messageList == null) {
          this.getPreannoucementTable();
        }
      });
    }).catch(reason => {
      this.getPreannoucementTable();
    });
  }

  clear(event): void {
    this.form.reset();
    this.resetFormMessages();
  }


  onCancel() {
    this.navigateBack(this.routedInformation);
  }

  wharehouseDestination(e, index) {
    if (e.code === "NO BREAK") {
      this.locationTypeArray = ['BRKDWN_NOBRK'];
    }
    else if (e.code === "BREAK") {
      this.locationTypeArray = ['BRKDWN'];
    }


    this.form.get(['cargoPreAnnouncementList', index, 'warehouseLocationCode']).patchValue(null);

  }

  onChangeUldDest(e, index) {
    if (!NgcUtility.isTenantCityOrAirport(e.code)) {
      this.form.get(['cargoPreAnnouncementList', index, 'uldStatus']).patchValue('TR');
    } else {
      this.form.get(['cargoPreAnnouncementList', index, 'uldStatus']).patchValue('IN');
    }
  }

  onChangeFlight(event, index) {
    this.isFlightExist(index);
    this.dataSyncSearch = 0;
  }

  onChangeFlightInfo(event) {
    this.dataSyncSearch = 0;
  }

  onChangeDate(event, index) {
    this.isFlightExist(index);
  }

  private isFlightExist(index: any) {
    let flight = this.form.get(['cargoPreAnnouncementList', index, 'flight']).value;
    let date = this.form.get(['cargoPreAnnouncementList', index, 'date']).value;
    var request = {
      flightKey: flight,
      flightOriginDate: date
    };
    if (request.flightKey !== null && request.flightOriginDate !== null && request.flightKey !== '' && request.flightOriginDate !== '') {
      this.importService.isFlightExist(request).subscribe(response => {
        this.refreshFormMessages(response);
        if (response.data === null) {
          this.form.get(['cargoPreAnnouncementList', index, 'flight']).setErrors({ 'invalid': true });
          this.form.get(['cargoPreAnnouncementList', index, 'date']).setErrors({ 'invalid': true });

        }
        else {
          this.resetFormMessages();
        }
      });
    }
  }

  onUpdateBreakBulkFlag(eventData) {
    const cargoPreAnnouncement = new CargoPreAnnouncement();
    cargoPreAnnouncement.incomingFlightId = this.form.get(['flightDetails', 'flightId']).value;
    cargoPreAnnouncement.bulk = this.form.get(['flightDetails', 'bulk']).value;
    console.log(cargoPreAnnouncement);
    this.importService.updateBreakBulkIndicator(cargoPreAnnouncement).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
      }
    });
  }

  openRampCheckIn() {
    const request = {
      flight: this.form.get('flight').value,
      flightDate: this.form.get('date').value
    }

    this.navigateTo(this.router, 'import/inbound-ramp-check-in', request);
  }

  onPrint() {
    this.reportParameters.flightId = this.form.get("flightDetails").get("flightId").value;
    this.reportParameters.screenFunction = this.screenFunction;
    this.reportParameters.dateSTA = this.form.get('date').value;
    this.reportParameters.flightKey = this.form.get('flight').value;
    this.reportParameters.user = this.getUserProfile().userLoginCode;

    this.reportWindow.open();
  }

  onPrintBreakdown() {
    this.reportParameters.flightDate = this.form.get('date').value;
    this.reportParameters.flightKey = this.form.get('flight').value;
    this.reportParameters.flightId = this.form.get("flightDetails").get("flightId").value;
    this.reportParameters.bulkFlag = (this.form.get("flightDetails").get("bulk").value ? 1 : 0);
    this.reportParameters.loggedInUser = this.getUserProfile().userShortName;
    if (this.resp.data.screenFunction == 'MAIL') {
      this.reportMail.open();
    } else {
      this.report.open();
    }
  }

  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  public afterFocus() {
    setTimeout(() => {
      try {
        this.firstField.focus();
      } catch (e) { }
    }, 200);
  }

}
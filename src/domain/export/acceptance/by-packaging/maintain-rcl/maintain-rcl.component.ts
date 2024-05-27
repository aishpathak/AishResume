import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import {
  NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcPage,
  NgcButtonComponent, PageConfiguration, NgcFormControl, UserProfile,
  NgcLOVComponent, NgcUtility, NgcPrinterComponent, NgcReportComponent
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { Validator, Validators } from '@angular/forms';
import { RclserviceService } from '../rclservice.service';
import { DimensionDetails, Dimention, RclRetriveReq, RclSearchReq, WeighingScaleRequest, SearchMaintainRCL, VolumetricRequest, SearchSpecialCargoShipmentForHO, RclGenerateAwbReq, validateAndFetchBookingReq, Shcs } from '../../../export.sharedmodel';
import { isBuffer } from 'util';
import { ExportService } from '../../../export.service';
import { Console } from 'console';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-maintain-rcl',
  templateUrl: './maintain-rcl.component.html',
  styleUrls: ['./maintain-rcl.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class MaintainRCLComponent extends NgcPage implements OnInit {
  shcsFromService: any;
  bookingColorFlag: boolean = false;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private rclService: RclserviceService, private exportService: ExportService, private cd: ChangeDetectorRef) {
    super(appZone, appElement, appContainerElement);

  }

  ngOnInit() {
    this.navigateData = this.getNavigateData(this.activatedRoute);
    const param = this.getNavigateData(this.activatedRoute); // to get the title for the page
    console.log("param", param);
    if (param != null && param.serviceInformationId != null) {
      this.entryForm = false;
      this.showCreateForm = true;
      this.onEdit(param);
    } else {
      for (let i = 0; i < 6; i++) {
        (<NgcFormArray>this.maintainrclForm.get('packagingInformationList')).addValue([this.PIList
        ]);
      }
      for (let i = 0; i < 3; i++) {
        (<NgcFormArray>this.maintainrclForm.get('liBattery')).addValue([this.liBattery
        ]);
      }
    }

  }

  @ViewChild('printerName') printerName: NgcPrinterComponent;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  @ViewChild('windows') windows: NgcWindowComponent;

  private PIList = {
    reference: null
  }

  private liBattery = {
    reference: null,
    pieces: null,
  }

  onPrint() {
    const req = this.maintainrclForm.getRawValue();
    this.reportParameters = new Object();
    let userInfo: UserProfile = this.getUserProfile();
    this.reportParameters.loggedInUser = userInfo.userLoginCode;
    this.reportParameters.serviceNumber = req.serviceNumber;
    this.reportParameters.shipmentNumber = req.shipmentNumber;
    this.reportParameters.uldNumber = req.uldNumber;

    if (this.acceptanceType == 'Export Bulk' || this.acceptanceType == 'Transfer Bulk') {
      this.printReport = 'maintain_rcl_bulk';
    }
    else if (this.acceptanceType == 'Export PPK' || this.acceptanceType == 'Transfer PPK') {
      this.printReport = 'maintainrclprepack';
    }
    else if (this.acceptanceType == 'Export Mix PPK' || this.acceptanceType == 'Transfer Mix PPK') {
      this.printReport = 'maintain_rcl_mixppk';
    }
    else if (this.acceptanceType == 'OBC' || this.acceptanceType == 'Cargo Bag') {
      this.printReport = 'maintain_rcl_cargo_obc';
    }
    else if (this.acceptanceType == 'Mail') {
      this.printReport = 'maintain_rcl_mail';
    }
    this.reportWindow.reportParameters = this.reportParameters;
    this.reportWindow.open();

  }

  onCancel() {
    this.navigateBack(this.navigateData);
  }

  printRacsfChecklist() {
    if (this.maintainrclForm.get('racsfResultFail').value == true) {
      this.printRacsfReport = 'RACSF_checklist_Reject';
    }
    else {
      this.printRacsfReport = 'RACSF_checklist';
    }
    const req = this.maintainrclForm.getRawValue();
    this.reportParameters1 = new Object();
    let userInfo: UserProfile = this.getUserProfile();
    this.reportParameters1.serviceNumber = req.serviceNumber;
    this.reportParameters1.loggedInUser = userInfo.userLoginCode;
    this.reportParameters1.loggedInUserName = userInfo.userShortName;

    this.reportWindow1.reportParameters = this.reportParameters1;
    this.reportWindow1.open();
  }

  checkChargableWeight(event) {
    console.log("weight event", event);
    if (this.maintainrclForm.get('volumetricWeight').value != null && (this.maintainrclForm.get('volumetricWeight').value > event)) {
      this.maintainrclForm.get('chargeableWeight').setValue(this.maintainrclForm.get('volumetricWeight').value);
    } else {
      this.maintainrclForm.get('chargeableWeight').setValue(event);
    }
  }

  maintainBUPList() {
    this.navigateTo(this.router, 'export/buplist', '');
  }

  onEdit(param) {
    const req: RclRetriveReq = new RclRetriveReq();
    req.serviceInformationId = param.serviceInformationId;
    req.acceptanceType = param.acceptanceType;
    console.log("req", req);
    this.rclService.getRCLRetrieveDetails(req).subscribe(resp => {
      console.log("resp", resp);
      if (resp.data.status == "Pending" || resp.data.status == "Weight diff") {
        this.finalizeFlag = false;
      }
      else {
        this.finalizeFlag = true;
      }
      if (resp.data.status == "Pending") {
        this.collectPaymentFlag = false;
      }
      let PIlenght = resp.data.packagingInformationList.length;
      console.log("PIlenght", PIlenght);
      for (let i = 0; i < 6 - PIlenght; i++) {
        resp.data.packagingInformationList.push(this.PIList);
      }
      let LIlenght = resp.data.liBattery.length;
      for (let i = 0; i < 3 - LIlenght; i++) {
        resp.data.liBattery.push(this.liBattery);
      }
      if (resp.data.weight > resp.data.volumetricWeight) {
        this.maintainrclForm.get('chargeableWeight').setValue(resp.data.weight);
      } else {
        this.maintainrclForm.get('chargeableWeight').setValue(resp.data.volumetricWeight);
      }
      if (resp.data.securityScreeningOption == 'screeningExempted') {
        this.screenExmptFlag = false;
      }
      resp.data.weighing.forEach(ele => {
        if (ele.weighingLocation == null) {
          ele.weighingLocation = [];
          ele.weighingLocation.push(this.locationRow);
        }
      })
      this.respArray = resp.data;
      console.log("PIlenght", resp.data.packagingInformationList.length);
      console.log("this.respArray", this.respArray);
      // For acceptance type only..
      this.maintainrclSearchForm.patchValue(this.respArray);
      this.maintainrclForm.patchValue(this.respArray);
      if (resp.data.volumeCode == null) {
        this.maintainrclForm.get('volumeCode').setValue('MC');
      }

      this.maintainrclForm.get('ScreeningIATACode').setValue(this.maintainrclForm.get('agentIATACode').value);
      this.maintainrclForm.get('ScreeningAgentName').setValue(this.maintainrclForm.get('agentName').value);

      if (resp.data.status == "Finalized" || resp.data.status == "Rejected") {
        this.finalizeStatus = true;
        this.finalizeformDisable = false;
        this.maintainrclForm.disable();

        resp.data.clearance.forEach((obj, index) => {
          (<NgcFormControl>this.maintainrclForm.get(["clearance", index])).disable();
        });
        resp.data.dimesion.forEach((obj, index) => {
          (<NgcFormControl>this.maintainrclForm.get(["dimesion", index])).disable();
        });

        resp.data.specialHandlingCode.forEach((obj, index) => {
          (<NgcFormControl>this.maintainrclForm.get(["specialHandlingCode", index])).disable();
        });
        resp.data.packagingInformationList.forEach((obj, index) => {
          (<NgcFormControl>this.maintainrclForm.get(["packagingInformationList", index])).disable();
        });
        resp.data.liBattery.forEach((obj, index) => {
          (<NgcFormControl>this.maintainrclForm.get(["liBattery", index])).disable();
        });
        resp.data.liBattery.forEach((obj, index) => {
          (<NgcFormControl>this.maintainrclForm.get(["liBattery", index])).disable();
        });
        (<NgcFormArray>this.maintainrclForm.get('weighing')).controls.forEach((obj, index) => {
          (<NgcFormArray>this.maintainrclForm.get(["weighing", index])).disable();
          (<NgcFormArray>obj.get('weighingLocation')).controls.forEach((ele, i) => {
            (<NgcFormControl>obj.get(['weighingLocation', i])).disable();
          });
        });
        resp.data.screening.forEach((obj, index) => {
          (<NgcFormControl>this.maintainrclForm.get(["screening", index])).disable();
        });
        resp.data.tags.forEach((obj, index) => {
          (<NgcFormControl>this.maintainrclForm.get(["tags", index])).disable();
        });
      }

      if (this.maintainrclForm.get('acceptanceType').value == 'Export Mix PPK' || this.maintainrclForm.get('acceptanceType').value == 'Transfer Mix PPK') {
        this.showUld = true;
        this.showAwb = false;
      } else {
        this.showAwb = true;
        this.showUld = false;
      }
      if (resp.data.specialHandlingCode != null && resp.data.specialHandlingCode.length > 0) {
        this.onShcChanges();
      }
      if (resp.data.dimesion.length > 0) {
        this.updateTotalshipmentDimension()
        this.setBookingDimentionValues()
      }
    });
  }
  navigateData: any;
  showUld: boolean = false;
  showAwb: boolean = false;
  showCreateForm: boolean = false;
  showMrclTable: boolean = false;
  generateAWBButton: boolean = false;
  createButton: boolean = true;
  entryForm: boolean = true;
  respArray: any[];
  acceptanceType = null;
  printReport: any;
  printRacsfReport: any;
  searchButton: boolean = false;
  DGRFlag: boolean = false;
  lithiumBatteryFlag: boolean = true;
  mrclSelectedRowIndex = null;
  searchResData = null;
  createfunction: boolean = false;
  //securedTransportationDisableFlag: boolean = false;
  wighingScaleAvailable: boolean = true;
  weighingScaleData: any;
  weighingscalename: any;
  screenExmptFlag: boolean = true;
  finalizeFlag: boolean = true;
  finalizeStatus: boolean = false;
  finalizeformDisable: boolean = true;
  collectPaymentFlag: boolean = true;
  prelodgeServiceNo = null;
  temperatureFlag: boolean = false;
  private mesurementData = ["CMT", "INH"];
  private terminalData = ["AAT", "CPSL", "HACTL"];
  private chargeTo = ["Agent", "Airline", "AAS"];
  private securityCheck = ["SPX", "UNK"];

  reportParameters: any;
  reportParameters1: any = null;
  isBookingAvailable = false;
  maintainrclSearchForm: NgcFormGroup = new NgcFormGroup({
    acceptanceType: new NgcFormControl(),
    awbPrefix: new NgcFormControl(),
    awbSuffix: new NgcFormControl(),
    nonIATAAwb: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    maintainrclFormSearchData: new NgcFormArray([
    ]),
  })
  maintainrclForm: NgcFormGroup = new NgcFormGroup({
    serviceNumber: new NgcFormControl(),
    documentInformationId: new NgcFormControl(),
    serviceInformationId: new NgcFormControl(),
    rclDate: new NgcFormControl(),
    acceptanceType: new NgcFormControl(),
    awbPrefix: new NgcFormControl(),
    awbSuffix: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    nonIATAAwb: new NgcFormControl(false),

    //creates Form Controls
    truckNumber: new NgcFormControl(),
    truckDock: new NgcFormControl(),
    requestedTemperatureRange: new NgcFormControl(),
    airsideAcceptance: new NgcFormControl(false),
    directTow: new NgcFormControl(false),
    handCarry: new NgcFormControl(false),
    mailType: new NgcFormControl(),
    dg: new NgcFormControl(false),
    dutiableCommodities: new NgcFormControl(false),
    exportProhibitedArticle: new NgcFormControl(false),
    thickness: new NgcFormControl(false),
    requiredScreening: new NgcFormControl(false),
    reasonForScreening: new NgcFormControl(),
    securityScreeningOption: new NgcFormControl(),
    screeningExemptedReason: new NgcFormControl(),
    rejected: new NgcFormControl(false),
    status: new NgcFormControl(),
    reasonCode: new NgcFormControl(),
    label1: new NgcFormControl(),
    pcs1: new NgcFormControl(),
    label2: new NgcFormControl(),
    pcs2: new NgcFormControl(),
    label3: new NgcFormControl(),
    pcs3: new NgcFormControl(),
    agentIATACode: new NgcFormControl(),
    agentId: new NgcFormControl(),
    agentCode: new NgcFormControl(),
    agentName: new NgcFormControl(),
    deliveryPerson: new NgcFormControl(),
    deliveryPersonId: new NgcFormControl(),
    remarks: new NgcFormControl(),

    transferCarrier: new NgcFormControl(),
    receivingCarrier: new NgcFormControl(),
    trmNumber: new NgcFormControl(),
    incomingFlight: new NgcFormControl(),
    incomingFlightDate: new NgcFormControl(),
    trfTerminal: new NgcFormControl(),

    weighingScaleId: new NgcFormControl(),
    printerId: new NgcFormControl(),

    //racsf form controls
    screeningSecuredTransportationMethod: new NgcFormControl(),
    racsfResultPass: new NgcFormControl(false),
    racsfResultFail: new NgcFormControl(false),
    racsfFailReason: new NgcFormControl(),
    //screening form controls
    rcaNumber: new NgcFormControl(),
    ScreeningIATACode: new NgcFormControl(),
    ScreeningAgentName: new NgcFormControl(),
    screeningRemarks: new NgcFormControl(),



    specialHandlingCode: new NgcFormArray([]),
    carrierCode: new NgcFormControl(),
    documentOrigin: new NgcFormControl(),
    documentDestination: new NgcFormControl(),
    piece: new NgcFormControl(),
    weight: new NgcFormControl(),
    densityGroupCode: new NgcFormControl(),
    volumetricWeight: new NgcFormControl(),
    chargeableWeight: new NgcFormControl(),
    natureOfGoodsDescription: new NgcFormControl(),
    packagingInformationList: new NgcFormArray([]),
    liBattery: new NgcFormArray([]),
    clearance: new NgcFormArray([
    ]),
    weighing: new NgcFormArray([
      new NgcFormGroup({
        sel: new NgcFormControl(),
        uldNumber: new NgcFormControl(),
        contourCode: new NgcFormControl(),
        height: new NgcFormControl(),
        overhang: new NgcFormControl(),
        pieces: new NgcFormControl(),
        // weight: new NgcFormControl(),
        netWeight: new NgcFormControl(),
        grossWeight: new NgcFormControl(),
        tareWeight: new NgcFormControl(),
        skidTareWeight: new NgcFormControl(),
        numberOfSkIds: new NgcFormControl(),
        skidHeight: new NgcFormControl(),
        weighingLocation: new NgcFormArray([
          new NgcFormGroup({
            shipmentLocation: new NgcFormControl(),
            actualLocation: new NgcFormControl(),
            wareHouseLocation: new NgcFormControl(),
            pieces: new NgcFormControl(),
            weight: new NgcFormControl(),
          })
        ])
      })
    ]),
    tags: new NgcFormArray([
    ]),
    screening: new NgcFormArray([
    ]),
    screeningInfo: new NgcFormGroup({
      screenedMethod: new NgcFormControl(),
      screeningDate: new NgcFormControl(),
      pieces: new NgcFormControl(),
      screenedWeight: new NgcFormControl(),
      chargeto: new NgcFormControl(),
    }),
    actionList: new NgcFormArray([
    ]),
    measurementUnitCode: new NgcFormControl('CMT'),
    volumeCode: new NgcFormControl('MC'),
    totalDimentionPieces: new NgcFormControl(0),
    tempVolume: new NgcFormControl(0.00),
    totalDimentionVolumetricWeight: new NgcFormControl(0.00),
    dimesion: new NgcFormArray([
    ]),
    racsf: new NgcFormArray([
    ]),
    booking: new NgcFormArray([])
  });

  private weighingRow = {
    sel: '',
    uldNumber: null,
    contourCode: null,
    height: null,
    overhang: null,
    pieces: null,
    // weight: null,
    netWeight: null,
    grossWeight: null,
    tareWeight: null,
    skidTareWeight: null,
    numberOfSkIds: null,
    skidHeight: null,
    weighingLocation: []
  }

  private locationRow = {
    sel: '',
    shipmentLocation: null,
    actualLocation: null,
    wareHouseLocation: null,
    pieces: null,
    weight: null,
  }

  onAddWeighing() {
    this.weighingRow.weighingLocation = [];
    this.weighingRow.weighingLocation.push(this.locationRow);
    (<NgcFormArray>this.maintainrclForm.get(['weighing'])).addValue([this.weighingRow
    ]);
  }

  onAddLocation(index: any) {
    console.log("sldl", index);
    (<NgcFormArray>this.maintainrclForm.get(['weighing', index, 'weighingLocation'])).addValue([this.locationRow
    ]);
    console.log("length", (<NgcFormArray>this.maintainrclForm.get(['weighing', index, 'weighingLocation'])).length);
  }

  weighingSelection(index) {
    console.log("weighning index", index);
  }

  weighingSelectionLocation(index, subindex) {
    console.log("weighning location index", index);
    console.log("weighning location subindex", subindex);
  }

  onDeleteRow(index) {
    // (<NgcFormArray>this.maintainrclForm.get(['weighing'])).markAsDeletedAt(index);
    let obj = (this.maintainrclForm.get(['weighing']) as NgcFormArray).getRawValue();
    obj.splice(index, 1);
    this.maintainrclForm.get('weighing').patchValue(obj);
  }

  onDeleteLocation(index, subIndex) {
    //(<NgcFormArray>this.maintainrclForm.get(['weighing', index, 'weighingLocation'])).markAsDeletedAt(subIndex);
    let obj = (this.maintainrclForm.get(['weighing', index, 'weighingLocation']) as NgcFormArray).getRawValue();
    obj.splice(subIndex, 1);
    (this.maintainrclForm.get(['weighing', index, 'weighingLocation']) as NgcFormArray).patchValue(obj);
  }

  getWeighingGrossWeight(index) {
    console.log("weighing index", index);
  }

  changeAcceptanceType(event) {
    this.acceptanceType = this.maintainrclSearchForm.get('acceptanceType').value;
    this.maintainrclSearchForm.get('shipmentNumber').setValue(null);
    this.maintainrclSearchForm.get('uldNumber').setValue(null);

    if (this.acceptanceType == 'Export Mix PPK' || this.acceptanceType == 'Transfer Mix PPK') {
      this.maintainrclForm.get('piece').setValue(1);
    }
    else {
      this.maintainrclForm.get('piece').setValue(null);
    }
    if (this.maintainrclSearchForm.get('acceptanceType').value != 'Export Bulk' && this.maintainrclSearchForm.get('acceptanceType').value != 'Export PPK' && this.maintainrclSearchForm.get('acceptanceType').value != 'Export Mix PPK') {
      this.searchButton = true;
    }
    else {
      this.searchButton = false;
    }

    if (this.maintainrclSearchForm.get('acceptanceType').value == 'Mail' || this.maintainrclSearchForm.get('acceptanceType').value == 'OBC' || this.maintainrclSearchForm.get('acceptanceType').value == 'Cargo Bag') {
      this.generateAWBButton = true;
    } else {
      this.generateAWBButton = false;
    }
  }

  changeScreeningOption() {
    const securityScreeningOption = this.maintainrclForm.get('securityScreeningOption').value;
    console.log("securityScreeningOption", securityScreeningOption);
    if (securityScreeningOption == 'screeningExempted') {
      console.log("securityScreeningOption", securityScreeningOption);
      this.screenExmptFlag = false;
    }
    else {
      this.screenExmptFlag = true;
    }
  }

  search() {
    if (this.maintainrclSearchForm.get('shipmentNumber').value == null && this.maintainrclSearchForm.get('uldNumber').value == null) {
      this.showErrorStatus('export.awb.uld.mandatory'); return;
    }
    this.showMrclTable = true;
    const searchRequest = this.maintainrclForm.getRawValue();

    const req: RclSearchReq = new RclSearchReq();

    req.shipmentNumber = this.maintainrclSearchForm.get('shipmentNumber').value;
    req.uldNumber = this.maintainrclSearchForm.get('uldNumber').value;
    req.acceptanceType = this.maintainrclSearchForm.get('acceptanceType').value;

    this.rclService.getmRCLList(req).subscribe(res => {
      console.log("api res data", res);
      if (res.data != null && res.data.length > 0) {
        this.maintainrclSearchForm.get('maintainrclFormSearchData').patchValue(res.data);
        this.searchResData = res.data;
      }
      else {
        this.showErrorStatus("no.record");
      }
    })
  }

  onSave() {
    if (this.validateForm() == false) {
      return;
    }
    this.finalizeFlag = true;
    const saveRequest = this.maintainrclForm.getRawValue();

    if (saveRequest.acceptanceType == 'Mail') {
      saveRequest.shipmentType = 'MAILAWB';
    }
    else if (saveRequest.acceptanceType == 'OBC' || saveRequest.acceptanceType == 'Cargo Bag') {
      saveRequest.shipmentType = 'OBC';
    }
    else {
      saveRequest.shipmentType = 'AWB';
    }
    this.rclService.saveRcl(saveRequest).subscribe(resp => {
      console.log("datajson", resp);
      if (this.showResponseErrorMessages(resp)) {
        return;
      }
      if (resp.success === true) {
        // this.finalizeFlag = false;
        // this.maintainrclForm.get('serviceNumber').setValue(resp.data.serviceNumber)
        // this.maintainrclForm.get('serviceInformationId').setValue(resp.data.serviceInformationId)
        // this.maintainrclForm.get('documentInformationId').setValue(resp.data.documentInformationId)
        // this.showSuccessStatus('g.completed.successfully');

        let rclDate = this.maintainrclForm.get('rclDate').value;
        if (rclDate == null) {
          rclDate = new Date();
        }
        rclDate = new Date(rclDate.getFullYear(), rclDate.getMonth(), rclDate.getDate(), 0, 0, 0, 0);
        {
          var dataTosend = {
            rclNumber: resp.data.serviceNumber,
            rclDate: rclDate,
          };
          this.navigateTo(this.router, 'export/acceptance/rclsummary', dataTosend);
          this.showSuccessStatus('g.completed.successfully');
        }
      }
    })
  }

  create(changeMixppkflag) {
    if (this.acceptanceType == 'Mail' || this.acceptanceType == 'OBC' || this.acceptanceType == 'Cargo Bag') {
      if (this.maintainrclSearchForm.get('awbPrefix').value == null || this.maintainrclSearchForm.get('awbSuffix').value == null) {
        this.showErrorStatus('exp.awb.prefix.mandatory'); return;
      }
      else {
        const shipmentNumber = this.maintainrclSearchForm.get('awbPrefix').value + this.maintainrclSearchForm.get('awbSuffix').value;
        this.maintainrclForm.get('shipmentNumber').setValue(shipmentNumber);
        this.maintainrclSearchForm.get('shipmentNumber').setValue(shipmentNumber);
        // this.maintainrclSearchForm.get('shipmentNumber').setValue(shipmentNumber);
      }
    }
    if (this.maintainrclSearchForm.get('shipmentNumber').value == null && this.maintainrclSearchForm.get('uldNumber').value == null) {
      this.showErrorStatus('export.awb.uld.mandatory'); return;
    }
    this.refreshFormMessages('');
    if (this.acceptanceType == 'Export Mix PPK' || this.acceptanceType == 'Transfer Mix PPK') {
      (<NgcFormGroup>this.maintainrclForm.get(['weighing', 0])).get('uldNumber').disable({ onlySelf: true });
      (<NgcFormGroup>this.maintainrclForm.get(['weighing', 0])).get('uldNumber').setValue(this.maintainrclSearchForm.get('uldNumber').value);
    }

    const request: validateAndFetchBookingReq = new validateAndFetchBookingReq();

    this.maintainrclForm.get('shipmentNumber').setValue(this.maintainrclSearchForm.get('shipmentNumber').value)
    this.maintainrclForm.get('uldNumber').setValue(this.maintainrclSearchForm.get('uldNumber').value)
    this.maintainrclForm.get('acceptanceType').setValue(this.maintainrclSearchForm.get('acceptanceType').value)

    request.shipmentNumber = this.maintainrclForm.get('shipmentNumber').value;
    request.uldNumber = this.maintainrclForm.get('uldNumber').value;
    request.acceptanceType = this.maintainrclForm.get('acceptanceType').value;

    this.rclService.validateAndFetchBooking(request).subscribe(resp => {

      if (this.showResponseErrorMessages(resp)) {
        return;
      }
      if (resp.success) {
        if (resp.data.booking != null && resp.data.booking.length > 0) {
          this.isBookingAvailable = true;
          this.maintainrclForm.get('booking').patchValue(resp.data.booking);
          console.log("booking..", this.maintainrclForm.get('booking').value);
          (<NgcFormArray>this.maintainrclForm.get('booking')).controls.forEach((element, i) => {
            var currentDateTime: any = NgcUtility.getDateTimeAsStringByFormat(new Date(), "YYYY-MM-DD HH:mm:ss.S");
            var elementDateTime: any = NgcUtility.getDateTimeAsStringByFormat(element.get('flightStd').value, "YYYY-MM-DD HH:mm:ss.S");
            console.log("currentDateTime", currentDateTime);
            console.log("elementDateTime", elementDateTime);
            var diff = (new Date(elementDateTime).getTime() - new Date(currentDateTime).getTime()) / 1000;
            diff /= (60 * 60);
            const hoursDiff = Math.abs(Math.round(diff));
            console.log("diff", hoursDiff)
            if (elementDateTime > currentDateTime && hoursDiff <= 4) {
              this.bookingColorFlag = true;
            }
          })
        }
      }
    });
    if (this.maintainrclForm.get('acceptanceType').value == 'Export Bulk' || this.maintainrclForm.get('acceptanceType').value == 'Transfer Bulk'
      || this.maintainrclForm.get('acceptanceType').value == 'Export PPK' || this.maintainrclForm.get('acceptanceType').value == 'Transfer PPK') {
      let req = this.maintainrclForm.getRawValue();
      this.rclService.getCarrierCodeByShipment(req).subscribe(data => {
        if (data != null) {
          this.maintainrclForm.get('carrierCode').setValue(data.data);
        }
      });
    }
    else if (this.maintainrclForm.get('acceptanceType').value == 'Export Mix PPK' || this.maintainrclForm.get('acceptanceType').value == 'Transfer Mix PPK') {
      let req = this.maintainrclForm.getRawValue();
      this.rclService.getCarrierCodeByULD(req).subscribe(data => {
        if (data != null) {
          this.maintainrclForm.get('carrierCode').setValue(data.data);
        }
      });
    }
    this.rclService.generateServiceNumber(request).subscribe(resp => {
      if (resp.success) {
        this.maintainrclForm.get('serviceNumber').setValue(resp.data);
      }
    })
    if (this.mrclSelectedRowIndex != null && changeMixppkflag != true) {
      console.log("erter", this.mrclSelectedRowIndex);
      // var req = (<NgcFormGroup>(<NgcFormArray>this.maintainrclForm.controls.maintainrclFormSearchData).
      //   controls[0]).get('prelodgeServiceId').value;
      var req = this.searchResData[this.mrclSelectedRowIndex];
      console.log("erter", req);


      // this.rclService.retrivePredecleartionDetails(req).subscribe(resp => {
      //   console.log("datajson", resp);
      //   if (resp.success) {
      //     if (this.showResponseErrorMessages(resp)) {
      //       return;
      //     }
      //     //this.securedTransportationDisableFlag = true;
      //     if (resp.data.acceptanceType == 'Bulk') {
      //       resp.data.acceptanceType = 'Export Bulk';
      //     }
      //     else if (resp.data.acceptanceType == 'Prepack') {
      //       resp.data.acceptanceType = 'Export PPK';
      //     }
      //     else if (resp.data.acceptanceType == 'Mix') {
      //       resp.data.acceptanceType = 'Export Mix PPK';
      //     }
      //     if (resp.data.packagingInformationList == null) {
      //       resp.data.packagingInformationList = [];
      //     }
      //     let obj = resp.data.specialHandlingCode.filter(obj => (obj.specialHandlingCode === 'ELI' || obj.specialHandlingCode === 'ELM'
      //       || obj.specialHandlingCode === 'RLI' || obj.specialHandlingCode === 'RLM' || obj.specialHandlingCode === 'RBI' || obj.specialHandlingCode === 'RBM'));
      //     if (obj.length > 0) {
      //       this.lithiumBatteryFlag = false;
      //     }
      //     this.prelodgeServiceNo = resp.data.prelodgeServiceNo;
      //     console.log("this.prelodgeServiceNo", this.prelodgeServiceNo)
      //     let PIlenght = resp.data.packagingInformationList.length;
      //     console.log("PIlenght", PIlenght);
      //     for (let i = 0; i < 6 - PIlenght; i++) {
      //       resp.data.packagingInformationList.push(this.PIList);
      //     }
      //     this.maintainrclForm.patchValue(resp.data);
      //     if (this.acceptanceType == 'Export Mix PPK') {
      //       this.maintainrclForm.get('piece').setValue(1);
      //     } else {
      //       this.maintainrclForm.get('piece').setValue(resp.data.documentPieces);
      //     }
      //     this.maintainrclForm.get('weight').setValue(resp.data.documentWeight);
      //     this.maintainrclForm.get('ScreeningIATACode').setValue(resp.data.agentIATACode);
      //     this.maintainrclForm.get('ScreeningAgentName').setValue(resp.data.agentName);

      //     if (resp.data.uldInfo != null && resp.data.uldInfo.length > 0) {
      //       resp.data.uldInfo.forEach((ele, i) => {
      //         if (this.maintainrclForm.get('weighing').value.length == 1 && i == 0) {
      //           (<NgcFormGroup>this.maintainrclForm.get(['weighing', 0])).get('uldNumber').setValue(ele.uldNumber);
      //           (<NgcFormGroup>this.maintainrclForm.get(['weighing', 0])).get('contourCode').setValue(ele.heightCode);
      //         } else {
      //           this.onAddWeighing();
      //           (<NgcFormGroup>this.maintainrclForm.get(['weighing', i])).get('uldNumber').setValue(ele.uldNumber);
      //           (<NgcFormGroup>this.maintainrclForm.get(['weighing', i])).get('contourCode').setValue(ele.heightCode);
      //         }
      //       })
      //     }
      //     if (resp.data.dimesion.length > 0) {
      //       this.updateTotalshipmentDimension()
      //       this.setBookingDimentionValues()
      //     }
      //     //this.showSuccessStatus('g.completed.successfully');
      //     if (this.isBookingAvailable == false) {
      //       (<NgcFormArray>this.maintainrclForm.get('booking')).addValue([
      //         {
      //           flightNumber: resp.data.flightKey,
      //           flightDate: resp.data.flightDate,
      //           unloadingPoint: '',
      //           flightStd: '',
      //           fblPieces: '',
      //           fblWeight: ''
      //         }
      //       ]);

      //     }
      //   }
      // })
    }
    this.showCreateForm = true;
    this.entryForm = false;
  }

  validateForm(): boolean {
    this.maintainrclForm.validate();
    if (this.maintainrclForm.invalid) {
      console.log("invalid fields", this.maintainrclForm.invalid)
      // this.showWarningStatus('flight.operation.failed');
      this.showWarningStatus('mandatory.invalid.fields');
      return false;
    }
    if ((this.acceptanceType == 'Export Mix PPK' || this.acceptanceType == 'Transfer Mix PPK') && this.maintainrclForm.get('piece').value != "1") {
      this.showErrorStatus('exp.accpt.mixppk.piece');
      return false;
    }

    if (this.maintainrclForm.get('airsideAcceptance').value && this.maintainrclForm.get('screening').value.length > 0) {
      this.showErrorStatus('exp.accpt.screening.airside.error');
      return false;
    }

    for (let element of (<NgcFormArray>this.maintainrclForm.get('clearance')).controls) {
      if (element.get('issueDate').value && element.get('expiryDate').value) {
        if (new Date(element.get('issueDate').value) > new Date(element.get('expiryDate').value)) {
          this.showErrorMessage("license/Permit expiry date can not be lesser than issue date");
          return false;
        }

      }
    }
    const searchReq = new SearchSpecialCargoShipmentForHO();
    searchReq.flightKey = this.maintainrclForm.get('incomingFlight').value;
    searchReq.flightDate = this.maintainrclForm.get('incomingFlightDate').value;
    if (searchReq.flightKey != null && searchReq.flightDate == null) {
      this.showErrorMessage("export.enter.flight.and.date");
      return false;
    }
    else if (searchReq.flightKey == null && searchReq.flightDate != null) {
      this.showErrorMessage("export.enter.flight.and.date");
      return false;
    }
    else if (searchReq.flightKey != null && searchReq.flightDate != null) {
      this.rclService.validateFlight(searchReq).subscribe(response => {
        if (response.success == false) {
          this.showErrorMessage("invalid.flight.date");
          return false;
        }
      });
    }

    if (this.maintainrclForm.get('specialHandlingCode').value.length > 0) {
      for (let element of (<NgcFormArray>this.maintainrclForm.get('specialHandlingCode')).controls) {
        console.log("shcelement", element);
        if (element.get('specialHandlingCode').value == 'DGR' && this.maintainrclForm.get('dg').value == false) {
          this.showErrorMessage("exp.mrcl.dg.error");
          return false;
        }
      };
    }

    if (this.temperatureFlag == true && (this.maintainrclForm.get('requestedTemperatureRange').value == null || this.maintainrclForm.get('requestedTemperatureRange').value == '')) {
      this.showErrorMessage("import.temp.mandatory");
      return false;
    }

    if (this.lithiumBatteryFlag == false && (this.acceptanceType == 'Export Bulk' || this.acceptanceType == 'Export PPK' || this.acceptanceType == 'Export Mix PPK')) {
      let PIFilter = (this.maintainrclForm.get(['packagingInformationList']) as NgcFormArray).getRawValue().filter(obj => (obj.reference != null));
      if (PIFilter == null || PIFilter.length == 0) {
        this.showErrorStatus("Atleast.One.PI.Lithium.Battery.is.Mandatory");
        return false;
      }
    }

    if (this.maintainrclForm.get('weighing').value.length == 0) {
      this.showErrorStatus("Atleast One Weighing entry is Mandatory");
      return false;
    }


    return true;
  }

  onFinalizeButton() {
    if (this.validateForm() == false) {
      return;
    }
    if ((<NgcFormArray>this.maintainrclForm.get('clearance')).length > 0) {
      for (let element of (<NgcFormArray>this.maintainrclForm.get('clearance')).controls) {
        if (element.get('expiryDate').value <= new Date()) {
          //if (new Date(element.get('issueDate').value) > new Date(element.get('expiryDate').value)) {
          this.showErrorMessage("exp.accpt.license.expired");
          return;
        }
      }
    }

    const finalizeReq = this.maintainrclForm.getRawValue();

    if (finalizeReq.acceptanceType == 'Mail') {
      finalizeReq.shipmentType = 'MAILAWB';
    }
    else if (finalizeReq.acceptanceType == 'OBC' || finalizeReq.acceptanceType == 'Cargo Bag') {
      finalizeReq.shipmentType = 'OBC';
    }
    else {
      finalizeReq.shipmentType = 'AWB';
    }
    this.rclService.finalizeRcl(finalizeReq).subscribe(resp => {
      console.log("finalize resp", resp);
      if (this.showResponseErrorMessages(resp)) {
        return;
      }
      if (resp.success === true) {
        let rclDate = this.maintainrclForm.get('rclDate').value;
        if (rclDate == null) {
          rclDate = new Date()
        }
        rclDate = new Date(rclDate.getFullYear(), rclDate.getMonth(), rclDate.getDate(), 0, 0, 0, 0);
        {
          var dataTosend = {
            rclNumber: resp.data.serviceNumber,
            rclDate: rclDate,
          };
          this.navigateTo(this.router, 'export/acceptance/rclsummary', dataTosend);
        }
        this.showSuccessStatus('g.completed.successfully');
      }
    })
  }

  closeFailure() {

  }

  retrivePredecleartionDetails(req, acceptanceType) {
    // this.rclService.retrivePredecleartionDetails(req).subscribe(resp => {
    //   console.log("datajson", resp);
    //   if (resp.success) {
    //     if (this.showResponseErrorMessages(resp)) {
    //       return;
    //     }
    //     if (resp.data.acceptanceType == 'Bulk') {
    //       resp.data.acceptanceType = 'Export Bulk';
    //     }
    //     else if (resp.data.acceptanceType == 'Prepack') {
    //       resp.data.acceptanceType = 'Export PPK';
    //     }
    //     else if (resp.data.acceptanceType == 'Mix') {
    //       resp.data.acceptanceType = 'Export Mix PPK';
    //     }
    //     if (resp.data.packagingInformationList == null) {
    //       resp.data.packagingInformationList = [];
    //     }
    //     let PIlenght = resp.data.packagingInformationList.length;
    //     console.log("PIlenght", PIlenght);
    //     for (let i = 0; i < 6 - PIlenght; i++) {
    //       resp.data.packagingInformationList.push(this.PIList);
    //     }
    //     this.maintainrclForm.patchValue(resp.data);
    //     this.maintainrclForm.get('piece').setValue(resp.data.documentPieces);
    //     this.maintainrclForm.get('weight').setValue(resp.data.documentWeight);
    //     if (resp.data.dimesion.length > 0) {
    //       this.setBookingDimentionValues()
    //     }
    //     //this.showSuccessStatus('g.completed.successfully');
    //   }
    //   this.acceptanceType = acceptanceType;
    //   if (this.acceptanceType != null && this.acceptanceType == 'Export Mix PPK') {
    //     console.log(resp.data.uldInfo[0].uldNumber);
    //     this.maintainrclForm.get('uldNumber').setValue(resp.data.uldInfo[0].uldNumber);
    //   }
    // })
  }
  onEditRcl(param) {
    console.log("param", param);
  }

  generateAWB() {
    const req: RclGenerateAwbReq = new RclGenerateAwbReq();
    req.acceptanceType = this.acceptanceType;
    req.awbPrefix = this.maintainrclSearchForm.get('awbPrefix').value;
    if (req.awbPrefix == null) {
      this.showErrorStatus('exp.prefix.mandatory');
      return false;
    }
    this.rclService.generateAwbNo(req).subscribe(resp => {
      console.log("gnawb", resp);
      if (this.showResponseErrorMessages(resp)) {
        this.showResponseErrorMessages(resp);
        return;
      }
      if (resp.success) {
        console.log("resp", resp);
        this.maintainrclSearchForm.get('awbSuffix').setValue(resp.data.awbSuffix)
        this.maintainrclSearchForm.get('shipmentNumber').setValue(resp.data.generatedAwbNumber);
        this.maintainrclForm.get('shipmentNumber').setValue(resp.data.generatedAwbNumber);
      }
    })
  }
  onAddClearanceTbl() {
    (<NgcFormArray>this.maintainrclForm.get('clearance')).addValue([
      {
        sel: '',
        documentType: '',
        documentNo: '',
        issueDate: '',
        expiryDate: '',
        //delete: ''
      }
    ]);
  }

  onDeleteClearance() {
    const formValue = this.maintainrclForm.getRawValue();
    const clearanceList = formValue.clearance;
    const deleteClearance = new Array<any>();
    clearanceList.forEach(element => {
      if (element.sel) {
        deleteClearance.push(element);
      }
    });
    (<NgcFormArray>this.maintainrclForm.controls['clearance']).deleteValue(deleteClearance);
    this.cd.detectChanges();
  }

  // deleteClearanceTbl(event, index, segmentrow) {
  //   let obj = (this.maintainrclForm.get(['clearance']) as NgcFormArray).getRawValue();
  //   if (obj[index].flagCRUD === 'C') {
  //     obj.splice(index, 1);
  //     this.maintainrclForm.get('clearance').patchValue(obj);
  //   }
  // }

  addDimensionListTable() {
    (<NgcFormArray>this.maintainrclForm.get('dimesion')).addValue([
      {
        sel: '',
        // sNo: '',
        length: null,
        width: null,
        height: null,
        pieces: null,
        volume: '0.00',
        // delete: ''
      }
    ]);
  }

  onDeleteDimension() {
    const formValue = this.maintainrclForm.getRawValue();
    const dimensionList = formValue.dimesion;
    const deleteDimension = new Array<any>();
    dimensionList.forEach(element => {
      if (element.sel) {
        deleteDimension.push(element);
      }
    });
    (<NgcFormArray>this.maintainrclForm.controls['dimesion']).deleteValue(deleteDimension);
    this.cd.detectChanges();
    this.updateTotalshipmentDimension();
    this.setBookingDimentionValues();
  }

  // deletedimension(event, index, segmentrow) {
  //   let obj = (this.maintainrclForm.get(['dimesion']) as NgcFormArray).getRawValue();
  //   if (obj[index].flagCRUD === 'C') {
  //     obj.splice(index, 1);
  //     this.maintainrclForm.get('dimesion').patchValue(obj);
  //   }
  // }

  addScreening() {
    (<NgcFormArray>this.maintainrclForm.get('screening')).addValue([
      {
        // sNo: '',
        sel: '',
        screenedMethod: '',
        screeningDate: '',
        pieces: '',
        screenedWeight: '',
        chargeto: ''
      }
    ]);
  }

  deleteScreeing(event, index, segmentrow) {
    let obj = (this.maintainrclForm.get(['screening']) as NgcFormArray).getRawValue();
    if (obj[index].flagCRUD === 'C') {
      obj.splice(index, 1);
      this.maintainrclForm.get('screening').patchValue(obj);
    }
  }

  onDeleteScreening() {
    const formValue = this.maintainrclForm.getRawValue();
    const screeningList = formValue.screening;
    const deleteScreening = new Array<any>();
    screeningList.forEach(element => {
      if (element.sel) {
        deleteScreening.push(element);
      }
    });
    (<NgcFormArray>this.maintainrclForm.controls['screening']).deleteValue(deleteScreening);
    this.cd.detectChanges();
  }

  addTagList() {
    (<NgcFormArray>this.maintainrclForm.get('tags')).addValue([
      {
        number: '',
        pieces: '',
      }
    ]);
  }

  deletetags(event, index, segmentrow) {
    let obj = (this.maintainrclForm.get(['tags']) as NgcFormArray).getRawValue();
    obj.splice(index, 1);
    this.maintainrclForm.get('tags').patchValue(obj);
    // (<NgcFormArray>this.maintainrclForm.get(['tags'])).markAsDeletedAt(index);
  }

  onViewFilesPopup() {
    this.windows.open();
  }

  onShcChanges() {
    this.lithiumBatteryFlag = true;
    this.temperatureFlag = false;
    this.retrieveLOVRecords('SHC_WITH_GROUP').subscribe(data => {
      console.log("shc data", data)
      this.shcsFromService = this.maintainrclForm.get(['specialHandlingCode']).value.map(shc => shc.specialHandlingCode);
      console.log("this.shcsFromService", this.shcsFromService);
      let shcsArray: Array<any> = new Array();
      shcsArray = this.shcsFromService;
      const shcs = data.filter(shc => this.shcsFromService.includes(shc.code));
      console.log("shcs", shcs);
      let i = 0;
      const ELICount = shcs.filter(obj => (obj.param2 === 'ELI'));
      if (ELICount.length > 0) {
        this.lithiumBatteryFlag = false;
      } else {
        this.lithiumBatteryFlag = true;
      }

      let j = 0;
      let dgrobj = [];
      let dgrEliobj = [];
      shcsArray.forEach(ele => {
        let filteredShc = shcs.filter(obj => (obj.code === ele));
        let dgrobj = filteredShc.filter(obj => (obj.param2 === 'DGR'));
        let dgrEliobj = filteredShc.filter(obj => (obj.param2 === 'ELI'));
        if (dgrobj.length > 0 && dgrEliobj.length == 0) {
          j++;
        }
      })
      if (j > 0) {
        this.maintainrclForm.get('dg').setValue(true);
      }
      else {
        this.maintainrclForm.get('dg').setValue(false);
      }
      //  })
      const PERCount = shcs.filter(obj => (obj.param2 === 'PER'));
      if (PERCount.length > 0) {
        this.temperatureFlag = true;
      }
    });
  }

  PIDuplicacy(event, index) {
    console.log("PIDuplicacy", event);
    let PIFilter = (this.maintainrclForm.get(['packagingInformationList']) as NgcFormArray).getRawValue().filter(obj => (obj.reference == event));
    if (PIFilter.length > 1) {
      (<NgcFormGroup>this.maintainrclForm.get(['packagingInformationList', index])).get('reference').setValue(null);
      this.showErrorMessage('exp.mrcl.piLithium.battery.duplicate.error');
      return;
    }
  }

  checkOriginDest(event) {
    console.log("event", event);
    if (this.maintainrclForm.get('documentOrigin').value != null && this.maintainrclForm.get('documentDestination').value != null
      && (this.maintainrclForm.get('documentOrigin').value == this.maintainrclForm.get('documentDestination').value)) {
      this.maintainrclForm.get('documentDestination').setValue(null);
      this.showErrorStatus('data.origin.destination.cannot.be.same');
      return;
    }
    else {
      this.resetFormMessages();
    }
  }
  selectionRow(index) {
    console.log("index", index);
    this.mrclSelectedRowIndex = index;
  }

  onSelectScale(event) {

    this.wighingScaleAvailable = false;
    console.log("weighing event", event);
    this.weighingScaleData = event.parameter1;
    console.log("weighing event", this.weighingScaleData);
    console.log("weighing event", event.parameter2);
    if (event.desc != null || event.desc != undefined) {
      this.weighingscalename = event.desc;
    }
    if (event.parameter2 == '1') {
      this.wighingScaleAvailable = true;

    }
  }

  getWeight(index) {
    let request: WeighingScaleRequest = new WeighingScaleRequest();
    if (this.weighingScaleData) {
      console.log("weighingScaleData", this.weighingScaleData);
      const tempDetails = this.weighingScaleData.split(':');
      console.log("tempDetails", tempDetails);
      request.wscaleIP = tempDetails[0];
      request.wscalePort = tempDetails[1];;
      console.log(request);
      this.exportService.getWeightInformation(request).subscribe(response => {
        this.refreshFormMessages(response);
        if (!this.showResponseErrorMessages(response)) {
          //this.weighingScaleDropdown = true;
        } else {
          // this.weighingScaleDropdown = false;
        }
        if (response.data !== null && response.data !== "" && response.success) {
          console.log(response.data);
          (<NgcFormGroup>this.maintainrclForm.get(['weighing', index])).get('grossWeight').setValue(response.data);
          this.getNetWeight(index);
          // this.showReadOnlyWeight = true;
          // this.addWeight = false;

        } else {
          (<NgcFormGroup>this.maintainrclForm.get(['weighing', index])).get('grossWeight').setValue(0.0);
          // this.showReadOnlyWeight = false;
          // this.addWeight = true;
        }
      })
    } else {
      this.showErrorStatus("export.select.weighing.scale");
      return;
    }
  }

  getNetWeight(index) {
    console.log("......", index);

    const grossWeight = this.maintainrclForm.get(['weighing', index]).get('grossWeight').value;
    const tareWeight = this.maintainrclForm.get(['weighing', index]).get('tareWeight').value;
    const skidWeight = this.maintainrclForm.get(['weighing', index]).get('skidTareWeight').value;
    const noOfSkid = this.maintainrclForm.get(['weighing', index]).get('numberOfSkIds').value;
    if (grossWeight != 0.0 && tareWeight != 0.0) {
      const netweight = grossWeight - tareWeight - (skidWeight * noOfSkid);
      console.log("netweight", netweight);
      this.maintainrclForm.get(['weighing', index]).get('netWeight').setValue(netweight);
    }
    else {
      this.maintainrclForm.get(['weighing', index]).get('netWeight').setValue(0.0);
    }
    let netWeightSum = 0.0;
    (<NgcFormArray>this.maintainrclForm.get('weighing')).controls.forEach(ele => {
      netWeightSum += ele.get('netWeight').value;
    })
    if (netWeightSum > 0) {
      this.maintainrclForm.get('weight').setValue(netWeightSum);
      this.eventCallDensity(this.maintainrclForm.get('densityGroupCode').value, 1);
    }
    else {
      this.maintainrclForm.get('weight').setValue("");
    }
  }

  changeDocumentType(event, index) {
    console.log("document event", event);
    this.maintainrclForm.get(['clearance', index]).get('issueDate').setValue(NgcUtility.getDateTimeAsStringByFormat(event.parameter2, "YYYY-MM-DD HH:mm:ss.S"));
    if (event.parameter3 != '1900-01-01 00:00:00.0')
      this.maintainrclForm.get(['clearance', index]).get('expiryDate').setValue(NgcUtility.getDateTimeAsStringByFormat(event.parameter3, "YYYY-MM-DD HH:mm:ss.S"));
  }

  changeMixPPK(event) {
    if (this.mrclSelectedRowIndex >= 0) {

    }
    if (this.mrclSelectedRowIndex >= 0) {
      var req = this.searchResData[this.mrclSelectedRowIndex];
      //req.changeMix_PPK = 1;
      if (req.changeMixPPK == true) {
        this.rclService.changePPKMixPPK(req).subscribe(resp => {
          console.log("datajson", resp);
          if (resp.success) {
            let PIlenght = resp.data.packagingInformationList.length;
            console.log("PIlenght", PIlenght);
            for (let i = 0; i < 6 - PIlenght; i++) {
              resp.data.packagingInformationList.push(this.PIList);
            }
            // For acceptance type only..
            this.maintainrclSearchForm.patchValue(resp.data);
            //this.changeAcceptanceType(resp.data.acceptanceType);
            this.maintainrclForm.patchValue(resp.data);
            this.maintainrclForm.get('piece').setValue(resp.data.documentPieces);
            if (this.acceptanceType == 'Export Mix PPK') {
              this.maintainrclForm.get('piece').setValue(1);
            }
            this.showCreateForm = true;
            this.entryForm = false;
            if (resp.data.acceptanceType = 'Export PPK') {
              if (resp.data.uldInfo != null && resp.data.uldInfo.length > 0) {
                resp.data.uldInfo.forEach((ele, i) => {
                  if (this.maintainrclForm.get('weighing').value.length == 1 && i == 0) {
                    (<NgcFormGroup>this.maintainrclForm.get(['weighing', 0])).get('uldNumber').setValue(ele.uldNumber);
                    (<NgcFormGroup>this.maintainrclForm.get(['weighing', 0])).get('contourCode').setValue(ele.heightCode);
                    (<NgcFormGroup>this.maintainrclForm.get(['weighing', i])).get('netWeight').setValue(ele.documentWeight);
                  } else {
                    this.onAddWeighing();
                    (<NgcFormGroup>this.maintainrclForm.get(['weighing', i])).get('uldNumber').setValue(ele.uldNumber);
                    (<NgcFormGroup>this.maintainrclForm.get(['weighing', i])).get('contourCode').setValue(ele.heightCode);
                    (<NgcFormGroup>this.maintainrclForm.get(['weighing', i])).get('netWeight').setValue(ele.documentWeight);
                  }
                })
              }

            }
            else if (resp.data.acceptanceType = 'Export Mix PPK') {
              (<NgcFormGroup>this.maintainrclForm.get(['weighing', 0])).get('uldNumber').setValue(resp.data.uldNumber);
              (<NgcFormGroup>this.maintainrclForm.get(['weighing', 0])).get('contourCode').setValue(resp.data.contourCode);
              (<NgcFormGroup>this.maintainrclForm.get(['weighing', 0])).get('netWeight').setValue(resp.data.documentPieces);

            }
            this.create(true);
            if (resp.data.specialHandlingCode != null && resp.data.specialHandlingCode.length > 0) {
              this.onShcChanges();
            }
          }
        })
      }
      else {
        this.showErrorStatus('exp.accpt.record.conversion'); return;
      }
    }
    else {
      this.showErrorStatus('export.select.a.record'); return;
    }
  }

  changeSecurityCheck(event) {
    if (this.maintainrclForm.get('requiredScreening').value == false) {
      this.maintainrclForm.get('reasonForScreening').setValue(null);
    }
  }

  changeRejectCheck(event) {
    if (this.maintainrclForm.get('rejected').value == false) {
      this.maintainrclForm.get('reasonCode').setValue(null);
    }
  }

  changeRacsfResult(event) {
    if (this.maintainrclForm.get('racsfResultFail').value == false) {
      this.maintainrclForm.get('racsfFailReason').setValue(null);
    }
  }

  eventCallDensity(event, fieldFlag) {
    const dimention: Dimention = new Dimention();
    dimention.weightCode = "K";
    console.log("event", event);
    console.log("event code", event.code);
    if (fieldFlag == 1) {
      dimention.dg = event;
    } else {
      dimention.dg = event.code;
    }
    dimention.shipmentWeight = +this.maintainrclForm.get('weight').value;
    this.exportService.getVolumeByDensity(dimention).subscribe(resp => {
      let volume = resp.data;
      if (volume !== null) {
        this.maintainrclForm.get('volumetricWeight').setValue(volume);
        if (this.maintainrclForm.get('totalDimentionVolumetricWeight').value > volume) {
          this.maintainrclForm.get('volumetricWeight').setValue(this.maintainrclForm.get('totalDimentionVolumetricWeight').value);
        }
        // if (dimention.shipmentWeight < volume) {
        if (dimention.shipmentWeight < this.maintainrclForm.get('volumetricWeight').value) {
          this.maintainrclForm.get('chargeableWeight').setValue(this.maintainrclForm.get('volumetricWeight').value);
        } else {
          this.maintainrclForm.get('chargeableWeight').setValue(dimention.shipmentWeight);
        }
      }
    });
  }

  changeDimensionModel(event, column, dimesion: NgcFormGroup, index) {
    console.log("changedimensionmodel", column);
    console.log("dimensionevent", event);
    if (dimesion.get('pieces').value == 0) {
      dimesion.get('pieces').setValue(null);
    }
    if (dimesion.get('length').value == 0) {
      dimesion.get('length').setValue(null);
    }
    if (dimesion.get('width').value == 0) {
      dimesion.get('width').setValue(null);
    }
    if (dimesion.get('height').value == 0) {
      dimesion.get('height').setValue(null);
    }
    if (column === 0) {
      this.updateTotalshipmentDimension();
    }
    if (dimesion.get('pieces').value !== null && dimesion.get('length').value !== null
      && dimesion.get('width').value !== null && dimesion.get('height').value !== null) {
      console.log("inside condition");
      this.setBookingDimentionValues();
    }
    console.log(event);
  }

  eventDimensionCall(event) {
    console.log(event);
    this.setBookingDimentionValues();
  }


  updateTotalshipmentDimension() {
    let picesCount = 0;
    (<NgcFormArray>this.maintainrclForm.get(['dimesion'])).getRawValue().forEach(ele => { picesCount += +ele.pieces; });
    this.maintainrclForm.get('totalDimentionPieces').setValue(picesCount);
  }

  setBookingDimentionValues() {
    const dimension: Dimention = new Dimention();
    let Pieces = this.maintainrclForm.get('piece').value;
    let totalPieces2 = this.maintainrclForm.get('totalDimentionPieces').value;
    dimension.unitCode = this.maintainrclForm.get('measurementUnitCode').value;
    dimension.weightCode = "K";
    dimension.volumeCode = this.maintainrclForm.get('volumeCode').value;
    // dimention.dg = this.form.get(['partBookingList', i]).get('densityGroupCode').value;
    dimension.shipmentPcs = this.maintainrclForm.get('piece').value;
    dimension.shipmentWeight = this.maintainrclForm.get('weight').value;
    const dimentionList1 = (<NgcFormArray>this.maintainrclForm.get(['dimesion'])).getRawValue();
    dimentionList1.forEach(element => {

      const dimentionDetail: DimensionDetails = new DimensionDetails();
      dimentionDetail.pcs = element.pieces;
      dimentionDetail.length = element.length;
      dimentionDetail.width = element.width;
      dimentionDetail.height = element.height;
      if (dimentionDetail.pcs !== null && dimentionDetail.length !== null && dimentionDetail.width !== null && dimentionDetail.height !== null)
        dimension.dimensionDetails.push(dimentionDetail);
    });
    if (dimension.dimensionDetails.length > 0) {
      this.exportService.getDimensionVolumetricWeight(dimension).subscribe(resps => {
        (<NgcFormArray>this.maintainrclForm.get(['dimesion'])).controls.forEach((dim: NgcFormGroup) => {
          let pieces = +dim.get('pieces').value;
          let length = +dim.get('length').value;
          let width = +dim.get('width').value;
          let height = +dim.get('height').value;

          const dimensionData = resps.data;
          if (dimensionData !== null) {
            const volume = dimensionData.dimensionDetails.filter(ele => (ele.pcs === pieces && ele.length === length && ele.width === width && ele.height === height))[0];
            dim.get('volume').setValue(volume.volume, { onlySelf: true, emitEvent: false });
            //dim.get('measurementUnitCode').setValue(dimension.unitCode);
            //dim.get('unitCode').setValue(dimension.unitCode);
            //dim.get('volumeUnitCode').setValue(dimension.volumeCode);
            this.maintainrclForm.get('tempVolume').setValue(resps.data.calculatedVolume);
            this.maintainrclForm.get('totalDimentionVolumetricWeight').setValue(resps.data.volumetricWeight);
            console.log("resps.data.volumetricWeight", resps.data.volumetricWeight)
            // if (Pieces === totalPieces2) {
            //   console.log("resps.data.calculatedVolume", resps.data.calculatedVolume)
            //   this.maintainrclForm.get('volume').setValue(resps.data.calculatedVolume);
            // }
            console.log("volumatricweight", this.maintainrclForm.get('volumetricWeight').value);
            if (this.maintainrclForm.get('volumetricWeight').value < resps.data.volumetricWeight) {
              //this.maintainrclForm.get('volumetricWeight').setValue(resps.data.volumetricWeight);
            }
          }
        });
      });
    }
    else {
      this.maintainrclForm.get('tempVolume').setValue(0.00);
      this.maintainrclForm.get('totalDimentionVolumetricWeight').setValue(0.0);
    }
  }

  setIATACode() {
    this.maintainrclForm.get('ScreeningIATACode').setValue(this.maintainrclForm.get('agentIATACode').value);
  }

  // setAgentName() {
  //   this.maintainrclForm.get('ScreeningAgentName').setValue(this.maintainrclForm.get('agentName').value);
  // }

  OnSelectAppointedAgentName(event, index) {
    this.maintainrclForm.get('agentIATACode').setValue(event.param1);
    this.maintainrclForm.get('ScreeningAgentName').setValue(event.desc);
    this.maintainrclForm.get('ScreeningIATACode').setValue(event.param1);
    this.maintainrclForm.get('agentId').setValue(event.param2);
    this.maintainrclForm.get('agentCode').setValue(event.code);
    console.log("agentevent", event);
    // const formGroup: NgcFormGroup = <NgcFormGroup>this.addCustomerForm.get(['appointedAgent', index]);
    // formGroup.get('customerCode').setValue(event.code);
  }

  collectPayment() {
    let shipmentNumber = this.maintainrclForm.get('shipmentNumber').value;
    let uldNumber = this.maintainrclForm.get('uldNumber').value;
    if (shipmentNumber == null) {
      shipmentNumber = '';
    }
    if (uldNumber == null) {
      uldNumber = '';
    }
    var dataTosend = {
      shipment: shipmentNumber,
      uldNumber: uldNumber,
      shipmentType: 'AWB',
      shipmentInfoFlag: true
    };
    this.navigateTo(this.router, 'billing/collectPayment/enquireCharges', dataTosend);
  }

}

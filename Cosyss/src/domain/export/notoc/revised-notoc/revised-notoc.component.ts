import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ReflectiveInjector,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  Pipe,
  PipeTransform,
  ContentChildren,
  forwardRef,
  ViewChild,
  OnInit
} from "@angular/core";

import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NotificationMessage,
  StatusMessage,
  MessageType,
  DropDownListRequest,
  BaseResponse,
  NgcWindowComponent,
  NgcUtility,
  NgcTabsComponent,
  NgcButtonComponent,
  PageConfiguration,
  NgcReportComponent,
  NgcInputComponent
} from "ngc-framework";
import { FormControlName } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Notoc,
  NotocDetail,
  SearchRegulation,
  DropdownPi
} from "./../../export.sharedmodel";
import { NotocService } from "../notoc.service";
import { DangerousgoodsService } from "../../dangerousgoods/dangerousgoods.service";
import { PsnDtlComponent } from "../../dangerousgoods/psn-dtl/psn-dtl.component";

@Component({
  selector: 'app-revised-notoc',
  templateUrl: './revised-notoc.component.html',
  styleUrls: ['./revised-notoc.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class RevisedNotocComponent extends NgcPage implements OnInit {

  selectedTabIndex: number = 0;
  isULDflg: boolean = false;
  isTab: boolean = false;
  searchtab: boolean = false;
  arraylist: any;
  resp: any;
  segmentDropdown: string[];
  caoDropdown: string[] = ["  ", "X"];
  resultSegments: any[];

  dgRegulationId: number;
  unid: any;
  overpackUnid: any;
  overpackAllpackUnid: any;
  allpackUnid: any;
  segment: Array<any> = new Array<any>();
  private uldSourceParameter: any;
  private awbSourceParameter: any;
  search = new SearchRegulation();
  dgRegulationRes: any;
  btnFlag: boolean;
  boardPoint: any;
  offPoint: any;
  finalizeFlag: boolean = true;
  unFinalizeFlag: boolean = false;
  reportParameters: any;
  weightCheck: any;
  searchFlg: boolean = true;
  dontSaveWeight: boolean = false;
  dontSaveQuantity: boolean = false;
  itemDesc: any;
  transferData: any;
  dlsFinalize: boolean = false;
  finalizeButton: boolean = false;
  flightDep: boolean = false;
  isSQCarrier: boolean = false;
  disableForSQ: boolean = true;
  showSaveUpdate: boolean = true;
  notoc: string;
  declareNilNotoc: boolean = true;
  deleteButtonCheck: boolean = false;
  oldRequest: NotocDetail = new NotocDetail();
  freeTextEnrtyTab: boolean = false;
  editWindow: boolean = false;
  globalSegmet: any;

  @ViewChild("reportPrintNOTOC") reportPrintNOTOC: NgcReportComponent;
  @ViewChild("reportNotificationToCaptainF7") reportNotificationToCaptainF7: NgcReportComponent;

  @ViewChild("insertionULDWindow") insertionULDWindow: NgcWindowComponent;
  @ViewChild("insertionOSLWindow") insertionOSLWindow: NgcWindowComponent;
  @ViewChild("insertionSpiWindow") insertionSpiWindow: NgcWindowComponent;
  @ViewChild("insertionFreeTextWindow") insertionFreeTextWindow: NgcWindowComponent;
  @ViewChild("finalizeWindow") finalizeWindow: NgcWindowComponent;
  @ViewChild('uldNumber') uldNumber: NgcInputComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notocService: NotocService,
    private dangerousgoodsService: DangerousgoodsService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private notocForm: NgcFormGroup = new NgcFormGroup({
    checkerInitial: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightKey1: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    flightOriginDate1: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    paxCao: new NgcFormControl(),
    aircraftReg: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    segmentList: new NgcFormControl(),
    seg: new NgcFormControl(),
    unid: new NgcFormArray([]),
    ntmVersionSent: new NgcFormControl(),
    sentBy: new NgcFormControl(),
    lastFinalizedBy: new NgcFormControl(),
    status: new NgcFormControl(),
    finalizeVersion: new NgcFormControl(),
    finalizestatus: new NgcFormControl(),
    overPack: new NgcFormArray([]),
    allPack: new NgcFormArray([]),
    otherSpecialLoadArray: new NgcFormArray([]),
    specialInstructionArray: new NgcFormArray([]),
    missingInfoInDLS: new NgcFormControl(),
    freeText: new NgcFormArray([]),
    createdBy: new NgcFormControl(),
    notocDangerousGoodsDetails: new NgcFormArray([]),
    otherSpecialLoads: new NgcFormArray([]),
    insertSpi: new NgcFormArray([]),
    freeTextWindow: new NgcFormArray([]),
    notocRptFormat: new NgcFormControl(),
    carrierCode: new NgcFormControl()
  });


  ngOnInit() {
    super.ngOnInit();
    this.transferData = this.getNavigateData(this.route);
    try {
      if (this.transferData !== null && this.transferData !== undefined) {
        this.notocForm.patchValue(this.transferData);
        this.onSearch(this.transferData);
      }
    } catch (e) { }
  }

  onMerge($event) {
    const detail: any = this.notocForm.getRawValue();
    detail.notocDangerousGoodsDetails.forEach(uni => {
      if (uni.unidNumber) {
        detail.unid.push(uni);
      }
    });
    this.notocForm.get("unid").patchValue(detail.unid);
    this.insertionULDWindow.close();
  }

  onSearch(request) {
    this.isTab = false;
    //
    if (request.button) {
      this.notocForm.get("seg").setValue(null);
    }
    const notocRequest: Notoc = new Notoc();
    notocRequest.boardingPoint = this.boardPoint;
    notocRequest.offPoint = this.offPoint;
    notocRequest.flightKey = this.notocForm.get("flightKey").value;
    notocRequest.flightOriginDate = this.notocForm.get("flightOriginDate").value;
    notocRequest.isRevisedNotoc = true;
    this.declareNilNotoc = true;
    this.notocService.fetchSearchFlight(notocRequest).subscribe(
      data => {
        this.resp = data;
        this.resp.loggedinuser;
        this.arraylist = this.resp.data;
        if (this.refreshFormMessages(data)) {
          return;
        }
        if (this.resp.data.dlsFinalize) {
          this.dlsFinalize = this.resp.data.dlsFinalize;
        }
        this.finalizeButton = this.resp.data.finalizeButton;
        this.flightDep = this.resp.data.flightDep;
        this.isSQCarrier = this.arraylist.flight.isSQCarrier;
        if (this.arraylist.flight.isSQCarrier) {
          this.disableForSQ = false;
        } else {
          this.disableForSQ = true;
        }
        if (this.arraylist != null) {
          this.resetFormMessages();
          this.resultSegments = this.arraylist.flight.flightLegs;
          this.notocForm.controls["flightKey1"].setValue(
            this.arraylist.flight.flightKey
          );
          this.notocForm.controls["flightOriginDate1"].patchValue(
            this.resp.data.flight.flightOriginDate
          );
          this.notocForm.controls["std"].setValue(
            this.arraylist.flight.flightLegs[0].datStd
          );
          this.notocForm.controls["etd"].setValue(
            this.arraylist.flight.flightLegs[0].datEtd
          );
          this.notocForm.controls["paxCao"].setValue(
            this.arraylist.flight.serviceType
          );
          this.notocForm.controls["aircraftReg"].setValue(
            this.arraylist.flight.aircraftRegistrationNumber
          );
          this.notocForm.controls["aircraftType"].setValue(
            this.arraylist.flight.aircraftType
          );
          this.notocForm.controls["ntmVersionSent"].setValue(
            this.arraylist.ntmVersionSent
          );
          this.notocForm.controls["lastFinalizedBy"].setValue(this.arraylist.lastFinalizedBy);
          this.notocForm.controls["checkerInitial"].setValue(this.arraylist.checkerInitial);
          this.notocForm.controls["finalizestatus"].setValue(
            this.arraylist.status
          );
          this.notocForm.controls["finalizeVersion"].setValue(
            this.arraylist.finalizeVersion
          );
          this.notocForm.controls["createdBy"].setValue(
            this.arraylist.createdBy
          );
          this.notocForm.controls["notocRptFormat"].setValue(
            this.arraylist.notocRptFormat
          );
          this.notocForm.controls["carrierCode"].setValue(
            this.arraylist.flight.carrierCode
          );
          let un = new Array();
          let al = new Array();
          let ov = new Array();

          this.disableForSQ = false;
          if (this.arraylist.dgHeaders != null && this.arraylist.dgHeaders.length > 0 && this.arraylist.dgHeaders[0].unids) {
            this.notocForm.get("unid").patchValue(this.arraylist.dgHeaders[0].unids);
            this.declareNilNotoc = false;
          } else {
            this.notocForm
              .get("unid")
              .patchValue(new Array());
          }

          if (this.arraylist.otherSpecialLoads && this.arraylist.otherSpecialLoads.length > 0) {
            this.declareNilNotoc = false;
            this.notocForm
              .get("otherSpecialLoadArray")
              .patchValue(this.arraylist.otherSpecialLoads);
          } else {
            this.notocForm
              .get("otherSpecialLoadArray")
              .patchValue(new Array());
          }
          if (this.arraylist.specialInstructions && this.arraylist.specialInstructions.length > 0) {
            this.declareNilNotoc = false;
            this.notocForm
              .get("specialInstructionArray")
              .patchValue(this.arraylist.specialInstructions);
          } else {
            this.notocForm
              .get("specialInstructionArray")
              .patchValue(new Array());
          }
          if (this.arraylist.freeText && this.arraylist.freeText.length > 0) {
            this.declareNilNotoc = false;
            this.notocForm.get("freeText").patchValue(this.arraylist.freeText);
          } else {
            this.notocForm.get("freeText").patchValue(new Array());
          }
          this.getSegments();
          if (!this.notocForm.get("seg").value) {
            this.showErrorStatus("export.select.segment.or.refresh");
            return;
          } else {
            let index = this.segment.indexOf(this.notocForm.get("seg").value);
            this.uldSourceParameter = this.createSourceParameter(
              this.arraylist.flight.flightLegs[index].flightSegmentId
            );
            this.globalSegmet = this.arraylist.flight.flightLegs[index].flightSegmentId;
          }
        } else {
          this.isTab = false;
          this.notocForm
            .get("otherSpecialLoadArray")
            .patchValue(new Array());
          this.notocForm
            .get("specialInstructionArray")
            .patchValue(new Array());
          this.notocForm.get("freeText").patchValue(new Array());
          this.showErrorStatus("export.enter.valid.flight.detail");
        }
        //this.searchFlg = false;
      },
      error => {
        this.showErrorStatus("Error:" + error);
      }
    );
  }

  /**
    * For  a given flight and date, this method generates the list of segments displayed in the segment dropdown list
    */
  public getSegments() {
    this.segment = [];

    this.segmentDropdown = new Array<string>();
    for (let index = 0; index < this.resultSegments.length; index++) {
      this.segmentDropdown.push(
        this.resultSegments[index].boardPointCode +
        "-" +
        this.resultSegments[index].offPointCode
      );
    }
    this.notocForm.reset;
    this.segment = this.segmentDropdown;
    if (this.searchFlg) {
      this.notocForm.get(["seg"]).setValue(this.segment[0]);
    }
    this.btnFlag = true;
    this.isULDflg = true;
    this.isTab = true;
  }

  unidRowData = {
    select: false,
    uldNumber: "",
    awbNumber: "",
    unidNumber: "",
    packingGroupCode: "",
    pgList: "",
    packageWeight: "",
    packagePieces: "",
    packageQuantity: "",
    packingInstructions: "",
    piList: "",
    packingInstructionCategory: "",
    transportIndex: "",
    notificationFlightType: "",
    technicalName: "",
    categoryList: "",
    packingRemarks: "",
    overpackNumber: false,
    apioNumber: false,
    awbId: "",
    uldId: null,
    impCode: "",
    param1: "",
    notificationWeightUnitCode: ""
  };


  addUnidByUld() {
    this.editWindow = true;
    this.insertionULDWindow.open();
    if (this.notocForm.get("seg").value) {
      this.notoc = "DG Report" + " " + "[" + " " + "Segment :" + this.notocForm.get("seg").value + " " + "]";
    } else {
      this.showErrorStatus("export.select.segment.or.refresh");
      return;
    }
    (<NgcFormArray>this.notocForm.get("insertSpi")).resetValue([]);
    (<NgcFormArray>this.notocForm.get("freeTextWindow")).resetValue([]);
    (<NgcFormArray>this.notocForm.get("otherSpecialLoads")).resetValue([]);
    (<NgcFormArray>this.notocForm.get("notocDangerousGoodsDetails")).resetValue([]);
    for (let i = 0; i < 10; i++) {
      (<NgcFormArray>this.notocForm.get("notocDangerousGoodsDetails")).addValue([this.unidRowData]);
    }
  }


  oslData = {
    select: false,
    uldKey: "",
    packageWeight: "",
    awbNumber: "",
    specialHandlingCode: "",
    packagePieces: "",
    packageQuantity: 0.0,
    natureOfGoodsDescription: "",
    technicalName: "",
    packingRemarks: "",
    dryIceQuantity: "",
    uldId: null
  }

  onAddRowotherSpecialLoad() {
    this.insertionOSLWindow.open();
    if (this.notocForm.get("seg").value) {
      this.notoc = "Other Special Load" + " " + "[" + " " + "Segment :" + this.notocForm.get("seg").value + " " + "]";
    } else {
      this.showErrorStatus("export.select.segment.or.refresh");
      return;
    }
    this.notocForm.get("notocDangerousGoodsDetails").patchValue(new Array);
    this.notocForm.get("otherSpecialLoads").patchValue(new Array);
    this.notocForm.get("insertSpi").patchValue(new Array);
    this.notocForm.get("freeTextWindow").patchValue(new Array);
    for (let i = 0; i < 10; i++) {
      (<NgcFormArray>this.notocForm.get(["otherSpecialLoads"])).addValue([this.oslData]);
    }
  }

  onAddRowspecialInstruction() {
    this.insertionSpiWindow.open();
    if (this.notocForm.get("seg").value) {
      this.notoc = "Special Instruction" + " " + "[" + " " + "Segment :" + this.notocForm.get("seg").value + " " + "]";
    } else {
      this.showErrorStatus("export.select.segment.or.refresh");
      return;
    }

    this.notocForm.get("notocDangerousGoodsDetails").patchValue(new Array);
    this.notocForm.get("otherSpecialLoads").patchValue(new Array);
    this.notocForm.get("insertSpi").patchValue(new Array);
    this.notocForm.get("freeTextWindow").patchValue(new Array);
    for (let i = 0; i < 5; i++) {
      (<NgcFormArray>this.notocForm.get(["insertSpi"])).addValue([
        {
          select: false,
          specialRemarks: ""
        }
      ]);
    }
  }

  onAddRowFreeText() {
    (<NgcFormArray>this.notocForm.get(["freeTextWindow"])).addValue([
      {
        select: false,
        uldNumber: "",
        packageWeight: "",
        awbNumber: "",
        unidNumber: "",
        properShippingName: "",
        technicalName: "",
        dgClassCode: "",
        impCode: "",
        emergencyRespondGroup: "",
        dgSubRiskCode1: "",
        dgSubRiskIMPCode1: "",
        dgSubRiskCode2: "",
        dgSubRiskIMPCode2: "",
        packingGroupCode: "",
        packingInstructionDescription: "",
        packagePieces: "",
        packageQuantity: "",
        packageMaximumQty: "",
        notificationWeightUnitCode: "",
        packingInstructions: "",
        packingInstructionCategory: "",
        transportIndex: "",
        notificationFlightType: "",
        packingRemarks: "",
        uldId: null
      }
    ]);
  }

  freeTextOpen() {
    this.insertionFreeTextWindow.open();
    this.notocForm.get("notocDangerousGoodsDetails").patchValue(new Array);
    this.notocForm.get("otherSpecialLoads").patchValue(new Array);
    this.notocForm.get("insertSpi").patchValue(new Array);
    this.notocForm.get("freeTextWindow").patchValue(new Array);
    this.onAddRowFreeText();
    this.onAddRowFreeText();
    this.onAddRowFreeText();
    this.onAddRowFreeText();
    if (this.notocForm.get("seg").value) {
      this.notoc = "Free Text Entry" + " " + "[" + " " + "Segment :" + this.notocForm.get("seg").value + " " + "]";
    } else {
      this.showErrorStatus("export.select.segment.or.refresh");
      return;
    }
  }

  getDgIDUnid(event, index) {
    this.checkUnidChange(event, index);
    var pgCode: any = [];
    var categoryCodes: any = [];
    let shc: any;
    this.search.dgRegulationId = event.param1;
    this.dangerousgoodsService
      .getDgRegulationsDetails(this.search)
      .subscribe(response => {
        if (response.data) {
          this.dgRegulationRes = response.data;
          if (this.dgRegulationRes[0]) {
            this.dgRegulationId = this.dgRegulationRes[0].regId;
            this.dgRegulationRes[0].dgDetails.forEach(pgRes => {
              pgCode.push(pgRes.pg);
            });
            if (event.param3 == "RRW") {
              categoryCodes.push("I");
            } else if (event.param3 == "RRY") {
              categoryCodes.push("II");
              categoryCodes.push("III");
            } else {
              categoryCodes.push("I");
              categoryCodes.push("II");
              categoryCodes.push("III");
            }
          }

          if (pgCode && pgCode.length > 0) {
            (<NgcFormArray>this.notocForm.get([
              "notocDangerousGoodsDetails",
              index,
              "pgList"
            ])).patchValue(pgCode);
          }
          if (categoryCodes && categoryCodes.length > 0) {
            (<NgcFormArray>this.notocForm.get([
              "notocDangerousGoodsDetails",
              index,
              "categoryList"
            ])).patchValue(categoryCodes);
          }
        }
      });

    this.dgRegulationId = event.param1;
    let x: any = this.notocForm.get(["notocDangerousGoodsDetails", index]).value;
    x.unidNumber = event.code;
    x.properShippingName = event.desc;
    x.dgClassCode = event.param2;
    if (event.parameter1 == "1") {
      x.technicalNameFlag = true;
    } else {
      x.technicalNameFlag = false;
    }
    x.dgRegulationId = this.dgRegulationId;
    x.impCode = event.param3;
    x.dgSubRiskCode1 = event.param5;
    this.notocForm.get(["notocDangerousGoodsDetails", index]).patchValue(x);
  }

  //refresh the record,if UNID numer is change
  checkUnidChange(event, index) {
    let unid: any = this.notocForm.get(["notocDangerousGoodsDetails", index]).value;

    if (unid.packingGroupCode || unid.packingInstructions || unid.packageWeight || unid.packingInstructionCategory) {
      unid.packingGroupCode = "";
      unid.packageQuantity = "";
      unid.packagePieces = "";
      unid.packageWeight = "";
      unid.packingInstructions = "";
      unid.packingInstructionCategory = "";
      unid.transportIndex = "";
      unid.notificationFlightType = "";
      unid.technicalName = "";
      unid.overpackNumber = "";
      unid.apioNumber = "";
      unid.packingRemarks = "";
      unid.pgList = "";
      unid.categoryList = "";
      unid.categoryList = "";
      unid.piList = "";
      this.notocForm.get(["notocDangerousGoodsDetails", index]).patchValue(unid);
    }
  }

  onUpdate($event) {
    if (this.dontSaveQuantity) {
      this.showErrorStatus("export.dgd.max.limit.exceed.for.quantity");
      return;
    }
    if (this.freeTextEnrtyTab) {
      this.showErrorStatus("export.invalid.pi.used");
      return;
    }

    this.showSaveUpdate = true;
    const detail: any = this.notocForm.getRawValue();
    const request: NotocDetail = new NotocDetail();
    let unidArray = new Array();
    let oslArray = new Array();
    let spiArray = new Array();
    let freeTextArray = new Array();
    detail.notocDangerousGoodsDetails.forEach(u => {
      if (!u.overpackNumber) {
        u["overpackNumber"] = null;
      }
      if (!u.apioNumber) {
        u["apioNumber"] = null;
      }
      if (u.unidNumber) {
        unidArray.push(u);
      }
    });
    detail.otherSpecialLoads.forEach(u => {
      if (u.awbNumber) {
        oslArray.push(u);
      }
    });

    detail.insertSpi.forEach(u => {
      if (u.specialRemarks) {
        spiArray.push(u);
      }
    });

    detail.freeTextWindow.forEach(u => {
      if (u.awbNumber) {
        freeTextArray.push(u);
      }
    });

    request.flightKey = this.arraylist.flight.flightKey;
    request.flightOriginDate = this.arraylist.flight.flightOriginDate;
    request.flagCRUD = this.arraylist.flagCRUD;
    request.flightId = this.arraylist.flight.flightId;
    if (detail.seg) {
      request.flightBoardPoint = detail.seg.slice(0, 3);
      request.flightOffPoint = detail.seg.slice(4, 7);
    }
    request.transactionSequenceNo = null;
    request.notocId = this.arraylist.notocId;
    request.notocDangerousGoodsDetails = unidArray;
    request.otherSpecialLoads = oslArray;
    request.specialInstructions = spiArray;
    request.freeText = freeTextArray;
    request.dgRegulations = null;
    request.flight = this.arraylist.flight;
    request.dgHeaders = null;
    if (detail.checkerInitial) {
      request.checkerInitial = detail.checkerInitial;
    }
    this.notocService.saveNotocDetail(request).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("DATASAVED001");
          // this.onSearch(request);
          this.oldRequest = request;
          this.finalizeFlag = data.data.finalizeButtonAfterSave;
          this.notocForm.controls["lastFinalizedBy"].setValue(data.data.lastFinalizedBy);
          this.notocForm.controls["checkerInitial"].setValue(data.data.checkerInitial);
          this.notocForm.controls["createdBy"].setValue(data.data.createdBy);
          if (data.data && data.data.dlsFinalize) {
            this.dlsFinalize = data.data.dlsFinalize;
          }
          this.notocForm.get("notocDangerousGoodsDetails").patchValue(new Array);
          this.insertionULDWindow.close();
          this.insertionOSLWindow.close();
          this.insertionSpiWindow.close();
          this.insertionFreeTextWindow.close();
        } else {
          this.showResponseErrorMessages(data);
        }
        this.resp = data;
      },
      err => {
        this.showErrorStatus("export.server.not.running");
      }
    );
  }

  onUpdatePopUpOpen($event, tab) {
    if (this.dontSaveQuantity) {
      this.showErrorStatus("export.dgd.max.limit.exceed.for.quantity");
      return;
    }
    if (this.freeTextEnrtyTab) {
      this.showErrorStatus("export.invalid.pi.used");
      return;
    }
    this.showSaveUpdate = true;
    const detail: any = this.notocForm.getRawValue();
    const request: NotocDetail = new NotocDetail();
    let unidArray = new Array();
    let oslArray = new Array();
    let spiArray = new Array();
    let freeTextArray = new Array();
    detail.notocDangerousGoodsDetails.forEach(u => {
      if (!u.overpackNumber) {
        u["overpackNumber"] = null;
      }
      if (!u.apioNumber) {
        u["apioNumber"] = null;
      }
      if (u.unidNumber) {
        unidArray.push(u);
      }
    });
    detail.otherSpecialLoads.forEach(u => {
      if (u.awbNumber) {
        oslArray.push(u);
      }
    });

    detail.insertSpi.forEach(u => {
      if (u.specialRemarks) {
        spiArray.push(u);
      }
    });

    detail.freeTextWindow.forEach(u => {
      if (u.awbNumber) {
        freeTextArray.push(u);
      }
    });

    request.flightKey = this.arraylist.flight.flightKey;
    request.flightOriginDate = this.arraylist.flight.flightOriginDate;
    request.flagCRUD = this.arraylist.flagCRUD;
    request.flightId = this.arraylist.flight.flightId;
    if (detail.seg) {
      request.flightBoardPoint = detail.seg.slice(0, 3);
      request.flightOffPoint = detail.seg.slice(4, 7);
    }
    request.transactionSequenceNo = null;
    request.notocId = this.arraylist.notocId;
    request.notocDangerousGoodsDetails = unidArray;
    request.otherSpecialLoads = oslArray;
    request.specialInstructions = spiArray;
    request.freeText = freeTextArray;
    request.dgRegulations = null;
    request.flight = this.arraylist.flight;
    request.dgHeaders = null;
    if (detail.checkerInitial) {
      request.checkerInitial = detail.checkerInitial;
    }
    this.notocService.saveNotocDetail(request).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("DATASAVED001");
          // this.onSearch(request);
          this.oldRequest = request;
          this.finalizeFlag = data.data.finalizeButtonAfterSave;
          this.notocForm.get("notocDangerousGoodsDetails").patchValue(new Array);
          if (tab == 'first') {
            this.addUnidByUld();
          }
          if (tab == 'Second') {
            this.onAddRowotherSpecialLoad();
          }
          if (tab == 'third') {
            this.onAddRowspecialInstruction();
          }
        } else {
          this.showResponseErrorMessages(data);
        }
        this.resp = data;
      },
      err => {
        this.showErrorStatus("export.server.not.running");
      }
    );
  }

  onOpenInsertNotoc() {
    this.uldSourceParameter.uid = Math.random();
  }

  onCloseInsertNotoc() {
    this.editWindow = false;
    this.notocForm.get("notocDangerousGoodsDetails").patchValue(new Array);
    this.freeTextEnrtyTab = false;
    this.dontSaveQuantity = false;
    this.onSearch(this.oldRequest);
  }

  onCloseOslWindow() {
    this.notocForm.get("otherSpecialLoads").patchValue(new Array);
    this.onSearch(this.oldRequest);
  }
  onCloseSpiWindow() {
    this.notocForm.get("insertSpi").patchValue(new Array);
    this.onSearch(this.oldRequest);
  }

  onCloseFreeTextWindow() {
    this.notocForm.get("freeTextWindow").patchValue(new Array);
    this.onSearch(this.oldRequest);
  }

  onSave($event) {
    const detail: any = this.notocForm.getRawValue();
    const request: NotocDetail = new NotocDetail();
    let unidArray = new Array();
    let freeTextArray = new Array();
    let spiArray = new Array();
    let oslArray = new Array();

    detail.unid.forEach(u => {
      u["overpackNumber"] = null;
      u["apioNumber"] = null;
      if (u.select && this.deleteButtonCheck) {
        u["flagCRUD"] = "D";
      }
      unidArray.push(u);
    });

    detail.otherSpecialLoadArray.forEach(u => {
      if (u.awbNumber) {
        if (u.select && this.deleteButtonCheck) {
          u["flagCRUD"] = "D";
        }
        oslArray.push(u);
      }
    });

    detail.freeText.forEach(u => {
      if (u.select && this.deleteButtonCheck) {
        u["flagCRUD"] = "D";
      }
      freeTextArray.push(u);
    });

    detail.specialInstructionArray.forEach(u => {
      if (u.select && this.deleteButtonCheck) {
        u["flagCRUD"] = "D";
        spiArray.push(u);
      }
    });
    request.flightKey = this.arraylist.flight.flightKey;
    request.flightOriginDate = this.arraylist.flight.flightOriginDate;
    request.flagCRUD = this.arraylist.flagCRUD;
    request.flightId = this.arraylist.flight.flightId;
    if (detail.seg) {
      request.flightBoardPoint = detail.seg.slice(0, 3);
      request.flightOffPoint = detail.seg.slice(4, 7);
    } else {
      this.showErrorStatus("export.select.segment.before.saving");
      return;
    }
    request.transactionSequenceNo = null;
    request.notocId = this.arraylist.notocId;
    request.notocDangerousGoodsDetails = unidArray;
    request.otherSpecialLoads = oslArray;
    request.specialInstructions = spiArray;
    request.freeText = freeTextArray;
    request.dgRegulations = null;
    request.flight = this.arraylist.flight;
    request.dgHeaders = null;
    if (detail.checkerInitial) {
      request.checkerInitial = detail.checkerInitial;
    }
    this.notocService.saveNotocDetail(request).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("DATASAVED001");
          this.deleteButtonCheck = false;
          this.onSearch(request);
          this.finalizeFlag = data.data.finalizeButtonAfterSave;
        } else {
          this.showResponseErrorMessages(data);
        }
        this.resp = data;
      },
      err => {
        this.showErrorStatus("export.server.not.running");
      }
    );
  }

  onULDTrolleyNoSelectForDGTab(event, index) {
    if (event.desc) {
      this.notocForm.get(['notocDangerousGoodsDetails', index, 'uldId']).setValue(event.desc);
    } else {
      this.notocForm.get(['notocDangerousGoodsDetails', index, 'uldId']).setValue(null);
    }
  }

  onULDTrolleyNoSelectForOSLTab(event, index) {
    if (event.desc) {
      this.notocForm.get(['otherSpecialLoads', index, 'uldId']).setValue(event.desc);
    } else {
      this.notocForm.get(['notocDangerousGoodsDetails', index, 'uldId']).setValue(null);
    }
  }

  onULDTrolleyNoSelectFreeTextTab(event, index) {
    if (event.desc) {
      this.notocForm.get(['freeTextWindow', index, 'uldId']).setValue(event.desc);
    } else {
      this.notocForm.get(['notocDangerousGoodsDetails', index, 'uldId']).setValue(null);
    }
  }

  awbNumberParameter(req) {
    if (req) {
      return null;
    } else {
      return this.globalSegmet;
    }
  }

  onSegmentSelect(event) {
    this.btnFlag = true;
    this.isULDflg = true;
    this.isTab = true;
    if (event != null) {
      let index = this.segment.indexOf(event);
      this.globalSegmet = this.arraylist.flight.flightLegs[index].flightSegmentId;
      this.uldSourceParameter = this.createSourceParameter(
        this.arraylist.flight.flightLegs[index].flightSegmentId
      );
      const splitVal = event.split("-");
      this.boardPoint = splitVal[0];
      this.offPoint = splitVal[1];
      if (this.searchFlg) {
        this.searchFlg = false;
      } else {
        this.onSearch(event);
      }
    } else {
      this.boardPoint = null;
      this.offPoint = null;
    }
  }

  awbNumberMaxWeight(req, index) {
    this.weightCheck = req.param2;
    this.notocForm.get(['notocDangerousGoodsDetails', index, 'awbId']).setValue(req.param1);
  }

  awbNumberMaxWeightOtherSpecialLoad(req, index) {
    this.weightCheck = req.param2;
    this.notocForm.get(['otherSpecialLoads', index, 'awbId']).setValue(req.param1);
  }


  getUnidPi(event, index) {
    var pckingIns: any = [];
    let dropdownPi1 = new DropdownPi();
    let dropdownPi2 = new DropdownPi();
    let dropdownPi3 = new DropdownPi();


    if (this.dgRegulationRes[0]) {
      this.dgRegulationRes[0].dgDetails.forEach(pgRes => {
        if (pgRes.pg == event) {
          if (
            this.notocForm.get("paxCao").value == "P" ||
            this.notocForm.get("paxCao").value == "J"
          ) {
            dropdownPi1.code = pgRes.mlqPInfo;
            dropdownPi1.desc = pgRes.mlqQuantity;
            dropdownPi1.unitCode = pgRes.mlqUnit;
            pckingIns.push(dropdownPi1);
            dropdownPi2.code = pgRes.mpcPInfo;
            dropdownPi2.desc = pgRes.mpcQuantity;
            dropdownPi2.unitCode = pgRes.mpcUnit;
            pckingIns.push(dropdownPi2);
          } else {
            dropdownPi3.code = pgRes.mlqPInfo;
            dropdownPi3.desc = pgRes.mlqQuantity;
            dropdownPi3.unitCode = pgRes.mlqUnit;
            pckingIns.push(dropdownPi3);
            dropdownPi2.code = pgRes.mpcPInfo;
            dropdownPi2.desc = pgRes.mpcQuantity;
            dropdownPi2.unitCode = pgRes.mpcUnit;
            pckingIns.push(dropdownPi2);
            dropdownPi1.code = pgRes.mcoPInfo;
            dropdownPi1.desc = pgRes.mcoQuantity;
            dropdownPi1.unitCode = pgRes.mcoUnit;
            pckingIns.push(dropdownPi1);
          }
        }
      });
    }
    if (pckingIns && pckingIns.length > 0) {
      (<NgcFormArray>this.notocForm.get(["notocDangerousGoodsDetails", index, "piList"])).patchValue(
        pckingIns
      );
    }
  }

  /**
    * On Tab Select
    */
  public onTabSelect(event) {
    if (event.index > -1) {
      this.selectedTabIndex = event.index;
    }
  }

  public groupsRenderer(
    value: string | number,
    rowData: any,
    level: any
  ): string {
    if (!rowData) {
      return;
    }
    if (rowData.data && rowData.data.overpackNumber != null && rowData.data && rowData.data.apioNumber == null) {
      return "OVERPACK" + "  " + rowData.data.overpackNumber;
    }
    else if (rowData.data && rowData.data.overpackNumber == null && rowData.data && rowData.data.apioNumber != null) {
      return "ALLPACK" + "  " + rowData.data.apioNumber;
    }
    else if (rowData.data && rowData.data.overpackNumber != null && rowData.data && rowData.data.apioNumber != null) {
      return "OVERPACK" + "  " + rowData.data.overpackNumber + " - " + "ALLPACK" + "  " + rowData.data.apioNumber;
    } else {
      return "UN-ID";
    }
  }

  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  editUnid(event) {
    var editPgCode: any = [];
    this.showSaveUpdate = false;
    let editUld = new Array();
    this.notocForm.get("notocDangerousGoodsDetails").patchValue(new Array);
    this.notocForm.get("otherSpecialLoads").patchValue(new Array);
    this.notocForm.get("insertSpi").patchValue(new Array);
    this.notocForm.get("freeTextWindow").patchValue(new Array);

    const editRow = (<NgcFormArray>this.notocForm.get([
      "unid",
      event.record.NGC_ROW_ID
    ])).getRawValue();
    editUld.push(editRow);
    this.search.dgRegulationId = editUld[0].dgRegulationId;
    this.dangerousgoodsService
      .getDgRegulationsDetails(this.search)
      .subscribe(response => {
        if (response.data) {
          this.dgRegulationRes = response.data;
          if (editUld[0].packingInstructions) {
            editUld[0].piList = [editUld[0].packingInstructions];
          }
          this.dgRegulationRes[0].dgDetails.forEach(pgRes => {
            editPgCode.push(pgRes.pg);
          });

          if (editUld[0].packingGroupCode) {
            editUld[0].pgList = editPgCode;
          }
          if (this.notocForm.get("seg").value) {
            this.notoc = "DG Report" + " " + "[" + " " + "Segment :" + this.notocForm.get("seg").value + " " + "]";
          } else {
            this.showErrorStatus("export.select.segment.or.refresh");
            return;
          }
          editUld[0].param1 = editUld[0].dgRegulationId;
          this.notocForm.get("notocDangerousGoodsDetails").patchValue(editUld, { onlySelf: true, emitEvent: false });
          this.editWindow = true;
          this.insertionULDWindow.open();
          this.getUnidPi(editUld[0].packingGroupCode, 0);
        }
      });
  }


  editOsl(event) {
    this.showSaveUpdate = false;
    let editUld = new Array();
    this.notocForm.get("notocDangerousGoodsDetails").patchValue(new Array);
    this.notocForm.get("otherSpecialLoads").patchValue(new Array);
    this.notocForm.get("insertSpi").patchValue(new Array);
    this.notocForm.get("freeTextWindow").patchValue(new Array);
    if (this.notocForm.get("seg").value) {
      this.notoc = "Other Special Load" + " " + "[" + " " + "Segment :" + this.notocForm.get("seg").value + " " + "]";
    } else {
      this.showErrorStatus("export.select.segment.or.refresh");
      return;
    }
    this.insertionOSLWindow.open();
    const editRow = (<NgcFormArray>this.notocForm.get([
      "otherSpecialLoadArray",
      event.record.NGC_ROW_ID
    ])).getRawValue();
    editUld.push(editRow);
    this.notocForm.get("otherSpecialLoads").patchValue(editUld);
  }

  editSpi(event) {
    this.showSaveUpdate = false;
    let editUld = new Array();
    this.notocForm.get("notocDangerousGoodsDetails").patchValue(new Array);
    this.notocForm.get("otherSpecialLoads").patchValue(new Array);
    this.notocForm.get("insertSpi").patchValue(new Array);
    this.notocForm.get("freeTextWindow").patchValue(new Array);
    if (this.notocForm.get("seg").value) {
      this.notoc = "Special Instruction" + " " + "[" + " " + "Segment :" + this.notocForm.get("seg").value + " " + "]";
    } else {
      this.showErrorStatus("export.select.segment.or.refresh");
      return;
    }
    this.insertionSpiWindow.open();
    const editRow = (<NgcFormArray>this.notocForm.get([
      "specialInstructionArray",
      event.record.NGC_ROW_ID
    ])).getRawValue();
    editUld.push(editRow);
    this.notocForm.get("insertSpi").patchValue(editUld);
  }

  editFreeText(event) {
    this.showSaveUpdate = false;
    let editUld = new Array();
    this.notocForm.get("notocDangerousGoodsDetails").patchValue(new Array);
    this.notocForm.get("otherSpecialLoads").patchValue(new Array);
    this.notocForm.get("insertSpi").patchValue(new Array);
    this.notocForm.get("freeTextWindow").patchValue(new Array);
    if (this.notocForm.get("seg").value) {
      this.notoc = "Free Text Entry" + " " + "[" + " " + "Segment :" + this.notocForm.get("seg").value + " " + "]";
    } else {
      this.showErrorStatus("export.select.segment.or.refresh");
      return;
    }

    this.insertionFreeTextWindow.open();
    const editRow = (<NgcFormArray>this.notocForm.get([
      "freeText",
      event
    ])).getRawValue();
    editUld.push(editRow);
    this.notocForm.get("freeTextWindow").patchValue(editUld);
  }

  onDelete(event): void {
    let checkbox = false;
    this.deleteButtonCheck = true;
    const x = this.notocForm.getRawValue();
    let uIndex = 0;
    x.unid.forEach(e => {
      if (e["select"]) {
        checkbox = true;
      }
      uIndex++;
    });
    if (checkbox) {
      this.showConfirmMessage(
        "export.delete.checked.ticked.records.confirmation")
        .then(fulfilled => { this.onSaveForDelete(x); }).catch(reason => { });
    } else {
      this.showErrorStatus("export.select.records.before.delete");
    }
  }

  onDeleteowOtherSpecialLoad(event) {
    let checkbox = false;
    this.deleteButtonCheck = true;
    const x = this.notocForm.getRawValue();
    let uIndex = 0;
    x.otherSpecialLoadArray.forEach(e => {
      if (e["select"]) {
        checkbox = true;
      }
      uIndex++;
    });
    if (checkbox) {
      this.showConfirmMessage(
        "export.delete.checked.ticked.records.confirmation")
        .then(fulfilled => { this.onSaveForDelete(x); }).catch(reason => { });
    } else {
      this.showErrorStatus("export.select.records.before.delete");
    }
  }

  onDeleteSpecialInstruction(event) {
    this.deleteButtonCheck = true;
    let checkbox = false;
    const x = this.notocForm.getRawValue();
    let uIndex = 0;
    x.specialInstructionArray.forEach(e => {
      if (e["select"]) {
        checkbox = true;
      }
      uIndex++;
    });
    if (checkbox) {
      this.showConfirmMessage(
        "export.delete.checked.ticked.records.confirmation")
        .then(fulfilled => { this.onSaveForDelete(x); }).catch(reason => { });
    } else {
      this.showErrorStatus("export.select.records.before.delete");
    }
  }

  onDeleteFreeText(event): void {
    let checkbox = false;
    this.deleteButtonCheck = true;
    const x = this.notocForm.getRawValue();
    let uIndex = 0;

    x.freeText.forEach(e => {
      if (e["select"]) {
        checkbox = true;
      }
      uIndex++;
    });
    if (checkbox) {
      this.showConfirmMessage(
        "export.delete.checked.ticked.records.confirmation")
        .then(fulfilled => { this.onSaveForDelete(x); }).catch(reason => { });
    } else {
      this.showErrorStatus("export.select.records.before.delete");
    }
  }

  onDeletePopUp(event): void {
    const x = this.notocForm.getRawValue();
    for (let i = x.notocDangerousGoodsDetails.length - 1; i >= 0; i--) {
      if (x.notocDangerousGoodsDetails[i].select) {
        (<NgcFormArray>this.notocForm.controls["notocDangerousGoodsDetails"]).markAsDeletedAt(i);
      }
    }
  }

  onDeleteowOtherSpecialLoadPopUp(event) {
    const x = this.notocForm.getRawValue();
    for (let i = x.otherSpecialLoads.length - 1; i >= 0; i--) {
      if (x.otherSpecialLoads[i].select) {
        (<NgcFormArray>this.notocForm.controls["otherSpecialLoads"]).markAsDeletedAt(i);
      }
    }
  }

  onDeleteSpecialInstructionPopUp(event) {
    const x = this.notocForm.getRawValue();
    for (let i = x.insertSpi.length - 1; i >= 0; i--) {
      if (x.insertSpi[i].select) {
        (<NgcFormArray>this.notocForm.controls["insertSpi"]).markAsDeletedAt(i);
      }
    }
  }

  onDeletePopUpFreeText(event) {
    const x = this.notocForm.getRawValue();
    for (let i = x.freeTextWindow.length - 1; i >= 0; i--) {
      if (x.freeTextWindow[i].select) {
        (<NgcFormArray>this.notocForm.controls["freeTextWindow"]).markAsDeletedAt(i);
      }
    }
  }

  navigatebackToDls() {
    let transferData: any;
    transferData = { flightKey: this.notocForm.get('flightKey').value, flightOriginDate: this.notocForm.get('flightOriginDate').value }
    this.navigateTo(this.router, '/export/buildup/update-dls', transferData)
  }

  onFinaliZe() {
    if (!this.resp.data.checkDataSavedForFinalize && this.declareNilNotoc) {
      this.showErrorStatus("export.press.capture.checker.initials.before.finalize");
      return;
    }
    const detailFinalize: any = this.notocForm.getRawValue();
    const finalizeData = new NotocDetail();
    finalizeData.flightId = this.arraylist.flight.flightId;
    finalizeData.segmentId = this.globalSegmet;
    finalizeData.flightKey = this.arraylist.flight.flightKey;
    finalizeData.flightOriginDate = this.arraylist.flight.flightOriginDate;
    finalizeData.flight = this.arraylist.flight;
    let unidArray = new Array();
    if (this.notocForm.get('checkerInitial').value) {
      finalizeData.checkerInitial = this.notocForm.get('checkerInitial').value;
    }
    detailFinalize.unid.forEach(u => {
      unidArray.push(u);
    });

    detailFinalize.allPack.forEach(a => {
      a.unids.forEach(ua => {
        unidArray.push(ua);
      });
    });

    detailFinalize.overPack.forEach(o => {
      o.unids.forEach(uo => {
        unidArray.push(uo);
      });

      if (o.allPacks != null) {
        o.allPacks.forEach(oa => {
          oa.unids.forEach(uoa => {
            unidArray.push(uoa);
          });
        });
      }
    });
    finalizeData.otherSpecialLoads = detailFinalize.otherSpecialLoadArray;
    finalizeData.notocDangerousGoodsDetails = unidArray;
    finalizeData.status = "INITIATED";
    if (Number(detailFinalize.finalizeVersion)) {
      finalizeData.finalizeVersion = Number(detailFinalize.finalizeVersion) + 1;

    } else {

      finalizeData.finalizeVersion = 1;
    }
    if (this.resp.data.missingDLSUlds) {
      this.notoc = "Missing Information in Update DLS";
      this.notoc = "Missing Information in Update DLS";
      var splitted = new Array();
      splitted = this.resp.data.missingDLSUlds.split(',');
      this.notocForm.get('missingInfoInDLS').patchValue(splitted);
      this.finalizeWindow.open();
    } else {
      finalizeData.ackInfo = false;
      this.notocService.finalize(finalizeData).subscribe(
        data => {
          const resForPrompt = data;
          if (resForPrompt.data && resForPrompt.data.infoFlag) {
            this.showConfirmMessage(resForPrompt.data.warnigInfoAndErrorMessage).then(fulfilled => {
              finalizeData.ackInfo = true;
              this.notocService.finalize(finalizeData).subscribe(resp => {
                if (!this.showResponseErrorMessages(resp)) {
                  this.setTheHeaderValue(resp);
                } else {
                  this.showResponseErrorMessages(resp);
                }
                this.resp = resp;
              });
            }
            ).catch(reason => {
            });
          }
          else if (!this.showResponseErrorMessages(data)) {
            this.setTheHeaderValue(data);
          } else {
            this.showResponseErrorMessages(data);
          }
          this.resp = data;
        },
        err => {
          this.showErrorStatus("export.server.not.running");
        }
      );
    }
  }

  setTheHeaderValue(data) {
    this.showSuccessStatus("export.finalized.initiated");
    this.finalizeButton = false;
    this.finalizeFlag = true;
    this.notocForm.controls["finalizeVersion"].setValue(
      data.data.finalizeVersion
    );
    this.notocForm.controls["ntmVersionSent"].setValue(
      data.data.ntmVersionSent
    );

    this.notocForm.controls["finalizestatus"].setValue(data.data.status);
    this.unFinalizeFlag = true;
    this.notocForm.controls["lastFinalizedBy"].setValue(data.data.lastFinalizedBy);
    this.notocForm.controls["checkerInitial"].setValue(data.data.checkerInitial);
    this.notocForm.controls["createdBy"].setValue(data.data.createdBy);
    if (data.data.status == "SENT") {
      this.showSuccessStatus("export.finalized.successfully");
    }
  }

  onClose() {
    this.finalizeWindow.close();
  }

  okFinalizeNotoc() {
    if (!this.resp.data.checkDataSavedForFinalize && this.declareNilNotoc) {
      this.showErrorStatus("export.press.capture.checker.initials.before.finalize");
      return;
    }
    const detailFinalize: any = this.notocForm.getRawValue();
    const finalizeData = new NotocDetail();
    finalizeData.flightId = this.arraylist.flight.flightId;
    finalizeData.segmentId = this.globalSegmet;
    finalizeData.flightKey = this.arraylist.flight.flightKey;
    finalizeData.flightOriginDate = this.arraylist.flight.flightOriginDate;
    let unidArray = new Array();
    finalizeData.flight = this.arraylist.flight;
    if (this.notocForm.get('checkerInitial').value) {
      finalizeData.checkerInitial = this.notocForm.get('checkerInitial').value;
    }
    detailFinalize.unid.forEach(u => {
      unidArray.push(u);
    });

    detailFinalize.allPack.forEach(a => {
      a.unids.forEach(ua => {
        unidArray.push(ua);
      });
    });

    detailFinalize.overPack.forEach(o => {
      o.unids.forEach(uo => {
        unidArray.push(uo);
      });

      if (o.allPacks != null) {
        o.allPacks.forEach(oa => {
          oa.unids.forEach(uoa => {
            unidArray.push(uoa);
          });
        });
      }
    });
    finalizeData.otherSpecialLoads = detailFinalize.otherSpecialLoadArray;
    finalizeData.notocDangerousGoodsDetails = unidArray;
    finalizeData.status = "INITIATED";
    if (Number(detailFinalize.finalizeVersion)) {
      finalizeData.finalizeVersion = Number(detailFinalize.finalizeVersion) + 1;
    } else {
      finalizeData.finalizeVersion = 1;
    }
    finalizeData.specialInstructions = detailFinalize.specialInstructionArray;
    finalizeData.freeText = detailFinalize.freeText;
    finalizeData.ackInfo = false;
    this.notocService.finalize(finalizeData).subscribe(
      data => {
        const resForPrompt = data;
        if (resForPrompt.data && resForPrompt.data.infoFlag) {
          this.showConfirmMessage(resForPrompt.data.warnigInfoAndErrorMessage).then(fulfilled => {
            finalizeData.ackInfo = true;
            this.notocService.finalize(finalizeData).subscribe(resp => {
              if (!this.showResponseErrorMessages(resp)) {
                this.setTheHeaderValue(resp);
                this.finalizeWindow.close();
              } else {
                this.showResponseErrorMessages(resp);
              }
              this.resp = resp;
            });
          }
          ).catch(reason => {
          });
        }
        else if (!this.showResponseErrorMessages(data)) {
          this.setTheHeaderValue(data);
          this.finalizeWindow.close();
        } else {
          this.showResponseErrorMessages(data);
        }
        this.resp = data;
      }
      ,
      err => {
        this.showErrorStatus("export.server.not.running");
      }
    );
  }

  onUnFinaliZe() {
    this.unFinalizeFlag = false;
    const UnfinalizeData = new NotocDetail();
    UnfinalizeData.flightId = this.arraylist.flight.flightId;
    const detailFinalize: any = this.notocForm.getRawValue();
    UnfinalizeData.flightId = this.arraylist.flight.flightId;
    UnfinalizeData.flightKey = this.arraylist.flight.flightKey;
    UnfinalizeData.flightOriginDate = this.arraylist.flight.flightOriginDate
    UnfinalizeData.otherSpecialLoads = detailFinalize.otherSpecialLoadArray;
    UnfinalizeData.notocDangerousGoodsDetails = detailFinalize.unid;
    UnfinalizeData.specialInstructions = detailFinalize.specialInstructionArray;
    UnfinalizeData.freeText = detailFinalize.freeText;
    if (Number(detailFinalize.finalizeVersion)) {
      UnfinalizeData.finalizeVersion = Number(detailFinalize.finalizeVersion);
    }
    UnfinalizeData.ackInfoForUnfinalizeAudit = true;
    this.notocService.Unfinalize(UnfinalizeData).subscribe(
      data => {
        this.finalizeButton = true;
        this.showSuccessStatus("export.unfinalized.successfully");
        this.notocForm.controls["lastFinalizedBy"].setValue(data.data.lastFinalizedBy);
        this.notocForm.controls["checkerInitial"].setValue(data.data.checkerInitial);
      },
      err => {
      }
    );
  }

  onPrintNotoc() {
    this.reportParameters = new Object();
    this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
    if (this.resp.data.ntmVersionSent) {
      this.reportParameters.ntmVersion = parseInt(
        this.resp.data.ntmVersionSent
      );
    } else {
      this.reportParameters.ntmVersion = null;
    }
    if (this.resp.data.finalizeVersion) {
      this.reportParameters.finalizeVersion = parseInt(
        this.resp.data.finalizeVersion
      );
    } else {
      this.reportParameters.finalizeVersion = null;
    }
    this.reportParameters.dateTimedisplay = NgcUtility.getTimeAsString(this.notocForm.get("std").value);
    this.reportParameters.FlightOriginDate = this.notocForm.get(
      "flightOriginDate"
    ).value;
    this.reportParameters.customerId = this.getUserProfile().userShortName;
    this.reportParameters.flightId = this.resp.data.flightId;
    if (this.resp.data.flight.aircraftRegistrationNumber != null) {
      this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
    } else {
      this.reportParameters.aircraftReg = null;
    }

    this.reportPrintNOTOC.open();
  }

  onPrint() {
    this.reportParameters = new Object();
    // let carrierCode = this.notocForm.get("carrierCode").value;
    //============================================FLIGHT KEY=============================================================
    this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
    //============================================FLIGHT ORIGIN DATE======================================================
    this.reportParameters.FlightOriginDate = this.notocForm.get("flightOriginDate").value;
    //============================================CUSTOMER ID=============================================================
    this.reportParameters.customerId = this.getUserProfile().userShortName;
    //============================================FLIGHT ID===============================================================
    this.reportParameters.flightId = parseInt(this.resp.data.flightId);
    //============================================AIRCRAFT REGISTRATION NO================================================
    if (this.resp.data.flight.aircraftRegistrationNumber != null) {
      this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
    } else {
      this.reportParameters.aircraftReg = null;
    }
    //============================================FLIGHT OFF POINT========================================================
    this.reportParameters.offPoint = this.arraylist.flightOffPoint;
    //============================================NTM VERSION=============================================================
    if (this.resp.data.ntmVersionSent) {
      this.reportParameters.ntmVersion = parseInt(this.resp.data.ntmVersionSent);
    } else {
      this.reportParameters.ntmVersion = null;
    }
    //============================================FINAL VERSION=============================================================
    if (this.resp.data.finalizeVersion) {
      this.reportParameters.finalizeVersion = parseInt(this.resp.data.finalizeVersion);
    } else {
      this.reportParameters.finalizeVersion = null;
    }
    //============================================DATE TIME DISPLAY==========================================================
    this.reportParameters.dateTimedisplay = NgcUtility.getTimeAsString(this.notocForm.get("std").value);
    this.reportNotificationToCaptainF7.open();
  }

  weightCheckAwbNumberUnid(weight, index) {
    if (this.weightCheck < weight) {
      this.showErrorStatus(NgcUtility.translateMessage("export.awb.declared.weight.less", [this.notocForm.get(["notocDangerousGoodsDetails", index, "awbNumber"]).value]));
      this.dontSaveWeight = true;
    } else {
      this.dontSaveWeight = false;
      this.resetFormMessages();
    }
  }

  unidQuantityCheck(event, index) {
    if (event) {
      if (this.itemDesc < event && this.notocForm.get(["notocDangerousGoodsDetails", index, "packingInstructions"]).value) {
        this.showErrorStatus(NgcUtility.translateMessage("export.limit.exceed.for.quantity.placeholder", [this.notocForm.get(["notocDangerousGoodsDetails", index, "awbNumber"]).value]));
        this.dontSaveQuantity = true;
      } else {
        this.dontSaveQuantity = false;
        this.resetFormMessages();
      }
    }
  }

  unidQuantityCheckPI(event, index) {
    if (this.notocForm.get(["notocDangerousGoodsDetails", index, "piList"])) {
      let piList: Array<any> = this.notocForm.get(["notocDangerousGoodsDetails", index, "piList"]).value;
      if (piList) {
        piList.forEach((item: any) => {
          if (event == item.code) {
            this.itemDesc = item.desc;
            this.notocForm.get(["notocDangerousGoodsDetails", index, "notificationWeightUnitCode"]).setValue(item.unitCode);
            if (
              item.desc <
              this.notocForm.get(["notocDangerousGoodsDetails", index, "packageQuantity"]).value
            ) {

              this.showErrorStatus(NgcUtility.translateMessage("export.limit.exceed.for.quantity.placeholder", [this.notocForm.get(["notocDangerousGoodsDetails", index, "awbNumber"]).value]));
              this.dontSaveQuantity = true;
            } else {
              this.dontSaveQuantity = false;
              this.resetFormMessages();
            }
          }
        });
      }
    }

    if (event == "--" || event == "-") {
      this.showErrorStatus("Inavalid PI for UNID" + " " + this.notocForm.get(["notocDangerousGoodsDetails", index, "unidNumber"]).value) + "Please use Free Text tab";
      this.freeTextEnrtyTab = true;
    } else {
      this.freeTextEnrtyTab = false;
    }
  }

  onSaveForDelete($event) {
    const detail: any = this.notocForm.getRawValue();
    const request: NotocDetail = new NotocDetail();
    let unidArray = new Array();
    let freeTextArray = new Array();
    let spiArray = new Array();
    let oslArray = new Array();

    detail.unid.forEach(u => {
      u["overpackNumber"] = null;
      u["apioNumber"] = null;
      if (u.select && this.deleteButtonCheck) {
        u["flagCRUD"] = "D";
        unidArray.push(u);
      }
    });

    detail.otherSpecialLoadArray.forEach(u => {
      if (u.awbNumber) {
        if (u.select && this.deleteButtonCheck) {
          u["flagCRUD"] = "D";
          oslArray.push(u);
        }
      }
    });

    detail.freeText.forEach(u => {
      if (u.select && this.deleteButtonCheck) {
        u["flagCRUD"] = "D";
        freeTextArray.push(u);
      }
    });

    detail.specialInstructionArray.forEach(u => {
      if (u.select && this.deleteButtonCheck) {
        u["flagCRUD"] = "D";
        spiArray.push(u);
      }
    });
    request.flightKey = this.arraylist.flight.flightKey;
    request.flightOriginDate = this.arraylist.flight.flightOriginDate;
    request.flagCRUD = this.arraylist.flagCRUD;
    request.flightId = this.arraylist.flight.flightId;
    if (detail.seg) {
      request.flightBoardPoint = detail.seg.slice(0, 3);
      request.flightOffPoint = detail.seg.slice(4, 7);
    } else {
      this.showErrorStatus("export.select.segment.before.saving");
      return;
    }
    request.transactionSequenceNo = null;
    request.notocId = this.arraylist.notocId;
    request.notocDangerousGoodsDetails = unidArray;
    request.otherSpecialLoads = oslArray;
    request.specialInstructions = spiArray;
    request.freeText = freeTextArray;
    request.dgRegulations = null;
    request.flight = this.arraylist.flight;
    request.flight = null;
    request.dgHeaders = null;
    if (detail.checkerInitial) {
      request.checkerInitial = detail.checkerInitial;
    }
    this.notocService.saveNotocDetail(request).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("DATASAVED001");
          this.deleteButtonCheck = false;
          this.onSearch(request);
          this.finalizeFlag = data.data.finalizeButtonAfterSave;
        } else {
          this.showResponseErrorMessages(data);
        }
        this.resp = data;
      },
      err => {
        this.showErrorStatus("export.server.not.running");
      }
    );
  }


  onCancel() {
    this.navigateBack(this.transferData);
  }

  genrateOverPackRemarks(event, index) {
    if (this.notocForm.get(["notocDangerousGoodsDetails", index, "apioNumber"]).value && event) {
      let remarks = "OVERPACK-" + event + " " + "ALLPACK-" + this.notocForm.get(["notocDangerousGoodsDetails", index, "apioNumber"]).value;
      this.notocForm.get(["notocDangerousGoodsDetails", index, "packingRemarks"]).setValue(remarks);
    } else {
      if (event) {
        let remarks = "OVERPACK-" + event;
        this.notocForm.get(["notocDangerousGoodsDetails", index, "packingRemarks"]).setValue(remarks);
      }
    }
  }

  genrateAllPackRemarks(event, index) {
    if (this.notocForm.get(["notocDangerousGoodsDetails", index, "overpackNumber"]).value && event) {
      let remarks = "OVERPACK-" + this.notocForm.get(["notocDangerousGoodsDetails", index, "overpackNumber"]).value + " " + "ALLPACK-" + event;
      this.notocForm.get(["notocDangerousGoodsDetails", index, "packingRemarks"]).setValue(remarks);
    } else {
      if (event) {
        let remarks = "ALLPACK-" + event;
        this.notocForm.get(["notocDangerousGoodsDetails", index, "packingRemarks"]).setValue(remarks);
      }
    }
  }

  focusOnUnid(index) {
    //set Auto Focus
    (this.notocForm.get(["notocDangerousGoodsDetails", index, "unidNumber"]) as NgcFormControl).focus();
  }

  declareNilNotocandSearch(req) {
    this.onUpdate(req);
    this.declareNilNotoc = false;
  }

  getdgRegulationId(req, openPsn: PsnDtlComponent, param1: NgcFormControl) {
    openPsn.searchRequest = { dgRegulationId: req.value } as SearchRegulation;
    openPsn.focusOnUnidForPsn = param1;
    openPsn.showDgDeatils();
  }

  onChangeSearch() {
    this.isTab = false;
    this.searchFlg = true;
    this.offPoint = null;
    (<NgcFormArray>this.notocForm.get(['unid'])).resetValue([]);
    (<NgcFormArray>this.notocForm.get(['overPack'])).resetValue([]);
    (<NgcFormArray>this.notocForm.get(['allPack'])).resetValue([]);
    (<NgcFormArray>this.notocForm.get(['otherSpecialLoadArray'])).resetValue([]);
    (<NgcFormArray>this.notocForm.get(['specialInstructionArray'])).resetValue([]);
    (<NgcFormArray>this.notocForm.get(['freeText'])).resetValue([]);
    (<NgcFormArray>this.notocForm.get(['notocDangerousGoodsDetails'])).resetValue([]);
    (<NgcFormArray>this.notocForm.get(['otherSpecialLoads'])).resetValue([]);
    (<NgcFormArray>this.notocForm.get(['otherSpecialLoads'])).resetValue([]);
    (<NgcFormArray>this.notocForm.get(['insertSpi'])).resetValue([]);
    (<NgcFormArray>this.notocForm.get(['freeTextWindow'])).resetValue([]);
  }
}

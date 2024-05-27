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
  NgcReportComponent
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

import { Flight } from "../../../import/import.sharedmodel";

@Component({
  selector: "app-notoc",
  templateUrl: "./notoc.component.html",
  styleUrls: ["./notoc.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class NotocComponent extends NgcPage {
  /**
* This flag is used for displaying of table when the criteria is right
*/
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
    awbId: ""
  };
  @ViewChild("reportChinaCargo") reportChinaCargo: NgcReportComponent;
  @ViewChild("reportGeneralNOTOC") reportGeneralNOTOC: NgcReportComponent;
  @ViewChild("reportBritishAirways") reportBritishAirways: NgcReportComponent;
  @ViewChild("reportTransmileAirways")
  reportTransmileAirways: NgcReportComponent;
  @ViewChild("reportTNTAirways") reportTNTAirways: NgcReportComponent;
  @ViewChild("reportValueAirways") reportValueAirways: NgcReportComponent;
  @ViewChild("reportCargoLuxAirways") reportCargoLuxAirways: NgcReportComponent;
  @ViewChild("reportNIUGINI") reportNIUGINI: NgcReportComponent;
  @ViewChild("reportANA") reportANA: NgcReportComponent;
  @ViewChild("reportCardigAirways") reportCardigAirways: NgcReportComponent;
  @ViewChild("reportCEBUPacific") reportCEBUPacific: NgcReportComponent;
  @ViewChild("reportEVAAirways") reportEVAAirways: NgcReportComponent;
  @ViewChild("reportTigerAirways") reportTigerAirways: NgcReportComponent;
  @ViewChild("reportTurkishAirways") reportTurkishAirways: NgcReportComponent;
  @ViewChild("reportJetStar3Kwithoffpt")
  reportJetStar3Kwithoffpt: NgcReportComponent;
  @ViewChild("reportJetStarJQwithoffpt")
  reportJetStarJQwithoffpt: NgcReportComponent;
  @ViewChild("reportLionAir") reportLionAir: NgcReportComponent;
  @ViewChild("reportKoreanAirwithOffPt")
  reportKoreanAirwithOffPt: NgcReportComponent;
  @ViewChild("reportGeneral") reportGeneral: NgcReportComponent;
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
    flightKey: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(),
    flightOriginDate1: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    awbNumber: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    paxCao: new NgcFormControl(),
    aircraftReg: new NgcFormControl(),
    segmentList: new NgcFormControl(),
    seg: new NgcFormControl(),
    unid: new NgcFormArray([]),
    ntmVersionSent: new NgcFormControl(),
    sentBy: new NgcFormControl(),
    status: new NgcFormControl(),
    finalizeVersion: new NgcFormControl(),
    finalizestatus: new NgcFormControl(),
    overPack: new NgcFormArray([]),
    allPack: new NgcFormArray([]),
    otherSpecialLoadArray: new NgcFormArray([]),
    specialInstructionArray: new NgcFormArray([]),
    freeText: new NgcFormArray([]),
    createdBy: new NgcFormControl()
  });

  ngOnInit() {
    super.ngOnInit();
    this.transferData = this.getNavigateData(this.route);
    try {
      if (this.transferData !== null && this.transferData !== undefined) {
        // this.notocForm.controls["flightKey"].setValue(
        //   this.transferData.flightKey
        // );
        // this.notocForm.controls["flightOriginDate"].patchValue(
        //   this.transferData.flightOriginDate
        // );
        this.notocForm.patchValue(this.transferData);
        this.onSearch(this.transferData);
      }
    } catch (e) { }
  }

  onAddRowDG(item) {
    const dgLength = this.notocForm.get("unid")["controls"].length;
    if (dgLength) {
      const lastElement = this.notocForm.get("unid")["controls"][dgLength - 1]
        .value;
      if (lastElement.unidNumber) {
        this.addRowDG();
      } else {
        this.showErrorStatus(
          "export.provide.unid.details.inside.unid"
        );
      }
    } else {
      this.addRowDG();
    }
  }
  addRowDG() {
    (<NgcFormArray>this.notocForm.get("unid")).addValue([this.unidRowData]);
  }

  onAddOverpack(item) {
    const dgLength = this.notocForm.get("overPack")["controls"].length;
    if (dgLength) {
      const lastElement = this.notocForm.get("overPack")["controls"][
        dgLength - 1
      ].value;
      if (lastElement.unids.length) {
        this.addOverpack();
      } else {
        this.showErrorStatus(
          "export.provide.unid.details.inside.overpack"
        );
      }
    } else {
      this.addOverpack();
    }
  }
  addOverpack() {
    const dgLength = this.notocForm.get("overPack")["controls"].length;
    if (dgLength) {
      const lastElement = this.notocForm.get("overPack")["controls"][
        dgLength - 1
      ].value;
      (<NgcFormArray>this.notocForm.controls.overPack).addValue([
        {
          overpackNumber: lastElement.overpackNumber + 1,
          weight: "",
          pieces: "",
          unids: new Array(),
          allPacks: new Array()
        }
      ]);
    } else {
      (<NgcFormArray>this.notocForm.controls.overPack).addValue([
        {
          overpackNumber: 1,
          weight: "",
          pieces: "",
          unids: new Array(),
          allPacks: new Array()
        }
      ]);
    }
  }

  onAddOverpackAllPack(item, index) {
    if (this.notocForm.get(["overPack", index, "allPacks"]).value != null) {
      const dgLength = this.notocForm.get(["overPack", index, "allPacks"]).value
        .length;
      if (dgLength) {
        const lastElement = this.notocForm
          .get("overPack")
        ["controls"][index].get("allPacks")["controls"][dgLength - 1].value;
        if (lastElement.unids.length) {
          this.addOverpackAllPack(index);
        } else {
          this.showErrorStatus(
            "export.provide.unid.details"
          );
        }
      } else {
        this.addOverpackAllPack(index);
      }
    } else {
      (<NgcFormArray>this.notocForm.get([
        "overPack",
        index,
        "allPacks"
      ])).addValue([
        {
          apioNumber: 1,
          weight: "",
          pieces: "",
          unids: new Array()
        }
      ]);
    }
  }
  addOverpackAllPack(index) {
    const dgLength = this.notocForm.get(["overPack", index, "allPacks"]).value
      .length;
    if (dgLength) {
      const lastElement = this.notocForm
        .get("overPack")
      ["controls"][index].get("allPacks")["controls"][dgLength - 1].value;
      (<NgcFormArray>this.notocForm.get([
        "overPack",
        index,
        "allPacks"
      ])).addValue([
        {
          apioNumber: lastElement.apioNumber + 1,
          weight: "",
          pieces: "",
          unids: new Array()
        }
      ]);
    } else {
      (<NgcFormArray>this.notocForm.get([
        "overPack",
        index,
        "allPacks"
      ])).addValue([
        {
          apioNumber: 1,
          weight: "",
          pieces: "",
          unids: new Array()
        }
      ]);
    }
  }

  onAddAllPack() {
    const dgLength = this.notocForm.get(["allPack"]).value.length;
    if (dgLength) {
      const lastElement = this.notocForm.get("allPack")["controls"][
        dgLength - 1
      ].value;
      if (lastElement.unids.length) {
        this.addAllPack();
      } else {
        this.showErrorStatus(
          "export.provide.unid.details"
        );
      }
    } else {
      this.addAllPack();
    }
  }
  addAllPack() {
    const dgLength = this.notocForm.get(["allPack"]).value.length;
    if (dgLength) {
      const lastElement = this.notocForm.get("allPack")["controls"][
        dgLength - 1
      ].value;
      (<NgcFormArray>this.notocForm.controls.allPack).addValue([
        {
          apioNumber: lastElement.apioNumber + 1,
          weight: "",
          pieces: "",
          unids: new Array()
        }
      ]);
    } else {
      (<NgcFormArray>this.notocForm.controls.allPack).addValue([
        {
          apioNumber: 1,
          weight: "",
          pieces: "",
          unids: new Array()
        }
      ]);
    }
  }

  onAddRowDGOverpack(item, index) {
    const dgLength = this.notocForm
      .get("overPack")
    ["controls"][index].get("unids")["controls"].length;
    if (dgLength) {
      const lastElement = this.notocForm
        .get("overPack")
      ["controls"][index].get("unids")["controls"][dgLength - 1].value;
      if (lastElement.unidNumber) {
        this.addRowDGOverpack(index);
      } else {
        this.showErrorStatus(
          "export.provide.unid.details.inside.overpack"
        );
      }
    } else {
      this.addRowDGOverpack(index);
    }
  }
  addRowDGOverpack(index) {
    (<NgcFormArray>this.notocForm.get(["overPack", index, "unids"])).addValue([
      this.unidRowData
    ]);
    //this.unidRowData.packingRemarks = "OVERPACK-" + this.notocForm.get(["overPack", index, "overpackNumber"]).value;
  }

  onAddRowDGOverpackAllpack(item, index, subIndex) {
    const dgLength = this.notocForm.get([
      "overPack",
      index,
      "allPacks",
      subIndex,
      "unids"
    ]).value.length;
    if (dgLength) {
      const lastElement = this.notocForm
        .get("overPack")
      ["controls"][index].get("allPacks")
      ["controls"][subIndex].get("unids")["controls"][dgLength - 1].value;
      if (lastElement.unidNumber) {
        this.addRowOverpackAllpack(item, index, subIndex);
      } else {
        this.showErrorStatus(
          "export.provide.unid.details"
        );
      }
    } else {
      this.addRowOverpackAllpack(item, index, subIndex);
    }
  }
  addRowOverpackAllpack(item, index, subIndex) {
    (<NgcFormArray>this.notocForm.get([
      "overPack",
      index,
      "allPacks",
      subIndex,
      "unids"
    ])).addValue([this.unidRowData]);
  }

  onAddRowDGAllpack(item, index) {
    const dgLength = this.notocForm
      .get("allPack")
    ["controls"][index].get("unids")["controls"].length;
    if (dgLength) {
      const lastElement = this.notocForm
        .get("allPack")
      ["controls"][index].get("unids")["controls"][dgLength - 1].value;
      if (lastElement.unidNumber) {
        this.addRowDGAllpack(index);
      } else {
        this.showErrorStatus(
          "export.provide.unid.details"
        );
      }
    } else {
      this.addRowDGAllpack(index);
    }
  }
  addRowDGAllpack(index) {
    (<NgcFormArray>this.notocForm.get(["allPack", index, "unids"])).addValue([
      this.unidRowData
    ]);
  }

  onAddRowotherSpecialLoad() {
    (<NgcFormArray>this.notocForm.get(["otherSpecialLoadArray"])).addValue([
      {
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
        dryIceQuantity: ""
      }
    ]);
  }

  onAddRowspecialInstruction() {
    (<NgcFormArray>this.notocForm.get(["specialInstructionArray"])).addValue([
      {
        select: false,
        specialRemarks: ""
      }
    ]);
  }

  onAdd() {
    this.btnFlag = false;
    this.isULDflg = false;
    let x = this.notocForm.getRawValue();
    if (
      x.uldNumber != null &&
      x.awbNumber != null &&
      x.awbNumber.length == 11
    ) {
      this.isULDflg = true;
      this.btnFlag = true;
    }
    let uld = x.uldNumber;
    let awb = x.awbNumber;
    let u = new Array();
    if (this.unid != null) {
      u = this.unid.filter(a => a.uldNumber == uld && a.awbNumber == awb);
      if (u.length) {
        this.btnFlag = true;
        this.isULDflg = true;
        this.notocForm.get("unid").patchValue(u[0].unids);
        this.notocForm.get("allPack").patchValue(u[0].allPacks);
        this.notocForm.get("overPack").patchValue(u[0].overPacks);
      } else {
        this.notocForm.get("unid").patchValue(new Array());
        this.notocForm.get("allPack").patchValue(new Array());
        this.notocForm.get("overPack").patchValue(new Array());
      }
    } else {
      this.notocForm.get("unid").patchValue(new Array());
      this.notocForm.get("allPack").patchValue(new Array());
      this.notocForm.get("overPack").patchValue(new Array());
    }
  }

  onSearch(request) {
    this.isTab = false;
    //
    if (request.detail) {
      this.notocForm.get("seg").setValue(null);
    }
    const notocRequest: Notoc = new Notoc();
    notocRequest.boardingPoint = this.boardPoint;
    notocRequest.offPoint = this.offPoint;
    notocRequest.flightKey = this.notocForm.get("flightKey").value;
    notocRequest.flightOriginDate = this.notocForm.get("flightOriginDate").value;
    this.notocService.fetchSearchFlight(notocRequest).subscribe(
      data => {
        this.resp = data;
        this.resp.loggedinuser;
        this.arraylist = this.resp.data;
        this.dlsFinalize = this.resp.data.dlsFinalize;
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
          this.notocForm.controls["flightKey"].setValue(
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
          this.notocForm.controls["ntmVersionSent"].setValue(
            this.arraylist.ntmVersionSent
          );
          this.notocForm.controls["sentBy"].setValue(this.arraylist.sentBy);
          this.notocForm.controls["finalizestatus"].setValue(
            this.arraylist.status
          );
          this.notocForm.controls["finalizeVersion"].setValue(
            this.arraylist.finalizeVersion
          );
          this.notocForm.controls["createdBy"].setValue(
            this.arraylist.createdBy
          );
          if (this.arraylist.status == "INITIATED") {
            // this.finalizeFlag = true;
            //  this.unFinalizeFlag = true;
          }
          if (this.arraylist.status == "SENT") {
            //  this.finalizeFlag = false;
            // this.unFinalizeFlag = true;
          }
          // this.unid = this.arraylist.dgHeaders;
          //  this.onAdd();
          let un = new Array();
          let al = new Array();
          let ov = new Array();
          if (this.isSQCarrier) {
            this.disableForSQ = false;
            if (this.arraylist.dgHeaders != null && this.arraylist.dgHeaders.length > 0 && this.arraylist.dgHeaders[0].unids) {
              this.arraylist.dgHeaders[0].unids.forEach(uni => {
                un.push(uni);
              });
            }
          } else {

            if (this.arraylist.dgHeaders != null) {
              this.arraylist.dgHeaders.forEach(u => {
                u.unids.forEach(uni => {
                  un.push(uni);
                });
              });
            }
            if (this.arraylist.dgHeaders != null) {
              this.arraylist.dgHeaders.forEach(u => {
                if (u.allPacks != null) {
                  u.allPacks.forEach(alpk => {
                    al.push(alpk);
                  });
                }
              });
            }
            if (this.arraylist.dgHeaders != null) {
              this.arraylist.dgHeaders.forEach(u => {
                if (u.overPacks != null) {
                  u.overPacks.forEach(opk => {
                    ov.push(opk);
                  });
                }
              });
            }
            this.notocForm.get("allPack").patchValue(al);
            this.notocForm.get("overPack").patchValue(ov);
          }
          this.notocForm.get("unid").patchValue(un);
          if (this.arraylist.otherSpecialLoads) {
            this.notocForm
              .get("otherSpecialLoadArray")
              .patchValue(this.arraylist.otherSpecialLoads);
          } else {
            this.notocForm
              .get("otherSpecialLoadArray")
              .patchValue(new Array());
          }
          if (this.arraylist.specialInstructions) {
            this.notocForm
              .get("specialInstructionArray")
              .patchValue(this.arraylist.specialInstructions);
          } else {
            this.notocForm
              .get("specialInstructionArray")
              .patchValue(new Array());
          }
          if (this.arraylist.freeText) {
            this.notocForm.get("freeText").patchValue(this.arraylist.freeText);
          } else {
            this.notocForm.get("freeText").patchValue(new Array());
          }
          this.getSegments();
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
      },
      error => {
        this.showErrorStatus("Error:" + error);
      }
    );
  }

  onSave($event) {

    if (this.dontSaveQuantity) {
      this.showErrorStatus("export.dgd.max.limit.exceed.for.quantity");
      return;
    }
    const detail: any = this.notocForm.getRawValue();
    const request: NotocDetail = new NotocDetail();
    let unidArray = new Array();
    let freeTextArray = new Array();

    detail.unid.forEach(u => {
      u["overpackNumber"] = null;
      u["apioNumber"] = null;
      //u["uldNumber"] = detail.uldNumber;
      // u["awbNumber"] = detail.awbNumber;
      unidArray.push(u);
    });

    detail.allPack.forEach(a => {
      a.unids.forEach(ua => {
        ua["overpackNumber"] = null;
        ua["apioNumber"] = a.apioNumber;
        //   ua["uldNumber"] = detail.uldNumber;
        //   ua["awbNumber"] = detail.awbNumber;
        unidArray.push(ua);
      });
    });

    detail.overPack.forEach(o => {
      o.unids.forEach(uo => {
        uo["overpackNumber"] = o.overpackNumber;
        uo["apioNumber"] = null;
        //  uo["uldNumber"] = detail.uldNumber;
        //  uo["awbNumber"] = detail.awbNumber;
        unidArray.push(uo);
      });

      if (o.allPacks != null) {
        o.allPacks.forEach(oa => {
          oa.unids.forEach(uoa => {
            uoa["overpackNumber"] = o.overpackNumber;
            uoa["apioNumber"] = oa.apioNumber;
            //   uoa["uldNumber"] = detail.uldNumber;
            //   uoa["awbNumber"] = detail.awbNumber;
            unidArray.push(uoa);
          });
        });
      }
    });

    detail.freeText.forEach(u => {
      // u["overpackNumber"] = null;
      // u["apioNumber"] = null;
      //u["uldNumber"] = detail.uldNumber;
      // u["awbNumber"] = detail.awbNumber;
      freeTextArray.push(u);
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
    request.otherSpecialLoads = detail.otherSpecialLoadArray;
    request.specialInstructions = detail.specialInstructionArray;
    request.freeText = freeTextArray;
    request.dgRegulations = null;
    request.flight = this.arraylist.flight;
    request.dgHeaders = null;
    request.ackInfo = false;

    this.notocService.saveNotocDetail(request).subscribe(
      data => {
        if (data.data.errorFlag) {
          if (!this.showResponseErrorMessages(data)) {
            this.showSuccessStatus("DATASAVED001");
            this.onSearch(request);
            this.finalizeFlag = data.data.finalizeButtonAfterSave;
          } else {
            this.showResponseErrorMessages(data);
          }
        }
        else if (data.data.infoFlag) {
          this.showConfirmMessage(data.data.messageList[0].code).then(fulfilled => {
            request.ackInfo = true;
            this.notocService.saveNotocDetail(request).subscribe(
              data => {
                this.showSuccessStatus("DATASAVED001");
                this.onSearch(request);
                this.finalizeFlag = data.data.finalizeButtonAfterSave;
              });
          });
        }
        else
          if (!this.showResponseErrorMessages(data)) {
            this.showSuccessStatus("DATASAVED001");
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

  getDgIDUnid(event, index) {
    var pgCode: any = [];
    var categoryCodes: any = [];
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

            if (this.dgRegulationRes[0].shc == "RRW") {
              categoryCodes.push("I");
            } else if (this.dgRegulationRes[0].shc == "RRY") {
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
              "unid",
              index,
              "pgList"
            ])).patchValue(pgCode);
          }
          if (categoryCodes && categoryCodes.length > 0) {
            (<NgcFormArray>this.notocForm.get([
              "unid",
              index,
              "categoryList"
            ])).patchValue(categoryCodes);
          }
        }
      });

    this.dgRegulationId = event.param1;
    let x: any = this.notocForm.get(["unid", index]).value;
    x.unidNumber = event.code;
    x.properShippingName = event.desc;
    x.dgClassCode = event.param2;
    if (event.param3) {
      x.impCode = event.param3;
    }
    if (event.parameter1 == "1") {
      x.technicalNameFlag = true;
    } else {
      x.technicalNameFlag = false;
    }
    x.dgRegulationId = this.dgRegulationId;
    this.notocForm.get(["unid", index]).patchValue(x);
  }

  getDgIdOvrUnid(event, index, subindex) {
    var pgCode: any = [];
    var categoryCodes: any = [];
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
            if (this.dgRegulationRes[0].shc == "RRW") {
              categoryCodes.push("I");
            } else if (this.dgRegulationRes[0].shc == "RRY") {
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
              "overPack",
              index,
              "unids",
              subindex,
              "pgList"
            ])).patchValue(pgCode);
          }
          if (categoryCodes && categoryCodes.length > 0) {
            (<NgcFormArray>this.notocForm.get([
              "overPack",
              index,
              "unids",
              subindex,
              "categoryList"
            ])).patchValue(categoryCodes);
          }
        }
      });
    this.dgRegulationId = event.param1;
    let x: any = this.notocForm.get(["overPack", index, "unids", subindex])
      .value;
    x.dgRegulationId = this.dgRegulationId;
    x.properShippingName = event.desc;
    x.dgClassCode = event.param2;
    if (event.parameter1 == "1") {
      x.technicalNameFlag = true;
    } else {
      x.technicalNameFlag = false;
    }
    x.dgRegulationId = this.dgRegulationId;
    if (event.param3) {
      x.impCode = event.param3;
    }
    x.packingRemarks = "OVERPACK-" + this.notocForm.get(["overPack", index, "overpackNumber"]).value;
    this.notocForm.get(["overPack", index, "unids", subindex]).patchValue(x);
  }

  getDgIdOvrAllUnid(event, index, subIndex, subSubIndex) {
    var pgCode: any = [];
    var categoryCodes: any = [];
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
            if (this.dgRegulationRes[0].shc == "RRW") {
              categoryCodes.push("I");
            } else if (this.dgRegulationRes[0].shc == "RRY") {
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
              "overPack",
              index,
              "allPacks",
              subIndex,
              "unids",
              subSubIndex,
              "pgList"
            ])).patchValue(pgCode);
          }
          if (categoryCodes && categoryCodes.length > 0) {
            (<NgcFormArray>this.notocForm.get([
              "overPack",
              index,
              "allPacks",
              subIndex,
              "unids",
              subSubIndex,
              "categoryList"
            ])).patchValue(categoryCodes);
          }
        }
      });
    this.dgRegulationId = event.param1;
    let x: any = this.notocForm.get([
      "overPack",
      index,
      "allPacks",
      subIndex,
      "unids",
      subSubIndex
    ]).value;
    x.dgRegulationId = this.dgRegulationId;
    x.properShippingName = event.desc;
    x.dgClassCode = event.param2;
    if (event.parameter1 == "1") {
      x.technicalNameFlag = true;
    } else {
      x.technicalNameFlag = false;
    }
    x.dgRegulationId = this.dgRegulationId;
    if (event.param3) {
      x.impCode = event.param3;
    }
    x.packingRemarks = "ALLPACK-" + this.notocForm.get(["overPack", index, "allPacks", subIndex, "apioNumber"]).value;
    this.notocForm
      .get(["overPack", index, "allPacks", subIndex, "unids", subSubIndex])
      .patchValue(x);
  }

  getDgIdAllUnid(event, index, subindex) {
    var pgCode: any = [];
    var categoryCodes: any = [];
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
            if (this.dgRegulationRes[0].shc == "RRW") {
              categoryCodes.push("I");
            } else if (this.dgRegulationRes[0].shc == "RRY") {
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
              "allPack",
              index,
              "unids",
              subindex,
              "pgList"
            ])).patchValue(pgCode);
          }
          if (categoryCodes && categoryCodes.length > 0) {
            (<NgcFormArray>this.notocForm.get([
              "allPack",
              index,
              "unids",
              subindex,
              "categoryList"
            ])).patchValue(categoryCodes);
          }
        }
      });
    this.dgRegulationId = event.param1;
    let x: any = this.notocForm.get(["allPack", index, "unids", subindex])
      .value;
    x.dgRegulationId = this.dgRegulationId;
    x.properShippingName = event.desc;
    x.dgClassCode = event.param2;
    if (event.parameter1 == "1") {
      x.technicalNameFlag = true;
    } else {
      x.technicalNameFlag = false;
    }
    x.dgRegulationId = this.dgRegulationId;
    if (event.param3) {
      x.impCode = event.param3;
    }
    x.packingRemarks = "ALLPACK-" + this.notocForm.get(["allPack", index, "apioNumber"]).value;
    this.notocForm.get(["allPack", index, "unids", subindex]).patchValue(x);
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

  sumAllPack(event, index) {
    let totalWeight: number = 0;
    let totalPieces: number = 0;
    const dgLength = this.notocForm.get(["allPack", index, "unids"]).value
      .length;
    let i = 0;
    for (i = 0; i < dgLength; i++) {
      totalWeight =
        this.notocForm.get(["allPack", index, "unids", i, "packageWeight"])
          .value + totalWeight;
      totalPieces =
        this.notocForm.get(["allPack", index, "unids", i, "packagePieces"])
          .value + totalPieces;
    }

    this.notocForm.get(["allPack", index, "totalWeight"]).setValue(totalWeight);
    this.notocForm.get(["allPack", index, "totalPieces"]).setValue(totalPieces);
  }

  sumAllPackOverPack(event, index, subIndex) {
    let totalWeight: number = 0;
    let totalPieces: number = 0;
    const dgLength = this.notocForm.get([
      "overPack",
      index,
      "allPacks",
      subIndex,
      "unids"
    ]).value.length;
    let i = 0;
    for (i = 0; i < dgLength; i++) {
      totalWeight =
        this.notocForm.get(
          ["overPack", index, "allPacks", subIndex, "unids", i, "packageWeight"]
        ).value + totalWeight;
      totalPieces =
        this.notocForm.get(
          ["overPack", index, "allPacks", subIndex, "unids", i, "packagePieces"]
        ).value + totalPieces;
    }

    this.notocForm
      .get(["overPack", index, "allPacks", subIndex, "totalWeight"])
      .setValue(totalWeight);
    this.notocForm
      .get(["overPack", index, "allPacks", subIndex, "totalPieces"])
      .setValue(totalPieces);
  }

  sumOverPack($event, index, subIndex) {
    let totalWeight: number = 0;
    let totalPieces: number = 0;
    const dgLength = this.notocForm.get(["overPack", index, "unids"]).value
      .length;
    let i = 0;
    for (i = 0; i < dgLength; i++) {
      totalWeight =
        this.notocForm.get(["overPack", index, "unids", i, "packageWeight"])
          .value + totalWeight;
      totalPieces =
        this.notocForm.get(["overPack", index, "unids", i, "packagePieces"])
          .value + totalPieces;
    }

    let j = 0;
    const dgAllPack = this.notocForm.get(["overPack", index, "allPacks"]).value
      .length;
    for (j = 0; j < dgAllPack; j++) {
      let k = 0;
      const dgLengthAllPack = this.notocForm.get([
        "overPack",
        index,
        "allPacks",
        j,
        "unids"
      ]).value.length;
      for (k = 0; k < dgLengthAllPack; k++) {
        totalWeight =
          this.notocForm.get(
            ["overPack", index, "allPacks", j, "unids", k, "packageWeight"]
          ).value + totalWeight;
        totalPieces =
          this.notocForm.get(
            ["overPack", index, "allPacks", j, "unids", k, "packagePieces"]
          ).value + totalPieces;
      }
    }

    this.notocForm
      .get(["overPack", index, "totalWeight"])
      .setValue(totalWeight);
    this.notocForm
      .get(["overPack", index, "totalPieces"])
      .setValue(totalPieces);
  }

  onSegmentSelect(event) {
    this.btnFlag = true;
    this.isULDflg = true;
    this.isTab = true;
    let index = this.segment.indexOf(event);
    this.uldSourceParameter = this.createSourceParameter(
      this.arraylist.flight.flightLegs[index].flightSegmentId
    );
    this.onULDTrolleyNoSelect(
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
    // this.notocForm.controls.uldNumber.patchValue(new Array());
    // this.notocForm.controls.awbNumber.patchValue(new Array());
    // this.notocForm.get("otherSpecialLoadArray").patchValue(new Array());
    // this.notocForm.get("specialInstructionArray").patchValue(new Array());
    // this.notocForm.get("allPack").patchValue(new Array());
    // this.notocForm.get("overPack").patchValue(new Array());
    // this.notocForm.get("unid").patchValue(new Array());
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
            pckingIns.push(dropdownPi1);
            dropdownPi2.code = pgRes.mpcPInfo;
            dropdownPi2.desc = pgRes.mpcQuantity;
            pckingIns.push(dropdownPi2);
          } else {
            dropdownPi3.code = pgRes.mlqPInfo;
            dropdownPi3.desc = pgRes.mlqQuantity;
            pckingIns.push(dropdownPi3);
            dropdownPi2.code = pgRes.mpcPInfo;
            dropdownPi2.desc = pgRes.mpcQuantity;
            pckingIns.push(dropdownPi2);
            dropdownPi1.code = pgRes.mcoPInfo;
            dropdownPi1.desc = pgRes.mcoQuantity;
            pckingIns.push(dropdownPi1);
          }
        }
      });
    }
    if (pckingIns && pckingIns.length > 0) {
      (<NgcFormArray>this.notocForm.get(["unid", index, "piList"])).patchValue(
        pckingIns
      );
    }
  }

  unidQuantityCheckPI(event, index) {
    if (this.notocForm.get(["unid", index, "piList"])) {
      let piList: Array<any> = this.notocForm.get(["unid", index, "piList"]).value;
      if (piList) {
        piList.forEach((item: any) => {
          if (event == item.code) {
            this.itemDesc = item.desc;
            if (
              item.desc <
              this.notocForm.get(["unid", index, "packageQuantity"]).value
            ) {
              this.showFormControlErrorMessage(
                <NgcFormControl>this.notocForm.get([
                  "unid",
                  index,
                  "packageQuantity"
                ]),
                "export.limit.exceed.for.quantity"
              );
              this.dontSaveQuantity = true;
            } else {
              this.dontSaveQuantity = false;
              this.resetFormMessages();
            }
          }
        });
      }
    }
  }

  unidQuantityCheck(event, index) {
    if (event) {
      if (this.itemDesc < event && this.notocForm.get(["unid", index, "packingInstructions"]).value) {
        this.showFormControlErrorMessage(
          <NgcFormControl>this.notocForm.get([
            "unid",
            index,
            "packageQuantity"
          ]),
          "export.limit.exceed.for.quantity"
        );
        this.dontSaveQuantity = true;
      } else {
        this.dontSaveQuantity = false;
        this.resetFormMessages();
      }
    }
  }

  getOverpackPi(event, index, subindex) {
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
            pckingIns.push(dropdownPi1);

            dropdownPi2.code = pgRes.mpcPInfo;
            dropdownPi2.desc = pgRes.mpcQuantity;
            pckingIns.push(dropdownPi2);
          } else {
            dropdownPi3.code = pgRes.mlqPInfo;
            dropdownPi3.desc = pgRes.mlqQuantity;
            pckingIns.push(dropdownPi3);
            dropdownPi2.code = pgRes.mpcPInfo;
            dropdownPi2.desc = pgRes.mpcQuantity;
            pckingIns.push(dropdownPi2);
            dropdownPi1.code = pgRes.mcoPInfo;
            dropdownPi1.desc = pgRes.mcoQuantity;
            pckingIns.push(dropdownPi1);
          }
        }
      });
    }
    if (pckingIns && pckingIns.length > 0) {
      (<NgcFormArray>this.notocForm.get([
        "overPack",
        index,
        "unids",
        subindex,
        "piList"
      ])).patchValue(pckingIns);
    }
  }

  ovrQuantityCheckPI(event, index, subindex) {
    if (this.notocForm.get([
      "overPack",
      index,
      "unids",
      subindex,
      "piList"
    ])) {
      let piList: Array<any> = this.notocForm.get([
        "overPack",
        index,
        "unids",
        subindex,
        "piList"
      ]).value;
      if (piList) {
        piList.forEach((item: any) => {
          if (event == item.code) {
            this.itemDesc = item.desc;
            if (
              item.desc <
              this.notocForm.get([
                "overPack",
                index,
                "unids",
                subindex,
                "packageQuantity"
              ]).value
            ) {
              this.showFormControlErrorMessage(
                <NgcFormControl>this.notocForm.get([
                  "overPack",
                  index,
                  "unids",
                  subindex,
                  "packageQuantity"
                ]),
                "export.limit.exceed.for.quantity"
              );
              this.dontSaveQuantity = true;
            } else {
              this.dontSaveQuantity = false;
              this.resetFormMessages();
            }
          }
        });
      }
    }
  }

  ovrQuantityCheck(event, index, subindex) {
    if (event) {
      if (this.itemDesc < event && this.notocForm.get([
        "overPack",
        index,
        "unids",
        subindex,
        "packingInstructions"
      ]).value) {
        this.showFormControlErrorMessage(
          <NgcFormControl>this.notocForm.get([
            "overPack",
            index,
            "unids",
            subindex,
            "packageQuantity"
          ]),
          "export.limit.exceed.for.quantity"
        );
        this.dontSaveQuantity = true;
      } else {
        this.dontSaveQuantity = false;
        this.resetFormMessages();
      }
    }
  }

  getOverpackAllPi(event, index, subindex, subSubindex) {
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
            pckingIns.push(dropdownPi1);

            dropdownPi2.code = pgRes.mpcPInfo;
            dropdownPi2.desc = pgRes.mpcQuantity;
            pckingIns.push(dropdownPi2);
          } else {
            dropdownPi3.code = pgRes.mlqPInfo;
            dropdownPi3.desc = pgRes.mlqQuantity;
            pckingIns.push(dropdownPi3);
            dropdownPi2.code = pgRes.mpcPInfo;
            dropdownPi2.desc = pgRes.mpcQuantity;
            pckingIns.push(dropdownPi2);
            dropdownPi1.code = pgRes.mcoPInfo;
            dropdownPi1.desc = pgRes.mcoQuantity;
            pckingIns.push(dropdownPi1);
          }
        }
      });
    }
    if (pckingIns && pckingIns.length > 0) {
      (<NgcFormArray>this.notocForm.get([
        "overPack",
        index,
        "allPacks",
        subindex,
        "unids",
        subSubindex,
        "piList"
      ])).patchValue(pckingIns);
    }
  }

  ovrAllQuantityCheckPI(event, index, subindex, subSubindex) {
    if (this.notocForm.get([
      "overPack",
      index,
      "allPacks",
      subindex,
      "unids",
      subSubindex,
      "piList"
    ])) {
      let piList: Array<any> = this.notocForm.get([
        "overPack",
        index,
        "allPacks",
        subindex,
        "unids",
        subSubindex,
        "piList"
      ]).value;
      if (piList) {
        piList.forEach((item: any) => {
          if (event == item.code) {
            this.itemDesc = item.desc;
            if (
              item.desc <
              this.notocForm.get([
                "overPack",
                index,
                "allPacks",
                subindex,
                "unids",
                subSubindex,
                "packageQuantity"
              ]).value
            ) {
              this.showFormControlErrorMessage(
                <NgcFormControl>this.notocForm.get([
                  "overPack",
                  index,
                  "allPacks",
                  subindex,
                  "unids",
                  subSubindex,
                  "packageQuantity"
                ]),
                "export.limit.exceed.for.quantity"
              );
              this.dontSaveQuantity = true;
            } else {
              this.dontSaveQuantity = false;
              this.resetFormMessages();
            }
          }
        });
      }
    }
  }

  ovrAllQuantityCheck(event, index, subindex, subSubindex) {
    if (event) {
      if (this.itemDesc < event && this.notocForm.get([
        "overPack",
        index,
        "allPacks",
        subindex,
        "unids",
        subSubindex,
        "packingInstructions"
      ]).value) {
        this.showFormControlErrorMessage(
          <NgcFormControl>this.notocForm.get([
            "overPack",
            index,
            "allPacks",
            subindex,
            "unids",
            subSubindex,
            "packageQuantity"
          ]),
          "export.limit.exceed.for.quantity"
        );
        this.dontSaveQuantity = true;
      } else {
        this.dontSaveQuantity = false;
        this.resetFormMessages();
      }
    }
  }

  getAllPi(event, index, subindex) {
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
            pckingIns.push(dropdownPi1);

            dropdownPi2.code = pgRes.mpcPInfo;
            dropdownPi2.desc = pgRes.mpcQuantity;
            pckingIns.push(dropdownPi2);
          } else {
            dropdownPi3.code = pgRes.mlqPInfo;
            dropdownPi3.desc = pgRes.mlqQuantity;
            pckingIns.push(dropdownPi3);
            dropdownPi1.code = pgRes.mcoPInfo;
            dropdownPi1.desc = pgRes.mcoQuantity;
            pckingIns.push(dropdownPi1);
            dropdownPi2.code = pgRes.mpcPInfo;
            dropdownPi2.desc = pgRes.mpcQuantity;
            pckingIns.push(dropdownPi2);
          }
        }
      });
    }
    if (pckingIns && pckingIns.length > 0) {
      (<NgcFormArray>this.notocForm.get([
        "allPack",
        index,
        "unids",
        subindex,
        "piList"
      ])).patchValue(pckingIns);
    }
  }

  allQuantityCheckPI(event, index, subindex) {
    if (this.notocForm.get([
      "allPack",
      index,
      "unids",
      subindex,
      "piList"
    ])) {
      let piList: Array<any> = this.notocForm.get([
        "allPack",
        index,
        "unids",
        subindex,
        "piList"
      ]).value;
      if (piList) {
        piList.forEach((item: any) => {
          if (event == item.code) {
            this.itemDesc = item.desc;
            if (
              item.desc <
              this.notocForm.get([
                "allPack",
                index,
                "unids",
                subindex,
                "packageQuantity"
              ]).value
            ) {
              this.showFormControlErrorMessage(
                <NgcFormControl>this.notocForm.get([
                  "allPack",
                  index,
                  "unids",
                  subindex,
                  "packageQuantity"
                ]),
                "export.limit.exceed.for.quantity"
              );
              this.dontSaveQuantity = true;
            } else {
              this.dontSaveQuantity = false;
              this.resetFormMessages();
            }
          }
        });
      }
    }
  }

  allQuantityCheck(event, index, subindex) {
    if (event) {
      if (this.itemDesc < event && this.notocForm.get([
        "allPack",
        index,
        "unids",
        subindex,
        "packingInstructions"
      ]).value) {
        this.showFormControlErrorMessage(
          <NgcFormControl>this.notocForm.get([
            "allPack",
            index,
            "unids",
            subindex,
            "packageQuantity"
          ]),
          "export.limit.exceed.for.quantity"
        );
        this.dontSaveQuantity = true;
      } else {
        this.dontSaveQuantity = false;
        this.resetFormMessages();
      }
    }
  }

  onULDTrolleyNoSelect(event) {
    if (event.desc) {
      this.awbSourceParameter = this.createSourceParameter(event.desc, null);
    } else {
      this.awbSourceParameter = this.createSourceParameter(null, event);
    }
  }

  awbNumberMaxWeight(req, index) {
    this.weightCheck = req.param2;
    this.notocForm.get(['unid', index, 'awbId']).setValue(req.param1);
  }
  awbNumberMaxWeightOverPack(req, index, group) {
    this.weightCheck = req.param2;
    this.notocForm.get(['overPack', index, 'unids', group, 'awbId']).setValue(req.param1);
  }

  awbNumberMaxWeightOverPackAllPack(req, index, allPackindex, group) {
    this.weightCheck = req.param2;
    this.notocForm.get(['overPack', index, 'allPacks', allPackindex, 'unids', group, 'awbId']).setValue(req.param1);
  }
  awbNumberMaxWeightAllPack(req, index, group) {
    this.weightCheck = req.param2;
    this.notocForm.get(['allPack', index, 'unids', group, 'awbId']).setValue(req.param1);
  }

  awbNumberMaxWeightOtherSpecialLoad(req, index) {
    this.weightCheck = req.param2;
    this.notocForm.get(['otherSpecialLoadArray', index, 'awbId']).setValue(req.param1);
  }

  weightCheckAwbNumberUnid(weight, index) {
    if (this.weightCheck < weight) {
      this.showFormControlErrorMessage(
        <NgcFormControl>this.notocForm.get(["unid", index, "packageWeight"]),
        "export.awb.less.declared"
      );
      this.dontSaveWeight = true;
    } else {
      this.dontSaveWeight = false;
      this.resetFormMessages();
    }
  }

  weightCheckAwbNumberovrUnid(weight, index, subindex) {
    if (this.weightCheck < weight) {
      this.showFormControlErrorMessage(
        <NgcFormControl>this.notocForm.get([
          "overPack",
          index,
          "unids",
          subindex,
          "packageWeight"
        ]),
        "export.awb.less.declared"
      );
      this.dontSaveWeight = true;
    } else {
      this.dontSaveWeight = false;
      this.resetFormMessages();
    }
  }

  weightCheckAwbNumberovrAllUnid(weight, index, subindex, subSubindex) {
    if (this.weightCheck < weight) {
      this.showFormControlErrorMessage(
        <NgcFormControl>this.notocForm.get([
          "overPack",
          index,
          "allPacks",
          subindex,
          "unids",
          subSubindex,
          "packageWeight"
        ]),
        "export.awb.less.declared"
      );
      this.dontSaveWeight = true;
    } else {
      this.dontSaveWeight = false;
      this.resetFormMessages();
    }
  }

  weightCheckAwbNumberAllUnid(weight, index, subindex) {
    if (this.weightCheck < weight) {
      this.showFormControlErrorMessage(
        <NgcFormControl>this.notocForm.get([
          "allPack",
          index,
          "unids",
          subindex,
          "packageWeight"
        ]),
        "export.awb.less.declared"
      );
      this.dontSaveWeight = true;
    } else {
      this.dontSaveWeight = false;
      this.resetFormMessages();
    }
  }

  onDelete(event): void {
    const x = this.notocForm.getRawValue();
    let uIndex = 0;
    let allIndex = 0;
    let ovrIndex = 0;
    let ovrAllIndex = 0;
    let ovrAllUIndex = 0;
    let ovrUIndex = 0;
    x.unid.forEach(e => {
      if (e["select"]) {
        (<NgcFormArray>this.notocForm.controls["unid"]).markAsDeletedAt(uIndex);
      }
      uIndex++;
    });
    x.allPack.forEach(all => {
      let alluIndex = 0;
      all.unids.forEach(e => {
        if (e["select"]) {
          (<NgcFormArray>this.notocForm.get([
            "allPack",
            allIndex,
            "unids"
          ])).markAsDeletedAt(alluIndex);
        }
        alluIndex++;
      });
      allIndex++;
    });

    x.overPack.forEach(all => {
      let ovrAUIndex = 0;
      all.unids.forEach(e => {
        if (e["select"]) {
          (<NgcFormArray>this.notocForm.get([
            "overPack",
            ovrUIndex,
            "unids"
          ])).markAsDeletedAt(ovrAUIndex);
        }
        ovrAUIndex++;
      });
      ovrUIndex++;
    });

    ovrIndex = 0;
    x.overPack.forEach(ovr => {
      ovrAllIndex = 0;
      ovr.allPacks.forEach(all => {
        ovrAllUIndex = 0;
        all.unids.forEach(e => {
          if (e["select"]) {
            (<NgcFormArray>this.notocForm.get([
              "overPack",
              ovrIndex,
              "allPacks",
              ovrAllIndex,
              "unids"
            ])).markAsDeletedAt(ovrAllUIndex);
          }
          ovrAllUIndex++;
        });
        ovrAllIndex++;
      });
      ovrIndex++;
    });
  }

  onDeleteFreeText(event): void {
    const x = this.notocForm.getRawValue();
    let uIndex = 0;

    x.freeText.forEach(e => {
      if (e["select"]) {
        (<NgcFormArray>this.notocForm.controls["freeText"]).markAsDeletedAt(
          uIndex
        );
      }
      uIndex++;
    });
  }

  onDeleteowOtherSpecialLoad(event) {
    const x = this.notocForm.getRawValue();
    let uIndex = 0;
    x.otherSpecialLoadArray.forEach(e => {
      if (e["select"]) {
        (<NgcFormArray>this.notocForm.controls[
          "otherSpecialLoadArray"
        ]).markAsDeletedAt(uIndex);
      }
      uIndex++;
    });
  }

  onDeleteSpecialInstruction(event) {
    const x = this.notocForm.getRawValue();
    let uIndex = 0;
    x.specialInstructionArray.forEach(e => {
      if (e["select"]) {
        (<NgcFormArray>this.notocForm.controls[
          "specialInstructionArray"
        ]).markAsDeletedAt(uIndex);
      }
      uIndex++;
    });
  }

  onUnFinaliZe() {
    this.unFinalizeFlag = false;
    const UnfinalizeData = new NotocDetail();
    UnfinalizeData.flightId = this.arraylist.flight.flightId;
    UnfinalizeData.flightKey = this.arraylist.flight.flightKey;
    UnfinalizeData.flightOriginDate = this.arraylist.flight.flightOriginDate;
    this.notocService.Unfinalize(UnfinalizeData).subscribe(
      data => {
        this.finalizeButton = true;
        this.showSuccessStatus("export.unfinalized.successfully");
      },
      err => {
        //this.showErrorStatus("export.server.not.running");
      }
    );
  }

  onFinaliZe() {
    if (!this.resp.data.checkDataSavedForFinalize) {
      this.showErrorStatus("export.press.save.for.nil.notoc.then.finalize");
      return;
    }
    let carrierCode = this.notocForm.get("flightKey").value;
    carrierCode = carrierCode.slice(0, 2);
    if (!this.dlsFinalize && carrierCode != 'EY') {
      this.showErrorStatus("export.dls.not.finalized");
      return;
    }
    const detailFinalize: any = this.notocForm.getRawValue();
    const finalizeData = new NotocDetail();
    finalizeData.flightId = this.arraylist.flight.flightId;
    finalizeData.flightKey = this.arraylist.flight.flightKey;
    finalizeData.flightOriginDate = this.arraylist.flight.flightOriginDate;
    finalizeData.flight = this.arraylist.flight;
    // if (detailFinalize.seg) {
    //   finalizeData.flightBoardPoint = detailFinalize.seg.slice(0, 3);
    //  finalizeData.flightOffPoint = detailFinalize.seg.slice(4, 7);
    // }
    let unidArray = new Array();

    detailFinalize.unid.forEach(u => {
      u["overpackNumber"] = null;
      u["apioNumber"] = null;
      //u["uldNumber"] = detail.uldNumber;
      // u["awbNumber"] = detail.awbNumber;
      unidArray.push(u);
    });

    detailFinalize.allPack.forEach(a => {
      a.unids.forEach(ua => {
        ua["overpackNumber"] = null;
        ua["apioNumber"] = a.apioNumber;
        //   ua["uldNumber"] = detail.uldNumber;
        //   ua["awbNumber"] = detail.awbNumber;
        unidArray.push(ua);
      });
    });

    detailFinalize.overPack.forEach(o => {
      o.unids.forEach(uo => {
        uo["overpackNumber"] = o.overpackNumber;
        uo["apioNumber"] = null;
        //  uo["uldNumber"] = detail.uldNumber;
        //  uo["awbNumber"] = detail.awbNumber;
        unidArray.push(uo);
      });

      if (o.allPacks != null) {
        o.allPacks.forEach(oa => {
          oa.unids.forEach(uoa => {
            uoa["overpackNumber"] = o.overpackNumber;
            uoa["apioNumber"] = oa.apioNumber;
            //   uoa["uldNumber"] = detail.uldNumber;
            //   uoa["awbNumber"] = detail.awbNumber;
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
      this.showConfirmMessage(
        NgcUtility.translateMessage("export.missing.in.dls.wish.to.finalize.confirmation", [this.resp.data.missingDLSUlds]))
        .then(fulfilled => {
          this.notocService.finalize(finalizeData).subscribe(
            data => {
              if (!this.showResponseErrorMessages(data)) {
                this.showSuccessStatus("export.finalized.initiated");
                this.finalizeButton = false;
                // this.unFinalizeFlag = true;
                this.finalizeFlag = true;
                this.notocForm.controls["finalizeVersion"].setValue(
                  data.data.finalizeVersion
                );
                this.notocForm.controls["ntmVersionSent"].setValue(
                  data.data.ntmVersionSent
                );

                this.notocForm.controls["finalizestatus"].setValue(data.data.status);
                this.unFinalizeFlag = true;

                // if (data.data.status == "INITIATED") {
                //   this.finalizeFlag = true;
                //   this.unFinalizeFlag = true;
                // }
                if (data.data.status == "SENT") {
                  // this.finalizeFlag = false;
                  // this.unFinalizeFlag = true;
                  this.showSuccessStatus("export.finalized.successfully");
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
        })
        .catch(reason => { });
    } else
      this.notocService.finalize(finalizeData).subscribe(
        data => {
          if (!this.showResponseErrorMessages(data)) {
            this.showSuccessStatus("export.finalized.initiated");
            this.finalizeButton = false;
            // this.unFinalizeFlag = true;
            this.finalizeFlag = true;
            this.notocForm.controls["finalizeVersion"].setValue(
              data.data.finalizeVersion
            );
            this.notocForm.controls["ntmVersionSent"].setValue(
              data.data.ntmVersionSent
            );

            this.notocForm.controls["finalizestatus"].setValue(data.data.status);
            this.unFinalizeFlag = true;

            // if (data.data.status == "INITIATED") {
            //   this.finalizeFlag = true;
            //   this.unFinalizeFlag = true;
            // }
            if (data.data.status == "SENT") {
              // this.finalizeFlag = false;
              // this.unFinalizeFlag = true;
              this.showSuccessStatus("export.finalized.successfully");
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

  onPrint() {
    this.reportParameters = new Object();
    let carrierCode = this.notocForm.get("flightKey").value;
    carrierCode = carrierCode.slice(0, 2);
    if (carrierCode == "BA") {
      this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.DepartureDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      this.reportParameters.customerId = this.getUserProfile().userShortName;
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportBritishAirways.open();
    } else if (carrierCode == "TH") {
      this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.DepartureDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportTransmileAirways.open();
    } else if (carrierCode == "3V") {
      this.reportParameters.flightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.originDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportTNTAirways.open();
    } else if (carrierCode == "VF") {
      this.reportParameters.flightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.originDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      this.reportParameters.offPoint = this.resp.data.flightOffPoint;
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportValueAirways.open();
    } else if (carrierCode == "CV") {
      this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.FlightOriginDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportCargoLuxAirways.open();
    } else if (carrierCode == "PX") {
      this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.FlightOriginDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.customerId = this.getUserProfile().userShortName;
      this.reportNIUGINI.open();
    } else if (carrierCode == "NH") {
      this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.DepartureDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportANA.open();
    } else if (carrierCode == "8F" || carrierCode == "TMG") {
      this.reportParameters.Flight_key = this.notocForm.get("flightKey").value;
      this.reportParameters.origin_date = this.notocForm.get(
        "flightOriginDate"
      ).value;
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportCardigAirways.open();
    } else if (carrierCode == "5J") {
      this.reportParameters.flight_key = this.notocForm.get("flightKey").value;
      this.reportParameters.flight_origin_date = this.notocForm.get(
        "flightOriginDate"
      ).value;
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportCEBUPacific.open();
    } else if (carrierCode == "BR") {
      this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.FlightOriginDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      this.reportParameters.customerId = this.getUserProfile().userShortName;
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportEVAAirways.open();
    } else if (carrierCode == "TR" || carrierCode == "TRA") {
      this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.FlightOriginDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportParameters.FlightOffPoint = this.resp.data.flightOffPoint;
      this.reportTigerAirways.open();
    } else if (carrierCode == "TK") {
      this.reportParameters.flight_key = this.notocForm.get("flightKey").value;
      this.reportParameters.origin_date = this.notocForm.get(
        "flightOriginDate"
      ).value;
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportTurkishAirways.open();
    } else if (carrierCode == "3K") {
      this.reportParameters.flightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.originDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      this.reportParameters.offPoint = this.resp.data.flightOffPoint;

      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportJetStar3Kwithoffpt.open();
    } else if (carrierCode == "JQ") {
      this.reportParameters.flightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.originDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportParameters.offPoint = this.resp.data.flightOffPoint;
      this.reportJetStarJQwithoffpt.open();
    } else if (carrierCode == "JT") {
      this.reportParameters.flight_key = this.notocForm.get("flightKey").value;
      this.reportParameters.origin_date = this.notocForm.get(
        "flightOriginDate"
      ).value;
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportParameters.customerId = this.getUserProfile().userShortName;
      this.reportLionAir.open();
    } else if (carrierCode == "KE") {
      this.reportParameters.flightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.Origindate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      this.reportParameters.offpoint = this.resp.data.flightOffPoint;
      this.reportKoreanAirwithOffPt.open();
    }
    else if (carrierCode == "CK") {
      this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.FlightOriginDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      this.reportParameters.dateTimedisplay = NgcUtility.getTimeAsString(this.notocForm.get("std").value);
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportChinaCargo.open();
    } else {
      this.reportParameters.FlightKey = this.notocForm.get("flightKey").value;
      this.reportParameters.FlightOriginDate = this.notocForm.get(
        "flightOriginDate"
      ).value;
      this.reportParameters.customerId = this.getUserProfile().userShortName;
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
      this.reportParameters.flightId = parseInt(this.resp.data.flightId);
      if (this.resp.data.flight.aircraftRegistrationNumber != null) {
        this.reportParameters.aircraftReg = this.resp.data.flight.aircraftRegistrationNumber;
      } else {
        this.reportParameters.aircraftReg = null;
      }
      this.reportGeneral.open();
    }
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

    this.reportGeneralNOTOC.open();
  }

  onAddRowFreeText() {
    (<NgcFormArray>this.notocForm.get(["freeText"])).addValue([
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
        packingRemarks: ""
      }
    ]);
  }

  /**
   * On Tab Select
   */
  public onTabSelect(event) {
    if (event.index > -1) {
      this.selectedTabIndex = event.index;
    }
  }

  onCancel() {
    this.navigateBack(this.transferData);
  }
}

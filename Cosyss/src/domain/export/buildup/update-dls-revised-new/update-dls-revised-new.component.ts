import { ActivatedRoute, Router } from "@angular/router";
import {
  DLSULD,
  DLSAccessory,
  SHC,
  DLSPiggyBackInfo,
  DLSSegment,
  DLS,
  SearchUpdateDLS,
  DLSOsi,
  DLSNFMRoute,
  DLSFlight
} from "./../buildup.sharedmodel";
import { BuildupService } from "./../buildup.service";
import { ExportService } from "./../../export.service";
import {
  NgcFormControl,
  NgcFormGroup,
  NgcFormArray,
  NgcPage,
  PageConfiguration,
  NgcWindowComponent,
  CellsRendererStyle,
  NgcUtility,
  NgcReportComponent,
  TrackProgress
} from "ngc-framework";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  Input,
  ChangeDetectorRef
} from "@angular/core";
import { DISABLED } from "@angular/forms/src/model";
import { Validators } from "@angular/forms";
import { UpdateDlsReviedNewService, CheckForm } from "./update-dls-revised-new.queueservice";

@Component({
  selector: 'app-update-dls-revised-new',
  templateUrl: './update-dls-revised-new.component.html',
  styleUrls: ['./update-dls-revised-new.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  restorePageOnBack: true
})

export class UpdateDlsRevisedNewComponent extends NgcPage implements CheckForm {
  @ViewChild("insertionULDWindow") insertionULDWindow: NgcWindowComponent;
  @ViewChild("insertionTrollyWindow") insertionTrollyWindow: NgcWindowComponent;
  @ViewChild("sendNFMWindow") sendNFMWindow: NgcWindowComponent;
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  @ViewChild("reportWindow2") reportWindow2: NgcReportComponent;
  @ViewChild("notocUldMtBt") notocUldMtBt: NgcWindowComponent;

  NFMList = new Array<any>();
  showAccordian = false;
  showInsertWindow = false;
  showInsertTrollyWindow = false;
  segmentDetail: any;
  nfmFlag = false;
  showPage = false;
  tareResponse: any;
  searchResponse: any;
  shccode: any;
  disableUldForm = false;
  sendPLD = false;
  editULDFLag = false;
  insertUldFlag = false;
  sourceIdSegmentDropdown: any;
  navigateData: any;
  disableDelete = false;
  uldTitle: string;
  trolleyTitle: string;
  notocTitle: string;
  INSERT_ULD = "export.assign.uld.piggy.back.uld";
  EDIT_ULD = "export.assign.uld.edit.uld";
  INSERT_TROLLEY = "exp.assignuld.addtrolley";
  EDIT_TROLLEY = "export.assign.uld.piggy.back.uld";
  showIcsWeight = false;
  showActualWeight = false;
  showManifestWeight = false;
  dlsFinalize: boolean = true;
  disabledFinalize: boolean = false;
  reportParameters: any;
  piggyBackFlag: boolean = false;
  finalizeFlagDisabled: boolean = false;
  piggyResponse: any;
  onlyEditUld: boolean = true;
  nfmFlagNew: boolean = true;
  loadedUldNumber: String;
  transferData: any;
  notocFinalize: String;
  carrierCode: String;
  sendDlsFlagDisabled: boolean = false;
  selectedTabIndex: number = 0;
  oldFlightSegmentId: any;
  flightOffPoint: any;
  finalizeUldTrolleyList = new Array<DLSULD>();
  eccDropdown = ["DHL", "FED", "TNT", "ECC"];
  uldindexForAddingPgyBck: any;
  oldFlightKey: any;
  oldFlightDate: any;
  aircraftType: String;
  flightType: String;
  flagHeightCode: boolean = true;
  uldErrorFlag: string;
  bulkErrorFlag: string;
  osiErrorFlag: string;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router,
    private _buildService: BuildupService,
    private updateDlsReviedNewService: UpdateDlsReviedNewService,
    private cd: ChangeDetectorRef
  ) {
    super(appZone, appElement, appContainerElement);
    updateDlsReviedNewService.setCheckForm(this);
  }

  private form: NgcFormGroup = new NgcFormGroup({
    flightId: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    airlineLoadingInstructions: new NgcFormArray([]),
    flightOriginDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    aircraftRegistration: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    status: new NgcFormControl(),
    ali: new NgcFormArray([]),
    dlsStatus: new NgcFormControl(),
    dlsVersion: new NgcFormControl(),
    weightCode: new NgcFormControl(),
    flightSegmentId: new NgcFormControl(),
    // flightSegmentId1: new NgcFormControl(),
    manifestCompletedAt: new NgcFormControl(),
    manifestCompletedBy: new NgcFormControl(),
    dlsprecisionTime: new NgcFormControl(),
    segment: new NgcFormArray([
      new NgcFormGroup({
        uldList: new NgcFormArray([
          new NgcFormGroup({
            segmentName: new NgcFormControl(),
            shcs: new NgcFormArray([]),
            accessoryList: new NgcFormArray([]),
            piggyBackUldList: new NgcFormArray([])
          })
        ])
      })
    ]),
    dls: new NgcFormGroup({
      uldTrolleyList: new NgcFormArray([]),
      trolleyList: new NgcFormArray([]),
      systemOsiList: new NgcFormArray([]),
      osiList: new NgcFormArray([]),
      osiDisplayList: new NgcFormArray([]),
    }),
    insertDLS: new NgcFormGroup({
      baseUld: new NgcFormControl(),
      selectAllAccessory: new NgcFormControl(),
      selectAllpiggyback: new NgcFormControl(),
      piggyBackUldList: new NgcFormArray([])
      //accessoryList: new NgcFormArray([])
    }),
    insertTrolly: new NgcFormGroup({}),
    NFMList: new NgcFormArray([]),
    notocMtBt: new NgcFormArray([]),
    offloadUldList: new NgcFormArray([])
  });

  private eachUldRow = {
    select: false,
    uldTrolleyNumber: "",
    contentCode: "C",
    heightCode: "QL",
    usedForPerishableContainer: false,
    usedForExpressCourierContainer: '',
    tareWeight: "",
    netWeight: "",
    actualWeight: 0,
    shcs: new Array<SHC>(),
    // specialHandlingCode: "",
    usedAsStandBy: false,
    icsGrossWeight: "",
    usedForTransitUse: false,
    usedAsTrolley: false,
    remarks: "",
    terminal: this.getUserProfile().terminalId,
    handlingArea: this.getUserProfile().terminalId,
    piggyBackUldList: new Array<DLSPiggyBackInfo>(),
    accessoryList: new Array<DLSAccessory>(),
    flightSegmentId: "",
    trolleyInd: false,
    handedOverBy: "",
    completedAt: "",
    weightDifference: "",
    palletTypeFlag: 'P',
    transferType: null,
    manifestWeight: '',
    priorityOfLoading: '',
    dryIceWeight: '',
    dlsUldTrolleyId: null,
    showTimer: false,
    showIcon: false,
    isValueChanged: false,
    noOfPiggyback: ""
  }

  ngOnInit() {
    this.eachUldRow.terminal = this.getUserProfile().terminalId;
    this.eachUldRow.handlingArea = this.getUserProfile().terminalId;
    super.ngOnInit();
    // this.piggyBackAllSubscription();
    this.transferData = this.getNavigateData(this.route);
    try {
      if (this.transferData !== null && this.transferData !== undefined) {
        const s = new SearchUpdateDLS();
        s.flightKey = this.transferData.flightKey;
        s.flightOriginDate = this.transferData.flightOriginDate;
        this.form.patchValue(s);
        this.searchDLS('search');
      }
    } catch (e) { }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.form.get('flightSegmentId').valueChanges.subscribe(res => {
      if (res && this.oldFlightSegmentId != res) {
        this.oldFlightSegmentId = res;
        this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', this.sourceIdSegmentDropdown)
          .subscribe(data => {
            for (let index = 0; index < data.length; index++) {
              if (data[index].code == res) {
                this.flightOffPoint = data[index].desc;
                break;
              }
            }
            this.searchDLS('noSearch');
          });
      }
    });
  }

  searchDLS(req) {
    const s = new SearchUpdateDLS();
    s.flightKey = this.form.get("flightKey").value;
    s.flightOriginDate = this.form.get("flightOriginDate").value;
    if (req == 'search') {
      this.sourceIdSegmentDropdown =
        this.createSourceParameter(this.form.get('flightKey').value,
          this.form.get('flightOriginDate').value);
      this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', this.sourceIdSegmentDropdown)
        .subscribe(data => {
          this.form.get('flightSegmentId').patchValue(data[0].code, { onlySelf: true, emitEvent: false });
          this.flightOffPoint = data[0].desc;
          s.flightSegmentId = this.form.get('flightSegmentId').value;
          this.oldFlightSegmentId = this.form.get('flightSegmentId').value;
          s.flightOffPoint = this.flightOffPoint;
          this.search(s);
        }, error => {
          this.showErrorMessage('export.operative.flight.not.found');
        });
    }
    s.flightSegmentId = this.form.get('flightSegmentId').value;
    if (this.flightOffPoint) {
      s.flightOffPoint = this.flightOffPoint;
    }
    if (req == 'noSearch') {
      this.search(s);
    }
  }

  search(s) {
    this.oldFlightKey = this.form.get("flightKey").value;
    this.oldFlightDate = this.form.get("flightOriginDate").value;
    this._buildService.searchUpdateDLSList(s).subscribe(resp => {
      this.patchTheSearchResponse(resp, false);
    });
  }

  patchTheSearchResponse(resp, checkFlag) {
    this.refreshFormMessages(resp);
    this.searchResponse = resp.data;
    if (this.searchResponse.finalize) {
      this.finalizeFlagDisabled = this.searchResponse.finalize;
    }
    if (!this.searchResponse.finalize) {
      if (this.searchResponse.sendDlsStatus) {
        this.sendDlsFlagDisabled = true;
        this.finalizeFlagDisabled = this.searchResponse.finalize;
      } else {
        this.sendDlsFlagDisabled = false;
        this.finalizeFlagDisabled = this.searchResponse.finalize;
      }
    } else {
      this.sendDlsFlagDisabled = false;
    }
    this.notocFinalize = this.searchResponse.notocFinalizeStatus;
    this.carrierCode = this.searchResponse.carrierCode;
    this.flightType = this.searchResponse.flightType;
    this.aircraftType = this.searchResponse.aircraftType;
    if (this.searchResponse !== null) {
      this.form.get(["dls"]).reset();
      (<NgcFormArray>this.form.get(["dls", "uldTrolleyList"])).resetValue([]);
      (<NgcFormArray>this.form.get(["dls", "systemOsiList"])).resetValue([]);
      //(<NgcFormArray>this.form.get(["dls", "offloadUldList"])).resetValue([]);
      // (<NgcFormArray>this.form.get(["dls", "notocMtBt"])).patchValue(new Array);
      this.updateSeries(this.searchResponse);
      this.createOSILIST(this.searchResponse);
      const dupOffpointMap: any = {};
      let offPointGroupIndex = 1;
      let uldListSegmentWise = new Array<DLSULD>();
      let trolleyListSegmentWise = new Array<DLSULD>();
      this.searchResponse.dls.uldTrolleyList.forEach(element => {
        if (element.weightDifference == 0) {
          element.weightDifference = null;
        }
        if (element.contentCode && element.contentCode.length > 0) {
          element.contentCode = element.contentCode[0];
        }
        if (!element.uldTrolleyNumber && this.searchResponse.dls.trolleyList.length < 1) {

        }
        if (element.uldTrolleyNumber != 'NIL' && element.flightSegmentId == this.oldFlightSegmentId) {
          uldListSegmentWise.push(element);
        }
      });
      this.searchResponse.dls.trolleyList.forEach(element => {
        if (element.contentCode && element.contentCode.length > 0) {
          element.contentCode = element.contentCode[0];
        }
        if (element.flightSegmentId == this.oldFlightSegmentId) {
          trolleyListSegmentWise.push(element);
        }
      });
      //notoc MtBT
      if (this.searchResponse.notocMtBt) {
        this.form.get("notocMtBt").patchValue(this.searchResponse.notocMtBt);
      }
      //offloadUldList
      if (this.searchResponse.offloadUldList) {
        this.form.get("offloadUldList").patchValue(this.searchResponse.offloadUldList);
      }
      this.searchResponse.dls.uldTrolleyList = uldListSegmentWise;
      this.searchResponse.dls.trolleyList = trolleyListSegmentWise;
      this.oldFlightSegmentId = this.form.get('flightSegmentId').value;
      this.searchResponse.flightSegmentId = this.oldFlightSegmentId;
      this.form.patchValue(this.searchResponse, { onlySelf: true, emitEvent: false });
      if (this.searchResponse.dls.uldTrolleyList && this.searchResponse.dls.uldTrolleyList.length < 5) {
        this.addULD(false);
      } else if (checkFlag) {
        for (let i = 0; i < 5; i++) {
          this.eachUldRow.trolleyInd = false;
          this.eachUldRow.flightSegmentId = this.oldFlightSegmentId;
          (<NgcFormArray>this.form.get(["dls", "uldTrolleyList"])).addValue([
            this.eachUldRow
          ]);
        }
      }
      if (this.searchResponse.dls.trolleyList && this.searchResponse.dls.trolleyList.length < 5) {
        this.addTrolley();
      }
      this.addOsi();
      this.form.controls["dlsStatus"].setValue(this.searchResponse.dlsstatus);
      this.form.controls["dlsVersion"].setValue(
        this.searchResponse.dlsversion
      );
      if (this.searchResponse.dlsstatus == null) {
        this.disabledFinalize = false;
      }

      this.checkNFM(this.searchResponse);
      //this.updateForm();
      this.checkSendPLD();
      this.checkNFMButton();
      this.showAccordian = true;
      this.showPage = true;
    } else {
      this.showPage = false;
    }
  }

  checkNFM(response: any) {
    let serial = 1;
    this.NFMList = new Array<any>();
    if (
      response.dls &&
      response.dls.uldTrolleyList &&
      response.dls.uldTrolleyList !== null &&
      response.dls.uldTrolleyList.length > 0
    ) {
      response.dls.uldTrolleyList.forEach(uld => {
        if (uld.trolleyInd === false) {
          if (uld.routeList === null) {
            uld.routeList = new Array<DLSNFMRoute>();
          }
          uld["serialNumber"] = serial;
          this.NFMList.push(uld);
          serial++;
        }
      });
    }
    if (this.NFMList.length > 0) {
      this.form.get("NFMList").patchValue(this.NFMList);
      this.nfmFlag = true;
    }
  }

  updateSeries(resp: any) {
    if (
      resp.dls &&
      resp.dls != null &&
      resp.dls.uldTrolleyList &&
      resp.dls.uldTrolleyList != null
    ) {
      this.searchResponse.dls.uldTrolleyList.forEach(ele => {
        if (ele.uldList && ele.uldList !== null) {
          ele.uldList.forEach(uld => {
            if (uld && uld.piggyBackUldList && uld.piggyBackUldList !== null) {
              let count = 1;
              uld.piggyBackUldList.forEach(piggy => {
                if (piggy) {
                  piggy.serialNumber = count;
                }
                count++;
              });
            }
          });
        }
      });
    }
  }

  createOSILIST(response) {
    const systemOsiList = new Array<any>();
    const osiList = new Array<any>();
    if (
      response.dls &&
      response.dls.systemOsiList &&
      response.dls.systemOsiList !== null &&
      response.dls.systemOsiList.length > 0
    ) {
      response.dls.systemOsiList.forEach(element => {
        element["series"] = "";
        systemOsiList.push(element);
      });
    }
    if (
      response.dls &&
      response.dls.osiList &&
      response.dls.osiList !== null &&
      response.dls.osiList.length > 0
    ) {
      this.generateOSISeries(response.dls.osiList);
      response.dls.osiList.forEach(element => {
        //element.createdOn = NgcUtility.toDateFromLocalDate(element.createdOn);
        osiList.push(element);
      });
    }
    response.dls["osiDisplayList"] = osiList;
    response.dls["osiList"] = systemOsiList;
    // this.form.get(['dls', 'osiDisplayList']).patchValue(osiDisplayList);
  }

  generateOSISeries(arr: [any]) {
    let count = 10;
  }

  // updateForm() {
  //   if (
  //     this.form.get("dls") &&
  //     this.form.get("dls").value !== null &&
  //     this.form.get(["dls", "uldTrolleyList"])
  //   ) {
  //     (<NgcFormArray>this.form.get([
  //       "dls",
  //       "uldTrolleyList"
  //     ])).controls.forEach((uld: NgcFormGroup) => {
  //       if (uld.get("checkBox").value) {
  //       }
  //       if (!uld.get("manual").value) {
  //         if (uld.get("trolleyInd").value) {
  //           uld.addControl("Edit", new NgcFormControl());
  //         }
  //       }
  //     });
  //   }
  // }

  checkSendPLD() {
    this.sendPLD = false;
    const flightKey = this.form.get("flightKey").value;
    if (flightKey.search("KE") !== -1) {
      this.sendPLD = true;
    }
  }

  checkNFMButton() {
    this.nfmFlag = false;
    const flightKey = this.form.get("flightKey").value;
    if (flightKey.search("BA") !== -1) {
      this.nfmFlag = true;
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

  globalSave(event) {
    // if (!this.form.get('dls').valid) {
    //   return;
    // }
    this.uldErrorFlag = "";
    this.bulkErrorFlag = "";
    this.osiErrorFlag = "";
    let index = 0;
    let isAssigning = false
    let isAssigningBulk = false
    const formValue = this.form.getRawValue();
    for (const eachRow of formValue.dls.uldTrolleyList) {
      if (eachRow.flagCRUD !== 'C') {
        if (this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).invalid) {
          return;
        }
      }
      if (eachRow.uldTrolleyNumber && eachRow.isValueChanged) {
        if (eachRow.showTimer) {
          isAssigning = true;
        } else {
          if (!eachRow.showIcon) {
            isAssigning = true;
          }
        }
      }
      index++;
    }
    index = 0;
    for (const eachRow of formValue.dls.trolleyList) {
      if (eachRow.flagCRUD !== 'C') {
        if (this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).invalid) {
          return;
        }
      }
      if (eachRow.uldTrolleyNumber && eachRow.isValueChanged) {
        if (eachRow.showTimer) {
          isAssigningBulk = true;
        } else {
          if (!eachRow.showIcon) {
            isAssigningBulk = true;
          }
        }
      }
      index++;
    }
    const saveDLS: DLS = new DLS();
    saveDLS.flightId = this.form.get("flightId").value;
    saveDLS.flightOriginDate = this.form.get("flightOriginDate").value;;
    saveDLS.dlsId =
      this.form.get("dls").value !== null
        ? this.form.get("dls").get("dlsId").value
        : null;
    if (saveDLS.dlsId !== null) {
      saveDLS.flagCRUD = "U";
    } else {
      saveDLS.flagCRUD = "C";
    }
    saveDLS.osiList = formValue.dls.osiDisplayList.filter(
      ele => ele.flagCRUD === "C" || ele.flagCRUD === "D" || ele.flagCRUD === "U"
    );
    const uld = (<NgcFormGroup>this.form.get("dls")).getRawValue();
    let uldList = new Array<DLSULD>();
    let trolleyList = new Array<DLSULD>();
    let osiListManual = new Array<DLSOsi>();

    saveDLS.osiList.forEach(osi => {
      if (osi.detail) {
        osiListManual.push(osi);
      }
    });
    let i = 0;
    uld.uldTrolleyList.forEach(u => {
      if (u.uldTrolleyNumber && u.uldTrolleyNumber != "NIL" && u.uldTrolleyNumber != "") {
        if (!u.trolleyInd) {
          if (u.contentCode) {
            u.contentCode = [u.contentCode];
          }
          if (u.shcs && u.shcs !== null) {
            u.shcs.forEach(element => {
              element.flagCRUD = "C";
            });
          }
          u.flightOffPoint = this.flightOffPoint;
          u.flightKey = this.form.get("flightKey").value;
          u.flightOriginDate = this.form.get("flightOriginDate").value;
          u.manual = true;
          u.terminal = this.getUserProfile().terminalId;
          u.handlingArea = this.getUserProfile().terminalId;
          uldList.push(u);
        }
        if (u.actualWeight && u.actualWeight < u.tareWeight) {
          this.showFormControlErrorMessage(
            <NgcFormControl>this.form.get([
              "dls",
              "uldTrolleyList",
              i,
              "tareWeight"
            ]),
            "tare.weight.should.be.less.of.gross.weight"
          );
          i = 1000;
          return;
        }
      }
      i++;
    });
    if (i > 999)
      return;
    else {
      uld.trolleyList.forEach(u => {
        if (u.trolleyInd) {
          if (u.uldTrolleyNumber && u.uldTrolleyNumber != "") {
            if (u.contentCode) {
              u.contentCode = [u.contentCode];
            }
            if (u.shcs && u.shcs !== null) {
              u.shcs.forEach(element => {
                element.flagCRUD = "C";
              });
            }
            u.flightOffPoint = this.flightOffPoint;
            u.flightKey = this.form.get("flightKey").value;
            u.flightOriginDate = this.form.get("flightOriginDate").value;
            u.manual = true;
            u.terminal = this.getUserProfile().terminalId;
            u.handlingArea = this.getUserProfile().terminalId;
            trolleyList.push(u);
          }
        }
      });
      saveDLS.flightKey = this.form.get("flightKey").value;
      saveDLS.flightOriginDate = this.form.get(
        "flightOriginDate"
      ).value;
      saveDLS.flightSegmentId = this.form.get('flightSegmentId').value;
      saveDLS.flightOffPoint = this.flightOffPoint;
      saveDLS.uldTrolleyList = uldList;
      saveDLS.trolleyList = trolleyList;
      saveDLS.osiList = osiListManual;

      this.updateDlsReviedNewService.addRequestToQueueOnSave(saveDLS, 'onSave').subscribe(resp => {
        // this._buildService.updateuldlistonSave(saveDLS).subscribe(resp => {
        const response = resp;
        if (resp.data && resp.data.dls && resp.data.dls.infoFlag) {
          this.showConfirmMessage(resp.data.dls.warnigInfoAndErrorMessage).then(fulfilled => {
            saveDLS.ackInfo = true;
            this._buildService.updateuldlistonSave(saveDLS).subscribe(resp => {
              if (!this.showResponseErrorMessages(resp)) {
                this.showSuccessStatus("g.completed.successfully");
                this.patchTheSearchResponse(resp, event);
              }
            });
          }
          ).catch(reason => {
          });
        }
        else if (!this.showResponseErrorMessages(resp)) {
          this.showSuccessStatus("g.completed.successfully");
          this.patchTheSearchResponse(resp, event);
        }
        if (this.form.get(['dls', 'uldTrolleyList']).invalid) {
          this.uldErrorFlag = "error";
        }
        if (this.form.get(['dls', 'trolleyList']).invalid) {
          this.bulkErrorFlag = "error";
        }
        if (this.form.get(['dls', 'osiList']).invalid) {
          this.osiErrorFlag = "error";
        }
      });
    }
  }

  addULD(checkFlag) {
    this.eachUldRow.heightCode = "QL";
    if (this.searchResponse && this.searchResponse.dls && this.searchResponse.dls.uldTrolleyList &&
      (this.searchResponse.dls.uldTrolleyList.length < 1 ||
        (this.searchResponse.dls.uldTrolleyList && this.searchResponse.dls.uldTrolleyList[0].uldTrolleyNumber == null))) {
      for (let i = 0; i < 5; i++) {
        this.eachUldRow.trolleyInd = false;
        this.eachUldRow.flightSegmentId = this.oldFlightSegmentId;
        (<NgcFormArray>this.form.get(["dls", "uldTrolleyList"])).addValue([
          this.eachUldRow
        ]);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        this.eachUldRow.trolleyInd = false;
        this.eachUldRow.flightSegmentId = this.oldFlightSegmentId;
        (<NgcFormArray>this.form.get(["dls", "uldTrolleyList"])).addValue([
          this.eachUldRow
        ]);
      }
    }
  }

  addTrolley() {
    this.eachUldRow.heightCode = null;
    if (this.searchResponse && this.searchResponse.dls && this.searchResponse.dls.trolleyList && this.searchResponse.dls.trolleyList.length < 5) {
      for (let i = 0; i < 5; i++) {
        this.eachUldRow.trolleyInd = true;
        this.eachUldRow.flightSegmentId = this.oldFlightSegmentId;
        (<NgcFormArray>this.form.get(["dls", "trolleyList"])).addValue([
          this.eachUldRow
        ]);
      }
    } else {
      for (let i = 0; i < 5; i++) {
        this.eachUldRow.trolleyInd = true;
        this.eachUldRow.flightSegmentId = this.oldFlightSegmentId;
        (<NgcFormArray>this.form.get(["dls", "trolleyList"])).addValue([
          this.eachUldRow
        ]);
      }
    }
  }

  getUldTrolleyNumber(eventUld, index, flag, checkBulk) {
    if (!eventUld || eventUld === null) {
      return;
    }
    if (!checkBulk) {
      //Clear the message
      const checkDuplicates = (<NgcFormArray>this.form.get(["dls", 'uldTrolleyList'])).value;
      for (let i = 0; i < checkDuplicates.length; i++) {
        if (checkDuplicates[i].uldTrolleyNumber) {
          for (let j = 0; j < checkDuplicates.length; j++) {
            if (checkDuplicates[j].uldTrolleyNumber && i !== j) {
              if ((checkDuplicates[i].uldTrolleyNumber == checkDuplicates[j].uldTrolleyNumber) && (checkDuplicates[index].uldTrolleyNumber == checkDuplicates[i].uldTrolleyNumber)) {
                this.showFormControlErrorMessage(
                  <NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "uldTrolleyNumber"]),
                  "Duplicate Uld "
                ); return;
              }
            }
          }
        }
      }
      (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "isValueChanged"])).setValue(true);
      (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showTimer"])).setValue(true);
      this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([]);
      this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).disable();
      // this.showFormControlErrorMessage(
      //   <NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "uldTrolleyNumber"]),
      //   "Assigning ULD"
      // );
      if (eventUld != '' && eventUld != null && flag === 'C') {
        const PiggyBack = new DLSULD();
        PiggyBack.uldTrolleyNumber = eventUld;
        PiggyBack.flightKey = this.form.get("flightKey").value;
        PiggyBack.flightOriginDate = this.form.get("flightOriginDate").value;
        const dlsForm = (<NgcFormGroup>this.form.get("dls")).getRawValue();
        PiggyBack.heightCode = dlsForm.uldTrolleyList[index].heightCode;
        PiggyBack.carrierCode = this.carrierCode;
        if (this.flightOffPoint) {
          PiggyBack.flightOffPoint = this.flightOffPoint;
        }

        if (this.onlyEditUld) {
          this._buildService.getPiggyBackFlag(PiggyBack).subscribe(res => {
            this.piggyResponse = res.data;
            if (this.piggyResponse && this.piggyResponse.flightMatchesWithICS == false) {
              this.showWarningStatus('FLIGHT NO/DATE/DESTINATION IS NOT MATCHING WITH ICS INFORMATION. DO YOU WANT TO CONTINUE ASSIGNING WITH THIS FLIGHT?');
            }

            if (this.piggyResponse && this.piggyResponse.calculatedTareWeight != null && this.piggyResponse.calculatedTareWeight != 0) {
              this.form.get(["dls", "uldTrolleyList", index, "tareWeight"]).setValue(this.piggyResponse.calculatedTareWeight);
            }

            if (this.piggyResponse && this.piggyResponse.heightCode != null) {
              this.flagHeightCode = false;
              this.form.get(["dls", "uldTrolleyList", index, "heightCode"]).setValue(this.piggyResponse.heightCode, { onlySelf: true, emitEvent: false });
            }
            if (this.piggyResponse && this.piggyResponse.piggyBackFlag) {
              this.form.get(["dls", "uldTrolleyList", index, "palletTypeFlag"]).setValue(this.piggyResponse.piggyBackFlag);
            }
            this.flagHeightCode = true;
            if (this.piggyResponse && this.piggyResponse.plasticSheetQuantityCount != null && this.form.get(["dls", "uldTrolleyList", index, "accessoryList"]).value.length < 1) {
              const accesory = new DLSAccessory();
              accesory.accessoryTypeId = 1;
              accesory.quantity = this.piggyResponse.plasticSheetQuantityCount;
              let defaultAccesoryList = new Array<DLSAccessory>();
              defaultAccesoryList.push(accesory);
              this.form.get(["dls", "uldTrolleyList", index, "accessoryList"]).patchValue(defaultAccesoryList);
            }
            if (this.piggyResponse) {
              const request = (<NgcFormGroup>this.form.get('dls')).getRawValue();
              const trolleyListData = [];
              trolleyListData.push((<NgcFormGroup>this.form.get(["dls", 'uldTrolleyList', index]).value));
              trolleyListData[0].contentCode = [trolleyListData[0].contentCode];
              request.uldTrolleyList = trolleyListData;
              request.flightKey = this.form.get('flightKey').value;
              request.flightDate = this.form.get('flightOriginDate').value;
              request.flightOriginDate = this.form.get('flightOriginDate').value;
              request.osiDisplayList = [];
              request.trolleyList = [];
              request.systemOsiList = [];
              request.osiList = [];
              const dlsId = this.form.get("dls").value !== null ? this.form.get("dls").get("dlsId").value : null;
              if (dlsId !== null) {
                request.flagCRUD = "U";
              } else {
                request.flagCRUD = "C";
              }
              this.updateDlsReviedNewService.addRequestToQueue(request, 'onTabOut').subscribe(resp => {
                if (resp.data && resp.data.dls && resp.data.dls.infoFlag) {
                  this.showConfirmMessage(resp.data.dls.warnigInfoAndErrorMessage).then(fulfilled => {
                    request.ackInfo = true;
                    this.updateDlsReviedNewService.addRequestToQueue(request, 'onTabOut').subscribe(resp => {
                      (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showTimer"])).setValue(false);
                      // this.resetFormMessages();
                      if (resp.data && resp.data.dls.uldTrolleyList[0].messageList && resp.data.dls.uldTrolleyList[0].messageList.length > 0) {
                        if (resp.data && resp.data.dls && resp.data.dls.uldTrolleyList) {
                          this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
                          this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
                          this.refreshFormMessages(resp.data.dls.uldTrolleyList[0], null, `dls.uldTrolleyList.${index}`, false, false);
                        }
                      } else if (resp.data) {
                        if (!this.showResponseErrorMessages(resp)) {
                          (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(true);
                          (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(true);
                          this.form.get(['dls', 'uldTrolleyList', index, 'flagCRUD']).setValue('U');
                          if (resp.data.dls.dlsId) {
                            (<NgcFormControl>this.form.get(["dls", "dlsId"])).setValue(resp.data.dls.dlsId);
                          }
                          this.form.get(['dls', 'uldTrolleyList', index, 'dlsUldTrolleyId']).setValue(resp.data.dls.uldTrolleyList[0].dlsUldTrolleyId);
                          this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([]);
                          this.form.get(['dls', 'osiList']).patchValue(resp.data.dls.systemOsiList);
                        } else {
                          (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(false);
                          this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
                          this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
                        }
                        // this.refreshFormMessages(resp.data.dls.uldTrolleyList[0], null, `dls.uldTrolleyList.${index}`, false);
                      } else {
                        this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
                        this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
                        this.showResponseErrorMessages(resp)
                      }
                    });
                  }
                  ).catch(reason => {
                    (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "isValueChanged"])).setValue(false);
                    this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
                    this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
                  });
                } else {
                  (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showTimer"])).setValue(false);
                  // this.resetFormMessages();
                  if (resp.data && resp.data.dls.uldTrolleyList[0].messageList && resp.data.dls.uldTrolleyList[0].messageList.length > 0) {
                    if (resp.data && resp.data.dls && resp.data.dls.uldTrolleyList) {
                      this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
                      this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
                      this.refreshFormMessages(resp.data.dls.uldTrolleyList[0], null, `dls.uldTrolleyList.${index}`, false, false);
                    }
                  } else if (resp.data) {
                    if (!this.showResponseErrorMessages(resp)) {
                      (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(true);
                      (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(true);
                      this.form.get(['dls', 'uldTrolleyList', index, 'flagCRUD']).setValue('U');
                      if (resp.data.dls.dlsId) {
                        (<NgcFormControl>this.form.get(["dls", "dlsId"])).setValue(resp.data.dls.dlsId);
                      }
                      this.form.get(['dls', 'osiList']).patchValue(resp.data.dls.systemOsiList);
                      this.form.get(['dls', 'uldTrolleyList', index, 'dlsUldTrolleyId']).setValue(resp.data.dls.uldTrolleyList[0].dlsUldTrolleyId);
                      this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([]);
                    } else {
                      (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(false);
                      this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
                      this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
                    }
                    // this.refreshFormMessages(resp.data.dls.uldTrolleyList[0], null, `dls.uldTrolleyList.${index}`, false);
                  } else {
                    this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
                    this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
                    this.showResponseErrorMessages(resp)
                  }
                }
              })
            }
          });
        }
      }
    } else {
      const checkDuplicates = (<NgcFormArray>this.form.get(["dls", 'trolleyList'])).value;
      for (let i = 0; i < checkDuplicates.length; i++) {
        if (checkDuplicates[i].uldTrolleyNumber) {
          for (let j = 0; j < checkDuplicates.length; j++) {
            if (checkDuplicates[j].uldTrolleyNumber && i !== j) {
              if ((checkDuplicates[i].uldTrolleyNumber == checkDuplicates[j].uldTrolleyNumber) && (checkDuplicates[index].uldTrolleyNumber == checkDuplicates[i].uldTrolleyNumber)) {
                this.showFormControlErrorMessage(
                  <NgcFormControl>this.form.get(["dls", "trolleyList", index, "uldTrolleyNumber"]),
                  "Duplicate Uld "
                ); return;
              }
            }
          }
        }
      }
      (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "isValueChanged"])).setValue(true);
      (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "showTimer"])).setValue(true);
      this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).setValidators([]);
      this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).disable();
      const request = (<NgcFormGroup>this.form.get('dls')).getRawValue();
      const dlsId = this.form.get("dls").value !== null ? this.form.get("dls").get("dlsId").value : null;
      if (dlsId !== null) {
        request.flagCRUD = "U";
      } else {
        request.flagCRUD = "C";
      }
      const trolleyListData = [];
      trolleyListData.push((<NgcFormGroup>this.form.get(["dls", 'trolleyList', index]).value));
      trolleyListData[0].contentCode = [trolleyListData[0].contentCode];
      request.trolleyList = trolleyListData;
      request.flightKey = this.form.get('flightKey').value;
      request.flightDate = this.form.get('flightOriginDate').value;
      request.flightOriginDate = this.form.get('flightOriginDate').value;
      request.osiDisplayList = [];
      request.uldTrolleyList = [];
      request.systemOsiList = [];
      request.osiList = [];
      this.updateDlsReviedNewService.addRequestToQueue(request, 'onTabOut').subscribe(resp => {
        if (resp.data && resp.data.dls && resp.data.dls.infoFlag) {
          this.showConfirmMessage(resp.data.dls.warnigInfoAndErrorMessage).then(fulfilled => {
            request.ackInfo = true;
            this.updateDlsReviedNewService.addRequestToQueue(request, 'onTabOut').subscribe(resp => {
              (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "showTimer"])).setValue(false);
              // this.resetFormMessages();
              if (resp.data && resp.data.dls.trolleyList[0].messageList && resp.data.dls.trolleyList[0].messageList.length > 0) {
                if (resp.data && resp.data.dls && resp.data.dls.trolleyList) {
                  this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
                  this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).enable();
                  this.refreshFormMessages(resp.data.dls.trolleyList[0], null, `dls.trolleyList.${index}`, false, false);
                }
              } else if (resp.data) {
                if (!this.showResponseErrorMessages(resp)) {
                  (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "showIcon"])).setValue(true);
                  (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "showIcon"])).setValue(true);
                  this.form.get(['dls', 'trolleyList', index, 'flagCRUD']).setValue('U');
                  if (resp.data.dls.dlsId) {
                    (<NgcFormControl>this.form.get(["dls", "dlsId"])).setValue(resp.data.dls.dlsId);
                  }
                  this.form.get(['dls', 'osiList']).patchValue(resp.data.dls.systemOsiList);
                  this.form.get(['dls', 'trolleyList', index, 'dlsUldTrolleyId']).setValue(resp.data.dls.trolleyList[0].dlsUldTrolleyId);
                  this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).setValidators([]);
                } else {
                  (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "showIcon"])).setValue(false);
                  this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
                  this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).enable();
                }
                // this.refreshFormMessages(resp.data.dls.trolleyList[0], null, `dls.trolleyList.${index}`, false);
              } else {
                this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
                this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).enable();
                this.showResponseErrorMessages(resp)
              }
            });
          }
          ).catch(reason => {
            (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "isValueChanged"])).setValue(false);
            this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
            this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).enable();
          });
        } else {
          (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "showTimer"])).setValue(false);
          // this.resetFormMessages();
          if (resp.data && resp.data.dls.trolleyList[0].messageList && resp.data.dls.trolleyList[0].messageList.length > 0) {
            if (resp.data && resp.data.dls && resp.data.dls.trolleyList) {
              this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
              this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).enable();
              (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "showIcon"])).setValue(false);
              this.refreshFormMessages(resp.data.dls.trolleyList[0], null, `dls.trolleyList.${index}`, false, false);
            }
          } else if (resp.data) {
            if (!this.showResponseErrorMessages(resp)) {
              (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "showIcon"])).setValue(true);
              this.form.get(['dls', 'trolleyList', index, 'flagCRUD']).setValue('U');
              if (resp.data.dls.dlsId) {
                (<NgcFormControl>this.form.get(["dls", "dlsId"])).setValue(resp.data.dls.dlsId);
              }
              this.form.get(['dls', 'osiList']).patchValue(resp.data.dls.systemOsiList);
              this.form.get(['dls', 'trolleyList', index, 'dlsUldTrolleyId']).setValue(resp.data.dls.trolleyList[0].dlsUldTrolleyId);
              this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).setValidators([]);
            } else {
              this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
              this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).enable();
              (<NgcFormControl>this.form.get(["dls", "trolleyList", index, "showIcon"])).setValue(false);
            }
            // this.refreshFormMessages(resp.data.dls.trolleyList[0], null, `dls.trolleyList.${index}`, false);
          } else {
            this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
            this.form.get(['dls', 'trolleyList', index, 'uldTrolleyNumber']).enable();
            this.showResponseErrorMessages(resp)
          }
        }
      })
    }
  }

  addContouCodeWeight(eventCode, index, flag) {
    if (!this.flagHeightCode) {
      return
    }
    // const PiggyBack = new DLSULD();
    // PiggyBack.heightCode = eventCode;
    // PiggyBack.flightKey = this.form.get("flightKey").value;
    const dlsForm = (<NgcFormGroup>this.form.get("dls")).getRawValue();
    // PiggyBack.uldTrolleyNumber = dlsForm.uldTrolleyList[index].uldTrolleyNumber;
    // PiggyBack.carrierCode = this.carrierCode;
    // if (this.onlyEditUld && (flag === 'U' || flag === 'C')) {
    //   this._buildService.getPiggyBackFlag(PiggyBack).subscribe(res => {
    //     this.piggyResponse = res.data;
    //     if (this.piggyResponse && this.piggyResponse.calculatedTareWeight != null && this.piggyResponse.calculatedTareWeight != 0) {
    //       this.form.get(["dls", "uldTrolleyList", index, "tareWeight"]).setValue(this.piggyResponse.calculatedTareWeight);
    //     }
    //     if (this.piggyResponse && this.piggyResponse.plasticSheetQuantityCount != null) {
    //       this.form.get(["dls", "uldTrolleyList", index, "accessoryList", 0, 'accessoryTypeId']).setValue(1);
    //       this.form.get(["dls", "uldTrolleyList", index, "accessoryList", 0, 'quantity']).setValue(this.piggyResponse.plasticSheetQuantityCount);
    //     }
    //     if (this.piggyResponse && this.piggyResponse.heightCode != null) {
    //       this.flagHeightCode = false;
    //       this.form.get(["dls", "uldTrolleyList", index, "heightCode"]).setValue(this.piggyResponse.heightCode, { onlySelf: true, emitEvent: false });
    //     }
    //     this.flagHeightCode = true;
    if (dlsForm.uldTrolleyList[index].isValueChanged &&
      !dlsForm.uldTrolleyList[index].showTimer &&
      !dlsForm.uldTrolleyList[index].showIcon) {
      const request = (<NgcFormGroup>this.form.get('dls')).getRawValue();
      const trolleyListData = [];
      trolleyListData.push((<NgcFormGroup>this.form.get(["dls", 'uldTrolleyList', index]).value));
      trolleyListData[0].contentCode = [trolleyListData[0].contentCode];
      request.uldTrolleyList = trolleyListData;
      request.flightKey = this.form.get('flightKey').value;
      request.flightDate = this.form.get('flightOriginDate').value;
      request.flightOriginDate = this.form.get('flightOriginDate').value;
      request.osiDisplayList = [];
      request.trolleyList = [];
      request.systemOsiList = [];
      request.osiList = [];
      const dlsId = this.form.get("dls").value !== null ? this.form.get("dls").get("dlsId").value : null;
      if (dlsId !== null) {
        request.flagCRUD = "U";
      } else {
        request.flagCRUD = "C";
      }
      this.updateDlsReviedNewService.addRequestToQueue(request, 'onTabOut').subscribe(resp => {
        (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showTimer"])).setValue(false);
        // this.resetFormMessages();
        if (resp.data && resp.data.dls.uldTrolleyList[0].messageList && resp.data.dls.uldTrolleyList[0].messageList.length > 0) {
          if (resp.data && resp.data.dls && resp.data.dls.uldTrolleyList) {
            this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
            this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
            this.refreshFormMessages(resp.data.dls.uldTrolleyList[0], null, `dls.uldTrolleyList.${index}`, false, false);
          }
        } else if (resp.data) {
          if (!this.showResponseErrorMessages(resp)) {
            (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(true);
            (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(true);
            this.form.get(['dls', 'uldTrolleyList', index, 'flagCRUD']).setValue('U');
            if (resp.data.dls.dlsId) {
              (<NgcFormControl>this.form.get(["dls", "dlsId"])).setValue(resp.data.dls.dlsId);
            }
            this.form.get(['dls', 'uldTrolleyList', index, 'dlsUldTrolleyId']).setValue(resp.data.dls.uldTrolleyList[0].dlsUldTrolleyId);
            this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([]);
          } else {
            (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(false);
            this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
            this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
          }
          // this.refreshFormMessages(resp.data.dls.uldTrolleyList[0], null, `dls.uldTrolleyList.${index}`, false);
        } else {
          this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
          this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
          this.showResponseErrorMessages(resp)
        }
      })
    }
    //set Auto Focus
    //     this.async(() => {
    //       (this.form.get(["dls", "uldTrolleyList", index, "contentCode"]) as NgcFormControl).focus();
    //     }, 200);
    //   });
    // }
  }

  onTransferType(eventCode, index, flag) {
    const dlsForm = (<NgcFormGroup>this.form.get("dls")).getRawValue();
    if (dlsForm.uldTrolleyList[index].isValueChanged &&
      !dlsForm.uldTrolleyList[index].showTimer &&
      !dlsForm.uldTrolleyList[index].showIcon) {
      const request = (<NgcFormGroup>this.form.get('dls')).getRawValue();
      const trolleyListData = [];
      trolleyListData.push((<NgcFormGroup>this.form.get(["dls", 'uldTrolleyList', index]).value));
      trolleyListData[0].contentCode = [trolleyListData[0].contentCode];
      request.uldTrolleyList = trolleyListData;
      request.flightKey = this.form.get('flightKey').value;
      request.flightDate = this.form.get('flightOriginDate').value;
      request.flightOriginDate = this.form.get('flightOriginDate').value;
      request.osiDisplayList = [];
      request.trolleyList = [];
      request.systemOsiList = [];
      request.osiList = [];
      const dlsId = this.form.get("dls").value !== null ? this.form.get("dls").get("dlsId").value : null;
      if (dlsId !== null) {
        request.flagCRUD = "U";
      } else {
        request.flagCRUD = "C";
      }
      this.updateDlsReviedNewService.addRequestToQueue(request, 'onTabOut').subscribe(resp => {
        (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showTimer"])).setValue(false);
        // this.resetFormMessages();
        if (resp.data && resp.data.dls.uldTrolleyList[0].messageList && resp.data.dls.uldTrolleyList[0].messageList.length > 0) {
          if (resp.data && resp.data.dls && resp.data.dls.uldTrolleyList) {
            this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
            this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
            this.refreshFormMessages(resp.data.dls.uldTrolleyList[0], null, `dls.uldTrolleyList.${index}`, false, false);
          }
        } else if (resp.data) {
          if (!this.showResponseErrorMessages(resp)) {
            (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(true);
            (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(true);
            this.form.get(['dls', 'uldTrolleyList', index, 'flagCRUD']).setValue('U');
            if (resp.data.dls.dlsId) {
              (<NgcFormControl>this.form.get(["dls", "dlsId"])).setValue(resp.data.dls.dlsId);
            }
            this.form.get(['dls', 'uldTrolleyList', index, 'dlsUldTrolleyId']).setValue(resp.data.dls.uldTrolleyList[0].dlsUldTrolleyId);
            this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([]);
          } else {
            (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", index, "showIcon"])).setValue(false);
            this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
            this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
          }
          // this.refreshFormMessages(resp.data.dls.uldTrolleyList[0], null, `dls.uldTrolleyList.${index}`, false);
        } else {
          this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).setValidators([Validators.required]);
          this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).enable();
          this.showResponseErrorMessages(resp)
        }
      })
    }
  }
  addUldPalletWeight(eventPallet, index) {
    let totalWeight: number = 0;
    const PiggyBack = new DLSULD();
    const dlsForm = (<NgcFormGroup>this.form.get("dls")).getRawValue();
    PiggyBack.uldTrolleyNumber = dlsForm.uldTrolleyList[this.uldindexForAddingPgyBck].uldTrolleyNumber;
    PiggyBack.heightCode = dlsForm.uldTrolleyList[this.uldindexForAddingPgyBck].heightCode;
    PiggyBack.piggyBackUldList = this.form.get(["insertDLS", "piggyBackUldList"]).value;
    PiggyBack.flightKey = this.form.get("flightKey").value;
    PiggyBack.carrierCode = this.carrierCode;
    totalWeight = dlsForm.uldTrolleyList[this.uldindexForAddingPgyBck].tareWeight;
    this._buildService.getPiggyBackFlag(PiggyBack).subscribe(res => {
      this.piggyResponse = res.data;
      totalWeight = totalWeight + this.piggyResponse.calculatedTareWeight;
      if (this.piggyResponse.totalTareWeight != 0) {
        this.form.get([
          "insertDLS",
          "piggyBackUldList",
          index,
          "select"
        ]).setValue(true);
        if (this.piggyResponse && this.piggyResponse.heightCode != null) {
          this.flagHeightCode = false;
          this.form.get(["dls", "uldTrolleyList", index, "heightCode"]).setValue(this.piggyResponse.heightCode, { onlySelf: true, emitEvent: false });
        }
        this.flagHeightCode = true;
        this.form.get(["dls", "uldTrolleyList", this.uldindexForAddingPgyBck, "tareWeight"]).setValue(this.piggyResponse.totalTareWeight);
      }
    });
  }

  deleteUld() {
    let index = 0;
    let isAssigning = false
    const formValue = this.form.getRawValue();
    for (const eachRow of formValue.dls.uldTrolleyList) {
      if (eachRow.flagCRUD !== 'C') {
        if (this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).invalid) {
          return;
        }
      }
      if (eachRow.isValueChanged) {
        if (eachRow.showTimer) {
          isAssigning = true;
        } else {
          if (!eachRow.showIcon) {
            isAssigning = true;
          }
        }
      }
      index++;
    }
    if (isAssigning) {
      this.showErrorMessage('export.assigning.uld');
      return;
    }
    const saveDLS: DLS = new DLS();
    saveDLS.flightId = this.form.get("flightId").value;
    saveDLS.dlsId = this.form.get("dls").get("dlsId").value;
    saveDLS.flightKey = this.form.get("flightKey").value;
    saveDLS.flightOriginDate = this.form.get("flightOriginDate").value;;
    saveDLS.flagCRUD = "D";
    if (this.checkForDelete()) {
      return;
    }
    let countForDelete = 0;
    let editRow: NgcFormArray = null;
    editRow = <NgcFormArray>this.form.get(["dls", "uldTrolleyList"]);
    saveDLS.uldTrolleyList = this.getDeleteListUld(editRow).getRawValue();
    saveDLS.uldTrolleyList.forEach(uld => {
      if (uld.contentCode && uld.contentCode.length > 0) {
        uld.contentCode = [uld.contentCode];
        uld.flightKey = this.form.get("flightKey").value;
        uld.flightOriginDate = this.form.get("flightOriginDate").value;
      }
      if (uld.flagCRUD == "D") {
        countForDelete++;
      }
    });
    if (countForDelete > 0) {
      this.showConfirmMessage(
        "export.delete.checked.ticked.records.confirmation Screen will be refreshed after this."
      )
        .then(fulfilled => {
          this._buildService.deleteUldTrolly(saveDLS).subscribe(resp => {
            const response = resp;
            this.refreshFormMessages(response);
            if (response.data) {
              this.showSuccessStatus("g.completed.successfully");
              this.searchDLS('noSearch');
            }
          });
        })
        .catch(reason => { });
    }
  }

  deleteTrolley() {
    const saveDLS: DLS = new DLS();
    saveDLS.flightId = this.form.get("flightId").value;
    saveDLS.dlsId = this.form.get("dls").get("dlsId").value;
    saveDLS.flightKey = this.form.get("flightKey").value;
    saveDLS.flightOriginDate = this.form.get("flightOriginDate").value;;
    saveDLS.flagCRUD = "D";
    if (this.checkForDelete()) {
      return;
    }
    let countForDelete = 0;
    let editRow: NgcFormArray = null;
    editRow = <NgcFormArray>this.form.get(["dls", "trolleyList"]);
    saveDLS.uldTrolleyList = this.getDeleteListTrolley(editRow).getRawValue();
    saveDLS.uldTrolleyList.forEach(uld => {
      if (uld.contentCode && uld.contentCode.length > 0) {
        uld.contentCode = [uld.contentCode];
        uld.flightKey = this.form.get("flightKey").value;
        uld.flightOriginDate = this.form.get("flightOriginDate").value;
      }
      if (uld.flagCRUD == "D") {
        countForDelete++;
      }
    });
    if (countForDelete > 0) {
      this.showConfirmMessage(
        "export.delete.checked.ticked.records.confirmation Screen will be refreshed after this."
      )
        .then(fulfilled => {
          this._buildService.deleteUldTrolly(saveDLS).subscribe(resp => {
            const response = resp;
            this.refreshFormMessages(response);
            if (response.data) {
              this.showSuccessStatus("g.completed.successfully");
              this.searchDLS('noSearch');
            }
          });
        })
        .catch(reason => { });
    }
  }

  checkForDelete(): boolean {
    let count = 0;
    (<NgcFormArray>this.form.get([
      "dls",
      "uldTrolleyList"
    ])).controls.forEach((uld: NgcFormGroup) => {
      if (uld.get("select").value) {
        count++;
      }
    });
    (<NgcFormArray>this.form.get([
      "dls",
      "trolleyList"
    ])).controls.forEach((uld: NgcFormGroup) => {
      if (uld.get("select").value) {
        count++;
      }
    });
    if (count === 0) {
      this.showErrorMessage("export.select.uld.trolley.to.delete");
      return true;
    }
    return false;
  }

  getDeleteListUld(list: NgcFormArray): NgcFormArray {
    for (let i = list.length - 1; i >= 0; i--) {
      if (<NgcFormControl>this.form.get(["dls", "uldTrolleyList", i, "select"]).value) {
        list.markAsDeletedAt(i);
      }
    }
    return list;
  }

  getDeleteListTrolley(list: NgcFormArray): NgcFormArray {
    for (let i = list.length - 1; i >= 0; i--) {
      if (<NgcFormControl>this.form.get(["dls", "trolleyList", i, "select"]).value) {
        list.markAsDeletedAt(i);
      }
    }
    return list;
  }

  addAccessory(index) {
    const accesory = new DLSAccessory();
    accesory.flagCRUD = "C";
    accesory.type = 'Plastic Sheets';
    (<NgcFormArray>this.form.get(["dls", "uldTrolleyList", index, "accessoryList"])).addValue([
      accesory
    ]);
  }

  deleteAccesory(index, accessoryIndex) {
    (<NgcFormArray>this.form.get(["dls", "uldTrolleyList", index, "accessoryList"])).markAsDeletedAt(accessoryIndex);
  }

  finalizeDLS() {
    let index = 0;
    let isAssigning = false
    const formValue = this.form.getRawValue();
    for (const eachRow of formValue.dls.uldTrolleyList) {
      if (eachRow.flagCRUD !== 'C') {
        if (this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).invalid) {
          return;
        }
      }
      if (eachRow.isValueChanged) {
        if (eachRow.showTimer) {
          isAssigning = true;
        } else {
          if (!eachRow.showIcon) {
            isAssigning = true;
          }
        }
      }
      index++;
    }
    if (isAssigning) {
      this.showErrorMessage('export.assigning.uld');
      return;
    }
    const flight: DLSFlight = this.form.getRawValue();
    const sendFlight: DLSFlight = new DLSFlight();
    let uldList = new Array<DLSULD>();
    sendFlight.flightKey = flight.flightKey;
    sendFlight.flightOriginDate = flight.flightOriginDate;
    sendFlight.flightId = flight.flightId;
    sendFlight.flightKey = flight.flightKey;
    sendFlight.uldTrolleyList = flight.dls.uldTrolleyList;
    sendFlight.carrierCode = this.carrierCode;
    sendFlight.flightType = this.flightType;
    sendFlight.aircraftType = this.aircraftType;
    sendFlight.uldTrolleyList.push.apply(sendFlight.uldTrolleyList, flight.dls.trolleyList);
    sendFlight.uldTrolleyList.forEach(u => {
      if (u.uldTrolleyNumber) {
        uldList.push(u);
      }
    });
    sendFlight.uldTrolleyList = uldList;
    sendFlight.finalizeStatus = this.finalizeFlagDisabled;
    if (this.carrierCode == 'EY' && this.notocFinalize == "0") {
      this.showErrorStatus("export.notoc.not.finalized");
      return;
    }
    if (this.searchResponse.dlsversion) {
      sendFlight.dlsversion = parseInt(this.form.get('dlsversion').value, 10) + 1;
    } else {
      sendFlight.dlsversion = 1;
    }
    sendFlight.uldTrolleyList.forEach(uld => {
      if (uld.contentCode && uld.contentCode.length > 0) {
        uld.contentCode = [uld.contentCode];
      }
    });
    sendFlight.ackForPriorityShc = true;
    this._buildService.finalizeDLS(sendFlight).subscribe(resp => {
      if (!this.showResponseErrorMessages(resp)) {
        this.showSuccessStatus("export.dls.finalized.initiated");
        this.dlsFinalize = false;
        this.finalizeFlagDisabled = true;
        this.searchDLS('noSearch');
        if (resp.data && resp.data && resp.data.infoFlag && resp.data.warningMessageForPriorityShc) {
          this.async(() => {
            this.showMessage(resp.data.warningMessageForPriorityShc);
          }, 3000);
        }
      }
    });
  }

  UnfinalizeDLS() {
    this.dlsFinalize = true;
    this.searchDLS('noSearch');
  }


  addULDForPiggyBack(index) {
    this.uldindexForAddingPgyBck = index;
    this.uldTitle = this.INSERT_ULD;
    const uld = new DLSULD();
    if (this.form.get(["dls", "uldTrolleyList", index, "piggyBackUldList"]).value.length > 0) {
      uld.piggyBackUldList = (<NgcFormGroup>this.form.get(["dls", "uldTrolleyList", index, "piggyBackUldList"])).getRawValue();
    } else {
      uld.piggyBackUldList = new Array<DLSPiggyBackInfo>();
    }
    this.form.get("insertDLS.baseUld").setValue(this.form.get(["dls", "uldTrolleyList", index, "uldTrolleyNumber"]).value);
    this.form.get(["insertDLS", "piggyBackUldList"]).patchValue(uld.piggyBackUldList);
    this.insertionULDWindow.open();
  }

  onCloseWindow() {
    const uld = (<NgcFormGroup>this.form.get("insertDLS")).getRawValue();
    let piggy = new Array<DLSPiggyBackInfo>();
    if (this.form.get(["insertDLS", "piggyBackUldList"]).value.length > 0) {
      uld.piggyBackUldList.forEach(u => {
        if (u.uldNumber) {
          piggy.push(u);
        }
      });
      this.form.get(["dls", "uldTrolleyList", this.uldindexForAddingPgyBck, "piggyBackUldList"]).patchValue(piggy);
    }
  }

  addPiggyBack() {
    const piggy = new DLSPiggyBackInfo();
    piggy.flagCRUD = "C";
    piggy.select = false;
    (<NgcFormArray>this.form.get(["insertDLS", "piggyBackUldList"])).addValue([
      piggy
    ]);
  }

  deletePiggyback(index) {
    this.subtractUldPalletWeight(index);
    const accesory: NgcFormGroup = <NgcFormGroup>this.form.get([
      "insertDLS",
      "piggyBackUldList",
      index
    ]);
    if (accesory.get("flagCRUD").value === "C") {
      (<NgcFormArray>this.form.get([
        "insertDLS",
        "piggyBackUldList"
      ])).markAsDeletedAt(index);
    } else {
      (<NgcFormGroup>this.form.get([
        "insertDLS",
        "piggyBackUldList",
        index
      ])).markAsDeleted();
    }
  }

  subtractUldPalletWeight(ind) {
    let totalWeight: number = 0;
    const PiggyBack = new DLSULD();
    const dlsForm = (<NgcFormGroup>this.form.get("dls")).getRawValue();
    PiggyBack.heightCode = dlsForm.uldTrolleyList[this.uldindexForAddingPgyBck].heightCode;
    const accesory: NgcFormGroup = <NgcFormGroup>this.form.get([
      "insertDLS",
      "piggyBackUldList",
      ind
    ]);
    PiggyBack.uldTrolleyNumber = accesory.get("uldNumber").value;
    PiggyBack.flightKey = this.form.get("flightKey").value;
    PiggyBack.carrierCode = this.carrierCode;
    totalWeight = dlsForm.uldTrolleyList[this.uldindexForAddingPgyBck].tareWeight;

    this._buildService.getPiggyBackFlag(PiggyBack).subscribe(res => {
      this.piggyResponse = res.data;
      totalWeight = totalWeight - this.piggyResponse.calculatedTareWeight;
      if (totalWeight != 0) {
        this.form.get(["dls", "uldTrolleyList", this.uldindexForAddingPgyBck, "tareWeight"]).setValue(totalWeight);
      }
    });
  }

  addOsi() {
    const s = new DLSOsi();
    let length = (<NgcFormArray>this.form.get(["dls", "osiDisplayList"])).length;
    if (length < 5) {
      for (let i = 0; i < 4; i++) {
        s.transactionSequenceNo = 10 * (length + 1);
        s.rampIndicate = true;
        (<NgcFormArray>this.form.get(["dls", "osiDisplayList"])).addValue([s]);
        length = (<NgcFormArray>this.form.get(["dls", "osiDisplayList"])).length;
      }
    } else {
      s.transactionSequenceNo = 10 * (length + 1);
      s.rampIndicate = true;
      (<NgcFormArray>this.form.get(["dls", "osiDisplayList"])).addValue([s]);
      length = (<NgcFormArray>this.form.get(["dls", "osiDisplayList"])).length;
    }
  }

  deleteOSI(index) {
    const osi: NgcFormGroup = <NgcFormGroup>this.form.get([
      "dls",
      "osiDisplayList",
      index
    ]);
    if (osi.get("flagCRUD").value === "C") {
      (<NgcFormArray>this.form.get(["dls", "osiDisplayList"])).markAsDeletedAt(
        index
      );
    } else {
      (<NgcFormGroup>this.form.get([
        "dls",
        "osiDisplayList",
        index
      ])).markAsDeleted();
    }
  }

  uldWeightStatement() {
    this.reportParameters = new Object();
    this.reportParameters.flightkey = this.form.get("flightKey").value;
    this.reportParameters.flightdate = this.form.get("flightOriginDate").value;
    this.reportParameters.preparedby = this.getUserProfile().userShortName;
    this.reportParameters.routingInfo = this.searchResponse.routingInfo;
    this.reportWindow2.reportParameters = this.reportParameters;
    this.reportWindow2.downloadReport();
  }

  assignULDTrolleytoFlight() {
    this.navigateTo(
      this.router,
      "/export/buildup/assign-uld-flight",
      this.form.getRawValue()
    );
  }

  ediMessage() {
    /*
        const sentEDIMessageFlight: DLSFlight = this.form.getRawValue();
        this.navigateTo(this.router, 'interface/outgoingmessage', { sentEDIMessageFlight });
    */
    this.navigateTo(
      this.router,
      "interface/outgoingmessage",
      this.form.getRawValue()
    );
  }

  //Navigate to NOTOC 
  notoc() {
    /*
        const sentEDIMessageFlight: DLSFlight = this.form.getRawValue();
        this.navigateTo(this.router, 'interface/outgoingmessage', { sentEDIMessageFlight });
    */
    this.navigateTo(
      this.router,
      "export/notoc/revisednotoc",
      this.form.getRawValue()
    );
  }

  dlsShortcut() {
    const s = new SearchUpdateDLS();
    s.flightKey = this.form.get("flightKey").value;
    s.flightOriginDate = this.form.get("flightOriginDate").value;
    this.navigateTo(this.router, "/export/buildup/display-dls-variance", s);
  }

  sendDLS() {
    let index = 0;
    let isAssigning = false
    const formValue = this.form.getRawValue();
    for (const eachRow of formValue.dls.uldTrolleyList) {
      if (eachRow.flagCRUD !== 'C') {
        if (this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).invalid) {
          return;
        }
      }
      if (eachRow.isValueChanged) {
        if (eachRow.showTimer) {
          isAssigning = true;
        } else {
          if (!eachRow.showIcon) {
            isAssigning = true;
          }
        }
      }
      index++;
    }
    if (isAssigning) {
      this.showErrorMessage('export.assigning.uld');
      return;
    }
    const flight: DLSFlight = this.form.getRawValue();
    const sendFlight: DLSFlight = new DLSFlight();
    let uldList = new Array<DLSULD>();
    sendFlight.flightId = flight.flightId;
    sendFlight.uldTrolleyList = flight.dls.uldTrolleyList;
    sendFlight.uldTrolleyList.push.apply(sendFlight.uldTrolleyList, flight.dls.trolleyList);
    sendFlight.finalizeStatus = this.finalizeFlagDisabled;
    sendFlight.uldTrolleyList.forEach(u => {
      if (u.uldTrolleyNumber) {
        uldList.push(u);
      }
    });
    sendFlight.uldTrolleyList = uldList;
    sendFlight.uldTrolleyList.forEach(uld => {
      if (uld.contentCode && uld.contentCode.length > 0) {
        uld.contentCode = [uld.contentCode];
      }
    });
    this._buildService.sendDLS(sendFlight).subscribe(resp => {
      if (resp.messageList === null) {
        this.showSuccessStatus("export.dls.send");
        //
      } else {
        this.refreshFormMessages(resp);
      }
    });
  }

  fetchWeight() {
    let index = 0;
    let isAssigning = false
    const formValue = this.form.getRawValue();
    for (const eachRow of formValue.dls.uldTrolleyList) {
      if (eachRow.flagCRUD !== 'C') {
        if (this.form.get(['dls', 'uldTrolleyList', index, 'uldTrolleyNumber']).invalid) {
          return;
        }
      }
      if (eachRow.isValueChanged) {
        if (eachRow.showTimer) {
          isAssigning = true;
        } else {
          if (!eachRow.showIcon) {
            isAssigning = true;
          }
        }
      }
      index++;
    }
    if (isAssigning) {
      this.showErrorMessage('export.assigning.uld');
      return;
    }
    const flight: DLSFlight = this.form.getRawValue();
    const sendFlight: DLSFlight = new DLSFlight();
    let uldList = new Array<DLSULD>();
    sendFlight.flightId = flight.flightId;
    sendFlight.flightKey = flight.flightKey;
    sendFlight.flightOriginDate = flight.flightOriginDate;
    sendFlight.uldTrolleyList = flight.dls.uldTrolleyList;
    sendFlight.uldTrolleyList.push.apply(sendFlight.uldTrolleyList, flight.dls.trolleyList);
    sendFlight.uldTrolleyList.forEach(u => {
      if (u.uldTrolleyNumber) {
        uldList.push(u);
      }
    });
    sendFlight.uldTrolleyList = uldList;
    sendFlight.uldTrolleyList.forEach(uld => {
      if (uld.contentCode && uld.contentCode.length > 0) {
        uld.flightKey = flight.flightKey;
        uld.flightOriginDate = flight.flightOriginDate;
        uld.contentCode = [uld.contentCode];
      }
    });
    this._buildService.fetchWeight(sendFlight).subscribe(resp => {
      if (resp.data.checkIcsWeight) {
        this.showConfirmMessage(
          "export.replace.weight.confirmation"
        )
          .then(fulfilled => {
            this._buildService.fetchWeight(resp.data).subscribe(resp => {
              this.searchDLS('noSearch');
              this.showSuccessStatus("g.updated.successfully");
            });
          })
          .catch(reason => { });
      } else {
        this.showErrorMessage("export.no.ics.weight.found");
      }
    });
  }

  printDLS() {
    this.reportParameters = new Object();
    let code = this.form.getRawValue();
    const s = new SearchUpdateDLS();
    s.flightKey = this.form.get("flightKey").value;
    s.flightOriginDate = this.form.get("flightOriginDate").value;
    s.flightId = this.form.get("flightId").value;

    this._buildService.getshccode(s).subscribe(resp => {
      console.log(resp);
      if (!this.showResponseErrorMessages(resp)) {
        console.log(resp);
        for (let i = 0; i < resp.length; i++) {
          if (resp[i].name == "DLS PRIORI") {
            this.reportParameters.dlsPriority = resp[i].value;
          }
          if (resp[i].name == "DLS_TTH") {
            this.reportParameters.dlsTTH = resp[i].value;
          }
          if (resp[i].name == "DLS_TT_RMK_IMP") {
            this.reportParameters.dlsTTHRMK = resp[i].value;
          }

        }
      }
      this.reportParameters.flightkey = this.form.get("flightKey").value;
      this.reportParameters.fligtdate = this.form.get("flightOriginDate").value;
      this.reportParameters.weightCode = code.weightCode;
      this.reportParameters.login = this.getUserProfile().userShortName;
      this.reportParameters.flightID = this.form.get("flightId").value;
      this.reportWindow1.open();

    });
  }

  NFM() {
    this.sendNFMWindow.open();
  }

  onClickFlightPlanner() {
    this.navigateTo(this.router, '/export/planning-list', {});
  }

  closePopup() {
    const uld = (<NgcFormGroup>this.form.get("insertDLS")).getRawValue();
    let duplicateValueArry = [];
    if (uld.piggyBackUldList.length > 0) {
      uld.piggyBackUldList.forEach((outerElement, outerIndex) => {
        uld.piggyBackUldList.forEach((innerElement, innerIndex) => {
          if (outerElement.uldNumber == innerElement.uldNumber && outerIndex !== innerIndex) {
            duplicateValueArry.push({ value: outerElement.uldNumber, firstIndex: outerIndex, secondIndex: innerIndex });
          }
        });
      });
      if (duplicateValueArry.length > 0) {
        duplicateValueArry.forEach(element => {
          this.showErrorMessage("export.duplicate.piggyback.uld", "", [duplicateValueArry[0].value], null);
        });
        return;
      }
    }
    this.insertionULDWindow.close();
  }
  notocUldMtBtPopUp() {
    this.notocTitle = "export.notoc.uld.trolley.info";
    this.notocUldMtBt.open();
  }

  onCancel() {
    this.navigateBack(this.transferData);
  }
  onSearchChange() {
    this.resetFormMessages();
    this.showPage = false;
    (<NgcFormArray>this.form.get('ali')).resetValue([]);
    (<NgcFormArray>this.form.get('segment')).resetValue([]);
  }

  onAccessoryChange(event, index, sindex) {
    if (event.code) {
      (<NgcFormArray>this.form.get(["dls", "uldTrolleyList", index, "accessoryList", sindex, 'type'])).setValue(event.desc);
    } else {
      (<NgcFormArray>this.form.get(["dls", "uldTrolleyList", index, "accessoryList", sindex, 'type'])).setValue(event.desc);
    }
  }

  checkFormOnSave() {
    const formValue = this.form.getRawValue();
    const saveDLS: DLS = new DLS();
    saveDLS.flightId = this.form.get("flightId").value;
    saveDLS.flightOriginDate = this.form.get("flightOriginDate").value;;
    saveDLS.dlsId =
      this.form.get("dls").value !== null
        ? this.form.get("dls").get("dlsId").value
        : null;
    if (saveDLS.dlsId !== null) {
      saveDLS.flagCRUD = "U";
    } else {
      saveDLS.flagCRUD = "C";
    }
    saveDLS.osiList = formValue.dls.osiDisplayList.filter(
      ele => ele.flagCRUD === "C" || ele.flagCRUD === "D" || ele.flagCRUD === "U"
    );
    const uld = (<NgcFormGroup>this.form.get("dls")).getRawValue();
    let uldList = new Array<DLSULD>();
    let trolleyList = new Array<DLSULD>();
    let osiListManual = new Array<DLSOsi>();

    saveDLS.osiList.forEach(osi => {
      if (osi.detail) {
        osiListManual.push(osi);
      }
    });
    let i = 0;
    uld.uldTrolleyList.forEach(u => {
      if (u.uldTrolleyNumber && u.uldTrolleyNumber != "NIL" && u.uldTrolleyNumber != "") {
        if (!u.trolleyInd) {
          if (u.contentCode) {
            u.contentCode = [u.contentCode];
          }
          if (u.shcs && u.shcs !== null) {
            u.shcs.forEach(element => {
              element.flagCRUD = "C";
            });
          }
          u.flightOffPoint = this.flightOffPoint;
          u.flightKey = this.form.get("flightKey").value;
          u.flightOriginDate = this.form.get("flightOriginDate").value;
          u.manual = true;
          u.terminal = this.getUserProfile().terminalId;
          u.handlingArea = this.getUserProfile().terminalId;
          uldList.push(u);
        }
        if (u.actualWeight && u.actualWeight < u.tareWeight) {
          this.showFormControlErrorMessage(
            <NgcFormControl>this.form.get([
              "dls",
              "uldTrolleyList",
              i,
              "tareWeight"
            ]),
            "tare.weight.should.be.less.of.gross.weight"
          );
          i = 1000;
          return;
        }
      }
      i++;
    });
    if (i > 999)
      return;
    else {
      uld.trolleyList.forEach(u => {
        if (u.trolleyInd) {
          if (u.uldTrolleyNumber && u.uldTrolleyNumber != "") {
            if (u.contentCode) {
              u.contentCode = [u.contentCode];
            }
            if (u.shcs && u.shcs !== null) {
              u.shcs.forEach(element => {
                element.flagCRUD = "C";
              });
            }
            u.flightOffPoint = this.flightOffPoint;
            u.flightKey = this.form.get("flightKey").value;
            u.flightOriginDate = this.form.get("flightOriginDate").value;
            u.manual = true;
            u.terminal = this.getUserProfile().terminalId;
            u.handlingArea = this.getUserProfile().terminalId;
            trolleyList.push(u);
          }
        }
      });
      saveDLS.flightKey = this.form.get("flightKey").value;
      saveDLS.flightOriginDate = this.form.get(
        "flightOriginDate"
      ).value;
      saveDLS.flightSegmentId = this.form.get('flightSegmentId').value;
      saveDLS.flightOffPoint = this.flightOffPoint;
      saveDLS.uldTrolleyList = uldList;
      saveDLS.trolleyList = trolleyList;
      saveDLS.osiList = osiListManual;
      return saveDLS;
    }

  }
}

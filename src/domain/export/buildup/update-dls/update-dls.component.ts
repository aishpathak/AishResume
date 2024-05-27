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
  NgcReportComponent
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

@Component({
  selector: "app-update-dls",
  templateUrl: "./update-dls.component.html",
  styleUrls: ["./update-dls.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  //autoBackNavigation: true,
  restorePageOnBack: true
})
export class UpdateDlsComponent extends NgcPage implements OnInit {
  @ViewChild("insertionULDWindow") insertionULDWindow: NgcWindowComponent;
  @ViewChild("insertionTrollyWindow") insertionTrollyWindow: NgcWindowComponent;
  @ViewChild("sendNFMWindow") sendNFMWindow: NgcWindowComponent;
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  @ViewChild("reportWindow2") reportWindow2: NgcReportComponent;
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
  INSERT_ULD = "exp.assignuld.adduld";
  EDIT_ULD = "export.assign.uld.edit.uld";
  INSERT_TROLLEY = "exp.assignuld.addtrolley";
  EDIT_TROLLEY = "export.assign.uld.edit.trolley";
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
  aircraftType: String;
  flightType: String;
  sendDlsFlagDisabled: boolean = false;

  eccDropdown = ["DHL", "FED", "TNT", "ECC"];
  // showDataTable = false;
  // showPage = false;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router,
    private _buildService: BuildupService,
    private cd: ChangeDetectorRef
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private form: NgcFormGroup = new NgcFormGroup({
    flightId: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    aircraftRegistration: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    status: new NgcFormControl(),
    ali: new NgcFormArray([]),
    dlsStatus: new NgcFormControl(),
    dlsVersion: new NgcFormControl(),
    weightCode: new NgcFormControl(),
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
      systemOsiList: new NgcFormArray([]),
      osiList: new NgcFormArray([]),
      osiDisplayList: new NgcFormArray([])
    }),
    insertDLS: new NgcFormGroup({
      selectAllAccessory: new NgcFormControl(),
      selectAllpiggyback: new NgcFormControl(),
      piggyBackUldList: new NgcFormArray([]),
      accessoryList: new NgcFormArray([])
    }),
    insertTrolly: new NgcFormGroup({}),
    NFMList: new NgcFormArray([])
  });

  ngOnInit() {
    super.ngOnInit();
    this.accessaryAllSubscription();
    // this.piggyBackAllSubscription();
    this.transferData = this.getNavigateData(this.route);
    console.log(this.transferData);
    try {
      if (this.transferData !== null && this.transferData !== undefined) {
        this.form.patchValue(this.transferData);
        this.searchDLS();
      }
    } catch (e) { }
  }

  searchDLS() {
    const s = new SearchUpdateDLS();
    s.flightKey = this.form.get("flightKey").value;
    s.flightOriginDate = this.form.get("flightOriginDate").value;

    this._buildService.searchUpdateDLS(s).subscribe(resp => {
      this.refreshFormMessages(resp);
      this.searchResponse = resp.data;
      this.finalizeFlagDisabled = this.searchResponse.finalize;
      if (!this.searchResponse.finalize) {
        if (this.searchResponse.sendDlsStatus) {
          this.sendDlsFlagDisabled = true;
        } else {
          this.sendDlsFlagDisabled = false;
        }
      } else {
        this.sendDlsFlagDisabled = false;
      }
      this.notocFinalize = this.searchResponse.notocFinalizeStatus;
      this.carrierCode = this.searchResponse.carrierCode;
      this.flightType = this.searchResponse.flightType;
      this.aircraftType = this.searchResponse.aircraftType;
      // if (this.searchResponse.dls.uldTrolleyList){
      //     this.form.patchValue(this.searchResponse);
      // }
      //this.ntWeight= this.searchResponse.dls
      this.searchResponse.dls.uldTrolleyList.forEach(uld => {
        if (uld.weightDifference == 0) {
          uld.weightDifference = null;
        }
        if (uld.contentCode && uld.contentCode.length > 0) {
          uld.contentCode = uld.contentCode[0];
        }
      });
      if (this.searchResponse !== null) {
        (<NgcFormArray>this.form.get(["dls", "uldTrolleyList"])).resetValue([]);
        (<NgcFormArray>this.form.get(["dls", "systemOsiList"])).resetValue([]);
        // this.checkForOSI(this.searchResponse);

        // if (this.searchResponse.finalize === true){

        // }
        this.updateSeries(this.searchResponse);
        this.createOSILIST(this.searchResponse);
        const dupOffpointMap: any = {};
        let offPointGroupIndex = 1;
        this.searchResponse.dls.uldTrolleyList.forEach(element => {
          if (!element.uldTrolleyNumber) {
            element.uldTrolleyNumber = "NIL";
            element.remarks = "NIL";
          }
          // if (!dupOffpointMap[element.offPoint]) {
          //   dupOffpointMap[element.offPoint] = offPointGroupIndex++;
          // }
          // element.offPointGroup = dupOffpointMap[element.offPoint];
        });
        this.form.patchValue(this.searchResponse);
        this.form.controls["dlsStatus"].setValue(this.searchResponse.dlsstatus);
        this.form.controls["dlsVersion"].setValue(
          this.searchResponse.dlsversion
        );
        if (this.searchResponse.dlsstatus == null) {
          this.disabledFinalize = false;
        }

        // if (this.searchResponse.dlsstatus == "INITIATED") {
        //   this.disabledFinalize = true;
        // }
        // if (this.searchResponse.dlsstatus == "SENT") {
        //   this.dlsFinalize = false;
        //   this.disabledFinalize = false;
        // }
        if (
          this.searchResponse.dls.uldTrolleyList === null ||
          this.searchResponse.dls.uldTrolleyList.length === 0
        ) {
          this.showInfoStatus("no.record");
        }

        // this.checkNFM(this.searchResponse.segment);
        this.checkNFM(this.searchResponse);
        this.updateForm();
        this.checkSendPLD();
        this.checkNFMButton();
        this.showAccordian = true;
        this.showPage = true;
      } else {
        this.showPage = false;
      }
      console.log(this.form);
    });
  }

  finalizeDLS() {
    const flight: DLSFlight = this.form.getRawValue();
    const sendFlight: DLSFlight = new DLSFlight();
    sendFlight.flightKey = flight.flightKey;
    sendFlight.flightOriginDate = flight.flightOriginDate;
    sendFlight.flightId = flight.flightId;
    sendFlight.flightKey = flight.flightKey;
    sendFlight.uldTrolleyList = flight.dls.uldTrolleyList;
    sendFlight.finalizeStatus = this.finalizeFlagDisabled;
    sendFlight.carrierCode = this.carrierCode;
    sendFlight.flightType = this.flightType;
    sendFlight.aircraftType = this.aircraftType;

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
    this._buildService.finalizeDLS(sendFlight).subscribe(resp => {
      if (resp.messageList != null) {
        this.refreshFormMessages(resp);
      }
      else if (resp.data && resp.data.messageList && resp.data.messageList.length > 0) {
        this.refreshFormMessages(resp);
      }
      else {
        this.showSuccessStatus("export.dls.finalized.initiated");
        this.dlsFinalize = false;
        this.searchDLS();
      }
    });
  }

  UnfinalizeDLS() {
    this.dlsFinalize = true;
    this.searchDLS();
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
  globalSave(event) {
    const formValue = this.form.getRawValue();
    const saveDlsOsi = new DLS();
    saveDlsOsi.flightId = this.form.get("flightId").value;
    saveDlsOsi.dlsId =
      this.form.get("dls").value !== null
        ? this.form.get("dls").get("dlsId").value
        : null;
    // saveDlsOsi.osiList = formValue.dls.osiList;
    saveDlsOsi.osiList = formValue.dls.osiDisplayList.filter(
      ele => ele.flagCRUD === "C" || ele.flagCRUD === "D" || ele.flagCRUD === "U"
    );

    let duplicateValueArry = [];
    if (formValue.dls.osiDisplayList) {
      formValue.dls.osiDisplayList.forEach((outerElement, outerIndex) => {
        formValue.dls.osiDisplayList.forEach((innerElement, innerIndex) => {
          if (parseInt(outerElement.transactionSequenceNo) === parseInt(innerElement.transactionSequenceNo) && outerIndex !== innerIndex) {
            duplicateValueArry.push({ value: outerElement.transactionSequenceNo, firstIndex: outerIndex, secondIndex: innerIndex });
          }
        });
      });
      if (duplicateValueArry.length > 0) {
        duplicateValueArry.forEach(element => {
          this.showErrorMessage("export.check.osi.detail.duplicate.sno");
        });
        return;
      }
    }
    this._buildService.saveDLSOSI(saveDlsOsi).subscribe(resp => {
      const response = resp;
      if (response.data) {
        this.showSuccessStatus("g.operation.successful");
        this.insertionULDWindow.close();
        this.searchDLS();
      } else {
        const formValue = this.form.getRawValue();
        let i = (formValue.dls.osiDisplayList.length - formValue.dls.osiDisplayList.filter(
          ele => ele.flagCRUD === "C" || ele.flagCRUD === "D" || ele.flagCRUD === "U"
        ).length) + Number(response.messageList[0].referenceId.substring(8, 9));
        this.showFormControlErrorMessage(
          <NgcFormControl>this.form.get([
            "dls",
            "osiDisplayList",
            i,
            "detail"
          ]),
          response.messageList[0].code
        );
      }
    });
  }

  clear(event) {
    console.log("clear");
  }

  checkForOSI(data: any) {
    if (data.dls.osiList === null) {
      data.dls.osiList = new Array<DLSOsi>();
    } else {
      this.generateOSISeries(data.dls.osiList);
    }
  }

  public groupsRenderer(
    value: string | number,
    rowData: any,
    level: any
  ): string {
    return rowData.data.boardPoint + " - " + rowData.data.offPoint;
  }

  addULD() {
    if (!this.getUserProfile().terminalId) {
      this.showErrorStatus(
        "export.select.terminal"
      );
      return;
    }
    this.uldTitle = this.INSERT_ULD;
    this.sourceIdSegmentDropdown = this.createSourceParameter(
      this.form.get("flightId").value
    );
    const uld = new DLSULD();
    uld.flagCRUD = "C";
    uld.manual = true;
    uld.terminal = this.getUserProfile().terminalId;
    uld.handlingArea = this.getUserProfile().terminalId;
    uld.heightCode = "QL";
    uld.contentCode = "C";
    uld.accessoryList = new Array<DLSAccessory>();
    // const accesory = new DLSAccessory();
    // accesory.flagCRUD = 'C';
    // uld.accessoryList.push(accesory);
    uld.shcs = new Array<SHC>();
    // for (let x = 0; x < 9; x++) {
    //   const shc = new SHC();
    //   shc.flagCRUD = 'C';
    //   uld.shcs.push(shc);
    // }
    uld.piggyBackUldList = new Array<DLSPiggyBackInfo>();
    // const piggy = new DLSPiggyBackInfo();
    // piggy.flagCRUD = 'C';
    // uld.piggyBackUldList.push(piggy);
    this.showInsertWindow = true;
    this.editULDFLag = false;
    this.insertUldFlag = true;
    this.disableUldForm = false;
    this.showActualWeight = true;
    this.showIcsWeight = false;
    this.form.get("insertDLS").patchValue(uld);
    this.checkUldFormDisabled(false);
    this.form.get("insertDLS").enable();
    console.log(this.form);
    this.showManifestWeight = false;
    this.insertionULDWindow.open();
    //  this.subscriptionsInit();
    // this.addPiggyBack();
    this.accessaryAllSubscription();
    //this.piggyBackAllSubscription();
  }

  addTrolley() {
    if (!this.getUserProfile().terminalId) {
      this.showErrorStatus(
        "export.select.terminal"
      );
      return;
    }
    this.trolleyTitle = this.INSERT_TROLLEY;
    console.log();
    this.sourceIdSegmentDropdown = this.createSourceParameter(
      this.form.get("flightId").value
    );
    const uld = new DLSULD();
    this.editULDFLag = false;
    this.insertUldFlag = true;
    this.showActualWeight = true;
    this.showIcsWeight = false;
    uld.flagCRUD = "C";
    uld.contentCode = "C";
    uld.manual = true;
    uld.terminal = this.getUserProfile().terminalId;
    uld.handlingArea = this.getUserProfile().terminalId;
    uld.shcs = new Array<SHC>();
    uld.actualWeight = 0;
    // for (let x = 0; x < 9; x++) {
    //   const shc: SHC = new SHC();
    //   shc.flagCRUD = 'C';
    //   uld.shcs.push(shc);
    // }

    this.showInsertTrollyWindow = true;
    this.form.get("insertTrolly").patchValue(uld);
    console.log(this.form);
    this.insertionTrollyWindow.open();
  }

  saveULD() {
    const saveDLS: DLS = new DLS();
    saveDLS.flightId = this.form.get("flightId").value;
    saveDLS.dlsId =
      this.form.get("dls").value !== null
        ? this.form.get("dls").get("dlsId").value
        : null;
    if (saveDLS.dlsId !== null) {
      saveDLS.flagCRUD = "U";
    } else {
      saveDLS.flagCRUD = "C";
    }
    const uld = (<NgcFormGroup>this.form.get("insertDLS")).getRawValue();
    const uldList = new Array<DLSULD>();
    uldList.push(uld);
    saveDLS.uldTrolleyList = uldList;
    uld.trolleyInd = false;
    saveDLS.uldTrolleyList[0].flightKey = this.form.get("flightKey").value;
    saveDLS.uldTrolleyList[0].flightOriginDate = this.form.get(
      "flightOriginDate"
    ).value;
    if (saveDLS.uldTrolleyList[0].actualWeight) {
      if (saveDLS.uldTrolleyList[0].actualWeight < saveDLS.uldTrolleyList[0].tareWeight) {
        this.showErrorStatus(
          "tare.weight.should.be.less.of.gross.weight"
        );
        return;
      }
    }
    console.log(JSON.stringify(saveDLS));
    this._buildService.saveUld(saveDLS).subscribe(resp => {
      const response = resp;
      if (this.showResponseErrorMessages(response)) {
        response.messageList.forEach(message => {
          if (message.referenceId) {
            // TODO! - Need to Fix in Service
            message.referenceId = message.referenceId
              .replace(/\]/g, "")
              .replace(/\[/g, ".");
            message.referenceId = message.referenceId.replace(
              "uldTrolleyList.0",
              "insertDLS"
            );
            console.log(message.referenceId);
          }
        });
      } else {
        this.showSuccessStatus("g.operation.successful");
        this.insertionULDWindow.close();
        this.searchDLS();
      }
      console.log(resp.data);
    });
  }

  saveTrolly() {
    const saveDLS: DLS = new DLS();
    saveDLS.flightId = this.form.get("flightId").value;
    saveDLS.dlsId =
      this.form.get("dls").value !== null
        ? this.form.get("dls").get("dlsId").value
        : null;
    if (saveDLS.dlsId !== null) {
      saveDLS.flagCRUD = "U";
    } else {
      saveDLS.flagCRUD = "C";
    }
    const uld = (<NgcFormGroup>this.form.get("insertTrolly")).getRawValue();
    const uldList = new Array<DLSULD>();
    uld.trolleyInd = true;
    uldList.push(uld);
    saveDLS.uldTrolleyList = uldList;
    saveDLS.uldTrolleyList[0].flightKey = this.form.get("flightKey").value;
    saveDLS.uldTrolleyList[0].flightOriginDate = this.form.get(
      "flightOriginDate"
    ).value;
    this._buildService.saveTrolly(saveDLS).subscribe(resp => {
      const response = resp;
      console.log(resp.data);
      if (this.showResponseErrorMessages(response)) {
        response.messageList.forEach(message => {
          if (message.referenceId) {
            // TODO! - Need to Fix in Service
            message.referenceId = message.referenceId
              .replace(/\]/g, "")
              .replace(/\[/g, "");
            message.referenceId = message.referenceId.replace(
              "uldTrolleyList0",
              "insertTrolly"
            );
            console.log(message.referenceId);
          }
        });
      } else {
        this.showSuccessStatus("g.completed.successfully");
        this.insertionTrollyWindow.close();
        this.searchDLS();
      }
    });
  }

  fetchWeight() {
    const flight: DLSFlight = this.form.getRawValue();
    const sendFlight: DLSFlight = new DLSFlight();
    sendFlight.flightId = flight.flightId;
    sendFlight.flightKey = flight.flightKey;
    sendFlight.flightOriginDate = flight.flightOriginDate;
    sendFlight.uldTrolleyList = flight.dls.uldTrolleyList;
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
              this.searchDLS();
              this.showSuccessStatus("g.updated.successfully");
            });
          })
          .catch(reason => { });
      } else {
        this.showErrorMessage("export.no.ics.weight.found");
      }
    });
  }

  addPiggyBack() {
    const piggy = new DLSPiggyBackInfo();
    piggy.flagCRUD = "C";
    piggy.serialNumber =
      (<NgcFormArray>this.form.get(["insertDLS", "piggyBackUldList"])).length +
      1;
    (<NgcFormArray>this.form.get(["insertDLS", "piggyBackUldList"])).addValue([
      piggy
    ]);
  }

  addAccessory() {
    const accesory = new DLSAccessory();
    accesory.flagCRUD = "C";
    (<NgcFormArray>this.form.get("insertDLS").get("accessoryList")).addValue([
      accesory
    ]);
  }

  editULD(event) {
    this.onlyEditUld = false;
    this.sourceIdSegmentDropdown = this.createSourceParameter(
      this.form.get("flightId").value
    );
    const editRow = (<NgcFormGroup>this.form.get([
      "dls",
      "uldTrolleyList",
      event.record.NGC_ROW_ID
    ])).getRawValue();
    if (
      !editRow.manual &&
      (editRow.estimatedWeight || editRow.estimatedWeight === null)
    ) {
      editRow["estimatedWeight"] = 0.0;
    }
    this.updateCRUDFlag(editRow);
    // this.createOnEditShc(editRow);
    this.showManifestWeight = true;

    if (editRow.icsULD) {
      this.showActualWeight = false;
      this.showIcsWeight = true;
    } else {
      this.showActualWeight = true;
      this.showIcsWeight = false;
    }

    if (editRow.trolleyInd) {
      this.trolleyTitle = this.EDIT_TROLLEY;
      this.showInsertTrollyWindow = true;
      this.form.get("insertTrolly").patchValue(editRow);
      this.insertionTrollyWindow.open();
    } else {
      this.uldTitle = this.EDIT_ULD;
      this.showInsertWindow = true;
      this.form.get("insertDLS").patchValue(editRow);
      this.insertionULDWindow.open();
      this.accessaryAllSubscription();
      //this.piggyBackAllSubscription();
    }
    if (editRow.palletTypeFlag == "P") {
      this.piggyBackFlag = true;
    }
    if (editRow.palletTypeFlag == "C") {
      this.piggyBackFlag = false;
    }

    this.disableUldForm = !editRow.manual;
    this.checkUldFormDisabled(this.disableUldForm);
    this.editULDFLag = true;
    this.insertUldFlag = false;
    this.onlyEditUld = true;
    this.cd.detectChanges();
  }

  checkUldFormDisabled(isDisabled: boolean) {
    if (true) {
      return;
    }
  }

  editTrolley(segmentIndex, event) {
    console.log(segmentIndex, event);
    this.segmentDetail = event.record;
    this.editULDFLag = true;
    this.insertUldFlag = false;
    const editRow = (<NgcFormGroup>this.form.get([
      "segment",
      segmentIndex,
      "trollyList",
      event.record.NGC_ROW_ID
    ])).getRawValue();
    console.log(editRow);
    this.updateCRUDFlag(editRow);
    // this.createOnEditShc(editRow);
    this.showInsertTrollyWindow = true;
    this.form.get("insertTrolly").patchValue(editRow);
    this.cd.detectChanges();
    this.insertionTrollyWindow.open();
  }

  // createOnEditShc(editRow) {
  //   for (let shcIndex = editRow.shcs.length; shcIndex < 9; shcIndex++) {
  //     const shc = new SHC();
  //     shc.flagCRUD = 'C';
  //     editRow.shcs.push(shc);
  //   }
  // }

  updateCRUDFlag(editRow) {
    editRow.flagCRUD = "U";
    if (editRow.accessoryList && editRow.accessoryList !== null) {
      editRow.accessoryList.forEach(element => {
        element.flagCRUD = "U";
      });
    }
    let count = 1;
    if (editRow.piggyBackUldList && editRow.piggyBackUldList !== null) {
      editRow.piggyBackUldList.forEach(element => {
        element.flagCRUD = "R";
        element["serialNumber"] = count;
        count++;
      });
    }
    if (editRow.shcs && editRow.shcs !== null) {
      editRow.shcs.forEach(element => {
        element.flagCRUD = "C";
      });
    }
  }

  addOsi() {
    const s = new DLSOsi();
    const length = (<NgcFormArray>this.form.get(["dls", "osiList"])).length;
    s.transactionSequenceNo = 10 * (length + 1);
    s.rampIndicate = true;
    (<NgcFormArray>this.form.get(["dls", "osiDisplayList"])).addValue([s]);
    (<NgcFormArray>this.form.get(["dls", "osiList"])).addValue([s]);
  }

  generateOSISeries(arr: [any]) {
    let count = 10;
    // arr.forEach(osi => {
    //   osi["series"] = count;
    //   count = count + 10;
    //   osi["flagCRUD"] = "U";
    // });
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

    // segment.forEach(seg => {
    //   seg.uldList.forEach(uld => {
    //     if (uld.uldTrolleyNumber.search('BA') !== -1) {
    //       if (uld.routeList === null) {
    //         uld.routeList = new Array<DLSNFMRoute>();
    //       }
    //       uld['serialNumber'] = serial;
    //       this.NFMList.push(uld);
    //       serial++;
    //     }
    //   });
    // });
    if (this.NFMList.length > 0) {
      this.form.get("NFMList").patchValue(this.NFMList);
      this.nfmFlag = true;
    }
  }
  sendDLS() {
    const flight: DLSFlight = this.form.getRawValue();
    const sendFlight: DLSFlight = new DLSFlight();
    sendFlight.flightId = flight.flightId;
    sendFlight.uldTrolleyList = flight.dls.uldTrolleyList;
    sendFlight.finalizeStatus = this.finalizeFlagDisabled;
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
  sendPLDEmail() { }
  NFM() {
    this.sendNFMWindow.open();
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

  addRoute(index: number) {
    (<NgcFormArray>this.form.get(["NFMList", index, "routeList"])).addValue([
      new DLSNFMRoute()
    ]);
  }

  sendNFM() {
    this.nfmFlagNew = true;
    const saveDLS: DLS = new DLS();
    saveDLS.flightId = this.form.get("flightId").value;
    saveDLS.dlsId = this.form.get("dls").get("dlsId").value;
    saveDLS.uldTrolleyList = (<NgcFormArray>this.form.get(
      "NFMList"
    )).getRawValue();
    saveDLS.uldTrolleyList.forEach(uld => {
      if (
        !uld.bupUnitType ||
        !uld.tagUnitType ||
        !uld.handlingCode ||
        !uld.overhangingInd
      ) {
        this.showErrorMessage("g.fill.all.details");
        this.nfmFlagNew = false;
      }
    });
    if (this.nfmFlagNew) {
      this._buildService.saveDLSNFM(saveDLS).subscribe(resp => {
        if (resp.data !== null) {
          this.showSuccessStatus("g.completed.successfully");
          this.sendNFMWindow.close();
        }
      });
    }
  }
  deleteUld() {
    const saveDLS: DLS = new DLS();
    saveDLS.flightId = this.form.get("flightId").value;
    saveDLS.dlsId = this.form.get("dls").get("dlsId").value;
    saveDLS.flagCRUD = "D";
    if (this.checkForDelete()) {
      return;
    }
    let editRow: NgcFormArray = null;
    editRow = <NgcFormArray>this.form.get(["dls", "uldTrolleyList"]);
    saveDLS.uldTrolleyList = this.getDeleteList(editRow).getRawValue();
    saveDLS.uldTrolleyList.forEach(uld => {
      if (uld.contentCode && uld.contentCode.length > 0) {
        uld.contentCode = [uld.contentCode];
        uld.flightKey = this.form.get("flightKey").value;
        uld.flightOriginDate = this.form.get("flightOriginDate").value;
      }
    });
    this._buildService.deleteUldTrolly(saveDLS).subscribe(resp => {
      const response = resp;
      console.log(resp.data);
      this.refreshFormMessages(response);
      if (response.data) {
        this.showSuccessStatus("g.completed.successfully");
        this.searchDLS();
      }
    });
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
    if (count === 0) {
      this.showErrorMessage("export.select.uld.trolley.to.delete");
      return true;
    }
    return false;
  }
  deleteTrolley(segmentIndex, type) {
    const saveDLS: DLS = new DLS();
    saveDLS.flightId = this.form.get("flightId").value;
    saveDLS.dlsId = this.form.get("dls").get("dlsId").value;
    saveDLS.flagCRUD = "D";
    const editRow: NgcFormArray = <NgcFormArray>this.form.get([
      "segment",
      segmentIndex,
      "trollyList"
    ]);
    saveDLS.uldTrolleyList = this.getDeleteList(editRow).getRawValue();
    this._buildService.deleteUldTrolly(saveDLS).subscribe(resp => {
      const response = resp;
      console.log(resp.data);
      this.refreshFormMessages(response);
      if (response.data) {
        this.showSuccessStatus("g.completed.successfully");
        this.searchDLS();
      }
    });
  }

  getDeleteList(list: NgcFormArray): NgcFormArray {
    list.controls.forEach((uldtrolley: NgcFormGroup) => {
      if (uldtrolley.get("select").value) {
        uldtrolley.markAsDeleted();
        // returnList.addValue([uldtrolley]);
      }
    });
    return list;
  }

  deleteULD() {
    const saveDLS: DLS = new DLS();
    saveDLS.flightId = this.form.get("flightId").value;
    saveDLS.dlsId = this.form.get("dls").get("dlsId").value;
    saveDLS.flagCRUD = "U";
    const uld = new DLSULD();
    const deleteAccesoryArray = new Array<number>();
    const deletePiggyArray = new Array<number>();
    let accesoryCount = 0;
    let piggyCount = 0;
    (<NgcFormArray>this.form.get([
      "insertDLS",
      "accessoryList"
    ])).controls.forEach((accesory: NgcFormGroup) => {
      if (accesory.get("select").value) {
        if (accesory.get("flagCRUD").value === "C") {
          deleteAccesoryArray.push(accesoryCount);
        }
        accesory.markAsDeleted();
      }
      accesoryCount++;
    });
    (<NgcFormArray>this.form.get([
      "insertDLS",
      "piggyBackUldList"
    ])).controls.forEach((piggy: NgcFormGroup) => {
      if (piggy.get("select").value) {
        if (piggy.get("flagCRUD").value === "C") {
          deletePiggyArray.push(piggyCount);
        }
        piggy.markAsDeleted();
      }
      piggyCount++;
    });

    deleteAccesoryArray.forEach(acc => {
      (<NgcFormArray>this.form.get([
        "insertDLS",
        "accessoryList"
      ])).markAsDeletedAt(acc);
    });
    deletePiggyArray.forEach(piggy => {
      (<NgcFormArray>this.form.get([
        "insertDLS",
        "piggyBackUldList"
      ])).markAsDeletedAt(piggy);
    });
  }

  subscriptionsInit() {
    this.form
      .get(["insertDLS", "uldTrolleyNumber"])
      .valueChanges.subscribe(data => {
        if (!data) {
          return;
        }
        if (data.length > 11) {
          this.showErrorStatus("export.uld.max.length");
          return;
        }
        const getTare = new DLSULD();
        getTare.uldTrolleyNumber = data;
        // console.log(this.individualULDform.getRawValue());

        // console.log(uldNoRequest);

        this._buildService.getTareWeightULD(getTare).subscribe(resp => {
          this.tareResponse = resp;
          // console.log(this.form.get(['insertDLS', 'uldTrolleyNumber', 'tareWeight']).value);

          this.form
            .get(["insertDLS", "tareWeight"])
            .setValue(this.tareResponse.data.tareWeight);

          // console.log(this.response);
        });
      });
    // this.changePiggybackSubscription();
  }

  // changePiggybackSubscription() {
  //   this.form.get(['insertDLS', 'piggyback']).valueChanges.subscribe((data) => {
  //     if (data) {
  //       if ((<NgcFormArray>this.form.get(['insertDLS', 'piggyBackUldList'])).length === 0) {
  //         this.addPiggyBack();
  //       }
  //     } else {
  //       this.form.get(['insertDLS', 'piggyBackUldList']).patchValue([]);
  //     }
  //   });
  // }
  updateForm() {
    if (
      this.form.get("dls") &&
      this.form.get("dls").value !== null &&
      this.form.get(["dls", "uldTrolleyList"])
    ) {
      (<NgcFormArray>this.form.get([
        "dls",
        "uldTrolleyList"
      ])).controls.forEach((uld: NgcFormGroup) => {
        if (uld.get("checkBox").value) {
          // (<NgcFormControl>uld.get("uldTrolleyNumber")).setValue(uld.get("uldTrolleyNumber").value + "(L)");
        }
        if (!uld.get("manual").value) {
          // (<NgcFormControl>uld.get("select")).disable();
          if (uld.get("trolleyInd").value) {
            uld.addControl("Edit", new NgcFormControl());
          }
        }
      });
    }
  }

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
  checkBox(event) { }
  accessaryAllSubscription() {
    console.log("hello");
    (<NgcFormGroup>this.form.controls
      .insertDLS).controls.selectAllAccessory.valueChanges.subscribe(saa => {
        (<NgcFormArray>this.form.get([
          "insertDLS",
          "accessoryList"
        ])).controls.forEach((access: NgcFormGroup) => {
          access.get("select").patchValue(saa);
        });
      });
  }
  piggyBackAllSubscription() {
    console.log("hello");
    (<NgcFormGroup>this.form.controls
      .insertDLS).controls.selectAllpiggyback.valueChanges.subscribe(saa => {
        (<NgcFormArray>this.form.get([
          "insertDLS",
          "piggyBackUldList"
        ])).controls.forEach((piggy: NgcFormGroup) => {
          piggy.get("select").patchValue(saa);
        });
      });
  }

  public trolleyCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    console.log(typeof value);
    // console.log(cellsStyle.data);
    if (value === false || value === "false") {
      cellsStyle.data = " ";
    }
    return cellsStyle;
  };

  public actualWeight = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    console.log(rowData);
    if (
      rowData.usedAsTrolley === true ||
      rowData.trolleyInd === true ||
      rowData.usedAsTrolley === "true" ||
      rowData.trolleyInd === "true"
    ) {
      cellsStyle.data = " ";
    }
    return cellsStyle;
  };
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
  deleteAccesory(index) {
    const accesory: NgcFormGroup = <NgcFormGroup>this.form.get([
      "insertDLS",
      "accessoryList",
      index
    ]);
    if (accesory.get("flagCRUD").value === "C") {
      (<NgcFormArray>this.form.get([
        "insertDLS",
        "accessoryList"
      ])).markAsDeletedAt(index);
    } else {
      (<NgcFormGroup>this.form.get([
        "insertDLS",
        "accessoryList",
        index
      ])).markAsDeleted();
    }
  }
  createOSILIST(response) {
    const osiDisplayList = new Array<any>();
    if (
      response.dls &&
      response.dls.systemOsiList &&
      response.dls.systemOsiList !== null &&
      response.dls.systemOsiList.length > 0
    ) {
      response.dls.systemOsiList.forEach(element => {
        element["series"] = "";
        osiDisplayList.push(element);
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
        element.createdOn = NgcUtility.toDateFromLocalDate(element.createdOn);
        osiDisplayList.push(element);
      });
    }
    response.dls["osiDisplayList"] = osiDisplayList;
    // this.form.get(['dls', 'osiDisplayList']).patchValue(osiDisplayList);
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

  public FlightDateCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    console.log(typeof value);
    console.log(rowData);
    // console.log(cellsStyle.data);
    if (value !== "") {
      cellsStyle.data =
        value + " / " + NgcUtility.getDateAsString(rowData.flightOriginDate);
    }
    return cellsStyle;
  };

  dlsShortcut() {
    const s = new SearchUpdateDLS();
    s.flightKey = this.form.get("flightKey").value;
    s.flightOriginDate = this.form.get("flightOriginDate").value;
    this.navigateTo(this.router, "/export/buildup/display-dls-variance", s);
  }

  getUldTrolleyNumber(eventUld) {
    //Clear the message
    this.resetFormMessages();

    if (eventUld != '') {
      const PiggyBack = new DLSULD();
      PiggyBack.uldTrolleyNumber = eventUld;
      PiggyBack.flightKey = this.form.get("flightKey").value;
      PiggyBack.flightOriginDate = this.form.get("flightOriginDate").value;
      PiggyBack.heightCode = this.form.get(["insertDLS", "heightCode"]).value;

      //Populate the segment
      this.sourceIdSegmentDropdown = this.createSourceParameter(
        this.form.get("flightId").value
      );

      this.retrieveDropDownListRecords('FLIGHTSEGMENT_DLS', 'query', this.sourceIdSegmentDropdown)
        .subscribe(data => {
          for (let index = 0; index < data.length; index++) {
            if (data[index].code == this.form.get(["insertDLS", "flightSegmentId"]).value) {
              PiggyBack.flightOffPoint = data[index].desc;
              break;
            }
          }

          if (this.onlyEditUld) {
            this._buildService.getPiggyBackFlag(PiggyBack).subscribe(res => {
              this.piggyResponse = res.data;
              if (this.piggyResponse && this.piggyResponse.flightMatchesWithICS == false) {
                this.showWarningStatus('export.flight.details.not.matching.ics.confirmation');
              }

              if (this.piggyResponse.calculatedTareWeight != null && this.piggyResponse.calculatedTareWeight != 0) {
                this.form.get(["insertDLS", "tareWeight"]).setValue(this.piggyResponse.calculatedTareWeight)
              }
              if (this.piggyResponse.piggyBackFlag == "P") {
                this.piggyBackFlag = true;
              }
              if (this.piggyResponse.piggyBackFlag == "C") {
                this.piggyBackFlag = false;
              }
              if (this.piggyResponse.plasticSheetQuantityCount != null && this.form.get(["insertDLS", "accessoryList"]).value.length < 1) {
                this.addAccessory();
                this.form
                  .get(["insertDLS", "accessoryList", 0, 'quantity']).setValue(this.piggyResponse.plasticSheetQuantityCount);
              }
            });
          }
        });
    }
  }

  addContouCodeWeight(eventCode) {
    const PiggyBack = new DLSULD();
    PiggyBack.heightCode = eventCode;
    PiggyBack.flightKey = this.form.get("flightKey").value;
    PiggyBack.uldTrolleyNumber = this.form.get([
      "insertDLS",
      "uldTrolleyNumber"
    ]).value;
    if (this.onlyEditUld) {
      this._buildService.getPiggyBackFlag(PiggyBack).subscribe(res => {
        this.piggyResponse = res.data;
        if (this.piggyResponse.calculatedTareWeight != null) {
          this.form
            .get(["insertDLS", "tareWeight"])
            .setValue(this.piggyResponse.calculatedTareWeight);
        }
        if (this.piggyResponse.plasticSheetQuantityCount != null) {
          this.form
            .get(["insertDLS", "accessoryList", 0, 'quantity']).setValue(this.piggyResponse.plasticSheetQuantityCount);
        }
      });
    }
  }

  addUldPalletWeight(eventPallet, index) {
    let totalWeight: number = 0;
    const PiggyBack = new DLSULD();
    PiggyBack.uldTrolleyNumber = eventPallet;
    PiggyBack.heightCode = this.form.get(["insertDLS", "heightCode"]).value;
    PiggyBack.flightKey = this.form.get("flightKey").value;
    totalWeight = this.form.get(["insertDLS", "tareWeight"]).value;
    if (this.onlyEditUld) {
      this._buildService.getPiggyBackFlag(PiggyBack).subscribe(res => {
        this.piggyResponse = res.data;
        totalWeight = totalWeight + this.piggyResponse.calculatedTareWeight;
        this.form
          .get("insertDLS")
          .get("tareWeight")
          .patchValue(totalWeight);
      });
    }
  }

  subtractUldPalletWeight(ind) {
    let totalWeight: number = 0;
    const PiggyBack = new DLSULD();
    PiggyBack.flightKey = this.form.get("flightKey").value;
    PiggyBack.uldTrolleyNumber = this.form.getRawValue().insertDLS.piggyBackUldList[
      ind
    ].uldNumber;

    PiggyBack.heightCode = this.form.getRawValue().insertDLS.heightCode
      ? this.form.getRawValue().insertDLS.heightCode
      : null;
    totalWeight = this.form.get(["insertDLS", "tareWeight"]).value;

    this._buildService.getPiggyBackFlag(PiggyBack).subscribe(res => {
      this.piggyResponse = res.data;
      totalWeight = totalWeight - this.piggyResponse.calculatedTareWeight;
      this.form
        .get("insertDLS")
        .get("tareWeight")
        .patchValue(totalWeight);
    });
  }
  onClickFlightPlanner() {
    this.navigateTo(this.router, '/export/planning-list', {});
  }

  //Navigate to EDI Message Page
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
  onCancel() {
    this.navigateBack(this.transferData);
  }

  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  checkEmptyUld(weight) {
    if (this.form.get(["insertDLS", "tareWeight"]).value && this.form.get(["insertDLS", "accessoryList"]).value.length > 0) {
      if (this.form.get(["insertDLS", "tareWeight"]).value == weight) {
        this.form.get(["insertDLS", "accessoryList"]).patchValue(new Array());
      }
    }
  }


  checkEmptyUldContentcode(contentcode) {
    if (contentcode != null && (contentcode == "X" || contentcode == "N")) {
      this.form.get(["insertDLS", "accessoryList"]).patchValue(new Array());
    }
  }

}

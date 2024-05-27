import { forEach } from '@angular/router/src/utils/collection';
import { AssignULDSearch } from "./../../export.sharedmodel";
import { DLSULD } from "./../buildup.sharedmodel";
import { BuildupService } from "./../buildup.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Component,
  OnInit,
  ViewChild,
  NgZone,
  ElementRef,
  ViewContainerRef
} from "@angular/core";
import {
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcWindowComponent,
  NgcPage,
  CellsRendererStyle,
  PageConfiguration,
  NgcUtility
} from "ngc-framework";
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@Component({
  templateUrl: "./assign-uld-flight.component.html",
  styleUrls: ["./assign-uld-flight.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AssignUldFlightComponent extends NgcPage {
  private piggyBackULD = {
    selectULD: false,
    uldTrolleyNo: "",
    flagCRUD: "C"
  };
  hashMap = {};
  trolleyPopUpTitle;
  disableULDTrolley = false;
  ULDPopUpTitle;
  aircraftHeightCode;
  selectedULDIndex = 0;
  aliList;
  transferData: any;
  finalizeFlagDisabled: boolean = false;
  piggyResponse: any;
  flightIdInRes: any;
  flightOffPoint: any;
  isactiveByDefault: boolean = false;
  isactiveByUld: boolean = false;
  isactiveByHeight: boolean = false;
  isactiveByAllotment: boolean = false;
  @ViewChild("window") window: NgcWindowComponent;
  @ViewChild("windowTrolley") windowTrolley: NgcWindowComponent;
  @ViewChild("windowPiggyBack") windowPiggyBack: NgcWindowComponent;
  @ViewChild('windowPrinter') windowPrinter: NgcWindowComponent;
  private sectorId: any = '';
  private form = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    segmentId: new NgcFormControl(),
    flightOriginDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    routingInfo: new NgcFormControl(),
    status: new NgcFormControl(),
    aliTotal: new NgcFormControl(),
    aliRemain: new NgcFormControl(),
    assignedULDList: new NgcFormArray([]),
    airlineLoadingInstructions: new NgcFormArray([]),
    aircraftRemarks: new NgcFormControl(),
    flightRemarks: new NgcFormControl(),
    uldtypeali: new NgcFormArray([
      new NgcFormGroup({
        uldType: new NgcFormControl([]),
        totalUldType: new NgcFormControl([]),
        uldTypeUsed: new NgcFormControl([]),
        remainingUldType: new NgcFormControl([])
      })
    ]),
    heighttypeali: new NgcFormArray([
      new NgcFormGroup({
        heightCode: new NgcFormControl([]),
        totalHeightType: new NgcFormControl([]),
        heightTypeUsed: new NgcFormControl([]),
        remainingHeightType: new NgcFormControl([])
      })
    ]),
    allotmenttypeali: new NgcFormArray([
      new NgcFormGroup({
        allotmentType: new NgcFormControl([]),
        totalAllotment: new NgcFormControl([]),
        usedAllotment: new NgcFormControl([]),
        remainingAllotmentType: new NgcFormControl([])
      })
    ]),
  });

  private individualULDform1 = new NgcFormGroup({
    assignedULDPiggyBackList: new NgcFormArray([])
  });

  popupPrinterForm: NgcFormGroup = new NgcFormGroup({
    printerdropdown: new NgcFormControl(),
  });

  private individualULDform = new NgcFormGroup({
    uldTrolleyNo: new NgcFormControl(),
    tareWeight: new NgcFormControl(),
    seriesTareWeight: new NgcFormControl(),
    contentCode: new NgcFormControl(),
    segmentId: new NgcFormControl(),
    offPoint: new NgcFormControl(),
    assUldTrolleyId: new NgcFormControl(),
    heightCode: new NgcFormControl(),
    handlingArea: new NgcFormControl(),
    phcFlag: new NgcFormControl(false),
    eccFlag: new NgcFormControl(),
    noOfPiggyback: new NgcFormControl(),
    trolleyFlag: new NgcFormControl(false),
    trolleyInd: new NgcFormControl(false),
    standByFlag: new NgcFormControl(false),
    priority: new NgcFormControl(),
    remarks: new NgcFormControl(),
    reprintTag: new NgcFormControl(false),
    assignedULDPiggyBackList: new NgcFormArray([])
  });

  private eachUldRow = {
    uldTrolleyNo: "",
    isValidSegment: true,
    actualGrossWeight: "",
    tareWeight: "",
    seriesTareWeight: "",
    contentCode: "C",
    segmentId: "",
    offPoint: "",
    assUldTrolleyId: "",
    heightCode: "QL",
    handlingArea: "T3",
    terminal: this.getUserProfile().terminalId,
    phcFlag: "",
    eccFlag: null,
    noOfPiggyback: "",
    eic: "",
    empty: "",
    actualLocation: "",
    wareHouseLocation: "",
    reprintTag: "",
    trolleyFlag: "",
    trolleyInd: false,
    standByFlag: "",
    priority: "",
    remarks: "",
    assignedULDPiggyBackList: [],
    selectULD: false,
    uldForContourCode: "",
    palletTypeFlag: 'P',
    transferType: ""
  };
  private eachTrolleyRow = {
    uldTrolleyNo: "",
    actualGrossWeight: "",
    tareWeight: "",
    seriesTareWeight: "",
    netWeight: "",
    contentCode: "C",
    segmentId: "",
    offPoint: "",
    assUldTrolleyId: "",
    heightCode: "",
    handlingArea: this.getUserProfile().terminalId,
    terminal: this.getUserProfile().terminalId,
    phcFlag: "",
    eccFlag: "",
    noOfPiggyback: "",
    trolleyFlag: "",
    trolleyInd: true,
    standByFlag: "",
    priority: "",
    remarks: "",
    reprintTag: "",
    assignedULDPiggyBackList: [],
    selectULD: false,
    palletTypeFlag: '',
    eic: "",
    empty: "",
    actualLocation: "",
    wareHouseLocation: ""
  };
  response;
  displayInformation = false;
  addPopUpOpen = false;
  addEditUldFlag = false;
  editUldTrolleyFlag = false;
  disableTareWeightEntry = false;
  currentSelectedIndex;
  flightIdforDropdown;
  subscriptions = [];
  uldForContourCode;
  responseForInfoWarn: any;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private buildUpService: BuildupService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.transferData = this.getNavigateData(this.activatedRoute);
    this.subscriptionsInit();
    if (this.transferData) {
      this.form.patchValue(this.transferData);
      if (this.transferData.flightNo && this.transferData.flightDate) {
        this.form.get('flightKey').setValue(this.transferData.flightNo);
        this.form.get("flightOriginDate").setValue(this.transferData.flightDate);
      }
      this.onSearch(null);
    }
  }

  onDLSRoute() {
    this.navigateTo(
      this.router,
      "/export/buildup/update-dls",
      this.form.getRawValue()
    );
  }
  // Event callbacks bound to the main UI starts
  onSearch(redirect) {
    this.sectorId = 0;
    console.log("date", this.form.get("flightOriginDate"));
    if (
      !this.form.get("flightOriginDate").value ||
      !this.form.get("flightKey").value
    ) {
      this.showErrorStatus("export.enter.flight.and.date");
      return;
    }
    this.initializeValues();
    const searchRequest: any = this.formSearchRequest();
    this.buildUpService.searchULDList(searchRequest).subscribe(resp => {
      this.response = resp;
      if (this.response.data != null) {
        this.finalizeFlagDisabled = this.response.data.finalize;
        this.flightIdInRes = this.response.data.flightId;
      }
      if (this.response.data != null && this.response.data.manifestCheck && !this.response.data.finalize) {
        this.showErrorMessage('error.manifest.control.in.on');
        this.finalizeFlagDisabled = this.response.data.manifestCheck;
      } else {
        this.refreshFormMessages(this.response);
      }
      if (!this.response.data) {
        return;
      }
      const toPatchValue = this.transformFlightULDModelBackToFront(
        this.response.data
      );
      this.aliList = this.response.data.airlineLoadingInstructions;
      if (this.response.data.activeTab != null) {
        this.isactiveByUld = this.response.data.activeTab.activeByULD;
        this.isactiveByDefault = this.response.data.activeTab.activeByDefault;
        this.isactiveByHeight = this.response.data.activeTab.activeByHeight;
        this.isactiveByAllotment = this.response.data.activeTab.activeByAllotment;
        this.form.get('uldtypeali').patchValue(this.response.data.activeTab.uldTypeAliAssignUld);
        this.form.get('heighttypeali').patchValue(this.response.data.activeTab.heightTypeAliAssignUld);
        this.form.get('allotmenttypeali').patchValue(this.response.data.activeTab.allotmentTypeAliAssignUld);
        console.log(this.form.get('uldtypeali'));
      } else {
        this.isactiveByDefault = true;
      }
      //set for each uld sourceparameter
      for (const uld of toPatchValue.assignedULDList) {
        uld.uldForContourCode = this.createSourceParameter(uld.uldTrolleyNo);
      }
      toPatchValue.airlineLoadingInstructions = this.response.data.airlineLoadingInstructions;
      this.form.patchValue(toPatchValue);
      if (
        this.form.get("assignedULDList") &&
        this.form.get("assignedULDList").value !== null
      ) {
        (<NgcFormArray>this.form.get([
          "assignedULDList"
        ])).controls.forEach((uld: NgcFormGroup) => {
          if (uld.get("selectULD").value) {
            uld.get("selectULD").setValue(false);
            uld.disable();
          }
        });
      }
      if (this.response.data && !redirect) {
      }
      this.aircraftHeightCode = null;
      if (this.response.data.aircraftBodyType === "W") {
        this.aircraftHeightCode = "QL";
      }
      this.flightIdforDropdown = this.createSourceParameter(
        this.form.get("flightKey").value,
        this.form.get("flightOriginDate").value
      );
      this.displayInformation = true;
    });
  }

  onCancel() {
    this.navigateBack(this.transferData);
  }

  onDeleteULD() {
    const mainForm = this.form.getRawValue();
    const DeleteRequest = this.transformFlightULDModelFrontToBack(
      mainForm,
      false
    );
    this.buildUpService.deleteULDList(DeleteRequest).subscribe(resp => {
      this.response = resp;
      if (this.response.data) {
        let index = 0;
        for (const ULD of mainForm.assignedULDList) {
          if (ULD.selectULD) {
            (<NgcFormArray>this.form.get("assignedULDList")).deleteValueAt(
              index
            );
            --index;
          }
          ++index;
        }
        this.showSuccessStatus("g.completed.successfully");
      } else {
        this.refreshFormMessages(this.response);
      }
    });
  }

  onAddULD(type) {
    this.editUldTrolleyFlag = false;
    this.disableTareWeightEntry = false;
    (<NgcFormArray>this.individualULDform.get(
      "assignedULDPiggyBackList"
    )).resetValue([]);
    this.individualULDform.reset();
    this.individualULDform.get("remarks").setValue("");
    this.individualULDform.get("contentCode").setValue("C");
    if (this.aircraftHeightCode) {
      this.individualULDform.get("heightCode").setValue("QL");
    }
    this.setFlagValuesToFalse();
    this.addPopUpOpen = true;
    if (type === "uld") {
      this.addEditUldFlag = true;
      this.ULDPopUpTitle = "exp.assignuld.adduld";
      this.window.open();
      this.subscribetoEvents();
    } else {
      this.addEditUldFlag = false;
      this.individualULDform.get("trolleyInd").setValue(true);
      this.trolleyPopUpTitle = "exp.assignuld.addtrolley";
      this.windowTrolley.open();
      this.subscribetoEvents();
    }
  }

  onLinkClick(event) {
    this.editUldTrolleyFlag = true;
    // console.log(JSON.stringify(event));
    this.currentSelectedIndex = Number(event.record.NGC_ROW_ID);
    const formRawValue = this.form.getRawValue();
    let index = 0;
    for (const piggyBackULD of formRawValue.assignedULDList[
      this.currentSelectedIndex
    ].assignedULDPiggyBackList) {
      piggyBackULD.selectULD = false;
      piggyBackULD.uldTrolleyNo = piggyBackULD.uld.uldTrolleyNo;
      piggyBackULD.serialNumber = ++index;
    }
    this.individualULDform.patchValue(
      formRawValue.assignedULDList[this.currentSelectedIndex]
    );
    this.addPopUpOpen = false;
    if (!formRawValue.assignedULDList[this.currentSelectedIndex].trolleyInd) {
      this.addEditUldFlag = true;
      this.ULDPopUpTitle = "export.assign.uld.edit.uld";
      this.window.open();
      this.subscribetoEvents();
    } else {
      this.addEditUldFlag = false;
      this.trolleyPopUpTitle = "export.assign.uld.edit.trolley";
      this.windowTrolley.open();
      this.subscribetoEvents();
    }
  }

  onModifyPiggyBack(j) {
    this.selectedULDIndex = j;
    const rawValueOfForm = this.form.getRawValue();
    this.individualULDform
      .get("assignedULDPiggyBackList")
      .patchValue(rawValueOfForm.assignedULDList[j].assignedULDPiggyBackList);
    this.windowPiggyBack.open();
  }

  transformPiggyBackListBackToFront(piggyBackULDList) {
    let index = 0;
    for (const piggyBackULD of piggyBackULDList) {
      piggyBackULD.selectULD = false;
      piggyBackULD.uldTrolleyNo = piggyBackULD.uld.uldTrolleyNo;
      piggyBackULD.serialNumber = ++index;
    }
    return piggyBackULDList;
  }

  // Event callbacks bound to the main UI ends

  // Event callbacks bound to the pop up UI starts

  onAddPiggybackedULD() {
    if (this.individualULDform.get("contentCode").value !== "N") {
      this.showErrorStatus("export.base.uld.contentcode.should.be.N");
      return;
    }
    (<NgcFormArray>this.individualULDform.get(
      "assignedULDPiggyBackList"
    )).addValue([this.piggyBackULD]);
  }

  onAddPiggyBack() {
    (<NgcFormArray>this.individualULDform.get(
      "assignedULDPiggyBackList"
    )).addValue([this.piggyBackULD]);
  }

  onDeletePiggyBack(i) {
    // selectedULDIndex
    (<NgcFormGroup>this.individualULDform.get([
      "assignedULDPiggyBackList",
      i
    ])).markAsDeleted();
  }

  onSavePiggyBack() {
    let duplicateValueArry = [];
    let emptyRecord = false;
    if (this.individualULDform.getRawValue().assignedULDPiggyBackList) {
      this.individualULDform.getRawValue().assignedULDPiggyBackList.forEach((outerElement, outerIndex) => {
        if (!outerElement.uldTrolleyNo) {
          emptyRecord = true;
        }
        this.individualULDform.getRawValue().assignedULDPiggyBackList.forEach((innerElement, innerIndex) => {
          if (outerElement.uldTrolleyNo == innerElement.uldTrolleyNo && outerIndex !== innerIndex) {
            duplicateValueArry.push({ value: outerElement.uldTrolleyNo, firstIndex: outerIndex, secondIndex: innerIndex });
          }
        });
      });
      if (emptyRecord) {
        this.showErrorMessage("mandatory.fields.cannot.be.empty");
        return;
      }
      if (duplicateValueArry.length > 0) {
        duplicateValueArry.forEach(element => {
          this.showErrorMessage("export.duplicate.piggyback.uld", "", [duplicateValueArry[0].value], null);
        });
        return;
      }
    }

    (<NgcFormArray>this.form.get([
      "assignedULDList",
      this.selectedULDIndex,
      "assignedULDPiggyBackList"
    ])).patchValue(
      this.individualULDform.getRawValue().assignedULDPiggyBackList
    );
    this.onSave();
    this.windowPiggyBack.close();
  }

  onDeletePiggyBackList() {
    const assignedULDPiggyBackList = (<NgcFormArray>this.individualULDform.get(
      "assignedULDPiggyBackList"
    )).getRawValue();
    let i = 0;
    for (let piggyBackUld of assignedULDPiggyBackList) {
      if (piggyBackUld.selectULD) {
        this.onDeletePiggyBack(i);
      }
      ++i;
    }
  }

  onDeletePiggybackedULD() {
    const individualULD = this.individualULDform.getRawValue();
    let index = -1;
    for (const eachULD of individualULD.assignedULDPiggyBackList) {
      ++index;
      if (eachULD.selectULD) {
        if (eachULD.flagCRUD === "C") {
          (<NgcFormArray>this.individualULDform.get(
            "assignedULDPiggyBackList"
          )).deleteValueAt(index);
          --index;
        } else {
          (<NgcFormGroup>(<NgcFormArray>this.individualULDform.get(
            "assignedULDPiggyBackList"
          )).controls[index])
            .get("flagCRUD")
            .setValue("D");
        }
      }
    }
  }

  onSaveULD() {
    const validationResultPiggyBackULDs = this.validateBlankPiggyBackULDs(
      this.individualULDform.get("uldTrolleyNo").value
    );
    if (!validationResultPiggyBackULDs) {
      this.showErrorStatus("export.piggyback.uld.cannot.blank");
      return;
    }
    if (validationResultPiggyBackULDs === -1) {
      this.showErrorStatus("export.base.uld.piggyback.uld.cannot.same");
      return;
    }
    if (validationResultPiggyBackULDs === -2) {
      this.showErrorStatus("export.max.length.piggyback.uld.number.validation");
      return;
    }

    if (
      (<NgcFormArray>this.individualULDform.get("assignedULDPiggyBackList"))
        .length &&
      this.individualULDform.get("contentCode").value !== "N"
    ) {
      this.showErrorStatus("export.base.uld.contentcode.should.be.N");
      return;
    }
    if (
      this.individualULDform.get("uldTrolleyNo").value &&
      this.individualULDform.get("uldTrolleyNo").value.length > 10
    ) {
      this.showErrorStatus("export.max.length.uld.number.validation");
      return;
    }
    this.onSaveULDTrolley("ULD");
  }

  onSaveTrolley() {
    this.onSaveULDTrolley("Trolley");
  }

  onSaveULDTrolley(type) {
    if (!this.validateCheckBoxes()) {
      this.showErrorStatus("export.one.of.phc.ecc.standby.select");
      return;
    }
    let addFunction, updateFunction;
    if (type === "ULD") {
      addFunction = this.buildUpService.addULD;
      updateFunction = this.buildUpService.updateULD;
    } else {
      addFunction = this.buildUpService.addTrolley;
      updateFunction = this.buildUpService.updateTrolley;
    }
    // console.log(this.individualULDform.getRawValue());
    if (this.addPopUpOpen) {
      const addULDRequest = this.transformULDModelFrontToBack(
        this.individualULDform.getRawValue()
      );
      // console.log(JSON.stringify(addULDRequest));
      addFunction.call(this.buildUpService, addULDRequest).subscribe(resp => {
        this.response = resp;
        // console.log(JSON.stringify(this.response));
        // console.log(JSON.stringify(this.individualULDform.getRawValue()));
        if (this.response.data) {
          this.showSuccessStatus("g.completed.successfully");
          this.refreshFormMessages(this.response, "individualULDform");
          for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
          }
          // If Uld needs to be added in inventory.
          if (this.response.data.warningFlag) {
            let message;
            if (this.addEditUldFlag) {
              message = "ULD Not Found in Inventory! Do you want to create it?";
            } else {
              message =
                "Trolley Not Found in Inventory! Do you want to create it?";
            }
            this.showConfirmMessage(message)
              .then(fulfilled => {
                this.buildUpService
                  .insertInventory(addULDRequest)
                  .subscribe(resp1 => {
                    this.showSuccessStatus("g.completed.successfully");
                    const localResponse = resp1;
                    this.refreshFormMessages(localResponse);
                  });
              })
              .catch(reason => { });
          }
          this.window.close();
          this.windowTrolley.close();
          this.onSearch("redirect");
        } else {
          this.refreshFormMessages(this.response, "individualULDform");
        }
        // this.individualULDform.reset();
      });
    } else {
      const updateULDRequest = this.transformULDModelFrontToBack(
        this.individualULDform.getRawValue()
      );
      updateFunction
        .call(this.buildUpService, updateULDRequest)
        .subscribe(resp => {
          // console.log(JSON.stringify(this.response.data));
          this.response = resp;
          if (this.response.data) {
            this.showSuccessStatus("g.completed.successfully");
            (<NgcFormGroup>(<NgcFormArray>this.form.get("assignedULDList"))
              .controls[this.currentSelectedIndex]).patchValue(
                this.individualULDform.getRawValue()
              );
            const noOfPiggyback = (<NgcFormArray>(<NgcFormGroup>(<NgcFormArray>this.form.get(
              "assignedULDList"
            )).controls[this.currentSelectedIndex]).get(
              "assignedULDPiggyBackList"
            )).length;
            (<NgcFormGroup>(<NgcFormArray>this.form.get("assignedULDList"))
              .controls[this.currentSelectedIndex])
              .get("noOfPiggyback")
              .setValue(noOfPiggyback);
            for (const subscription of this.subscriptions) {
              subscription.unsubscribe();
            }
            this.window.close();
            this.windowTrolley.close();
            this.onSearch("redirect");
          } else {
            this.refreshFormMessages(this.response, "individualULDform");
          }
          // this.individualULDform.reset();
        });
    }
  }

  onSegmentChange(event) {
    // console.log(event);
    this.individualULDform.get("offPoint").setValue(event.desc);
  }
  onTerminalChanged(event, index) {
    if (this.form.get(["assignedULDList", index, "segmentId"]).value) {
      this.retrieveDropDownListRecord(
        this.form.get(["assignedULDList", index, "segmentId"]).value,
        "FLIGHTSEGMENT",
        "query",
        this.flightIdforDropdown
      ).subscribe(data => {
        console.log(data);

      });
    }
  }

  onSegmentChanged(index) {
    this.onTerminalChanged(
      this.form.get(["assignedULDList", index, "handlingArea"]).value,
      index
    );
    this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', this.flightIdforDropdown)
      .subscribe(data => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].code == this.form.get(["assignedULDList", index, "segmentId"]).value) {
            this.flightOffPoint = data[i].desc;
            break;
          }
        }
      });
  }

  // Event callbacks bound to the pop up UI ends

  // Function for forming Models starts

  formSearchRequest() {
    const request = {
      flagCRUD: "C",
      flightKey: this.form.get("flightKey").value,
      flightOriginDate: this.form.get("flightOriginDate").value
    };
    return request;
  }

  transformFlightULDModelBackToFront(obj) {
    const UIResponse: any = {};
    UIResponse.flightKey = obj.flightKey;
    UIResponse.flightOriginDate = obj.flightOriginDate;
    UIResponse.std = obj.std;
    UIResponse.etd = obj.etd;
    UIResponse.aircraftType = obj.aircraftType;
    UIResponse.routingInfo = obj.routingInfo;
    UIResponse.status = obj.status;
    UIResponse.aliRemain = obj.aliRemain;
    UIResponse.aliTotal = obj.aliTotal;
    UIResponse.assignedULDList = [];
    UIResponse.flightRemarks = obj.flightRemarks;
    UIResponse.aircraftRemarks = obj.aircraftRemarks;
    for (const assignedULD of obj.assignedULDList) {
      UIResponse.assignedULDList.push({
        actualGrossWeight: assignedULD.uld.actualGrossWeight,
        uldTrolleyNo: assignedULD.uld.uldTrolleyNo,
        isValidSegment: true,
        tareWeight: assignedULD.uld.tareWeight,
        netWeight: assignedULD.netWeight,
        seriesTareWeight: assignedULD.uld.seriesTareWeight,
        contentCode: assignedULD.uld.contentCode,
        heightCode: assignedULD.uld.heightCode,
        handlingArea: assignedULD.uld.handlingArea,
        phcFlag: assignedULD.uld.phcFlag,
        eccFlag: assignedULD.uld.eccFlag,
        noOfPiggyback: assignedULD.piggyBackULDList.length,
        eic: assignedULD.eic,
        empty: assignedULD.shipmentAssigned,
        actualLocation: assignedULD.actualLocation,
        wareHouseLocation: assignedULD.wareHouseLocation,
        trolleyFlag: assignedULD.uld.trolleyFlag,
        trolleyInd: assignedULD.uld.trolleyInd,
        // trolleyInd
        standByFlag: assignedULD.uld.standByFlag,
        priority: assignedULD.uld.priority,
        remarks: assignedULD.uld.remarks,
        reprintTag: assignedULD.reprintTag,
        segmentId: assignedULD.uld.segmentId,
        offPoint: assignedULD.uld.offPoint,
        assUldTrolleyId: assignedULD.assUldTrolleyId,
        loadedWeight: assignedULD.uld.loadedWeight,
        selectULD: assignedULD.uld.checkBox,
        palletTypeFlag: assignedULD.uld.palletTypeFlag,
        transferType: assignedULD.uld.transferType,
        assignedULDPiggyBackList: this.transformPiggyBackListBackToFront(
          assignedULD.piggyBackULDList
        ),
        flagCRUD: "R"
      });
    }
    return UIResponse;
  }

  transformFlightULDModelFrontToBack(obj, tranformAll) {
    const FlightULDRequest = {
      flightKey: obj.flightKey,
      flightOriginDate: obj.flightOriginDate,
      flightId: obj.flightId,
      assignedULDList: [],
      ackInfo: false,
      ackForeignUld: false
    };
    for (const assignedULD of obj.assignedULDList) {
      if (tranformAll || assignedULD.selectULD) {
        FlightULDRequest.flightId = this.flightIdInRes;
        FlightULDRequest.assignedULDList.push(
          this.transformULDModelFrontToBack(assignedULD)
        );
      }
    }
    return FlightULDRequest;
  }

  transformULDModelFrontToBack(obj): any {
    // console.log(obj);
    const piggyBackULDList = [];
    for (const assignedULDPiggyBack of obj.assignedULDPiggyBackList) {
      piggyBackULDList.push({
        flagCRUD: assignedULDPiggyBack.flagCRUD || "U",
        uld: {
          uldTrolleyNo: assignedULDPiggyBack.uldTrolleyNo
        },
        assUldTrolleyId: obj.assUldTrolleyId,
        assUldTrolleyPiggyBackId: assignedULDPiggyBack.assUldTrolleyPiggyBackId
      });
    }
    const addULDRequest = {
      flightKey: this.form.get("flightKey").value,
      flightOriginDate: this.form.get("flightOriginDate").value,
      assUldTrolleyId: obj.assUldTrolleyId,
      flagCRUD: obj.flagCRUD,
      actualLocation: obj.actualLocation,
      wareHouseLocation: obj.wareHouseLocation,
      eic: obj.eic,
      empty: obj.shipmentAssigned,
      reprintTag: obj.reprintTag,
      uld: {
        segmentId: obj.segmentId,
        uldTrolleyNo: obj.uldTrolleyNo,
        contentCode: obj.contentCode,
        heightCode: obj.heightCode,
        handlingArea: obj.handlingArea,
        remarks: obj.remarks,
        phcFlag: obj.phcFlag,
        eccFlag: obj.eccFlag,
        standByFlag: obj.standByFlag,
        trolleyFlag: obj.trolleyFlag,
        trolleyInd: obj.trolleyInd,
        tareWeight: obj.tareWeight,
        seriesTareWeight: obj.seriesTareWeight,
        loadedWeight: obj.loadedWeight,
        priority: obj.priority,
        loadingStartedOn: null,
        loadingCompletedOn: null,
        handlingServiceGroupId: null,
        reasonIdForMovement: null,
        uldTagPrintedOn: null,
        shipment: null,
        selectULD: obj.selectULD,
        flightOffPoint: this.flightOffPoint,
        transferType: obj.transferType,
        actualGrossWeight: obj.actualGrossWeight
      },
      piggyBackULDList: piggyBackULDList
    };
    return addULDRequest;
  }

  // Function for forming Models ends

  // subscriptions start

  subscribetoEvents() {
    this.subscriptions[0] = this.individualULDform
      .get("phcFlag")
      .valueChanges.subscribe(value => {
        // console.log(value);
        // if (value) {
        //   this.individualULDform.get('eccFlag').disable();
        //   this.individualULDform.get('standByFlag').disable();
        // } else {
        //   this.individualULDform.get('eccFlag').enable();
        //   this.individualULDform.get('standByFlag').enable();
        // }
      });

    this.subscriptions[1] = this.individualULDform
      .get("eccFlag")
      .valueChanges.subscribe(value => {
        // console.log(value);
        // if (value) {
        //   this.individualULDform.get('phcFlag').disable();
        //   this.individualULDform.get('standByFlag').disable();
        // } else {
        //   this.individualULDform.get('phcFlag').enable();
        //   this.individualULDform.get('standByFlag').enable();
        // }
      });

    this.subscriptions[2] = this.individualULDform
      .get("standByFlag")
      .valueChanges.subscribe(value => {
        // console.log(value);
        // if (value) {
        //   this.individualULDform.get('phcFlag').disable();
        //   this.individualULDform.get('standByFlag').disable();
        // } else {
        //   this.individualULDform.get('phcFlag').enable();
        //   this.individualULDform.get('standByFlag').enable();
        // }
      });
  }

  disable(value) {
    // console.log(value);
  }

  subscriptionsInit() {
    this.individualULDform.get("uldTrolleyNo").valueChanges.subscribe(data => {
      this.uldValueChangeResponse(data);
    });
  }
  // subscriptions end

  uldValueChangeResponse(data) {
    if (!data) {
      return;
    }
    const uldNoRequest = this.transformULDModelFrontToBack(
      this.individualULDform.getRawValue()
    );
    if (this.addEditUldFlag && uldNoRequest.uld.uldTrolleyNo.length > 1) {
      this.serviceGetTareWeight(uldNoRequest, null);
    }
  }

  serviceGetTareWeight(uldNoRequest, index) {

    //Clear the message
    this.resetFormMessages();

    if (uldNoRequest.uld.uldTrolleyNo.length > 1) {
      //Populate the segment
      this.flightIdforDropdown = this.createSourceParameter(
        this.form.get("flightKey").value,
        this.form.get("flightOriginDate").value
      );

      this.retrieveDropDownListRecords('FLIGHTSEGMENT', 'query', this.flightIdforDropdown)
        .subscribe(data => {
          for (let index = 0; index < data.length; index++) {
            if (data[index].code == this.form.get(["assignedULDList", index, "segmentId"]).value) {
              uldNoRequest.flightOffPoint = data[index].desc;
              this.flightOffPoint = data[index].desc;
              break;
            }
          }

          this.buildUpService.getTareWeight(uldNoRequest).subscribe(resp => {
            this.response = resp;
            if (this.response &&
              this.response.data &&
              this.response.data.flightMatchesWithICS == false) {
              this.showConfirmMessage(
                "export.flight.details.not.matching.ics.confirmation"
              ).then(fulfilled => {
                this.populateHeightCodeTareWeight(this.response, index);
              }).catch(reason => {
                //Do nothing
                (<NgcFormControl>this.form.get(["assignedULDList", index, "tareWeight"])).setValue(null, { onlySelf: true, emitEvent: false });
                (<NgcFormControl>this.form.get(["assignedULDList", index, "heightCode"])).setValue("QL", { onlySelf: true, emitEvent: false });
                (<NgcFormControl>this.form.get(["assignedULDList", index, "uldTrolleyNo"])).setValue(null, { onlySelf: true, emitEvent: false });
              });
            } else {
              this.populateHeightCodeTareWeight(this.response, index);
            }
          });
        });
    }
  }

  populateHeightCodeTareWeight(response, index) {
    if (index != null) {
      this.form
        .get(["assignedULDList", index, "tareWeight"])
        .setValue(this.response.data.uld.tareWeight, { onlySelf: true, emitEvent: false });
      if (this.response.data.uld.heightCode) {
        this.form
          .get(["assignedULDList", index, "heightCode"])
          .setValue(this.response.data.uld.heightCode, { onlySelf: true, emitEvent: false });
      }
      if (this.response.data.uld.palletTypeFlag) {
        this.form
          .get(["assignedULDList", index, "palletTypeFlag"])
          .setValue(this.response.data.uld.palletTypeFlag);
      }
    }
    if (this.response.data.uld.tareWeight) {
      this.disableTareWeightEntry = true;
      if (!this.editUldTrolleyFlag) {
        this.individualULDform
          .get("tareWeight")
          .setValue(this.response.data.uld.tareWeight, { onlySelf: true, emitEvent: false });
      }
    } else {
      this.disableTareWeightEntry = false;
    }
  }

  addContouCodeWeight(index) {
    const PiggyBack = new DLSULD();
    PiggyBack.heightCode = this.form.get([
      "assignedULDList",
      index,
      "heightCode"
    ]).value;
    PiggyBack.uldTrolleyNumber = this.form.get([
      "assignedULDList",
      index,
      "uldTrolleyNo"
    ]).value;

    PiggyBack.flightKey = this.form.get('flightKey').value;

    if (PiggyBack.uldTrolleyNumber != null && PiggyBack.uldTrolleyNumber.length > 1) {
      this.buildUpService.getPiggyBackFlag(PiggyBack).subscribe(res => {
        this.piggyResponse = res.data;
        if (this.piggyResponse.calculatedTareWeight != null && this.piggyResponse.calculatedTareWeight != 0) {
          this.form
            .get(["assignedULDList", index, "tareWeight"])
            .setValue(this.piggyResponse.calculatedTareWeight);
        }
      });
    }
  }
  // validation starts

  validateBlankPiggyBackULDs(BaseULDNo) {
    const assignULD = this.individualULDform.getRawValue();
    // console.log(JSON.stringify(assignULD));
    for (const piggyBackULD of assignULD.assignedULDPiggyBackList) {
      if (!piggyBackULD.uldTrolleyNo) {
        return 0;
      }
      if (piggyBackULD.uldTrolleyNo === BaseULDNo) {
        return -1;
      }
      if (piggyBackULD.uldTrolleyNo.length >= 9) {
        return -2;
      }
    }
    return 1;
  }

  validateCheckBoxes() {
    let count = 0;
    if (this.individualULDform.get("phcFlag").value) {
      ++count;
    }
    if (this.individualULDform.get("eccFlag").value) {
      ++count;
    }
    if (this.individualULDform.get("standByFlag").value) {
      ++count;
    }
    if (count > 1) {
      return false;
    }
    return true;
  }

  // validation ends

  // initialization starts

  setFlagValuesToFalse() {
    this.individualULDform.get("phcFlag").setValue(false);
    this.individualULDform.get("eccFlag").setValue(false);
    this.individualULDform.get("trolleyFlag").setValue(false);
    this.individualULDform.get("standByFlag").setValue(false);
    this.individualULDform.get("reprintTag").setValue(false);
  }

  onUldNumberChange(index) {
    if (!this.form.get(["assignedULDList", index, "trolleyInd"]).value) {
      if (this.form.get(["assignedULDList", index, "uldTrolleyNo"]).value != null
        && this.form.get(["assignedULDList", index, "uldTrolleyNo"]).value.length > 1) {
        this.serviceGetTareWeight(
          this.transformULDModelFrontToBack(
            (<NgcFormGroup>this.form.get([
              "assignedULDList",
              index
            ])).getRawValue()
          ),
          index
        );
      }
      // change source parameter
    }
  }

  initializeValues() {
    this.displayInformation = false;
    this.addPopUpOpen = false;
    (<NgcFormArray>this.form.get("assignedULDList")).resetValue([]);
    this.setFlagValuesToFalse();
  }

  // initialization starts
  noOfDigitsInULD(uldNo) {
    let len = 0;
    for (let i = 0; i < uldNo.length; ++i) {
      if (uldNo[i] >= "0" && uldNo[i] <= "9") {
        ++len;
      }
    }
    return len;
  }

  onSave() {
    let formRawvalue = this.form.getRawValue();
    let index = 0;
    let mailValidation = true;
    const modifyRequest = this.transformFlightULDModelFrontToBack(
      this.form.getRawValue(),
      true
    );
    this.buildUpService.modifyUlds(modifyRequest).subscribe(resp => {
      if (resp.data) {
        const response: any = resp;
        this.responseForInfoWarn = resp;
        if (response.data.successOperation) {
          this.onSearch("redirect");
        } else {
          if (this.responseForInfoWarn.data && this.responseForInfoWarn.data.infoFlag) {
            this.showConfirmMessage(this.responseForInfoWarn.data.warnigInfoAndErrorMessage).then(fulfilled => {
              modifyRequest.ackInfo = true;
              this.buildUpService.modifyUlds(modifyRequest).subscribe(resp => {
                if (resp.data) {
                  const response: any = resp;
                  this.responseForInfoWarn = resp;
                  if (response.data.successOperation) {
                    this.onSearch("redirect");
                  } else {
                    this.showResponseErrorMessages(response);
                  }
                }
              });
            }
            ).catch(reason => {
            });
          }
          else if (this.responseForInfoWarn.data && this.responseForInfoWarn.data.warnForForeignUld) {
            this.showConfirmMessage(NgcUtility.translateMessage("maintain.foreign.uld.check.5", [this.responseForInfoWarn.data.warnigInfoAndErrorMessage])).then(fulfilled => {
              modifyRequest.ackForeignUld = true;
              this.buildUpService.modifyUlds(modifyRequest).subscribe(resp => {
                if (resp.data) {
                  const response: any = resp;
                  this.responseForInfoWarn = resp;
                  if (response.data.successOperation) {
                    this.onSearch("redirect");
                  } else {
                    this.showResponseErrorMessages(response);
                  }
                }
              });
            }
            ).catch(reason => {
            });
          }
          if(NgcUtility.hasFeatureAccess(ApplicationFeatures.Exp_BU_AssignULDTrolley_TareWeight)){
            /**BUG-2254 Fix - following code is used to show cell level error 
             * at tareWeight or grossWeight cell
             */
            response.data.assignedULDList.forEach((item, index) =>{
              if(item.uld.messageList != null && item.uld.messageList.length > 0){
                  this.showFormControlErrorMessage(
                    <NgcFormControl>(this.form.get(['assignedULDList', index, item.uld.messageList[0].referenceId])), item.uld.messageList[0].code
                  );
              }
            });
          }else{
            this.showResponseErrorMessages(response);
          }
    
        }
      } else {
        const response = resp;
        for (let message of response.messageList) {
          message.referenceId = message.referenceId.replace("uld.", "");
        }
        this.showResponseErrorMessages(response);
      }
    });
  }

  onRowAddUld() {
    if (this.form.get("segmentId").value) {
      this.eachUldRow.segmentId = this.form.get("segmentId").value;
      this.eachTrolleyRow.segmentId = this.form.get("segmentId").value;
    }
    this.eachUldRow.handlingArea = this.getUserProfile().terminalId;
    this.eachUldRow.terminal = this.getUserProfile().terminalId;
    (<NgcFormArray>this.form.get("assignedULDList")).addValue([
      this.eachUldRow
    ]);
    //setFocus
    this.setFocusOnUldNumber();
  }

  setFocusOnUldNumber() {
    let i = this.form.get("assignedULDList").value.length;
    //set Auto Focus
    this.async(() => {
      (this.form.get(["assignedULDList", i - 1, "uldTrolleyNo"]) as NgcFormControl).focus();
    }, 100);
  }


  onRowAddTrolley() {
    (<NgcFormArray>this.form.get("assignedULDList")).addValue([
      this.eachTrolleyRow
    ]);
    //setFocus
    this.setFocusOnUldNumber();
  }

  onDeleteUld(i) {
    (<NgcFormGroup>this.form.get(["assignedULDList", i])).markAsDeleted();
  }

  onDeleteUlds() {
    let length = (<NgcFormArray>this.form.get("assignedULDList")).length;
    for (let i = length - 1; i >= 0; i--) {
      if (this.form.get(["assignedULDList", i, "selectULD"]).value) {
        this.onDeleteUld(i);
      }
    }
  }


  onPrintULDTag() {
    const toCheckListUldSelected = this.transformFlightULDModelFrontToBack(
      this.form.getRawValue(),
      true
    );
    let filteredAssignedULDList = toCheckListUldSelected.assignedULDList.filter(
      assignedUld => assignedUld.uld.selectULD
    );
    if (!filteredAssignedULDList.length) {
      this.showErrorStatus("export.select.any.uld.before.print.uld.tag");
      return;
    }
    this.refreshFormMessages(toCheckListUldSelected);
    this.windowPrinter.open();
  }


  printUld() {
    if (this.popupPrinterForm.get("printerdropdown").value == null) {
      this.showErrorStatus("expaccpt.select.printer.and.proceed");
      return;
    }
    const newRequest = this.transformFlightULDModelFrontToBack(
      this.form.getRawValue(),
      true
    );
    const printRequest = {
      assignedULDList: newRequest.assignedULDList.filter(
        assignedUld => assignedUld.uld.selectULD
      ),
      printerName: this.popupPrinterForm.get("printerdropdown").value
    };
    this.buildUpService.printUldTagData(printRequest).subscribe(response => {
      //   this.refreshFormMessages(response);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus("g.completed.successfully");
        this.windowPrinter.close();
      }
    });
  }


  /**
     * Groups Renderer
     *
     * @param value Value
     * @param rowData Row Data
     * @param level Level
     */
  public groupsRenderer(
    value: string | number,
    rowData: any,
    level: any
  ): string {
    if (level === 1) {
      // return `${value === 1 ? 'Trolley' : 'ULD'}`;
      if (value === "true") {
        // console.log(value);
        return "- Trolley";
      } else {
        // console.log(value);
        return "- ULD";
      }
    }
    return `${value}`;
  }

  public trolleyCellsStyleRenderer = (
    row: number,
    column: string,
    value: any,
    rowData: any
  ): CellsRendererStyle => {
    const cellsStyle: CellsRendererStyle = new CellsRendererStyle();
    console.log(typeof rowData.trolleyInd);
    console.log(rowData.trolleyInd);
    if (rowData.trolleyInd === "true") {
      if (column === "trolleyFlag") {
        cellsStyle.data = " ";
        return cellsStyle;
      }
      cellsStyle.data = " ";
      return cellsStyle;
    }
    // console.log(cellsStyle.data);
    if (value === "true") {
      cellsStyle.data = "Y";
    } else if (value === "false") {
      cellsStyle.data = "N";
    }
    return cellsStyle;
  };

  // Bug 5711 navigation to working list
  navigateToWorkingList() {
    let transferDataWorkingList: any = { 'flightNo': this.form.get('flightKey').value, 'flightDate': this.form.get('flightOriginDate').value };
    this.navigateTo(this.router, '/export/exportworkinglist', transferDataWorkingList);
  }

  onSearchChange() {
    this.displayInformation = false;
  }
  //navigation to eFBL
  navigateToEfbl() {
    let transferDataEfbl: any = { 'flightNo': this.form.get('flightKey').value, 'flightDate': this.form.get('flightOriginDate').value };
    this.navigateTo(this.router, '/export/eFBL', transferDataEfbl);
  }
  //navigation to add/update accessory
  navigateToAccessory() {
    let transferDataAccessory: any = { 'flightType': 'EXPORT', 'flightKey': this.form.get('flightKey').value, 'flightDate': this.form.get('flightOriginDate').value };
    this.navigateTo(this.router, '/warehouse/addAccessory', transferDataAccessory);
  }
  //navigate to EIC
  navigateToEIC() {
    let transferDataEIC: any = { 'eicType': 'Export_EIC'};
    this.navigateTo(this.router, '/uld/maintainEic', transferDataEIC);
    }
  
  onLocationChange(data, index) {
    this.sectorId = data.parameter2;
  }
}


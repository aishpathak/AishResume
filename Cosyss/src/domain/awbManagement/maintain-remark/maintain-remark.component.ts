import { ActivatedRoute } from "@angular/router";
import {
  Component,
  NgZone,
  ElementRef,
  ViewContainerRef,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList, Input, Output, EventEmitter
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcWindowComponent,
  NgcFormArray,
  NgcDropDownComponent,
  NgcUtility,
  NgcButtonComponent,
  NgcDataTableComponent,
  PageConfiguration
} from "ngc-framework";
import {
  CurdOperations,
  MaintainRemarkResponse,
  MaintainRemarkRequest,
  MaintainRemarkCommon,
  MaintainRemarkDeleteRequest,
  ShipmentInfoReqModel
} from "./../awbManagement.shared";
import { AwbManagementService } from "../awbManagement.service";
import { NgcFormControl } from "ngc-framework";
import { FormArray, AbstractControl } from "@angular/forms";
import { ApplicationEntities } from '../../common/applicationentities';

@Component({
  selector: "app-maintain-remark",
  templateUrl: "./maintain-remark.component.html",
  styleUrls: []
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})

export class MaintainRemarkComponent extends NgcPage {
  codeData: any;
  count: number = 0;
  disableFlag: boolean = false;
  response: any;
  arrayUser: any;
  shipType: any;
  remarksPopupData = new MaintainRemarkCommon();
  flagShowNoFlightBasedData: boolean = false;
  flagShowHWBRemarksData: boolean = false;
  flagShowHWBData: boolean = false;
  flagShowAddRow: boolean = false;
  showAddRemark: boolean = false;
  addRemarkFlag: boolean = false;
  flagShowFlightBasedData: boolean = false;
  flag: boolean = false;
  flightBasedAddArray: any[];
  deleteRemarkArray: any[] = [];
  deleteRmkObj = new MaintainRemarkDeleteRequest();
  expandaccordian = false;
  transferData: any;
  saveFlag: boolean = false;
  isSearchSuccessfull: boolean = false;
  remarksExists: boolean = false;
  handledbyHouse: boolean = false;
  flagShowFlightBasedHAWBData: boolean = false;
  flagShowNoFlightHAWBRemarksData: boolean = false;
  flagFlight: boolean = false;
  shipmentId: any;


  @ViewChildren(NgcDataTableComponent)
  dataTables = new QueryList<NgcDataTableComponent>();
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('shipmentTypeData') shipmentTypeData: string;
  @Input('hwbNumberData') hwbNumberData: string;
  @Input('showAsPopup') showAsPopup: boolean;
  @Output() autoSearchShipmentInfo = new EventEmitter<boolean>();
  constructor(
    private awbService: AwbManagementService,
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }
  private maintainRemarkFormGroup: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(),
    weight: new NgcFormControl(),
    natureOfGoods: new NgcFormControl(),
    specialHandlingCode: new NgcFormArray([]),
    awbshcs: new NgcFormControl(),
    hawbshcs: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
    addRowArray: new NgcFormArray([]),
    hawbNumber: new NgcFormControl(),
    hwbNumber: new NgcFormControl(),
    hwbOrigin: new NgcFormControl(),
    hwbDestination: new NgcFormControl(),
    hwbPieces: new NgcFormControl(),
    hwbWeight: new NgcFormControl(),
    hwbNatureOfGoods: new NgcFormControl(),
    hwbSHC: new NgcFormArray([]),


  });

  private maintainRemarkFormGroupAdd: NgcFormGroup = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    createdBy: new NgcFormControl(),
    createdOn: new NgcFormControl(),
    shipmentType: new NgcFormControl(),
    remarkType: new NgcFormControl(),
    shipmentRemarks: new NgcFormControl()
  });

  private maintainRemarkFormGroupShow: NgcFormGroup = new NgcFormGroup({
    /*Going forward there is no need to declare form groups/arrays
    * Each control would be bound based on response
    */
    noFlightRemarkShow: new NgcFormArray([]),
    // hwbRemarkShow: new NgcFormArray([]),
    flightRemarkShow: new NgcFormArray([
      new NgcFormGroup({
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        flightSource: new NgcFormControl(),
        flightDestination: new NgcFormControl(),
        remarks: new NgcFormArray([
          new NgcFormGroup({
            shipmentNumber: new NgcFormControl(),
            serialNo: new NgcFormControl(),
            shipmentType: new NgcFormControl(),
            remarkType: new NgcFormControl(),
            shipmentRemarks: new NgcFormControl(),
            createdBy: new NgcFormControl(),
            createdOn: new NgcFormControl(),
            flightSource: new NgcFormControl(),
            flightDestination: new NgcFormControl()
          })
        ])
      })
    ]),

    hwbRemarkShow: new NgcFormArray([
      new NgcFormGroup({
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        flightSource: new NgcFormControl(),
        flightDestination: new NgcFormControl(),
        remarks: new NgcFormArray([
          new NgcFormGroup({
            shipmentNumber: new NgcFormControl(),
            serialNo: new NgcFormControl(),
            shipmentType: new NgcFormControl(),
            remarkType: new NgcFormControl(),
            shipmentRemarks: new NgcFormControl(),
            createdBy: new NgcFormControl(),
            createdOn: new NgcFormControl(),
            flightSource: new NgcFormControl(),
            flightDestination: new NgcFormControl()
          })
        ])
      })
    ])
  });



  onSearch() {

    this.maintainRemarkFormGroup.get("addRowArray").patchValue(new Array());
    this.onClear();
    this.flagShowHWBData = false;
    this.flagShowNoFlightHAWBRemarksData = false;
    let request = new MaintainRemarkRequest();
    request = this.maintainRemarkFormGroup.getRawValue();
    request.handledbyHouse = this.handledbyHouse;
    if (!(request.shipmentNumber)) {
      this.showErrorStatus('g.enter.awb')
      return;
    }
    if (request.flightKey && request.flightDate && this.maintainRemarkFormGroup.get('hawbNumber').value != null) {
      this.flagFlight = true;
    } else {
      this.flagFlight = false;
    }
    if (request.flightKey && !request.flightDate) {
      this.showInfoStatus('export.enter.flight.and.date');
    } else if (!request.flightKey && request.flightDate) {
      this.showInfoStatus('export.enter.flight.and.date');
    } else {
      this.awbService.searchRemark(request).subscribe(
        data => {
          this.refreshFormMessages(data);
          this.response = data.data;
          if (this.response) {
            this.shipmentId = data.data.shipmentId;
            let add = new Array();
            (<NgcFormArray>(
              this.maintainRemarkFormGroup.controls["addRowArray"]
            )).patchValue(add);
            this.patchAWBDetails(this.response);
            if (this.response.shipmentHouseInfo != null) {
              this.patchHWBDetail(this.response);
              this.flagShowHWBData = true;
            }
            this.flagShowAddRow = true;
            this.saveFlag = true;
            this.addRemarkFlag = true;
            this.flagShowNoFlightBasedData = true;
            this.flagShowFlightBasedData = true;
            this.remarksExists = !this.response.existRemarks;
            this.flagShowFlightBasedHAWBData = true;
          } else {
            this.flagShowAddRow = false;
            this.flagShowNoFlightBasedData = false;
            this.flagShowFlightBasedData = false;
            this.flagShowFlightBasedHAWBData = false;
          }

          if (this.response) {
            let serialCounter = 1;
            if (this.response.noFlightRemarks && this.response.noFlightRemarks.length > 0) {
              this.flagShowAddRow = true;
              this.flagShowNoFlightBasedData = true;
              this.response.noFlightRemarks = this.response.noFlightRemarks.map(
                function (noFlightObj) {
                  noFlightObj.check = false;
                  noFlightObj.serialNo = serialCounter++;
                  return noFlightObj;
                }
              );
              this.maintainRemarkFormGroupShow.controls[
                "noFlightRemarkShow"
              ].patchValue(this.response.noFlightRemarks);
            } else {
              this.flagShowNoFlightBasedData = false;
            }


            let hawbCounter = 1;
            if (this.response.hwbRemarks && this.response.hwbRemarks.length > 0) {
              this.flagShowAddRow = true;
              // this.flagShowHWBData = true;
              this.flagShowNoFlightHAWBRemarksData = true;
              this.response.hwbRemarks = this.response.hwbRemarks.map(
                function (hwbRemarkObj) {
                  hwbRemarkObj.check = false;
                  hwbRemarkObj.serialNo = hawbCounter++;
                  return hwbRemarkObj;
                }
              );
              this.maintainRemarkFormGroupShow.controls[
                "hwbRemarkShow"
              ].patchValue(this.response.hwbRemarks);
              this.remarksExists = true;
            } else {
              this.flagShowNoFlightHAWBRemarksData = false;
            }


            if (this.response.flightBasedRemarks[0] != null) {
              this.flagShowAddRow = true;
              this.flagShowFlightBasedData = true;
              this.expandaccordian = true;
              this.response.flightBasedRemarks = this.response.flightBasedRemarks.map(
                function (flightObj) {
                  flightObj.flightDate = NgcUtility.toDateFromLocalDate(
                    flightObj.flightDate
                  );
                  let serialCounter = 1;
                  flightObj.check = false;
                  flightObj.remarks = flightObj.remarks.map(function (
                    remarksObj
                  ) {
                    remarksObj.check = false;
                    remarksObj.serialNo = serialCounter++;
                    return remarksObj;
                  });
                  return flightObj;
                }
              );
              this.maintainRemarkFormGroupShow.controls[
                "flightRemarkShow"
              ].patchValue(this.response.flightBasedRemarks);
              const flightRemarks = this.maintainRemarkFormGroupShow.getRawValue().flightRemarkShow;
              for (let i = 0; i < flightRemarks.length; i++) {
                for (let j = 0; j < flightRemarks[i].remarks.length; j++) {
                  if (flightRemarks[i].remarks[j].createdBy === 'BATCHUSER') {
                    this.maintainRemarkFormGroupShow.get(['flightRemarkShow', i, 'remarks', j, 'check']).disable();
                  }
                }

              }
            } else {
              this.flagShowFlightBasedData = false;
            }

            if (this.response.hwbRemarks[0] != null) {
              this.flagShowAddRow = true;
              this.flagShowFlightBasedHAWBData = true;
              this.expandaccordian = true;
              this.response.hwbRemarks = this.response.hwbRemarks.map(
                function (flightObj) {
                  flightObj.flightDate = NgcUtility.toDateFromLocalDate(
                    flightObj.flightDate
                  );
                  let serialCounter = 1;
                  flightObj.check = false;
                  flightObj.remarks = flightObj.remarks.map(function (
                    remarksObj
                  ) {
                    remarksObj.check = false;
                    remarksObj.serialNo = serialCounter++;
                    return remarksObj;
                  });
                  return flightObj;
                }
              );
              this.maintainRemarkFormGroupShow.controls[
                "flightRemarkHAWBShow"
              ].patchValue(this.response.hwbRemarks);


              const flightRemarks = this.maintainRemarkFormGroupShow.getRawValue().flightRemarkHAWBShow;
              for (let i = 0; i < flightRemarks.length; i++) {
                for (let j = 0; j < flightRemarks[i].remarks.length; j++) {
                  if (flightRemarks[i].remarks[j].createdBy === 'BATCHUSER') {
                    this.maintainRemarkFormGroupShow.get(['flightRemarkHAWBShow', i, 'remarks', j, 'check']).disable();
                  }
                }

              }
            } else {
              this.flagShowFlightBasedHAWBData = false;
            }
          }
        },
        error => {
          this.showErrorStatus('g.try.again');
        }
      );
    }
  }

  onSave() {
    const maintianRmkFormValue = (<NgcFormArray>(
      this.maintainRemarkFormGroup.controls["addRowArray"]
    )).getRawValue();
    maintianRmkFormValue.forEach(element => {
      element.shipmentNumber = this.maintainRemarkFormGroup.get(
        "shipmentNumber"
      ).value;
      element.hawbNumber = this.maintainRemarkFormGroup.get(
        "hawbNumber").value;
      element.handledbyHouse = this.handledbyHouse;
      element.shipmentId = this.shipmentId;

    });

    let maintainRemark: any = new Object();
    maintainRemark.maintainremarkdetail = maintianRmkFormValue;
    this.awbService.saveRemarks(maintainRemark).subscribe(
      data => {
        if (!this.showResponseErrorMessages(data)) {
          this.resetFormMessages();
          if (data[0]) {
            this.onSearch();
            this.autoSearchShipmentInfo.emit(true)
            this.showSuccessStatus('g.added.successfully');
            let add = new Array();
            (<NgcFormArray>(
              this.maintainRemarkFormGroup.controls["addRowArray"]
            )).patchValue(add);
          }
        }
      },
      error => {
        this.showErrorStatus('g.try.again');
      }
    );
  }

  onDelete() {
    let deleteArray: any = new Array();
    const requestOfDelete = new MaintainRemarkDeleteRequest();
    const requestNoFlightBased = (<NgcFormArray>(
      this.maintainRemarkFormGroupShow.controls["noFlightRemarkShow"]
    )).getRawValue();
    const requestFlightBased = (<NgcFormArray>(
      this.maintainRemarkFormGroupShow.controls["flightRemarkShow"]
    )).getRawValue();
    const requestHAWBBased = (<NgcFormArray>(
      this.maintainRemarkFormGroupShow.controls["hwbRemarkShow"]
    )).getRawValue();
    const requestHAWBFlightBased = (<NgcFormArray>(
      this.maintainRemarkFormGroupShow.controls["hwbRemarkShow"]
    )).getRawValue();

    requestNoFlightBased.forEach(requestDelete => {
      if (requestDelete.check == true) {
        deleteArray.push(requestDelete.shipmentRemarkId);
        requestOfDelete.remarkIdList = deleteArray;
      }
    });
    requestHAWBBased.forEach(requestHAWBDelete => {
      if (requestHAWBDelete.check == true) {
        deleteArray.push(requestHAWBDelete.shipmentRemarkId);
        requestOfDelete.remarkIdList = deleteArray;
      }
    });
    requestFlightBased.forEach(deleteRemarkArray => {
      deleteRemarkArray.remarks.forEach(deleteFlightBasedRemark => {
        if (deleteFlightBasedRemark.check) {
          deleteArray.push(deleteFlightBasedRemark.shipmentRemarkId);
          requestOfDelete.remarkIdList = deleteArray;
        }
      });
    });
    requestHAWBFlightBased.forEach(deleteRemarkArray => {
      deleteRemarkArray.remarks.forEach(deleteFlightBasedHAWBRemark => {
        if (deleteFlightBasedHAWBRemark.check) {
          deleteArray.push(deleteFlightBasedHAWBRemark.shipmentRemarkId);
          requestOfDelete.remarkIdList = deleteArray;
        }
      });
    });
    if (requestOfDelete.remarkIdList.length >= 1) {
      this.awbService.deleteRemarks(requestOfDelete).subscribe(
        data => {
          this.onSearch();
          this.showSuccessStatus("g.deleted.successfully");
          let add = new Array();
          (<NgcFormArray>(
            this.maintainRemarkFormGroup.controls["addRowArray"]
          )).patchValue(add);
        },
        error => {
          this.showErrorStatus('g.try.again');
        }
      );
    }
    const maintianRmkFormValue = (<NgcFormArray>(
      this.maintainRemarkFormGroup.controls["addRowArray"]
    )).getRawValue();
    let requestObj: any = new Array();
    maintianRmkFormValue.forEach(noFlight => {
      if (noFlight.checkBox) {
        requestObj.push(noFlight);
      }
    });
    if (requestObj.length < 1 && requestOfDelete.remarkIdList.length < 1)
      this.showInfoStatus('export.select.atleast.one.record');
    else
      (<NgcFormArray>(
        this.maintainRemarkFormGroup.controls["addRowArray"]
      )).deleteValue(requestObj);
  }

  onClear() {
    this.maintainRemarkFormGroupShow.reset();
    this.maintainRemarkFormGroupShow.get('hwbRemarkShow').reset();
  }

  onConfirm(event) {
    const requestNoFlightBased = (<NgcFormArray>(
      this.maintainRemarkFormGroupShow.controls["noFlightRemarkShow"]
    )).getRawValue();
    const requestFlightBased = (<NgcFormArray>(
      this.maintainRemarkFormGroupShow.controls["flightRemarkShow"]
    )).getRawValue();
    const maintianRmkFormValue = (<NgcFormArray>(
      this.maintainRemarkFormGroup.controls["addRowArray"]
    )).getRawValue();
    const requestHAWBBased = (<NgcFormArray>(
      this.maintainRemarkFormGroupShow.controls["hwbRemarkShow"]
    )).getRawValue();
    const requestHAWBFlightBased = (<NgcFormArray>(
      this.maintainRemarkFormGroupShow.controls["hwbRemarkShow"]
    )).getRawValue();


    let flag: boolean = false;
    requestNoFlightBased.forEach(noFlight => {
      if (noFlight.check) flag = true;
    });
    requestFlightBased.forEach(flight => {
      flight.remarks.forEach(element => {
        if (element.check) flag = true;
      });
    });
    maintianRmkFormValue.forEach(addRow => {
      if (addRow.checkBox) flag = true;
    });
    requestHAWBBased.forEach(hawbRemark => {
      if (hawbRemark.check) flag = true;
    });
    requestHAWBFlightBased.forEach(flight => {
      flight.remarks.forEach(HAWBFlightelement => {
        if (HAWBFlightelement.check) flag = true;
      });
    });
    if (flag) {
      this.showConfirmMessage('export.delete.the.record.confirmation').then(fulfilled => {
        this.onDelete();
      });
    } else {
      this.showInfoStatus('export.select.atleast.one.record');
    }
  }


  addAwbRemark() {
    this.clickAddRow();
    this.showAddRemark = true;
    this.remarksExists = true;
  }

  clickAddRow() {
    const noOfRows = (<NgcFormArray>(
      this.maintainRemarkFormGroup.get("addRowArray")
    )).length;
    const lastRowOfArray = noOfRows
      ? (<NgcFormArray>this.maintainRemarkFormGroup.get("addRowArray")).length
      : 0;
    const lastRow = noOfRows
      ? (<NgcFormArray>this.maintainRemarkFormGroup.get("addRowArray"))
        .controls[noOfRows - 1]
      : null;

    if (
      noOfRows === 0 ||
      (lastRow.get("shipmentType").value &&
        lastRow.get("shipmentRemarks").value)
    ) {
      (<NgcFormArray>this.maintainRemarkFormGroup.get("addRowArray")).addValue([
        {
          checkBox: false,
          flightKey: "",
          flightDate: "",
          shipmentType: this.shipType,
          remarkType: "GEN",
          shipmentRemarks: "",
          createdOn: new Date(),
          flagSaved: "N",
          flagInsert: "Y",
          flagUpdate: "N",
          flagDelete: "N"
        }
      ]);
      if (this.shipType == undefined) {
        this.disableFlag = false;
      } else {
        this.disableFlag = true;
        this.maintainRemarkFormGroup
          .get(["addRowArray", lastRowOfArray, "shipmentType"])
          .patchValue(this.shipType);
      }
    } else {
      this.showInfoStatus('export.fill.all.mandatory.fields.to.add.another.row');
    }
  }
  ngOnInit() {

    let forwardedData = this.getNavigateData(this.activatedRoute);

    if (forwardedData != null) {
      this.maintainRemarkFormGroup
        .get("shipmentNumber")
        .setValue(forwardedData.shipmentNumber);
      this.maintainRemarkFormGroup
        .get("flightKey")
        .setValue(forwardedData.flightNumber);
      this.maintainRemarkFormGroup
        .get("flightDate")
        .setValue(forwardedData.flightDate);
      this.maintainRemarkFormGroup
        .get("hawbNumber")
        .setValue(forwardedData.hawbNumber);
      this.onSearch();
    }

    if (this.shipmentTypeData && this.shipmentNumberData) {
      this.maintainRemarkFormGroup.get(['shipmentNumber']).patchValue(this.shipmentNumberData);
      this.maintainRemarkFormGroup.get(['shipmentType']).patchValue(this.shipmentTypeData);
      this.shipType = this.shipmentTypeData;
      this.maintainRemarkFormGroup.get(['hawbNumber']).patchValue(this.hwbNumberData);
      this.onSearch();
    } else {

      const transferData = this.getNavigateData(this.activatedRoute);
      this.transferData = this.getNavigateData(this.activatedRoute);
      if (transferData !== null) {
        this.maintainRemarkFormGroup.get(['shipmentNumber']).setValue(transferData.shipmentNumber);
        this.maintainRemarkFormGroup.get(['shipmentType']).setValue(transferData.shipmentType);
        this.onSearch();
      }

    }
  }

  enableButton(item, index) {
    this.maintainRemarkFormGroup.get("deleteButton").enable();
  }

  enableDeleteButton(item, index) {
    if (item) this.maintainRemarkFormGroup.get("deleteButton").enable();
  }

  public onBack(event) {
    this.navigateBack(this.maintainRemarkFormGroup.getRawValue());
  }
  selectShipmentType(item) {
    this.shipType = item.code;
  }

  onCancel(event) {
    this.navigateBack(this.transferData);
  }
  patchAWBDetails(response) {
    this.isSearchSuccessfull = true;
    //this.maintainRemarkFormGroup.controls["shipmentNumber"].patchValue(response.shipmentNumber);
    this.maintainRemarkFormGroup.controls["origin"].patchValue(response.origin);
    this.maintainRemarkFormGroup.controls["destination"].patchValue(response.destination);
    this.maintainRemarkFormGroup.controls["pieces"].patchValue(response.pieces);
    this.maintainRemarkFormGroup.controls["weight"].patchValue(response.weight);
    this.maintainRemarkFormGroup.controls["natureOfGoods"].patchValue(response.natureOfGoods);
    this.maintainRemarkFormGroup.controls["specialHandlingCode"].patchValue(response.specialHandlingCode);
    const spclhndlingcode = (<NgcFormArray>(
      this.maintainRemarkFormGroup.controls["specialHandlingCode"]
    )).getRawValue();
    var splcode = '';
    spclhndlingcode.forEach(element => splcode = splcode + ' ' + element);
    this.maintainRemarkFormGroup.controls["awbshcs"].patchValue(splcode);

  }
  patchHWBDetail(response) {
    this.maintainRemarkFormGroup.controls["hwbNumber"].patchValue(response.shipmentHouseInfo.hwbNumber);
    this.maintainRemarkFormGroup.controls["hwbOrigin"].patchValue(response.shipmentHouseInfo.hwbOrigin);
    this.maintainRemarkFormGroup.controls["hwbDestination"].patchValue(response.shipmentHouseInfo.hwbDestination);
    this.maintainRemarkFormGroup.controls["hwbPieces"].patchValue(response.shipmentHouseInfo.hwbPieces);
    this.maintainRemarkFormGroup.controls["hwbWeight"].patchValue(response.shipmentHouseInfo.hwbWeight);
    this.maintainRemarkFormGroup.controls["hwbNatureOfGoods"].patchValue(response.shipmentHouseInfo.hwbNatureOfGoods);
    this.maintainRemarkFormGroup.controls["hwbSHC"].patchValue(response.specialHandlingCodeHAWB);
    const spclhndlingcodeHAWB = (<NgcFormArray>(
      this.maintainRemarkFormGroup.controls["hwbSHC"]
    )).getRawValue();
    var splcode = '';
    spclhndlingcodeHAWB.forEach(element => splcode = splcode + ' ' + element);
    this.maintainRemarkFormGroup.controls["hawbshcs"].patchValue(splcode);

  }

  onTabOutCheckHandledBy() {
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      this.handledbyHouse = false;
      this.maintainRemarkFormGroup.get('hawbNumber').patchValue("");
      this.maintainRemarkFormGroup.get('hawbNumber').clearValidators();
      const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.maintainRemarkFormGroup);
      const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
      req.shipmentNumber = searchFormGroup.get('shipmentNumber').value;
      this.handledbyHouse = false;
      this.awbService.isHandledByHouse(req).subscribe(response => {
        if (response) {
          this.handledbyHouse = true;
        }
      })
    }
  }

}

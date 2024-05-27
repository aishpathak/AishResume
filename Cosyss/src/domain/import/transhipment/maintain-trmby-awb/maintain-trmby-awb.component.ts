import {
  TranshipmentTransferManifestByAWB,
  TranshipmentTransferManifestByAWBInfo,
  TranshipmentTransferManifestByAWBSHC,
  TRMByAWBSearch,
  TransferByCarrierSearch,
  TransferByCarrier
} from "./../transhipment.sharedmodels";
import { NgcFormControl } from "ngc-framework/core/model/formcontrol.model";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChildren,
  QueryList,
  ViewChild
} from "@angular/core";
import {
  PageConfiguration,
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcAwbInputComponent,
  NgcWindowComponent,
  NgcUtility
} from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";
import { TranshipmentService } from "../transhipment.service";
import { ApplicationFeatures } from '../../../common/applicationfeatures';

@Component({
  selector: "app-maintain-trmby-awb",
  templateUrl: "./maintain-trmby-awb.component.html",
  styleUrls: ["./maintain-trmby-awb.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class MaintainTrmbyAwbComponent extends NgcPage implements OnInit {
  showPage = false;

  sourceparameter;
  form: NgcFormGroup = new NgcFormGroup({
    carrierCodeFrom: new NgcFormControl(),
    carrierCodeTo: new NgcFormControl(),
    airlineNumber: new NgcFormControl(),
    generatedTRMNumber: new NgcFormControl(),
    uldNumber: new NgcFormControl(),
    awbInfoList: new NgcFormArray([])
  });
  saveFlag: boolean = false;
  disableSave: boolean;
  freightOutError: any;
  @ViewChildren('shipmentNo')
  shipmenInputList: QueryList<NgcAwbInputComponent>;
  @ViewChild('showTRMNumberWindow') popupToShowTRMNumber: NgcWindowComponent;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private route: ActivatedRoute,
    private router: Router,
    private _transhipmentService: TranshipmentService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    const transferData = this.getNavigateData(this.route);
    console.log(transferData);
    if (transferData && transferData !== null) {
      if (transferData.finalizedFlag === "Y") {
        transferData.finalizedFlag = true;
      } else {
        transferData.finalizedFlag = false;
      }
      if (this._transhipmentService.fromCarrier === true) {
        this.chngeValueOfCarrierCodeFrom();
      }
      if (transferData.screenCode === "createTrm") {
      }
      if (transferData.awbInfoList) {
        for (let awbInfo of transferData.awbInfoList) {
          awbInfo.inventoryPieces = awbInfo.pieces;
          awbInfo.origin = awbInfo.origin;
          awbInfo.awbDestination = awbInfo.awbDestination;
        }
      }
      this.form.patchValue(transferData);
      //  this.search();
      if (this._transhipmentService.fromCarrier === true) {
        this.form.get("awbInfoList").disable();
        (<NgcFormArray>this.form.get(
          "awbInfoList"
        )).controls.forEach((ele: NgcFormArray) => {
          ele.get("select").setValue(true);
          ele.get("select").enable();
          ele.get("remarks").enable();
          //  ele.get('flagCRUd').setValue('R');
        });

        this._transhipmentService.fromCarrier = false;
      }

      if (transferData.finalizedFlag || transferData.cancelledBy !== null) {
        this.form.get("awbInfoList").disable();
        this.disableSave = true;
        // this.addButton.disabled;
        this._transhipmentService.fromCarrier = false;
      }
      // this.onSearch(null);
    } else {
      const awb = new TranshipmentTransferManifestByAWB();
      awb.awbInfoList = new Array<TranshipmentTransferManifestByAWBInfo>();
      this.chngeValueOfCarrierCodeFrom();
      this.form.patchValue(awb);
    }
    this.showPage = true;
    //this.changeShipmentnumberSubscription();
  }

  onSave(event) {
    console.log(this.form.getRawValue());
    const formData = this.form.getRawValue();

    // check for remaining pieces location in case of part shipment if present the alert user
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Transhipment_TRM_SearchByULD) && formData.uldNumber != null) {
      let sendShipmentData = {
        uldNumber: formData.uldNumber,
        transferByCarrierList: []
      };
      let commonDestination = '';
      let error = false;
      formData.awbInfoList.forEach(element => {
        if (element.select) {
          sendShipmentData.transferByCarrierList.push({
            awbNumber: element.shipmentNumber,
            awbDate: element.shipmentDate,
            flightId: element.inboundFlightId,
            uldNumber: formData.uldNumber
          })

          // For AAT check if the ULD shipment have the same destination if not then stop
          if (commonDestination === '') {
            commonDestination = element.awbDestination;
          } else if (commonDestination != element.awbDestination) {
            this.showErrorMessage("record.should.have.same.destination");
            error = true;
            return;
          }
        }
      });

      if (error) return;

      console.log(sendShipmentData);
      this._transhipmentService.checKRemainingPiecesLocation(sendShipmentData).subscribe(response => {
        console.log(response);
        if (response.data) {
          let locations = response.data.transferByCarrierList;
          let message = '';

          locations.forEach(element => {
            message += 'Remaining part of ' + element.awbNumber + ' present in ' + element.uldNumber + '<br/>'
          });
          if (message != '') this.showMessage(message);
        }
      })
    }

    if (this.form.get('carrierCodeFrom').value !== this.form.get('carrierCodeTo').value) {
      const awb: TranshipmentTransferManifestByAWB = this.form.getRawValue();
      let count = 0;
      if (awb.awbInfoList.filter(shipment => shipment.select === true).length === 0) {
        this.showErrorMessage("select.shipments.to.proceed");
        return;
      } else {

        if (
          awb.awbInfoList.filter(shipment => shipment.select === true).length > 8
        ) {
          this.showErrorMessage("import.select.awb.eight");
          return;
        }
        if (awb.awbInfoList.length > 0) {
          awb.allowRoutingErrorPrompt = true;
          awb.allowFreightOutAwb = true;
          this._transhipmentService.maintainTranshipmentByAWB(awb).subscribe(
            resp => {
              const response = resp;
              if (response.data && response.data.freightOutAwb && response.data.freightOutAwb.length > 0) {
                this.showConfirmMessage(NgcUtility.translateMessage("import.confirm107", [response.data.freightOutAwb]))
                  .then(fulfilled => {
                    awb.allowRoutingErrorPrompt = false;
                    awb.allowFreightOutAwb = false;
                    this._transhipmentService.maintainTranshipmentByAWB(awb).subscribe(
                      resp => {
                        const response = resp;
                        this.refreshFormMessages(response);
                        if (response.data.trmNumber) {
                          this.form.get('generatedTRMNumber').setValue(response.data.trmNumber);
                          this.popupToShowTRMNumber.open();
                        }
                        if (response.data.awbInfoList.length > 0) {
                          this.saveFlag = true;
                          this.search();
                          // this.showSuccessStatus("Operation Completed Successfull.");
                        }
                      },
                      error => {
                        this.showErrorMessage(error);
                      }
                    );
                  });
              }
              else if (response.data && response.data.routingErrorPrompt) {
                this.showConfirmMessage(
                  "carrier.not.matching.with.routing")
                  .then(fulfilled => {
                    awb.allowRoutingErrorPrompt = false;
                    awb.allowFreightOutAwb = false;
                    this._transhipmentService.maintainTranshipmentByAWB(awb).subscribe(
                      resp => {
                        const response = resp;
                        this.refreshFormMessages(response);
                        if (response.data.trmNumber) {
                          this.form.get('generatedTRMNumber').setValue(response.data.trmNumber);
                          this.popupToShowTRMNumber.open();
                        }
                        if (response.data.awbInfoList.length > 0) {
                          this.saveFlag = true;
                          this.search();
                          // this.showSuccessStatus("Operation Completed Successfull.");
                        }
                      },
                      error => {
                        this.showErrorMessage(error);
                      }
                    );
                  });
              }
              else {
                const response = resp;
                this.refreshFormMessages(response);
                if (response.data.trmNumber) {
                  this.form.get('generatedTRMNumber').setValue(response.data.trmNumber);
                  this.popupToShowTRMNumber.open();
                }
                if (response.data.awbInfoList.length > 0) {
                  this.saveFlag = true;
                  this.search();
                  // this.showSuccessStatus("Operation Completed Successfull.");
                }
              }
            },
            error => {
              this.showErrorMessage(error);
            }
          );
        } else {
          this.showErrorMessage("select.shipment.create.trm");
        }
      }
    }
    else {
      this.showErrorStatus("imp.err135")
    }
  }
  onClear(event) { }

  searchOnlyBasedOnTRM(awb) {
    this._transhipmentService.getTranshipmentByAWB(awb).subscribe(resp => {
      const response = resp;
      this.refreshFormMessages(response);
      if (resp.data != null) {
      }
      this.form.patchValue(response.data);

    });
    if (awb.finalizedFlag || awb.cancelledBy !== null) {
      this.form.get("awbInfoList").disable();
    }
  }

  search() {
    const awb: TRMByAWBSearch = this.form.getRawValue();

    let searchObj = new TransferByCarrierSearch();
    const searchObj1 = this.form.getRawValue();
    searchObj.transferringCarrier = searchObj1.carrierCodeFrom;
    searchObj.onwardCarrier = searchObj1.carrierCodeTo;
    searchObj.uldNumber = searchObj1.uldNumber;
    this._transhipmentService
      .geTranshipmentByCarrier(searchObj)
      .subscribe(resp => {
        const response = resp;
        const data = response.data;
        this.refreshFormMessages(resp);
        if (response.messageList === null) {
          if (
            (data.transferByCarrierList === null ||
              data.transferByCarrierList.length === 0) &&
            !this.saveFlag
          ) {
            this.showErrorMessage("no.record.found");
            this.saveFlag = false;
          } else {
            const AWB = new TranshipmentTransferManifestByAWB();
            AWB.carrierCodeFrom = searchObj1.carrierCodeFrom;
            AWB.carrierCodeTo = searchObj1.carrierCodeTo;
            AWB.awbInfoList = new Array<
              TranshipmentTransferManifestByAWBInfo
            >();
            data.transferByCarrierList.forEach(element => {
              if (element.readyToTransfer) {
                const awbInfo = new TranshipmentTransferManifestByAWBInfo();
                if (AWB.awbInfoList.length < 9) {
                  // made changes here by default select flag as false
                  awbInfo.select = true;
                }
                awbInfo.destination = element.destination;
                awbInfo.inboundFlightId = element.flightId;
                awbInfo.inboundFlightDate = element.date;
                awbInfo.inboundFlightHandler = element.handler;
                awbInfo.inboundFlightNumber = element.flight;
                awbInfo.natureOfGoodsDescription = element.natureOfGoods;
                awbInfo.pieces = element.pieces;
                awbInfo.weight = element.weight;
                awbInfo.weightUnitCode = element.weightCode;
                awbInfo.shipmentNumber = element.awbNumber;
                awbInfo.shipmentDate = element.awbDate;
                awbInfo.inventoryPieces = element.piecesInventory;
                awbInfo.inventoryWeight = element.weightInventory;
                awbInfo.origin = element.origin;
                awbInfo.awbDestination = element.awbDestination;
                awbInfo.remarks = null;
                if (element.shc !== null) {
                  const shcList: Array<string> = element.shc.split(" ");
                  if (shcList !== null && shcList.length > 0) {
                    awbInfo.shcList = new Array<
                      TranshipmentTransferManifestByAWBSHC
                    >();
                    shcList.forEach(shcValue => {
                      const shcObj = new TranshipmentTransferManifestByAWBSHC();
                      shcObj.specialHandlingCode = shcValue;
                      awbInfo.shcList.push(shcObj);
                    });
                  }
                }
                AWB.awbInfoList.push(awbInfo);
              }
            });
            this.form.patchValue(AWB);
            console.log(this.form.getRawValue());
            (<NgcFormArray>this.form.get(
              "awbInfoList"
            )).valueChanges.subscribe(ele => {
              console.log(ele);
            });
            if (AWB.awbInfoList.length === 0 && !this.saveFlag) {
              this.showErrorMessage("no.record.found");
            } else {
              (<NgcFormArray>this.form.get(
                "awbInfoList"
              )).controls.forEach((shipment: NgcFormGroup) => {
                shipment.disable();
                shipment.get("select").enable();
                shipment.get("remarks").enable();
              });
              this.showSuccessStatus("g.completed.successfully");
            }
          }
        }
      });
  }

  add() {
    const awbInfo = new TranshipmentTransferManifestByAWBInfo();
    awbInfo.shcList = new Array<TranshipmentTransferManifestByAWBSHC>();
    (<NgcFormArray>this.form.get("awbInfoList")).addValue([awbInfo]);
  }
  addSHC(event, awbInfo: NgcFormGroup) {
    console.log(event, awbInfo);
  }
  finalize() {
    this.form.get("finalizedFlag").setValue(true);
    this.form.get("finalizedBy").setValue("SYSADMIN");
    this.form.get("finalizedDate").setValue(new Date());
    this.onSave(event);
  }

  cancel() {
    this.navigateBack(null);
  }


  onDelete(group): void {
    console.log(group);
    const deleteList = (<NgcFormArray>this.form
      .controls['awbInfoList']).getRawValue();
    deleteList[group].flagCRUD = 'D';
    console.log(deleteList);
    // this.deleteList.push(awbInfoList[group]);
    (<NgcFormArray>this.form.controls['awbInfoList']).removeAt(group);
    if (deleteList[group].transTransferManifestByAwbId !== null) {
      (<NgcFormArray>this.form
        .controls['awbInfoList']).patchValue(deleteList);
    }
  }

  delete() {
    let count = 0;
    let isBDDelete = 0;
    const deleteIndexList: Array<number> = new Array<number>();
    (<NgcFormArray>this.form.get(
      "awbInfoList"
    )).controls.forEach((awbInfo: NgcFormGroup) => {
      if (awbInfo.get("select").value) {
        if (<NgcFormArray>awbInfo.get("shcList").value !== null) {
          (<NgcFormArray>awbInfo.get(
            "shcList"
          )).controls.forEach((ele: NgcFormGroup) => {
            ele.markAsDeleted();
          });
        }

        if (awbInfo.get("flagCRUD").value !== "C") {
          isBDDelete++;
        }
        deleteIndexList.push(count);
        awbInfo.markAsDeleted();
      }
      count++;
    });
    if (isBDDelete > 0) {
      let deleteReq = new TranshipmentTransferManifestByAWB();
      deleteReq = this.form.getRawValue();
      deleteReq.flagCRUD = "D";
      // this._transhipmentService.maintainTranshipmentByAWB(deleteReq).subscribe(resp => {
      //   if (deleteIndexList.length > 0) {
      //     deleteIndexList.forEach(index => {
      //       (<NgcFormArray>this.form.get('awbInfoList')).removeAt(index);
      //     })
      //   }
      // });
    }
  }

  chngeValueOfCarrierCodeFrom() {
    this.form.get("carrierCodeFrom").valueChanges.subscribe(carrierCodeFrom => {
      if (carrierCodeFrom && carrierCodeFrom.length > 1) {
        const requestGetTrmNumber: TranshipmentTransferManifestByAWB = new TranshipmentTransferManifestByAWB();
        requestGetTrmNumber.carrierCodeFrom = carrierCodeFrom;
        this._transhipmentService
          .getTrmNumberWithIssueDate(requestGetTrmNumber)
          .subscribe(
            resp => {
              this.form.get("trmNumber").patchValue(resp.data.trmNumber);
              this.form.get("issuedDate").patchValue(resp.data.issuedDate);
            },
            error => {
              console.log(error);
            }
          );
      }
    });
  }

  changeShipmentnumberSubscription(event, index) {
    let awbInfo = (this.form.get([
      "awbInfoList", index
    ])) as NgcFormGroup;
    if (event.length === 11) {
      const shipmentInfo: TranshipmentTransferManifestByAWBInfo = new TranshipmentTransferManifestByAWBInfo();
      shipmentInfo.shipmentNumber = event;
      shipmentInfo.recievingCarrier = this.form.get('carrierCodeTo').value;
      this.resetFormMessages();
      let getByShipment = true;
      setTimeout(() => {
        this.retrieveDropDownListRecords('MANIFEST_FLIGHT_INFO', 'query', this.createSourceParameter(shipmentInfo.shipmentNumber))
          .subscribe(value => {
            getByShipment = false;
            if (value.length == 1) {
              this.fetchShipmentInformation(awbInfo, shipmentInfo, index);

            } else {
              this.showErrorMessage('Please select inbound flight from dropdown');
            }
          });
      }, 2000);

      if (getByShipment) {
        this.fetchShipmentInformation(awbInfo, shipmentInfo, index);
      }
    }
  }

  create() {
    this.createSourceParameter("xyz");
  }
  getFlight(event, index) {
    const formGroup: NgcFormGroup = this.form.get([
      "awbInfoList",
      index
    ]) as NgcFormGroup;
    console.log(event, formGroup);
    formGroup.get("inboundFlightId").setValue(event.code);
    formGroup.get("inboundFlightNumber").setValue(event.parameter2);
    formGroup.get("inboundFlightDate").setValue(event.parameter1);
    const shipmentInfo: TranshipmentTransferManifestByAWBInfo = new TranshipmentTransferManifestByAWBInfo();
    shipmentInfo.shipmentNumber = formGroup.get("shipmentNumber").value;
    shipmentInfo.recievingCarrier = this.form.get('carrierCodeTo').value;
    shipmentInfo.inboundFlightId = event.code;
    this.resetFormMessages();
    this.fetchShipmentInformation(formGroup, shipmentInfo, index);
  }




  fetchShipmentInformation(awbInfo, shipmentInfo, index) {



    this._transhipmentService
      .getShipmentInfo(shipmentInfo)
      .subscribe(shipment => {
        //this.refreshFormMessages(shipment);
        const shipmentData = shipment.data;
        if (shipmentData !== null) {
          awbInfo.get("select").setValue(true);
          awbInfo
            .get("inboundFlightNumber")
            .setValue(shipmentData.inboundFlightNumber);
          awbInfo
            .get("inboundFlightDate")
            .setValue(shipmentData.inboundFlightDate);
          awbInfo
            .get("inboundFlightHandler")
            .setValue(shipmentData.inboundFlightHandler);
          awbInfo.get("destination").setValue(shipmentData.destination);
          awbInfo.get("pieces").setValue(shipmentData.pieces);
          awbInfo.get("weight").setValue(shipmentData.weight);
          awbInfo.get("inventoryPieces").setValue(shipmentData.inventoryPieces);
          awbInfo.get("origin").setValue(shipmentData.origin);
          awbInfo.get("awbDestination").setValue(shipmentData.awbDestination);
          awbInfo.get("natureOfGoodsDescription").setValue(shipmentData.natureOfGoodsDescription);
          awbInfo
            .get("weightUnitCode")
            .setValue(shipmentData.weightUnitCode);
          let shcList: Array<string> = null;
          if (shipmentData.shcs != null) {
            shcList = shipmentData.shcs.split(" ");
          }
          if (shcList != null && shcList.length > 0) {
            let newshcList = new Array<
              TranshipmentTransferManifestByAWBSHC
            >();
            shcList.forEach(shcValue => {
              const shcObj = new TranshipmentTransferManifestByAWBSHC();
              shcObj.specialHandlingCode = shcValue;
              newshcList.push(shcObj);
              awbInfo.get("shcList").patchValue(newshcList);
            });
          }
        }
      });

  }

  protected afterFocus() {
    if (this.shipmenInputList) {
      const shipmentInput: NgcAwbInputComponent = this.shipmenInputList.last as NgcAwbInputComponent;
      //
      if (shipmentInput) {
        shipmentInput.focus();
      }
    }
  }


  redirectToShipmentInformation(index) {
    const tempList = (<NgcFormArray>this.form
      .controls['awbInfoList']).getRawValue();

    let shipmentNumber = tempList[index].shipmentNumber;
    if (!shipmentNumber.isNull || !shipmentNumber.isEmpty) {
      const requestForShipmentInfo: any =
      {
        'shipmentNumber': shipmentNumber,
        'shipmentType': 'AWB',
        carrierCodeFrom: this.form.get('carrierCodeFrom').value,
        carrierCodeTo: this.form.get('carrierCodeTo').value
      };
      this.navigateTo(this.router, '/awbmgmt/shipmentinfoCR', requestForShipmentInfo);
    }
  }
}

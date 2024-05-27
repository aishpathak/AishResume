import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild,
  ChangeDetectorRef
} from "@angular/core";
import {
  NgcFormGroup,
  NgcFormControl,
  PageConfiguration,
  NgcPage,
  NgcFormArray,
  NgcWindowComponent,
  NgcReportComponent,
  NgcUtility
} from "ngc-framework";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ImportService } from "../import.service";
import { AWBReleaseSearch, Awbnumber } from "../import.shared";
import { DuplicatenamepopupComponent } from '../../common/duplicatenamepopup/duplicatenamepopup.component';
import { C } from "@angular/core/src/render3";
@Component({
  selector: "app-awb-release-from",
  templateUrl: "./awb-release-from.component.html",
  styleUrls: ["./awb-release-from.component.scss"],
  providers: [ImportService]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  focusToBlank: true,
  focusToMandatory: true
})
export class AwbReleaseFromComponent extends NgcPage {
  @ViewChild('duplicateNameWindow') duplicateNameWindow: NgcWindowComponent;
  shipmentNumber: any;
  element: any;
  fetchValue: any;
  displaySearchContainer: boolean;
  customerIdData: any;
  customerIdDataDconsignee: any;
  displayNameAndComapany: boolean = false;
  displayNameAndComapanyInput: boolean = false;
  disabelValidateButton: boolean = false;
  reportParam: any;
  response: any;
  blocklisted: any;
  shipmentNumbers: any = [];
  confirmMesssage: boolean = false;
  saveFlag: boolean = false;
  validNamesUponValidate: any = [];
  isValidName: boolean = false;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    public importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    this.fetchValue = this.getNavigateData(this.activatedRoute);
    if (this.fetchValue !== null) {
      this.awbreleasefrom.get("customer").setValue(this.fetchValue[0].agent);
      this.awbreleasefrom.get("customerShortName").setValue(this.fetchValue[0].agentName);
      this.awbreleasefrom.get("shipmentNumber").patchValue([this.fetchValue[0].shipmentNumber]);
      this.customerIdData = this.fetchValue[0].customerId;
      this.getsearchValues();
    }
    // this.validateDocumentboxSubscription();
    this.validateaAutherizedReceiveFlagSubscription();
  }
  @ViewChild('reportWindow')
  @ViewChild('duplicateNamePopup') duplicateNamePopup: DuplicatenamepopupComponent;
  private reportWindow: NgcReportComponent;
  private awbreleasefrom: any = new NgcFormGroup({
    warehouseterminal: new NgcFormControl(""),
    customer: new NgcFormControl("", Validators.required),
    customerShortName: new NgcFormControl("", Validators.required),
    shipmentNumber: new NgcFormControl(),
    documentbox: new NgcFormControl(),
    airportPassValidation: new NgcFormControl(),

    icNumber: new NgcFormControl(),
    personelName: new NgcFormControl(),
    contractorName: new NgcFormControl("", [Validators.maxLength(70)]),
    reason: new NgcFormControl("", [Validators.maxLength(65)]),
    autherizedReceiveFlag: new NgcFormControl(),
    release: new NgcFormControl(),
    resultList: new NgcFormArray([
      new NgcFormGroup({
        hold: new NgcFormControl(),
        blacklist: new NgcFormControl(),
        select: new NgcFormControl(),
        svc: new NgcFormControl(""),
        awbNumber: new NgcFormControl(""),
        consignee: new NgcFormControl(""),
        appointedAgent: new NgcFormControl(""),
        flightinfo: new NgcFormControl(""),
        documentAttached: new NgcFormControl(""),
        documentPouch: new NgcFormControl(),
        documentType: new NgcFormControl(""),
        remarks: new NgcFormControl("", [Validators.maxLength(65)]),
        awbRemarkList: new NgcFormArray([])
      })
    ])
  });

  getsearchValues() {
    let documentbox = this.awbreleasefrom.get("documentbox").value;
    let personelName = this.awbreleasefrom.get("personelName").value;
    let contractorName = this.awbreleasefrom.get("contractorName").value;
    let autherizedReceiveFlag = this.awbreleasefrom.get('autherizedReceiveFlag').value;

    this.awbreleasefrom.get('reason').clearValidators();
    this.displaySearchContainer = false;
    this.confirmMesssage = false;
    this.shipmentNumbers = [];
    this.awbreleasefrom.validate();
    const requestParams: AWBReleaseSearch = new AWBReleaseSearch();
    let shipmentNumbersList: Awbnumber[] = [];

    requestParams.warehouseterminal = this.awbreleasefrom.get("warehouseterminal").value;
    if (this.awbreleasefrom.get("customer").value == 'IXX') {
      this.customerIdData = 'IXX';
    }
    this.reportParam = new Object();
    requestParams.customer = this.customerIdData;
    requestParams.customerShortName = this.awbreleasefrom.get("customerShortName").value;
    let shipmentNumbers = this.awbreleasefrom.getRawValue().shipmentNumber;
    let flag: boolean = false;
    if (this.awbreleasefrom.getRawValue().shipmentNumber.length == 0) {
      this.showErrorMessage("mandatory.field.not.empty");
      return;
    }
    if (this.awbreleasefrom.getRawValue().shipmentNumber.length > 10) {
      this.showErrorMessage("exceed.limit.of.shipmentNumber");
      return;
    }
    shipmentNumbers.forEach(element => {
      const awbNmber: Awbnumber = new Awbnumber();
      awbNmber.shipment = element;
      shipmentNumbersList.push(awbNmber);
      requestParams.shipmentNumbers = shipmentNumbersList
    });

    if (this.validateField()) {
      this.resetFormMessages();
      this.importService.getAwbReleaseForms(requestParams).subscribe(
        res => {
          if (!this.showResponseErrorMessages(res)) {
            if (res.data != null && res.data.length > 0) {
              this.saveFlag = true;
              this.response = res.data;
              let isDocumenotDone = 0;
              let documentNotDoneShipments = '';
              if (res.data != null && requestParams.shipmentNumbers.length > res.data.length) {
                this.showErrorMessage("awb.document.pending");
              }
              let consigneeArray = [];
              res.data.forEach(dataValue => {
                let array = dataValue.flightinfo.replace(" ", ",\n");
                if (dataValue.svc == "1") {
                  dataValue.svc = "Y";
                } else {
                  dataValue.svc = "N";
                }
                if (dataValue.onHold) {
                  dataValue.select = true;
                } else if (dataValue.blocklistid) {
                  dataValue.select = false;
                  dataValue.onHold = false;
                  dataValue.blacklist = 'Blacklisted'
                } else {
                  dataValue.select = true;
                  dataValue.onHold = false;
                }
                dataValue.flightinfodata = dataValue.flightinfo;
                if (dataValue.appointedAgent != null && dataValue.appointedAgent != this.awbreleasefrom.get("customer").value) {
                  this.confirmMesssage = true;
                  this.shipmentNumbers.push(dataValue.awbNumber);
                }
                if (this.awbreleasefrom.get("customer").value != null && this.awbreleasefrom.get("customer").value == 'IXX') {
                  consigneeArray.push(dataValue.consignee);
                }
                if (dataValue.appointedAgent == null) {
                  ++isDocumenotDone;
                  if (documentNotDoneShipments == '') {
                    documentNotDoneShipments = dataValue.awbNumber
                  } else {
                    documentNotDoneShipments = documentNotDoneShipments + ',' + dataValue.awbNumber
                  }
                }
              });
              if (isDocumenotDone > 0) {
                this.showErrorMessage("consignee.appointed.agent.not.found", '', [documentNotDoneShipments]);
                return;
              }
              if (this.confirmMesssage) {
                this.showConfirmMessage('appointed.agent.not.matching').then(reason => {
                  this.awbreleasefrom.get('autherizedReceiveFlag').setValue(true);
                  if (this.shipmentNumbers.length > 1) {
                    this.showMessage(NgcUtility.translateMessage("import.shipments.not.matching.appointed.agent", [this.shipmentNumbers]));
                  }
                }).catch(reason => {
                  this.displaySearchContainer = false;
                  this.awbreleasefrom.get('autherizedReceiveFlag').setValue(false);
                });
              }
              if (this.awbreleasefrom.get("customer").value == 'IXX') {
                if (consigneeArray.every((val, i, arr) => val === arr[0]) == false) {
                  this.showMessage('consignee.name.not.matching').then(reason => {
                    this.displaySearchContainer = false;
                    this.awbreleasefrom.get('autherizedReceiveFlag').setValue(false);
                  }).
                    catch(reason => {
                      this.displaySearchContainer = false;
                      this.awbreleasefrom.get('autherizedReceiveFlag').setValue(false);
                    });
                }
              }
              (<NgcFormArray>this.awbreleasefrom.get("resultList")).patchValue(res.data);
              this.awbreleasefrom.get('autherizedReceiveFlag').setValue(res.data[0].autherizedReceiveFlag);
              this.awbreleasefrom.get('reason').setValue(res.data[0].reason);
              this.awbreleasefrom.get("documentbox").setValue(documentbox);
              this.awbreleasefrom.get('autherizedReceiveFlag').setValue(autherizedReceiveFlag);
              this.awbreleasefrom.get("personelName").setValue(personelName);
              this.awbreleasefrom.get('contractorName').setValue(contractorName);
              this.validateDocumentboxSubscription(this.awbreleasefrom.get("documentbox").value);
              this.displaySearchContainer = true;
              this.onPersonelNameChangeManual();
            } else {
              this.showInfoStatus("no.record.found");
              this.displaySearchContainer = false;
            }
          }
        },
        error => {
          this.showErrorStatus("Error:" + error);
        }
      );
    }
  }
  onDisable() {
    let resultList: NgcFormArray = this.awbreleasefrom.get("resultList") as NgcFormArray;
    // Mark as Disabled
    if (resultList && resultList.length > 0) {
      resultList.controls.forEach((group: NgcFormGroup, index: number) => {
        if (group.get('documentAttached').value) {
          group.disable();
        }
      });
    }
  }

  onCompanyLOVSelect(object) {
    this.customerIdData = object.param1;
    this.customerIdDataDconsignee = object.param1;
    if (this.awbreleasefrom.get("customer").value == 'IXX') {
      this.awbreleasefrom.get("customer").setValue('IXX');
      this.awbreleasefrom.get('customerShortName').clearValidators();
    }
    this.displaySearchContainer = false;
    this.awbreleasefrom.get('customerShortName').setValue(object.desc);
  }

  resetForm(event) {

    //Clear the information
    if ((<NgcFormArray>this.awbreleasefrom.get("resultList"))) {
      (<NgcFormArray>this.awbreleasefrom.get("resultList")).resetValue([]);
    }

    if ((<NgcFormArray>this.awbreleasefrom.get("awbRemarkList"))) {
      (<NgcFormArray>this.awbreleasefrom.get("awbRemarkList")).resetValue([]);
    }

    this.awbreleasefrom.controls['personelName'].clearValidators();
    this.awbreleasefrom.controls['contractorName'].clearValidators();
    this.awbreleasefrom.controls['icNumber'].clearValidators();
    this.awbreleasefrom.controls['reason'].clearValidators();

    this.awbreleasefrom.get('autherizedReceiveFlag').setValue(false);
    this.awbreleasefrom.get('reason').setValue("");
    this.awbreleasefrom.get("documentbox").setValue(false);
    this.awbreleasefrom.get("personelName").setValue("");
    this.awbreleasefrom.get('contractorName').setValue("");
    this.awbreleasefrom.get("shipmentNumber").setValue("");
    this.awbreleasefrom.get("icNumber").setValue("");
  }

  onSave(event) {
    let formData = this.awbreleasefrom.getRawValue();
    let formdata = [];
    let transhipmentFlag: boolean = false;
    let awbNumber: any;

    formData.resultList.forEach(element => {
      if (element.select && !NgcUtility.isTenantCityOrAirport(element.destination)) {
        transhipmentFlag = true;
        awbNumber = element.awbNumber;
      }
      if (element.select == true) {
        if (element.documentAttached == true) {
          element.documentAttached = 1;
        } else {
          element.documentAttached = 0;
        }
        //setting values form formData values object for individual shipmentNumber
        element.documentbox = this.awbreleasefrom.get("documentbox").value
        if (element.documentbox === true) {
          if ((formData.icNumber != null && formData.icNumber != "") && this.awbreleasefrom.controls["icNumber"].valid) {
            this.showErrorMessage("ERROR_IC_CODE_CHR");
            (this.awbreleasefrom.get("icNumber") as NgcFormControl).focus();
            return;
          } else {
            element.icNumber = formData.icNumber;
          }
        } else {
          if ((formData.icNumber != null && formData.icNumber != "") && this.awbreleasefrom.controls["icNumber"].valid) {
            element.icNumber = formData.icNumber;
          } else {
            this.showErrorMessage("ERROR_IC_CODE_CHR");
            (this.awbreleasefrom.get("icNumber") as NgcFormControl).focus();
            return;
          }
        }
        if (element.documentbox === true) {
          if (formData.icNumber != null && formData.icNumber != "" &&
            (null == formData.personelName || formData.personelName.length < 4)) {
            (this.awbreleasefrom.get("personelName") as NgcFormControl).focus();
            this.showErrorMessage("ERROR_IC_NAME_CHR");
            return;
          } else {
            element.personelName = formData.personelName;
          }
        } else {
          if (null == formData.personelName || formData.personelName.length < 4) {
            (this.awbreleasefrom.get("personelName") as NgcFormControl).focus();
            this.showErrorMessage("ERROR_IC_NAME_CHR");
            return;
          } else {
            element.personelName = formData.personelName;
          }
        }
        element.contractorName = formData.contractorName;
        element.autherizedReceiveFlag = formData.autherizedReceiveFlag;
        element.reason = formData.reason;

        element.airportPassValidation = this.awbreleasefrom.get("airportPassValidation").value;
        formdata.push(element);
      }
    });

    if (transhipmentFlag) {
      this.showErrorMessage("awb.is.transhipment", "", [awbNumber]);
      formdata = [];
      return;
    }

    if (formdata.length == 0 && !transhipmentFlag) {
      this.showInfoStatus("import.info101");
      return;
    }

    if (this.awbreleasefrom.get("reason").invalid) {
      if (!this.isValidName) {
        this.showErrorMessage('please.enter.remarks.not.authorized');
      }
      else {
        this.showErrorMessage('mandatory.field.not.empty');
      }
      return;
    }

    this.resetFormMessages();
    if (formdata[0].documentbox == false) {
      if (formdata[0].icNumber != null && formdata[0].personelName != null) {
        formdata[0].customerCode = this.awbreleasefrom.get("customer").value;
        // this.importService.validateBlackListCustomer(formdata[0]).subscribe(response => {
        //   if (response.success === false) {
        //     if (response.messageList.length > 0) {
        //       var icName: string[] = [];
        //       icName.push(formdata[0].personelName);
        //       icName.push(formdata[0].icNumber);
        //       var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
        //       this.showErrorStatus(error + " " + response.messageList[0].message);
        //       return;
        //     }
        //   }

        //   if (!this.showResponseErrorMessages(response)) {
        //     this.importService.saveOrupdateRleaseForm(formdata).subscribe(
        //       res => {
        //         if (!this.showResponseErrorMessages(res)) {
        //           this.showSuccessStatus("g.completed.successfully");
        //           this.getsearchValues();
        //         }
        //       },
        //       error => {
        //         this.showErrorStatus("Error:" + error);
        //       }
        //     );
        //   }
        // });
      }
    } else {
      if ((formdata[0].icNumber != null && formdata[0].icNumber.length > 0)
        && (formdata[0].personelName != null && formdata[0].personelName.length > 0)) {
        formdata[0].customerCode = this.awbreleasefrom.get("customer").value;
        // this.importService.validateBlackListCustomer(formdata[0]).subscribe(response => {
        //   if (response.success === false) {
        //     if (response.messageList.length > 0) {
        //       var icName: string[] = [];
        //       icName.push(formdata[0].personelName);
        //       icName.push(formdata[0].icNumber);
        //       var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
        //       this.showErrorStatus(error + " " + response.messageList[0].message);
        //       return;
        //     }
        //   }

        //   if (!this.showResponseErrorMessages(response)) {
        //     this.importService.saveOrupdateRleaseForm(formdata).subscribe(
        //       res => {
        //         if (!this.showResponseErrorMessages(res)) {
        //           this.showSuccessStatus("g.completed.successfully");
        //           this.getsearchValues();
        //         }
        //       },
        //       error => {
        //         this.showErrorStatus("Error:" + error);
        //       }
        //     );
        //   }
        // });
      } else {
        this.importService.saveOrupdateRleaseForm(formdata).subscribe(
          res => {
            if (!this.showResponseErrorMessages(res)) {
              this.showSuccessStatus("g.completed.successfully");
              this.getsearchValues();
            }
          },
          error => {
            this.showErrorStatus("Error:" + error);
          }
        );
      }
    }

  }

  getAgentCode(event) {
    return event.code;
  }

  releaseAwbForm() {
    if (this.awbreleasefrom.invalid) {
      if (this.awbreleasefrom.get("reason").invalid && !this.isValidName) {
        this.showErrorMessage('please.enter.remarks.not.authorized');
        return;
      }
      else if (this.awbreleasefrom.get("icNumber") && !this.awbreleasefrom.controls["icNumber"].valid) {
        this.showErrorMessage("ERROR_IC_CODE_CHR");
        (this.awbreleasefrom.get("icNumber") as NgcFormControl).focus();
        return;
      }
      else {
        this.showErrorMessage('mandatory.field.not.empty');
      }

      return;
    }
    if (this.confirmMesssage && (!this.awbreleasefrom.get("autherizedReceiveFlag").value
      && !this.awbreleasefrom.get("documentbox").value)) {
      this.showErrorMessage('agent.document.box.must.select');
      return;
    }
    this.awbreleasefrom.validate();
    let formData = this.awbreleasefrom.getRawValue();
    let formdata = [];
    let requestData;
    let transhipmentFlag: boolean = false;
    let awbNumber: any;
    formData.resultList.forEach(element => {
      if (element.select && !NgcUtility.isTenantCityOrAirport(element.destination)) {
        transhipmentFlag = true;
        awbNumber = element.awbNumber
      }
      if (element.select == true) {
        if (element.documentAttached == true) {
          element.documentAttached = 1;
        } else {
          element.documentAttached = 0;
        }
        //setting values form formData values object for individual shipmentNumber
        if (this.shipmentNumbers != null && this.shipmentNumbers > 0) {
          this.shipmentNumbers.forEach(shipemnt => {
            if (shipemnt == element.awbNumber) {
              element.autherizedReceiveFlag = formData.autherizedReceiveFlag;
              element.reason = formData.reason;
            }
          });
        } else {
          element.autherizedReceiveFlag = formData.autherizedReceiveFlag;
          element.reason = formData.reason;
        }
        element.releasedOn = element.releasedOn;
        element.documentbox = this.awbreleasefrom.get("documentbox").value;
        if (element.documentbox === true) {
          if ((formData.icNumber != null && formData.icNumber != "") && this.awbreleasefrom.controls["icNumber"].valid) {
            this.showErrorMessage("ERROR_IC_CODE_CHR");
            (this.awbreleasefrom.get("icNumber") as NgcFormControl).focus();
            return;
          } else {
            element.icNumber = formData.icNumber;
          }
        } else {
          if ((formData.icNumber != null && formData.icNumber != "") && this.awbreleasefrom.controls["icNumber"].valid) {
            element.icNumber = formData.icNumber;
          } else {
            this.showErrorMessage("ERROR_IC_CODE_CHR");
            (this.awbreleasefrom.get("icNumber") as NgcFormControl).focus();
            return;
          }
        }
        if (element.documentbox === true) {
          if (formData.icNumber != null && formData.icNumber != "" &&
            (null == formData.personelName || formData.personelName.length < 4)) {
            (this.awbreleasefrom.get("personelName") as NgcFormControl).focus();
            this.showErrorMessage("ERROR_IC_NAME_CHR");
            return;
          } else {
            element.personelName = formData.personelName;
          }
        } else {
          if (null == formData.personelName || formData.personelName.length < 4) {
            (this.awbreleasefrom.get("personelName") as NgcFormControl).focus();
            this.showErrorMessage("ERROR_IC_NAME_CHR");
            return;
          } else {
            element.personelName = formData.personelName;
          }
        }
        element.contractorName = formData.contractorName;

        element.airportPassValidation = this.awbreleasefrom.get("airportPassValidation").value;

        element.cusCode = this.customerIdDataDconsignee;
        element.appointedAgent = this.awbreleasefrom.get("customer").value;
        requestData = element;
        formdata.push(element);
      }
    });

    if (transhipmentFlag) {
      this.showErrorMessage("awb.is.transhipment", "", [awbNumber]);
      formdata = [];
      return;
    }
    if (formdata.length == 0 && !transhipmentFlag) {
      this.showInfoStatus("import.info101");
      return;
    }
    if (this.validateFieldRelease()) {
      if (requestData.releasedOn != null) {
        this.showConfirmMessage('document.already.released').then(reason => {
          this.serviceCall(formdata);
        });
      } else {
        this.serviceCall(formdata);
      }
    }

  }

  serviceCall(formdata) {
    this.resetFormMessages();
    if ((formdata[0].icNumber != null && formdata[0].icNumber.length > 0)
      && (formdata[0].personelName != null && formdata[0].personelName.length > 0)) {
      formdata[0].customerCode = this.awbreleasefrom.get("customer").value;
      // this.importService.validateBlackListCustomer(formdata[0]).subscribe(response => {
      //   if (response.success === false) {
      //     if (response.messageList.length > 0) {
      //       var icName: string[] = [];
      //       icName.push(formdata[0].personelName);
      //       icName.push(formdata[0].icNumber);
      //       var error = NgcUtility.translateMessage(response.messageList[0].code, icName);
      //       this.showErrorStatus(error + " " + response.messageList[0].message);
      //       return;
      //     }
      //   }

      //   if (!this.showResponseErrorMessages(response)) {
      //     this.importService.awbRleaseForms(formdata).subscribe(
      //       res => {
      //         if (!this.showResponseErrorMessages(res)) {
      //           this.showSuccessStatus("g.completed.successfully");
      //           this.getsearchValues();
      //         }
      //       },
      //       error => {
      //         this.showErrorStatus("Error:" + error);
      //       }
      //     );
      //   }
      // });
    } else {
      this.importService.awbRleaseForms(formdata).subscribe(
        res => {
          if (!this.showResponseErrorMessages(res)) {
            this.showSuccessStatus("g.completed.successfully");
            this.getsearchValues();
          }
        },
        error => {
          this.showErrorStatus("Error:" + error);
        }
      );
    }
    // this.importService.awbRleaseForms(requestData).subscribe(
    //   res => {
    //     if (!this.showResponseErrorMessages(res)) {
    //       this.showSuccessStatus("g.completed.successfully");
    //       this.getsearchValues();
    //     }
    //   },
    //   error => {
    //     this.showErrorStatus("Error:" + error);
    //   }
    // );
  }

  validateIcOrAirportPass(search) {
    let formData = this.awbreleasefrom.getRawValue();
    let formdata = [];
    let consigneeName;
    this.validNamesUponValidate.length = 0;
    this.isValidName = false;
    formData.customerCode = this.awbreleasefrom.get("customer").value;
    if (formData.customerCode == 'IXX') {
      formData.resultList.forEach(element => {
        consigneeName = element.consignee;
      });
      formData.consignee = consigneeName;
    }

    if (!this.awbreleasefrom.get('icNumber').value) {
      this.showFormControlErrorMessage(<NgcFormControl>this.awbreleasefrom.get('icNumber'), 'g.mandatory');
      return;
    }
    if (!this.awbreleasefrom.get('icNumber').valid) {
      return;
    }
    else {
      this.resetFormMessages();
      this.importService.validateIcOrAirportPass(formData).subscribe(
        res => {
          if (!this.showResponseErrorMessages(res)) {
            if (res.data != null && res.data.authorizedPersonDetailList.length == 1) {
              (this.awbreleasefrom.get('personelName') as NgcFormControl).focus();
              this.awbreleasefrom.get("personelName").setValue(res.data.authorizedPersonDetailList[0].authorizedPersonnelName);
              this.awbreleasefrom.get("contractorName").setValue(res.data.authorizedPersonDetailList[0].customerShortName);
              this.resetReasonField();
              this.awbreleasefrom.get('airportPassValidation').setValue('Pass (Y)')
              this.displayNameAndComapany = false;
              this.displayNameAndComapanyInput = true;
              this.validNamesUponValidate.push(res.data.authorizedPersonDetailList[0].authorizedPersonnelName);
              this.isValidName = true;
              this.onPersonelNameChangeManual();
            } else if (res.data != null && res.data.authorizedPersonDetailList.length > 1) {
              res.data.authorizedPersonDetailList.forEach(authorizedPerson => {
                this.validNamesUponValidate.push(authorizedPerson.authorizedPersonnelName);
              });
              this.isValidName = true;
              this.duplicateNamePopup.open(res.data.authorizedPersonDetailList);
            }
            else {
              if (search == false) {
                this.showConfirmMessage('personnel.not.registered').then(reason => {
                  this.awbreleasefrom.get('personelName').reset();
                  (this.awbreleasefrom.get('personelName') as NgcFormControl).focus();
                  this.awbreleasefrom.get("contractorName").reset();
                  this.awbreleasefrom.controls['personelName'].setValidators([Validators.maxLength(35), Validators.required]);
                  this.resetReasonField();
                  this.awbreleasefrom.get('airportPassValidation').setValue('Fail (N)')
                  this.displayNameAndComapanyInput = true;
                  this.displayNameAndComapany = false;
                }).catch(reason => {
                  this.displayNameAndComapanyInput = false;
                  (this.awbreleasefrom.get('icNumber') as NgcFormControl).focus();
                });
              }
            }
          }
        },
        error => {
          this.showErrorStatus("Error:" + error);
        }
      );
    }
  }
  onConfirmNewEntry(boolean) {
    this.awbreleasefrom.get('personelName').reset();
    this.awbreleasefrom.get("contractorName").reset();
    this.awbreleasefrom.controls['personelName'].setValidators([Validators.maxLength(35), Validators.required]);
    this.awbreleasefrom.get('airportPassValidation').setValue('Pass (Y)')
    this.displayNameAndComapanyInput = true;
    this.displayNameAndComapany = false;
    (this.awbreleasefrom.get('personelName') as NgcFormControl).focus();
  }

  onNameSelect(selectedName) {
    this.awbreleasefrom.get('personelName').setValue(selectedName.authorizedPersonnelName);
    this.awbreleasefrom.get('contractorName').setValue(selectedName.customerShortName);
    this.awbreleasefrom.get('airportPassValidation').setValue('Pass (Y)');
    this.displayNameAndComapanyInput = true;
    this.displayNameAndComapany = false;
    this.onPersonelNameChangeManual();
    (this.awbreleasefrom.get('personelName') as NgcFormControl).focus();
  }
  onChangeIC(event) {
    this.awbreleasefrom.get('airportPassValidation').setValue('Fail (N)');
    this.awbreleasefrom.get('personelName').setValue("");
    this.awbreleasefrom.get('contractorName').setValue("");
  }

  validateDocumentboxSubscription(data) {
    if (data) {
      this.displayNameAndComapany = false;
      this.displayNameAndComapanyInput = true;
      this.disabelValidateButton = true;
      if (this.awbreleasefrom.get("customer").value == 'IXX') {
        this.awbreleasefrom.controls['personelName'].setValidators([Validators.maxLength(35), Validators.required]);
        this.awbreleasefrom.controls['icNumber'].setValidators([Validators.maxLength(12), Validators.required]);
      } else {
        this.awbreleasefrom.controls['personelName'].clearValidators();
        this.awbreleasefrom.controls['contractorName'].clearValidators();
        this.awbreleasefrom.controls['icNumber'].clearValidators();
        this.awbreleasefrom.controls['reason'].clearValidators();
        this.awbreleasefrom.get('autherizedReceiveFlag').setValue(false);
      }
    } else {
      this.disabelValidateButton = false;
      this.awbreleasefrom.controls['personelName'].setValidators([Validators.maxLength(35), Validators.required]);
      this.awbreleasefrom.controls['icNumber'].setValidators([Validators.maxLength(12), Validators.required]);
    }
  }


  validateaAutherizedReceiveFlagSubscription() {
    this.awbreleasefrom.controls['autherizedReceiveFlag'].valueChanges.subscribe(data => {
      if (data && this.confirmMesssage) {
        this.awbreleasefrom.controls['reason'].setValidators([Validators.maxLength(65), Validators.required]);
      } else if (data && !this.confirmMesssage) {
        this.awbreleasefrom.controls['reason'].setValidators([Validators.maxLength(65), Validators.required]);
      } else if (!this.validNamesUponValidate.includes(this.awbreleasefrom.get('personelName').value)) {
        this.awbreleasefrom.controls['reason'].setValidators([Validators.maxLength(65), Validators.required]);
      } else {
        this.awbreleasefrom.controls['reason'].clearValidators();
      }
      (<NgcFormControl>this.awbreleasefrom.get("reason")).updateValueAndValidity();
    });
  }

  validateField() {
    return this.awbreleasefrom.get("customer").valid &&
      this.awbreleasefrom.get("customerShortName").valid
      ? true
      : false;
  }

  validateFieldRelease() {
    return this.awbreleasefrom.get("icNumber").valid &&
      this.awbreleasefrom.get("personelName").valid
      ? true : false;
  }

  resetReasonField() {
    this.awbreleasefrom.get("reason").reset();
    this.awbreleasefrom.controls['reason'].clearValidators();
    (<NgcFormControl>this.awbreleasefrom.get("reason")).updateValueAndValidity();
  }

  onPersonelNameChange(event) {
    if (event.target.value != "" && !this.validNamesUponValidate.includes(event.target.value.toUpperCase())) {
      this.awbreleasefrom.controls['reason'].setValidators([Validators.maxLength(65), Validators.required]);
      this.isValidName = false;
    }
    else {
      this.awbreleasefrom.controls['reason'].clearValidators();
      this.isValidName = true;
    }
    (<NgcFormControl>this.awbreleasefrom.get("reason")).updateValueAndValidity();
  }

  onPersonelNameChangeManual() {
    if (this.awbreleasefrom.get('personelName').value && !this.validNamesUponValidate.includes(this.awbreleasefrom.get('personelName').value)) {
      this.awbreleasefrom.controls['reason'].setValidators([Validators.maxLength(65), Validators.required]);
      this.isValidName = false;
    }
    else {
      this.awbreleasefrom.controls['reason'].clearValidators();
      this.isValidName = true;
    }
    (<NgcFormControl>this.awbreleasefrom.get("reason")).updateValueAndValidity();
  }

}

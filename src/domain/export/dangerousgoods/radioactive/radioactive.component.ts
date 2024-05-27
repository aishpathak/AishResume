import { SearchShipmentNumberForReuse } from "./../../../awbManagement/awbManagement.shared";
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import {
  NgcFormGroup,
  NgcFormControl,
  NgcPage,
  NgcUtility,
  NgcFormArray,
  NgcWindowComponent,
  PageConfiguration,
  NgcReportComponent
} from "ngc-framework";
import { Validators } from "@angular/forms";
import {
  DgdAWBNumber,
  DgdDetails,
  DgdRefNumber,
  SearchDgregulations,
  SearchRegulation,
  EliElmSavRequest
} from "../../export.sharedmodel";
import { DangerousgoodsService } from "../dangerousgoods.service";
import { ResponseContentType } from "@angular/http";
@Component({
  selector: "app-radioactive",
  templateUrl: "./radioactive.component.html",
  styleUrls: ["./radioactive.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class RadioactiveComponent extends NgcPage {
  @ViewChild("overpackWindow") overpackWindow: NgcWindowComponent;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild("eliElmWindow") eliElmWindow: NgcWindowComponent;
  isDGDDetails: boolean = false;
  shipmentFlag: boolean = true;
  isAddDgdDocFlag: boolean = false;
  searchResponse: any;
  transhipmentSearchResponse: any;
  shpCountryCodeParam: any;
  packingGroup: any;
  conCountryCodeParam: any;
  dgRegulationRes: any;
  reportParameters: any;
  dgRegulationId: any;
  dgdReferenceArray: any[];
  counter: number;
  allNumbers: any[];
  clearDataFlag: boolean = false;
  // search = new SearchDgregulations();
  search = new SearchRegulation();
  closeBtn: boolean = false;
  autoOrManualFlag: boolean = false;
  transhipmentFlag: boolean = false;
  flightTypeDropDown: any[];
  aircraftType: any;
  dontDisplayReferenceNumber: boolean = false;
  aircraftTypeFromSearch: any;

  /**
   * Initialize
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private dangerousgoodsService: DangerousgoodsService,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  private dgdRadioActiveForm: NgcFormGroup = new NgcFormGroup({

    searchRemarkDetails: new NgcFormGroup({
      impcode: new NgcFormControl(),
      dgRegulationId: new NgcFormControl(),

    }

    ),

    searchFormGroup: new NgcFormGroup({
      shipmentNumber: new NgcFormControl("")
    }),
    dgdRefernceForm: new NgcFormGroup({
      dgdReferenceNo: new NgcFormControl(),
      awbNumber: new NgcFormControl("")
    }),
    dgdDetailsForm: new NgcFormGroup({
      checkAll: new NgcFormControl(false),
      expDgShipperDeclarationId: new NgcFormControl(),
      dgdReferenceNo: new NgcFormControl(),
      shipperCustomerId: new NgcFormControl(),
      shipperCustomerCode: new NgcFormControl(),
      consigneeCustomerId: new NgcFormControl(),
      consigneeCustomerCode: new NgcFormControl(),
      shipmentNumber: new NgcFormControl(""),
      shipperName: new NgcFormControl(""),
      shipperAddress1: new NgcFormControl(""),
      shipperAddress2: new NgcFormControl(),
      shipperPlace: new NgcFormControl(""),
      shipperPostalCode: new NgcFormControl(""),
      consigneeName: new NgcFormControl(""),
      consigneeAddress1: new NgcFormControl(""),
      consigneeAddress2: new NgcFormControl(),
      consigneePlace: new NgcFormControl(""),
      consigneePostalCode: new NgcFormControl(""),
      departureAirport: new NgcFormControl(),
      destinationAirport: new NgcFormControl(),
      shipperCityCode: new NgcFormControl(),
      shipperStateCode: new NgcFormControl(""),
      shipperCountryCode: new NgcFormControl(""),
      consigneeCityCode: new NgcFormControl(),
      consigneeStateCode: new NgcFormControl(""),
      consigneeCountryCode: new NgcFormControl(""),
      aircraftType: new NgcFormControl(),
      aircraftType1: new NgcFormControl(),
      aircraftType2: new NgcFormControl(),
      shipmentRadioactiveFlag: new NgcFormControl(),
      shipmentRadioactiveFlag1: new NgcFormControl(),
      shipmentRadioactiveFlag2: new NgcFormControl(),
      additionalHandlingInformation: new NgcFormControl(),
      declarationDetails: new NgcFormArray([
        new NgcFormGroup({
          dgRegulationId: new NgcFormControl(),
          impshc: new NgcFormControl(""),
          unidnumber: new NgcFormControl(),
          dgSubriskCode1: new NgcFormControl(),
          dgSubriskCode2: new NgcFormControl(),
          packingInstructionCategory: new NgcFormControl(),
          packingGroupCode: new NgcFormControl(),
          packagePieces: new NgcFormControl(),
          packageQuantity: new NgcFormControl(),
          packingType: new NgcFormControl(),
          packingInstructions: new NgcFormControl(),
          authorizationDetail: new NgcFormControl(),
          apioNumber: new NgcFormControl(),
          properShippingName: new NgcFormControl(),
          dgclassCode: new NgcFormControl(),
          transportIndex: new NgcFormControl(),
          packingDimension1: new NgcFormControl(),
          packingDimension2: new NgcFormControl(),
          packingDimension3: new NgcFormControl(),
          overPackDelimStr: new NgcFormControl(),
          selectCheckBox: new NgcFormControl(),
          overPackDetails: new NgcFormArray([]),
          remarks: new NgcFormControl(),
          shc: new NgcFormControl(),
          unidnumberdata: new NgcFormControl(),
          oldregid: new NgcFormControl(),
          pgList: new NgcFormControl("")

        })
      ])
    }),
    dgdOverpackPopupForm: new NgcFormGroup({
      expDgShipperDeclarationId: new NgcFormControl(),
      dgdReferenceNo: new NgcFormControl(),
      dgRegulationId: new NgcFormControl(),
      overpackNumber: new NgcFormControl(),

      autoManualFlag: new NgcFormControl(),
      manualOvp: new NgcFormControl(),
      generateOvp: new NgcFormControl()
    }),

    eliElmFormGroup: new NgcFormGroup({
      // checkAllEliElm: new NgcFormControl(false),
      eliElmFormDetails: new NgcFormArray([
        new NgcFormGroup({
          selectEliCheckBox: new NgcFormControl(),
          eliElm: new NgcFormControl(),
          flightType: new NgcFormControl(),
          piData: new NgcFormControl(),
          forbiddenFlag: new NgcFormControl(false),
          remark: new NgcFormControl()
        })
      ])
    })
  });
  showFlag: boolean = false;
  searchFlag: boolean = false;
  addFlag: boolean = false;
  shipperCity: any;
  consigneeCity: any;
  deleteArray: any;
  deleteEliArray: any;
  addDGbutton: boolean = false;
  forwardedData: any;

  ngOnInit() {
    super.ngOnInit();
    this.allNumbers = new Array();
    this.dontDisplayReferenceNumber = false;
    this.dgdRadioActiveForm
      .get("dgdDetailsForm")
      .get("checkAll")
      .valueChanges.subscribe(a => {
        if (a) {
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("declarationDetails")
            .value.forEach(aa => {
              aa["selectCheckbox"] = true;
            });
        }
      });
    // this.dgdRadioActiveForm
    //   .get("eliElmFormGroup")
    //   .get("checkAllEliElm")
    //   .valueChanges.subscribe(a => {
    //     if (a) {
    //       this.dgdRadioActiveForm
    //         .get("eliElmFormGroup")
    //         .get("eliElmFormDetails")
    //         .value.forEach(aa => {
    //           aa["selectEliCheckBox"] = true;
    //         });
    //     }
    //   });

    this.dgdRadioActiveForm
      .get("dgdOverpackPopupForm")
      .get("generateOvp")
      .patchValue(true);
    this.dgdRadioActiveForm
      .get("dgdOverpackPopupForm")
      .get("autoManualFlag")
      .patchValue("S");





    this.flightTypeDropDown = new Array();
    this.flightTypeDropDown.push('PAX');
    this.flightTypeDropDown.push('CAO');

    let forwardedData = this.getNavigateData(this.activatedRoute);
    this.forwardedData = this.getNavigateData(this.activatedRoute);

    console.log("forwardedData", forwardedData);
    if (forwardedData != null) {
      this.dgdRadioActiveForm.get(["searchFormGroup", "shipmentNumber"]).patchValue(forwardedData.shipmentNumber);
      this.onSearch();
    }
  }

  ngAfterViewInit() {
    console.log("dfd");
    super.ngAfterViewInit();
    this.allNumbers = new Array();

    this.dgdRadioActiveForm
      .get("dgdDetailsForm")
      .get("aircraftType1")
      .valueChanges.subscribe(a => {
        if (a) {
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("aircraftType")
            .patchValue("PAX");
        }
      });

    this.dgdRadioActiveForm
      .get("dgdDetailsForm")
      .get("aircraftType2")
      .valueChanges.subscribe(a => {
        if (a) {
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("aircraftType")
            .patchValue("CAO");
        }
      });

    this.dgdRadioActiveForm
      .get("dgdOverpackPopupForm")
      .get("manualOvp")
      .valueChanges.subscribe(a => {
        if (a) {
          this.autoOrManualFlag = true;
          this.dgdRadioActiveForm
            .get("dgdOverpackPopupForm")
            .get("autoManualFlag")
            .patchValue("M");
          this.dgdRadioActiveForm
            .get(["dgdOverpackPopupForm", "overpackNumber"])
            .reset();
        }
      });

    this.dgdRadioActiveForm
      .get("dgdOverpackPopupForm")
      .get("generateOvp")
      .valueChanges.subscribe(a => {
        if (a) {
          this.autoOrManualFlag = false;
          this.dgdRadioActiveForm
            .get("dgdOverpackPopupForm")
            .get("autoManualFlag")
            .patchValue("S");
          this.dgdRadioActiveForm
            .get(["dgdOverpackPopupForm", "overpackNumber"])
            .reset();
        }
      });

    this.dgdRadioActiveForm
      .get("dgdDetailsForm")
      .get("shipmentRadioactiveFlag1")
      .valueChanges.subscribe(flagValue => {
        if (flagValue === true) {
          this.shipmentFlag = true;
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("shipmentRadioactiveFlag")
            .patchValue("RAD");
        }
      });

    this.dgdRadioActiveForm
      .get("dgdDetailsForm")
      .get("shipmentRadioactiveFlag2")
      .valueChanges.subscribe(flagValue => {
        if (flagValue === true) {
          this.shipmentFlag = false;
          this.dgdRadioActiveForm
            .get("dgdDetailsForm")
            .get("shipmentRadioactiveFlag")
            .patchValue("NON");
        }
      });
  }

  onSearch() {
    this.addFlag = false;
    this.searchFlag = false;
    this.isAddDgdDocFlag = false;
    this.searchResponse = "";
    this.dgdReferenceArray = new Array();
    // this.dgdReferenceArray.push("Select");
    const searchFormGroup: NgcFormGroup = <NgcFormGroup>(
      this.dgdRadioActiveForm.get("searchFormGroup")
    );
    searchFormGroup.validate();
    if (this.dgdRadioActiveForm.get("searchFormGroup").invalid) {
      return;
    }
    const req: DgdAWBNumber = new DgdAWBNumber();
    req.flagCRUD = "C";
    req.shipmentNumber = searchFormGroup.get("shipmentNumber").value;
    req.dgdReferenceNo = 0;

    this.resetFormMessages();
    this.dangerousgoodsService.getDGDDetails(req).subscribe(
      response => {
        if (response.data.length == 0) {
          this.showInfoStatus("export.no.dg.details.found");


          this.isDGDDetails = false;
          this.showFlag = true;
          this.searchResponse = "";
          var shipmentNo = this.dgdRadioActiveForm.get([
            "searchFormGroup",
            "shipmentNumber"
          ]).value;
          this.dgdRadioActiveForm
            .get(["dgdRefernceForm", "awbNumber"])
            .patchValue(req.shipmentNumber);
        } else {

          this.showFlag = true;
          this.isAddDgdDocFlag = true;
          this.isDGDDetails = true;
          this.searchResponse = response.data;
          this.dgdRadioActiveForm
            .get(["dgdRefernceForm", "awbNumber"])
            .patchValue(req.shipmentNumber);
          this.dgdReferenceArray = new Array();
          // this.dgdReferenceArray.push("Select");
          // this.searchResponse.forEach(element => {
          //   this.dgdReferenceArray.push(element.dgdReferenceNo);
          // });

          if (this.searchResponse) {
            this.searchResponse.forEach(element => {
              if (
                element.dgdReferenceNo != null &&
                element.dgdReferenceNo != -1
              ) {
                // this.transhipmentFlag = false;
                this.dgdReferenceArray.push(element.dgdReferenceNo);
                this.addDGbutton = true;
              } else {
                this.transhipmentFlag = true;
                this.transhipmentSearchResponse = response.data;
                this.addDGbutton = false;
                this.getDGDDataByRefNo(1);
              }
            });
          }
          (<NgcFormArray>(
            this.dgdRadioActiveForm.get(["dgdRefernceForm", "dgdReferenceNo"])
          )).patchValue(this.dgdReferenceArray);


        }
      },
      error => {
        this.showErrorStatus("Error:" + error);
      }
    );
  }


  checkForInput(event) {
    this.closeBtn = true;
    this.dgdRadioActiveForm
      .get("dgdOverpackPopupForm")
      .get("autoManualFlag")
      .patchValue("M");
  }

  changeShipperCityCode(item) {
    this.shipperCity = item.code;
  }

  changeConsigneeCityCode(item) {
    this.consigneeCity = item.code;
  }

  onCancelEliElmDetails() {
    this.eliElmWindow.close();
    this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails"]).reset();
  }



  saveEliElmDetails() {
    const eliElmFormGroup: NgcFormGroup = <NgcFormGroup>(this.dgdRadioActiveForm.get("eliElmFormGroup"));

    eliElmFormGroup.validate();
    if (this.dgdRadioActiveForm.get("eliElmFormGroup").invalid) {
      return;
    }

    // let eliSaveReq: any;
    // eliSaveReq = this.dgdRadioActiveForm.getRawValue();
    // eliSaveReq.eliElmFormGroup.shipmentNumber = this.dgdRadioActiveForm.get(["searchFormGroup", "shipmentNumber"]).value;
    let eliSaveReq = new EliElmSavRequest();
    eliSaveReq.shipmentNumber = this.dgdRadioActiveForm.get(["searchFormGroup", "shipmentNumber"]).value;
    eliSaveReq.eliElmFormDetails = [];
    eliSaveReq.eliElmFormDetails = eliElmFormGroup.getRawValue().eliElmFormDetails;
    //this.dgdRadioActiveForm.get(["eliElmFormGroup","eliElmFormDetails"]).value;

    this.dangerousgoodsService.saveDGDEliElmDetails(eliSaveReq).subscribe(response => {
      if (!this.showResponseErrorMessages(response, null, "eliElmFormGroup")) {
        this.addEliElmData();
        this.showSuccessStatus("g.completed.successfully");
      }
    });

    let elidelReq2: any = this.dgdRadioActiveForm.getRawValue();
    elidelReq2.eliElmFormGroup.eliElmFormDetails = this.deleteEliArray;
    elidelReq2.eliElmFormGroup.shipmentNumber = this.dgdRadioActiveForm.get(["searchFormGroup", "shipmentNumber"]).value;
    console.log("this.deleteEliArray", this.deleteEliArray)


    if (elidelReq2.eliElmFormGroup.eliElmFormDetails) {
      this.dangerousgoodsService.deleteDGDEliElmDetails(elidelReq2.eliElmFormGroup).subscribe(response => {
        if (response.data == null) {
        } else {
          this.deleteEliArray = new Array();
        }
      });
    }

  }



  onDeleteRow(item) {
    this.deleteArray = [];
    let select: any = this.dgdRadioActiveForm.get([
      "dgdDetailsForm",
      "declarationDetails"
    ]).value;
    let index = 0;
    select.forEach(a => {
      if (a["selectCheckBox"]) {
        a["flagCRUD"] = "D";
        this.deleteArray.push(a);
        (<NgcFormArray>(
          this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails"])
        )).removeAt(index);
      } else {
        index++;
      }
    });

    let req2: any = this.dgdRadioActiveForm.getRawValue();
    req2.dgdDetailsForm.declarationDetails = this.deleteArray;
    req2.dgdDetailsForm.shipmentNumber = this.dgdRadioActiveForm.get([
      "searchFormGroup",
      "shipmentNumber"
    ]).value;
    var i = 0;
    /*
    req2.dgdDetailsForm.declarationDetails.forEach(element => {
      req2.dgdDetailsForm.declarationDetails[i].unidnumber = this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", i, "unidnumberdata"]).value;
      i++;
    });
    */
    // req2.dgdDetailsForm.flagCRUD = "D";
    if (req2.dgdDetailsForm.declarationDetails.length > 0) {
      this.dangerousgoodsService
        .deleteDgDecDetails(req2.dgdDetailsForm)
        .subscribe(response => {
          if (response.data == null) {
            // this.showErrorStatus(response.messageList[0].message);
            this.isDGDDetails = false;
          } else {
            this.deleteArray = new Array();
          }
        });
    }
  }


  onDeleteEliRow(item) {
    this.deleteEliArray = [];
    let select: any = this.dgdRadioActiveForm.get([
      "eliElmFormGroup",
      "eliElmFormDetails"
    ]).value;
    let index = 0;
    select.forEach(a => {
      if (a["selectEliCheckBox"]) {
        a["flagCRUD"] = "D";
        this.deleteEliArray.push(a);
        (<NgcFormArray>(
          this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails"])
        )).removeAt(index);
      } else {
        index++;
      }
    });
  }



  getDGDDataByRefNo(event) {
    let dgdRefNumber = event;

    // if (dgdRefNumber == "Select" || dgdRefNumber.length > 1) {
    if (dgdRefNumber == "Select") {
      this.searchFlag = false;
    } else {
      this.searchFlag = true;
    }
    console.log("flag", this.searchFlag);
    this.getOverPackSeqNo();
    this.dgdRadioActiveForm.get("dgdDetailsForm").reset();
    if (this.searchResponse.additionalHandlingInformation) {
      this.dgdRadioActiveForm.get(["dgdDetailsForm", "additionalHandlingInformation"]).patchValue(this.searchResponse.additionalHandlingInformation);
    }
    this.searchResponse.forEach(dgdRecObj => {
      if (dgdRecObj.dgdReferenceNo == dgdRefNumber) {
        if (dgdRecObj.aircraftType == "PAX") {
          this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType1").patchValue(true);
          this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType2").patchValue(false);
          dgdRecObj.aircraftType1 = true;
          dgdRecObj.aircraftType2 = false;
          this.aircraftTypeFromSearch = dgdRecObj.aircraftType;
        } else if (dgdRecObj.aircraftType == "CAO") {
          this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType2").patchValue(true);
          this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType1").patchValue(false);
          dgdRecObj.aircraftType1 = false;
          dgdRecObj.aircraftType2 = true;
          this.aircraftTypeFromSearch = dgdRecObj.aircraftType;
        }
        if (dgdRecObj.shipmentRadioactiveFlag == "RAD") {
          this.dgdRadioActiveForm.get("dgdDetailsForm").get("shipmentRadioactiveFlag1").patchValue(true);
          this.dgdRadioActiveForm.get("dgdDetailsForm").get("shipmentRadioactiveFlag2").patchValue(false);
        } else if (dgdRecObj.shipmentRadioactiveFlag == "NON") {
          this.dgdRadioActiveForm.get("dgdDetailsForm").get("shipmentRadioactiveFlag2").patchValue(true);
          this.dgdRadioActiveForm.get("dgdDetailsForm").get("shipmentRadioactiveFlag1").patchValue(false);
        }

        dgdRecObj.checkAll = false;

        // if (dgdRecObj.shipperCustomerId) {
        //   this.dgdRadioActiveForm.get(['dgdDetailsForm', 'shipperCustomerId']).patchValue(dgdRecObj.shipperCustomerId);
        // }

        if (dgdRecObj.declarationDetails.length == 0) {
          this.dgdRadioActiveForm.get("dgdDetailsForm").patchValue(dgdRecObj);
        }
        // this.dgdRadioActiveForm.get('dgdDetailsForm').patchValue(dgdRecObj);
        dgdRecObj.declarationDetails.forEach((decDtlRecObj, index) => {
          decDtlRecObj["selectCheckBox"] = false;
          decDtlRecObj["overPackDelimStr"] = "";
          decDtlRecObj.overPackDetails.forEach(dtlOvrPackObj => {
            if (decDtlRecObj.overPackDelimStr === "") {
              decDtlRecObj.overPackDelimStr = dtlOvrPackObj.overpackNumber;
            } else {
              decDtlRecObj.overPackDelimStr += "," + dtlOvrPackObj.overpackNumber;
            }
            if (dgdRecObj.autoManualFlag == "S") {
              this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("generateOvp").patchValue(true);
              this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("manualOvp").patchValue(false);
            } else if (dgdRecObj.autoManualFlag == "M") {
              this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("manualOvp").patchValue(true);
              this.dgdRadioActiveForm.get("dgdOverpackPopupForm").get("generateOvp").patchValue(false);
            }
          });

          if (decDtlRecObj.packingGroupCode) {
            this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingGroupCode"]).patchValue(decDtlRecObj.packingGroupCode);
          }

          if (decDtlRecObj.packingInstructions) {
            this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingInstructions"]).patchValue(decDtlRecObj.packingInstructions);
          }
          if (decDtlRecObj.packingInstructionCategory) {
            this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", index, "packingInstructionCategory"]).patchValue(decDtlRecObj.packingInstructionCategory);

          }

          // this.search.unid = decDtlRecObj.unidnumber;
          // this.search.psn = decDtlRecObj.properShippingName;
          this.search.dgRegulationId = decDtlRecObj.dgRegulationId;

          this.dgdRadioActiveForm.get("dgdDetailsForm").patchValue(dgdRecObj);
        });

        //this.dgdRadioActiveForm.get('dgdDetailsForm').patchValue(dgdRecObj);
      }
    });
  }

  changeTranshipmentFlag() {
    this.transhipmentFlag = false;
  }

  getStateByShipperCountry(event) {
    this.shpCountryCodeParam = this.createSourceParameter(
      this.dgdRadioActiveForm.get(["dgdDetailsForm", "shipperCountryCode"])
        .value
    );
  }

  getStateByConsigneeCountry(event) {
    this.conCountryCodeParam = this.createSourceParameter(
      this.dgdRadioActiveForm.get(["dgdDetailsForm", "consigneeCountryCode"])
        .value
    );
  }

  getUnidDetailsByPsn(item, index) {
    //  if (item && item.lovSelection) {
    // item.code = item.param1;

    var pgCode: any = [];
    var categoryCodes: any = [];
    this.dgdRadioActiveForm
      .get([
        "dgdDetailsForm",
        "declarationDetails",
        index,
        "properShippingName"
      ])
      .patchValue(item.desc);
    const dgdDetailsForm: NgcFormGroup = <NgcFormGroup>(
      this.dgdRadioActiveForm.get("dgdDetailsForm")
    );
    // let req: SearchDgregulations = new SearchDgregulations();
    // req.unid = item.code;
    // req.psn = item.desc;

    // this.search.unid = item.code;
    // this.search.psn = item.desc;
    this.search.dgRegulationId = item.param1;

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

            if (
              this.dgdRadioActiveForm
                .get("dgdDetailsForm")
                .get("shipmentRadioactiveFlag").value == "RAD"
            ) {
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
          }

          // if (this.dgRegulationRes[0]) {
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "declarationDetails", index, "dgclassCode"])
            .patchValue(this.dgRegulationRes[0].classCode);
          this.dgdRadioActiveForm
            .get([
              "dgdDetailsForm",
              "declarationDetails",
              index,
              "dgRegulationId"
            ])
            .patchValue(this.dgRegulationRes[0].regId);



          if (this.dgRegulationRes[0].shc != "") {
            this.dgdRadioActiveForm
              .get([
                "dgdDetailsForm",
                "declarationDetails",
                index,
                "impshc"
              ]).setValue(this.dgRegulationRes[0].shc);


          }
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "declarationDetails", index, "unidnumberdata"])
            .patchValue(this.dgRegulationRes[0].unid);

          if (pgCode && pgCode.length > 0) {
            (<NgcFormArray>(
              this.dgdRadioActiveForm.get([
                "dgdDetailsForm",
                "declarationDetails",
                index,
                "pgList"
              ])
            )).patchValue(pgCode);
          }
          if (categoryCodes && categoryCodes.length > 0) {
            (<NgcFormArray>(
              this.dgdRadioActiveForm.get([
                "dgdDetailsForm",
                "declarationDetails",
                index,
                "categoryList"
              ])
            )).patchValue(categoryCodes);
          }
          this.dgdRadioActiveForm
            .get([
              "dgdDetailsForm",
              "declarationDetails",
              index,
              "dgSubriskCode1"
            ])
            .patchValue(this.dgRegulationRes[0].sbr1);
          this.dgdRadioActiveForm
            .get([
              "dgdDetailsForm",
              "declarationDetails",
              index,
              "dgSubriskCode2"
            ])
            .patchValue(this.dgRegulationRes[0].sbr2);

        }

      });

  }

  getShipperDetailsByCode(item) {
    const dgdDetailsForm: NgcFormGroup = <NgcFormGroup>(
      this.dgdRadioActiveForm.get("dgdDetailsForm")
    );
    let req: any = new Object();
    req.customerId = item.parameter1;
    req.typeCode = "SHP";
    this.dangerousgoodsService
      .getShipperDetailsByCode(req)
      .subscribe(response => {
        let shipperData: any;
        if (response.data != null) {
          shipperData = response.data;
          this.shipperCity = shipperData.shipperCityCode;
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "shipperName"])
            .patchValue(shipperData.shipperName);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "shipperAddress1"])
            .patchValue(shipperData.shipperAddress1);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "shipperAddress2"])
            .patchValue(shipperData.shipperAddress2);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "shipperPlace"])
            .patchValue(shipperData.shipperPlace);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "shipperPostalCode"])
            .patchValue(shipperData.shipperPostalCode);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "shipperCountryCode"])
            .patchValue(shipperData.shipperCountryCode);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "shipperStateCode"])
            .patchValue(shipperData.shipperStateCode);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "shipperCustomerId"])
            .patchValue(shipperData.shipperCustomerId);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "shipperCustomerCode"])
            .patchValue(shipperData.shipperCustomerCode);
        }
      });
  }

  getConsigneeDetailsByCode(item) {
    const dgdDetailsForm: NgcFormGroup = <NgcFormGroup>(
      this.dgdRadioActiveForm.get("dgdDetailsForm")
    );
    let req: any = new Object();
    req.customerId = item.parameter1;
    req.typeCode = "CNE";
    this.dangerousgoodsService
      .getShipperDetailsByCode(req)
      .subscribe(response => {
        if (response.data != null) {
          let consigneeData: any;
          consigneeData = response.data;
          this.consigneeCity = consigneeData.shipperCityCode;
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "consigneeName"])
            .patchValue(consigneeData.shipperName);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "consigneeAddress1"])
            .patchValue(consigneeData.shipperAddress1);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "consigneeAddress2"])
            .patchValue(consigneeData.shipperAddress2);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "consigneePlace"])
            .patchValue(consigneeData.shipperPlace);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "consigneePostalCode"])
            .patchValue(consigneeData.shipperPostalCode);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "consigneeCountryCode"])
            .patchValue(consigneeData.shipperCountryCode);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "consigneeStateCode"])
            .patchValue(consigneeData.shipperStateCode);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "consigneeCustomerId"])
            .patchValue(consigneeData.shipperCustomerId);
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "consigneeCustomerCode"])
            .patchValue(consigneeData.shipperCustomerCode);
        }
      });
  }

  onAddRow() {
    const noOfRows = (<NgcFormArray>(
      this.dgdRadioActiveForm.get("dgdDetailsForm").get("declarationDetails")
    )).length;
    const lastRow = noOfRows
      ? (<NgcFormArray>(
        this.dgdRadioActiveForm
          .get("dgdDetailsForm")
          .get("declarationDetails")
      )).controls[noOfRows - 1]
      : null;
    if (noOfRows > -1) {
      (<NgcFormArray>(
        this.dgdRadioActiveForm.get("dgdDetailsForm").get("declarationDetails")
      )).addValue([
        {
          unidnumber: "",
          properShippingName: "",
          dgRegulationId: "",
          dgclassCode: "",
          dgSubriskCode1: "",
          dgSubriskCode2: "",
          packingInstructionCategory: "",
          packingGroupCode: "",
          packagePieces: "",
          packageQuantity: "",
          packingType: "",
          packingInstructions: "",
          authorizationDetail: "",
          apioNumber: "",
          overPackDelimStr: "",
          overPackDetails: new Array(),
          overPackNumber: "",
          transportIndex: "",
          packingDimension1: "",
          packingDimension2: "",
          packingDimension3: "",
          selectCheckBox: false,
          pgList: "",
          piList: "",
          categoryList: "",
          remarks: "",
          impshc: "",
          unidnumberdata: "",
          oldregid: " "
        }
      ]);
    }
  }

  onAddEliRow() {
    const noOfRows = (<NgcFormArray>(this.dgdRadioActiveForm.get("eliElmFormGroup").get("eliElmFormDetails"))).length;
    const lastRow = noOfRows ? (<NgcFormArray>(this.dgdRadioActiveForm.get("eliElmFormGroup").get("eliElmFormDetails"))).controls[noOfRows - 1] : null;
    if (noOfRows > -1) {
      (<NgcFormArray>(
        this.dgdRadioActiveForm.get("eliElmFormGroup").get("eliElmFormDetails")
      )).addValue([
        {
          selectEliCheckBox: false,
          eliElm: "",
          flightType: "",
          piData: "",
          forbiddenFlag: false,
          remark: ""
        }
      ]);
    }
  }

  getRemark(item, index) {
    console.log("index", index);
    const gerRemarkReq: any = new Object();
    gerRemarkReq.eliElm = item.value.eliElm;
    gerRemarkReq.flightType = item.value.flightType;
    gerRemarkReq.piData = item.value.piData;
    gerRemarkReq.shipmentNumber = this.dgdRadioActiveForm.get('searchFormGroup').get('shipmentNumber').value;
    this.dangerousgoodsService.getRemarkOnPiAndShc(gerRemarkReq).subscribe(remarkRes => {
      if (!this.showResponseErrorMessages(remarkRes)) {
        if (remarkRes.data) {
          if (remarkRes.data.remark) {
            this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", index, "remark"]).patchValue(remarkRes.data.remark);
          } else {
            var errorMsgForCarrier = "Handling Instructions not found for " + remarkRes.data.carrierCode;
            this.showInfoStatus(errorMsgForCarrier);
          }
          if (remarkRes.data.forbiddenFlag == "0") {
            this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", index, "forbiddenFlag"]).patchValue(false);
          } else {
            this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", index, "forbiddenFlag"]).patchValue(true);
          }
        }
      } else {
        this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", index, "remark"]).patchValue(null);
      }


      if (remarkRes.data == null) {
        this.dgdRadioActiveForm.get(["eliElmFormGroup", "eliElmFormDetails", index, "forbiddenFlag"]).patchValue(false);
        this.showInfoStatus("export.handling.instructions.not.found");
      }
    });
  }

  generateApio(event) {
    let declDtlArry = this.dgdRadioActiveForm.get([
      "dgdDetailsForm",
      "declarationDetails"
    ]).value;
    let apioLast = declDtlArry
      .filter(
        decDtlObj => decDtlObj.apioNumber != null && decDtlObj.apioNumber != ""
      )
      .slice(-1)[0];
    if (apioLast) {
      var newApio = parseInt(apioLast.apioNumber) + 1;
    } else {
      var newApio = 1;
    }
    for (
      let i = declDtlArry.indexOf(apioLast) + 1;
      i < declDtlArry.length;
      i++
    ) {
      this.dgdRadioActiveForm
        .get(["dgdDetailsForm", "declarationDetails", i, "apioNumber"])
        .setValue(newApio);
    }
  }

  generateOverpack(event) {
    this.dgdRadioActiveForm
      .get("dgdOverpackPopupForm")
      .get("generateOvp")
      .patchValue(true);
    this.dgdRadioActiveForm
      .get("dgdOverpackPopupForm")
      .get("autoManualFlag")
      .patchValue("S");

    this.dgdRadioActiveForm
      .get(["dgdOverpackPopupForm", "overpackNumber"])
      .reset();
    this.overpackWindow.open();
    this.closeBtn = false;
    this.autoOrManualFlag = false;
    this.allNumbers = new Array();
  }

  genOverpackNum(event) {
    this.counter += 1;
    this.allNumbers.push(this.counter);
    this.dgdRadioActiveForm
      .get(["dgdOverpackPopupForm", "overpackNumber"])
      .patchValue(this.allNumbers);
  }

  getOverPackSeqNo() {
    let req: any = new Object();
    req.shipmentNumber = this.dgdRadioActiveForm.get([
      "searchFormGroup",
      "shipmentNumber"
    ]).value;
    this.dangerousgoodsService
      .getOverPackSequenceNumber(req)
      .subscribe(response => {
        if (response && response.data)
          this.counter = response.data.overpackSeqNo;
        this.aircraftType = response.data.aircraftType;
        if (NgcUtility.isBlank(this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType").value)) {
          if (NgcUtility.isBlank(this.aircraftType) || this.aircraftType == 'PAX') {
            this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType1").patchValue(true);
            this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType2").patchValue(false);
          } else if (this.aircraftType == 'CAO') {
            this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType1").patchValue(false);
            this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType2").patchValue(true);
          }
        }
      });
  }

  saveOverpackWin(event) {
    let overPack = this.dgdRadioActiveForm.get([
      "dgdOverpackPopupForm",
      "overpackNumber"
    ]).value;
    console.log("overPack", overPack);
    if (overPack) {
      let str = overPack.join(",");
      let declDtlArry = this.dgdRadioActiveForm.getRawValue().dgdDetailsForm.declarationDetails;

      console.log("declDtlArry1..", declDtlArry);

      //fetch last non empty overpack UNID record
      let ovrPackLast = declDtlArry.filter(decDtlObj => decDtlObj.overPackDetails.length > 0).slice(-1)[0];

      //last Overpack in UNID
      // let patchOverPackSeq = parseInt(ovrPackLast.overPackDetails.slice(-1)[0].overpackNumber)+1;
      let start = declDtlArry.lastIndexOf(ovrPackLast) + 1;
      let end = declDtlArry.length;

      let i = 0;
      if (ovrPackLast) {
        for (i = start; i < end; i++) {
          this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", i, "overPackDelimStr"]).patchValue(str);

          let over = new Array();
          overPack.forEach(ele => {
            over.push({
              overpackNumber: ele,
              dgRegulationId: this.dgdRadioActiveForm.get([
                "dgdDetailsForm",
                "declarationDetails",
                i,
                "dgRegulationId"
              ]).value,
              dgdReferenceNo: this.dgdRadioActiveForm.get([
                "dgdDetailsForm",
                "dgdReferenceNo"
              ]).value,
              expDgShipperDeclarationId: null,
              autoManualFlag: this.dgdRadioActiveForm.get([
                "dgdOverpackPopupForm",
                "autoManualFlag"
              ]).value
            });
          });
          this.dgdRadioActiveForm
            .get(["dgdDetailsForm", "declarationDetails", i, "overPackDetails"])
            .patchValue(over);
        }
      } else {
        console.log("else");

        // this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", 0, "overPackDelimStr"]).patchValue(str);

        for (i = start; i < end; i++) {
          this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", i, "overPackDelimStr"]).patchValue(str);

          let over = new Array();

          overPack.forEach(ele => {
            over.push({
              overpackNumber: ele,
              dgRegulationId: this.dgdRadioActiveForm.get([
                "dgdDetailsForm",
                "declarationDetails",
                i,
                "dgRegulationId"
              ]).value,
              dgdReferenceNo: this.dgdRadioActiveForm.get([
                "dgdDetailsForm",
                "dgdReferenceNo"
              ]).value,
              expDgShipperDeclarationId: null,
              autoManualFlag: this.dgdRadioActiveForm.get([
                "dgdOverpackPopupForm",
                "autoManualFlag"
              ]).value
            });
            this.dgdRadioActiveForm
              .get(["dgdDetailsForm", "declarationDetails", i, "overPackDetails"])
              .patchValue(over);
          });
        }



        // let dgdDetailsRec = this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", 0]).value;
        // this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", 0]).patchValue(dgdDetailsRec);
      }
    }
    this.overpackWindow.close();
  }

  onSave(event) {
    const dgdDetailsForm: NgcFormGroup = <NgcFormGroup>(
      this.dgdRadioActiveForm.get("dgdDetailsForm")
    );
    // Validate
    dgdDetailsForm.validate();
    // If Invalid, Don't Process
    if (this.dgdRadioActiveForm.get("dgdDetailsForm").invalid) {
      return;
    }
    let req: any;
    req = this.dgdRadioActiveForm.getRawValue();
    req.dgRegulationId = this.dgRegulationId;

    req.dgdDetailsForm.shipmentNumber = this.dgdRadioActiveForm.get([
      "searchFormGroup",
      "shipmentNumber"
    ]).value;

    if (this.addFlag) {
      req.dgdDetailsForm.shipperCityCode = this.shipperCity;
      req.dgdDetailsForm.consigneeCityCode = this.consigneeCity;
    }
    var i = 0;
    req.dgdDetailsForm.declarationDetails.forEach(element => {
      req.dgdDetailsForm.declarationDetails[i].unidnumber = this.dgdRadioActiveForm.get(["dgdDetailsForm", "declarationDetails", i, "unidnumberdata"]).value;
      i++;
    });

    this.dangerousgoodsService
      .saveDGDDetails(req.dgdDetailsForm)
      .subscribe(response => {
        if (!this.showResponseErrorMessages(response, null, "dgdDetailsForm")) {

          if (response.data.messageList.length > 0) {
            this.showErrorStatus(response.data.messageList[0].message);
            //  this.onSearch();
          } else {

            this.showSuccessStatus("g.completed.successfully");
            this.dontDisplayReferenceNumber = false;
            this.onSearch();

          }

        } else {

          if (!(response.data.messageList.length > 0)) {
            this.dontDisplayReferenceNumber = false;
            this.showSuccessStatus("g.completed.successfully");
            this.onSearch();

            //  this.onSearch();
          }
          this.isDGDDetails = false;
        }

      }, error => {
        this.showErrorMessage(error);
      });

  }

  onClear(event) {
    this.dgdRadioActiveForm.reset();
  }

  onPackingCodeChange(event, index) {
    var pckingIns: any = [];
    if (this.dgRegulationRes[0]) {
      this.dgRegulationRes[0].dgDetails.forEach(pgRes => {
        if (pgRes.pg == event) {
          if (
            this.dgdRadioActiveForm.get("dgdDetailsForm").get("aircraftType")
              .value == "PAX"
          ) {
            pckingIns.push(pgRes.mlqPInfo);
            pckingIns.push(pgRes.mpcPInfo);
          } else {
            pckingIns.push(pgRes.mcoPInfo);
          }
        }
      });
    }
    if (pckingIns && pckingIns.length > 0) {
      (<NgcFormArray>(
        this.dgdRadioActiveForm.get([
          "dgdDetailsForm",
          "declarationDetails",
          index,
          "piList"
        ])
      )).patchValue(pckingIns);
    }
  }

  onAddDocs() {
    this.getOverPackSeqNo();
    this.dgdReferenceArray = new Array();
    this.dgdReferenceArray.push("Select");
    this.isDGDDetails = true;
    this.isAddDgdDocFlag = true;
    this.addFlag = true;
    this.dontDisplayReferenceNumber = true;
    // this.dgdRadioActiveForm.get('dgdDetailsForm').reset();
    console.log("this.transhipmentFlag", this.transhipmentFlag);
    console.log(
      "this.transhipmentSearchResponse",
      this.transhipmentSearchResponse
    );
    if (this.transhipmentFlag) {
      this.shipperCity = this.transhipmentSearchResponse[0].shipperCityCode;
      this.consigneeCity = this.transhipmentSearchResponse[0].consigneeCityCode;
      this.dgdRadioActiveForm
        .get("dgdDetailsForm")
        .patchValue(this.transhipmentSearchResponse[0]);
    } else {
      this.dgdRadioActiveForm.get("dgdDetailsForm").reset();
    }
    this.dgdRadioActiveForm
      .get(["dgdDetailsForm", "declarationDetails"])
      .patchValue(new Array());

    // this.dgdRadioActiveForm
    //   .get("dgdDetailsForm")
    //   .get("aircraftType1")
    //   .patchValue(true);

    // this.dgdRadioActiveForm
    //   .get("dgdDetailsForm")
    //   .get("aircraftType2")
    //   .patchValue(false);

    this.dgdRadioActiveForm
      .get("dgdDetailsForm")
      .get("shipmentRadioactiveFlag1")
      .patchValue(false);

    this.dgdRadioActiveForm
      .get("dgdDetailsForm")
      .get("shipmentRadioactiveFlag2")
      .patchValue(true);

    this.dgdRadioActiveForm.get(["dgdDetailsForm", "flagCRUD"]).patchValue("C");
    this.dgdRadioActiveForm
      .get(["dgdDetailsForm", "shipmentNumber"])
      .patchValue(
        this.dgdRadioActiveForm.get(["dgdRefernceForm", "awbNumber"]).value
      );
    this.dgdRadioActiveForm
      .get(["dgdDetailsForm", "dgdReferenceNo"])
      .patchValue(0);
    //Auto-populate the Origin and Destination from Shipment Master
    if (this.dgdRadioActiveForm.get(["dgdDetailsForm", "destinationAirport"]).value == null && this.dgdRadioActiveForm.get(["dgdDetailsForm", "departureAirport"]).value == null) {
      const req: DgdAWBNumber = new DgdAWBNumber();
      req.shipmentNumber = this.dgdRadioActiveForm.get(["searchFormGroup", "shipmentNumber"]).value;
      this.dangerousgoodsService.getOriginAndDestination(req).subscribe(
        response => {
          if (!this.showResponseErrorMessages(response)) {

            this.dgdRadioActiveForm.get(["dgdDetailsForm", "destinationAirport"]).setValue(response.data.destination);
            this.dgdRadioActiveForm.get(["dgdDetailsForm", "departureAirport"]).setValue(response.data.origin);
          }
        },
        error => {
          this.showErrorStatus("Error:" + error);
        }
      );
    }

  }

  addEliElmData() {
    const eliGetReq: any = new Object();
    eliGetReq.shipmentNumber = this.dgdRadioActiveForm.get(["searchFormGroup", "shipmentNumber"]).value;
    this.dangerousgoodsService.getEliDetails(eliGetReq).subscribe(eliRes => {
      if (eliRes.data) {
        if (eliRes.data.eliElmFormDetails) {
          eliRes.data.eliElmFormDetails.forEach(element => {
            element.selectEliCheckBox = false;
          });
        }

        this.dgdRadioActiveForm.get("eliElmFormGroup").patchValue(eliRes.data);
      }

    })
    this.eliElmWindow.open();
  }

  isRow() {
    let rowNo = (<NgcFormArray>(
      this.dgdRadioActiveForm.get("dgdDetailsForm").get("declarationDetails")
    )).length;
    if (rowNo > 0) {
      return true;
    } else {
      return false;
    }
  }

  dgdReport() {
    const reportParameters: any = {};
    reportParameters.shipmentNumber = this.dgdRadioActiveForm.get([
      "dgdRefernceForm",
      "awbNumber"
    ]).value;
    reportParameters.reference = this.dgdRadioActiveForm.get([
      "dgdRefernceForm",
      "dgdReferenceNo"
    ]).value;
    this.reportParameters = reportParameters;
    console.log(this.reportParameters);
    this.reportWindow.open();
  }
  getPackingInstruction(item) {
    this.resetFormMessages();
  }
  onCancel(event) {
    this.navigateBack(this.forwardedData);
  }
}

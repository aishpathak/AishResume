import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormControl,
  NgcFormArray,
  NgcUtility,
  NgcButtonComponent,
  PageConfiguration,
  NgcReportComponent
} from "ngc-framework";
import { ImportService } from "../import.service";
import {
  DiscrepancySearchRequest,
  DiscrepancyResponse
} from "../import.sharedmodel";
import { element } from "protractor";
import { ApplicationFeatures } from "../../common/applicationfeatures";
import { Validators } from "@angular/forms";
import { IfStmt } from "@angular/compiler";
import { ApplicationEntities } from "../../common/applicationentities";
@Component({
  selector: "app-inwardservicereport",
  templateUrl: "./inwardservicereport.component.html",
  styleUrls: ["./inwardservicereport.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  focusToMandatory: true,
  focusToBlank: true,
})
export class InwardservicereportComponent extends NgcPage implements OnInit {
  manualdata: string;
  flightKeyforDropdown: any;
  segmentId: any;
  routing: any;
  resp: any;
  request: any;
  flightNumber: any;
  date: any;
  isSearch: boolean = false;
  disableflag: boolean = false;
  finalizeflag: boolean = false;
  unfinalizeflag: boolean = false;
  expandorcollapse: boolean = true;
  isAdd: boolean = false;
  firstFocus: boolean = false;
  physicalData: any;
  physicalRowIndexData: any;
  physicalSegIndexData: any;
  shipmentData: any;
  reportParameters: any;
  //printflag: boolean = false;
  shipmentNumberParameter: any;
  physicalDiscrepancy: any;
  shipmentDiscrepancy: any;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  hawbSourceParameters: {};
  handledByMasterHouse: boolean;
  addDiscrepencyRowVar: any;
  discrepencyRowIndexData: number;
  addPhysicalDiscrepancy: any;
  addShipmentDiscrepancy: any;
  hawbInvalid: boolean;
  cirDiscrepancyflag: boolean = true;
  dirDiscrepancyflag: boolean = true;
  otherDiscrepancyflag: boolean = true;
  hawbInfoEnabled: Boolean = false;
  hawbActionRemarks: Boolean = false;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.hawbInfoEnabled = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBInfo);
    this.hawbActionRemarks = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_DocumentIrregularityRemarks);

  }
  // tslint:disable-next-line:member-ordering
  private inwardServiceForm: NgcFormGroup = new NgcFormGroup({
    flightNumber: new NgcFormControl(),
    checkBox: new NgcFormControl(),
    user: new NgcFormControl(),
    date: new NgcFormControl(),
    flightKeyValue: new NgcFormControl(),
    dateValue: new NgcFormControl(),
    requestfor: new NgcFormControl(),
    routeValue: new NgcFormControl(),
    actionTaken: new NgcFormControl(),
    natureOfDiscrepancies: new NgcFormControl(),
    manifestedPages: new NgcFormControl(),
    originStation: new NgcFormControl(),
    physicalDiscrepancy: new NgcFormArray([]),
    otherDiscrepancy: new NgcFormArray([]),
    manifestDiscrepancy: new NgcFormArray([]),
    documentCompletedBy: new NgcFormControl(),
    documentCompletedAt: new NgcFormControl(),
    breakDownCompletedBy: new NgcFormControl(),
    breakDownCompletedAt: new NgcFormControl(),
    rampCheckedInBy: new NgcFormControl(),
    rampCheckedInDate: new NgcFormControl(),
    shipmentDiscrepancy: new NgcFormArray([]),
    segment: new NgcFormArray([]),
    segmentConcatAwb: new NgcFormArray([]),
    status: new NgcFormControl(),
    damagestatus: new NgcFormControl(),
    emails: new NgcFormArray([]),
    hawbnumber: new NgcFormControl(),
    Discrepency: new NgcFormControl()

  });
  onSelectDate(event) {
    this.flightKeyforDropdown = this.createSourceParameter(
      this.inwardServiceForm.get("flightNumber").value,
      event
    );
  }

  getSegmentId(item) {
    this.segmentId = item.code;
    this.routing = item.desc;
  }
  onSearch() {
    if (this.segmentId === undefined) {
      this.isSearch = false;
    }
    const resp = new DiscrepancySearchRequest();
    resp.flightNumber = this.inwardServiceForm.get("flightNumber").value;
    resp.flightDate = this.inwardServiceForm.get("date").value;
    resp.segmentId = this.segmentId;

    this.importService.searchDiscrepancy(resp).subscribe(data => {
      this.resp = data.data;

      if (this.resp) {
        this.resetFormMessages();
        this.isSearch = true;
        if (this.resp[0].status == 'Inward Service Report Finalized') {
          this.disableflag = true;
          this.unfinalizeflag = true;
          this.finalizeflag = false;
        } else {
          this.disableflag = false;
          this.unfinalizeflag = false;
          this.finalizeflag = true;
        }
        for (let item of this.resp) {

          item.segmentConcatAwb.forEach(value => {

            if (value.shipmentDiscrepancy) {
              value.shipmentDiscrepancy = value.shipmentDiscrepancy.filter(
                obj => obj.shipmentType !== "MAIL"
              );
            }
            if (value.physicalDiscrepancy) {
              value.physicalDiscrepancy = value.physicalDiscrepancy.filter(
                obj => obj.shipmentType !== "MAIL"
              );
            }

          })

        }
        this.inwardServiceForm
          .get("flightKeyValue")
          .patchValue(this.inwardServiceForm.get("flightNumber").value);

        this.inwardServiceForm
          .get("dateValue")
          .patchValue(this.inwardServiceForm.get("date").value);

        this.inwardServiceForm
          .get("documentCompletedBy")
          .patchValue(this.resp[0].documentCompletedBy);
        this.inwardServiceForm
          .get("documentCompletedAt")
          .patchValue(this.resp[0].documentCompletedAt);
        this.inwardServiceForm
          .get("breakDownCompletedBy")
          .patchValue(this.resp[0].breakDownCompletedBy);
        this.inwardServiceForm
          .get("breakDownCompletedAt")
          .patchValue(this.resp[0].breakDownCompletedAt);
        this.inwardServiceForm
          .get("rampCheckedInBy")
          .patchValue(this.resp[0].rampCheckedInBy);
        this.inwardServiceForm
          .get("rampCheckedInDate")
          .patchValue(this.resp[0].rampCheckedInDate);
        this.inwardServiceForm.get("status").patchValue(this.resp[0].status);
        this.inwardServiceForm
          .get("damagestatus")
          .patchValue(this.resp[0].damagestatus);
        this.resp[0].flightNumber = this.inwardServiceForm.get("flightKeyValue").value;
        this.inwardServiceForm.patchValue(this.resp[0]);
      } else {
        this.refreshFormMessages(data);
        this.isSearch = false;
      }
      this.expandAll();
    });
  }
  public onBack(event) {
    this.navigateBack(this.inwardServiceForm.getRawValue());
  }

  addDiscrepencyRow(item, index) {
    this.addDiscrepencyRowVar = index;
    this.addPhysicalDiscrepancy = false;
    this.addShipmentDiscrepancy = true;
    this.discrepencyRowIndexData = (<NgcFormArray>(this.inwardServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy"]))).length;
    (<NgcFormArray>(
      this.inwardServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy"])
    )).addValue([
      {
        checkBox: false,
        shipmentNumber: "",
        shipmentType: "AWB",
        partShipment: false,
        photoCopy: false,
        origin: "",
        destination: "",
        piece: "",
        weight: "",
        weightUnitCode: "",
        natureOfGoodsDescription: "",
        irregularityType: "",
        irregularityPieces: "",
        irregularityDescription: "",
        remarks: "",
        additionalActionRemarks: "",
        discrepancyType: "DOCUMENT",
        manual: true,
        shipmentdate: new Date(),
        flagCRUD: "C"
      }
    ]);
  }

  addPhysicalDiscrepencyRow(item, index) {
    this.handledByMasterHouse = false;
    this.physicalSegIndexData = index;
    this.addPhysicalDiscrepancy = true;
    this.addShipmentDiscrepancy = false;
    this.physicalRowIndexData = (<NgcFormArray>(this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy"]))).length;
    (<NgcFormArray>(
      this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy"])
    )).addValue([
      {
        checkBox: false,
        shipmentNumber: "",
        shipmentType: "AWB",
        hawbnumber: null,
        origin: "",
        destination: "",
        piece: "",
        weight: "",
        weightUnitCode: "",
        natureOfGoodsDescription: "",
        irregularityType: "",
        irregularityPieces: "",
        irregularityWeight: "",
        irregularityDescription: "",
        remarks: "",
        discrepancyType: "PHYSICAL",
        manual: true,
        shipmentdate: new Date(),
        additionalActionRemarks: "",
        accsHandler: null,
        manifestPcsWt: null,
        locationPcsWt: null,
        flagCRUD: "C"
      }
    ]);
  }

  protected afterFocus() {
    if (!this.firstFocus && this.isSearch) {
      (this.inwardServiceForm.get(['segment', 0, 'manifestedPages']) as NgcFormControl).focus();
      this.firstFocus = true;
    } else {
      if (this.addPhysicalDiscrepancy) {
        this.async(() => {
          try {
            (this.inwardServiceForm.get(["segmentConcatAwb", this.physicalSegIndexData, "physicalDiscrepancy", this.physicalRowIndexData, "shipmentNumber"]) as NgcFormControl).focus();
          } catch (e) { }
        })
      }
      if (this.addShipmentDiscrepancy) {
        this.async(() => {
          try {
            (this.inwardServiceForm.get(["segmentConcatAwb", this.addDiscrepencyRowVar, "shipmentDiscrepancy", this.discrepencyRowIndexData, "shipmentNumber"]) as NgcFormControl).focus();
          } catch (e) { }
        })
      }

    }
  }

  addOtherDiscrepancy(item, index) {
    this.addPhysicalDiscrepancy = false;
    this.addShipmentDiscrepancy = false;
    (<NgcFormArray>(
      this.inwardServiceForm.get(["segmentConcatAwb", index, "otherDiscrepancy"])
    )).addValue([
      {
        checkBox: false,
        createdBy: "",
        remarks: "",
        discrepancyType: "OTHER",
        flagCRUD: "C"
      }
    ]);
  }

  onhawbSelect(event, index, pindex) {
    this.getShipmasterphydetail(event, index, pindex);
    if (event.code == null) {
      this.hawbInvalid = true;
    }
    else {
      this.hawbInvalid = false;

    }
  }



  onSave(flagpf) {

    if (this.handledByMasterHouse && this.hawbInvalid) {
      return true;
    }
    this.inwardServiceForm.validate();
    if (this.inwardServiceForm.invalid) {
      return;
    }

    let request: any = new DiscrepancyResponse();
    request = this.inwardServiceForm.getRawValue();
    request.flightDate = request.date;
    if (flagpf) {
      request.pflag = 'P';
    }
    this.importService.addDiscrepancy(request).subscribe(data => {
      this.request = data.data;
      if (this.request) {

        if (!flagpf || flagpf == undefined) {
          this.showSuccessStatus("g.completed.successfully");
          this.onSearch();
          this.resetFormMessages();
        }

      } else {
        this.refreshFormMessages(data);
      }
    });
  }
  deleteDiscrepencyRow(event, index) {
    let x = this.inwardServiceForm.get([
      "segmentConcatAwb",
      index,
      "shipmentDiscrepancy"
    ]).value;
    let uIndex = 0;
    x.forEach(e => {
      if (e["checkBox"]) {
        (this.inwardServiceForm.get([
          "segmentConcatAwb",
          index,
          "shipmentDiscrepancy"
        ]) as NgcFormArray).markAsDeletedAt(uIndex);
      }
      uIndex++;
    });
  }
  deletePhysicalDiscrepencyRow(event, index) {
    let x = this.inwardServiceForm.get([
      "segmentConcatAwb",
      index,
      "physicalDiscrepancy"
    ]).value;
    let uIndex = 0;
    x.forEach(e => {
      if (e["checkBox"]) {
        (this.inwardServiceForm.get([
          "segmentConcatAwb",
          index,
          "physicalDiscrepancy"
        ]) as NgcFormArray).markAsDeletedAt(uIndex);
      }
      uIndex++;
    });
  }

  deleteOtherDiscrepancy(event, index) {
    let y = this.inwardServiceForm.get([
      "segmentConcatAwb",
      index,
      "otherDiscrepancy"
    ]).value;
    let uIndex = 0;
    y.forEach(e => {
      if (e["checkBox"]) {
        (this.inwardServiceForm.get([
          "segmentConcatAwb",
          index,
          "otherDiscrepancy"
        ]) as NgcFormArray).markAsDeletedAt(uIndex);
      }
      uIndex++;
    });
  }

  // tslint:disable-next-line:one-line
  onFinalize() {

    let request: any = new DiscrepancyResponse();
    request = this.inwardServiceForm.getRawValue();
    request.flightNumber = this.inwardServiceForm.get("flightNumber").value;
    request.flightDate = this.inwardServiceForm.get("date").value;
    request.flightId = this.resp[0].flightId;
    request.damagestatus = this.resp[0].damagestatus;

    if (this.unfinalizeflag) {
      request.checkstatus = true;
    }
    else if (this.finalizeflag) {
      request.checkstatus = false;

    }

    this.importService.finalizeDiscrepancy(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.request = data.data;
      if (this.request) {
        if (!request.checkstatus) {
          this.showSuccessStatus("finalize.successful");
        } else if (request.checkstatus) {
          this.showSuccessStatus("unfinalize.successful");
        }
        this.onSearch();
      } else {
        this.refreshFormMessages(data);
      }
    });
  }

  fetchIrregularityTypes(item, index, sindex) {
    this.inwardServiceForm
      .get([
        "segmentConcatAwb",
        index,
        "shipmentDiscrepancy",
        sindex,
        "irregularityDescription"
      ])
      .patchValue(item.desc);
  }

  fetchIrregularity(item, index, pindex) {
    this.inwardServiceForm
      .get([
        "segmentConcatAwb",
        index,
        "physicalDiscrepancy",
        pindex,
        "irregularityDescription"
      ])
      .patchValue(item.desc);
  }
  collapseAll() {
    this.expandorcollapse = false;
  }
  expandAll() {
    this.expandorcollapse = true;
  }
  inwardReport() {
    let pf: boolean = true;
    this.onSave(true);

    const reportParameters: any = {};
    reportParameters.FlightId = this.resp[0].flightId;
    reportParameters.offpoint = NgcUtility.getTenantConfiguration().airportCode;
    reportParameters.LoggedInUser = this.getUserProfile().userLoginCode;
    reportParameters.HAWBhandlingFlag = NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling);
    reportParameters.dirDiscrepancyflag = this.dirDiscrepancyflag;
    reportParameters.cirDiscrepancyflag = this.cirDiscrepancyflag;
    reportParameters.otherDiscrepancyflag = this.otherDiscrepancyflag;
    this.reportParameters = reportParameters;
    this.reportWindow.open();
  }

  addEmail() {
    let request = new DiscrepancyResponse();
    request = this.inwardServiceForm.getRawValue();
    request.flightId = this.resp[0].flightId;
    request.flightDate = this.inwardServiceForm.get("date").value;

    request.emailAddress = [];
    request.emails.forEach(element => {
      request.emailAddress.push(element.toAddress);
    })
    this.importService.sendEmailInward(request).subscribe(data => {
      this.request = data.data;
    })
  }


  getShipmasterdetail(event, index, sindex) {
    let request: any = new DiscrepancyResponse();
    request = this.inwardServiceForm.getRawValue();
    request.shipmentNumber = this.inwardServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy", sindex, "shipmentNumber"]).value;
    this.importService.getAwbdiscrepancyshipdetails(request).subscribe(data => {
      if (data.success) {
        this.inwardServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy", sindex, "origin"]).setValue(data.data.origin);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy", sindex, "destination"]).setValue(data.data.destination);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy", sindex, "piece"]).setValue(data.data.piece);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy", sindex, "weight"]).setValue(data.data.weight);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy", sindex, "weightUnitCode"]).setValue(data.data.weightUnitCode);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy", sindex, "natureOfGoodsDescription"]).setValue(data.data.natureOfGoodsDescription);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy", sindex, "additionalActionRemarks"]).setValue(data.data.additionalActionRemarks);
      }

    })

  }
  getShipmasterphydetail(event, index, pindex) {
    let request: any = new DiscrepancyResponse();
    request = this.inwardServiceForm.getRawValue();
    request.shipmentNumber = this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "shipmentNumber"]).value;
    request.hawbnumber = this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "hawbnumber"]).value;
    this.importService.getAwbdiscrepancyshipdetails(request).subscribe(data => {

      if (data.success) {
        this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "origin"]).setValue(data.data.origin);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "destination"]).setValue(data.data.destination);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "piece"]).setValue(data.data.piece);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "weight"]).setValue(data.data.weight);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "weightUnitCode"]).setValue(data.data.weightUnitCode);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "natureOfGoodsDescription"]).setValue(data.data.natureOfGoodsDescription);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "accsHandler"]).setValue(data.data.accsHandler);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "manifestPcsWt"]).setValue(data.data.manifestPcsWt);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "locationPcsWt"]).setValue(data.data.locationPcsWt);
        this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "irregularityWeight"]).setValue(data.data.irregularityWeight);
      }

    })
  }

  onTabout(event, index, pindex) {
    this.shipmentNumberParameter = this.createSourceParameter(this.inwardServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy", pindex, "shipmentNumber"]).value);
    this.handledByMasterHouse = false;
    this.inwardServiceForm.get(['segmentConcatAwb', index, 'physicalDiscrepancy', pindex, 'hawbnumber']).setValue(null);
    this.inwardServiceForm.get(['segmentConcatAwb', index, 'physicalDiscrepancy', pindex, 'hawbnumber']).clearValidators();
    if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
      this.hawbSourceParameters = this.createSourceParameter(this.inwardServiceForm.get(['segmentConcatAwb', index, 'physicalDiscrepancy', pindex, 'shipmentNumber']).value);

      this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
        if (data != null && data.length > 0) {
          this.handledByMasterHouse = true;
          this.inwardServiceForm.get(['segmentConcatAwb', index, 'physicalDiscrepancy', pindex, 'hawbnumber']).setValidators([Validators.required, Validators.maxLength(16)]);
        } else {
          this.handledByMasterHouse = false;
          this.inwardServiceForm.get(['segmentConcatAwb', index, 'physicalDiscrepancy', pindex, 'hawbnumber']).clearValidators();
        }
      },
      );
    }
    if (!this.handledByMasterHouse) {
      this.getShipmasterphydetail(event, index, pindex);
    }
  }

  onDiscrepencyChange(event) {
    console.log(event)
    if (event == 'DIR') {
      this.dirDiscrepancyflag = true;
      this.cirDiscrepancyflag = false;
      this.otherDiscrepancyflag = false;
    } else if (event == 'CIR') {
      this.dirDiscrepancyflag = false;
      this.cirDiscrepancyflag = true;
      this.otherDiscrepancyflag = false;
    } else if (event == null || event == "") {
      this.dirDiscrepancyflag = true;
      this.cirDiscrepancyflag = true;
      this.otherDiscrepancyflag = true;
    }

  }
}
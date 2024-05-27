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
  NgcFormArray,
  NgcWindowComponent,
  NgcFormControl,
  NgcButtonComponent,
  NgcUtility,
  PageConfiguration,
  NgcReportComponent
} from "ngc-framework";
import { Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ImportService } from "../../import.service";
import {
  DiscrepancySearchRequest,
  DiscrepancyResponse,
  RequestImportMailManifest
} from "../../import.sharedmodel";

@Component({
  selector: "app-servicereportmail",
  templateUrl: "./servicereportmail.component.html",
  styleUrls: ["./servicereportmail.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  noAutoFocus: true
})
export class ServicereportmailComponent extends NgcPage {
  request: any;
  flightData: any;
  segment: any;
  flightKeyforDropdown: any;
  resp: any;
  routing: any;
  isSearch: boolean = false;
  pflag: boolean = true;
  reportParameters: any;
  physicalData: any;
  shipmentData: any;
  expandorcollapse: boolean = false;
  disableflag: boolean = false;

  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  private mailServiceForm: NgcFormGroup = new NgcFormGroup({
    requestfor: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    date: new NgcFormControl(),
    checkBox: new NgcFormControl(),
    flightKeyValue: new NgcFormControl(),
    dateValue: new NgcFormControl(),
    routeValue: new NgcFormControl(),
    natureOfDiscrepancies: new NgcFormControl(),
    manifestedPages: new NgcFormControl(),
    originStation: new NgcFormControl(),
    segmentArray: new NgcFormArray([]),
    shipmentDiscrepancy: new NgcFormArray([]),
    physicalDiscrepancy: new NgcFormArray([]),
    documentCompletedBy: new NgcFormControl(),
    documentCompletedAt: new NgcFormControl(),
    breakDownCompletedBy: new NgcFormControl(),
    breakDownCompletedAt: new NgcFormControl(),
    rampCheckedInBy: new NgcFormControl(),
    rampCheckedInDate: new NgcFormControl(),
    actionTaken: new NgcFormControl(),
    mailstatus: new NgcFormControl(),
    segment: new NgcFormArray([]),
    segmentConcatAwb: new NgcFormArray([])
  });
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private importService: ImportService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    let importMailManifestData = this.getNavigateData(this.activatedRoute);
    if(importMailManifestData != null){
      this.mailServiceForm
        .get("flightNumber")
        .patchValue(importMailManifestData.flightKey);
      this.mailServiceForm
        .get("date")
        .patchValue(importMailManifestData.flightDate);
      this.onSearch();
    }
  }

  onSelectDate(event) {
    this.flightKeyforDropdown = this.createSourceParameter(
      this.mailServiceForm.get("flightNumber").value,
      event
    );
  }

  getSegmentId(item) {
    this.segment = item.code;
    this.routing = item.desc;
  }

  onSearch() {
    const request: any = new DiscrepancySearchRequest();
    request.flightNumber = this.mailServiceForm.get("flightNumber").value;
    request.flightDate = this.mailServiceForm.get("date").value;
    request.serviceReportFor = 'MAIL'
    // request.segmentId = this.segment;
    this.importService.searchDiscrepancy(request).subscribe(data => {
      this.resp = data.data;
      // this.flightData = this.resp.flightId;
      if (this.resp) {
        this.resetFormMessages();
        this.isSearch = true;

        // this.resp.forEach(value => {
        //   if (value.shipmentDiscrepancy) {
        //     value.shipmentDiscrepancy = value.shipmentDiscrepancy.filter(
        //       obj => obj.shipmentType === "MAIL"
        //     );
        //   }
        //   if (value.physicalDiscrepancy) {
        //     value.physicalDiscrepancy = value.physicalDiscrepancy.filter(
        //       obj => obj.shipmentType === "MAIL"
        //     );
        //   }
        //   if (value.segmentdesc) {
        //     value.originStation = value.segmentdesc.substring(0, 3);
        //   }
        // });
        for (let item of this.resp) {

          item.segmentConcatAwb.forEach(value => {

            if (value.shipmentDiscrepancy) {
              value.shipmentDiscrepancy = value.shipmentDiscrepancy.filter(
                obj => obj.shipmentType == "MAIL"
              );
            }
            if (value.physicalDiscrepancy) {
              value.physicalDiscrepancy = value.physicalDiscrepancy.filter(
                obj => obj.shipmentType == "MAIL"
              );
            }

          })

        }
        this.mailServiceForm
          .get("flightKeyValue")
          .patchValue(this.mailServiceForm.get("flightNumber").value);
        this.mailServiceForm
          .get("dateValue")
          .patchValue(this.mailServiceForm.get("date").value);

        this.mailServiceForm
          .get("rampCheckedInBy")
          .patchValue(this.resp[0].mailrampCheckedInBy);
        this.mailServiceForm
          .get("rampCheckedInDate")
          .patchValue(this.resp[0].mailrampCheckedInDate);
        this.resp[0].flightNumber = this.mailServiceForm.get("flightKeyValue").value;
        this.mailServiceForm
          .get("mailstatus")
          .patchValue(this.resp[0].mailstatus);
        this.mailServiceForm.patchValue(this.resp[0]);
        this.mailServiceForm
          .get("documentCompletedBy")
          .patchValue(this.resp[0].maildocumentCompletedBy);
        this.mailServiceForm
          .get("documentCompletedAt")
          .patchValue(this.resp[0].maildocumentCompletedAt);
        this.mailServiceForm
          .get("breakDownCompletedBy")
          .patchValue(this.resp[0].mailbreakDownCompletedBy);
        this.mailServiceForm
          .get("breakDownCompletedAt")
          .patchValue(this.resp[0].mailbreakDownCompletedAt);

        if (this.resp[0].mailstatus == "" || this.resp[0].mailstatus == null) {
          this.disableflag = false;
          this.pflag = true;
        } else {
          this.disableflag = true;
          this.pflag = false;
        }

        setTimeout(() => {
          (<NgcFormControl>this.mailServiceForm.get("flightNumber")).focus();
        }, 0);

      } else {
        this.refreshFormMessages(data);
        this.isSearch = false;
      }
    });

    this.expandAll();
  }
  addMailDiscrepancy(item, index) {
    (<NgcFormArray>(
      this.mailServiceForm.get(["segmentConcatAwb", index, "shipmentDiscrepancy"])
    )).addValue([
      {
        checkBox: false,
        shipmentNumber: "",
        shipmentType: "MAIL",
        receptacleNumber: "",
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
        discrepancyType: "DOCUMENT",
        manual: true,
        shipmentdate: new Date(),
        flagCRUD: "C"
      }
    ]);
  }

  addPhysical(item, index) {
    (<NgcFormArray>(
      this.mailServiceForm.get(["segmentConcatAwb", index, "physicalDiscrepancy"])
    )).addValue([
      {
        checkBox: false,
        shipmentNumber: "",
        shipmentType: "MAIL",
        receptacleNumber: "",
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
        discrepancyType: "PHYSICAL",
        manual: true,
        shipmentdate: new Date(),
        flagCRUD: "C"
      }
    ]);
  }
  fetchIrregularityTypes(item, index, pindex) {
    this.mailServiceForm
      .get([
        "segmentConcatAwb",
        index,

        "shipmentDiscrepancy",
        pindex,
        "irregularityDescription"
      ])
      .patchValue(item.desc);
  }

  fetchIrregularity(item, index, ppindex) {
    this.mailServiceForm
      .get([
        "segmentConcatAwb",
        index,
        "physicalDiscrepancy",
        ppindex,
        "irregularityDescription"
      ])
      .patchValue(item.desc);
  }

  onSave() {
    let request = new DiscrepancyResponse();
    request = this.mailServiceForm.getRawValue();
    request.flightId = this.resp[0].flightId;
    this.importService.addDiscrepancy(request).subscribe(data => {
      this.request = data.data;
      if (this.request) {
        this.showSuccessStatus("g.completed.successfully");
        this.onSearch();
        this.resetFormMessages();
      }
      // tslint:disable-next-line:one-line
      else {
        this.refreshFormMessages(data);
      }
    });
  }

  deleteDocDiscrepancy(event, index) {
    const x = this.mailServiceForm.get([
      "segmentConcatAwb",
      index,
      "shipmentDiscrepancy"
    ]).value;
    let uIndex = 0;
    x.forEach(e => {
      if (e["checkBox"]) {
        (<NgcFormArray>(
          this.mailServiceForm.get([
            "segmentConcatAwb",
            index,
            "shipmentDiscrepancy"
          ])
        )).markAsDeletedAt(uIndex);
      }
      uIndex++;
    });
  }

  deletePhysical(event, index) {
    const y = this.mailServiceForm.get([
      "segmentConcatAwb",
      index,
      "physicalDiscrepancy"
    ]).value;
    let vIndex = 0;
    y.forEach(e => {
      if (e["checkBox"]) {
        (<NgcFormArray>(
          this.mailServiceForm.get([
            "segmentConcatAwb",
            index,
            "physicalDiscrepancy"
          ])
        )).markAsDeletedAt(vIndex);
      }
      vIndex++;
    });
  }
  onFinalize() {
    const request = new DiscrepancyResponse();
    request.flightNumber = this.mailServiceForm.get("flightNumber").value;
    request.flightDate = this.mailServiceForm.get("date").value;
    request.flightId = this.resp[0].flightId;
    this.importService.finalizeMailDiscrepancy(request).subscribe(data => {
      this.refreshFormMessages(data);
      this.resp = data.data;
      if (this.resp) {
        this.showSuccessStatus("finalize.successful");
        this.onSearch();
      } else {
        this.refreshFormMessages(data);
      }
    });
  }

  collapseAll() {
    this.expandorcollapse = false;
  }
  expandAll() {
    this.expandorcollapse = true;
  }

  navigateToMailManifest() {
    let request: any = new RequestImportMailManifest();
    request.flightKey = this.mailServiceForm.get("flightNumber").value;
    request.flightDate = this.mailServiceForm.get("date").value;
    let event = request;
    this.navigateTo(this.router, "/import/importmanifestmail", event);
  }

  printReport() {
    this.reportParameters = new Object();
    this.reportParameters.FlightId = this.resp[0].flightId;
    this.reportParameters.offpoint = NgcUtility.getTenantConfiguration().airportCode;
    this.reportWindow.open();
  }
}

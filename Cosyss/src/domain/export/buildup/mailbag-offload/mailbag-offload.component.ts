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
  NgcInputComponent,
  NgcUtility,
  NgcWindowComponent,
  NgcContainerComponent,
  PageConfiguration,
  BaseBO
} from "ngc-framework";
import { Validator, Validators } from "@angular/forms";
import { NgcFormControl } from "ngc-framework";
import { StatusMessage } from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";

import { BuildupService } from "../buildup.service";
import {
  SearchMailOffload,
  ResponseMailOffload
} from "../../export.sharedmodel";

@Component({
  selector: "app-mailbag-offload",
  templateUrl: "./mailbag-offload.component.html",
  styleUrls: ["./mailbag-offload.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class MailbagOffloadComponent extends NgcPage implements OnInit {
  response: any;
  segment: any;
  resp: any;
  isSearch: boolean = false;
  private flightKeyforDropdown: any;
  private helpViewVisible: boolean = false;
  private mailOffloadSearch: NgcFormGroup = new NgcFormGroup({
    flight: new NgcFormControl(),
    departureDate: new NgcFormControl(),
    segment: new NgcFormControl(),
    nextDestinationCode: new NgcFormControl(),
    finalDestinationCode: new NgcFormControl(),
    mailbagoffloadresponsedetail: new NgcFormArray([]),
    selectAll: new NgcFormControl()
  });

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private buildupservice: BuildupService
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    // NgcUtility.trackCheckUnCheckAll(
    //   this.mailOffloadSearch.get("selectAll") as NgcFormControl,
    //   this.mailOffloadSearch.get("MailOffloadDetails") as NgcFormArray,
    //   "flagSave"
    // );
  }
  getSegmentId(item) {
    this.segment = item.code;
  }
  onSearch() {
    //this.mailOffloadSearch.reset();
    let searchmailoffload: SearchMailOffload = new SearchMailOffload();
    this.resetFormMessages();

    searchmailoffload.flight = this.mailOffloadSearch.get("flight").value;
    searchmailoffload.departureDate = this.mailOffloadSearch.get(
      "departureDate"
    ).value;
    searchmailoffload.finalDestinationCode = this.mailOffloadSearch.get(
      "finalDestinationCode"
    ).value;
    searchmailoffload.nextDestinationCode = this.mailOffloadSearch.get(
      "nextDestinationCode"
    ).value;
    searchmailoffload.segment = this.segment;

    this.buildupservice
      .fetchMailbagOffload(searchmailoffload)
      .subscribe(data => {
        this.resp = data.data;

        if (this.resp) {
          this.isSearch = true;

          this.resp.mailbagoffloadresponsedetail.forEach(element => {
            element["check"] = false;
          });
          this.mailOffloadSearch
            .get("mailbagoffloadresponsedetail")
            .patchValue(this.resp.mailbagoffloadresponsedetail);
        } else {
          this.refreshFormMessages(data);
          this.isSearch = false;
        }
      });
  }

  onSelectDate(event) {
    this.flightKeyforDropdown = this.createSourceParameter(
      this.mailOffloadSearch.get("flight").value,
      event
    );
  }

  Transfer() {
    let request: SearchMailOffload = new SearchMailOffload();
    request.flight = this.resp.flightId;
    request.segments = this.resp.segment;
    request.segment = this.resp.segment;
    let mailbagoffloadresponsedetail: any = (<NgcFormArray>(
      this.mailOffloadSearch.controls["mailbagoffloadresponsedetail"]
    )).getRawValue();
    request.mailbagoffloadresponsedetail = [];
    mailbagoffloadresponsedetail.forEach(element => {
      if (element.check) {
        request.mailbagoffloadresponsedetail.push(element);
      }
    });

    if (request.mailbagoffloadresponsedetail.length) {
      this.buildupservice.savecn46(request).subscribe(data => {
        this.response = data.data;
        if (this.response) {
          this.resetFormMessages();
          this.mailOffloadSearch.get("segment").reset();
          request.flightKey = this.mailOffloadSearch.get("flight").value;
          request.flightDate = this.mailOffloadSearch.get(
            "departureDate"
          ).value;
          let event = request;
          this.navigateTo(this.router, "/awbmgmt/createcn46", event);
        } else {
          this.refreshFormMessages(data);
        }
      });
    } else {
      this.showErrorStatus("export.select.atleast.one.row");
    }
  }
  onCancel(event) {
    this.mailOffloadSearch.reset();
    this.navigateHome();
  }
}

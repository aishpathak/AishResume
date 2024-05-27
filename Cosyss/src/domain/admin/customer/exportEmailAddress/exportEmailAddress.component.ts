import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcFormControl,
  NgcWindowComponent,
  NgcButtonComponent,
  NgcDateTimeInputComponent,
  NgcUtility,
  PageConfiguration,
  NgcContainerComponent,
  NgcReportComponent
} from "ngc-framework";
import { ActivatedRoute, Router } from "@angular/router";
import { ExportEmailAddress } from "../../admin.sharedmodel";

@Component({
  selector: "app-exportEmailAddress",
  templateUrl: "./exportEmailAddress.component.html",
  styleUrls: ["./exportEmailAddress.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: true
})
export class ExportEmailAddressComponent extends NgcPage implements OnInit {
  reportCode: any;
  contactTpeflag: boolean = false;
  reportParameters: any;

  private createReport: NgcFormGroup = new NgcFormGroup({
    contacttype: new NgcFormControl(),
    for: new NgcFormControl()
  });

  // @ViewChild('selectWindow') selectWindow: NgcWindowComponent;
  @ViewChild("reportWindow") reportWindow: NgcReportComponent;
  @ViewChild("reportWindow1") reportWindow1: NgcReportComponent;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.createReport.controls.for.valueChanges.subscribe(newValue => {
      if (newValue == "allcustomer") {
        (<NgcFormControl>this.createReport.get("contacttype")).setValidators([
          Validators.required
        ]);
        this.contactTpeflag = false;
      } else {
        (<NgcFormControl>this.createReport.get("contacttype")).setValidators(
          []
        );
        this.contactTpeflag = true;
      }
    });
  }

  // onExport() {
  //   const search = this.createReport.getRawValue();
  //   console.log(search);

  //   this.selectWindow.open();

  // }
  getCode(item) {
    let arrayCode = [];
    item.forEach(element => {
      arrayCode.push(element.code);

    });
    this.reportCode = arrayCode.join('-');
  }

  onExport() {

    if (this.createReport.get('for').value == 'adminall') {
      console.log(this.createReport.get('for').value);
      this.reportParameters = new Object();
      this.reportParameters.For = "Administrator"
      this.reportWindow.downloadReport();
    }
    if (this.createReport.get('for').value == 'allcustomer') {
      this.reportParameters = new Object();
      this.reportParameters.NotificationCode = this.reportCode;
      this.reportWindow1.downloadReport();
    }
  }
}
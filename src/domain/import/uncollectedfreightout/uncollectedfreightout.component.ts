import { Component, ElementRef, NgZone, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ImportService } from '../import.service';
import { NgcCheckBoxComponent, NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, NgcWindowComponent, PageConfiguration, NgcFileUploadComponent, NgcSignaturePadComponent, CellsRendererStyle, NgcUtility, NgcReportComponent } from 'ngc-framework';
import { ApplicationFeatures } from '../../common/applicationfeatures';


@Component({
  selector: 'app-uncollectedfreightout',
  templateUrl: './uncollectedfreightout.component.html',
  styleUrls: ['./uncollectedfreightout.component.scss']
})
export class UncollectedfreightoutComponent extends NgcPage {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  reportParameters: any = new Object();
  currentDate = new Date();
  constructor( appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private importService: ImportService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement)
  }
  private form: NgcFormGroup = new NgcFormGroup({
    date: new NgcFormControl(),
    fromdate: new NgcFormControl(),
    shipments: new NgcFormArray([
      new NgcFormGroup({

        shipmentNumber: new NgcFormControl(),
        pieces: new NgcFormControl(),
        weight: new NgcFormControl(),
        flight: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        collectionTerminal: new NgcFormControl(),
        select: new NgcFormControl()

      })
    ])

  })
 
  isData: boolean = false;
  ngOnInit() {
    super.ngOnInit();
    this.form.get('date').patchValue(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy HH'), 'ddMMMyy HH'));
  }
  onSearchData() {
    const requestData = this.form.getRawValue();

    if (this.form.get('date').value > this.currentDate) {
      return this.showErrorMessage('error.date.greater.current.date');
    }
    this.importService.unCollectedFreightout(requestData).subscribe(response => {
      if (response.data) {
        this.isData = true;
        console.log(response.data);
        this.form.get('shipments').patchValue(response.data);
        //this.showSuccessStatus("Report Sent Successfully!")
      } else {
        return this.showErrorMessage('no.record.found');
      }

    })

  }
  onSearch() {


    const requestData = this.form.getRawValue();
    if (!this.form.get('date').value) {
      return this.showErrorMessage('select.date');
    }

    if (this.form.get('date').value > this.currentDate) {
      return this.showErrorMessage('date.not.more.than.current.date');
    }

    this.importService.unCollectedFreightout(requestData).subscribe(response => {
      if (response.data) {

        this.showSuccessStatus("report.sent.successfully");
      } else {
        return this.showErrorMessage('no.record.found');
      }

    });
  }

  onreportcreation() {
    let parms = this.form.getRawValue();
    if (!this.form.get('date').value) {
      return this.showErrorMessage('select.date');
    }
    if (this.form.get('date').value > this.currentDate) {
      return this.showErrorMessage('date.not.more.than.current.date');
    }

    this.reportParameters = new Object();
    this.reportParameters.FromDate = parms.date;
    console.log(this.reportParameters);
    this.reportParameters.tenant = NgcUtility.getTenantConfiguration().tenantId;
    this.reportWindow.open();



    //setTimeout(() => {
    //this.importService.unCollectedFreightoutreport(parms).subscribe(response => {
    // if (response.data === null) {
    //return this.showErrorMessage('no.record.found');
    //} else {
    // this.refreshFormMessages(response);


    // }
    // });
    //}, 500);

    // }


  }
  backToHome(event) {
    this.router.navigate(['']);
  }
 
}


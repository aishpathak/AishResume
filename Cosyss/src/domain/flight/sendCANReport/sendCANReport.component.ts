import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent,
  NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration
} from 'ngc-framework';
import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FlightService } from '../flight.service';

@Component({
  selector: 'app-sendCANReport',
  templateUrl: './sendCANReport.component.html',
  styleUrls: ['./sendCANReport.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  focusToMandatory: true
})
export class SendCANReportComponent extends NgcPage implements OnInit {

  private sendCANReport: NgcFormGroup = new NgcFormGroup({
    fltConfirmationAdviceNoticeReportId: new NgcFormControl(),
    search: new NgcFormControl(true),
    createnew: new NgcFormControl(),
    canNumber: new NgcFormControl(),
    exportImport: new NgcFormControl(),
    flight: new NgcFormControl(),
    date: new NgcFormControl(),
    sendcanreportarray: new NgcFormArray([
      new NgcFormGroup({
        fltConfirmationAdviceNoticeReportId: new NgcFormControl(),
        canNumber: new NgcFormControl(),
        operatorName: new NgcFormControl(),
        exportImport: new NgcFormControl(),
        flight: new NgcFormControl(),
        date: new NgcFormControl(),
        origin: new NgcFormControl(),
        destination: new NgcFormControl(),
        senderName: new NgcFormControl(),
        status: new NgcFormControl(),
        acctype: new NgcFormControl(),
        aftreg: new NgcFormControl(),
        receiverdetail1: new NgcFormControl(),
        receiverdetail2: new NgcFormControl(),
        userName: new NgcFormControl(),
        userEmail: new NgcFormControl(),
        designation: new NgcFormControl(),
        userContact: new NgcFormControl(),
        staffNumber: new NgcFormControl(),
        userId: new NgcFormControl(),
        receiverdetail3: new NgcFormControl()
      })
    ])
  })
  showSearch: boolean;
  resp: any;
  isTable: boolean = false;
  user: any;

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private flightservice: FlightService) { super(appZone, appElement, appContainerElement); }

  ngOnInit() {
    this.sendCANReport.get('search').valueChanges.subscribe(a => {
      if (a) {
        this.showSearch = true;
        this.sendCANReport.get('exportImport').clearValidators();
        //this.sendCANReport.get('flight').setValidators(Validators.maxLength(8));
        //this.sendCANReport.get('date').clearValidators();

        this.sendCANReport.get('exportImport').patchValue('');
        this.sendCANReport.get('flight').patchValue('');
        this.sendCANReport.get('date').patchValue('');


        //this.sendCANReport.reset();
      } else {
        // this.sendCANReport.reset();
        //this.isTable = false;
        this.showSearch = false;
        this.sendCANReport.get('exportImport').setValidators(Validators.required);
        let x: any = new Array();
        x.push(Validators.maxLength(8));
        x.push(Validators.required);
        this.sendCANReport.get('flight').setValidators(x);
        this.sendCANReport.get('date').setValidators(Validators.required);

        this.sendCANReport.get('exportImport').patchValue('');
        this.sendCANReport.get('flight').patchValue('');
        this.sendCANReport.get('date').patchValue('');

        //this.sendCANReport.reset();
      }
    })
  }

  onSearch(event) {
    this.isTable = false;
    const search = this.sendCANReport.getRawValue();
    this.sendCANReport.patchValue(search);
    this.user = this.getUserProfile();
    search.userId = this.user.userProfileId;
    this.flightservice.searchCANReport(search).subscribe(data => {
      if (!this.showResponseErrorMessages(data)) {
        this.refreshFormMessages(data);
        this.resp = data.data;
        console.log(this.resp);
        if (this.resp.length !== 0) {
          this.isTable = true;
        }
        if (this.resp.length === 0) {
          // this.sendCANReport.reset();
          console.log(this.sendCANReport.get('search').value)
          console.log(this.sendCANReport.get('createnew').value)
          if (this.sendCANReport.get('search').value) {
            this.showErrorStatus("flight.no.record");
          }


          if (this.sendCANReport.get('createnew').value) {
            this.navigateTo(this.router, '/flight/createCANReport', { data: search, type: false });
          }

        }
        else {
          this.isTable = true;
          this.sendCANReport.get(['sendcanreportarray']).patchValue(this.resp);
        }
      }
    }, err => {
      this.showErrorStatus(err);
    }
    );
  }

  onLinkClick(event) {
    this.isTable = false;
    console.log(this.resp);
    this.navigateTo(this.router, '/flight/createCANReport', { data: this.resp[event.record.NGC_ROW_ID], type: true });
  }

}

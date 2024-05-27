import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild, ɵConsole } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent,
  NgcButtonComponent, NgcDateTimeInputComponent, NgcUtility, PageConfiguration, NgcReportComponent
} from 'ngc-framework';
import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FlightService } from '../flight.service';
import { BreakDownHandlingInstructionShipmentModel } from '../../import/import.sharedmodel';

@Component({
  selector: 'app-createCANReport',
  templateUrl: './createCANReport.component.html',
  styleUrls: ['./createCANReport.component.scss']
})

@PageConfiguration({
  trackInit: true,
  //callNgOnInitOnClear: true,
  autoBackNavigation: true,
  functionId: 'SEND_CAN_REPORTS'
})

export class CreateCANReportComponent extends NgcPage implements OnInit {

  requestobj: any;
  resp: any;
  str: any;
  response: any;
  reportParameters: any;
  disableFlag: boolean = false;
  error: boolean = false;
  private createCANReport: NgcFormGroup = new NgcFormGroup({
    fltConfirmationAdviceNoticeReportId: new NgcFormControl(),
    receiverdetail1: new NgcFormControl('Duty Manager(Pax Svcs T1)'),
    receiverdetail2: new NgcFormControl('Private Aircraft Carter and Cargo'),
    receiverdetail3: new NgcFormControl('Fax : 63432511'),
    email: new NgcFormArray([]),
    //new NgcFormControl('DM_T1jets@sats.com.sg'),
    status: new NgcFormControl('NEW'),
    senderName: new NgcFormControl('CARGO'),
    currentdate: new NgcFormControl(new Date()),
    canNumber: new NgcFormControl(),
    exportImport: new NgcFormControl(),
    operatorName: new NgcFormControl(),
    flight: new NgcFormControl(),
    aircrafttype: new NgcFormControl(),
    aircraftregistration: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    arrival: new NgcFormControl(),
    arrivaltime: new NgcFormControl(),
    departuretime: new NgcFormControl,
    departure: new NgcFormControl(),
    afttype: new NgcFormControl(),
    aftreg: new NgcFormControl(),
    userName: new NgcFormControl(),
    userEmail: new NgcFormControl(),
    designation: new NgcFormControl(),
    userContact: new NgcFormControl(),
    staffNumber: new NgcFormControl(),
    userId: new NgcFormControl(),




    serviceprovided: new NgcFormArray([])
  })
  emailArray: any;
  createnewdata: any
  request1: any;
  a: any;
  b: any;
  c: any;
  user: any;
  senderdetails: any;
  request: any;

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router, private flightservice: FlightService) {

    super(appZone, appElement, appContainerElement);

  }

  ngOnInit() {

    this.onSearch();
  }

  public onSearch() {
    // (this.createCANReport.get('email') as NgcFormArray).addValue([
    //   {
    //     emailelement: 'a@abc.com'
    //   }
    // ])
    this.createnewdata = this.getNavigateData(this.activatedRoute);
    // this.createCANReport.get('fltConfirmationAdviceNoticeReportId').setValue(createnewdata.data[0].fltConfirmationAdviceNoticeReportId);
    this.disableFlag = true;
    this.user = this.getUserProfile();
    console.log(this.createnewdata.data);
    if (this.createnewdata.type) {
      if (this.createnewdata.data.canNumber === null) {
        this.createCANReport.get('canNumber').patchValue(Math.floor((Math.random() * 1000000000) + 1));
      } else {
        this.createCANReport.get('canNumber').patchValue(this.createnewdata.data.canNumber);
      }
      this.createCANReport.get('fltConfirmationAdviceNoticeReportId').setValue(this.createnewdata.data.fltConfirmationAdviceNoticeReportId);
      this.createCANReport.get('exportImport').patchValue(this.createnewdata.data.exportImport);
      this.createCANReport.get('flight').patchValue(this.createnewdata.data.flight);
      this.createCANReport.get('operatorName').patchValue(this.createnewdata.data.operatorName);
      // this.createCANReport.get('senderName').patchValue(this.createnewdata.data.senderName);
      //this.createCANReport.get('status').patchValue(this.createnewdata.data.status);
      this.createCANReport.get('origin').patchValue(this.createnewdata.data.origin);
      this.createCANReport.get('destination').patchValue(this.createnewdata.data.destination);
      this.createCANReport.get('afttype').patchValue(this.createnewdata.data.afttype);
      this.createCANReport.get('aftreg').patchValue(this.createnewdata.data.aftreg);
      //this.createCANReport.get('receiverdetail1').patchValue(this.createnewdata.data.receiverdetail1);
      //this.createCANReport.get('receiverdetail2').patchValue(this.createnewdata.data.receiverdetail2);
      //this.createCANReport.get('receiverdetail3').patchValue(this.createnewdata.data.receiverdetail3);
      this.createCANReport.get('userName').patchValue(this.createnewdata.data.userName);
      this.createCANReport.get('userEmail').patchValue(this.createnewdata.data.userEmail);
      this.createCANReport.get('userContact').patchValue(this.createnewdata.data.usercontact);
      this.createCANReport.get('staffNumber').patchValue(this.createnewdata.data.staffNumber);
      this.createCANReport.get('designation').patchValue(this.createnewdata.data.designation);
      this.createCANReport.get('departure').patchValue(this.createnewdata.data.departure);
      this.createCANReport.get('arrival').patchValue(this.createnewdata.data.arrival);
      // this.createCANReport.get('email').patchValue(this.createnewdata.data[0].email[0])
      this.createCANReport.get('email').patchValue(this.createnewdata.data.email);
      //this.createCANReport.get('serviceprovided').pathValue(this.createnewdata.data[0])
      const serviceCANdata = this.createCANReport.getRawValue();
      serviceCANdata.userId = this.user.userProfileId;
      console.log(serviceCANdata);
      this.flightservice.serviceprovidedCANdata(serviceCANdata).subscribe(data => {
        this.resp = data.data;
        if (this.resp.length) {
          this.createCANReport.get('serviceprovided').patchValue(this.resp);

        }
      })




      // if (this.createnewdata.data[0].exportImport === "Import") {
      //   this.createCANReport.get('arrival').patchValue(this.createnewdata.data.date);
      //   this.createCANReport.get('destination').patchValue(this.createnewdata.data.tenantId);
      // } else {
      //   this.createCANReport.get('departure').patchValue(this.createnewdata.data.date);
      //   this.createCANReport.get('origin').patchValue(this.createnewdata.data.tenantId);
      // }

      // const serviceCANdata = this.createCANReport.getRawValue();
      // this.flightservice.serviceprovidedcreateadata(serviceCANdata).subscribe(data => {
      //   this.response = data.data;
      //   this.createCANReport.controls['serviceprovided'].patchValue(this.response);
      // })
    }
    else {
      this.createCANReport.get('exportImport').patchValue(this.createnewdata.data.exportImport);
      this.createCANReport.get('flight').patchValue(this.createnewdata.data.flight);
      this.createCANReport.get('canNumber').patchValue(this.b = Math.floor((Math.random() * 1000000000) + 1));
      if (this.createnewdata.data.exportImport === 'Import') {
        // this.createCANReport.get('arrival').patchValue(this.createnewdata.data.date);
        this.createCANReport.get('destination').patchValue(NgcUtility.getTenantConfiguration().airportCode);
      } else {
        // this.createCANReport.get('departure').patchValue(this.createnewdata.data.date);
        this.createCANReport.get('origin').patchValue(NgcUtility.getTenantConfiguration().airportCode);
      }
      this.request = this.createCANReport.getRawValue();
      this.user = this.getUserProfile();
      this.request.userId = this.user.userProfileId;
      this.request.flightDate = NgcUtility.getDateOnly(this.request.currentdate);
      this.flightservice.getflightdetails(this.request).subscribe(res => {
        if (res.data) {
          this.createCANReport.get('aftreg').patchValue(res.data.aftreg);
          this.createCANReport.get('origin').patchValue(res.data.origin);
          this.createCANReport.get('destination').patchValue(res.data.destination);
          this.createCANReport.get('afttype').patchValue(res.data.afttype);
          this.createCANReport.get('departure').patchValue(res.data.departure);
          this.createCANReport.get('arrival').patchValue(res.data.arrival);
          this.createCANReport.get('operatorName').patchValue(res.data.operatorName);
        }
      });
      this.flightservice.getsenderdetails(this.request).subscribe(res => {
        this.senderdetails = res.data;
        console.log(this.senderdetails);
        if (this.senderdetails) {
          this.createCANReport.get('userName').patchValue(this.senderdetails.userName);
          this.createCANReport.get('userEmail').patchValue(this.senderdetails.userEmail);
          this.createCANReport.get('userContact').patchValue(this.senderdetails.usercontact);
          this.createCANReport.get('staffNumber').patchValue(this.senderdetails.staffNumber);
          this.createCANReport.get('designation').patchValue(this.senderdetails.designation);
        }
      });
      const serviceCANdata = this.createCANReport.getRawValue();
      serviceCANdata.userId = this.user.userProfileId;
      console.log(serviceCANdata);
      this.flightservice.serviceprovidedCANdata(serviceCANdata).subscribe(data => {
        this.resp = data.data;
        console.log(this.resp);
        if (this.resp.length) {
          this.createCANReport.get('serviceprovided').patchValue(this.resp);
          //console.log(this.resp);
        }
      })
    }
  }

  public onSave(event) {
    this.error = false;

    this.request1 = (<NgcFormGroup>this.createCANReport).getRawValue();
    // this.request1.fltConfirmationAdviceNoticeReportId = this.createCANReport.get('fltConfirmationAdviceNoticeReportId').value;
    //console.log(this.request1);
    let i = 0;
    this.request1.serviceprovided.forEach(element => {
      if (element.servicedetails == null) {
        i++;
      }
    });
    if (i == this.request1.serviceprovided.length) {
      this.error = true;
      return this.showErrorStatus("flight.provide.service.details");
    }
    if (!this.error) {
      this.flightservice.insertCANDetails(this.request1).subscribe(
        data => {
          if (!this.showResponseErrorMessages(data)) {
            if (data.data) {
              // this.createCANReport.reset();
              this.resp = data.data;
              let temp = this.resp.serviceprovided.filter(i => {
                if (i.flagCRUD != "D") {
                  return i;
                }
              });
              this.resp.serviceprovided = temp;

              this.resp.serviceprovided.forEach(element => {
                element.flagCRUD = "R";
              });

              this.showSuccessStatus("g.completed.successfully");

              this.createCANReport.patchValue(this.resp);

              // this.request1.serviceprovided = this.request1.serviceprovided.filter(value => value.flagCRUD != 'D');
              // this.createCANReport.get('serviceprovided').patchValue(this.request1.serviceprovided);
              // this.resp.serviceprovided.forEach(value => value.flagCRUD = 'R');


              // this.createCANReport.patchValue(this.resp);


              //this.onSearch();
            }
          }
        }, error => {
          this.showErrorStatus(error);
        }

      );
    }
  }

  onaddEmail() {
    //TODO
  }


  onaddservice() {
    (<NgcFormArray>this.createCANReport.get('serviceprovided')).addValue([{
      service: null,
      servicedetails: null
    }
    ]);

  }


  deleteUld(event, index) {
    (<NgcFormArray>this.createCANReport.controls['serviceprovided']).markAsDeletedAt(index);
  }

  onClear() {
    this.a = this.createCANReport.get('canNumber').value;
    this.createCANReport.reset();
    //this.createCANReport.controls['serviceprovided'].patchValue(null);
    this.disableFlag = true;
    this.createCANReport.get('exportImport').patchValue(this.createnewdata.data.exportImport);
    this.createCANReport.get('flight').patchValue(this.createnewdata.data.flight);
    this.createCANReport.get('canNumber').patchValue(this.a);
    this.createCANReport.get('currentdate').patchValue(new Date());
    if (this.createnewdata.data.exportImport === "Import") {
      this.createCANReport.get('arrival').patchValue(this.createnewdata.data.date);
      this.createCANReport.get('destination').patchValue(NgcUtility.getTenantConfiguration().airportCode);
    } else {
      this.createCANReport.get('departure').patchValue(this.createnewdata.data.date);
      this.createCANReport.get('origin').patchValue(NgcUtility.getTenantConfiguration().airportCode);
    }
    this.createCANReport.get('serviceprovided').patchValue(new Array());
    this.createCANReport.get('exportImport').patchValue(this.createnewdata.data[0].exportImport);
    this.createCANReport.get('flight').patchValue(this.createnewdata.data[0].flight);
    if (this.createnewdata.data.exportImport === "Import") {
      this.createCANReport.get('arrival').patchValue(this.createnewdata.data[0].date);
      this.createCANReport.get('destination').patchValue(NgcUtility.getTenantConfiguration().airportCode);
    } else {
      this.createCANReport.get('departure').patchValue(this.createnewdata.data[0].date);
      this.createCANReport.get('origin').patchValue(NgcUtility.getTenantConfiguration().airportCode);
    }
    this.createCANReport.get('serviceprovided').patchValue(new Array());


  }

  public onBack(event) {
    this.navigateBack(this.createCANReport.getRawValue());
  }


  onCANServiceReportgeneration() {
    this.onSave(event);
    this.user = this.getUserProfile();
    this.request1 = this.createCANReport.getRawValue();
    this.request1.userId = this.user.userProfileId;
    //console.log(this.request1);
    this.flightservice.onCANServiceReportgeneration(this.request1).subscribe(response => {
      if (response.data) {
        this.showSuccessStatus("success.report.sent");
      }

    });


    this.reportParameters = new Object();
    this.reportParameters.CANNumber = this.createCANReport.get('canNumber').value;
    this.reportParameters.UserId = this.user.userProfileId;
    //this.reportParameters.trolleyflag = this.createCANReport.get('').value
    //this.reportWindow.open();
  }

}

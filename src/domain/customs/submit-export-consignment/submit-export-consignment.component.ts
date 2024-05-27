import { DatePipe } from '@angular/common';
import { Component, ElementRef, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcFileUploadComponent, NgcFormControl } from 'ngc-framework';
import { CustomACESService } from '../customs.service';


@Component({
  selector: 'app-submit-export-consignment',
  templateUrl: './submit-export-consignment.component.html',
  styleUrls: ['./submit-export-consignment.component.scss']
})


export class SubmitExportConsignmentComponent extends NgcPage implements OnInit {

  private submitExportConsignment: NgcFormGroup = new NgcFormGroup({
    departureDate: new NgcFormControl(NgcUtility.addDate(NgcUtility.subtractDate(NgcUtility.getCurrentDateOnly(), 0, DateTimeKey.DAYS), (23 * 60) + 59, DateTimeKey.MINUTES)),

    flightList: new NgcFormArray([
      new NgcFormGroup({
        departureDate: new NgcFormControl(),
        fltNoDepDate: new NgcFormControl(),
        flightNo: new NgcFormControl(),
        etd: new NgcFormControl(),
        exportShipmentList: new NgcFormArray([
          new NgcFormGroup({
            shipmentNumber: new NgcFormControl()
          })
        ])
      })
    ]),

  });
  data: any;
  showDataFlag: boolean = false;
  setDob: string;
  flightid: any;
  flightNo: any;
  navigateBackData: any;
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute,
    private customsService: CustomACESService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.navigateBackData = this.getNavigateData(this.activatedRoute);
    console.log(this.navigateBackData);
    if (this.navigateBackData) {
      if (this.navigateBackData.flightDate) {
        this.submitExportConsignment.get('departureDate').patchValue(this.navigateBackData.flightDate);
      }
      this.onSearch();
    }
  }


  onSearch() {
    console.log(this.submitExportConsignment.getRawValue());
    let request = <NgcFormGroup>this.submitExportConsignment.getRawValue();
    console.log(request);
    this.customsService.fetchSubmitExportConsigment(request).subscribe(response => {
      console.log(response);
      this.refreshFormMessages(response);
      this.data = response.data;
      if (this.data.flightList.length > 0) {
        let sno1 = 1;
        this.data.flightList.forEach(element => {
          element.sno = sno1;
          sno1 = sno1 + 1;
          var datePipe = new DatePipe('en-US');
          this.setDob = datePipe.transform(element.departureDate, 'ddMMMyy');
          element.fltNoDepDate = element.flightNo + "/" + this.setDob
          console.log(element.fltNoDepDate);
        });
      }

      this.submitExportConsignment.get('flightList').patchValue(this.data.flightList);
      this.showDataFlag = true;

      console.log(this.submitExportConsignment.get('flightList').value);
    }, error => {
      this.showErrorStatus(error);
    })
  }


  openShipment(index: any) {
    // if (this.submitExportConsignment.get(['flightList', index, 'status']).value == 'No FFM') {
    //   this.showErrorMessage('No FFM is Received for this Flight');
    //   return;
    // }

    this.flightNo = this.submitExportConsignment.get(['flightList', index, 'flightNo']).value;
    console.log(this.flightNo);

    var dataToSend = {
      flightId: this.submitExportConsignment.get(['flightList', index, 'flightId']).value,
      flightDate: this.submitExportConsignment.get(['flightList', index, 'flightDate']).value,
      flightNo: this.submitExportConsignment.get(['flightList', index, 'flightNo']).value
    }
    console.log(dataToSend);
    this.navigateTo(this.router, 'customs/submitExportShipment', dataToSend);
  }


}

import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcWindowComponent, NgcReportComponent, NgcUtility } from 'ngc-framework';
import { CustomACESService } from '../customs.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-maintain-constraint-code',
  templateUrl: './maintain-constraint-code.component.html',
  styleUrls: ['./maintain-constraint-code.component.scss']
})
@PageConfiguration({ trackInit: true, callNgOnInitOnClear: true })
export class MaintainConstraintCodeComponent extends NgcPage {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  reportParameters: any;
  searchButtonClicked: boolean;
  response: any;
  saveRequest: any;
  saveResponse: any;
  select: boolean = false;
  /**
  *
  * @param appZone
  * @param appElement
  * @param appContainerElement
  */

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private customsService: CustomACESService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);
  }

  @ViewChild('houseInformationWindow')
  private houseInformationWindow: NgcWindowComponent;

  private constraintCodeForm: NgcFormGroup = new NgcFormGroup({
    flightType: new NgcFormControl(),
    flight_Key: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flight_Date: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    datEta: new NgcFormControl(),
    datAta: new NgcFormControl(),
    hawbNumber: new NgcFormControl(),
    cerefNo: new NgcFormControl(),
    cc: new NgcFormControl(),
    lastUpdateLogin: new NgcFormControl(),
    lastUpdateDate: new NgcFormControl(),
    awb_Number: new NgcFormControl(),
    dateSTA: new NgcFormControl(),
    dateSTD: new NgcFormControl(),
    retrieveMaintainConstraintCode: new NgcFormArray([
      new NgcFormGroup({
        select: new NgcFormControl(),
        flightType: new NgcFormControl(),
        flight_Key: new NgcFormControl(),
        flight_Date: new NgcFormControl(),
        datEta: new NgcFormControl(),
        datAta: new NgcFormControl(),
        hawbNumber: new NgcFormControl(),
        cerefNo: new NgcFormControl(),
        cc: new NgcFormControl(),
        lastUpdateLogin: new NgcFormControl(),
        lastUpdateDate: new NgcFormControl(),
        awb_Number: new NgcFormControl(),
        dateSTA: new NgcFormControl(),
        dateSTD: new NgcFormControl(),
      })
    ]),
  });

  /**
   * Method to retrieve data of Maintain Constraint Code Screen
   */
  onSearch() {
    let request = this.constraintCodeForm.getRawValue();

    if (request.flightType == null || request.flightType == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.constraintCodeForm.get('flightType'), "Mandatory");
    }

    if (request.flight_Key == null || request.flight_Key == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.constraintCodeForm.get('flight_Key'), "Mandatory");
    }

    if (request.flight_Date == null) {
      return this.showFormControlErrorMessage(<NgcFormControl>this.constraintCodeForm.get('flight_Date'), "Mandatory");
    }

    request.mode = request.flightType;
    request.awbNumber = request.awb_Number;
    request.flightKey = request.flight_Key;
    request.flightDate = request.flight_Date;

    this.customsService.getMaintainConstraintCode(request).subscribe((data) => {
      if (!this.showResponseErrorMessages(data)) {
        this.response = data.data;
        if (this.response != null) {
          this.refreshFormMessages(data);
          this.searchButtonClicked = true;

          this.constraintCodeForm.patchValue(this.response);
          this.showSuccessStatus('g.completed.successfully');
          console.log(this.constraintCodeForm.value);
        }
        else {
          this.searchButtonClicked = false;
          this.showErrorMessage("val.noRecordFound");
        }
      }
      else {
        this.searchButtonClicked = false;
      }
    });

  }

  /**
   * Method to save Data of Constraint Code by Maintain Constraint Code Screen
   */
  onSave() {
    let saveArray = [];
    let saveRequest = (<NgcFormArray>this.constraintCodeForm.get(['retrieveMaintainConstraintCode'])).value;
    //To save old value of cc and c&e ref no for history purpose
    saveRequest.forEach(element => {
      if (element.select) {
        this.response.retrieveMaintainConstraintCode.forEach(oldElement => {
          if (oldElement.hawbNumber == element.hawbNumber
            && oldElement.awb_Number == element.awb_Number) {
            element.oldcc = oldElement.cc;
            element.oldcerefNo = oldElement.cerefNo;
          }
        });
        saveArray.push(element);
      }
    })

    if (saveArray.length > 0) {

      for (let i = 0; i < saveRequest.length; i++) {
        if (saveRequest[i].select) {
          if (saveRequest[i].oldcerefNo != null) {
            if (saveRequest[i].oldcC == saveRequest[i].cc && saveRequest[i].oldcERefNo == saveRequest[i].cerefNo) {
              return this.showFormControlErrorMessage(<NgcFormControl>this.constraintCodeForm.get(['retrieveMaintainConstraintCode', i, 'cerefNo']), "c&e.ref.no.and.constraint.code.are.already.exists.");
            }
          }
          if (saveRequest[i].cc == null || saveRequest[i].cc == '') {
            return this.showFormControlErrorMessage(<NgcFormControl>this.constraintCodeForm.get(['retrieveMaintainConstraintCode', i, 'cc']), "Mandatory");
          }
        }
      }

      // Service call to save data
      this.customsService.insertMaintainConstraintCode(saveArray).subscribe(data => {
        this.refreshFormMessages(data);
        this.saveResponse = data.data;
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus("g.completed.successfully");
          this.onSearch();
        }
      });
    }
    else {
      this.showErrorMessage('please.select.record');
    }
  }

  /**
   * Method to open report as per Flight Type selected
   */
  onreportcreation() {
    let parms = this.constraintCodeForm.getRawValue();
    let row = (<NgcFormArray>this.constraintCodeForm.get(['retrieveMaintainConstraintCode'])).value;
    this.reportParameters = new Object();
    this.reportParameters.FlightKey = this.constraintCodeForm.get('flight_Key').value;
    this.reportParameters.awbNumber = this.constraintCodeForm.get('awb_Number').value;
    this.reportParameters.tenantId = NgcUtility.getTenantConfiguration().airportCode;
    this.reportParameters.mode = this.constraintCodeForm.get('flightType').value;
    this.reportParameters.flightDate = this.constraintCodeForm.get('flight_Date').value;
    this.reportParameters.shipmentDate = row[0].shipmentDate;
    console.log(this.reportParameters);
    this.reportWindow.open();
  }

  /**
   * Method to clear the screen
   */
  onClear() {
    this.searchButtonClicked = false;
    this.constraintCodeForm.reset();
    this.resetFormMessages();
  }

  /**
   * Method to generate page number
   */
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  /**
   * Method to navigate previous screen.
   * This Method will be called on click on cancel button
   * @param event
   */
  onCancel(event) {
    this.navigateBack(this.constraintCodeForm.getRawValue());
  }

}

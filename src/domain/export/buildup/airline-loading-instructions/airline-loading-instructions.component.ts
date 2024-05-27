import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcUtility, PageConfiguration, NgcReportComponent, NgcFormArray, NgcTabComponent } from 'ngc-framework';
import { FlightAirlineLoadingInstructions } from '../../export.sharedmodel';
import { BuildupService } from '../buildup.service';
import { Validators } from '@angular/forms';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { UldAccountingComponent } from '../../../billing/billingReports/uldAccounting/uldAccounting.component';

@Component({
  selector: 'app-airline-loading-instructions',
  templateUrl: './airline-loading-instructions.component.html',
  styleUrls: ['./airline-loading-instructions.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class AirlineLoadingInstructionsComponent extends NgcPage {
  uldId: number = 1;
  heightId: number = 1;
  isSectionFlag: boolean = false;
  flightKeyFlag: boolean = false;
  flightDateFlag: boolean = false;
  flightKeyAndDateFlag: boolean = false;
  requiredFieldFlag: boolean = true;
  isTableFlag: boolean = false;
  flagForVersion: boolean = true;
  showAddButton: boolean = true;
  reportParameters: any;
  activeByIndex = 0;
  flightAirlineLoadingInstructions = new FlightAirlineLoadingInstructions();
  public flightAirlineLoadingInstructionsForm: NgcFormGroup = new NgcFormGroup({
    searchFormGroup: new NgcFormGroup({
      flightKey: new NgcFormControl('', Validators.required),
      flightOriginDate: new NgcFormControl(null, Validators.required)
    }),
    airlineLoadingInstructions: new NgcFormGroup({
      palletForFlightUse: new NgcFormControl(null, [Validators.min(0)]),
      palletForFlightContainer: new NgcFormControl(null, [Validators.min(0)]),
      palletForTransitUse: new NgcFormControl(null, [Validators.min(0)]),
      containerForTransitUse: new NgcFormControl(null, [Validators.min(0)]),
      palletForCargoUse: new NgcFormControl(null, [Validators.min(0)]),
      containerForCargoUse: new NgcFormControl(null, [Validators.min(0)]),
      trolleys: new NgcFormControl(null, [Validators.min(0)]),
      instructionVersion: new NgcFormControl(),
      receivedDate: new NgcFormControl(),
      loadingInstruction: new NgcFormControl(),
    }),
    std: new NgcFormControl(),
    day: new NgcFormControl(),
    flightType: new NgcFormControl(),
    routing: new NgcFormControl(),
    activeByDefault: new NgcFormControl(),
    activeByULD: new NgcFormControl(),
    activeByHeight: new NgcFormControl(),
    activeByAllotment: new NgcFormControl(),
    uldTypeAirlineLoadingInstr: new NgcFormArray([
      new NgcFormGroup({
        expAirlineLoadingByUldTypeId: new NgcFormControl([]),
        uldType: new NgcFormControl([]),
        countUldType: new NgcFormControl([Validators.min(1)])
      })
    ]),
    heightCodeAirlineLoadingInstr: new NgcFormArray([
      new NgcFormGroup({
        expAirlineLoadingByContourId: new NgcFormControl([]),
        contourCode: new NgcFormControl([]),
        countContour: new NgcFormControl([Validators.min(1)])
      })
    ]),
    uldAllotmentInstr: new NgcFormArray([
      new NgcFormGroup({
        uldAllotment: new NgcFormControl(),
        allotmentType: new NgcFormControl(),
        countAllotment: new NgcFormControl()

      })
    ]),
  });
  transferData: any;

  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('reportWindowUld') reportWindowUld: NgcReportComponent;
  @ViewChild('reportWindowHeight') reportWindowHeight: NgcReportComponent;
  @ViewChild('reportWindowAllotment') reportWindowAllotment: NgcReportComponent;
  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private buildService: BuildupService, private router: Router
    , private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.transferData = this.getNavigateData(this.activatedRoute);
    if (this.transferData) {
      this.flightAirlineLoadingInstructionsForm.get('searchFormGroup').patchValue(this.transferData);
      this.searchAirlineLoadingInstructions();
    }
  }
  /**
   * search for airlineLoadingInstructions
   * based on flight and flight date
  */
  searchAirlineLoadingInstructions() {
    const searchFormGroup: NgcFormGroup = (<NgcFormGroup>this.flightAirlineLoadingInstructionsForm.get('searchFormGroup'));
    // Validate
    searchFormGroup.validate();
    // If Invalid, Don't Process
    if (this.flightAirlineLoadingInstructionsForm.get('searchFormGroup').invalid) {
      return;
    }
    this.flightAirlineLoadingInstructions = new FlightAirlineLoadingInstructions();
    this.flightAirlineLoadingInstructions.flightKey = searchFormGroup.get('flightKey').value;
    this.flightAirlineLoadingInstructions.flightOriginDate = searchFormGroup.get('flightOriginDate').value;
    this.searchResponse();
  }
  /**
    * gets the search response of airlineLoadingInstructions
    * based on flight and flight date
   */
  searchResponse() {
    this.resetFormMessages();
    this.buildService.fetchAirlineLoadingInstructionsForAFlight(this.flightAirlineLoadingInstructions).subscribe(response => {
      this.flightAirlineLoadingInstructions = response.data;
      if (response.data == null) {
        this.refreshFormMessages(response);
        this.isTableFlag = false;
        this.isSectionFlag = false;
      }
      else if (response.data.airlineLoadingInstructions.instructionVersion < 1) {
        this.flightAirlineLoadingInstructionsForm.patchValue(response.data);
        this.flightAirlineLoadingInstructionsForm.controls.airlineLoadingInstructions.get('receivedDate').patchValue(null);
        this.flightAirlineLoadingInstructionsForm.controls.airlineLoadingInstructions.get('instructionVersion').patchValue(0);
        this.flightAirlineLoadingInstructionsForm.controls.airlineLoadingInstructions.get('loadingInstruction').patchValue('');
        this.isTableFlag = true;
        this.isSectionFlag = true;
      }
      else {
        this.flightAirlineLoadingInstructionsForm.patchValue(response.data);
        console.log(this.flightAirlineLoadingInstructionsForm.value);
        console.log(this.flightAirlineLoadingInstructionsForm.get('uldTypeAirlineLoadingInstr').value);

        if (this.flightAirlineLoadingInstructionsForm.get('activeByDefault').value) {
          this.activeByIndex = 0;
        }
        else if (this.flightAirlineLoadingInstructionsForm.get('activeByULD').value) {
          this.activeByIndex = 1;
        }
        else if (this.flightAirlineLoadingInstructionsForm.get('activeByHeight').value) {
          this.activeByIndex = 2;
        }
        else if (this.flightAirlineLoadingInstructionsForm.get('activeByAllotment').value) {
          this.activeByIndex = 3;
        }

        this.isTableFlag = true;
        this.isSectionFlag = true;
      }
    },
      error => {
        this.showErrorStatus('Error:' + error);
        this.isTableFlag = false;
        this.isSectionFlag = false;
      });


  }
  addUldAndCount(len: Number) {
    for (var i = 0; i < len; i++) {

    }

  }

  /**
     *saves  airlineLoadingInstructions
     * for a flight
    */
  onSave() {
    this.flightAirlineLoadingInstructionsForm.validate();
    if (this.flightAirlineLoadingInstructionsForm.invalid) {
      return;
    }
    if (!this.flightAirlineLoadingInstructionsForm.get('activeByDefault').value && !this.flightAirlineLoadingInstructionsForm.get('activeByULD').value
      && !this.flightAirlineLoadingInstructionsForm.get('activeByHeight').value && !this.flightAirlineLoadingInstructionsForm.get('activeByAllotment').value) {
      this.showErrorStatus('export.ali.select.active');
      return;
    }
    var count = false;
    var uldType1 = false;
    var heightType = false;
    if (this.flightAirlineLoadingInstructionsForm.get('uldTypeAirlineLoadingInstr').value != null) {
      this.flightAirlineLoadingInstructionsForm.get('uldTypeAirlineLoadingInstr').value.forEach(element => {
        if (element.countUldType == 0 || element.countUldType == null) {
          count = true;
        }
        if (element.uldType == null || element.uldType == "") {
          uldType1 = true;
        }
      });
    }
    if (this.flightAirlineLoadingInstructionsForm.get('heightCodeAirlineLoadingInstr').value != null) {
      this.flightAirlineLoadingInstructionsForm.get('heightCodeAirlineLoadingInstr').value.forEach(element => {
        if (element.countContour == 0 || element.countContour == null) {
          count = true;
        }
        if (element.contourCode == null || element.contourCode == "") {
          heightType = true;
        }
      });
    }
    if (count) {
      this.showErrorStatus('export.ali.count');
      return;
    }
    if (uldType1) {
      this.showErrorStatus('export.ali.select.uldtype');
      return;
    }
    if (heightType) {
      this.showErrorStatus('export.ali.select.heighttype');
      return;
    }
    this.flightAirlineLoadingInstructions = this.flightAirlineLoadingInstructionsForm.getRawValue();
    this.buildService.saveAirlineLoadingInstructionsForAFlight(this.flightAirlineLoadingInstructions).subscribe(response => {
      /*  if (response.data == null) {
          this.showErrorStatus('export.enter.valid.flight.and.flight.date');
        }
        else {*/
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('export.airlineLoadingInstructions.saved.successfully');
        this.flightAirlineLoadingInstructionsForm.patchValue(response.data)
        this.searchAirlineLoadingInstructions();
      }

    },
      error => {
        this.showErrorStatus('Error:' + error);
      });
  }
  /**
   * reset's the form
   */
  onClear() {
    this.flightAirlineLoadingInstructionsForm.reset();
    this.isTableFlag = false;
    this.isSectionFlag = false;
  }

  onClickFlightPlanner() {
    this.navigateTo(this.router, '/export/planning-list', {});
  }

  onClickPrint() {
    if (this.flightAirlineLoadingInstructionsForm.get('activeByDefault').value) {
      this.reportParameters = new Object();
      this.reportParameters.flightkey = this.flightAirlineLoadingInstructions.flightKey;
      this.reportParameters.flightdate = this.flightAirlineLoadingInstructions.flightOriginDate;
      this.reportParameters.flightId = this.flightAirlineLoadingInstructions.airlineLoadingInstructions.flightId;
      this.reportParameters.tenant = NgcUtility.getTenantConfiguration().airportCode;
      this.reportWindow.open();
    }
    else if (this.flightAirlineLoadingInstructionsForm.get('activeByULD').value) {
      this.reportParameters = new Object();
      this.reportParameters.flightkey = this.flightAirlineLoadingInstructions.flightKey;
      this.reportParameters.flightdate = this.flightAirlineLoadingInstructions.flightOriginDate;
      this.reportParameters.flightId = this.flightAirlineLoadingInstructions.airlineLoadingInstructions.flightId;
      this.reportParameters.tenant = NgcUtility.getTenantConfiguration().airportCode;
      this.reportWindowUld.open();
    }
    else if (this.flightAirlineLoadingInstructionsForm.get('activeByHeight').value) {
      this.reportParameters = new Object();
      this.reportParameters.flightkey = this.flightAirlineLoadingInstructions.flightKey;
      this.reportParameters.flightdate = this.flightAirlineLoadingInstructions.flightOriginDate;
      this.reportParameters.flightId = this.flightAirlineLoadingInstructions.airlineLoadingInstructions.flightId;
      this.reportParameters.tenant = NgcUtility.getTenantConfiguration().airportCode;
      this.reportWindowHeight.open();
    }
    else if (this.flightAirlineLoadingInstructionsForm.get('activeByAllotment').value) {
      this.reportParameters = new Object();
      this.reportParameters.flightkey = this.flightAirlineLoadingInstructions.flightKey;
      this.reportParameters.flightdate = this.flightAirlineLoadingInstructions.flightOriginDate;
      this.reportParameters.flightId = this.flightAirlineLoadingInstructions.airlineLoadingInstructions.flightId;
      this.reportParameters.tenant = NgcUtility.getTenantConfiguration().airportCode;
      this.reportWindowAllotment.open();
    }
  }


  onDeleteULDType(index: any) {
    this.showConfirmMessage('edi.delete.record.confirmation').then(fulfilled => {
      let uldDelete = this.flightAirlineLoadingInstructionsForm.get(['uldTypeAirlineLoadingInstr', index]).value;
      console.log(uldDelete);
      if (uldDelete.flagCRUD === 'C') {
        (<NgcFormArray>this.flightAirlineLoadingInstructionsForm.get('uldTypeAirlineLoadingInstr')).deleteValueAt(index);
      }
      else {
        this.buildService.deleteULDType(uldDelete).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            if (response.data) {
              this.showSuccessStatus("g.completed.successfully");
              this.searchAirlineLoadingInstructions();
            }
          }
        })
      }
    })
  }


  onDeleteByheight(index: any) {
    this.showConfirmMessage('edi.delete.record.confirmation').then(fulfilled => {
      let byHeightDelete = this.flightAirlineLoadingInstructionsForm.get(['heightCodeAirlineLoadingInstr', index]).value;
      if (byHeightDelete.flagCRUD === 'C') {
        (<NgcFormArray>this.flightAirlineLoadingInstructionsForm.get('heightCodeAirlineLoadingInstr')).deleteValueAt(index);
      }
      else {
        this.buildService.deleteByHeight(byHeightDelete).subscribe(response => {
          if (!this.showResponseErrorMessages(response)) {
            if (response.data) {
              this.showSuccessStatus("g.completed.successfully");
              this.searchAirlineLoadingInstructions();
            }
          }
        })
      }

    })
  }
  onCancel() {
    this.navigateBack(this.transferData);
  }



  onAddULDType() {
    const noOfRows = (<NgcFormArray>this.flightAirlineLoadingInstructionsForm.get('uldTypeAirlineLoadingInstr')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.flightAirlineLoadingInstructionsForm.get('uldTypeAirlineLoadingInstr')).controls[noOfRows - 1] : null;
    if (noOfRows === 0 || (lastRow.get('uldType').value && lastRow.get('countUldType').value)) {
      (<NgcFormArray>this.flightAirlineLoadingInstructionsForm.get('uldTypeAirlineLoadingInstr')).addValue([
        {

          uldType: "",
          countUldType: ""
        }
      ]);
    } else {
      this.showInfoStatus("common.adding.row.warning");
    }

  }

  onAddByHeight() {
    const noOfRows = (<NgcFormArray>this.flightAirlineLoadingInstructionsForm.get('heightCodeAirlineLoadingInstr')).length;
    const lastRow = noOfRows ? (<NgcFormArray>this.flightAirlineLoadingInstructionsForm.get('heightCodeAirlineLoadingInstr')).controls[noOfRows - 1] : null;
    if (noOfRows === 0 || (lastRow.get('contourCode').value && lastRow.get('countContour').value)) {
      (<NgcFormArray>this.flightAirlineLoadingInstructionsForm.get('heightCodeAirlineLoadingInstr')).addValue([
        {

          contourCode: "",
          countContour: ""
        }
      ]);
    } else {
      this.showInfoStatus("common.adding.row.warning");
    }

  }

  clickActiveULD(active: any) {

    if (active) {
      this.flightAirlineLoadingInstructionsForm.get('activeByULD').patchValue(true);
      this.flightAirlineLoadingInstructionsForm.get('activeByHeight').patchValue(false);
      this.flightAirlineLoadingInstructionsForm.get('activeByAllotment').patchValue(false);
      this.flightAirlineLoadingInstructionsForm.get('activeByDefault').patchValue(false);
    }
  }
  clickActiveHeight(active: any) {

    if (active) {
      this.flightAirlineLoadingInstructionsForm.get('activeByULD').patchValue(false);
      this.flightAirlineLoadingInstructionsForm.get('activeByHeight').patchValue(true);
      this.flightAirlineLoadingInstructionsForm.get('activeByAllotment').patchValue(false);
      this.flightAirlineLoadingInstructionsForm.get('activeByDefault').patchValue(false);
    }
  }
  clickActiveAllotment(active: any) {

    if (active) {
      this.flightAirlineLoadingInstructionsForm.get('activeByULD').patchValue(false);
      this.flightAirlineLoadingInstructionsForm.get('activeByHeight').patchValue(false);
      this.flightAirlineLoadingInstructionsForm.get('activeByAllotment').patchValue(true);
      this.flightAirlineLoadingInstructionsForm.get('activeByDefault').patchValue(false);
    }
  }

  clickActiveDefault(active: any) {

    if (active) {
      this.flightAirlineLoadingInstructionsForm.get('activeByULD').patchValue(false);
      this.flightAirlineLoadingInstructionsForm.get('activeByHeight').patchValue(false);
      this.flightAirlineLoadingInstructionsForm.get('activeByAllotment').patchValue(false);
      this.flightAirlineLoadingInstructionsForm.get('activeByDefault').patchValue(true);
    }
  }

}



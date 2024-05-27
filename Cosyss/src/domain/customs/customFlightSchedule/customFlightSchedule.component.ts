import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, NgcWindowComponent, PageConfiguration, NgcUtility, NgcDataTableComponent, NgcReportComponent } from 'ngc-framework';
import { CustomACESService } from '../customs.service';
import { FlightModel, customMRSMOdel } from '../customs.sharedmodel';

@Component({
  selector: 'app-customFlightSchedule',
  templateUrl: './customFlightSchedule.component.html',
  styleUrls: ['./customFlightSchedule.component.scss']
})
@PageConfiguration({
  trackInit: true,

  autoBackNavigation: true,
  callNgOnInitOnClear: true
  // restorePageOnBack: true

})
export class CustomFlightScheduleComponent extends NgcPage implements OnInit {
  response: any;
  saveButton: any;
  displayFlag = false;
  dropdownsourcesearch: any[] = ["Import", "Export"];
  dropdownAllList: any[] = ["BOTH", "YES", "NO"];
  shpCneDropdownList: any[] = ['Yes', 'No'];
  parameter: any;
  flightOffPointDisableFlag: boolean = false;
  flightBoardPointDisableFlag: boolean = false;
  customerListDetails: any;
  cancelFlight: any = false;
  reportParameters: any;
  reportParameters1: any;
  rawVal: any;
  finalFlag: any;
  resp: any;
  response2: any;
  @ViewChild("reportWindow")
  reportWindow: NgcReportComponent;
  @ViewChild("reportWindowxls")
  reportWindowxls: NgcReportComponent;
  @ViewChild("reportWindow1")
  reportWindow1: NgcReportComponent;
  currIndex: any;
  loadedThroughNavigation: boolean = false;

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
    this.route.params.subscribe(params => (this.parameter = params.id));
  }
  onClear(event) {
    this.async(() => {
      this.paginateReset.goToPage(0);
    }, 1000)
    this.loadedThroughNavigation = false;

  }

  ngOnInit() {

    let forwardeddata = this.getNavigateData(this.activatedRoute);
    if (forwardeddata) {
      if (forwardeddata.exportOrImport && forwardeddata.exportOrImport === 'I') {
        this.customFlightSchedule.get('importExportIndicator').patchValue('IMPORT');
      } else if (forwardeddata.exportOrImport && forwardeddata.exportOrImport === 'E') {
        this.customFlightSchedule.get('importExportIndicator').patchValue('EXPORT');
      } else {
        this.customFlightSchedule.get('importExportIndicator').patchValue(forwardeddata.exportOrImport);
      }
      this.customFlightSchedule.get('flightDate').patchValue(forwardeddata.flightDate);
      if (forwardeddata.withCargoFlag) {
        this.customFlightSchedule.get('withCargoFlag').patchValue(forwardeddata.withCargoFlag);
      }
      if (forwardeddata.mrsSentFlag) {
        this.customFlightSchedule.get('mrsSentFlag').patchValue(forwardeddata.mrsSentFlag);
      }
      if (forwardeddata.fmaReceivedFlag) {
        this.customFlightSchedule.get('fmaReceivedFlag').patchValue(forwardeddata.fmaReceivedFlag);
      }
      if (forwardeddata.directShpCneShipment) {
        this.customFlightSchedule.get('directShpCneShipment').patchValue(forwardeddata.directShpCneShipment);
      }
      if (forwardeddata.directShpCneShipmentWithPermit) {
        this.customFlightSchedule.get('directShpCneShipmentWithPermit').patchValue(forwardeddata.directShpCneShipmentWithPermit);
      }
      if (forwardeddata.carrier) {
        this.customFlightSchedule.get('carrier').patchValue(forwardeddata.carrier);
      }
      if (forwardeddata.flightNumber) {
        this.customFlightSchedule.get('flightNumber').patchValue(forwardeddata.flightNumber);
      }


      this.currIndex = forwardeddata.curruentpage;
      console.log("scxhedule" + this.currIndex)

      this.loadedThroughNavigation = true;

      this.onSearch();
    }
    super.ngOnInit();
  }

  @ViewChild('addACESFlight') addACESFlight: NgcWindowComponent;
  @ViewChild('paginateReset') paginateReset: NgcDataTableComponent;

  customFlightSchedule: NgcFormGroup = new NgcFormGroup({
    importExportIndicator: new NgcFormControl('', Validators.required),
    flightDate: new NgcFormControl('', Validators.required),
    carrier: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    numberOfFlights: new NgcFormControl(),
    mrsSentFlag: new NgcFormControl('BOTH'),
    fmaReceivedFlag: new NgcFormControl('BOTH'),
    withCargoFlag: new NgcFormControl('BOTH'),
    directShpCneShipment: new NgcFormControl(),
    directShpCneShipmentWithPermit: new NgcFormControl(),
    customerListDetails: new NgcFormArray([]),
    flightKey: new NgcFormControl(),
    importExportIndicator1: new NgcFormControl('', Validators.required),
    flightDate1: new NgcFormControl('', Validators.required),
    carrier1: new NgcFormControl(),
    finalIndicator: new NgcFormControl(),
    customsFlightId: new NgcFormControl()
  });

  addFlightForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl('', Validators.required),
    carrier: new NgcFormControl(),
    flightNumber: new NgcFormControl(),
    importExportIndicator: new NgcFormControl('', Validators.required),
    flightDate: new NgcFormControl('', Validators.required),
    flightBoardPoint: new NgcFormControl('', Validators.required),
    flightOffPoint: new NgcFormControl('', Validators.required),
    carrierShortName: new NgcFormControl(),
  })

  onSearch() {
    if (!this.loadedThroughNavigation) {
      this.currIndex = 0;
    }

    let fltnum = this.customFlightSchedule.get('flightNumber').value;
    let carr = this.customFlightSchedule.get('carrier').value;
    if (fltnum) {
      this.customFlightSchedule.get('flightKey').patchValue(carr + fltnum);
    }

    const request = this.customFlightSchedule.getRawValue();
    this.customFlightSchedule.controls['importExportIndicator1'].setValue(request.importExportIndicator);
    this.customFlightSchedule.controls['flightDate1'].setValue(request.flightDate);
    this.customFlightSchedule.controls['carrier1'].setValue(request.carrier);

    this.customFlightSchedule.validate();
    if (this.customFlightSchedule.invalid) {
      return;
    } else {
      let after90DaysDate = new Date().setDate(new Date().getDate() + 90);
      if (request.flightDate > after90DaysDate) {
        this.displayFlag = false;
        this.showErrorStatus('NoFlightOnDateError');
      } else {
        request.withCargoFlag
        this.customsService.filterFlightInfoBasedOnCriteria(request).subscribe(
          response => {
            this.finalFlag = '';
            this.refreshFormMessages(response.data);
            this.customerListDetails = response.data;
            if (this.customerListDetails != null) {
              this.customFlightSchedule.controls['numberOfFlights'].patchValue(this.customerListDetails.length);
              this.customerListDetails.forEach(element => {
                element.isRecordChecked = false;
                if (element.mRSSentDate) {
                  this.finalFlag = "Final";
                } else {
                  this.finalFlag = "";
                }
              });
              this.customFlightSchedule.get('finalIndicator').setValue(this.finalFlag);
              this.customFlightSchedule.controls['customerListDetails'].patchValue(this.customerListDetails);
              this.displayFlag = true;
              this.rawVal = (<NgcFormArray>this.customFlightSchedule.get('customerListDetails')).getRawValue();
              let mrsFlag = this.customFlightSchedule.get('mrsSentFlag').value;
              let fmaFlag = this.customFlightSchedule.get('fmaReceivedFlag').value;
              let filteredResult = this.getFilteredValue(request.withCargoFlag, mrsFlag, fmaFlag);
              (<NgcFormArray>this.customFlightSchedule.get('customerListDetails')).patchValue(filteredResult);
              this.customFlightSchedule.controls['numberOfFlights'].patchValue(filteredResult.length);

            }
            else {
              this.displayFlag = false;
              this.customFlightSchedule.controls['̥'].patchValue(0);
              this.refreshFormMessages(response.data)
            }
          },
          error => {
            this.showErrorStatus(error);
          });
      }
    }
  }

  openModel(event) {
    this.addFlightForm.reset();
    this.addACESFlight.open();
  }

  onBindComplete() {
    this.async(() => {
      this.paginateReset.goToPage(this.currIndex);
    }, 1000)

  }

  setBoardPointOffPoint(event) {
    let selectedValue = this.addFlightForm.get('importExportIndicator').value;
    if (selectedValue === '') {
      this.flightOffPointDisableFlag = false;
      this.flightBoardPointDisableFlag = false;
    }
    if (selectedValue === 'Import') {
      this.addFlightForm.get('flightOffPoint').setValue(NgcUtility.getTenantConfiguration().airportCode);
      this.addFlightForm.get('importExportIndicator').setValue('I');
      this.flightOffPointDisableFlag = true;
      this.flightBoardPointDisableFlag = false;
      if (NgcUtility.isTenantAirport(this.addFlightForm.get('flightBoardPoint').value)) {
        this.addFlightForm.get('flightBoardPoint').setValue(null);
      }
    } if (selectedValue === 'Export') {
      this.addFlightForm.get('flightBoardPoint').setValue(NgcUtility.getTenantConfiguration().airportCode);
      this.addFlightForm.get('importExportIndicator').setValue('E');
      this.flightBoardPointDisableFlag = true;
      this.flightOffPointDisableFlag = false;
      if (NgcUtility.isTenantAirport(this.addFlightForm.get('flightOffPoint').value)) {
        this.addFlightForm.get('flightOffPoint').setValue(null);
      }
    }
  }

  addFlight() {
    if (this.addFlightForm.valid) {
      this.addACESFlight
      this.addFlightForm.get('flightKey').patchValue(this.addFlightForm.get('carrier').value + this.addFlightForm.get('flightNumber').value);
      let request = this.addFlightForm.getRawValue();
      this.customsService.addFlightDetails(request).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.addACESFlight.close();
          this.showSuccessStatus('flightAddedSuccess');
          this.onSearch();
        }
      }, error => {
        this.showErrorStatus(
          'BOOKING8'
        );
      })
    }
    this.addFlightForm.patchValue(null);
  }



  selectedRecords() {
    let selectedFlights = [];
    let flightListDetails = this.customFlightSchedule.getRawValue().customerListDetails;
    this.customFlightSchedule.getRawValue().customerListDetails.forEach(element => {
      if (element.isRecordChecked) {
        selectedFlights.push(element);
      }
    });

    if (selectedFlights.length === 0) {
      this.showErrorStatus('FligntCancelError');
      return;
    }
    selectedFlights.forEach(selectedFlight => {
      if (selectedFlight.withCargoFlag === 'NIL') {
        if (selectedFlight['mrssentDate'] === null) {
          this.cancelFlight = false;
          selectedFlight.flightCancelFlag = null;
          selectedFlight.withCargoFlag = null;

        }
        else {
          this.cancelFlight = true;

        }
      } else {
        this.cancelFlight = true;

      }
    })
    if (this.cancelFlight) {
      this.showErrorStatus('FligntCancelError');
      return;
    }
    else {
      this.customsService.updateCancelledUncancelledFlightStatus(selectedFlights).subscribe(response => {
        if (response.data !== null) {
          this.refresh();
          this.clearErrorList();
          this.onSearch();
          this.showSuccessStatus('flightStatusUpdateSuccess');
        }
      }, error => {
        this.showErrorStatus('Error:' + error);
      });
    }
  }



  basedOnColumnPerformAction(event) {
    if (event !== null) {
      if (event.column == 'history') {
        this.reportParameters = new Object();
        this.reportParameters.flightkey = event.record["flightKey"];
        this.reportParameters.flightdate = event.record["flightDate"];

        this.reportWindow1.open();

      }
      if (event.column == 'flightKey') {
        let request: FlightModel = new FlightModel();
        request.flightKey = event.record["flightKey"];
        request.flightDate = event.record["flightDate"];
        request.exportOrImport = event.record["importExportIndicator"];
        request.withCargoFlag = this.customFlightSchedule.get("withCargoFlag").value;
        request.carrier = this.customFlightSchedule.get("carrier").value;
        request.flightNumber = this.customFlightSchedule.get("flightNumber").value;
        request.curruentpage = this.paginateReset.getCurrentPage();
        request.mrsSentFlag = this.customFlightSchedule.get("mrsSentFlag").value;
        request.fmaReceivedFlag = this.customFlightSchedule.get("fmaReceivedFlag").value;
        request.directShpCneShipment = this.customFlightSchedule.get("directShpCneShipment").value;
        request.directShpCneShipmentWithPermit = this.customFlightSchedule.get("directShpCneShipmentWithPermit").value;
        this.navigateTo(this.router, '/customs/customsmanifestreconsilation', request);
      }
    }
  }
  onSendMrs() {
    let flightsArrayToSendMrs = [];
    let selectedFlights = { importExportIndicator: null, flightDate: null, flightKey: null, flightId: null };

    let i = 0;
    let count = 0;
    let count2 = 0;
    let selected = 0;
    let flag: boolean = false;
    const rawvalue = this.customFlightSchedule.getRawValue().customerListDetails;
    rawvalue.forEach(element => {
      if (element.isRecordChecked) {
        selected++;
        if (!element.mrssentDate) {
          count = 1;
        } if (element.mrssentDate) {
          count2 = 1;
        }
      }


    });
    if (selected < 1) {
      this.showErrorStatus("SelectAtleastOneSM");
      return;
    }
    if (count == 1 && count2 == 1) {
      flag = true;
      this.showErrorStatus("deselectMrsExistError");
      return;
    }
    if (!flag) {
      rawvalue.forEach(element => {
        if (element.isRecordChecked) {
          if (element.mrssentDate == null || element.mrssentDate == "") {
            const req: customMRSMOdel = new customMRSMOdel();
            req.exportOrImport = this.customFlightSchedule.get('importExportIndicator').value;
            req.flightKey = element.flightKey;
            req.flightDate = this.customFlightSchedule.get('flightDate').value;
            req.customsFlightId = element.customsFlightId;
            req.mrssentby = this.getUserProfile().userLoginCode;
            req.openMrs = false;
            if (req.exportOrImport === "IMPORT") {
              req.exportOrImport = "I";
            } else {
              req.exportOrImport = "E";
            }
            this.customsService.getMrsInfo(req).subscribe(data => {
              this.response = data.data;
              this.refreshFormMessages(data);

              if (this.response) {
                if (!this.response.validMrsWindow && req.exportOrImport === "E") {
                  this.showErrorMessage(NgcUtility.translateMessage("invalidActionMrsDays", [this.response.mrsFirstWindowForExport]));
                  return;
                }
                else if (!this.response.validMrsWindow && req.exportOrImport === 'I') {
                  this.showErrorMessage(NgcUtility.translateMessage("invalidActionMrsDays", [this.response.mrsfirstWindowForImport]));
                  return;
                } else {
                  this.customsService.sendMrsInfo(req).subscribe(data2 => {
                    this.response2 = data2.data;
                    this.refreshFormMessages(data2);
                    this.onSearch();
                    this.showSuccessStatus("MRSSendSuccess");
                    if (this.response2) {






                    } else {
                      this.showErrorStatus(this.response2);
                    }
                  }, error => this.showErrorStatus('g.error'));

                }
              }
              else {
                this.showErrorStatus(this.response);
              }
            }, error => this.showErrorStatus('g.error'));


          }
          else {
            //   if (i == 0) {
            this.showErrorStatus("openMrsForResending");
            return;
            // }
          }

        }
        i++;
      });
    }




  }
  onCargoSearch() {
    (<NgcFormArray>this.customFlightSchedule.get('customerListDetails')).patchValue(this.rawVal);

    let cargoflag = this.customFlightSchedule.get('withCargoFlag').value;
    let mrsFlag = this.customFlightSchedule.get('mrsSentFlag').value;
    let fmaFlag = this.customFlightSchedule.get('fmaReceivedFlag').value;

    let filteredResult = this.getFilteredValue(cargoflag, mrsFlag, fmaFlag);
    (<NgcFormArray>this.customFlightSchedule.get('customerListDetails')).patchValue(filteredResult);
    this.customFlightSchedule.controls['numberOfFlights'].patchValue(filteredResult.length);
    if (cargoflag === 'BOTH' || cargoflag === null) {
      return;
    } else {
      if (cargoflag === 'NO') {
        cargoflag = 'NIL';
      } else {
        this.customFlightSchedule.get('withCargoFlag').patchValue('YES');
      }
    }
  }
  getFilteredValue(withCargoValue: String, mrsFlag: any, fmaFlag: any) {
    if (withCargoValue === 'YES') {
      if (mrsFlag === 'BOTH') {
        if (fmaFlag === 'BOTH') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === withCargoValue));
        } else if (fmaFlag === 'YES') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === withCargoValue
            && record['fmaacknowledgeDate'] !== null));
        } else if (fmaFlag === 'NO') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === withCargoValue && record['fmaacknowledgeDate'] == null));
        }
      }
      else if (mrsFlag === 'YES') {
        if (fmaFlag === 'BOTH') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === withCargoValue && record['mrssentDate'] !== null));
        } else if (fmaFlag === 'YES') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === withCargoValue && record['mrssentDate'] !== null &&
            record['fmaacknowledgeDate'] !== null));
        } else if (fmaFlag === 'NO') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === withCargoValue && record['mrssentDate'] !== null &&
            record['fmaacknowledgeDate'] == null));
        }
      }
      else if (mrsFlag === 'NO') {
        if (fmaFlag === 'BOTH') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === withCargoValue && record['mrssentDate'] == null
          ));
        } else if (fmaFlag === 'YES') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === withCargoValue && record['mrssentDate'] == null &&
            record['fmaacknowledgeDate'] !== null));
        } else if (fmaFlag === 'NO') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === withCargoValue && record['mrssentDate'] == null &&
            record['fmaacknowledgeDate'] == null));
        }
      }
    }

    else if (withCargoValue === 'NO') {
      if (mrsFlag === 'BOTH') {
        if (fmaFlag === 'BOTH') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === 'NIL'));
        } else if (fmaFlag === 'YES') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === 'NIL'
            && record['fmaacknowledgeDate'] !== null));
        } else if (fmaFlag === 'NO') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === 'NIL' && record['fmaacknowledgeDate'] == null));
        }
      }
      else if (mrsFlag === 'YES') {
        if (fmaFlag === 'BOTH') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === 'NIL' && record['mrssentDate'] !== null));
        } else if (fmaFlag === 'YES') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === 'NIL' && record['mrssentDate'] !== null &&
            record['fmaacknowledgeDate'] !== null));
        } else if (fmaFlag === 'NO') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === 'NIL' && record['mrssentDate'] !== null &&
            record['fmaacknowledgeDate'] == null));
        }
      }
      else if (mrsFlag === 'NO') {
        if (fmaFlag === 'BOTH') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === 'NIL' && record['mrssentDate'] == null
          ));
        } else if (fmaFlag === 'YES') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === 'NIL' && record['mrssentDate'] == null &&
            record['fmaacknowledgeDate'] !== null));
        } else if (fmaFlag === 'NO') {
          return this.rawVal.filter(record => (record['withCargoFlag'] === 'NIL' && record['mrssentDate'] == null &&
            record['fmaacknowledgeDate'] == null));
        }
      }
    }
    else if (withCargoValue === 'BOTH') {
      if (mrsFlag === 'BOTH') {
        if (fmaFlag === 'BOTH') {
          return this.rawVal;
        } else if (fmaFlag === 'YES') {
          return this.rawVal.filter(record => (
            record['fmaacknowledgeDate'] !== null));
        } else if (fmaFlag === 'NO') {
          return this.rawVal.filter(record => (record['fmaacknowledgeDate'] == null));
        }
      }
      else if (mrsFlag === 'YES') {
        if (fmaFlag === 'BOTH') {
          return this.rawVal.filter(record => (record['mrssentDate'] !== null));
        } else if (fmaFlag === 'YES') {
          return this.rawVal.filter(record => (record['mrssentDate'] !== null &&
            record['fmaacknowledgeDate'] !== null));
        } else if (fmaFlag === 'NO') {
          return this.rawVal.filter(record => (record['mrssentDate'] !== null &&
            record['fmaacknowledgeDate'] == null));
        }
      }
      else if (mrsFlag === 'NO') {
        if (fmaFlag === 'BOTH') {
          return this.rawVal.filter(record => (record['mrssentDate'] == null
          ));
        } else if (fmaFlag === 'YES') {
          return this.rawVal.filter(record => (record['mrssentDate'] == null &&
            record['fmaacknowledgeDate'] !== null));
        } else if (fmaFlag === 'NO') {
          return this.rawVal.filter(record => (record['mrssentDate'] == null &&
            record['fmaacknowledgeDate'] == null));
        }
      }
    }
    else {
      return this.rawVal.filter(record => record['withCargoFlag']);
    }
  }



  deleteACESFlights() {
    let selectedFlights = [];
    let flightListDetails = this.customFlightSchedule.getRawValue().customerListDetails;
    flightListDetails.forEach(element => {
      if (element.isRecordChecked) {
        element.flightCancelFlag = null;
        element.withCargoFlag = null;
        selectedFlights.push(element);
      }
    });

    if (selectedFlights.length === 0) {
      this.showErrorStatus('NoFlightSelectedError');
      return;
    }
    selectedFlights.forEach(selectedFlight => {
      this.customsService.deleteFlights(selectedFlights).subscribe(response => {
        if (response.data !== null) {
          this.refresh();
          this.clearErrorList();
          this.onSearch();
          this.showSuccessStatus('flightDeleteSuccess');
        }
        if (response.messageList[0].code.includes('FK_Customs_Flight_Custom_ShipmentInfo')) {
          this.showErrorMessage("flightWithCargo");
          return;
        }
      }, error => {
        this.showErrorStatus(error);
      });
    })
  }

  onCarrierChange(event) {
    if (event.desc) {
      this.addFlightForm.get('carrierShortName').patchValue(event.desc);
    }


  }

  onPrint() {
    this.reportParameters = new Object();


    this.reportParameters.flightDate = this.customFlightSchedule.get("flightDate").value;
    this.reportParameters.ImpExpIndicator = this.customFlightSchedule.get("importExportIndicator").value;
    this.reportParameters.WithCargo = this.customFlightSchedule.get("withCargoFlag").value;
    this.reportParameters.MrsSent = this.customFlightSchedule.get("mrsSentFlag").value;
    this.reportParameters.FmaSent = this.customFlightSchedule.get("fmaReceivedFlag").value;
    this.reportParameters.Carrier = this.customFlightSchedule.get("carrier").value;
    this.reportParameters.flightkey = this.customFlightSchedule.get("flightNumber").value;
    this.reportParameters.DirectShipperCount = this.customFlightSchedule.get("directShpCneShipment").value;
    this.reportParameters.DirectShipperPermit = this.customFlightSchedule.get("directShpCneShipmentWithPermit").value;
    this.reportWindow.open();

  }

  onPrintXLS() {
    this.reportParameters = new Object();


    this.reportParameters.flightDate = this.customFlightSchedule.get("flightDate").value;
    this.reportParameters.ImpExpIndicator = this.customFlightSchedule.get("importExportIndicator").value;
    this.reportParameters.WithCargo = this.customFlightSchedule.get("withCargoFlag").value;
    this.reportParameters.MrsSent = this.customFlightSchedule.get("mrsSentFlag").value;
    this.reportParameters.FmaSent = this.customFlightSchedule.get("fmaReceivedFlag").value;
    this.reportParameters.Carrier = this.customFlightSchedule.get("carrier").value;
    this.reportParameters.flightkey = this.customFlightSchedule.get("flightNumber").value;
    this.reportParameters.DirectShipperCount = this.customFlightSchedule.get("directShpCneShipment").value;
    this.reportParameters.DirectShipperPermit = this.customFlightSchedule.get("directShpCneShipmentWithPermit").value;
    this.reportWindowxls.downloadReport();

  }
}
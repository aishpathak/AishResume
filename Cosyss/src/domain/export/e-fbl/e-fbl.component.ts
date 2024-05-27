import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgcFormControl } from 'ngc-framework';
import { ExportService } from './../export.service';
import { NgcReportComponent } from 'ngc-framework';
import {
  NgcPage, NgcFormGroup, NgcFormArray,
  NgcWindowComponent, NgcButtonComponent, NgcUtility, NgcDropDownComponent, NgcInputComponent, PageConfiguration, BaseResponse
} from 'ngc-framework';
import { Flight, SearchEFBL } from '../export.sharedmodel';
@Component({
  selector: 'app-e-fbl',
  templateUrl: './e-fbl.component.html',
  styleUrls: ['./e-fbl.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: false
})
export class EFBLComponent extends NgcPage {


  flightKeyforDropdown: any;
  private uldSourceParameter: any;
  private flightDateForAutoSearch: any;
  private flightKeyForAutoSearch: any;
  private response;
  private flightFlag;
  segment: any;
  reportParameters: any;
  manifestFlag: boolean = false;
  segmentFlag: boolean = false;
  isactiveByDefault: boolean = false;
  isactiveByUld: boolean = false;
  isactiveByHeight: boolean = false;
  isactiveByAllotment: boolean = false;
  savedisable: boolean = true;
  navigateBackData: any;

  @ViewChild("TallySheet") TallySheet: NgcReportComponent;

  private EFBLform: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl('', Validators.required),
    flight_key: new NgcFormControl('', Validators.required),
    flightOriginDate: new NgcFormControl('', Validators.required),
    flight_Date: new NgcFormControl(new Date(), Validators.required),
    flightSegmentId: new NgcFormControl(),
    segment_ID: new NgcFormControl(),
    flightNo: new NgcFormControl(),
    flightId: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    std: new NgcFormControl(),
    etd: new NgcFormControl(),
    aircraftType: new NgcFormControl(),
    aircraftRegistration: new NgcFormControl(),
    totalPiecesBookedInFlight: new NgcFormControl(),
    totalWeightBookedInFlight: new NgcFormControl(),
    firstTimeManifestCompletedAt: new NgcFormControl(),
    segmentList: new NgcFormControl(),
    airlineLoadingInstructions: new NgcFormArray([]),
    uldtypeali: new NgcFormArray([
      new NgcFormGroup({
        uldType: new NgcFormControl([]),
        totalUldType: new NgcFormControl([]),
        uldTypeUsed: new NgcFormControl([]),
        remainingUldType: new NgcFormControl([])
      })
    ]),
    heighttypeali: new NgcFormArray([
      new NgcFormGroup({
        heightCode: new NgcFormControl([]),
        totalHeightType: new NgcFormControl([]),
        heightTypeUsed: new NgcFormControl([]),
        remainingHeightType: new NgcFormControl([])
      })
    ]),
    allotmenttypeali: new NgcFormArray([
      new NgcFormGroup({
        allotmentType: new NgcFormControl([]),
        totalAllotment: new NgcFormControl([]),
        usedAllotment: new NgcFormControl([]),
        remainingAllotmentType: new NgcFormControl([])
      })
    ]),
    bookedShipment: new NgcFormArray([]),
    premanShipment: new NgcFormArray([]),
  });


  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute, private router: Router, private exportService: ExportService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {

    this.navigateBackData = this.getNavigateData(this.activatedRoute);
    if (this.navigateBackData) {
      if (this.navigateBackData.flightKey) {
        this.EFBLform.get('flight_key').patchValue(this.navigateBackData.flightKey);
      }
      if (this.navigateBackData.flightNo) {
        this.EFBLform.get('flight_key').patchValue(this.navigateBackData.flightNo);
      }
      if (this.navigateBackData.dateSTD) {
        this.EFBLform.get('flight_Date').patchValue(this.navigateBackData.dateSTD);
      }
      if (this.navigateBackData.flightDate) {
        this.EFBLform.get('flight_Date').patchValue(this.navigateBackData.flightDate);
      }
      if (this.navigateBackData.flightOriginDate) {
        this.EFBLform.get('flight_Date').patchValue(this.navigateBackData.flightOriginDate);
      }



      this.onSearch();

    }


  }



  onFlightKey() {
    // this.flightKeyforDropdown =   this.createSourceParameter(event);
    this.EFBLform.get('segment_ID').reset();
    if (this.EFBLform.get('flight_Date').value) {
      this.flightKeyforDropdown = this.createSourceParameter(this.EFBLform.get('flight_key').value,
        this.EFBLform.get('flight_Date').value);
    }
  }


  //On select of segment ID
  selectSegmentId(event) {

    this.segment = event.desc;


  }

  onSearch() {
    if (this.EFBLform.get('flight_key').invalid || this.EFBLform.get('flight_Date').invalid) {
      this.showErrorStatus('expaccpt.input.all.mandatory.details');
      return;
    }

    const searchReq = new SearchEFBL();
    searchReq.flightKey = this.EFBLform.get('flight_key').value;
    searchReq.flightOriginDate = this.EFBLform.get('flight_Date').value;
    // searchReq.segmentId = this.EFBLform.get('segment_ID').value;
    this.exportService.getEFBLInfo(searchReq).subscribe((resp) => {
      this.response = resp;
      if (this.response.success) {
        this.flightFlag = true;
        this.showResponseErrorMessages(resp);


        this.EFBLform.patchValue(this.response.data);

        if (this.response.data.firstTimeManifestCompletedAt != null) {
          this.manifestFlag = true;
        } else {
          this.manifestFlag = false;
        }


        if (this.response.data.aliUldHeightAllot != null) {
          this.isactiveByUld = this.response.data.aliUldHeightAllot.activeByULD;
          this.isactiveByDefault = this.response.data.aliUldHeightAllot.activeByDefault;
          this.isactiveByHeight = this.response.data.aliUldHeightAllot.activeByHeight;
          this.isactiveByAllotment = this.response.data.aliUldHeightAllot.activeByAllotment;
          this.EFBLform.get('uldtypeali').patchValue(this.response.data.aliUldHeightAllot.uldTypeALI);
          this.EFBLform.get('heighttypeali').patchValue(this.response.data.aliUldHeightAllot.heightTypeALI);
          this.EFBLform.get('allotmenttypeali').patchValue(this.response.data.aliUldHeightAllot.allotmentTypeALI);
          console.log(this.EFBLform.get('allotmenttypeali').value);
        } else {
          this.isactiveByDefault = true;
        }

        console.log(this.EFBLform.getRawValue());


      } else {
        this.showResponseErrorMessages(resp);
      }
    });

  }


  createManifest() {
    this.showConfirmMessage('do.you.want.to.create.manifest').then(fulfilled => {
      const manifestFlight = new Flight();
      manifestFlight.flightKey = this.EFBLform.get('flight_key').value;
      manifestFlight.flightOriginDate = this.EFBLform.get('flight_Date').value;
      manifestFlight.flightId = this.EFBLform.get('flightId').value;
      if (this.EFBLform.get('aircraftRegistration').value != null) {
        manifestFlight.aircraftRegistration = this.EFBLform.get('aircraftRegistration').value;
      }
      if (manifestFlight.aircraftRegistration == null) {
        return this.showErrorMessage("export.aircraft.registration.cannot.be.blank");
      }
      this.exportService.checkNilAndCreateManifest(manifestFlight).subscribe(data => {
        if (data.data && data.data.nilCargo) {
          this.showConfirmMessage('export.flight.nil.cargo.proceed.with.manifest.confirmation').then(fulfilled => {
            this.exportService.createManifest(data.data).subscribe(data => {
              this.refreshFormMessages(data);

              if (data.messageList == null) {
                this.showSuccessStatus("g.completed.successfully");
                this.onSearch();
              }
            }, error => {
              this.showErrorStatus(error);
            });
          }
          ).catch(reason => {
          });
        }
        // if (data.data && data.data.warnigAndErrorMessage) {
        if (data.data && !data.data.nilCargo) {
          manifestFlight.skipCpeCheck = true;
          this.exportService.createManifest(data.data).subscribe(data => {
            this.refreshFormMessages(data);
            if (data.messageList == null) {
              this.showSuccessStatus("g.completed.successfully");
              this.onSearch();
            }
          }, error => {
            this.showErrorStatus(error);
          });
          this.refreshFormMessages(data);
          if (data.messageList == null) {
            this.showSuccessStatus("g.completed.successfully");
            this.onSearch();
          }

        } error => {
          if (error) {
            this.showErrorStatus(error);
          }

        }
        // }
        this.refreshFormMessages(data);
        if (data.success && data.messageList == null) {
          this.showSuccessStatus("g.completed.successfully");
          this.onSearch();
        }
      }, error => {
        if (error) {
          this.showErrorStatus(error);
        }

      });
    });
  }




  flightCompleteUncomplete() {
    const request = this.EFBLform.getRawValue();
    if (request.buildupCompletedAt != null) {
      request.buildCompleteFlag = true;
      this.showConfirmMessage('Do you want to Uncomplete Flight Build up ?').then(fulfilled => {
        this.exportService.flightBUComplete(request).subscribe((resp) => {
          this.response = resp;
          if (this.response.success) {
            this.flightFlag = true;
            this.showResponseErrorMessages(resp);
            this.showSuccessStatus('g.completed.successfully');
            this.onSearch();

          } else {
            this.showResponseErrorMessages(resp);
          }
        });


      });



    } else {
      request.buildCompleteFlag = false;

      this.showConfirmMessage('Do you want to Complete Flight Build up ?').then(fulfilled => {
        this.exportService.flightBUComplete(request).subscribe((resp) => {
          this.response = resp;
          if (this.response.success) {
            this.flightFlag = true;
            this.showResponseErrorMessages(resp);
            this.showSuccessStatus('g.completed.successfully');
            this.onSearch();

          } else {
            this.showResponseErrorMessages(resp);
          }
        });


      });
    }

  }


  routeToLoadShipment() {
    let segId = this.EFBLform.get('segment_ID').value;
    // let segId = null;
    // if (segList === 'All') {
    //   segId = this.resultSegments[0].segmentId
    // } else {
    //   segId = this.currentSegment.segmentId;
    // }
    let navigateObj = {
      flightKey: this.EFBLform.get("flight_key").value,
      flightOriginDate: new Date(this.EFBLform.get("flight_Date").value),
      segmentId: segId
    }
    this.navigateTo(this.router, '/export/buildup/revisedloadshipment', navigateObj);
  }

  routeToUnloadShipment() {
    let navigateObj = {
      flightKey: this.EFBLform.get("flight_key").value,
      flightOriginDate: new Date(this.EFBLform.get("flight_Date").value)
    }
    this.navigateTo(this.router, '/export/buildup/unloadshipmentDesktop', navigateObj);
  }

  routeToCargoManifest() {
    let transferData: any = {
      'flightKey': this.EFBLform.get('flight_key').value,
      'flightOriginDate': this.EFBLform.get('flight_Date').value
    };
    this.navigateTo(this.router, '/export/buildup/cargomanifest', transferData);
  }

  routeToUpdateDLS() {
    let transferData: any = {
      'flightKey': this.EFBLform.get('flight_key').value,
      'flightOriginDate': this.EFBLform.get('flight_Date').value
    };
    this.navigateTo(this.router, '/export/buildup/update-dls', transferData);
  }



  routeToAssignUld() {
    let navigateObj = {
      flightKey: this.EFBLform.get("flight_key").value,
      flightOriginDate: new Date(this.EFBLform.get("flight_Date").value)
    }
    this.navigateTo(this.router, '/export/buildup/assign-uld-flight', navigateObj);
  }

  onNavigateToNotoc() {
    let reqObj = new Object();
    reqObj = {
      flightKey: this.EFBLform.get('flight_key').value,
      flightOriginDate: this.EFBLform.get('flight_Date').value
    }
    this.navigateTo(this.router, 'export/notoc/revisednotoc', reqObj);
  }


  public routeToAli() {
    let navigateObj = {
      flightKey: this.EFBLform.get("flight_key").value,
      flightOriginDate: new Date(this.EFBLform.get("flight_Date").value)
    }
    this.navigateTo(this.router, '/export/buildup/airlineloadinginstructions', navigateObj);
  }



  printTallySheet() {
    this.reportParameters = new Object();
    this.reportParameters.flightKey = this.EFBLform.get("flight_key").value;
    this.reportParameters.flightDate = this.EFBLform.get("flight_Date").value;
    this.reportParameters.flightId = this.EFBLform.get('flightId').value;

    this.TallySheet.open();
  }


}

import { Component, ElementRef, NgZone, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Application
import { NgcFormArray, NgcFormControl, NgcFormGroup, NgcPage, PageConfiguration } from 'ngc-framework';
import { CustomACESService } from './../customs.service';
import { cmdModel } from './../customs.sharedmodel';
@Component({
  selector: 'app-cargomanifestdecleration',
  templateUrl: './cargomanifestdecleration.component.html',
  styleUrls: ['./cargomanifestdecleration.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class CargomanifestdeclerationComponent extends NgcPage {
  response: any;
  fltDate: any;
  fltKey: any;
  custFlightId: any;
  showTable: any;
  errors: any;
  totalHawbPieces: number;
  importExportIndicator: any;


  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private customACESService: CustomACESService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }

  ngOnInit() {
    super.ngOnInit();

    let forwardedData = this.getNavigateData(this.activatedRoute);

    // checking if the fetched data is not null
    if (forwardedData != null) {
      this.cargomanifestdeclerationform.get('shipmentNumber').setValue(forwardedData.shipmentNumber);
      this.cargomanifestdeclerationform.get('flightKey').patchValue(forwardedData.flightKey);
      this.cargomanifestdeclerationform.get('flightdate').patchValue(forwardedData.flightDate);
      this.cargomanifestdeclerationform.get('customsFlightId').patchValue(forwardedData.customsFlightId);
      this.cargomanifestdeclerationform.get('totalPiece').patchValue(forwardedData.totalPiece);
      this.cargomanifestdeclerationform.get('totalWeight').patchValue(forwardedData.totalWeight);
      this.importExportIndicator = forwardedData.exportOrImport
      this.onSearchCmd();
    }


  }


  private cargomanifestdeclerationform: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl(),
    flightdate: new NgcFormControl(),
    shipmentNumber: new NgcFormControl(),
    hawbNnumber: new NgcFormControl(null),
    cmdCount: new NgcFormControl(),
    place: new NgcFormControl(),
    postalCode: new NgcFormControl(),
    state: new NgcFormControl(),
    customsFlightId: new NgcFormControl(),
    totalHwbPieces: new NgcFormControl(),
    totalPiece: new NgcFormControl(),
    totalWeight: new NgcFormControl(),
    cmdlist: new NgcFormArray([
      new NgcFormGroup({
        cmdRecievedDate: new NgcFormControl(),
        shipmentPieces: new NgcFormControl(),
        shipmentWeight: new NgcFormControl(),
        shipmentNog: new NgcFormControl(),
        hwbNumber: new NgcFormControl(),
        hwbPieces: new NgcFormControl(),
        hwbWeight: new NgcFormControl(),
        hwbNog: new NgcFormControl(),
        exemptionReason: new NgcFormControl(),
        larType: new NgcFormControl(),
        agentIaNumber: new NgcFormControl(),
        customsFlightId: new NgcFormControl(),
        senderCompany: new NgcFormControl(),
      })
    ]),

  })
  onSearchCmd() {
    const req: cmdModel = new cmdModel();
    req.flightKey = this.cargomanifestdeclerationform.get('flightKey').value;
    req.flightdate = this.cargomanifestdeclerationform.get('flightdate').value;
    req.shipmentNumber = this.cargomanifestdeclerationform.get('shipmentNumber').value;
    this.fltKey = this.cargomanifestdeclerationform.get('flightKey').value;
    this.fltDate = this.cargomanifestdeclerationform.get('flightdate').value;
    req.customsFlightId = this.cargomanifestdeclerationform.get('customsFlightId').value;
    req.hawbNnumber = this.cargomanifestdeclerationform.get('hawbNnumber').value;
    console.log(req);
    this.customACESService.getCmdInfo(req).subscribe(data => {
      this.response = data.data;
      this.refreshFormMessages(data);
      if (this.response) {
        this.cargomanifestdeclerationform.patchValue(this.response);

        this.cargomanifestdeclerationform.get('customsFlightId').patchValue(this.response.customsFlightId);
        this.showTable = true;
        this.showSuccessStatus('g.completed.successfully');
        this.caluclatetotalHWBPieces();
      } else {
        let movedata = { cmd: 'NO' };
        this.navigateTo(this.router, '/customs/customsmanifestreconsilation', movedata);
        this.errors = this.response.messageList;
        this.showErrorStatus(this.response);
      }
    }, error => this.showErrorStatus('g.error'));

  }

  public onCancel(event) {
    let navigateData = {
      flightKey: null,
      flightDate: null,
      exportOrImport: null
    }
    navigateData.flightKey = this.cargomanifestdeclerationform.get('flightKey').value;
    navigateData.flightDate = this.cargomanifestdeclerationform.get('flightdate').value;
    navigateData.exportOrImport = this.importExportIndicator;
    this.navigateBack(navigateData);
  }

  caluclatetotalHWBPieces() {
    (<NgcFormArray>this.cargomanifestdeclerationform.get('cmdlist')).controls.forEach(data => {
      let pieces = data.get('hwbPieces').value as number

      this.cargomanifestdeclerationform.get('totalHwbPieces').setValue(this.cargomanifestdeclerationform.get('totalHwbPieces').value + pieces);

    })
  }

}

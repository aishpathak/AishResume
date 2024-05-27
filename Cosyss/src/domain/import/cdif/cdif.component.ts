import { ApplicationFeatures } from '../../common/applicationfeatures';
import { ApplicationEntities } from '../../common/applicationentities';
import { ValidatorFn } from "@angular/forms";
//import { dimensionData./../.sharedmodel, OciData./../.sharedmodel, ShcData } from './../import.sharedmodel';
import { NgcFormControl, NgcUtility, NgcReportComponent, ReactiveModel } from "ngc-framework";
import { ImportService } from "../import.service";
import {
  Component,
  OnInit,
  NgZone,
  ElementRef,
  ViewContainerRef,
  ViewChild
} from "@angular/core";
import {
  NgcPage,
  NgcFormGroup,
  NgcFormArray,
  NgcWindowComponent,
  PageConfiguration
} from "ngc-framework";

import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: "app-arrivalcargocollection",
  templateUrl: "./cdif.component.html",
  styleUrls: ["./cdif.component.scss"]
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
  restorePageOnBack: false,
  dontRestoreOnBrowserBack: false
})
export class CDIFComponent extends NgcPage {
  @ViewChild('reportWindow') reportWindow: NgcReportComponent;
  @ViewChild('createUdateCDIF') createUdateCDIF: NgcWindowComponent;
  @ViewChild('cancleCDIF') cancleCDIF: NgcWindowComponent;
  @ViewChild('sendCDIF') sendCDIF: NgcWindowComponent;



  sectorId: any;
  terminalRequired: boolean = true;
  shipmentTerminalAwareLocation: boolean;
  postSRF: boolean = false;

  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private importService: ImportService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    this.shipmentTerminalAwareLocation = NgcUtility.hasFeatureAccess(ApplicationFeatures.Gen_Shipment_TerminalAware_Location);
    if (this.shipmentTerminalAwareLocation) {
      this.terminalRequired = false;
    } else {
      this.terminalRequired = true;
    }
  }

  private search: NgcFormGroup = new NgcFormGroup({
    srfNo: new NgcFormControl(),
    cdifNo: new NgcFormControl()
  });

  private form: NgcFormGroup = new NgcFormGroup({
    details: new NgcFormArray([]),
    srfObject: new NgcFormGroup({
      srfNo: new NgcFormControl(),
      cdifNo: new NgcFormControl(),
      awb: new NgcFormControl(),
      flightNoDate: new NgcFormControl(),
      ata: new NgcFormControl(),
      remarks: new NgcFormControl(),
      pcsWt: new NgcFormControl(),
      cdifPrinter: new NgcFormControl(),
      utlPrinter: new NgcFormControl(),
      cdifPcs: new NgcFormControl(),
      cdifWt: new NgcFormControl(),
      reason: new NgcFormControl(),
      cancelReason: new NgcFormControl(),
      srfStatus: new NgcFormControl(),


      house: new NgcFormArray([
        new NgcFormGroup({
          hawb: new NgcFormControl(),
          cdifPcs: new NgcFormControl(),
          cdifWt: new NgcFormControl(),
          cdifReason: new NgcFormControl(),
        })
      ]),
      storage: new NgcFormArray([
        new NgcFormGroup({
          location: new NgcFormControl(),
          warehouseLoc: new NgcFormControl(),
          warehouseDes: new NgcFormControl(),
          locPieces: new NgcFormControl(),
          locWeight: new NgcFormControl(),
          cdifPcs: new NgcFormControl(),
          cdifWt: new NgcFormControl(),
          cdifLoc: new NgcFormControl(),
          IrrgwarehouseLoc: new NgcFormControl(),
          IrrgwarehouseDes: new NgcFormControl()
        })
      ]),
      mailIds: new NgcFormControl()
    })


  });



  public onSearch(): void {
    let request = this.search.value;
    if (request.srfNo == undefined || request.srfNo == "" || request.srfNo == null) {

      this.showErrorMessage("srf.required");
      return;
    }

    this.importService.getArivalCargoCollection(request).subscribe(
      data => {
        //console.log(data);
        if (!this.showResponseErrorMessages(data)) {
          if (data.data.length == 0) {
            this.showErrorMessage("no.record.found");
          } else {
            if (data.data[0].postSrf) {
              this.showErrorMessage("post.srf.done");
              this.postSRF = true;
            } else {
              if (data.data[0].srfStatus != 'COMPLETED') {
                this.showErrorStatus("srf.status.not.COMPLETED");
                this.postSRF = true;
              } else {
                this.postSRF = false;
              }
            }


            this.form.get("details").patchValue(data.data);

          }
          this.form.get("details").patchValue(data.data);
        }
      },
      error => {
        this.showErrorStatus(error);
      }
    );
  }
  public saveUpdate(): void {
    let request = this.form.get("srfObject").value;
    let storageforPro: any[] = [];
    let totalCdifPcs = 0;
    let totalCdifWt = 0.0;
    let totalHawbCdifPcs = 0;
    let totalHawbCdifWt = 0.0;
    let pcsWt = this.form.get("srfObject.pcsWt").value.split("/");
    if (!this.form.get("srfObject").valid || request.reason == null && request.reason == undefined) {
      this.showErrorMessage("admin.fill.mandatory.fields");
      return;
    }

    if (request.cancelReason == null && request.cancelReason == undefined ||
      this.form.get("srfObject.cdifPcs").dirty ||
      this.form.get("srfObject.cdifWt").dirty
    ) {

      if (request.cdifPcs > Number(pcsWt[0]) || request.cdifWt > Number(pcsWt[1])) {
        this.showErrorMessage("cdif.Wt.pcs.error");
        return;
      }
      request.storage.forEach(Obj => {
        if (!(Obj.cdifLoc == null || Obj.cdifLoc == undefined)
          && !(Obj.irrgwarehouseLoc == null || Obj.irrgwarehouseLoc == undefined)
          && !(Obj.irrgwarehouseDes == null || Obj.irrgwarehouseDes == undefined)) {
          this.showErrorMessage("select.location");
          return;
        }

        if (!(Obj.cdifPcs == 0 || Obj.cdifPcs == undefined)) {
          storageforPro.push(Obj);
        }
        if (request.cdifNo == null || request.cdifNo == undefined) {
          totalCdifPcs += Obj.cdifPcs;
          totalCdifWt += Obj.cdifWt;
        } else {
          totalCdifPcs += Obj.locPieces;
          totalCdifWt += Obj.locWeight;
        }
      });
      request.house.forEach(Obj => {
        if (!(Obj.cdifPcs == 0 || Obj.cdifPcs == undefined)) {
          totalHawbCdifPcs += Obj.cdifPcs;
          totalHawbCdifWt += Obj.cdifWt;
        }

      });
      if (totalCdifPcs != request.cdifPcs) {
        this.showErrorMessage("cdif.loc.pcs.error");
        return;
      }
      if (totalCdifWt != request.cdifWt) {
        this.showErrorMessage("cdif.loc.wt.error");
        return;
      }
      if (totalHawbCdifPcs > request.cdifPcs) {
        this.showErrorMessage("cdif.hawb.pcs.error");
        return;
      }
      if (totalHawbCdifWt > request.cdifWt) {
        this.showErrorMessage("cdif.hawb.wt.error");
        return;
      }
    }
    request.storage = storageforPro;
    this.importService.saveUpdateArivalCargoCollection(request).subscribe(
      data => {
        //console.log(data);
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus('g.completed.successfully');
          this.onSearch();
          this.closePopUP();
        } else {
        }
      },
      error => {
        this.showErrorStatus(error);
      }
    );
  }
  OpenCancleCDIF(index) {
    this.form.get("srfObject").patchValue(this.form.get(['details', index]).value)
    this.cancleCDIF.open();
  }
  opencreateUdateCDIF(index) {
    if (this.form.get("details").value.length == 0) {
      this.showErrorMessage("Please search the record First");
      return;
    }
    if (index == -1) {
      let obj: any = this.form.get(['details', 0]).value;
      let create_storage: any[] = [];
      obj.storage.forEach(x => {
        if (x.shipmentDeliveryIrrigularityId == null && x.deliveryRequestOrderNo != null) {
          create_storage.push(x);
        }
      })
      this.form.get("srfObject").patchValue(obj);
      this.form.get("srfObject.storage").patchValue(create_storage);
      this.form.get("srfObject.house").patchValue([]);
      this.addHouse();
      this.form.get("srfObject.remarks").reset();
      this.form.get("srfObject.cdifPrinter").reset();
      this.form.get("srfObject.utlPrinter").setValue(null);
      this.form.get("srfObject.cdifNo").setValue(null);
      this.form.get("srfObject.cdifPcs").reset();
      this.form.get("srfObject.cdifWt").reset();
      this.form.get("srfObject.reason").reset();
    } else {

      let obj: any = this.form.get(['details', index]).value;
      this.form.get("srfObject").patchValue(obj)
      let cdif_storage: any[] = [];
      obj.storage.forEach(x => {
        if (x.shipmentDeliveryIrrigularityId == obj.shipmentDeliveryIrrigularityId) {
          cdif_storage.push(x);
        }
      })
      this.form.get("srfObject.storage").patchValue(cdif_storage);

    }
    this.createUdateCDIF.open();

  }

  addHouse() {
    let obj = {
      hawb: "",
      cdifPcs: 0,
      cdifWt: 0.0,
      cdifReason: ""
    }
    let houses: any[] = this.form.get("srfObject.house").value;
    houses.push(obj);
    this.form.get("srfObject.house").patchValue(houses);
  }
  deleteHouse(index) {
    let houses: any[] = this.form.get("srfObject.house").value;
    houses.splice(index, 1);
    this.form.get("srfObject.house").patchValue(houses);
  }
  closePopUP() {
    this.form.get("srfObject").reset();
    this.cancleCDIF.close();
    this.createUdateCDIF.close();
    this.sendCDIF.close();
  }
  onLocationChange(data, index) {
    this.sectorId = data.parameter2;
  }
  CalculatePiecesWT(event, index) {
    let request = this.form.get("srfObject").value;
    let totalCdifPcs = 0;
    let totalCdifWt = 0.0;
    let pcsWt = this.form.get("srfObject.pcsWt").value.split("/");


    if (request.cdifPcs > Number(pcsWt[0]) || request.cdifWt > Number(pcsWt[1])) {
      this.showErrorMessage("cdif.Wt.pcs.error");
      return;
    }
    request.storage.forEach(Obj => {
      if (request.cdifNo == null || request.cdifNo == undefined) {
        totalCdifPcs += Obj.cdifPcs;
        totalCdifWt += Obj.cdifWt;
      }
    });
    if (totalCdifPcs > Number(pcsWt[0]) || totalCdifWt > Number(pcsWt[1])) {
      this.showErrorMessage("cdif.Wt.pcs.error");
      return;
    } else {
      this.form.get("srfObject.cdifPcs").patchValue(totalCdifPcs);
      this.form.get("srfObject.cdifWt").patchValue(totalCdifWt);
    }
  }
  sendMail() {
    let request = this.form.get("srfObject").value;
    if (request.mailIds.length == 0) {
      this.showErrorMessage("invalid.mail");
      return;
    }
    this.importService.sendMailForArivalCargoCollection(request).subscribe(
      data => {
        //console.log(data);
        if (!this.showResponseErrorMessages(data)) {
          this.showSuccessStatus('g.completed.successfully');
          this.closePopUP();
        } else {
        }
      },
      error => {
        this.showErrorStatus(error);
      }
    );
  }
  onSendNotification() {
    this.sendCDIF.open();
  }
}

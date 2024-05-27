import {
  Component, OnInit, ViewEncapsulation, ViewChild,
  ViewChildren, QueryList, NgZone, ElementRef, ViewContainerRef,
  Input, OnChanges, ChangeDetectorRef

} from '@angular/core';
import {
  NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcPage,
  NgcButtonComponent, PageConfiguration, NgcFormControl,
  NgcLOVComponent,
  CellsRendererStyle
} from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportService } from './../export/export.service';
import { SearchSingleBookingShipment } from './../export/export.sharedmodel';
@Component({
  selector: 'app-update-booking',
  templateUrl: './update-booking.component.html',
  styleUrls: ['./update-booking.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  //autoBackNavigation: true
})
export class UpdateBookingComponent extends NgcPage implements OnChanges {

  @Input('updateBookingObject') updateBookingObject;
  response: any;
  confrimButtonFlag: boolean = false;
  createPartButtonFlag: boolean = true;

  private form = new NgcFormGroup({
    shipmentNumber: new NgcFormControl(),
    shipmentDate: new NgcFormControl(),
    origin: new NgcFormControl(),
    destination: new NgcFormControl(),
    pieces: new NgcFormControl(0),
    grossWeight: new NgcFormControl(0.0),
    natureOfGoodsDescription: new NgcFormControl(''),
    flagInsert: new NgcFormControl('Y'),
    flagUpdate: new NgcFormControl('N'),
    remainingPcs: new NgcFormControl(),
    remainingWt: new NgcFormControl(),
    note: new NgcFormControl(),
    partBookingList: new NgcFormArray([]),
    partUpdateList: new NgcFormArray([])
  });

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private exportService: ExportService, private activatedRoute: ActivatedRoute, private router: Router
    , private cd: ChangeDetectorRef) {
    super(appZone, appElement, appContainerElement, );
  }

  ngOnInit() {
    if (this.updateBookingObject) {
      const request = new SearchSingleBookingShipment();
      request.shipmentNumber = this.updateBookingObject.shipmentNumber;
      request.shipmentDate = this.updateBookingObject.shipmentDate;
      this.search(request);
    }

  }
  enableOrDisableCreatePartButton() {
    let obj = this.form.getRawValue();
    if (obj && obj.partUpdateList && obj.partUpdateList.length > 1) {
      this.createPartButtonFlag = true;
      return;
    }
    if ((this.form.get('remainingWt').value && this.form.get('remainingWt').value > 0)
      && (this.form.get('remainingPcs').value && this.form.get('remainingPcs').value > 0)) {
      this.createPartButtonFlag = false;
    } else {
      this.createPartButtonFlag = true;
    }
  }
  ngOnChanges(changes) {
    console.log("chnages", changes);
    console.log("update bookingObject", this.updateBookingObject);
    if (this.updateBookingObject) {
      const request = new SearchSingleBookingShipment();
      request.shipmentNumber = this.updateBookingObject.shipmentNumber;
      request.shipmentDate = this.updateBookingObject.shipmentDate;
      this.search(request);
    }
  }
  search(request: SearchSingleBookingShipment) {
    this.exportService.searchUpdateBooking(request).subscribe(response => {
      console.log("response", response);
      this.response = response.data;
      if (!this.showResponseErrorMessages(response)) {
        //set MAN and DEP status
        if (this.response.partBookingList && this.response.partBookingList.length > 0) {
          this.response.partBookingList.forEach(t => {
            if (t.isFlightManifested) {
              t.status = "MAN";
            }
            if (t.isFLightDeparted) {
              t.status = "DEP";
            }
          })
        }
        this.form.patchValue(this.response);
        this.cd.detectChanges();
        console.log("raw value", this.form.getRawValue());
        this.form.get('note').setValue(null);
        (<NgcFormArray>this.form.get('partUpdateList')).resetValue([]);
        this.updatePartPiecesChange();
        this.updatePartWeightChange();
        this.enableOrDisableCreatePartButton();
        if ((this.form.get('remainingPcs').value && this.form.get('remainingPcs').value > 0)
          && (this.form.get('remainingWt').value && this.form.get('remainingWt').value > 0)) {
          this.confrimButtonFlag = true;
        } else {
          this.confrimButtonFlag = false;
        }

      } else {
        this.showResponseErrorMessages(response);
      }
    });
  }
  updateBooking() {
    let object = this.form.getRawValue();
    if (object.partBookingList) {
      let filteredPartList = object.partBookingList.filter(t => t.select);
      if (filteredPartList && filteredPartList.length > 0) {
        let arr = [];
        for (let obj of filteredPartList) {
          let temp = {
            partSuffix: obj.partSuffix,
            partPieces: obj.partPieces,
            partWeight: obj.partWeight,
            diffPcs: null,
            diffWt: null,
            volume: 0.01,
            volumeUnitCode: 'MC'
          };
          arr.push(temp);
        }
        this.form.get('partUpdateList').patchValue(arr);
        this.form.get('note').setValue(null);
        this.cd.detectChanges();
        this.calculateRemainingPcsWt();
        this.updatePartPiecesChange();
        this.updatePartWeightChange();
        this.enableOrDisableCreatePartButton();
      } else {
        this.showErrorMessage("export.select.atleast.one.part.update");
      }
    }

  }
  save() {
    let obj = this.form.getRawValue();
    if (obj.partUpdateList && obj.partUpdateList.length > 0) {
      // set below flag to indicate update operation in service
      obj.updateBookingConfirmSaveFlag = true;
      this.exportService.UpdateBookingPcsWt(obj).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus("g.operation.successful");
          this.search(this.updateBookingObject);
          (<NgcFormArray>this.form.get('partUpdateList')).resetValue([]);
        } else {
          this.showResponseErrorMessages(response);
        }
      });
    } else {
      this.showErrorMessage("export.select.atleast.one.part.update");
      return;
    }
  }
  createNewPart() {
    let obj = this.form.getRawValue();
    if (obj.partUpdateList && obj.partUpdateList.length > 0) {

      this.exportService.UpdateBookingPcsWt(obj).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus("g.operation.successful");
          this.search(this.updateBookingObject);
          (<NgcFormArray>this.form.get('partUpdateList')).resetValue([]);
        } else {
          this.showResponseErrorMessages(response);
        }
      });
    } else {
      this.showErrorMessage("export.select.atleast.one.part.update");
      return;
    }
  }

  updatePartPiecesChange() {
    let arrayValue = this.form.getRawValue().partUpdateList;
    if (arrayValue && arrayValue.length > 0) {
      for (let i = 0; i < arrayValue.length; i++) {
        this.form.get(['partUpdateList', i, 'partPieces']).valueChanges.subscribe(a => {
          console.log("aq", a);
          let obj = this.form.getRawValue();
          let totalPieces = 0;
          let actalPartPieces = 0;
          if (obj.partBookingList && obj.partBookingList.length > 0) {
            for (let temp of obj.partBookingList) {
              if (!temp.select) {
                totalPieces = totalPieces + temp.partPieces;
              }
              if (temp.partSuffix == arrayValue[i].partSuffix) {
                actalPartPieces = temp.partPieces;
              }

            }
          }
          if (obj.partUpdateList && obj.partUpdateList.length > 0) {
            for (let temp of obj.partUpdateList) {
              totalPieces = totalPieces + temp.partPieces;
            }
          }
          if (totalPieces != obj.pieces) {
            (<NgcFormGroup>this.form.get(['partUpdateList', i])).get('diffPcs').setValue(actalPartPieces - a);

          }
          this.calculateRemainingPcsWt();
        });
      }
    }

  }
  updatePartWeightChange() {
    let arrayValue = this.form.getRawValue().partUpdateList;
    if (arrayValue && arrayValue.length > 0) {
      for (let i = 0; i < arrayValue.length; i++) {
        this.form.get(['partUpdateList', i, 'partWeight']).valueChanges.subscribe(a => {
          console.log("aq", a);
          let obj = this.form.getRawValue();
          let totalWeight = 0;
          let actalPartWeight = 0;
          if (obj.partBookingList && obj.partBookingList.length > 0) {
            for (let temp of obj.partBookingList) {
              if (!temp.select) {
                totalWeight = totalWeight + temp.partWeight;
              }
              if (temp.partSuffix == arrayValue[i].partSuffix) {
                actalPartWeight = temp.partWeight;
              }

            }
          }
          if (obj.partUpdateList && obj.partUpdateList.length > 0) {
            for (let temp of obj.partUpdateList) {
              totalWeight = totalWeight + temp.partWeight;
            }
          }
          if (totalWeight != obj.grossWeight) {
            (<NgcFormGroup>this.form.get(['partUpdateList', i])).get('diffWt').setValue(actalPartWeight - a);
          }
          this.calculateRemainingPcsWt();
        });
      }
    }

  }
  calculateRemainingPcsWt() {
    this.confrimButtonFlag = false;
    this.form.get('note').setValue(null);
    let obj = this.form.getRawValue();

    let totalWeight = 0;
    let totalPieces = 0;
    let actalPartWeight = 0;
    if (obj.partBookingList && obj.partBookingList.length > 0) {
      for (let temp of obj.partBookingList) {
        if (!temp.select) {
          totalWeight = totalWeight + temp.partWeight;
          totalPieces = totalPieces + temp.partPieces;
        }


      }
    }
    if (obj.partUpdateList && obj.partUpdateList.length > 0) {
      for (let temp of obj.partUpdateList) {
        totalWeight = totalWeight + temp.partWeight;
        totalPieces = totalPieces + temp.partPieces;
      }
    }
    this.form.get('remainingPcs').setValue(obj.pieces - totalPieces);
    this.form.get('remainingWt').setValue(obj.grossWeight - totalWeight);
    if (this.form.get('remainingPcs').value == 0) {
      let arrayValue = this.form.getRawValue().partUpdateList;
      if (arrayValue && arrayValue.length > 0) {
        for (let i = 0; i < arrayValue.length; i++) {
          (<NgcFormGroup>this.form.get(['partUpdateList', i])).get('diffPcs').setValue(null);
        }
      }
      this.confrimButtonFlag = false;
    } else {
      // if remaining pcs wt. >0 disable confim save
      if (obj.partBookingList && obj.partBookingList.length > 0) {
        if (this.form.get('remainingPcs').value == 0 && this.form.get('remainingWt').value == 0) {
          this.confrimButtonFlag = false;
        }
        // otherwise note to adjust rem pcs/wt.
        else {
          this.confrimButtonFlag = true;
        }
      }

    }
    if (this.form.get('remainingWt').value == 0) {
      let arrayValue = this.form.getRawValue().partUpdateList;
      if (arrayValue && arrayValue.length > 0) {
        for (let i = 0; i < arrayValue.length; i++) {
          (<NgcFormGroup>this.form.get(['partUpdateList', i])).get('diffWt').setValue(null);
        }
      }
    }
    else {
      //check if only one part exits which is not departed and that part is in partUpdate list
      if (obj.partBookingList && obj.partBookingList.length > 0) {
        if (obj.partBookingList && obj.partBookingList.length > 0) {
          if (this.form.get('remainingPcs').value == 0 && this.form.get('remainingWt').value == 0) {
            this.confrimButtonFlag = false;
          }
          // otherwise note to adjust rem pcs/wt.
          else {
            this.confrimButtonFlag = true;
          }
        }
      }

    }
    this.enableOrDisableCreatePartButton();
  }

  deleteData(index) {
    let suffix = this.form.get(['partUpdateList', index]).get('partSuffix').value;
    if (suffix) {
      let prtList = this.form.getRawValue().partBookingList;
      if (prtList && prtList.length > 0) {
        let index = 0;
        for (let i of prtList) {
          if (suffix == i.partSuffix) {
            this.form.get(['partBookingList', index]).get('select').setValue(false);
            break;
          }
          index++;
        }
      }

    }
    (<NgcFormArray>this.form.get('partUpdateList')).deleteValueAt(index);
    this.updatePartWeightChange();
    this.updatePartPiecesChange();
    this.calculateRemainingPcsWt();

  }
}

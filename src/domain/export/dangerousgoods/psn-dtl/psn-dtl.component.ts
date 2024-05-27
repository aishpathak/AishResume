import { Component, OnInit, ViewChild, Input, ViewContainerRef, NgZone, ElementRef, Output, EventEmitter } from '@angular/core';
import { SearchDgregulations, SearchRegulation } from '../../export.sharedmodel';
import {
  NgcWindowComponent, NgcFormGroup, NgcFormControl,
  NgcFormArray, NgcPage, NgcContainer
} from 'ngc-framework';
import { DangerousgoodsService } from '../dangerousgoods.service';

@Component({
  selector: 'psn-dtl',
  templateUrl: './psn-dtl.component.html',
  styleUrls: ['./psn-dtl.component.scss']
})
export class PsnDtlComponent extends NgcPage {

  @Input() searchRequest: SearchRegulation;
  @Output() focusOnUnid = new EventEmitter<boolean>();
  @ViewChild('dtlWindow') dtlWindow: NgcWindowComponent;
  public focusOnUnidForPsn: NgcFormControl;

  constructor(private dgRegulationsService: DangerousgoodsService, appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, ) {
    super(appZone, appElement, appContainerElement);
  }
  /**
  * PopForm
  */
  private notocPopUpForm: NgcFormGroup = new NgcFormGroup(
    {

      unid: new NgcFormControl(),
      psn: new NgcFormControl(),
      classCode: new NgcFormControl(),
      shc: new NgcFormControl(),
      erg: new NgcFormControl(),
      sbr1: new NgcFormControl(),
      imp1: new NgcFormControl(),
      sbr2: new NgcFormControl(),
      imp2: new NgcFormControl(),
      dgDetails: new NgcFormArray([
        new NgcFormGroup({
          pg: new NgcFormControl(),
          fbd: new NgcFormControl(),
          mlqPInfo: new NgcFormControl(),
          mlqQuantity: new NgcFormControl(),
          mlqUnit: new NgcFormControl(),
          mpcQuantity: new NgcFormControl(),
          mpcUnit: new NgcFormControl(),
          mcoQuantity: new NgcFormControl(),
          mcoPInfo: new NgcFormControl(),
          remarks: new NgcFormControl(),
          mpcPInfo: new NgcFormControl(),
          mcoUnit: new NgcFormControl()
        }),
      ])
    });

  /**
   *  Function that fetches the
   *  details of Dg Regulation Master-Setup of that UN-ID and PSN
   */
  showDgDeatils() {
    this.dtlWindow.open();
    let responseofDg: any;
    this.dgRegulationsService.getDgRegulationsDetails(this.searchRequest).subscribe(
      response => {
        if (response.data != null) {
          (this.notocPopUpForm.patchValue(response.data[0]));
        }
        else {
          this.showErrorStatus('export.enter.valid.unid.psn');
        }
      },
      error => {
        this.showErrorStatus('Error:' + error);
      });

  }

  closePopUp() {
    this.dtlWindow.close();
    this.focusOnUnid.emit(true)
    this.focusOnUnidForPsn.focus();
  }
  ngOnInit() {
  }

}

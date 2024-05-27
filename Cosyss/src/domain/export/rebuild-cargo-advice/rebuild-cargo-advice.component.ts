import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core'
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormArray, NgcUtility, NgcFormControl } from 'ngc-framework';
import { Validators } from '@angular/forms';
import { ExportService } from '../export.service';
import { RebuildCargoAdviceSearch } from '../export.sharedmodel';

@Component({
  selector: 'app-rebuild-cargo-advice',
  templateUrl: './rebuild-cargo-advice.component.html',
  styleUrls: ['./rebuild-cargo-advice.component.scss']
})
@PageConfiguration({ trackInit: true, callNgOnInitOnClear: true })
export class RebuildCargoAdviceComponent extends NgcPage {

  rebuildCargoAdviceSearch = new RebuildCargoAdviceSearch();
  searchRebuildButtonClicked = false;
  serviceContractorTonnageInfoId: any;
  serviceContractorULDTonnageInfoId: any;
  resp: any;
  flightId: any;

  private RebuildCargoAdviceForm: NgcFormGroup = new NgcFormGroup({
    flightKey: new NgcFormControl('', Validators.required),
    flightDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    rebuildRemark: new NgcFormControl(),
    weight: new NgcFormControl(),
    uld_bt: new NgcFormControl(),
    serviceContractorTonnageInfoId: new NgcFormControl(),
    serviceContractorULDTonnageInfoId: new NgcFormControl(),
    searchRebuildCargoResultForList: new NgcFormArray([
    ]),
    flightId: new NgcFormControl(),
    retrieveCargoAdvice: new NgcFormArray([
      new NgcFormGroup({
        rebuildRemark: new NgcFormControl(),
        weight: new NgcFormControl(),
        uld_bt: new NgcFormControl(),
        serviceContractorTonnageInfoId: new NgcFormControl(),
        serviceContractorULDTonnageInfoId: new NgcFormControl(),
        flightId: new NgcFormControl(),
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
      })
    ]),
  });

  /**
 * 
 * @param appZone 
 * @param appElement 
 * @param appContainerElement 
 */

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private exportService: ExportService) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * This method will be called on click Search Button and 
   * open data of Rebuild cargo related to Flight Number 
   */
  searchRebuildCargo() {
    this.searchRebuildButtonClicked = false;
    this.setSearchRebuildCargoRequest();
    this.fetchAndPopulateDataListRebuild();
  }

  setSearchRebuildCargoRequest() {
    this.rebuildCargoAdviceSearch.flightKey = this.RebuildCargoAdviceForm.controls.flightKey.value;
    this.rebuildCargoAdviceSearch.flightDate = this.RebuildCargoAdviceForm.controls.flightDate.value;
  }

  fetchAndPopulateDataListRebuild() {
    if (this.rebuildCargoAdviceSearch.flightKey == null || this.rebuildCargoAdviceSearch.flightKey == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.RebuildCargoAdviceForm.get('flightKey'), "Mandatory");
    }

    this.exportService.getRebuildCargoAdvice(this.rebuildCargoAdviceSearch).subscribe((response) => {
      if (!this.showResponseErrorMessages(response)) {
        this.refreshFormMessages(response);
        this.searchRebuildButtonClicked = true;
        this.serviceContractorTonnageInfoId = response.data.serviceContractorTonnageInfoId;
        this.flightId = response.data.flightId;
        this.RebuildCargoAdviceForm.get('retrieveCargoAdvice').patchValue(response.data.retrieveCargoAdvice);

        //if there is no data for a flight than blank row comes on screen
        if (response.data.retrieveCargoAdvice.length == 0) {
          (<NgcFormArray>this.RebuildCargoAdviceForm.get('retrieveCargoAdvice')).addValue([
            {
              uld_bt: "",
              weight: 0.0,
              rebuildRemark: "",
              serviceContractorTonnageInfoId: this.serviceContractorTonnageInfoId,
              serviceContractorULDTonnageInfoId: "",
              flightId: this.flightId,
              flightKey: this.RebuildCargoAdviceForm.get('flightKey').value,
              flightDate: this.RebuildCargoAdviceForm.get('flightDate').value
            }]
          )
        }
      }
      else {
        this.searchRebuildButtonClicked = false;
      }
    });
  }

  /**
   * This method will be called on click Add Button and 
   * open a blank row to insert rebuild cargo data
   */
  onAdd() {
    this.searchRebuildButtonClicked = true;
    (<NgcFormArray>this.RebuildCargoAdviceForm.get('retrieveCargoAdvice')).addValue([
      {
        uld_bt: "",
        weight: 0.0,
        rebuildRemark: "",
        serviceContractorTonnageInfoId: this.serviceContractorTonnageInfoId,
        serviceContractorULDTonnageInfoId: "",
        flightId: this.flightId,
        flightKey: this.RebuildCargoAdviceForm.get('flightKey').value,
        flightDate: this.RebuildCargoAdviceForm.get('flightDate').value
      }]
    )
  }

  /**
   * This method will be called on click Save Button,
   * to save rebuild cargo data associated with ULD/LSP
   */
  onSave() {
    this.rebuildCargoAdviceSearch.flightKey = this.RebuildCargoAdviceForm.controls.flightKey.value;
    this.rebuildCargoAdviceSearch.flightDate = this.RebuildCargoAdviceForm.controls.flightDate.value;
    this.rebuildCargoAdviceSearch.retrieveCargoAdvice = this.RebuildCargoAdviceForm.get('retrieveCargoAdvice').value;
    let rebuildForm = this.RebuildCargoAdviceForm.get('retrieveCargoAdvice').value;

    for (let i = 0; i < rebuildForm.length; i++) {
      if (rebuildForm[i].uld_bt == null || rebuildForm[i].uld_bt == '') {
        return this.showFormControlErrorMessage(<NgcFormControl>this.RebuildCargoAdviceForm.get(['retrieveCargoAdvice', i, 'uld_bt']), "Mandatory");
      }

      else if (rebuildForm[i].weight == 0.0 || rebuildForm[i].weight == null) {
        return this.showFormControlErrorMessage(<NgcFormControl>this.RebuildCargoAdviceForm.get(['retrieveCargoAdvice', i, 'weight']), "error.weight.greater.zero");
      }
    }

    this.exportService.setRebuildCargoAdvice(this.rebuildCargoAdviceSearch).subscribe((response) => {
      console.log(this.RebuildCargoAdviceForm.value);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.searchRebuildCargo();
      }
    },
      error => {
        this.showErrorStatus(error);
      });
  }

  /**
   * This method will be called on click delete icon in front of particular row,
   * to delete rebuild cargo data associated with ULD/LSP
   */
  onDelete(index) {
    this.showConfirmMessage('error.want.delete.record').then(fulfilled => {
      let req = this.RebuildCargoAdviceForm.get(['retrieveCargoAdvice', index]).value;
      console.log(req);
      this.exportService.deleteRebuildCargoAdvice(req).subscribe((response) => {
        if (!this.showResponseErrorMessages(response)) {
          this.showSuccessStatus('g.completed.successfully');
          this.searchRebuildCargo();
        }
      })
    }).catch(reason => {
    });
  }

  /**
   * Method to clear the screen
   */
  onClear() {
    this.searchRebuildButtonClicked = false;
    this.RebuildCargoAdviceForm.reset();
    this.RebuildCargoAdviceForm.get('flightDate').setValue(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy'));
    (this.RebuildCargoAdviceForm.get("flightKey") as NgcFormControl).focus();
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
    this.navigateBack(this.RebuildCargoAdviceForm.getRawValue());
  }

}

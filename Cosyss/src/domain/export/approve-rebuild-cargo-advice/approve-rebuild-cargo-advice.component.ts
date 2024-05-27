import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core'
import { ExportService } from '../export.service';
import { PageConfiguration, NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl, NgcUtility } from 'ngc-framework';
import { ApproveRebuildCargoAdviceSearch } from '../export.sharedmodel';

@Component({
  selector: 'app-approve-rebuild-cargo-advice',
  templateUrl: './approve-rebuild-cargo-advice.component.html',
  styleUrls: ['./approve-rebuild-cargo-advice.component.scss']
})
@PageConfiguration({ trackInit: true, callNgOnInitOnClear: true })
export class ApproveRebuildCargoAdviceComponent extends NgcPage {

  approveRebuildCargoAdviceSearch = new ApproveRebuildCargoAdviceSearch;

  private ApproveRebuildCargoAdviceForm: NgcFormGroup = new NgcFormGroup({
    carr: new NgcFormControl(),
    fromDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    toDate: new NgcFormControl(NgcUtility.getDateTimeByFormat(NgcUtility.getDateTimeAsStringByFormat(new Date(), 'ddMMMyy'), 'ddMMMyy')),
    flightKey: new NgcFormControl(),
    flightDate: new NgcFormControl(),
    uld_bt: new NgcFormControl(),
    weight: new NgcFormControl(),
    approved: new NgcFormControl(),
    rejected: new NgcFormControl(),
    approvedBy: new NgcFormControl(),
    rejectedBy: new NgcFormControl(),
    approvedOn: new NgcFormControl(),
    rejectedOn: new NgcFormControl(),
    rebuildRemark: new NgcFormControl(),
    flightId: new NgcFormControl(),
    serviceContractorTonnageInfoId: new NgcFormControl(),
    serviceContractorULDTonnageInfoId: new NgcFormControl(),
    approvedRejected: new NgcFormControl(),
    approvedRejectedBy: new NgcFormControl(),
    approvedRejectedOn: new NgcFormControl(),
    carrierCode: new NgcFormControl(),

    retrieveApproveCargoAdvice: new NgcFormArray([
      new NgcFormGroup({
        flightKey: new NgcFormControl(),
        flightDate: new NgcFormControl(),
        uld_bt: new NgcFormControl(),
        weight: new NgcFormControl(),
        approved: new NgcFormControl(),
        rejected: new NgcFormControl(),
        approvedBy: new NgcFormControl(),
        rejectedBy: new NgcFormControl(),
        approvedOn: new NgcFormControl(),
        rejectedOn: new NgcFormControl(),
        rebuildRemark: new NgcFormControl(),
        flightId: new NgcFormControl(),
        serviceContractorTonnageInfoId: new NgcFormControl(),
        serviceContractorULDTonnageInfoId: new NgcFormControl(),
        approvedRejected: new NgcFormControl(),
        approvedRejectedBy: new NgcFormControl(),
        approvedRejectedOn: new NgcFormControl(),
      })
    ]),
  });
  serviceContractorTonnageInfoId: any;
  searchButtonClicked: boolean;
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
   * retrieve data related to Rebuild Cargo Advice assigned to a ULD/LSP for a flight
   */
  onSearch() {
    this.searchButtonClicked = false;
    this.approveRebuildCargoAdviceSearch.carr = this.ApproveRebuildCargoAdviceForm.controls.carr.value;
    this.approveRebuildCargoAdviceSearch.fromDate = this.ApproveRebuildCargoAdviceForm.controls.fromDate.value;
    this.approveRebuildCargoAdviceSearch.toDate = this.ApproveRebuildCargoAdviceForm.controls.toDate.value;
    this.approveRebuildCargoAdviceSearch.retrieveApproveCargoAdvice = this.ApproveRebuildCargoAdviceForm.get('retrieveApproveCargoAdvice').value;

    if (this.approveRebuildCargoAdviceSearch.fromDate == null || this.approveRebuildCargoAdviceSearch.fromDate == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.ApproveRebuildCargoAdviceForm.get('fromDate'), "Mandatory");
    }

    if (this.approveRebuildCargoAdviceSearch.toDate == null || this.approveRebuildCargoAdviceSearch.toDate == '') {
      return this.showFormControlErrorMessage(<NgcFormControl>this.ApproveRebuildCargoAdviceForm.get('toDate'), "Mandatory");
    }

    this.exportService.getApproveRebuildCargoAdvice(this.approveRebuildCargoAdviceSearch).subscribe((response) => {
      if (!this.showResponseErrorMessages(response)) {
        this.refreshFormMessages(response);
        this.searchButtonClicked = true;
        this.serviceContractorTonnageInfoId = response.data.serviceContractorTonnageInfoId;
        this.ApproveRebuildCargoAdviceForm.get('retrieveApproveCargoAdvice').patchValue(response.data.retrieveApproveCargoAdvice);
        console.log(this.ApproveRebuildCargoAdviceForm.value);
      }
    });
  }

  /**
   * This method will be called on click Save Button,
   * to update approve/reject related to Rebuild Cargo Advice assigned to a ULD/LSP for a flight
   */
  onSave() {
    if (!this.ApproveRebuildCargoAdviceForm.valid) {
      return this.showErrorMessage("Error.11");
    }

    this.approveRebuildCargoAdviceSearch.carr = this.ApproveRebuildCargoAdviceForm.controls.carr.value;
    this.approveRebuildCargoAdviceSearch.fromDate = this.ApproveRebuildCargoAdviceForm.controls.fromDate.value;
    this.approveRebuildCargoAdviceSearch.toDate = this.ApproveRebuildCargoAdviceForm.controls.toDate.value;
    this.approveRebuildCargoAdviceSearch.retrieveApproveCargoAdvice = this.ApproveRebuildCargoAdviceForm.get('retrieveApproveCargoAdvice').value;

    this.exportService.setApproveRebuildCargoAdvice(this.approveRebuildCargoAdviceSearch).subscribe((response) => {
      this.ApproveRebuildCargoAdviceForm.get('retrieveApproveCargoAdvice').patchValue(response.data.retrieveApproveCargoAdvice);
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
        this.onSearch();
      }
    });
  }

  /**
   * Method to clear the screen
   */
  onClear() {
    this.searchButtonClicked = false;
    this.ApproveRebuildCargoAdviceForm.reset();
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
    this.navigateBack(this.ApproveRebuildCargoAdviceForm.getRawValue());
  }
}

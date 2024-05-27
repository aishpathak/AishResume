import { ActivatedRoute, Router } from '@angular/router';
import { ExportService } from './../../export.service';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray, PageConfiguration } from 'ngc-framework';
import { Component, OnInit, NgZone, ElementRef, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-awb-stock-summary',
  templateUrl: './awb-stock-summary.component.html',
  styleUrls: ['./awb-stock-summary.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
  //autoBackNavigation: true
})
export class AwbStockSummaryComponent extends NgcPage {
  form = new NgcFormGroup({
    carrierCode: new NgcFormControl(),
    stockCategoryCode: new NgcFormControl(),
    stockId: new NgcFormControl()
  });

  tableForm = new NgcFormGroup({
    stockStatusList: new NgcFormArray([])
  });

  displayTable = false;

  response;
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private service: ExportService, private router: Router, private activatedRoute: ActivatedRoute) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
    super.ngOnInit();
    const forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData) {
      this.form.get('carrierCode').setValue(forwardedData.carrierCode);
      this.form.get('stockCategoryCode').setValue(forwardedData.stockCategoryCode);
      this.onSearch();
    }
  }

  onSearch() {
    const request = this.form.getRawValue();
    request.stockId = Number(request.stockId);
    this.service.fetchAWBStockSummary(this.form.getRawValue()).subscribe((resp) => {
      this.response = resp;
      if (!this.response.data) {
        this.refreshFormMessages(this.form);
        return;
      }
      if (this.response.data.length) {
        this.tableForm.get('stockStatusList').patchValue(this.response.data);
        this.displayTable = true;

      } else if (!this.response.data.length) {
        this.displayTable = false;
        this.showInfoStatus('export.no.record.found.for.search');
      }
    });
  }

  onLinkClick(event) {
    this.service.dataToNawbStockManagement = event.record;
    this.router.navigate(['export', 'awbstockmanagement']);
  }

  getCurrentIndex() {
    const tableValues = this.tableForm.getRawValue().stockStatusList;
    let selectedIndex = -1;
    let i = 0;
    for (const eachRow of tableValues) {
      if (eachRow.selectULD) {
        if (selectedIndex === -1) {
          selectedIndex = i;
        } else {
          return -2;
        }
        // return i;
      }
      ++i;
    }
    if (selectedIndex !== -1) {
      return selectedIndex;
    }
    return -1;
  }

  onStockManagement() {
    const selectedIndex = this.getCurrentIndex();
    if (selectedIndex === -1) {
      this.showErrorStatus('export.select.a.record');
      return;
    }
    if (selectedIndex === -2) {
      this.showInfoStatus('export.select.only.one.record');
      return;
    }
    // dataToNawbStockStatus
    this.service.dataToNawbStockStatus = this.tableForm.getRawValue().stockStatusList[selectedIndex];
    this.router.navigate(['export', 'awbstockstatus']);
  }

  onDelete() {
    let selectedItem = new Array();
    let checkbox = false;
    const request = this.tableForm.getRawValue();
    request.stockStatusList.forEach(stock => {
      if (stock.selectULD) {
        checkbox = true;
        selectedItem.push(stock);
      }
    });
    request.stockStatusList = selectedItem;
    if (checkbox) {
      this.showConfirmMessage(
        "export.delete.checked.ticked.records.confirmation")
        .then(fulfilled => {
          this.service.markDelete(request).subscribe((resp) => {
            if (!this.showResponseErrorMessages(resp)) {
              this.onSearch();
              this.showSuccessStatus('g.completed.successfully');
            }
          });
        }).catch(reason => { });
    } else {
      this.showErrorStatus("export.select.records.before.delete");
    }


  }
  onBack(event) {
    this.navigateHome();
  }
}

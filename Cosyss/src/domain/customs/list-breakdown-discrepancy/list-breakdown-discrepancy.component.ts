import { Component, ElementRef, NgZone, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomACESService } from '../customs.service';
import { brkdwnDiscModel } from '../customs.sharedmodel';
import { NgcPage, NgcFormGroup, NgcFormControl, NgcFormArray } from 'ngc-framework';

@Component({
  selector: 'app-list-breakdown-discrepancy',
  templateUrl: './list-breakdown-discrepancy.component.html',
  styleUrls: ['./list-breakdown-discrepancy.component.scss']
})
export class ListBreakdownDiscrepancyComponent extends NgcPage implements OnInit {

  forwardedData: any;
  searchFlag: boolean = false;
  fltListIndex: any;




  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef, private customACESService: CustomACESService,
    private activatedRoute: ActivatedRoute, private router: Router) {
    super(appZone, appElement, appContainerElement);

  }

  private brkdwnDiscrepancyListForm: NgcFormGroup = new NgcFormGroup({
    startDate: new NgcFormControl(new Date()),
    endDate: new NgcFormControl(new Date()),
    fltDtlList: new NgcFormArray([])

  })


  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    this.brkdwnDiscrepancyListForm.patchValue(this.forwardedData);
  }

  //is triggered on click of Search button in main screen, used to fetch flight lists
  onSearch() {
    this.brkdwnDiscrepancyListForm.validate();
    if (this.brkdwnDiscrepancyListForm.invalid) {
      return;
    }
    let rqstData = new brkdwnDiscModel();
    rqstData.startDate = this.brkdwnDiscrepancyListForm.get('startDate').value;
    rqstData.endDate = this.brkdwnDiscrepancyListForm.get('endDate').value;

    this.customACESService.getBrkdwnDiscFltDtls(rqstData).subscribe(res => {
      this.refreshFormMessages(res);
      if (res.data) {
        this.searchFlag = true;
        console.log(res.data);
        this.brkdwnDiscrepancyListForm.get('fltDtlList').patchValue(res.data.flightList);
      }
      else {
        this.searchFlag = false;
      }
    },
      error => {
        this.showErrorStatus(error);
      });


  }

  //used to add serial number in a list
  cellsRendererSno(row: number, column: string, value: any, rowData: any) {
    return (row + 1) + "";
  }

  //is triggered on click of action icon in flight list, used to open Submit Breakdown Discrepancy screen
  public openSubmitBrkdwnDiscScreen(group): void {
    console.log(<NgcFormControl>this.brkdwnDiscrepancyListForm.get(["fltDtlList", group]).value);
    var dataToSend = {

      flightKey: <NgcFormControl>this.brkdwnDiscrepancyListForm.get(["fltDtlList", group, "flightNo"]).value,
      fltArrivalDate: <NgcFormControl>this.brkdwnDiscrepancyListForm.get(["fltDtlList", group, "flightDate"]).value

    }
    this.navigateTo(this.router, "/submitbreakdowndiscrepancy", dataToSend);

  }

}

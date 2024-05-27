import { NgcWindowComponent } from 'ngc-framework';
import { UldService } from './../uld.service';
import { SearchULDLSPform } from './../uld.shared';
import { NgcFormGroup, NgcFormControl, NgcButtonComponent, NgcPage, PageConfiguration } from 'ngc-framework';
import { Component, OnInit, ViewChild, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-uldlsp',
  templateUrl: './uldlsp.component.html',
  styleUrls: ['./uldlsp.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true,
})

export class ULDLSPComponent extends NgcPage implements OnInit {
  @ViewChild('uldEnquireWindow') uldEnquireWindow: NgcWindowComponent;
  showWindow: boolean = false;
  uldEnquireObject: any = {};
  /* successful response Flag */
  onSuccess: boolean = false;

  @ViewChild('searchButton') searchButton: NgcButtonComponent;
  private searchUldLspForm: NgcFormGroup = new NgcFormGroup
    ({
      movableLocationType: new NgcFormControl(),
      uldTrolleyNumber: new NgcFormControl()
    });

  private responseUldLspForm: NgcFormGroup = new NgcFormGroup
    ({
      uldTrolleyNumber: new NgcFormControl(),
      wareHouseLocation: new NgcFormControl(),
      location: new NgcFormControl(),
      status: new NgcFormControl(),
    });
  uldNumber: any;
  forwardedData: any;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private router: Router,
    private activatedRoute: ActivatedRoute,
    private uldService: UldService) {
    super(appZone, appElement, appContainerElement);
  }



  ngOnInit() {
    this.forwardedData = this.getNavigateData(this.activatedRoute);
    if (this.forwardedData) {
      this.searchUldLspForm.get('movableLocationType').patchValue('ULD');
      this.searchUldLspForm.get('uldTrolleyNumber').patchValue(this.forwardedData.uldNumber);
      this.onSearch();
    }
  }

  /* On search : called when search is clicked */
  onSearch() {
    this.resetFormMessages();
    let request: SearchULDLSPform = this.searchUldLspForm.getRawValue();
    // Check form valid or not and return
    this.searchUldLspForm.validate();
    if (!this.searchUldLspForm.valid) {
      return;
    }
    this.onSuccess = false;
    // this.uldService.getULDLSPDetails(request).subscribe(response => {
    //   this.resetFormMessages();
    //   this.responseUldLspForm.reset();
    //   if (response.data != null) {
    //     this.onSuccess = true;
    //     this.responseUldLspForm.patchValue(response.data);
    //   }
    //   else {
    //     this.showErrorMessage('uld.lsp.not.found');
    //   }
    // }, (error: string) => {
    //   this.showErrorMessage('error');
    // }
    // );
  }

  locationType() {
    this.responseUldLspForm.reset();
    this.onSuccess = false;
    this.searchUldLspForm.get('uldTrolleyNumber').patchValue(null);
  }
  uldEnquireResposne = event => {
    this.showWindow = false;
    this.uldEnquireObject = {};
  }

  onRetrieve() {
    let request: SearchULDLSPform = this.searchUldLspForm.getRawValue();
    this.uldService.updateULDLSPRetrieveDate(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
      }
      else {
        this.showErrorMessage("retrieve date not updated");
      }
    }, (error: string) => {
      this.showErrorMessage('error');
    }
    );
  }
  onClickUld() {
    this.showWindow = true;
    this.uldEnquireObject.parameter = 'ULD Number';
    this.uldEnquireObject.parameter1 = this.responseUldLspForm.get(['uldTrolleyNumber']).value;
    this.uldEnquireWindow.open();
  }
}


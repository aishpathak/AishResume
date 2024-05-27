import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { p } from '@angular/core/src/render3';
import { NgcPage, NgcFormGroup, NgcFormArray, NgcWindowComponent, NgcUtility, DateTimeKey, NgcCodeEditorComponent, BaseBO } from 'ngc-framework';
import { NgcFormControl, PageConfiguration } from 'ngc-framework';
import { InterfaceService } from '../interface.service';

@Component({
  selector: 'app-shipmentfsusetup',
  templateUrl: './shipmentfsusetup.component.html',
  styleUrls: ['./shipmentfsusetup.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true
})
export class ShipmentfsusetupComponent extends NgcPage implements OnInit {
  @ViewChild('errorMessagePopUp') errorMessagePopUp: NgcWindowComponent;
  @ViewChild('errorMessagePopUpNull') errorMessagePopUpNull: NgcWindowComponent;

  showDataFlag: Boolean = false;
  maxDate: Date;
  messageList = [];
  rcfFlag = false;
  nfdFlag = false;
  dlvFlag = false;
  fohFlag = false;
  rcsFlag = false;
  depFlag = false;
  tenant: string;
  resp: any;
  recipientCount: number;
  recipientTypeCount: number;

  constructor(appZone: NgZone, appElement: ElementRef,
    appContainerElement: ViewContainerRef, private interfaceService: InterfaceService) {
    super(appZone, appElement, appContainerElement);
  }


  private FSUApiTenantInfo: NgcFormGroup = new NgcFormGroup({
    tenant: new NgcFormControl(),
    rcf: new NgcFormControl(),
    nfd: new NgcFormControl(),
    dlv: new NgcFormControl(),
    foh: new NgcFormControl(),
    rcs: new NgcFormControl(),
    dep: new NgcFormControl(),
    recipientTypeList: new NgcFormArray([]),
    recipientList: new NgcFormArray([]),
  })

  ngOnInit() {
    super.ngOnInit();
    const today = new Date();
    this.maxDate = today;
    this.getFSUDetails();
  }

  // ngAfterViewInit() {
  //   this.getFSUDetails();
  // }

  private getFSUDetails() {
    this.tenant = NgcUtility.getTenantConfiguration().countryCode;
    this.recipientCount = 0;
    this.recipientTypeCount = 0;
    // this.interfaceService.getFSUAgainstTenant(this.tenant).subscribe((resp) => {
    //   if (resp.data) {
    //     this.convertData(resp.data);
    //     resp.data.recipientTypeList.forEach(element => {
    //       this.convertDataList(element);
    //       this.recipientTypeCount = this.recipientTypeCount + 1;
    //     });
    //     resp.data.recipientList.forEach(password => {
    //       password.password = '**************';
    //       this.recipientCount = this.recipientCount + 1;
    //     });
    //     this.FSUApiTenantInfo.patchValue(resp.data);
    //     //get('rcf').value == 1 -> setValue('Y')
    //   }
    // });
  }

  private convertData(data) {
    if (data.rcf == 1) {
      data.rcf = 'Y';
    } else {
      data.rcf = 'N';
      this.rcfFlag = true;
    }
    if (data.nfd == 1) {
      data.nfd = 'Y';
    } else {
      data.nfd = 'N';
      this.nfdFlag = true;
    }
    if (data.dlv == 1) {
      data.dlv = 'Y';
    } else {
      data.dlv = 'N';
      this.dlvFlag = true;
    }
    if (data.foh == 1) {
      data.foh = 'Y';
    } else {
      data.foh = 'N';
      this.fohFlag = true;
    }
    if (data.rcs == 1) {
      data.rcs = 'Y';
    } else {
      data.rcs = 'N';
      this.rcsFlag = true;
    }
    if (data.dep == 1) {
      data.dep = 'Y';
    } else {
      data.dep = 'N';
      this.depFlag = true;
    }
  }
  private convertDataList(data) {
    if (data.rcf == 1) {
      data.rcf = 'Y';
    } else {
      data.rcf = 'N';
    }
    if (data.nfd == 1) {
      data.nfd = 'Y';
    } else {
      data.nfd = 'N';
    }
    if (data.dlv == 1) {
      data.dlv = 'Y';
    } else {
      data.dlv = 'N';
    }
    if (data.foh == 1) {
      data.foh = 'Y';
    } else {
      data.foh = 'N';
    }
    if (data.rcs == 1) {
      data.rcs = 'Y';
    } else {
      data.rcs = 'N';
    }
    if (data.dep == 1) {
      data.dep = 'Y';
    } else {
      data.dep = 'N';
    }
  }
  onChangeRcf(value) {
    if (value.desc == 'Y') {
      this.rcfFlag = false;
    } else {
      this.rcfFlag = true;
      (<NgcFormArray>this.FSUApiTenantInfo.get('recipientTypeList')).controls.forEach(ele => {
        ele.get('rcf').setValue('N');
      })
    }
  }
  onChangeNfd(value) {
    if (value.desc == 'Y') {
      this.nfdFlag = false;
    } else {
      this.nfdFlag = true;
      (<NgcFormArray>this.FSUApiTenantInfo.get('recipientTypeList')).controls.forEach(ele => {
        ele.get('nfd').setValue('N');
      })
    }

  }
  onChangeDlv(value) {
    if (value.desc == 'Y') {
      this.dlvFlag = false;
    } else {
      this.dlvFlag = true;
      (<NgcFormArray>this.FSUApiTenantInfo.get('recipientTypeList')).controls.forEach(ele => {
        ele.get('dlv').setValue('N');
      })
    }
  }
  onChangeFoh(value) {
    if (value.desc == 'Y') {
      this.fohFlag = false;
    } else {
      this.fohFlag = true;
      (<NgcFormArray>this.FSUApiTenantInfo.get('recipientTypeList')).controls.forEach(ele => {
        ele.get('foh').setValue('N');
      })
    }
  }
  onChangeRcs(value) {
    if (value.desc == 'Y') {
      this.rcsFlag = false;
    } else {
      this.rcsFlag = true;
      (<NgcFormArray>this.FSUApiTenantInfo.get('recipientTypeList')).controls.forEach(ele => {
        ele.get('rcs').setValue('N');
      })
    }
  }
  onChangeDep(value) {
    if (value.desc == 'Y') {
      this.depFlag = false;
    } else {
      this.depFlag = true;
      (<NgcFormArray>this.FSUApiTenantInfo.get('recipientTypeList')).controls.forEach(ele => {
        ele.get('dep').setValue('N');
      })
    }
  }

  clickAddRowTypeList() {
    (<NgcFormArray>this.FSUApiTenantInfo.controls['recipientTypeList']).addValue([
      {
        tenant: '',
        recipientType: '',
        description: '',
        rcf: 'N',
        nfd: 'N',
        dlv: 'N',
        foh: 'N',
        rcs: 'N',
        dep: 'N'
      }
    ]);
  }
  clickAddRowRecipient() {
    (<NgcFormArray>this.FSUApiTenantInfo.controls['recipientList']).addValue([
      {
        tenant: '',
        recipientName: '',
        description: '',
        recipientCode: '',
        recipientType: '',
        userId: '',
        password: ''
      }
    ]);
  }

  onSave(value) {

    //   this.interfaceService.saveFsuApiStatus(this.FSUApiTenantInfo.getRawValue()).subscribe(data => {
    //     this.resp = data;
    //     this.refreshFormMessages(data);
    //     if (this.resp.data) {
    //       this.convertData(this.resp.data);
    //       this.resp.data.recipientTypeList.forEach(element => {
    //         this.convertDataList(element);
    //       });
    //       this.FSUApiTenantInfo.patchValue(this.resp.data);
    //       this.showSuccessStatus('g.completed.successfully');
    //       this.refresh();
    //     } else {
    //       this.showErrorStatus(this.resp.messageList[0].message);
    //     }
    //   }, error => this.showErrorStatus('g.error'));
  }



}


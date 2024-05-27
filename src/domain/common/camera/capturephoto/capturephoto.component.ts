/**
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { Component, NgZone, ElementRef, ViewContainerRef, ViewChild, Input } from '@angular/core';
import { NgcFormGroup, NgcFormControl, NgcPage, NgcFormArray, NgcDropDownListComponent, NgcWindowComponent, PageConfiguration, NgcCapturePhotoModule, NgcCapturePhotoComponent, NgcUtility } from 'ngc-framework';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from './../../common.service';
import { MailingDetails, UploadedFiles, ShipmentInfoReqModel } from '../../common.sharedmodel';
import { ApplicationEntities } from './../../applicationentities';
import { Validators } from '@angular/forms';
import { ApplicationFeatures } from '../../applicationfeatures';

// Application
@Component({
  selector: 'capturephoto',
  templateUrl: './capturephoto.component.html',
  styleUrls: ['./capturephoto.component.scss']
})

@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})

export class CapturePhotoComponent extends NgcPage {
  @ViewChild(NgcCapturePhotoComponent)
  private uploadedPhoto: NgcCapturePhotoComponent;
  @Input('showAsPopup') showAsPopup: boolean;
  @Input('shipmentNumberData') shipmentNumberData: string;
  @Input('shipmentTypeData') shipmentTypeData: string;
  @Input('hwbNumberData') hwbNumberData: string;

  hawbInvalid: boolean = false;
  handledbyHouse: boolean = false;
  hawbSourceParameters: {};

  private capturePhotoForm: NgcFormGroup = new NgcFormGroup({
    entityType: new NgcFormControl(),
    entityKey: new NgcFormControl(),
    associatedTo: new NgcFormControl(),
    stage: new NgcFormControl(),
    emailTo: new NgcFormControl(),
    referenceId: new NgcFormControl(),
    remarks: new NgcFormControl(),
    imagePreview: new NgcFormControl(),
    entityType2: new NgcFormControl(),
    entityKey2: new NgcFormControl(),
    isHandleByHouse: new NgcFormControl()
  });

  /**
   * Initialize
   * 
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(
    appZone: NgZone,
    appElement: ElementRef,
    appContainerElement: ViewContainerRef,
    private router: Router,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {
    super(appZone, appElement, appContainerElement);
  }

  /**
   * On Initialization
   */
  public ngOnInit() {
    super.ngOnInit();
    this.capturePhotoForm.get('entityType').setValue(this.shipmentTypeData);
    this.capturePhotoForm.get('entityKey').setValue(this.shipmentNumberData);
    const forwardedData = this.getNavigateData(this.activatedRoute);
    if (forwardedData != null) {
      this.capturePhotoForm.get('entityType').setValue(forwardedData.entityType);
      this.capturePhotoForm.get('entityKey').setValue(forwardedData.entityKey);
      this.capturePhotoForm.get('associatedTo').setValue(forwardedData.associatedTo);
      this.capturePhotoForm.get('stage').setValue(forwardedData.stage);
    }
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      this.capturePhotoForm.validate();
      const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
      this.capturePhotoForm.get('entityKey2').setValue(this.hwbNumberData);
      console.log(forwardedData);
      if (forwardedData.entityType) {
        this.capturePhotoForm.get('entityKey2').setValue(forwardedData.entityKey2);
      }

      req.entityKey = this.capturePhotoForm.get('entityKey').value;
      req.entityType = this.capturePhotoForm.get('entityType').value;
      this.commonService.isHandledByHouse(req).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          if (response.data) {
            this.handledbyHouse = true;
            this.capturePhotoForm.get('entityType2').setValue("HAWB");
          }
          else {
            this.handledbyHouse = false;
          }
        }
      })
    }
  }

  /**
   * 
   */
  public onImageSelect(event) {
    if (event) {
      this.capturePhotoForm.get('imagePreview').setValue(event.document);
    }
  }


  selectData(event) {
    this.capturePhotoForm.reset();
    this.capturePhotoForm.get('entityType').setValue(event.shipmentType);
    this.capturePhotoForm.get('entityKey').setValue(event.shipmentNo);
    const forwardedData = this.getNavigateData(this.activatedRoute);
    if (NgcUtility.isEntityAttributeRequired(ApplicationEntities.Gen_House_Enable)) {
      if (forwardedData == null || forwardedData == '') {
        this.capturePhotoForm.get('entityKey2').reset();
      }
      this.capturePhotoForm.validate();
      const req: ShipmentInfoReqModel = new ShipmentInfoReqModel();
      req.entityKey = this.capturePhotoForm.get('entityKey').value;
      req.entityType = this.capturePhotoForm.get('entityType').value;
      this.commonService.isHandledByHouse(req).subscribe(response => {
        if (!this.showResponseErrorMessages(response)) {
          if (response.data) {
            this.handledbyHouse = true;
            this.capturePhotoForm.get('entityType2').setValue("HAWB");
            this.capturePhotoForm.get('entityKey2').patchValue("");
            this.capturePhotoForm.get('entityKey2').clearValidators();
            if (NgcUtility.hasFeatureAccess(ApplicationFeatures.Imp_Bd_HAWBHandling)) {
              this.hawbSourceParameters = this.createSourceParameter(this.capturePhotoForm.get('entityKey').value);

              this.retrieveDropDownListRecords("AWB_HOUSE_OR_MASTER", "query", this.hawbSourceParameters).subscribe(data => {
                if (data != null && data.length > 0) {
                  this.handledbyHouse = true;
                  this.capturePhotoForm.get('entityKey2').setValidators([Validators.required, Validators.maxLength(16)]);
                  this.retrieveLOVRecords("HWBNUMBER", this.hawbSourceParameters).subscribe(data => {
                    if (data != null && data.length == 1) {
                      this.capturePhotoForm.get('entityKey2').setValue(data[0].code);
                    }
                  })
                }
              },
              );
            }
          }
          else {
            this.handledbyHouse = false;
          }
          this.capturePhotoForm.validate();
        }
      })
    }
  }

  public onSendEmail() {
    let request = this.capturePhotoForm.getRawValue();
    this.commonService.sendEmail(request).subscribe(response => {
      if (!this.showResponseErrorMessages(response)) {
        this.showSuccessStatus('g.completed.successfully');
      }
    }, error => {
      this.showErrorStatus(error);
    });

  }

  sendEmailWithUploadedDoc() {
    let request = this.setMailingContent()
    this.commonService.sendEmailWithUploadedDoc(request).subscribe((res) => {
      console.log(res);
    })
  }

  setMailingContent() {
    let mailingDetails: MailingDetails = new MailingDetails();
    mailingDetails.to = this.capturePhotoForm.get('emailTo').value
    mailingDetails.shipmentNumber = this.capturePhotoForm.get('entityKey').value
    mailingDetails.entityType = this.capturePhotoForm.get('entityType').value;
    mailingDetails.entityKey = this.capturePhotoForm.get('entityKey').value;
    mailingDetails.associatedTo = this.capturePhotoForm.get('associatedTo').value;
    mailingDetails.stage = this.capturePhotoForm.get('stage').value;
    mailingDetails.entityKey2 = this.capturePhotoForm.get('entityKey2').value;
    mailingDetails.entityType2 = this.capturePhotoForm.get('entityType2').value;
    let uploadePhotoList: Array<any> = this.uploadedPhoto.getAllItems();
    console.log(uploadePhotoList);
    uploadePhotoList.forEach((uploadPhoto) => {
      let doc: UploadedFiles = new UploadedFiles();
      doc.fileId = uploadPhoto.uploadDocId;
      doc.fileName = uploadPhoto.documentName;
      doc.fileType = uploadPhoto.documentType;
      doc.remarks = uploadPhoto.remarks;
      mailingDetails.uploadedFiles.push(doc);
    })
    return mailingDetails;
  }

  setAWBNumber(object) {
    if (object.code == null) {
      this.hawbInvalid = true;
      this.showErrorStatus('hawb.invalid');
    }
    else {
      this.hawbInvalid = false;
      this.resetFormMessages();
      this.capturePhotoForm.get('isHandleByHouse').setValue(object.code);
      this.async(() => {
        this.uploadedPhoto.fetch();
      });
    }
    this.capturePhotoForm.validate();
  }

  searchPhoto(object) {
    this.capturePhotoForm.get('associatedTo').patchValue(object.code);
    this.uploadedPhoto.associatedTo = this.capturePhotoForm.get('associatedTo').value;
    this.async(() => {
      this.uploadedPhoto.fetch();
    });
    this.capturePhotoForm.validate();
  }

  fetchPhoto(object) {
    this.capturePhotoForm.get('stage').patchValue(object.code);
    this.uploadedPhoto.stage = this.capturePhotoForm.get('stage').value;
    this.async(() => {
      this.uploadedPhoto.fetch();
    });
    this.capturePhotoForm.validate();
  }
}


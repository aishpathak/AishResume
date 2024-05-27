import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcInputComponent,
  NgcUtility, NgcWindowComponent, NgcContainerComponent, PageConfiguration
} from 'ngc-framework';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormControl, AbstractControl, Validator, Validators } from '@angular/forms';
import { NgcFormControl } from 'ngc-framework/core/model/formcontrol.model';
import { StatusMessage } from 'ngc-framework';
//import { SearchTermsAndCondition } from '';
//import { MaintainTermsServiceService } from '../maintaintermservice.service';
import { MastersService } from '../masters.service';
////import { MaintainSystemParameterUpdateResponse, MaintainSystemParameterUpdateRequest } from '../masters.sharedmodel';
import { SearchTermsAndCondition } from '../masters.sharedmodel';
@Component({
  selector: 'app-maintainterms',
  templateUrl: './maintainterms.component.html',
  styleUrls: ['./maintainterms.component.scss']
})
@PageConfiguration({
  trackInit: true,
  callNgOnInitOnClear: true,
  autoBackNavigation: true
})
export class MaintainTermsComponent extends NgcPage {
  maintainFlag = false;
    resp: any;
    response:any;
    drpdown:boolean=false;
    tasklistDetail: any;
    isData: boolean = false;
    disbaleFlag: boolean = false;
    disbaleMaintain:boolean =false;
    disbaleSearch:boolean =false;
    selected:boolean =false;
    isMaintain: boolean = false;
    requestSaveData:any;

    private maintainTCform: NgcFormGroup = new NgcFormGroup({
    requestfor: new NgcFormControl(),
    termsConditionDetails: new NgcFormControl(),
    termandcondition: new NgcFormControl(),
    check: new NgcFormControl(),
    queryfor: new NgcFormControl(),
    functionCode: new NgcFormControl(),
    showTermCondition: new NgcFormControl()

});

  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router,
    private maintainService: MastersService) {
    super(appZone, appElement, appContainerElement);
  }

  ngOnInit() {
      this.maintainTCform.get('requestfor').valueChanges.subscribe(newValue => {
    if (newValue) {
      this.isMaintain=false;
      this.isData=false;
      this.maintainFlag=false;
    }/* if (newValue === null) {
        this.showErrorStatus("Select Mandatory Field");
      this.isMaintain=false;
      this.isData=false;
      this.maintainFlag=false;
    }*/
 });
  } 
  private onSearch(){
    const dropdownData = this.maintainTCform.get('requestfor').value;
    if (!dropdownData) {
        this.showErrorStatus("master.select.mandatory.field");
        this.isData=false;
        this.isMaintain=false;
        return;
    }



     const search ={
     functionCode: this.maintainTCform.get('requestfor').value
     }; 
     this. maintainService.searchList(search).subscribe(data =>{
      this.resetFormMessages();
      this.tasklistDetail = data.data;
      this.refreshFormMessages(data);
      if(this.tasklistDetail){
          this.maintainFlag = false;
          this.isData = true;
          this.isMaintain = false;
          this.disbaleFlag = true;
          this.maintainTCform.patchValue(this.tasklistDetail);
      } else {
            this.showInfoStatus("no.record.found");
            this.maintainFlag = true;
            this.isData=false;
            this.isMaintain=false;
            this.maintainTCform.get('termsConditionDetails').setValue('');
      }
     
      })
  }

  search(){
       let resp:any = new SearchTermsAndCondition();;
    const search ={
       functionCode: this.maintainTCform.get('queryfor').value
     };

    this. maintainService.searchList(search).subscribe(data =>{
         resp = data.data;
         console.log(resp);
        this.maintainTCform.get('termsConditionDetails').patchValue(resp.termsConditionDetails);
        this.maintainTCform.get('showTermCondition').patchValue(resp.showTermCondition);
        
  })
  }

  onEdit(){
         this.disbaleFlag = false;
          }

  onMaintain(){

    if(this.isMaintain=true ){
      
      if(!this.tasklistDetail ){
        this.maintainTCform.get('functionCode')
        .patchValue(this.maintainTCform.get('requestfor').value);   
      }
       
}
  }

 onSave(){
      this.requestSaveData = this.maintainTCform.getRawValue();
      //  request.functionCode = this.maintainTCform.get('functionCode').value;
      //  request.showTermCondition = this.maintainTCform.get('showTermCondition').value;
      //  request.termsConditionDetails = this.maintainTCform.get('termsConditionDetails').value;
     if(!this.tasklistDetail){
       this.requestSaveData.flagCRUD = 'C';
        this.maintainService.maintainList(this.requestSaveData).subscribe(data =>{
            this.resp=data.data;
            this.resetFormMessages();
            if(this.requestSaveData.termsConditionDetails !== ''){
                   this.showSuccessStatus('g.record.saved');
                 }
                 else{
                    this.refreshFormMessages(data);
                 }     
      })
     }
     else{
       this.requestSaveData.termConditionId=this.tasklistDetail.termConditionId;
       console.log('here',this.requestSaveData.termConditionId)
       this.maintainService.updateList(this.requestSaveData).subscribe(data =>{
            this.resp=data.data;
                 this.refreshFormMessages(data);
                 if(this.requestSaveData.termsConditionDetails !== ''){
                   this.showSuccessStatus('g.record.saved');
                 }             
      })
 }      
 }
    }
   
 

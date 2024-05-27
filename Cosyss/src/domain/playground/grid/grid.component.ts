/**
 * @copyright SATS Singapore 2017-18
 */
// Angular
import { Component, NgZone, ElementRef, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Application
import {
  NgcPage, NgcFormGroup, NgcFormArray, NgcFormControl,
  NotificationMessage, StatusMessage, MessageType, PageConfiguration
} from 'ngc-framework';

/**
 * Grid Page
 */
@Component({
  templateUrl: './grid.html'
})
@PageConfiguration({})
export class GridPage extends NgcPage {

  /**
   * Initialize
   *
   * @param appZone Ng Zone
   * @param appElement Element Ref
   * @param appContainerElement View Container Ref
   */
  constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef,
    private activatedRoute: ActivatedRoute, private router: Router) {
    //
    super(appZone, appElement, appContainerElement);
  }

  public onDummy(event) {

  }
}

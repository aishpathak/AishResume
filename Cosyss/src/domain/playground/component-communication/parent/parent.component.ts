import { Component, OnInit, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';
import { NgcPage, NgcFormControl, NgcFormGroup } from 'ngc-framework';

@Component({
    selector: 'app-parent',
    templateUrl: './parent.component.html',
    styleUrls: ['./parent.component.scss']
})
export class ParentComponent extends NgcPage {
    terminalSelected = false;
    // leafSectors: number[] = [];
    // parentArray = [];
    // parentString = '';
    // form = new NgcFormGroup({
    //     favouritePet: new NgcFormControl('cat'),
    //     favouriteWildAnimal: new NgcFormControl('lion')
    // })
    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef) {
        super(appZone, appElement, appContainerElement);
    }
    ngOnInit() {
        // this.parentArray.push('Cat');
        // this.parentArray.push('Dog');
        // this.parentArray.push('Lion');
        // this.parentArray.push('Tiger');
        // this.parentString = 'Cat' + ' ' + 'Dog';
    }

    onSelect(event) {
        console.log(event);
    }

    onClick() {
        // console.log(this.parentArray);
        // console.log(this.parentString);
        // console.log(this.form.getRawValue());
    }

    onSelection() {
        this.terminalSelected = false;
        setTimeout(function () {
            this.terminalSelected = true;
        }, 0);
    }

    // getAllLeafSectors() {
    //     let allChildSectors = JSON.parse(sessionStorage.getItem('allChildSectors'));
    //     for (let childSector of allChildSectors || []) {
    //         if (childSector.locationList.length) {
    //             this.leafSectors.push(childSector.whsSectorId);
    //         }
    //     }
    //     let sectors = JSON.parse(sessionStorage.getItem('sectors'));
    //     for (let property in sectors) {
    //         if (sectors.hasOwnProperty(property)) {
    //             if (sectors[property].locationList.length) {
    //                 this.leafSectors.push(Number(property));
    //             }
    //         }
    //     }
    //     console.log(this.leafSectors);
    //     this.terminalSelected = true;
    // }
}

import { NgcPage } from 'ngc-framework';
import { Component, OnInit, Input, NgZone, ElementRef, ViewContainerRef, ViewChild } from '@angular/core';

@Component({
    selector: 'ngc-child',
    templateUrl: './child.component.html',
    styleUrls: ['./child.component.scss']
})
export class ChildComponent extends NgcPage {
    @Input()
    parentArray = [];
    @Input()
    parentString = '';
    @Input()
    form;
    constructor(appZone: NgZone, appElement: ElementRef, appContainerElement: ViewContainerRef) {
        super(appZone, appElement, appContainerElement);
    }
    ngOnInit() {
        console.log(this.parentArray);
        console.log(this.parentString);
        this.parentArray.pop();
        this.parentString += '' + 'leopard';
        this.form.get('favouritePet').setValue('dog');
        this.form.get('favouriteWildAnimal').setValue('tiger');
    }



}

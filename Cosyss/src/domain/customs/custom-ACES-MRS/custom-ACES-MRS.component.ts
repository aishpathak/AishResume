import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-ACES-MRS',
  templateUrl: './custom-ACES-MRS.component.html',
  styleUrls: ['./custom-ACES-MRS.component.scss']
})
export class CustomACESMRSComponent implements OnInit {

  resultList;
  constructor() { }

  ngOnInit() {
    console.log('CustomACESMRSComponent Initialized ================================');
    this.resultList = [
      {
        'scInd': 1,
        'awbNo': 1,
        'firstOffPt': 'test'
      },
      {
        'scInd': 2,
        'awbNo': 2,
        'firstOffPt': 'test2'
      },
      {
        'scInd': 3,
        'awbNo': 3,
        'firstOffPt': 'test3'
      },
      {
        'scInd': 4,
        'awbNo': 4,
        'firstOffPt': 'test4'
      }


    ]

  }



}
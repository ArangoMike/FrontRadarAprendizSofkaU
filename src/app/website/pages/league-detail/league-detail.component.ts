import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-league-detail',
  templateUrl: './league-detail.component.html',
  styleUrls: ['./league-detail.component.scss']
})
export class LeagueDetailComponent {
  displayedColumns: string[] = ['knowledgeArea',
  'descriptor',
   'appropiationLevel',
   'appropiationLevelExpected'];

   displayedColumns1: string[] = ['emailApprentice',
  'average',
  ];


   ELEMENT_DATA: any[] = [
    {knowledgeArea: 'aasdas1', descriptor: 'Hydrogen', appropiationLevel: 1.0079, appropiationLevelExpected: 'H'},
    {knowledgeArea: 'asdas', descriptor: 'jhhjjhu', appropiationLevel: 1.0079, appropiationLevelExpected: 'H'},

  ];
  ELEMENT_DATA1: any[] = [
    { emailApprentice: 'emailada@gam.com', average: 4.2},
    { emailApprentice: 'mi12313@gam.com', average: 4.4},
    { emailApprentice: 'liaiaqweeb@gam.com', average: 3.5},

  ];

  dataSource = new MatTableDataSource<any[]>(this.ELEMENT_DATA);
  dataSource1 = new MatTableDataSource<any[]>(this.ELEMENT_DATA1);


  view: [number, number] = [1024, 600];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() {
    // Object.assign(this, { multi });
  }

  onSelect(event: any) {
    console.log(event);
  }


multi = [
    {
      "name": "Germany",
      "series": [
        {
          "name": "1990",
          "value": 62000000
        },
        {
          "name": "2010",
          "value": 73000000
        },
        {
          "name": "2011",
          "value": 89400000
        }
      ]
    },

    {
      "name": "USA",
      "series": [
        {
          "name": "1990",
          "value": 250000000
        },
        {
          "name": "2010",
          "value": 309000000
        },
        {
          "name": "2011",
          "value": 311000000
        }
      ]
    },

    {
      "name": "France",
      "series": [
        {
          "name": "1990",
          "value": 58000000
        },
        {
          "name": "2010",
          "value": 50000020
        },
        {
          "name": "2011",
          "value": 58000000
        }
      ]
    },
    {
      "name": "UK",
      "series": [
        {
          "name": "1990",
          "value": 57000000
        },
        {
          "name": "2010",
          "value": 62000000
        },
        {
          "name": "2011",
          "value": 72000000
        }
      ]
    }
  ];

}

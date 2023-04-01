import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { LeagueService } from 'src/app/services/league.service';
import { RadarService } from 'src/app/services/radar.service';
import { League } from 'src/shared/models/league';
import { Radar } from '../../../../shared/models/radar';
import { KnowledgeArea } from '../../../../shared/models/knowledgeArea';


@Component({
  selector: 'app-league-detail',
  templateUrl: './league-detail.component.html',
  styleUrls: ['./league-detail.component.scss']
})
export class LeagueDetailComponent {

  leagueName: string |null = null;
  league: League | null = null;
  apprentices  = [] ;
  knowledgeAreasList = [];
  radarName: string | undefined;
  radar !: Radar;
  polarDataList : PolarData[] = [];
  polarData : PolarData = {
    name: "",
    series: []
  };

  multi2 !: any[];

  serieList : Serie[] = [];
  serieData : Serie = {
    name: "",
    value: 0
  }

  displayedColumns: string[] = ['knowledgeArea',
  'descriptor',
   'appropiationLevel',
   'appropiationLevelExpected'];

   displayedColumns1: string[] = ['emailApprentice',
  'action',
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

  dataKnowledgeAreas = new MatTableDataSource<any[]>();
  dataApprendices = new MatTableDataSource<string[]>(this.apprentices);


  view: [number, number] = [1024, 350];

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

  constructor( private toast: ToastrService,
    private route:ActivatedRoute,
    private leagueService:LeagueService,
    private radarService: RadarService) {
    // Object.assign(this, { multi2 });
    this.getRadarAndApprenticesToLeague();
    this.getLeague();

    this.multi2 = [
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
      }
    ];
  }

  onSelect(event: any) {
    console.log(event);
  }

  getRadarAndApprenticesToLeague(){

    this.route.paramMap
    .pipe(
      switchMap((params) => {
        // console.log('params :>> ', params);
        this.leagueName = params.get('name');
        console.log('this.leagueName :>> ', this.leagueName);
        if (this.leagueName) {
          return this.radarService.getRadarByLeague(this.leagueName);
        }
        return [null];
      })
    )
    .subscribe((data) => {

      console.log('this.radar :>> ', data);
      this.knowledgeAreasList = data.knowledgeAreas;
      this.dataKnowledgeAreas.data = this.knowledgeAreasList;

      this.initPolarData(this.knowledgeAreasList, this.polarData);


    });

  }

  initPolarData(knowledgeAreaList: KnowledgeArea[], polarData: PolarData){
    console.log("ENTRAMOS");
    polarData.name = "Radar example";
    knowledgeAreaList.forEach(area => {
      const newSerieData = { name: area.descriptor, value: area.appropriationLevel };
      this.serieList.push(newSerieData);
      polarData.series = this.serieList;

    })

    this.polarDataList.push(polarData);
    console.log('this.polarDataList :>> ', this.polarDataList);

  }

  getLeague(){
    this.leagueService.getLeague(this.leagueName).subscribe((data) => {
      this.league = data;
      this.dataApprendices.data = data.usersEmails;
      console.log('this.league :>> ', this.league);
    })
  }





}

export interface PolarData  {
  name: string,
  series: Serie[]
}

export interface Serie {
  name: string,
  value: number
}

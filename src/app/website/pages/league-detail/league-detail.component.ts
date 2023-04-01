import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, switchMap } from 'rxjs';
import { LeagueService } from 'src/app/services/league.service';
import { RadarService } from 'src/app/services/radar.service';
import { League } from 'src/shared/models/league';
import { Radar } from '../../../../shared/models/radar';
import { KnowledgeArea } from '../../../../shared/models/knowledgeArea';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/shared/models/user';
import { dataTableLeague } from 'src/shared/models/dataTableLeague';



@Component({
  selector: 'app-league-detail',
  templateUrl: './league-detail.component.html',
  styleUrls: ['./league-detail.component.scss']
})
export class LeagueDetailComponent implements OnInit {

  leagueName: string | null = null;
  league: League | null = null;

 

  dataTable: dataTableLeague[] = [];
  averagesFinal: any[] = [];
  apprentices = [];
  knowledgeAreasList = [];
  radarName: string | undefined;
  radar !: Radar;
  polarDataList: PolarData[] = [];
  polarData: PolarData = {
    name: "",
    series: []
  };


  serieList: Serie[] = [];
  serieData: Serie = {
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


  dataKnowledgeAreas = new MatTableDataSource<dataTableLeague>();
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


  

  constructor(private toast: ToastrService,
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private radarService: RadarService,
    private userService: UserService) {
    // Object.assign(this, { multi2 });

    
  }
  ngOnInit(): void {
    this.getRadarAndApprenticesToLeague();
    this.getLeague();
    
  }

  onSelect(event: any) {
    console.log(event);
  }

  getRadarAndApprenticesToLeague() {

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          // console.log('params :>> ', params);
          this.leagueName = params.get('name');
          if (this.leagueName) {
            return this.radarService.getRadarByLeague(this.leagueName);
          }
          return [null];
        })
      )
      .subscribe((data) => {
        console.log('entre');
        
        this.knowledgeAreasList = data.knowledgeAreas;
        this.dataKnowledgeAreas.data = this.knowledgeAreasList;
        this.initPolarData(this.knowledgeAreasList, this.polarData);

      });

  }

  initPolarData(knowledgeAreaList: KnowledgeArea[], polarData: PolarData) {
    polarData.name = "Radar";
    knowledgeAreaList.forEach(area => {
      const newSerieData = { name: area.descriptor, value: area.appropriationLevel };
      this.serieList.push(newSerieData);
      polarData.series = this.serieList;

    })

    this.polarDataList = [...this.polarDataList, this.polarData]
  }

  getLeague() {
    this.leagueService.getLeague(this.leagueName).subscribe((data) => {
      this.league = data;
      this.dataApprendices.data = data.usersEmails;
      this.averageAll(data.usersEmails, data.radarName)
      this.apprenticeAverages(data.usersEmails)

    })
  }

  apprenticeAverages(emails: string[]) {

    emails.forEach(email => {
      this.apprenticeAverage1(email)
    })

  }
  apprenticeAverage1(email: string) {
    let userAverages: Serie[] = [];
    let userData: PolarData = {
      name: email,
      series: []
    };
    this.getRadarAndApprenticesToLeague();
    this.userService.getUser(email).subscribe(user => {
      user.averages?.forEach((average: { description: any; appropriationLevel: any; }) => {
        const newSerieData = { name: average.description, value: average.appropriationLevel }
        userAverages.push(newSerieData)
        userData.series = userAverages
      })
    })
    this.polarDataList = [...this.polarDataList, userData]
  }

  apprenticeAverage(email: string) {
    let userAverages: Serie[] = [];
    let userData: PolarData = {
      name: email,
      series: []
    };
    this.getRadarAndApprenticesToLeague();
    this.userService.getUser(email).subscribe(user => {
      user.averages.forEach((average: { description: any; appropriationLevel: any; }) => {
        const newSerieData = { name: average.description, value: average.appropriationLevel }
        userAverages.push(newSerieData)
        userData.series = userAverages
      })
    })
    this.polarDataList = [userData]
  }


  averageAll(emails: string[], radarName: string) {
    let apprentices: User[] = [];
    const sumByKnowledgeArea = {};
    let appropiationLevelApprentices: any[] = [];

    const observables = emails.map(email => this.userService.getUser(email));

    forkJoin(observables).subscribe(users => {
      users.forEach(user => {
        const res: User = user;
        apprentices.push(res);
      });
    });

    this.radarService.getRadar(radarName).subscribe(res => {

      for (let index = 0; index < res.knowledgeAreas!.length; index++) {

        apprentices.forEach(apprentice => {

          const note = apprentice.averages?.at(index)?.appropriationLevel;

          appropiationLevelApprentices.push(note);
        })
        const sum = appropiationLevelApprentices.reduce((acc, val) => acc + val, 0);
        const apropiation = sum / appropiationLevelApprentices.length

        this.averagesFinal.push(apropiation);
      }
     let i = -1;
     const newData = this.dataKnowledgeAreas.data.map(item => {
      return {
        ...item,
        averageApprendite: this.averagesFinal.at(0)
      };
    });
    console.log(newData);
    
    this.dataKnowledgeAreas.data =newData;
    console.log(this.dataKnowledgeAreas);
    })

  }



}





export interface PolarData {
  name: string,
  series: Serie[]
}

export interface Serie {
  name: string,
  value: number
}

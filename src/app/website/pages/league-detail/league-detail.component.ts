import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, forkJoin, Observable, switchMap } from 'rxjs';
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

  leagueName: any | null = null;
  league: League | null = null;


  dataTable: dataTableLeague[] = [];
  averagesFinal: any[] = [];
  apprentices = [];

  knowledgeAreasList!:KnowledgeArea[] | undefined;
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


  dataKnowledgeAreas = new MatTableDataSource<dataTableLeague>(this.dataTable);
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
    private userService: UserService) {  }

  ngOnInit(): void {
    this.getLeague();
  }

  onSelect(event: any) {
    console.log(event);
  }


 
  async getRadarAndApprenticesToLeague() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          // console.log('params :>> ', params);
          const leagueName = params.get('name');
          this.leagueName = leagueName;
          if (this.leagueName) {
            return this.radarService.getRadarByLeague(this.leagueName);
          }
          return [null];
        })
      )
      .subscribe(async (data) => {
        console.log('entre');
        this.knowledgeAreasList = data!.knowledgeAreas;
        this.initPolarData(this.knowledgeAreasList!)

      });

  }

  initPolarData(knowledgeAreaList: KnowledgeArea[]) {
    this.polarData.name = "Radar";
    knowledgeAreaList.forEach(area => {
      const newSerieData = { name: area.descriptor, value: area.appropriationLevel };
      this.serieList.push(newSerieData);
     
      this.polarData.series = this.serieList;

    })
    
    this.polarDataList = [...this.polarDataList, this.polarData]
  }

  getLeague() {
    this.leagueService.getLeague(this.route.snapshot.params['name']).subscribe((data) => {
      const res = data;
      this.league = res;
      this.dataApprendices.data = data.usersEmails;
      this.averageAll(res.usersEmails,res.radarName)
      this.apprenticeAverages(this.league!.usersEmails!)
      
    })
  }

  apprenticeAverages(emails: string[]) {

    emails.forEach(email => {
      this.apprenticeAverage1(email)
    })

  }
  //pinto en grafica datos todos los aprendices
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
    let appropiationLevelApprentices: any[] = [];

    const observables = emails.map(email => this.userService.getUser(email));

    forkJoin(observables).subscribe(users => {
      users.forEach(user => {
        const res: User = user;
        apprentices.push(res);
      });
    });

    this.radarService.getRadar(radarName).subscribe(res => {
      let data1: dataTableLeague[] = [];

      for (let index = 0; index < res.knowledgeAreas!.length; index++) {

        apprentices.forEach(apprentice => {

          const note = apprentice.averages?.at(index)?.appropriationLevel;

          appropiationLevelApprentices.push(note);
        })
        const sum = appropiationLevelApprentices.reduce((acc, val) => acc + val, 0);
        const apropiation = sum / appropiationLevelApprentices.length

        this.averagesFinal.push(apropiation);
      }
      console.log(this.averagesFinal);

      this.functionTable(res.knowledgeAreas!,this.averagesFinal)
/*
      const nuevoObjeto = [];
    for (let i = 0; i < res.knowledgeAreas!.length; i++) {
     
      // Creamos una nueva tupla que contiene la tupla de x y el número aleatorio
      const nuevaTupla:dataTableLeague = {
        name: res.knowledgeAreas!.at(i)!.name,
        descriptor: res.knowledgeAreas!.at(i)!.descriptor,
        appropriationLevel: res.knowledgeAreas!.at(i)!.appropriationLevel,
        averageApprendite: this.averagesFinal.at(1),
      };
      // Agregamos la nueva tupla al nuevo objeto
      nuevoObjeto.push(nuevaTupla);
  */
   
    })
    
  }

  functionTable(knowledgeAreasList: KnowledgeArea[],average:any[]){
    const nuevoObjeto = [];
    for (let i = 0; i < knowledgeAreasList.length; i++) {
     
      // Creamos una nueva tupla que contiene la tupla de x y el número aleatorio
      const nuevaTupla:dataTableLeague = {
        name: knowledgeAreasList.at(i)!.name,
        descriptor: knowledgeAreasList.at(i)!.descriptor,
        appropriationLevel: knowledgeAreasList.at(i)!.appropriationLevel,
        averageApprendite: average.at(i),
      };
      // Agregamos la nueva tupla al nuevo objeto
      nuevoObjeto.push(nuevaTupla);
    }
    
    this.dataKnowledgeAreas.data = nuevoObjeto;
  }

  llenarTabla(knowledgeAreaList: KnowledgeArea[]) {
    let data1: dataTableLeague[] = [];

    knowledgeAreaList.forEach(area => {
      const tupla: dataTableLeague = {
        name: area.name,
        descriptor: area.descriptor,
        appropriationLevel: area.appropriationLevel,
    
      }
      data1.push(tupla);
    })
    this.dataTable = data1;
    this.dataKnowledgeAreas.data = this.dataTable;
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

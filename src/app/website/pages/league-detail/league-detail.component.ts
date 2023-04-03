import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-league-detail',
  templateUrl: './league-detail.component.html',
  styleUrls: ['./league-detail.component.scss']

})
export class LeagueDetailComponent implements AfterViewInit, OnInit {

  formAddApprenticeLeague !: FormGroup;
  userList : User[];
  apprenticeList: User[];


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

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginator1') paginator1!: MatPaginator;


  dataKnowledgeAreas = new MatTableDataSource<dataTableLeague>(this.dataTable);
  dataApprendices = new MatTableDataSource<string[]>(this.apprentices);


  view: [number, number] = [1024, 350];

  // options graph
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';



  constructor(
    private toast: ToastrService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private leagueService: LeagueService,
    private radarService: RadarService,
    private userService: UserService) {
      this.initForm();
      this.userList = [];
      this.apprenticeList = [];
      this.getAllUsers();
      this.getLeague();
      setTimeout(()=>{
        this.averageAll(this.league!.usersEmails!, this.league!.radarName!)
      },500)

      }

      initForm(): void {
        this.formAddApprenticeLeague = this._formBuilder.group({
          email: ['', Validators.required]
        })
      }
      get emailNoValido() {
        return this.formAddApprenticeLeague.get('email')?.invalid && this.formAddApprenticeLeague.get('email')?.touched
      }

      onSubmitFormAddApprenticeLeague(){

        if (this.formAddApprenticeLeague.invalid) {

          this.toast.error('Intenta de nuevo', 'Error en los datos!');
          return Object.values(this.formAddApprenticeLeague.controls).forEach(control => {
            control.markAllAsTouched();
          })
        }
        
        console.log("FORMULARIO FUNCIONANDO");
        const addApprenticeDTO: any = {
          email: this.formAddApprenticeLeague.value.email,
          leagueName: this.leagueName
        }

        this.leagueService.addAprenticeToLeague(addApprenticeDTO.email, addApprenticeDTO.leagueName ).subscribe({
          next: (response) => {
            console.log('response :>> ', response);
          },
          error: (error) => {
            console.log('error :>> ', error);

            return this.toast.error('Error inesperado', 'Vuelve a intentarlo, por favor.');

          },
          complete: () => {
            this.toast.success('Guardando...', 'Registro exitoso!');
            setTimeout(() => {
              window.location.reload();
             }, 1500);

          }
        });
      }

      getAllUsers() {

        this.userService.listUsers().subscribe(data => {
          this.userList = data;
          this.userList
          .filter(user => user.role === 'ROLE_APPRENTICE')
          .forEach(user => {
            this.apprenticeList.push(user);
          } );
        });
        console.log('this.apprenticeList :>> ', this.apprenticeList);
      }


  ngOnInit(): void {
    this.getLeague();
    this.averageAll(this.league!.usersEmails!, this.league!.radarName!)
  }

  ngAfterViewInit() {
    this.dataApprendices.paginator = this.paginator;
    this.dataKnowledgeAreas.paginator = this.paginator1;
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

 async getLeague() {
    this.leagueService.getLeague(this.route.snapshot.params['name'])
    .subscribe(async (data) => {
      const res = data;
      this.league = res;
      this.radarName = res.radarName
      this.dataApprendices.data = data.usersEmails;
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
    let avgs: any[] =[]

    this.getRadarAndApprenticesToLeague();
    this.userService.getUser(email).subscribe(user => {

      user.averages.forEach((average: { description: any; appropriationLevel: any; }) => {
        const newSerieData = { name: average.description, value: average.appropriationLevel }
        const avg = newSerieData.value;
        avgs.push(avg)
        userAverages.push(newSerieData)
        userData.series = userAverages
      })
      this.polarDataList = [userData]
      this.radarService.getRadar(this.radarName!).subscribe(radar =>{
        this.functionTable(radar.knowledgeAreas!,avgs)
      })
    })
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
      this.functionTable(res.knowledgeAreas!,this.averagesFinal)
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


}



export interface PolarData {
  name: string,
  series: Serie[]
}

export interface Serie {
  name: string,
  value: number
}

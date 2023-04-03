import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeagueService } from 'src/app/services/league.service';
import { RadarService } from 'src/app/services/radar.service';
import { League } from 'src/shared/models/league';
import { Radar } from 'src/shared/models/radar';

@Component({
  selector: 'app-average',
  templateUrl: './average.component.html',
  styleUrls: ['./average.component.scss']
})
export class AverageComponent implements OnInit {
  radarList !: Radar[];
  radarNameList : string[];
  leagueList !: League[];

  formCreateLeague !: FormGroup;

  constructor( private toast: ToastrService,
    private router:Router,
    private leagueService: LeagueService,
    private _formBuilder: FormBuilder,
    private radarService: RadarService
    ){
      this.radarNameList = [];
      this.initForm();
      this.getListRadar();
    }

    initForm(): void {
      this.formCreateLeague = this._formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(4)]],
        radarName: ['', Validators.required],
        period: ['', Validators.required],
        coach: ['', [Validators.required,Validators.minLength(4)] ],
        year: ['',[Validators.required, Validators.minLength(4)]]
      })
    }

    get nameNoValido() {
      return this.formCreateLeague.get('name')?.invalid && this.formCreateLeague.get('name')?.touched
    }
    get radarNameNoValido() {
      return this.formCreateLeague.get('radarName')?.invalid && this.formCreateLeague.get('radarName')?.touched
    }
    get periodNoValido() {
      return this.formCreateLeague.get('period')?.invalid && this.formCreateLeague.get('period')?.touched
    }
    get coachNoValido() {
      return this.formCreateLeague.get('coach')?.invalid && this.formCreateLeague.get('coach')?.touched
    }
    get yearNoValido() {
      return this.formCreateLeague.get('year')?.invalid && this.formCreateLeague.get('year')?.touched
    }

    onSubmitformCreateLeague(){


      if (this.formCreateLeague.invalid) {

        this.toast.error('Intenta de nuevo', 'Error en los datos!');
        return Object.values(this.formCreateLeague.controls).forEach(control => {
          control.markAllAsTouched();
        })
      }
      const leagueDTO: any = {
        name: this.formCreateLeague.value.name,
        radarName: this.formCreateLeague.value.radarName,
        period: this.formCreateLeague.value.period,
        coach: this.formCreateLeague.value.coach,
        year: this.formCreateLeague.value.year
      }

      this.leagueService.saveLeagues(leagueDTO).subscribe({
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

    getListRadar(){
      this.radarService.listRadars().subscribe((data) => {
        this.radarList = data;
        console.log('this.radar-list :>> ', this.radarList);
        this.radarList.forEach(radar => {

          console.log(radar.name);
          this.radarNameList.push(radar.name);

        });
        console.log('this.radarNameList :>> ', this.radarNameList);
      })
    }

  ngOnInit(): void {
   this.getLeagueList();
  }


  getLeagueList(){

    this.leagueService.listLeagues().subscribe(response => {

      this.leagueList = response;
      console.log(this.leagueList);

    });
  }

  ligasList: any[] = [
    {name:'Desarrollo Ciclo 1'},
    {name: 'Desarrollo Ciclo 2'},
    {name: 'Desarrollo Ciclo 3'},
    {name: 'Desarrollo Ciclo 4'},
    {name: 'Desarrollo Ciclo 5'},
    {name: 'Desarrollo Ciclo 6'}];
}

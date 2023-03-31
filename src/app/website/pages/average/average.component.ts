import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LeagueService } from 'src/app/services/league.service';
import { League } from 'src/shared/models/league';

@Component({
  selector: 'app-average',
  templateUrl: './average.component.html',
  styleUrls: ['./average.component.scss']
})
export class AverageComponent implements OnInit {

  leagueList !: League[];

  constructor( private toast: ToastrService,
    private router:Router,
    private leagueService: LeagueService){}
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

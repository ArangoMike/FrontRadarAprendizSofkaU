import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { League } from 'src/shared/models/league';

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  constructor(private http:HttpClient) { }

  private url: string = 'http://localhost:8080/';

  saveLeagues(league:League):Observable<any>{
    let direction = this.url + 'create/league';
    return this.http.post<League>(direction,league);
  }

  listLeagues():Observable<any>{
    let direction = this.url +'listall/leagues';
    return this.http.get<League[]>(direction);
  }

  getLeague(leagueName: string):Observable<any>{
    let direction = this.url + '/league/'+ leagueName;
    return this.http.get<League>(direction);
  }

}

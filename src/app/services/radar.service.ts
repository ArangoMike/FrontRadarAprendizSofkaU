import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs';
import {  switchMap } from 'rxjs/operators';
import { KnowledgeArea } from 'src/shared/models/knowledgeArea';
import { League } from 'src/shared/models/league';
import { Radar } from 'src/shared/models/radar';

@Injectable({
  providedIn: 'root'
})
export class RadarService {

  constructor(private http:HttpClient) { }

  private url: string = 'http://localhost:8080';

  saveRadar(radar:Radar):Observable<any>{
    let direction = this.url + '/create/radar';
    return this.http.post<Radar>(direction,radar, {
      responseType: 'text' as 'json',
    });
  }

  listRadars():Observable<any>{
    let direction = this.url +'/list/radars';
    return this.http.get<Radar[]>(direction);
  }

  getRadar(name: string): Observable<Radar>{
    let direction =  this.url +`/radar/${name}`;
    return this.http.get<Radar>(direction);
  }

  getLeague(leagueName: string):Observable<any>{
    let direction = this.url + '/league/'+ leagueName;
    return this.http.get<League>(direction);
  }

  getRadarByLeague(leagueName: string){
    return this.getLeague(leagueName)
      .pipe(
        switchMap( (data) => this.getRadar(data.radarName))
      )
  }

  addKnowledgeAreaRadar(radarId:string, knowledgeArea:KnowledgeArea):Observable<any>{
    let direction = this.url +'/add/knowledgeArea/'+ radarId;
    return this.http.put<Radar>(direction, knowledgeArea);

  }

}

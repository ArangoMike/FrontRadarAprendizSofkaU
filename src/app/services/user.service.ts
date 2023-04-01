import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Average } from 'src/shared/models/average';
import { User } from 'src/shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  private url: string = 'http://localhost:8080/';

  saveUser(user:User):Observable<any>{
    let direction = this.url + 'create/user';
    return this.http.post<User>(direction,user)
  }

  getRoleUser(email:string):Observable<any>{
    let direction = this.url + 'role/user/'+ email;
    return this.http.get<string>(direction,{
      responseType: 'text' as 'json',
    })
  }

  listUsers():Observable<any>{
    let direction = this.url + 'listall/user';
    return this.http.get<User[]>(direction)
  }

  addAverageUser(email:string,average:Average):Observable<any>{
    let direction = this.url + 'addaverage/user/' + email;
    return this.http.post<User>(direction, average)
  }

  getUser(email:string):Observable<any>{
    let direction = this.url + 'user/' + email;
    return this.http.get<User>(direction)
  }
 
}

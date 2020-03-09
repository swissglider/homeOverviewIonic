// platform imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService
{
 /**
  * Construct a new basic service
  *
  * @param {HttpClient} _http: Http Injected HttpClient instance
  */
  constructor(protected _http: HttpClient)
  {
    // empty
  }

 /**
  * Retrieve data from from the requested URL
  *
  * @param url: string URL of external service
  *
  * @returns Observable<any>
  */
  public getData(url: string): Observable<Object>
  {
    if (url != "") {
      return this._http.get(url);
    }
  }
}
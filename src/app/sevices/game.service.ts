import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIResponse, Game } from '../models/game';
import { environment as env } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor(private http: HttpClient) {}

  getGameList = (
    order: string,
    search?: string
  ): Observable<APIResponse<Game>> => {
    const params = search
      ? new HttpParams().set('ordering', order).set('search', search)
      : new HttpParams().set('ordering', order);

    return this.http.get<APIResponse<Game>>(`${env.base_url}/games`, {
      params: params,
    });
  };

  getGameDetails = (id: string): Observable<Game> => {
    const reqFrGameInfo = this.http.get(`${env.base_url}/games/${id}`);
    const reqFrTrailer = this.http.get(`${env.base_url}/games/${id}/movies`);
    const reqFrScreenshot = this.http.get(
      `${env.base_url}/games/${id}/screenshots`
    );

    return forkJoin({
      reqFrGameInfo,
      reqFrTrailer,
      reqFrScreenshot,
    }).pipe(
      map((res: any) => {
        return {
          ...res['reqFrGameInfo'],
          trailer: res['reqFrTrailer']?.results,
          screenShot: res['reqFrScreenshot']?.results,
        };
      })
    );
  };
}

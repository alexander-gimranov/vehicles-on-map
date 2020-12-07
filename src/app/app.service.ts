import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, tap, map, filter } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { UsersList } from 'src/models/UsersList';
import { LocationsList } from 'src/models/LocationList';
import { HttpRequestCache } from 'src/app/httprequestcache';

@Injectable({
    providedIn: 'root',
})

export class AppService {
    private BASE_URL = "http://mobi.connectedcar360.net/api/";

    constructor(
        private http: HttpClient,
        private cache: HttpRequestCache
    ) { }

    handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }        
        return throwError(errorMessage);
    }

    getList(): Observable<UsersList> {
        let params = new HttpParams().set("op", "list");
        let request = new HttpRequest('GET', this.BASE_URL, { params: params, responseType: 'json' });

        return this.sendRequest<UsersList>(request, 300000)
        //return this.http.get<UsersList>("./assets/list.mock.json")
    }

    getLocations(userId: number): Observable<LocationsList> {
        let params = new HttpParams().set("op", "getlocations").set("userid", userId.toString());
        let request = new HttpRequest('GET', this.BASE_URL, { params: params, responseType: 'json' });
        return this.sendRequest<LocationsList>(request, 30000);
        //return this.http.get<LocationsList>("./assets/locations.mock.json")
    }

    private sendRequest<T>(request: HttpRequest<unknown>, maxAge: number): Observable<T> {
        const cachedResponse = this.cache.get(request);
        if (cachedResponse) return of(cachedResponse.body as T);

        return this.http.request(request).pipe(
            filter((event) => event instanceof HttpResponse),
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cache.put(request, event, maxAge);
                }
            }),
            map(res => { 
                if (res instanceof HttpResponse) { 
                    return res.body as T 
                }
                throw new Error("response type of " + (typeof res));
            }),
            catchError(this.handleError)
        );
    }
}
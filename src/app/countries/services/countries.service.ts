import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, delay, map, of, tap } from "rxjs";
import { Country } from "../interfaces/country";
import { CacheStore } from "../interfaces/cache-store.interface";
import { Region } from "../interfaces/region.type";


@Injectable({
    providedIn: 'root'
})
export class CountriesService {
    constructor(private http: HttpClient) {
        this.loadFromLocalStorage()
    }

    private saveToLocalStorage() {
        localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore))
    }

    private loadFromLocalStorage() {
        if (!localStorage.getItem('cacheStore')) return
        this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!)
    }

    private getCountriesRequest(url: string): Observable<Country[]> {
        return this.http.get<Country[]>(url)
            .pipe(
                catchError(error => of([])),
                delay(2000)
            )
    }

    public apiUrl: string = "https://restcountries.com/v3.1"

    public cacheStore: CacheStore = {
        byCapital: { term: '', countries: [] },
        byCountry: { term: '', countries: [] },
        byRegion: { region: '', countries: [] }
    }

    byCode(query: string): Observable<Country | null> {
        const url = `${this.apiUrl}/alpha/${query}`
        return this.http.get<Country[]>(url)
            .pipe(
                map(countries => countries.length ? countries[0] : null),
                catchError(error => of(null))
            )
    }

    byCapital(query: string): Observable<Country[]> {
        const url = `${this.apiUrl}/capital/${query}`
        return this.getCountriesRequest(url)
            .pipe(
                tap(countries => this.cacheStore.byCapital = { term: query, countries: countries }),
                tap(() => this.saveToLocalStorage())
            )
    }

    byCountry(query: string): Observable<Country[]> {
        const url = `${this.apiUrl}/name/${query}`
        return this.getCountriesRequest(url)
            .pipe(
                tap(countries => this.cacheStore.byCountry = { term: query, countries: countries }),
                tap(() => this.saveToLocalStorage())
            )
    }

    byRegion(query: Region): Observable<Country[]> {
        const url = `${this.apiUrl}/region/${query}`
        return this.getCountriesRequest(url)
            .pipe(
                tap(countries => this.cacheStore.byRegion = { region: query, countries: countries }),
                tap(() => this.saveToLocalStorage())
            )
    }


}
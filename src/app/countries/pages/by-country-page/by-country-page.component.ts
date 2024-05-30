import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  styleUrl: './by-country-page.component.css'
})
export class ByCountryPageComponent implements OnInit {

  public countries: Country[] = []
  public initialValue: string = ''

  constructor(private countriesService: CountriesService) {

  }

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byCountry.countries
    this.initialValue = this.countriesService.cacheStore.byCountry.term
  }

  public onValue(term: string): void {
    console.log({ term })
    this.countriesService.byCountry(term)
      .subscribe(countries => {
        this.countries = countries
      })
  }
}

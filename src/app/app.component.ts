import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { count } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{
  title = 'Interactive-World-Map-Project';
  focusCountryName: any;
  countryResponseInfo: any;
  

  constructor(private http: HttpClient) {}

  @ViewChild('interactiveWorldMap', { static: false}) interactiveWorldMap!: ElementRef<SVGSVGElement>;

  ngAfterViewInit() {
    this.svgCountryEventListeners();
  }

  svgCountryEventListeners() {
    const svgElements = this.interactiveWorldMap.nativeElement;
    const svgCountries = svgElements.querySelectorAll('path');
    svgCountries.forEach((country => {
      const countryId = country.getAttribute('id')

      if(!countryId || countryId === 'null') { return; }

      country.addEventListener('mouseover', (event) => this.onMouseOver(event));
      country.addEventListener('mouseleave', (event) => this.onMouseLeave(event));
      country.addEventListener('click', (event) => this.onClick(event));
    }))
  }

  onMouseOver(event: MouseEvent) {
    const focus = event.target as SVGPathElement;
    const countryId = focus.getAttribute('id')
    const url = `https://api.worldbank.org/V2/country/${countryId}?format=json`;

    this.http.get<any[]>(url).subscribe((Response) => {if (Response) {this.focusCountryName = Response[1][0].name}});
  }

  onMouseLeave(event: MouseEvent) {
    this.countryResponseInfo = null; 
    this.focusCountryName = null;
   }

  onClick(event: MouseEvent) {
    const focus = event.target as SVGPathElement;
    const countryId = focus.getAttribute('id')
    const url = `https://api.worldbank.org/V2/country/${countryId}?format=json`;

    this.http.get<any[]>(url).subscribe((Response) => {if (Response != null) {this.countryResponseInfo = Response[1][0]}});
  }
}


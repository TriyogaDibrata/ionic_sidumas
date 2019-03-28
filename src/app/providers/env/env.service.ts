import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'http://laras.badungkab.go.id/api/';
  
  constructor() { }
}

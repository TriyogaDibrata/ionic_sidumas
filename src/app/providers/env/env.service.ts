import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'http://192.168.1.202/larasv2/public/api/';
  
  constructor() { }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

enum url {
  agencies = '/agencies',
  svm = '/predict-svm',
  logistic = '/predict-logistic',
  base = 'https://police-attack-service.onrender.com',
}

@Injectable({
  providedIn: 'root',
})
export class PredictService {
  constructor(private http: HttpClient) {}

  realizarPrediccion(data: any, isSVM = false) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // O puedes especificar tu dominio en lugar de '*'
      }),
    };

    const route = `${url.base}${isSVM ? url.svm : url.logistic}`

    return this.http.post(route, data, httpOptions);
  }

  obtenerAgencias() {
    const route = `${url.base}${url.agencies}`

    return this.http.get(route);
  }
}

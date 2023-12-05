import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PredictService } from './services/predict.service';
import { Modal } from 'bootstrap';
import { Subscription } from 'rxjs';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { TEXT_UI } from './constants/text_ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class AppComponent implements OnDestroy {
  infoForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    edad: ['', Validators.required],
    genero: ['', Validators.required],
    raza: ['', Validators.required],
    direccion: ['', Validators.required],
    ubicacionExacta: ['', Validators.required],
    enfer_mental: ['', Validators.required],
  });
  issueForm = this.formBuilder.group({
    armadoCon: ['', Validators.required],
    estadoHuida: ['', Validators.required],
    tipoAmenaza: ['', Validators.required],
    maneraMorir: ['', Validators.required],
  });
  policeForm = this.formBuilder.group({
    camaraCorporal: ['', Validators.required],
    idAgencias: ['', Validators.required],
  });
  modelForm = this.formBuilder.group({
    model: ['', Validators.required],
  });

  mySubs!: Subscription;
  textUI = TEXT_UI;
  agenciesList!: any;
  selectedModel = '';
  resPredict = '';

  constructor(
    private formBuilder: FormBuilder,
    private predictService: PredictService
  ) {}

  ngOnInit() {
    this.formsChanges();
    this.callAgencies();
  }

  formsChanges() {
    this.infoForm.valueChanges.subscribe({
      next: () => console.log(this.infoForm),
      error: () => {},
    });
    this.issueForm.valueChanges.subscribe({
      next: () => console.log(this.issueForm),
      error: () => {},
    });
    this.policeForm.valueChanges.subscribe({
      next: () => console.log(this.policeForm),
      error: () => {},
    });
    this.modelForm.valueChanges.subscribe({
      next: () => console.log(this.modelForm),
      error: () => {},
    });
  }

  callAgencies() {
    this.predictService.obtenerAgencias().subscribe({
      next: (resp) => {
        this.agenciesList = resp;
      },
      error: (err) => console.error(err),
    });
  }

  callPredict(data: any, isSVM: boolean, myModal: Modal) {
    this.mySubs = this.predictService
      .realizarPrediccion(data, isSVM)
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.resPredict =
            resp.prediction === -1 || resp.prediction === 0 ? 'No' : 'Si';
          myModal.show();
        },
        error: (err) => console.error(err),
      });
  }

  triggerPredict(formData: any, myModal: Modal) {
    const data = {
      maneraMorir: formData.maneraMorir.id,
      tipoAmenaza: formData.tipoAmenaza.id,
      estadoHuida: formData.estadoHuida.id,
      armadoCon: formData.armadoCon.id,
      ubicacionExacta: formData.ubicacionExacta.id,
      edad: formData.edad,
      genero: formData.genero.id,
      raza: formData.raza.id,
      enfermedadMental: formData.enfer_mental.id,
      camaraCorporal: formData.camaraCorporal.id,
      idAgencias: formData.idAgencias.id,
    };
    const isSVM = formData.model === 'Función SVM';
    this.selectedModel = formData.model;

    console.log('Data enviar', { data, isSVM });
    this.callPredict(data, isSVM, myModal);
  }

  onSubmit() {
    if (
      this.infoForm.valid &&
      this.issueForm.valid &&
      this.policeForm.valid &&
      this.modelForm.valid
    ) {
      const formData = {
        ...this.infoForm.value,
        ...this.issueForm.value,
        ...this.policeForm.value,
        ...this.modelForm.value,
      };
      const myModal = new Modal('#exampleModal');
      console.log(formData); // Aquí puedes enviar los datos a donde los necesites
      this.triggerPredict(formData, myModal);
    }
  }

  agencySearchFn(term: string, item: {id: number, nombre: string}) {
        term = term.toLowerCase();
        return item.nombre.toLowerCase().indexOf(term) > -1 || item.nombre.toLowerCase() === term;
    }

  ngOnDestroy(): void {
    this.mySubs.unsubscribe();
  }
}

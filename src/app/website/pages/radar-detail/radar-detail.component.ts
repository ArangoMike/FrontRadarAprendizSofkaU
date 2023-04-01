import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RadarService } from '../../../services/radar.service';
import { Radar } from '../../../../shared/models/radar';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-radar-detail',
  templateUrl: './radar-detail.component.html',
  styleUrls: ['./radar-detail.component.scss']
})
export class RadarDetailComponent {

  /** Fuente de datos para la tabla de datos */
  dataSource = new MatTableDataSource<any>();

  radarName: string | null = null;
  radar: Radar | null = null;
  knowledgeAreas !: any[];
  radarId !: string;

  formAddknowledgeArea !: FormGroup;

  constructor(
    private toast: ToastrService,
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private radarService: RadarService
  ) {


    this.route.paramMap
    .pipe(
      switchMap((params) => {
        // console.log('params :>> ', params);
        this.radarName = params.get('name');
        if (this.radarName) {
          return this.radarService.getRadar(this.radarName);
        }
        return [null];
      })
    )
    .subscribe((data) => {
      this.radar = data;
      this.radarId = data.radarId;
      this.dataSource = new MatTableDataSource<any>(this.radar?.knowledgeAreas);
      console.log(this.radar);
    });

    this.initForm();

   }

   initForm(): void {
    this.formAddknowledgeArea = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      descriptor: ['', [Validators.required, Validators.minLength(4)]],
      factual: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      conceptual: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      procedural: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      metacognitive: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      appropriationLevel: ['', [Validators.required, Validators.min(0), Validators.max(5)]],

    });
  }


  get nameNoValido() {
    return this.formAddknowledgeArea.get('name')?.invalid && this.formAddknowledgeArea.get('name')?.touched
  }

  get descriptorNoValido() {
    return this.formAddknowledgeArea.get('descriptor')?.invalid && this.formAddknowledgeArea.get('descriptor')?.touched
  }

  get factualNoValido() {
    return this.formAddknowledgeArea.get('factual')?.invalid && this.formAddknowledgeArea.get('factual')?.touched
  }

  get conceptualNoValido() {
    return this.formAddknowledgeArea.get('conceptual')?.invalid && this.formAddknowledgeArea.get('conceptual')?.touched
  }

  get proceduralNoValido() {
    return this.formAddknowledgeArea.get('procedural')?.invalid && this.formAddknowledgeArea.get('procedural')?.touched
  }

  get metacognitiveNoValido() {
    return this.formAddknowledgeArea.get('metacognitive')?.invalid && this.formAddknowledgeArea.get('metacognitive')?.touched
  }

  get appropriationLevelNoValido() {
    return this.formAddknowledgeArea.get('appropriationLevel')?.invalid && this.formAddknowledgeArea.get('appropriationLevel')?.touched
  }


  onSubmitformAddknowledgeArea(){
    console.log("Entramos");

    if (this.formAddknowledgeArea.invalid) {

      this.toast.error('Intenta de nuevo', 'Error en los datos!');
      return Object.values(this.formAddknowledgeArea.controls).forEach(control => {
        control.markAllAsTouched();
      })
    }

    const knowledgeAreaDTO: any = {
      name: this.formAddknowledgeArea.value.name,
      descriptor: this.formAddknowledgeArea.value.descriptor,
      factual: this.formAddknowledgeArea.value.factual,
      conceptual: this.formAddknowledgeArea.value.conceptual,
      procedural: this.formAddknowledgeArea.value.procedural,
      metacognitive: this.formAddknowledgeArea.value.metacognitive,
      appropriationLevel: this.formAddknowledgeArea.value.appropriationLevel,
    }

    console.log('CREATE ', knowledgeAreaDTO);

    this.radarService.addKnowledgeAreaRadar(this.radarId, knowledgeAreaDTO).subscribe({
      next: (response) => {
        console.log('response :>> ', response);
      },
      error: (error) => {
        console.log('error :>> ', error);
        return this.toast.error('Error inesperado', 'Vuelve a intentarlo, por favor.');

      },
      complete: () => {
        this.toast.success('Guardando...', 'Registro exitoso!');
        setTimeout(() => {
          window.location.reload();
         }, 1500);

      }
    });

  }


  displayedColumns: string[] = [
    'knowledgeArea',
    'descriptor',
    'factual',
    'conceptual',
    'procedural',
    'metacognitive',
    'appropriationLevel',
    'action'
  ];


}

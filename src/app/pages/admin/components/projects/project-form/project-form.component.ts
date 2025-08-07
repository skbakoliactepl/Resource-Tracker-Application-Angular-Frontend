import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ProjectModel } from '../../../services/projects/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent {
  @Input() project: ProjectModel | null = null;
  @Output() formClose = new EventEmitter<boolean>();
  @Input() projectForm!: FormGroup;
  @Output() submitProject = new EventEmitter<void>();
  @Output() cancelProject = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.project) {
      this.projectForm.patchValue(this.project);
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      console.log('Submitted project:', this.projectForm.value);
      // Save or update logic goes here
      this.formClose.emit(true);
    }
  }

  onCancel(): void {
    this.formClose.emit(false);
  }
}

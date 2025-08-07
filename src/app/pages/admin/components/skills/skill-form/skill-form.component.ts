import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule],
  templateUrl: './skill-form.component.html',
  styleUrl: './skill-form.component.css'
})
export class SkillFormComponent {
  @Input() skillForm!: FormGroup;
  @Input() isEditMode = false;
  @Output() submitSkill = new EventEmitter<void>();
  @Output() cancelSkill = new EventEmitter<void>();

  onSubmit() {
    this.submitSkill.emit();
  }

  onCancel() {
    this.cancelSkill.emit();
  }
}

import { Component, Input } from '@angular/core';
import { SkillModel } from '../../../services/skills/skill.service';
import { SkillFormComponent } from '../skill-form/skill-form.component';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ButtonModule,
    SkillFormComponent
  ],
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.css'
})
export class SkillListComponent {
  @Input() skills: SkillModel[] = [];

  showForm = false;
  selectedSkill: SkillModel | null = null;

  openForm() {
    this.selectedSkill = null;
    this.showForm = true;
  }

  editSkill(skill: SkillModel) {
    this.selectedSkill = { ...skill }; // Avoid mutating original
    this.showForm = true;
  }

  closeForm(updated: boolean) {
    this.showForm = false;
    this.selectedSkill = null;

    if (updated) {
      // Optionally emit an event to parent to reload data
      // this.reloadSkills.emit();
    }
  }

  deleteSkill(skillID: number) {
    // Add a delete handler here (emit to parent or call service directly)
    console.log('Delete skill with ID:', skillID);
  }
}

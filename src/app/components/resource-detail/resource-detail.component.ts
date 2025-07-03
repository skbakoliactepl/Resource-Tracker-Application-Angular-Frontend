import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Resource } from '../../models/resource.model';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-resource-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resource-detail.component.html',
  styleUrl: './resource-detail.component.css'
})
export class ResourceDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceService
  ) { };

  resource?: Resource;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.resourceService.getById(id).subscribe((resource) => {
          this.resource = resource;
        });
      }
    });
  };
}

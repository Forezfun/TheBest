import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { NavigationPanelComponent } from '../navigation-panel/navigation-panel.component';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [NavigationPanelComponent, NgFor],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.scss'
})
export class CreatePageComponent implements OnInit {
  createForm!: FormGroup;
  names: string[] = ['', '', '']
  constructor(private fb: FormBuilder) { }
  onSumbit() {
    console.log(this.createForm.value)
  }

  ngOnInit(): void {
    this.createForm = this.fb.group({
      title: new FormControl(''),
      description: new FormControl(''),
      subDescription: new FormControl(''),
      imageLink: new FormControl(''),

    })
  }

}

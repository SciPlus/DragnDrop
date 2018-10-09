import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the PopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover-component',
  templateUrl: 'popover.html'
})
export class PopoverComponent {

  items: Object[];

  constructor(public viewCtrl: ViewController) {
    console.log('Hello PopoverComponent Component');
    this.items = [ 
      {name: "Bathing", url: "assets/imgs/bathing.png"},
      {name: "Beaker", url: "assets/imgs/beaker.png"},
      {name: "Bunsen Burner", url: "assets/imgs/lab-23.png"},
      {name: "Cylinder", url: "assets/imgs/cylinder.png"},
      {name: "Fire", url: "assets/imgs/fire.jpg"},
      {name: "Funnel 1", url: "assets/imgs/funnel-1.png"},
      {name: "Funnel 2", url: "assets/imgs/funnel.png"},
      {name: "Jar", url: "assets/imgs/jar.png"},
      {name: "Micropipettor", url: "assets/imgs/lab-1.png"},
      {name: "Microscope", url: "assets/imgs/lab-2.png"},
      {name: "Burette", url: "assets/imgs/lab-21.png"},
      {name: "Liquid", url: "assets/imgs/lab-22.png"},
      {name: "Three Neck Round Bottom Flask", url: "assets/imgs/lab-26.png"},
      {name: "Test Tube", url: "assets/imgs/laboratory-1.png"},
      {name: "Round Bottom Flask", url: "assets/imgs/laboratory-2.png"},
      {name: "Flask", url: "assets/imgs/laboratory-3.png"},
      {name: "Test Tubes", url: "assets/imgs/test-tube.png"}
    ]
  }
  itemClick(item) {
    this.viewCtrl.dismiss(item);
  }

}

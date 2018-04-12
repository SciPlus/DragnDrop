import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TaliaPage } from '../../pages/talia/talia';
import { Product} from '../../pages/talia/talia';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../app/models/Material'

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit{
  selectedItem: any;
  newProduct: Product;
  createdProducts: Array<Product>;
  materials: Material[];

  constructor(private materialService: MaterialService, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }
    // Let's populate this page with some filler content for funzies

  addToProducts() {
    this.createdProducts.push(new Product(this.newProduct.quantity, 4, true, false,  'hot coffee', true, "combination of heat and coffee", "assets/imgs/hot_coffee.png"));
  }
  ngOnInit() {
    this.materialService.getMaterials().subscribe(materials =>{
        console.log(materials);
        this.materials = materials;
    })
}
}

// 
// make "" not be able to be submitted to add to newCurrentMaterials
// show goal material under current matierials
// show product formed underneath reactants.
// completion toast
// failure toast

// on this page, lets use the databse to submit new items to available products.

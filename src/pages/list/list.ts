import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TaliaPage } from '../../pages/talia/talia';
import { Product} from '../../pages/talia/talia';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../app/models/Material';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit{
  selectedItem: any;
  newProduct: Product;
  createdProducts: Array<Product>;
  materials: Material[];
  startingMaterials: Material[];
  intermediateMaterials: Material[];
  finalMaterial: Material;
  material: Material = {
    name: '',
    definition: '',
    isStartingMaterial: false,
    isFinalMaterial: false

  }
  editState: boolean = false;
  materialToEdit: Material;


  constructor(private materialService: MaterialService, public navCtrl: NavController, public navParams: NavParams) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }
    // Let's populate this page with some filler content for funzies

  addToProducts() {
    this.createdProducts.push(new Product(this.newProduct.quantity, 4, true, false,  'hot coffee', true, "combination of heat and coffee", "assets/imgs/hot_coffee.png"));
  }
  ngOnInit() {
    // getting materials from database (calling getMaterials function)
    this.materialService.getMaterials().subscribe(materials =>{
    this.materials = materials;

        // setting our materials to the materials in the database
        // I wonder if there is a way to sort these materials in starting materials and so on based on properties of theirs. Maybe, according to the 3rd video of firebase database, I'll watch it.
    })
  }
  onSubmit() {
    if(this.material.name != "" && this.material.definition != "" && this.material.img != "") {
      console.log(this.material);
      this.materialService.addMaterial(this.material);
      this.material.name = "";
      this.material.definition = "";
      this.material.img = "";
      this.material.isFinalMaterial = false;
      this.material.isStartingMaterial = false;
    } 
  }
  deleteMaterial(event, material: Material) {
    this.clearState();
    this.materialService.deleteMaterial(material);
  }
  editMaterial(event, material: Material) {
    this.editState = true;
    this.materialToEdit = material;
  }
  clearState() {
    this.editState = false;
    this.materialToEdit = null;
  }
  updateMaterial(material: Material) {
    this.materialService.updateMaterial(material);
    this.clearState();
  }
}

// 
// make "" not be able to be submitted to add to newCurrentMaterials
// show goal material under current matierials
// show product formed underneath reactants.
// completion toast
// failure toast

// on this page, lets use the databse to submit new items to available products.

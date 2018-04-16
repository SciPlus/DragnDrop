// for a future update, maybe consider adding different mole ratios of substances to produce other substances. 
// for now, any number of the substances will combine.
// request for lab. 
// teacher 
// teacher in class 103, 103 is over
// institution makes 
// password for each period. 
// id/password --> access lab. Control for the teacher.
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Tab } from 'ionic-angular/components/tabs/tab';
import {DndModule} from 'ng2-dnd';
import { HomePage } from '../home/home';
import { SubmitPage } from '../submit/submit';
import { AngularFireAuth } from 'angularfire2/auth';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../app/models/Material'

@IonicPage()
@Component({
    selector: 'page-talia',
    templateUrl: 'talia.html',
  })
  export class TaliaPage {
    materials: Material[];
    email: string;
    buttonClicked = false;
    ingred: Object;
    countOfComboElements: number = 0;
    addedItem: object = {};
    helperText1: string = "";
    helperText2: number = 0;
    newComboCreated: boolean = false;
    toDos: Array<any> = [{
      task: "Clean Room",
      duration: 30,
      definition: "thing that exists"
    }, 
    {
      task: "Go To Grocery Store", 
      duration: 25,
      definition: "other that exists"

    }, {
      task: "Do Homework",
      duration: 45,
      definition: "other other thing that exists"

    }];
    countOfFoundElements: number = 0;
    availableProducts: Array<Product> = [];
    Reaction_Components1: Array<Product> = [];    
    combinations: Array<any> = [];
      
    constructor(private materialService: MaterialService, private fire: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
      this.email = fire.auth.currentUser.email;
      this.availableProducts.push(new Product(1, 2, true, false, 'heat', true, "applying heat", "assets/imgs/fire.jpg"));
      this.availableProducts.push(new Product(1, 3, true, false, 'coffee', true, "cold coffee", "assets/imgs/cold_coffee.png"));
      this.availableProducts.push(new Product(1, 4, true, false,  'hot coffee', false, "combination of heat and coffee", "assets/imgs/hot_coffee.png"));
      this.availableProducts.push(new Product(1, 1, true, false,  'magnesium sulfate', true, "drying agent", "assets/imgs/magnesium_sulfate.png"));
      this.availableProducts.push(new Product(1, 4, true, false,  'dichloromethane', true, "hexane...", "assets/imgs/dichloromethane.png"));
      this.availableProducts.push(new Product(1, 4, true, false, 'in separatory funnel', true, "stuff going inside of the separatory funnel", "assets/imgs/separatoryFunnel.png"));
      this.availableProducts.push(new Product(1, 4,true, false, 'filter separatory funnel', true, "action of filtering", "assets/imgs/filter.jpeg"));
      this.availableProducts.push(new Product(1, 4, false, false, 'hot coffee in separatory funnel', false, "coffee inside of the separatory", "assets/imgs/hot_coffee_in_funnel.jpeg"));
      this.availableProducts.push(new Product(1, 2, false, false,'hot coffee and dichloromethane mixture', false, "coffee and dichloromethane in separatory funnel", "assets/imgs/mixture_in_funnel.jpeg"));
      this.availableProducts.push(new Product(1, 2, false, false,'dichloromethane in separatory funnel', false, "dichloromethane alone in separatory funnel", "assets/imgs/dichloromethane_in_funnel.jpg"));
      this.availableProducts.push(new Product(1, 2, false, false, 'filter out dichloromethane', false, "filtering only the dichloromethane out of the separatory funnel after adding coffee and dichloromethane", "assets/imgs/filter_out_dichloromethane.jpeg"));
      this.availableProducts.push(new Product(1, 2, false, false,'dichloromethane and caffeine mixture', false, "mixture extracted from the separatory funnel", "assets/imgs/like_dissolves_like.jpg"));
      this.availableProducts.push(new Product(1, 2, false, true, 'caffeine residue!', false, "final product", "assets/imgs/caffeine.png"));
      this.checkIfAdding();
      this.getCombos();
    }
    getCombos() {
      this.combinations = [{
        ingredients: [
            this.availableProducts.filter(element => element.name === "heat")[0],
            this.availableProducts.filter(element => element.name === "coffee")[0],
          ],
        result: this.availableProducts.filter(element => element.name === "hot coffee")[0]
      }, {
        ingredients: [
         this.availableProducts.filter(element => element.name === "hot coffee")[0],
          this.availableProducts.filter(element => element.name === "in separatory funnel")[0],
        ],
        result: this.availableProducts.filter(element => element.name === "hot coffee in separatory funnel")[0],
      }, {
        ingredients: [
            this.availableProducts.filter(element => element.name === "dichloromethane")[0],
            this.availableProducts.filter(element => element.name === "in separatory funnel")[0],
        ],
        result: this.availableProducts.filter(element => element.name === "dichloromethane in separatory funnel")[0],
      },{
        ingredients: [
            this.availableProducts.filter(element => element.name === "hot coffee in separatory funnel")[0],
            this.availableProducts.filter(element => element.name === "dichloromethane in separatory funnel")[0],
        ],
        result: this.availableProducts.filter(element => element.name === "hot coffee and dichloromethane mixture")[0],
      }, {
          ingredients: [
              this.availableProducts.filter(element => element.name === "hot coffee and dichloromethane mixture")[0],
              this.availableProducts.filter(element => element.name === "filter out dichloromethane")[0],
          ],
          result: this.availableProducts.filter(element => element.name === "dichloromethane and caffeine mixture")[0],
      }, {
        ingredients: [
            this.availableProducts.filter(element => element.name === "filter separatory funnel")[0],
            this.availableProducts.filter(element => element.name === "dichloromethane")[0],
        ],
        result: this.availableProducts.filter(element => element.name === "filter out dichloromethane")[0],
    }, {
      ingredients: [
          this.availableProducts.filter(element => element.name === "dichloromethane and caffeine mixture")[0],
          this.availableProducts.filter(element => element.name === "magnesium sulfate")[0],
      ],
      result: this.availableProducts.filter(element => element.name === "caffeine residue!")[0],
  }]
    }
    openSubmitPage() {
      this.navCtrl.push(SubmitPage);
    }
    findAvailableProduct(myResult: string) {
      this.availableProducts.forEach(element => {
        if (element.name === myResult) {
          element.isFound = true;
        }
      });
    }

    checkCombo() { // checks if elements form combo
      var avagred: Product;

      if(this.Reaction_Components1.length >= 2) {
      this.combinations.forEach(combo => {
        if (((this.Reaction_Components1[0].name === combo.ingredients[0].name) || (this.Reaction_Components1[0].name === combo.ingredients[1].name)) && ((this.Reaction_Components1[1].name === combo.ingredients[0].name) || (this.Reaction_Components1[1].name === combo.ingredients[1].name))) {
          this.findAvailableProduct(combo.result.name);
          console.log("findAvailableProduct has been called");
          if (combo.result.isFinalProduct === true) {
            this.completionMessage();
          }
        }
      })
    }
  }
    checkIfAdding() {
      this.availableProducts.forEach(availableProduct => {
        if (availableProduct.isFound === true) {
          console.log(availableProduct.name);
        }
      });
    }
    clearComponents() {
      this.Reaction_Components1 = [];
    }
    failToCombineMessage() {
      var f = document.getElementById("failureMessage");
        f.className = "show";
        setTimeout(function(){ f.className = f.className.replace("show", ""); }, 3000);
    }
    completionMessage() {
      var z= document.getElementById("completionMessage");
        z.className = "reveal";
        setTimeout(function(){ z.className = z.className.replace("reveal", ""); }, 3000);
    }
    combineMessage() {
      var s = document.getElementById("successMessage");
      s.className = "display";
      setTimeout(function() { s.className = s.className.replace("display", "");}, 3000);
    }
    allowDropFunction(baseInteger: string): any {
      return (dragData: any) => this.Reaction_Components1.length <= 1;
  }
    addToReactionComponents1($event: any) {
      let newMaterial: Product = $event.dragData;
      for (let indx in this.Reaction_Components1) {
          let product: Product = this.Reaction_Components1[indx];
          if (product.name === newMaterial.name) {
              product.quantity++;
              return;
          }
      }
      this.Reaction_Components1.push(new Product(newMaterial.quantity, newMaterial.coefficient, newMaterial.isStartingMaterial, newMaterial.isFinalMaterial, newMaterial.name, newMaterial.isFound, newMaterial.definition, newMaterial.img));
      this.Reaction_Components1.sort((a: Product, b: Product) => {
          return a.name.localeCompare(b.name);
      });
    }

    totalCost(): number {
      let cost: number = 0;
      for (let indx in this.Reaction_Components1) {
          let product: Product = this.Reaction_Components1[indx];
          cost += (product.coefficient * product.quantity);
      }
      return cost;
    }
    showInfo() {
      this.toDos.forEach(toDo => {
        console.log(toDo.task + " for " + toDo.duration + " mins");
      });
    }
    add() {
      this.toDos.push({ ...this.addedItem });
    }
    delete() {
      this.toDos.pop();
    }
    ngOnInit() {
      // getting materials from database (calling getMaterials function)
      this.materialService.getMaterials().subscribe(materials =>{
          console.log(materials);
          this.materials = materials;
          // setting our materials to the materials in the database
          // I wonder if there is a way to sort these materials in starting materials and so on based on properties of theirs. Maybe, according to the 3rd video of firebase database, I'll watch it.
      })
    }
  }
  export class Product {
    constructor(public quantity: number, public coefficient: number,public isStartingMaterial: boolean, public isFinalMaterial: boolean,  public name: string, public isFound: boolean, public definition: string, public img: string) {
      this.name = name;
    }
  }
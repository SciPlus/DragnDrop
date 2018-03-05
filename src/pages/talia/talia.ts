import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Tab } from 'ionic-angular/components/tabs/tab';
import {DndModule} from 'ng2-dnd';

// Want to figure out on Tuesday from Help Lab: 
// 1. How to input another item to add to list in object form.
// 2. How to show to - do list items in list.

@Component({
    selector: 'page-talia',
    templateUrl: 'talia.html',
  })
  export class TaliaPage {

    buttonClicked = false;
    addedItem: object = {};
    helperText1: string = "";
    helperText2: number = 0;
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
    availableProducts: Array<Product> = [];
    Reaction_Components1: Array<Product> = [];
    Reaction_Components2: Array<Product> = [];

    
  
// addToBasket --> addToReaction
    
    constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.showInfo();
      this.availableProducts.push(new Product(1, 2, 'heat', true, "applying heat", "assets/imgs/fire.jpg"));
      this.availableProducts.push(new Product(1, 3, 'coffee', true, "cold coffee", "assets/imgs/cold_coffee.png"));
      this.availableProducts.push(new Product(1, 4,  'hot coffee', false, "combination of heat and coffee", "assets/imgs/hot_coffee_in_funnel.jpeg"));
      this.availableProducts.push(new Product(1, 1,  'magnesium', true, "drying agent", "assets/imgs/magnesium_sulfate.png"));
    }
    allowDropFunction(baseInteger: string): any {
      return (dragData: any) => this.Reaction_Components1.length <= 1;
  }
    addToBasket($event: any) {
      let newMaterial: Product = $event.dragData;
      for (let indx in this.Reaction_Components1) {
          let product: Product = this.Reaction_Components1[indx];
          if (product.name === newMaterial.name) {
              product.quantity++;
              return;
          }
      }
      this.Reaction_Components1.push(new Product(newMaterial.quantity, newMaterial.coefficient, newMaterial.name, newMaterial.isFound, newMaterial.definition, newMaterial.img));
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
  }
  export class Product {
    constructor(public quantity: number, public coefficient: number,  public name: string, public isFound: boolean, public definition: string, public img: string) {}
  }


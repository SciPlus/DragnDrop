import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Tab } from 'ionic-angular/components/tabs/tab';
import { DragulaModule } from '../../../node_modules/ng2-dragula/ng2-dragula';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  combo: any;
  finalProduct: string = "";
  currentMaterials: Array<any> = [{
    typeOfMaterial: "heat",
    isNew: false,
    isFound: true,
    png: "assets/imgs/fire.jpg",
  }, 
  {
    typeOfMaterial: "coffee",
    isNew: false,
    isFound: true,
    png: 'assets/imgs/cold_coffee.png',

  }, {
    typeOfMaterial: "magnesium sulfate",
    isNew: false,
    isFound: true,
    png: "assets/imgs/magnesium_sulfate.png",
  }, {
    typeOfMaterial: "dichloromethane",
    isNew: false,
    isFound: true,
    png: "assets/imgs/dichloromethane.png",
  }, {
    typeOfMaterial: "in separatory funnel",
    isNew: false,
    isFound: true,
    png: "assets/imgs/separatoryFunnel.png",
  }, {
    typeOfMaterial: "filter separatory funnel",
    isNew: false,
    isFound: true,
    png: "assets/imgs/filter.jpeg",
  
  }, {
    typeOfMaterial: "hot coffee",
    isNew: true,
    isFound: false,
    png: "assets/imgs/hot_coffee.png"
  }, {
    typeOfMaterial: "hot coffee in separatory funnel",
    isNew: true,
    isFound: false,
    png: "assets/imgs/hot_coffee_in_funnel.jpeg"
  }, {
    typeOfMaterial: "hot coffee and dichloromethane mixture",
    isNew: true,
    isFound: false,
    png: 'assets/imgs/mixture_in_funnel.jpeg'
  }, {
    typeOfMaterial: "dichloromethane in separatory funnel",
    isNew: true,
    isFound: false,
    png: "assets/imgs/dichloromethane_in_funnel.jpg"
  }, {
    typeOfMaterial: "filter out dichloromethane",
    isNew: true,
    isFound: false,
    png: "assets/imgs/filter_out_dichloromethane.jpeg"
  }, {
    typeOfMaterial: "dichloromethane and caffeine mixture",
    isNew: true,
    isFound: false,
    png: "assets/imgs/like_dissolves_like.jpg"
  }, {
    typeOfMaterial: "caffeine residue!", 
    isNew: true,
    isFound: false,
    png: "assets/imgs/caffeine.png"
  }
];
  newCurrentMaterials: Array<any> = [];
  reactant1: string = "";
  reactant2: string = "";
  isAccessibleCombo = false;
  countOfExistingCombos: number = 0;
  bothInCurrentMaterials = false;
  bothInNewCurrentMaterials = false;
  oneInEach = false;
  countOfFoundElements: number = 0;
  helperText = "Enter Final Product";
  combinations: Array<any> = [{
    ingredients: new Set(["heat", "coffee"]),
    result: "hot coffee",
  }, {
    ingredients: new Set(["hot coffee", "in separatory funnel"]),
    result: "hot coffee in separatory funnel"
  }, {
    ingredients: new Set(["dichloromethane", "in separatory funnel"]),
    result: "dichloromethane in separatory funnel"
  }, {
    ingredients: new Set(["hot coffee in separatory funnel", "dichloromethane in separatory funnel"]),
    result: "hot coffee and dichloromethane mixture"
  }, {
    ingredients: new Set(["hot coffee and dichloromethane mixture", "filter out dichloromethane"]),
    result: "dichloromethane and caffeine mixture"
  }, {
    ingredients: new Set(["filter separatory funnel", "dichloromethane"]),
    result: "filter out dichloromethane"
  }, {
    ingredients: new Set(["dichloromethane and caffeine mixture", "magnesium sulfate"]),
    result: "caffeine residue!"
  }];
  newComboCreated = false;

  constructor(public navCtrl: NavController) {
  };
  showMessages() {
    if (this.countOfExistingCombos === 1) {
      this.newComboCreated = true;
      this.combineMessage();
    }
    else if (this.countOfExistingCombos === 0) {
      this.newComboCreated = false;
      this.failToCombineMessage();
    }
  }
  console() {
    this.currentMaterials.forEach(currentMaterial => {
      console.log(`${currentMaterial.typeOfMaterial }is found? ${currentMaterial.isFound}`);
    });
  }
  saveFinalProduct() {
    this.helperText = "Determining Final Product Through Reactions";
  }
  checkCombo() {
    // checks each combination and displays product if necessary, and sends message to console if experiment finished.
    if (this.isAccessibleCombo == true) {
      // going through each combo, testing if equivalent to user input. (Array --> in order)
      this.combinations.forEach(combo => {
        if (combo.ingredients.has(this.reactant1) && combo.ingredients.has(this.reactant2)) {
          // if the currentMaterial.typeOfMaterial === combo.result, change the isFound of the current Material to true;
            this.currentMaterials.forEach(element => {
              if (element.typeOfMaterial === combo.result) {
                element.isFound = true;
              }
            });
          this.countOfExistingCombos = this.countOfExistingCombos + 1;
            if(combo.result == this.finalProduct) {
              // I'll change this later to something better.
              this.helperText = "You have finished the experiment!"
            }
        } else {
          console.log("This combination is not equivalent to user's combination.")
        }
      });
      console.log(this.countOfExistingCombos);
      this.showMessages();
    }
    else {
      console.log("You cannot attempt to combine these materials, they are not both current materials.");
    }
  }
  // see if items to combine are current materials
  checkIfCanCombine() {
    this.newComboCreated = false;
    this.countOfExistingCombos = 0;
    // item in list have typeOf which is this string?
    // check array, if it has one of the reactants, increment count by 1, increment again by 1
    // if count is >= 2, reactants are in list.
    this.currentMaterials.forEach(element => {
      if(element.typeOfMaterial === this.reactant1) {
        this.countOfFoundElements = this.countOfFoundElements + 1;
        console.log("found reactant1");
      } else if(element.typeOfMaterial === this.reactant2) {
        this.countOfFoundElements = this.countOfFoundElements + 1;
        console.log("found reactant2");
      }
    })
    if (this.countOfFoundElements >= 2) {
      this.isAccessibleCombo = true;
      console.log(this.isAccessibleCombo + '(accessible)');
    }
    else {
      this.isAccessibleCombo = false;
      console.log(this.isAccessibleCombo + '(accessible)')
    }
    this.countOfFoundElements = 0;
  }
  failToCombineMessage() {
    var f = document.getElementById("failureMessage");
      f.className = "show";
      setTimeout(function(){ f.className = f.className.replace("show", ""); }, 3000);
  }
  combineMessage() {
    var s = document.getElementById("successMessage");
    s.className = "display";
    setTimeout(function() { s.className = s.className.replace("display", "");}, 3000);
  }
}

export class Material{
  typeOfMaterial: string = "";
  isNew: boolean = false;

  Material() {
      this.typeOfMaterial = "test";
  }
}
// make "" not be able to be submitted to add to newCurrentMaterials
// show goal material under current matierials
// show product formed underneath reactants.
// completion toast
// failure toast

import React, { Component } from 'react';
import { render } from 'react-dom';
import {DataService} from './DataService';
import {RecipeData} from './DataService';
import {MockDataService} from './MockDataService';
import {DataServiceImpl} from './DataServiceImpl';
import {RecipeGrid} from './RecipeGrid';
import * as APIConstants from './APIConstants.js';
import './css/recipe.css';


interface AppProps { }
interface AppState {
  recipes: RecipeData[],
  error: string,
}

class App extends Component<AppProps, AppState> {
  service : DataService;

  constructor(props : AppProps) {
    super(props);
    this.updateRecipes = this.updateRecipes.bind(this);
    this.reportError = this.reportError.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.editRecipe = this.editRecipe.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
    this.getNameForID = this.getNameForID.bind(this);
    this.fetchRecipes = this.fetchRecipes.bind(this);
    if (APIConstants.consts.isMock)
    {
      this.service = new MockDataService();
    }
    else
    {
      this.service = new DataServiceImpl()
    }
    this.state = {
      recipes: [],
      error: ''
    };
  }

  componentDidMount()
  {
    this.fetchRecipes();
  }

  render() {
    let comp;
    comp = <RecipeGrid recipes={this.state.recipes} deleteRecipeFromSvr={this.deleteRecipe} editRecipe={this.editRecipe} addRecipe={this.addRecipe} fetchRecipes={this.fetchRecipes} getNameForID={this.getNameForID}  />

    return (
      <div>
      {comp}
      <div>{this.state.error}</div>
      </div>
    );
  }

  updateRecipes(recipes: RecipeData[])
  {
    this.setState({recipes: recipes, error: ''});
  }

  reportError(error : Error)
  {
    this.setState({error: error.message});
  }

  deleteRecipe(recipeName : string)
  {
    let recipes = this.state.recipes.filter(e => e.name !== recipeName);
    if (recipes.length !== this.state.recipes.length)
    {
      this.service.deleteRecipe(recipeName)
        .then(this.updateRecipes).catch(this.reportError);
      this.setState({recipes: recipes});
    }
  }

  editRecipe(recipeData : RecipeData)
  {
    let data = [ ...this.state.recipes];
    for (let i = 0; i < data.length; i++)
    {
      if (data[i].name === recipeData.name)
      {
        data[i] = recipeData;
        break;
      }
    }
    this.service.editRecipe(recipeData.name, recipeData)
      .then(this.updateRecipes).catch(this.reportError);
    this.setState( { recipes: data});
  }

  addRecipe(recipeData : RecipeData)
  {
    let data = [ ...this.state.recipes];
    data.push(recipeData);
    this.service.addRecipe(recipeData.name, recipeData)
      .then(this.updateRecipes).catch(this.reportError);
    this.setState( { recipes: data});
  }

  fetchRecipes()
  {
    this.service.getRecipes().then(this.updateRecipes).catch(this.reportError);
  }

  getNameForID(id: string)
  {
    return this.service.getNameForID(id);
  }
}

render(<App />, document.getElementById('recipeRoot'));

// APIConstants.EXT_CALLBACK_REGISTRY['setQueryMode'](true);
// APIConstants.EXT_CALLBACK_REGISTRY['setSelectCB']( (e: string) => console.log("Select : " + e));

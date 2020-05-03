import React, { Component } from 'react';
import { render } from 'react-dom';
import {DataService} from './DataService';
import {RecipeData} from './DataService';
import {MockDataService} from './MockDataService';
import {DataServiceImpl} from './DataServiceImpl';
import {RecipeGrid} from './RecipeGrid';
import './css/kitchen.css';


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
    if (process.env.REACT_APP_MOCK)
    {
      this.service = new MockDataService();
    }
    else
    {
      this.service = new DataServiceImpl();
    }
    this.state = {
      recipes: [],
      error: ''
    };
  }

  componentDidMount()
  {
    this.service.getRecipes().then(this.updateRecipes).catch(this.reportError);
  }

  render() {
    let comp;
    comp = <RecipeGrid recipes={this.state.recipes} deleteRecipeFromSvr={this.deleteRecipe} editRecipe={this.editRecipe} addRecipe={this.addRecipe}  />

    return (
      <div>
      {comp}
      <div>{this.state.error}</div>
      </div>
    );
  }

  updateRecipes(recipes: RecipeData[])
  {
    this.setState({recipes: recipes});
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
      this.service.deleteRecipe(recipeName);
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
    this.service.editRecipe(recipeData.name, recipeData);
    this.setState( { recipes: data});
  }

  addRecipe(recipeData : RecipeData)
  {
    let data = [ ...this.state.recipes];
    data.push(recipeData);
    this.service.addRecipe(recipeData.name, recipeData);
    this.setState( { recipes: data});
  }


}

render(<App />, document.getElementById('recipeRoot'));

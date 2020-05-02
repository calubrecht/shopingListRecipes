import React, { Component } from 'react';
import { render } from 'react-dom';
import {Hello} from './Hello';
import {RecipeCard} from './RecipeCard';
import {DataService} from './DataService';
import {RecipeData} from './DataService';
import {MockDataService} from './MockDataService';
import {DataServiceImpl} from './DataServiceImpl';
import MuuriGrid from 'react-muuri';
import * as utils from './utils';
import './css/kitchen.css';


interface AppProps { }
interface AppState {
  name: string,
  recipes: RecipeData[],
  error: string
}

class App extends Component<AppProps, AppState> {
  service : DataService;
  grid : any;
  gridElement : any;

  constructor(props : AppProps) {
    super(props);
    this.updateRecipes = this.updateRecipes.bind(this);
    this.reportError = this.reportError.bind(this);
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.addToGrid = this.addToGrid.bind(this);
    this.removeFromGrid = this.removeFromGrid.bind(this);
    if (process.env.REACT_APP_MOCK)
    {
      this.service = new MockDataService();
    }
    else
    {
      this.service = new DataServiceImpl();
    }
    this.state = {
      name: 'React',
      recipes: [],
      error: ''
    };
  }

  componentDidMount () {
    this.grid = new MuuriGrid({
      node: this.gridElement,
      defaultOptions: {
        dragEnabled: true,
        dragStartPredicate: function (item : any, e : any, options:any)
        {
          if (e.target.className === 'cardTitle')
          {
            return utils.defaultStartPredicate(item, e, options);
          }
          return false;
        }
      },
    });

    this.grid.getEvent('dragEnd');
    this.service.getRecipes().then(this.updateRecipes).catch(this.reportError);
  }

  componentWillUnmount () {
    this.grid.getMethod('destroy');
  }

  render() {
    return (
      <div>
        <Hello name={this.state.name} />
        <div ref={gridElement => this.gridElement = gridElement}>
        {this.state.recipes.map( (recipeData : RecipeData) => this.renderCard(recipeData))}
        </div>
        <div>{this.state.error}</div>
      </div>
    );
  }

  renderCard(recipe : RecipeData)
  {
     return (
      <RecipeCard
        key={recipe.name}
        recipeData={recipe}
        onMount={ this.addToGrid }
        onUnMount={ this.removeFromGrid }
        onDelete={ this.deleteRecipe} />);
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

  addToGrid(component : any)
  {
    this.grid.getMethod('add', [component], {isActive:true});
  }
  
  removeFromGrid(component : any)
  {
    this.grid.getMethod('remove', [component], {removeElements:false});
  }
}

render(<App />, document.getElementById('recipeRoot'));

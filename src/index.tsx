import React, { Component } from 'react';
import { render } from 'react-dom';
import {Hello} from './Hello';
import {RecipeCard} from './RecipeCard';
import {DataService} from './DataService';
import {RecipeData} from './DataService';
import {MockDataService} from './MockDataService';
import './css/kitchen.css';

interface AppProps { }
interface AppState {
  name: string,
  recipes: RecipeData[]
}

class App extends Component<AppProps, AppState> {
  service : DataService;

  constructor(props : AppProps) {
    super(props);
    this.updateRecipes = this.updateRecipes.bind(this);
    this.service = new MockDataService();
    this.state = {
      name: 'React',
      recipes: []
    };
  }

  render() {
    return (
      <div>
        <Hello name={this.state.name} />
        {this.state.recipes.map( (recipeData : RecipeData) => <RecipeCard key={recipeData.name} recipeData={recipeData}/> )}
      </div>
    );
  }

  componentDidMount()
  {
    this.service.getRecipes().then(this.updateRecipes);
  }

  updateRecipes(recipes: RecipeData[])
  {
    this.setState({recipes: recipes});
  }
}

render(<App />, document.getElementById('recipeRoot'));

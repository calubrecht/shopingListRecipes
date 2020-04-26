import React, { Component } from 'react';
import { render } from 'react-dom';
import {Hello} from './Hello';
import {RecipeCard} from './RecipeCard';
import {DataService} from './DataService';
import {RecipeData} from './DataService';
import {MockDataService} from './MockDataService';
import {DataServiceImpl} from './DataServiceImpl';
import './css/kitchen.css';

interface AppProps { }
interface AppState {
  name: string,
  recipes: RecipeData[],
  error: string
}

class App extends Component<AppProps, AppState> {
  service : DataService;

  constructor(props : AppProps) {
    super(props);
    this.updateRecipes = this.updateRecipes.bind(this);
    this.reportError = this.reportError.bind(this);
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

  render() {
    return (
      <div>
        <Hello name={this.state.name} />
        {this.state.recipes.map( (recipeData : RecipeData) => <RecipeCard key={recipeData.name} recipeData={recipeData}/> )}
        <div>{this.state.error}</div>
      </div>
    );
  }

  componentDidMount()
  {
    this.service.getRecipes().then(this.updateRecipes).catch(this.reportError);
  }

  updateRecipes(recipes: RecipeData[])
  {
    this.setState({recipes: recipes});
  }

  reportError(error : Error)
  {
    this.setState({error: error.message});
  }
}

render(<App />, document.getElementById('recipeRoot'));

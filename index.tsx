import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import {RecipeCard} from './RecipeCard';
import {DataService} from './DataService';
import {MockDataService} from './MockDataService';
import './css/kitchen.css';

interface AppProps { }
interface AppState {
  name: string,
  recipes: string[]
}

class App extends Component<AppProps, AppState> {
  service : DataService;

  constructor(props) {
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
        <RecipeCard text={this.state.recipes[0]}/>
        <RecipeCard text={this.state.recipes[1]}/>
      </div>
    );
  }

  componentDidMount()
  {
    this.service.getRecipes().then(this.updateRecipes);
  }

  updateRecipes(recipes: string[])
  {
    this.setState({recipes: recipes});
  }
}

render(<App />, document.getElementById('root'));

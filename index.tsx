import React, { Component } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import RecipeCard from './RecipeCard';
import RecipeProps from './RecipeCard';
import MockDataService from './MockDataService';
import './css/kitchen.css';

interface AppProps { }
interface AppState {
  name: string,
  recipes: string[]
}

class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.service = new MockDataService();
    this.state = {
      name: 'React',
      recipes: ['This is a recipe', 'This is a better recipe']
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
}

render(<App />, document.getElementById('root'));

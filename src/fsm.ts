'use strict';

class Machine {
  context: any;
  _stateTransitions: Object;
  _stateTransitionsAny: Object;
  _defaultTransition: any;
  _initialState: any;
  _currentState: any;

  constructor(context){
    this.context = context;
    this._stateTransitions = {};
    this._stateTransitionsAny = {};
    this._defaultTransition = null;
    this._initialState = null;
    this._currentState = null;
  }

  addTransition( action:string, state:string, nextState:string, callback:any){
    if(!nextState){
      nextState = state;
    }
    return this._stateTransitions[[action,state].toString()] = [nextState, callback];
  }
  addTransitions( actions: Array<string>, state: string, nextState: string, callback: any){
    if(!nextState){
      nextState = state;
    }
    actions.forEach( action => this.addTransition(action, state, nextState, callback) );
  }
  addTransitionAny( state: string, nextState:string, callback: any ){
    if(!nextState){
      nextState = state;
    }
    this._stateTransitionsAny[state] = [nextState, callback];
  }
  setDefaultTransition( state: string, callback: any ){
    this._defaultTransition = [state, callback];
  }
  getTransition(action: string, state: string){
    var actionState = [action, state].toString();
    if( this._stateTransitions[actionState] ){
      return this._stateTransitions[actionState]
    } else if( this._stateTransitionsAny[state] ){
      return this._stateTransitionsAny[state];
    }else if( this._defaultTransition ){
      return this._defaultTransition;
    }
    throw new Error('Transition is undefined: ("'+ action + ", " + state + ")");
  }
  getCurrentState(){
    return this._currentState;
  }
  setInitialState(state:string){
    this._initialState = state;
    if(!this._currentState){
      return this.reset();
    }
  }
  reset(){
    this._currentState = this._initialState;
  }
  process(action:string){
    // process action
    let result = this.getTransition(action, this._currentState);

    // call any associated callback
    if(result[1]){
      result[1].call(this.context || (this.context = this), action);
    }

    // transition to next state
    return this._currentState = result[0];
  }
}

let FSM = {
  machine: Machine
}
export = FSM;

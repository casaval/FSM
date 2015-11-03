'use strict';
var Machine = (function () {
    function Machine(context) {
        this.context = context;
        this._stateTransitions = {};
        this._stateTransitionsAny = {};
        this._defaultTransition = null;
        this._initialState = null;
        this._currentState = null;
    }
    Machine.prototype.addTransition = function (action, state, nextState, callback) {
        if (!nextState) {
            nextState = state;
        }
        return this._stateTransitions[[action, state].toString()] = [nextState, callback];
    };
    Machine.prototype.addTransitions = function (actions, state, nextState, callback) {
        var _this = this;
        if (!nextState) {
            nextState = state;
        }
        actions.forEach(function (action) { return _this.addTransition(action, state, nextState, callback); });
    };
    Machine.prototype.addTransitionAny = function (state, nextState, callback) {
        if (!nextState) {
            nextState = state;
        }
        this._stateTransitionsAny[state] = [nextState, callback];
    };
    Machine.prototype.setDefaultTransition = function (state, callback) {
        this._defaultTransition = [state, callback];
    };
    Machine.prototype.getTransition = function (action, state) {
        var actionState = [action, state].toString();
        if (this._stateTransitions[actionState]) {
            return this._stateTransitions[actionState];
        }
        else if (this._stateTransitionsAny[state]) {
            return this._stateTransitionsAny[state];
        }
        else if (this._defaultTransition) {
            return this._defaultTransition;
        }
        throw new Error('Transition is undefined: ("' + action + ", " + state + ")");
    };
    Machine.prototype.getCurrentState = function () {
        return this._currentState;
    };
    Machine.prototype.setInitialState = function (state) {
        this._initialState = state;
        if (!this._currentState) {
            return this.reset();
        }
    };
    Machine.prototype.reset = function () {
        this._currentState = this._initialState;
    };
    Machine.prototype.process = function (action) {
        var result = this.getTransition(action, this._currentState);
        if (result[1]) {
            result[1].call(this.context || (this.context = this), action);
        }
        return this._currentState = result[0];
    };
    return Machine;
})();
var FSM = {
    Machine: Machine
};
module.exports = FSM;

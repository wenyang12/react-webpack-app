import 'babel-core/polyfill';
import React from 'react';
import { render } from 'react-dom';
import FastClick from 'fastclick';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import HelloWorld from './components/HelloWorld';

function fetch() {}

function bootstrap() {
    // Make taps on links and buttons work fast on mobiles
    if (FastClick.attach) {
        FastClick.attach(document.body);
    } else {
        FastClick(document.body);
    }
  
    render(
        (<Router history={hashHistory}>
            <Route path="/" onEnter={fetch}>
                <IndexRoute component={HelloWorld} />
            </Route>
        </Router>), document.getElementById('react_container')
    );
}

// Run the application when both DOM is ready and page content is loaded
if (['complete', 'loaded', 'interactive'].includes(document.readyState) && document.body) {
    bootstrap();
} else {
    document.addEventListener('DOMContentLoaded', bootstrap, false);
}

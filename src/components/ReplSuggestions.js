import React from 'react';
import _ from 'lodash';
import ReplSuggestionStore from '../stores/ReplSuggestionStore';
import Reflux from 'reflux';
import md5 from 'md5';
import {EOL} from 'os';
import ReplType from '../common/ReplType';
import ReplConstants from '../constants/ReplConstants';

export default class ReplSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      component: null
    };
    this.onStateChange = this.onStateChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = ReplSuggestionStore.listen(this.onStateChange);
    window.addEventListener('keydown', this.onKeyDown, false);
  }

  componentWillUnmount() {
    this.unsubscribe();
    window.removeEventListener('keydown', this.onKeyDown, false);
  }

  onKeyDown(e) {
    console.log(e)
    if(e.which === ReplConstants.KEY_ESCAPE) {
      this.setState({
        component: null
      });
    } else if(e.keyIdentifier === 'Down') {

    }
  }

  onStateChange(data) {
    // console.log(suggestions, 'repl suggestions')
    let {suggestions, input} = data;
    suggestions = _.map(suggestions, (suggestion) => {
      let lines = input.split(EOL);
      let lastLine = lines[lines.length - 1];
      let expect = suggestion.text.replace(lastLine, '');
      return {
        key: md5(suggestion.text),
        type: ReplType.getTypeName(suggestion.type),
        typeHint: ReplType.getTypeNameShort(suggestion.type),
        expect: expect,
        input: lastLine,
      };
    });

    let component = null

    if(suggestions.length)
      component =
        <ol className='repl-prompt-suggestion-list'>
          {
            _.map(suggestions, (suggestion, idx) => {
              return (
                <li className='repl-prompt-suggestion' data-index={idx} key={suggestion.key} >
                  <span className='repl-prompt-suggestion-type' title={suggestion.type}>
                    {suggestion.typeHint}
                  </span>
                  <span className='repl-prompt-suggestion-text'>
                    <span className='repl-prompt-suggestion-highlight'>{suggestion.input}</span>
                    <span className='repl-prompt-suggestion-expect'>{suggestion.expect}</span>
                  </span>
                </li>
              );
            })
          }
        </ol>

    this.setState({
      component: component
    });
  }

  //TODO: fix show/hide dummy span
  render() {
    console.log(this.state.component)
    return (
      <div className='repl-prompt-suggestion-wrapper'> {this.state.component} </div>
    );
  }
}

import React, { Component } from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/ext/language_tools';
import 'brace/mode/c_cpp';
import 'brace/theme/tomorrow';

class CodeEditor extends Component {
  onChange = (newValue: string) => {
    console.log('change', newValue);
  };

  render() {
    return (
      <div className="code-edit-ui">
        <div className="ui segment code-editor">
          <AceEditor
            mode="c_cpp"
            theme="tomorrow"
            onChange={this.onChange}
            name="cpp-code-editor"
            editorProps={{ $blockScrolling: Infinity }}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={`#include <stdio.h>`}
            width="100%"
            setOptions={{
              showLineNumbers: true,
              enableLiveAutocompletion: true,
              enableBasicAutocompletion: true,
              tabSize: 2,
            }}
          />
          <button className="ui primary button">Submit</button>
          <button className="ui button">Give up</button>
        </div>
      </div>
    );
  }
}

export default CodeEditor;

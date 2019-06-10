import React, { Component } from 'react';

import brace from 'brace';
import AceEditor from 'react-ace';
import { QuestionStatus } from '../constants';

import 'brace/ext/language_tools';
import 'brace/mode/c_cpp';
import 'brace/theme/tomorrow';

export interface ICodeEditorProps {
  onSourceCodeChange: (value: string, event: any) => void;
  question: any;
  onCancel: () => void;
  onSubmit: () => void;
}

class CodeEditor extends Component<ICodeEditorProps, {}> {
  renderTestTableRows = () => {
    const { question } = this.props;
    return question.tests.map((test: any, index: number) => {
      let status;
      let statusClass = '';
      if (test.current === '') {
        status = <td />;
      } else if (test.isCorrect) {
        status = (
          <td>
            <i className="icon checkmark" />
            Correct
          </td>
        );
        statusClass = 'positive';
      } else {
        status = (
          <td>
            <i className="icon close" />
            Incorrect
          </td>
        );
        statusClass = 'negative';
      }

      return (
        <tr key={`test${index}`} className={statusClass}>
          <td>{test.input}</td>
          <td>{test.current}</td>
          <td>{test.output}</td>
          {status}
        </tr>
      );
    });
  };

  renderTests = () => {
    const { question } = this.props;
    return (
      <div className="tests-container">
        <div className="ui segment">
          {question.status === QuestionStatus.EVALUATE && (
            <div className="ui active inverted dimmer">
              <div className="ui text loader">Evaluating your code</div>
            </div>
          )}
          <table className="ui celled table">
            <thead>
              <tr>
                <th>Input</th>
                <th>Output</th>
                <th>Expected</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>{this.renderTestTableRows()}</tbody>
          </table>
          {question.status !== QuestionStatus.SOLVED && (
            <button className="ui primary button" onClick={this.props.onSubmit}>
              Evaluate
            </button>
          )}
          <button className="ui button" onClick={this.props.onCancel}>
            Cancel
          </button>
          {(question.status === QuestionStatus.PARTIAL ||
            question.status === QuestionStatus.SOLVED) && (
            <button className="ui orange right floated button">
              <i className="icon gift" />
              Collect reward
            </button>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { question, onSourceCodeChange } = this.props;
    return (
      <div>
        <div className="code-edit-ui">
          <div className="ui segment code-editor">
            <div className="question-text">{question.text}</div>
            <div className="ui divider" />
            <AceEditor
              mode="c_cpp"
              theme="tomorrow"
              debounceChangePeriod={500}
              onChange={onSourceCodeChange}
              name="cpp-code-editor"
              editorProps={{ $blockScrolling: Infinity }}
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={question.solution}
              width="100%"
              setOptions={{
                showLineNumbers: true,
                enableLiveAutocompletion: true,
                enableBasicAutocompletion: true,
                tabSize: 2,
              }}
            />
          </div>
        </div>
        {this.renderTests()}
      </div>
    );
  }
}

export default CodeEditor;

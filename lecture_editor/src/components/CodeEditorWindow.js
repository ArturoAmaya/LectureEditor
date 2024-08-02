// CodeEditorWindow.js

import React, { useState, useRef } from "react";

import Editor from "@monaco-editor/react";

import * as monaco from "monaco-editor";

/*{
  keywords: [
    'abstract', 'continue', 'for', 'new', 'switch', 'assert', 'goto', 'do',
    'if', 'private', 'this', 'break', 'protected', 'throw', 'else', 'public',
    'enum', 'return', 'catch', 'try', 'interface', 'static', 'class',
    'finally', 'const', 'super', 'while', 'true', 'false'
  ],

  typeKeywords: [
    'boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float'
  ],

  operators: [
    '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
    '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
    '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
    '%=', '<<=', '>>=', '>>>='
  ],

  // we include these common regular expressions
  symbols:  /[=><!~?:&|+\-*\/\^%]+/,

  // C# style strings
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [/[a-z_$][\w$]/, { cases: { '@typeKeywords': 'keyword',
        '@keywords': 'keyword',
        '@default': 'identifier' } }],
[/[A-Z][\w\$]/, 'type.identifier' ],  // to show class names nicely

// whitespace
{ include: '@whitespace' },

// delimiters and operators
[/[{}()\[\]]/, '@brackets'],
[/[<>](?!@symbols)/, '@brackets'],
[/@symbols/, { cases: { '@operators': 'operator',
   '@default'  : '' } } ],

// @ annotations.
// As an example, we emit a debugging log message on these tokens.
// Note: message are supressed during the first load -- change some lines to see them.
[/@\s*[a-zA-Z_\$][\w\$]/, { token: 'annotation', log: 'annotation token: $0' }],

// numbers
[/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
[/0[xX][0-9a-fA-F]+/, 'number.hex'],
[/\d+/, 'number'],

// delimiter: after number because of .\d floats
[/[;,.]/, 'delimiter'],

// strings
[/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
[/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],

// characters
[/'[^\\']'/, 'string'],
[/(')(@escapes)(')/, ['string','string.escape','string']],
[/'/, 'string.invalid']
],

comment: [
[/[^\/*]+/, 'comment' ],
[/\/\/,    'comment', '@push' ],    // nested comment
["\\/",    'comment', '@pop'  ],
[/[\/]/,   'comment' ]
],

string: [
[/[^\\"]+/,  'string'],
[/@escapes/, 'string.escape'],
[/\\./,      'string.escape.invalid'],
[/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
],

whitespace: [
[/[ \t\r\n]+/, 'white'],
[/\/\/,       'comment', '@comment' ],
[/\/\/.*$/,    'comment'],
],
}}*/

//monaco.editor.defineTheme;


const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");

  const editorRef = useRef(null);

  function handleEditorWillMount(monaco) {
    // here is the monaco instance
    // do something before editor is mounted
    monaco.languages.register({id:'mylang'})
    console.log('registered?')
    monaco.languages.setMonarchTokensProvider('mylang', 
      {
        // Set defaultToken to invalid to see what you do not tokenize yet
        // defaultToken: 'invalid',
      
        keywords: [
          'name', 'heygen', 'AI', 'avatar'
        ],
      
        typeKeywords: [
          'boolean', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float'
        ],
      
        operators: [
          '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
          '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
          '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
          '%=', '<<=', '>>=', '>>>='
        ],
      
        // we include these common regular expressions
        symbols:  /[=><!~?:&|+\-*\/\^%]+/,
      
        // C# style strings
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
      
        // The main tokenizer for our languages
        tokenizer: {
          root: [
            // identifiers and keywords
            [/[a-z_$][\w$]*/, { cases: { '@typeKeywords': 'keyword',
                                         '@keywords': 'keyword',
                                         '@default': 'identifier' } }],
            [/[A-Z][\w\$]*/, 'type.identifier' ],  // to show class names nicely
      
            // whitespace
            { include: '@whitespace' },
      
            // delimiters and operators
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, { cases: { '@operators': 'operator',
                                    '@default'  : '' } } ],
      
            // @ annotations.
            // As an example, we emit a debugging log message on these tokens.
            // Note: message are supressed during the first load -- change some lines to see them.
            [/@\s*[a-zA-Z_\$][\w\$]*/, { token: 'annotation', log: 'annotation token: $0' }],
      
            // numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
      
            // delimiter: after number because of .\d floats
            [/[;,.]/, 'delimiter'],
      
            // strings
            [/"([^"\\]|\\.)*$/, 'string.invalid' ],  // non-teminated string
            [/"/,  { token: 'string.quote', bracket: '@open', next: '@string' } ],
      
            // characters
            [/'[^\\']'/, 'string'],
            [/(')(@escapes)(')/, ['string','string.escape','string']],
            [/'/, 'string.invalid']
          ],
      
          comment: [
            [/[^\/*]+/, 'comment' ],
            [/\/\*/,    'comment', '@push' ],    // nested comment
           ["\\*/",    'comment', '@pop'  ],
            [/[\/*]/,   'comment' ]
          ],
      
          string: [
            [/[^\\"]+/,  'string'],
            [/@escapes/, 'string.escape'],
            [/\\./,      'string.escape.invalid'],
            [/"/,        { token: 'string.quote', bracket: '@close', next: '@pop' } ]
          ],
      
          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/,       'comment', '@comment' ],
            [/\/\/.*$/,    'comment'],
          ],
        },
      }
    );

  }

  const handleEditorChange = (value) => {
    setValue(value);
    console.log(value)
    onChange("code", value);
  };

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = monaco;
    console.log(editorRef.current)
    editor.updateOptions({ wordWrap: "on" })
    console.log("word wrap on?")

  }

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl my-3">
      <Editor
        height="50vh"
        width={'50vw'}
        language={
          // Create your own language definition here
          // You can safely look at other samples without losing modifications.
          // Modifications are not saved on browser refresh/close though -- copy often!
          
            // Set defaultToken to invalid to see what you do not tokenize yet
            // defaultToken: 'invalid',
          "mylang"}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
      />
    </div>
  );
};
export default CodeEditorWindow;
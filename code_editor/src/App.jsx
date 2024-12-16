import { useCallback, useState } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { sublime } from '@uiw/codemirror-theme-sublime';
import './App.css';
import { createServer } from "miragejs"
import axios from 'axios'

createServer({
  routes() {
    this.post("/api/execute", (schema, request) => {
      let attrs = JSON.parse(request.requestBody)
      if (attrs.code === "fmt.Println(\\\"Hello, world!\\\")") 
        return { status: "success", output: "Hello, world!\n" }
      else return { status: "error", error: "SyntaxError: Unexpected token" }
    })
  },
})

function App() {
  let [code, setCode] = useState("");
  let [lang, setLang] = useState("not selected");
  let [task] = useState("Постановка задачи");
  let [result, setResult] = useState({ status: "success", output: "Для получения результата нажмите \"Run\"" });
  const onChange = useCallback((val) => {
    setCode(val);
  }, []);

  function runCode() {
    if (lang !== "not selected") {
    axios
      .post("/api/execute", {
        language: lang,
        code: code
      })
      .then((response) => {
        setResult(response.data)
      }).catch((error) => {
        console.error(error);
      });}
      else{
        alert ("Выберите язык программирования")
      }
  }
  return (
    <div>
      <header>
        <h1>Code Editor</h1>
      </header>
      <main>
        <div>
          <h4>Описание задачи:</h4>
          <p>{task}</p>
        </div>
        <Form.Select className="form" onChange={e => { setLang(e.target.value) }}>
          <option value="not selected">Выберите язык программирования</option>
          <option value="Go">Go</option>
          <option value="Python">Python</option>
        </Form.Select>
        <CodeMirror value={code} height="600px" extensions={[javascript({ jsx: true }), EditorView.lineWrapping]} onChange={onChange} theme={sublime} variant='light' />
        <div className="d-grid gap-1">
          <Button onClick={runCode} className='button' variant="outline-primary">Run</Button>
        </div>
        <div>
          <h4>Результат выполнения задачи:</h4>
          <p>
            {(() => {
              switch (result.status) {
                case "success": return result.output;
                case "error": return result.error;
              }
            })()}
          </p>
        </div>
      </main>
      <footer>
        <p>&copy; 2024 Иван Каширин</p>
      </footer>
    </div>
  );
}
export default App;

import logo from './logo.svg';
import './components/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import assParser from 'ass-parser';
import React, { useEffect, useState } from "react";


function App() {

  const [parsedContent, setParsedContent] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        // 使用ass-parser解析文件内容
        const parsedData = assParser(content, { comments: true });
        // 转换成字符串，便于在textarea中显示
        const jsonString = JSON.stringify(parsedData, null, 2);
        setParsedContent(jsonString);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
          <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <span class="fs-4">Web ASS Parser</span>
          </a>

          <ul class="nav nav-pills">
            {/* <li class="nav-item"><a href="#" class="nav-link active" aria-current="page">Home</a></li> */}
            {/* <li class="nav-item"><a href="#" class="nav-link">Features</a></li> */}
          </ul>
        </header>
        <div className="row">
          <div className="col-md-4 mb-4">
            <input
              type="file"
              className="custom-file-input"
              id="uploadASS"
              onChange={handleFileUpload}
              style={{ display: 'none' }} // 隐藏默认的文件输入
            />
            <label className="btn btn-outline-primary" htmlFor="uploadASS">Open ASS</label>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mb-4">
            <div class="form-group">
              <label htmlFor="parsedAss">Parsed ASS</label>
              <textarea
                className="form-control"
                id="parsedAss"
                rows="20"
                value={parsedContent}
                readOnly
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


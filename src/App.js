import logo from './logo.svg';
import './components/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import assParser from 'ass-parser';
import React, { useEffect, useState } from "react";


function App() {

  const [parsedContent, setParsedContent] = useState('');
  const [events, setEvents] = useState([]);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        // 使用ass-parser解析文件内容
        const parsedData = assParser(content, { comments: true });
        // 提取对话和正文
        const eventsSection = parsedData.find(section => section.section === "Events");
        const dialoguesAndComments = eventsSection.body.filter(item => item.key === "Dialogue" || item.key === "Comment");
        // 转换成字符串，便于在textarea中显示
        const jsonString = JSON.stringify(dialoguesAndComments, null, 2);
        setParsedContent(jsonString);
        setEvents(dialoguesAndComments);
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
            <table className="table">
              <thead>
                <tr>
                  <th>Start</th>
                  <th>End</th>
                  <th>Style</th>
                  <th>Name</th>
                  <th>L</th>
                  <th>R</th>
                  <th>V</th>
                  <th>Effect</th>
                  <th>Text</th>

                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={index}>
                    <td>{event.value.Start}</td>
                    <td>{event.value.End}</td>
                    <td>{event.value.Style}</td>
                    <td>{event.value.Name}</td>
                    <td>{event.value.MarginL}</td>
                    <td>{event.value.MarginR}</td>
                    <td>{event.value.MarginV}</td>
                    <td>{event.value.Effect}</td>
                    <td>{event.value.Text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        <div className="row">
          <div className="col-md-12 mb-4">
            <div class="form-group">
              <label htmlFor="parsedAss">Raw data (for debugging)</label>
              <textarea
                className="form-control"
                id="parsedAss"
                rows="4"
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


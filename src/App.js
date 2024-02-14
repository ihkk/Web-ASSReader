import './components/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import assParser from 'ass-parser';
import React, { useEffect, useState } from "react";

function App() {

  const [parsedContent, setParsedContent] = useState('');
  const [events, setEvents] = useState([]);
  // isReplaced 跟踪ass标签是否隐藏
  const [isReplaced, setIsReplaced] = useState(false);
  const [isSorted, setIsSorted] = useState(false);
  const [originalEvents, setOriginalEvents] = useState({});




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
        // make a hard copy of the original events
        setOriginalEvents(dialoguesAndComments);
        setIsReplaced(false);
        setIsSorted(false);
      };
      reader.readAsText(file);
    }
  };



  const handleReplace = () => {
    if (isReplaced) {
      // 如果已经替换了，就恢复原始文本
      // 恢复原始文本
      setEvents(originalEvents);
    } else {
      // 替换符合正则表达式的内容
      setEvents(events.map(event => ({
        ...event,
        value: { ...event.value, Text: event.value.Text.replace(/\{.*?\}/g, "☀") }
      })));
    }
    setIsReplaced(!isReplaced);
  };



  const handleTimeSort = () => {
    console.log(originalEvents);
    if (isSorted) {
      setEvents([...originalEvents]);
    } else {
      console.log("start sorting");
      const sortedEvents = JSON.parse(JSON.stringify(events)).sort((a, b) => {
        const aStart = a.value.Start.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
        const bStart = b.value.Start.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
        return aStart - bStart;
      });
      setEvents(sortedEvents);
    }
    setIsSorted(!isSorted);
    console.log(originalEvents);
  };


  // check if to display Actor/Name
  const shouldShowNameColumn = events.some(event => event.value.Name.trim() !== '');
  // check if to display Effect
  const shouldShowEffectColumn = events.some(event => event.value.Effect.trim() !== '');
  // Margins
  const shouldShowMarginLColumn = events.some(event => event.value.MarginL.trim() !== '0');
  const shouldShowMarginRColumn = events.some(event => event.value.MarginR.trim() !== '0');
  const shouldShowMarginVColumn = events.some(event => event.value.MarginV.trim() !== '0');

  window.onscroll = function () { scrollFunction() };

  function scrollFunction() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      document.getElementById("backToTop").style.display = "block";
    } else {
      document.getElementById("backToTop").style.display = "none";
    }
  }

  // 当用户点击按钮时，回到页面顶部
  function scrollToTop() {
    document.body.scrollTop = 0; // 对于Safari
    document.documentElement.scrollTop = 0; // 对于Chrome, Firefox, IE和Opera
  }


  return (
    <div className="App">
      <div className="container-fluid">
        <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
          <a href="https://ass.h0.work/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
            <span class="fs-4">ASS Reader</span>
          </a>

          <ul class="nav nav-pills">
            {/* <li class="nav-item"><a href="#" class="nav-link active" aria-current="page">Home</a></li> */}
            {/* <li class="nav-item"><a href="#" class="nav-link">Features</a></li> */}
            <li><input
              type="file"
              className="custom-file-input"
              id="uploadASS"
              onChange={handleFileUpload}
              style={{ display: 'none' }} // 隐藏默认的文件输入
            />
              <label className="btn btn-outline-primary" htmlFor="uploadASS">Open ASS</label>
            </li>
            <p>　</p>
            <li>
              <button className="btn btn-outline-primary" onClick={handleReplace}>
                {isReplaced ? '{\\t}' : '☀'}
              </button>
            </li>
            <p>　</p>
            <li>
              <button className="btn btn-outline-primary" onClick={handleTimeSort}>
                {isSorted ? '↩' : '⏱'}
              </button>
            </li>

          </ul>
        </header>

        <div className="row">
          <div className="landscape-prompt">
            <div class="alert alert-danger" role="alert">
              Your window is too narrow, please use in landscape mode.<br />您的窗口过窄，请横屏使用。
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-4">
            <table className="table" id="ass-header">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Start</th>
                  <th> End</th>
                  <th>Style</th>
                  {shouldShowNameColumn && <th>Actor</th>}
                  {shouldShowMarginLColumn && <th>L</th>}
                  {shouldShowMarginRColumn && <th>R</th>}
                  {shouldShowMarginVColumn && <th>V</th>}
                  {shouldShowEffectColumn && <th>Effect</th>}
                  <th>Text</th>

                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={index} className={event.key === "Comment" ? "comment" : ""}>
                    <td>{index + 1}</td>
                    <td>{event.value.Start}</td>
                    <td>{event.value.End}</td>
                    <td>{event.value.Style}</td>
                    {shouldShowNameColumn && <td>{event.value.Name}</td>}
                    {shouldShowMarginLColumn && <td>{event.value.MarginL}</td>}
                    {shouldShowMarginRColumn && <td>{event.value.MarginR}</td>}
                    {shouldShowMarginVColumn && <td>{event.value.MarginV}</td>}
                    {shouldShowEffectColumn && <td>{event.value.Effect}</td>}
                    <td >{event.value.Text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="row">
          {
            parsedContent === '' && <div className="col-md-12 mb-4 d-flex justify-content-center">
              <div class="alert alert-primary" role="alert">
                Click "Open ASS" to read an ASS file.
              </div>
            </div>
          }
        </div>
        <div className="row">
          {
            parsedContent === '' && <div className="col-md-12 mb-4 d-flex justify-content-center">
              <div class="alert alert-warning" role="alert">
                Your file will never be uploaded - all data are processed in your browser.
              </div>
            </div>
          }
        </div>




        {/* raw data */}
        {/* <div className="row">
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
        </div> */}

        <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <div class="col-md-4 d-flex align-items-center">
            <a href="https://github.com/ihkk" class="link" target="_blank" style={{ textDecoration: "none" }}><span class="mb-3 mb-md-0 text-muted">© Jacky HE</span></a>
          </div>

          <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li class="ms-3">
              <a className="text-muted" target="_blank" href="https://github.com/ihkk/Web-ASSReader">
                <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" alt="GitHub Logo" style={{ width: '24px', height: '24px' }} />
              </a>


            </li>
          </ul>
        </footer>

      </div >
      {/* back to top */}
      < button
        id="backToTop"
        onClick={scrollToTop}
        style={{
          display: 'none', // 不需要单位的值可以直接作为字符串
          position: 'fixed',
          bottom: '20px',
          right: '30px',
          zIndex: 99,
          padding: '10px',
          borderRadius: '10px',
        }
        }
        className="btn btn-outline-primary"
      >
        ↑
      </button >

    </div >
  );
}

export default App;


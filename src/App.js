import React from "react";
import './App.css';
import HomePage from './ui-components/HomePage';
import SearchPage from './ui-components/SearchPage';
import MenuBar from "./components/MenuBar";

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import AIPage from './ui-components/AIPage'
import CombinedHome from "./components/CombinedHome";
import ContactPage from "./ui-components/ContactPage";
import ChatPage from "./components/ChatPage";
import { Account } from './components/Account';
import SearchApts from "./views/SearchApts";

// function ChatPage() {
//   return (
//     <iframe
//       src="http://hw1-fw2155.s3-website-us-east-1.amazonaws.com/"
//       title="ChatPage"
//       width="100%"
//       height="100%"
//       frameBorder="0"
//     />
//   );
// }

function App() {
  return (
    <Router>
      <div>
        <Account>
          <MenuBar />
        </Account>
        <Routes>
          <Route exact path="/" element={<CombinedHome />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/searchhouse" element={<SearchApts />} />
        </Routes>
      </div>
    </Router>

    // <>
    //   <HomePage />,
    //   <SearchPage />,
    //   <AIPage />
    // </>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import PollResults from "./components/PollResults";

function App() {
  const [polls, setPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [question, setQuestion] = useState("");
  const [optionsInput, setOptionsInput] = useState("");
  const [pollResults, setPollResults] = useState(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    if (selectedPoll) {
      fetchPollResults(selectedPoll.id);
    }
  }, [selectedPoll]);

  const fetchPollResults = async (pollId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/polls/read/${pollId}/`
      );
      setPollResults(response.data);
    } catch (error) {
      console.error("Error fetching poll results:", error);
    }
  };

  const fetchPolls = async () => {
    try {
      const response = await axios.get("http://localhost:5000/polls/list/");
      setPolls(response.data);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      await axios.post(
        `http://localhost:5000/polls/vote/${pollId}/${optionIndex}/`,
        {
          optionIndex,
        }
      );
      fetchPolls();
      if (selectedPoll) {
        fetchPollResults(selectedPoll.id);
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleCreatePoll = async () => {
    try {
      const optionsArray = optionsInput
        .split("\n")
        .map((option) => option.trim());
      const options = optionsArray.reduce((acc, option, index) => {
        acc[index + 1] = option;
        return acc;
      }, {});

      await axios.post("http://localhost:5000/polls/create/", {
        question,
        options: JSON.stringify(options),
      });
      fetchPolls();
      setQuestion("");
      setOptionsInput("");
    } catch (error) {
      console.error("Error creating poll:", error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="create-poll poll-details">
          <h2>Create a Poll</h2>
          <form onSubmit={handleCreatePoll}>
            <div className="input-container">
              <label className="input-label">
                Question:
                <input
                  type="text"
                  name="question"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </label>
            </div>
            <label>
              Options (one per line):
              <textarea
                name="options"
                required
                value={optionsInput}
                onChange={(e) => setOptionsInput(e.target.value)}
              />
            </label>
            <button type="submit">Create Poll</button>
          </form>
        </div>
      </div>

      <div className="container">
        <div className="poll-list">
          <h2>Polls</h2>
          <ul>
            {polls.map((poll) => (
              <li key={poll.id}>
                <button
                  onClick={() => {
                    setSelectedPoll(poll);
                  }}
                >
                  <div>{poll.question}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {selectedPoll ? (
          <div className="poll-details">
            <div>
              <h2>{selectedPoll.question}</h2>
              <ul>
                {Object.entries(selectedPoll.options).map(([index, option]) => (
                  <li
                    key={index}
                    onClick={() => handleVote(selectedPoll.id, index)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <PollResults results={pollResults} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;

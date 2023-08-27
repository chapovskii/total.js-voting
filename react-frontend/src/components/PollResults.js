function PollResults({ results }) {
  return (
    <div>
      <h2>Poll Results</h2>
      <ul>
        {results ? (
          results.map((result, index) => (
            <li key={index}>
              option {result.option_index}: {result.votes} votes
            </li>
          ))
        ) : (
          <li>No results available</li>
        )}
      </ul>
    </div>
  );
}

export default PollResults;

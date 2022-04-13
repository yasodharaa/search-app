import React from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import InfiniteScroll from "react-infinite-scroller";

import "./App.css";

const API_KEY = "dYAtBR447Z0VeupRDYuVXYH75FhN265a";

const gf = new GiphyFetch(API_KEY);

const PAGE_SIZE = 20;

const App = () => {
  const [text, setText] = React.useState("welcome");

  const [pagination, setPagination] = React.useState({
    total_count: 0,
    count: PAGE_SIZE,
    offset: -20,
  });

  const [gifsData, setGifsData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetch = offset => {
    setIsLoading(true);
    gf.search(text, { offset, limit: PAGE_SIZE })
      .then(data => {
        setGifsData([...gifsData, ...data.data]);
        setPagination(data.pagination);
      })
      .catch(e => {
        alert(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSubmit = () => {
    setPagination({
      total_count: 0,
      count: PAGE_SIZE,
      offset: -20,
    });
    setGifsData([]);
    fetch(0);
  };

  const hasMore = React.useMemo(() => isLoading && !(pagination.offset >= pagination.total_count), [pagination, isLoading]);

  return (
    <div className="App">
      <div className="search-input">
        <input
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
        />
        <button onClick={onSubmit}>Submit</button>
      </div>
      {!isLoading && gifsData.length === 0 && <div>No data available...</div>}
      <div className="gif-container">
        <InfiniteScroll
          pageStart={0}
          loadMore={() => fetch(pagination.offset + 20)}
          hasMore={hasMore}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
          useWindow={false}>
          {gifsData.map(item => (
            <img key={item.id} alt="gif" className="gif-img" src={item.images["480w_still"].url} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default App;
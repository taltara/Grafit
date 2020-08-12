import React, { useState, useEffect, useRef } from "react";

import grafService from "../../services/grafService";
import { ReactComponent as TvIcon } from "../../assets/img/tv.svg";
import { ReactComponent as MoviesIcon } from "../../assets/img/movie.svg";

import SearchOptions from "./SearchOptions";
import TypeSwitcher from "./TypeSwitcher/TypeSwitcher";
import DataPreview from "./DataPreview";

const SearchContainer = (props) => {
  let inputRef = useRef();

  const { onDataSearch, isSearchOpen } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("series");
  const [searchStatus, setSearchStatus] = useState({});
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setIsSearching] = useState(false);
  const [current, setCurrent] = useState("Default");
  const [openClass, setOpenClass] = useState("");
  const [result, setResult] = useState(null);
  const [resultInfo, setResultInfo] = useState(null);
  const [resultOptions, setResultOptions] = useState([]);

  useEffect(() => {
    if (props.name !== current) {
      setIsSearching(false);
      setCurrent(props.name);
    }
  }, [props.name, current]);

  useEffect(() => {
    inputRef.current.focus();
  }, [searchType]);

  useEffect(() => {
    if (isSearchOpen) {
      if (openClass === "") {
        setTimeout(() => {
          setOpenClass("open");
        }, 50);
      } else {
        setOpenClass("");
        setTimeout(() => {
          setOpenClass("open");
        }, 50);
      }
    } else {
      setOpenClass("");
    }
  }, [isSearchOpen]);

  const handleSearchTerm = ({ target }) => {
    setSearchTerm(target.value);
  };
  const handleSearchType = (type) => {
    // if (result) return;
    setSearchType(type);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (searching) return;
    setIsSearching(true);

    let searchObj = {
      type: searchType,
      search: searchTerm,
    };

    let data;
    let dataLocation = searchType === "series" ? "values" : "Search";

    grafService
      .getGrafData(searchObj)
      .then((res) => (data = res))
      .then((res) => {
        console.log(data);

        if (!data.error) {
          setResultOptions(data.titles);
          setSearchResults(data.results);
          setSearchStatus({ result: true, picked: false });
        } else {
          setSearchResults(null);
          setSearchStatus({ result: false, picked: false });
        }

        if (searchType === "series") {
          if (!data[dataLocation].length) {
            data = null;
            setResult(null);
          } else {
            setResultInfo(
              data[searchType === "series" ? "seriesInfo" : "movieInfo"]
            );
          }
        } else {
          setResultInfo(null);
        }

        // if(data.values[0].Title !== current) {
        // console.log('NOT SAME');

        setResult({ data, Type: searchType });

        // } else  {
        // console.log('SAME');
        setIsSearching(false);
        // }
      });
  };

  const handleSearching = (event) => {
    event.preventDefault();
    if (searching) return;
    setIsSearching(true);

    let searchObj = {
      type: searchType,
      search: searchTerm,
    };

    let data;
    
    grafService
      .searchMediaData(searchObj)
      .then((res) => (data = res))
      .then((res) => {
        console.log(data);

        if (!data.error) {
          setResultOptions(data.titles);
          setSearchResults(data.results);
          setSearchStatus({ result: true, picked: false });
        } else {
          setSearchResults(null);
          setSearchStatus({ result: false, picked: false });
        }

        // if (searchType === "series") {
        //   if (!data[dataLocation].length) {
        //     data = null;
        //     setResult(null);
        //   } else {
        //     setResultInfo(
        //       data[searchType === "series" ? "seriesInfo" : "movieInfo"]
        //     );
        //   }
        // } else {
        //   setResultInfo(null);
        // }

        // if(data.values[0].Title !== current) {
        // console.log('NOT SAME');

        // setResult({ data, Type: searchType });

        // } else  {
        // console.log('SAME');
        setIsSearching(false);
        // }
      });
  };

  const onDataSelect = () => {
    onDataSearch(result.data);
    setIsSearching(false);
  };

  const onMediaPick = (id) => {
    let currType = searchResults[0].Type === "series" ? "series" : "movie";
    let dataLocation = searchType === "series" ? "values" : "Search";
    grafService
      .getGrafData({ id, type: currType })
      .then((data) => {
        if (searchType === "series") {
          if (!data[dataLocation].length) {
            data = null;
            setResult(null);
          } else {
            setResultInfo(
              data[searchType === "series" ? "seriesInfo" : "movieInfo"]
            );
          }
        } else {
          setResultInfo(null);
        }

        // if(data.values[0].Title !== current) {
        // console.log('NOT SAME');

        setResult({ data, Type: searchType });

        // } else  {
        // console.log('SAME');
        setIsSearching(false);
        // }
      })
  };

  let searchContainerClass = searching ? "search-ongoing " : "";
  searchContainerClass += result ? "search-with-result" : "";
  // console.log(result);
  return (
    <div
      className={`search-container flex column align-center space-between ${openClass} ${searchContainerClass}`}
    >
      <form
        action=""
        onSubmit={handleSearch}
        className="search-form flex align-center space-between"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTerm}
          className="search-input"
          placeholder={`Search ${
            searchType === "series" ? "TV Shows" : "Movies"
          }`}
          ref={inputRef}
        />
        <TypeSwitcher
          handleTypeChange={handleSearchType}
          dataTypes={[
            { type: "series", img: <TvIcon />, label: "TV Shows" },
            { type: "movie", img: <MoviesIcon />, label: "Movies" },
          ]}
          initType={0}
          animation="activeTab"
          switcherClass="type-switcher"
          switcherImgClass="switcher-img"
          swticherLabelClass="switcher-label"
          switchOnStart={true}
        />
      </form>
      {result ? (
        <div className="result-container">
          <DataPreview
            onDataSelect={onDataSelect}
            data={result.Type === "series" ? resultInfo : result}
            setResult={setResult}
          />
        </div>
      ) : searchStatus.result ? (
        <SearchOptions onMediaPick={onMediaPick} />
      ) : null}
    </div>
  );
};

export default SearchContainer;

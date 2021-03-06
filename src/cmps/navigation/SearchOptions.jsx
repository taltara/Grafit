import React, { useState, useEffect } from "react";

import SearchOptionsItem from "./SearchOptionsItem";

const SearchOptions = (props) => {
  const { options, onMediaPick } = props;

  const [showingOptions, setShowingOptions] = useState([]);
  const [entranceClass, setEntranceClass] = useState("start");
  const [exitClass, setExitClass] = useState("");
  const [picked, setPicked] = useState("");

  useEffect(() => {
    
    
  }, []);

  useEffect(() => {
    // console.log(entranceClass);
    if(showingOptions) {

      const timeout =
        entranceClass === "start" || entranceClass === "preview-entrance"
          ? 100
          : 600;
      if (entranceClass !== "") {
        setEntranceClass("");
        setTimeout(() => {
          setEntranceClass("preview-entrance");
        }, timeout);
      }

    }
  }, [showingOptions]);

  const onItemClick = (id, index) => {
    setPicked(index);
    setTimeout(() => {
      setExitClass("preview-exit");
      setShowingOptions(null);
      onMediaPick(id);
    }, 500);
  
  };

  useEffect(() => {
    if (options && options !== showingOptions && options.length) {
      setEntranceClass("");
      setTimeout(() => {
        setShowingOptions(options);
        setEntranceClass("preview-entrance");
      }, 100);
    }
  }, [options]);

  useEffect(() => {}, [showingOptions]);

  return (
    <ul
      className={`search-options ${entranceClass} ${exitClass} flex column align-start space-start`}
    >
      {showingOptions
        ? showingOptions.map((item, index) => {
            const itemClass = !index
              ? "first"
              : index === showingOptions.length - 1
              ? "last"
              : "middle";
            return (
              <SearchOptionsItem
                key={index}
                item={item}
                index={index}
                onMediaPick={onItemClick}
                itemClass={itemClass}
                picked={picked}
              />
            );
          })
        : null}
    </ul>
  );
};

export default SearchOptions;

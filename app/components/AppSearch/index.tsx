import { useState, useEffect, useRef, useMemo } from "react";
import { useFetcher } from "remix";
import styles from "./styles.css";
import { Autocomplete, TextField, InputAdornment, Avatar } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";

import CircularProgress from "@mui/material/CircularProgress";

import throttle from "lodash/throttle";
import type { ChangeEvent } from "react";

export const links = () => [{ rel: "stylesheet", href: styles }];

export const AppSearch = () => {
  const appSearch = useFetcher();
  const appSearchRef = useRef<HTMLInputElement>();
  const [options, setOptions] = useState([]);

  const handleUserKeyPress = (event: KeyboardEvent) => {
    if (event.metaKey && event.key === "k") {
      if (document.activeElement === appSearchRef?.current) {
        appSearchRef?.current?.blur();
      } else {
        appSearchRef?.current?.focus();
      }
    }
  };

  const throttledSubmit = useMemo(
    () =>
      throttle(
        (currentTarget) => {
          appSearch.submit(currentTarget);
        },
        300,
        { leading: false }
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onChangeHandler = (event: ChangeEvent<HTMLFormElement>) => {
    throttledSubmit(event.currentTarget);
  };

  useEffect(() => {
    if (appSearch.type === "done") {
      setOptions(appSearch.data);
    }
  }, [appSearch]);

  useEffect(() => {
    return () => {
      throttledSubmit.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  });

  return (
    <div className="appSearch">
      <appSearch.Form
        method="get"
        action="/app-search"
        onChange={onChangeHandler}
      >
        <Autocomplete
          disablePortal
          options={options} // options.sort((a, b) => -b.type.localeCompare(a.type))
          filterOptions={(x) => x}
          //groupBy={(option: any) => option.type}
          getOptionLabel={(option: any) => option.title}
          size="small"
          clearOnEscape
          loading={appSearch.state === "submitting"}
          sx={{ width: "100%", maxWidth: 640 }}
          renderInput={(params: any) => (
            <TextField
              {...params}
              name="search"
              placeholder="Search for studios, users and more..."
              inputRef={appSearchRef}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="end">
                    <div className="endAdornments">
                      {appSearch.state === "submitting" ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      <div className="keyboardShortcut">
                        <span className="keyboardKey">&#8984;</span>
                        <span className="keyboardKey">K</span>
                      </div>
                    </div>
                  </InputAdornment>
                ),
              }}
            />
          )}
          renderOption={(props, option, { selected }) => (
            <li {...props} key={`${option.type}-${option.id}`}>
              <div className="option">
                <Avatar
                  alt={option.title}
                  variant={option.type === 'studio' ? 'rounded' : 'circular'}
                >
                  {option.type === 'studio' ? <BusinessIcon /> : null}
                </Avatar>
                <div>
                  <div className="title">{option.title}</div>
                  <div className="details">
                    <div>
                      <span className="tier">BASE</span>{" "}
                      <span className="type">{option.type}</span>
                      {" • "}
                      <span className="city">Stockholm</span>
                    </div>
                    <div>
                      <span>{`(id: #${option.id})`}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )}
        />
      </appSearch.Form>
    </div>
  );
};

AppSearch.displayName = "AppSearch";

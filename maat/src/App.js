import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [single, setSingle] = useState(false);
  const [countryData, setCountryData] = useState({});
  const [style, setStyle] = useState({ display: "grid" });
  const [weather, setWeather] = useState({});

  useEffect(() => {
    const resp = axios.get("https://restcountries.com/v3.1/all");
    resp
      .then((response) => {
        console.log(JSON.parse(JSON.stringify(response.data)));
        setCountries(JSON.parse(JSON.stringify(response.data)));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const searchChange = (event) => {
    setSearch(event.target.value);
    console.log(event.target.value);
    console.log(search);
  };

  const getWeather = (capital) => {
    const key = process.env.REACT_APP_API_KEY;
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${capital}&limit=${1}&appid=${key}`;

    const weather = axios.get(url);
    weather
      .then((response) => {
        console.log(response);
        const lat = response.data[0].lat;
        const lon = response.data[0].lon;
        const weatherObject = axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`
        );
        weatherObject.then((response) => {
          setWeather(response.data.weather[0]);
        });
      })
      .catch((error) => {
        console.log(error.code);
      });
  };

  const onClick = (event) => {
    console.log(event.target);
    //setCountryData(event.target);
    setCountryData(
      countries.filter(
        (country) =>
          country.name.common.toLowerCase() === event.target.id.toLowerCase()
      )[0]
    );
    const ctr = countries.filter(
      (country) =>
        country.name.common.toLowerCase() === event.target.id.toLowerCase()
    )[0];

    setSingle(true);
    console.log(ctr);
    getWeather(ctr.capital[0]);
    setStyle({ display: "none" });
  };

  return (
    <div>
      <div style={style}>
        <Search searchChange={searchChange} />

        <Countries
          countries={countries}
          search={search}
          click={onClick}
          single={single}
          weather={weather}
          weatherFunction={getWeather}
        />
      </div>
      {single ? (
        <SingleData
          country={countryData}
          setSingle={setSingle}
          singleData={setCountryData}
          stylechange={setStyle}
          weather={weather}
        />
      ) : null}
    </div>
  );
}

const Search = ({ searchChange }) => {
  return (
    <div>
      <input type={"text"} onChange={searchChange}></input>
    </div>
  );
};

const Countries = ({
  countries,
  search,
  click,
  single,
  weather,
  weatherFunction,
}) => {
  const style = {
    display: "grid",
    fontSize: "1.5rem",
  };
  if (single) {
    style.display = "none";
  }
  let one = false;
  const countrylist = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );
  if (countrylist.length === 1) {
    one = true;
  }
  if (countrylist.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  console.log(countrylist);
  if (!one) {
    return (
      <div style={style}>
        {countrylist.map((country) => {
          return (
            <div>
              <p>{country.name.common}</p>
              <button id={country.name.common} onClick={click}>
                More info!
              </button>
            </div>
          );
        })}
      </div>
    );
  } else {
    weatherFunction(countrylist[0].capital[0]);
    return (
      <div>
        <h1>{countrylist[0].name.common}</h1>
        <p>capital: {countrylist[0].capital}</p>
        <p>population: {countrylist[0].population}</p>

        <img src={countrylist[0].flags["png"]} alt="flag" />
        <h2>{`Current weather: ${weather.main}`}</h2>
        <img
          src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt="404"
        />
      </div>
    );
  }
};

const SingleData = ({
  country,
  setSingle,
  singleData,
  stylechange,
  weather,
}) => {
  const click = (event) => {
    singleData({});
    stylechange({});
    setSingle(false);
  };

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital: {country.capital}</p>
      <p>population: {country.population}</p>

      <img src={country.flags["png"]} alt="flag" />
      <h2>{`Current weather: ${weather.main}`}</h2>
      <img
        src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt="404"
      />
      <br></br>
      <button onClick={click}>Close</button>
    </div>
  );
};

export default App;

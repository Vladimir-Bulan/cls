const apiKey = 'f2a26609563361903b4c76dabc2d066a';

function App() {
    const [ciudad, setciudad] = React.useState('Barcelona');
    const [weather, setWeather] = React.useState(null);
    const [searches, setSearches] = React.useState([]);
    const BASE_URL = 'http://localhost:5000/api';


    const getWeather = (ciudad) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&appid=${apiKey}&lang=es`)
            .then(response => response.json())
            .then(data => {
                const datoclima = {
                    ciudad: data.name,
                    temperatura: data.main.temp,
                    minTemp: data.main.temp_min,
                    maxTemp: data.main.temp_max,
                    humidity: data.main.humidity,
                    icon: data.weather[0].icon
                };
                setWeather(datoclima);
                saveSearch(ciudad);
            })
            .catch(error => console.error('Error fetching weather data:', error));
    };

    const saveSearch = (ciudad) => {
        fetch('http://localhost:5000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city: ciudad })
        }).then(() => fetchSearches());
    };

    const fetchSearches = () => {
        fetch('http://localhost:5000/api/searches')
            .then(response => response.json())
            .then(data => setSearches(data))
            .catch(error => console.error('Error fetching searches:', error));
    };

    React.useEffect(() => {
        getWeather(ciudad);
        fetchSearches();
    }, [ciudad]);

    return (
        <div>
            <NavBar setciudad={setciudad} />
            <SearchBar setciudad={setciudad} />
            {weather && <WeatherCard {...weather} />}
            <SearchHistory searches={searches} />
        </div>
    );
}

function NavBar({ setciudad }) {
    return (
        <nav className="nav">
            <ul>
                <li><h3>Clima</h3></li>
            </ul>
            <ul>
                <li><a href="#" className="ciudad" onClick={() => setciudad('Tucuman')}>Tucuman</a></li>
                <li><a href="#" className="ciudad" onClick={() => setciudad('Salta')}>Salta</a></li>
                <li><a href="#" className="ciudad" onClick={() => setciudad('Buenos Aires')}>Buenos Aires</a></li>
            </ul>
        </nav>
    );
}

function SearchBar({ setciudad }) {
    const [inputValue, setInputValue] = React.useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (inputValue) {
            setciudad(inputValue);
        }
    };

    return (
        <div className="buscar">
            <form onSubmit={handleSubmit}>
                <input
                    className="buscar-input"
                    type="buscar"
                    name="buscar"
                    placeholder="Search"
                    aria-label="Search"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </form>
        </div>
    );
}

function WeatherCard({ ciudad, temperatura, minTemp, maxTemp, humidity, icon }) {
    return (
        <article className="tiempo">
            <header className="nombre-ciudad">{ciudad}</header>
            <img className="tiempo2" src={`openweathermap/${icon}.svg`} alt="Weather icon" />
            <footer className="footer">
            <h2>Temperatura: {temperatura.toFixed(2)}°C</h2>
            <p>Mínima: {minTemp.toFixed(2)}°C / Máxima: {maxTemp.toFixed(2)}°C</p>
            <p>Humedad: {humidity}%</p>
            </footer>
        </article>
    );
}

function SearchHistory({ searches }) {
    return (
        <div>
            <h3>Historial de Búsqueda</h3>
            <ul>
                {searches.map((search, index) => (
                    <li key={index}>{search.city}</li>
                ))}
            </ul>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

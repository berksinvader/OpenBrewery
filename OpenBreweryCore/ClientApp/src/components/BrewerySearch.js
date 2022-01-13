import React, { Component } from 'react';

export class BrewerySearch extends Component {
    displayName = BrewerySearch.name

    constructor(props) {
        super(props);
        this.state = { breweries: [], loading: false, input: "", emptyResult: false, callback: false };
    }

    static renderBreweryTable(breweries) {
        return (
            <table className='table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Address</th>
                        <th>Website</th>
                    </tr>
                </thead>
                <tbody>
                    {breweries.map(brewery =>
                        <tr key={brewery.id}>
                            <td>{brewery.name}</td>
                            <td>{brewery.brewery_type[0].toUpperCase() + brewery.brewery_type.slice(1)}</td>
                            <td>
                                <a
                                    href={
                                        "http://maps.google.com/?q=" +
                                        (brewery.street == null ? "N/A" : brewery.street) + ", " + (brewery.city == null ? "N/A" : brewery.city) + ", " + (brewery.state == null ? "N/A" : brewery.state) + " " + (brewery.postal_code == null ? "N/A" : brewery.postal_code)
                                    }
                                    rel='noopener noreferrer'
                                    target='_blank'
                                    aria-label='Brewery address'
                                >
                                    {(brewery.street == null ? "N/A" : brewery.street) + ", " + (brewery.city == null ? "N/A" : brewery.city) + ", " + (brewery.state == null ? "N/A" : brewery.state) + " " + (brewery.postal_code == null ? "N/A" : brewery.postal_code)}
                                </a>
                            </td>
                            <td>
                                {brewery.website_url ? (
                                    <a
                                        aria-label='Brewery website'
                                        href={brewery.website_url}
                                        target='_blank'
                                        rel='noreferrer noopener'
                                    >
                                        {brewery.website_url}
                                    </a>
                                ) : (
                                    <span>None</span>
                                )}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
    
    render() {

        let getBreweries = () => {
            this.setState({ input: document.getElementById('searchPhrase').value });
            if (!this.state.callback) {
                fetch("https://api.openbrewerydb.org/breweries/search?query=" + document.getElementById('searchPhrase').value)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.length < 1) {
                            this.state.emptyResult = true;
                        }
                        else {
                            this.state.emptyResult = false;
                        }
                        this.state.breweries = data;
                        this.state.callback = true;
                        if (!this.state.loading) {
                            setTimeout(() => {
                                this.state.loading = true;
                                getBreweries();
                                setTimeout(() => {
                                    this.state.callback = true;
                                    this.state.loading = false;
                                    getBreweries();
                                }, 500);
                            }, 100);
                        }
                    })
                    .catch((error) => {
                        console.error(error.message);
                        alert("Error occurred while retrieving the data");
                    });
            }
            else if (!this.state.loading) {
                this.state.callback = false;
                this.state.loading = false;
            }
        };

        let handleClearingResults = () => {
            this.state.breweries = [];
            this.setState({ input : ""});
        };

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.state.emptyResult ? <p><em>No results found.</em></p> : this.state.breweries.length > 0 ? BrewerySearch.renderBreweryTable(this.state.breweries) : <p><em>Search for breweries across the US</em></p>;

        return (
            
            <div>
                <h1>Brewery Search</h1>
                <p>This component demonstrates searching the Open Brewery API.</p>

                <div className='search-bar-container'>
                    <div className='input-group'>
                        <input
                            type='text'
                            value={this.state.input}
                            placeholder='Search breweries...'
                            aria-label='Search'
                            className='form-control'
                            id='searchPhrase'
                            onChange={(e) => this.setState({ input: e.target.value })}
                        />
                        <button
                            className='btn'
                            type='button'
                            id='button-addon1'
                            onClick={getBreweries}
                        >
                            Search
                        </button>
                        &nbsp;
                        <button
                            className='btn'
                            type='button'
                            id='button-addon2'
                            onClick={handleClearingResults}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {contents}
            </div>
        );
    }
}

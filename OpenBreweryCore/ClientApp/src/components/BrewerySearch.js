import React, { Component } from 'react';
import queryString from 'query-string';

export class BrewerySearch extends Component {
    displayName = BrewerySearch.name

    constructor(props) {
        super(props);
        let queries = queryString.parse(this.props.location.search);
        this.state = { breweries: [], loading: false, input: queries.search_text, emptyResult: false, callback: false, init: true, alt_item: false };
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
                            <td>
                                <a href={"./Details?brewery_id=" + brewery.id + "&search_text=" + document.getElementById('searchPhrase').value}>
                                    {brewery.name}
                                </a>
                            </td>
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
            if (document.getElementById('searchPhrase') != null) {
                this.setState({ input: document.getElementById('searchPhrase').value });
            }
            this.setState({ init: false });
            if (!this.state.callback) {
                fetch("https://api.openbrewerydb.org/breweries/search?query=" + this.state.input)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.length < 1) {
                            this.setState({ emptyResult: true });
                        }
                        else {
                            this.setState({ emptyResult: false });
                        }
                        this.setState({ breweries: data });
                        this.setState({ callback: true });
                        if (!this.state.loading) {
                            setTimeout(() => {
                                this.setState({ loading: true });
                                getBreweries();
                                setTimeout(() => {
                                    this.setState({ callback: true });
                                    this.setState({ loading: false });
                                    getBreweries();
                                }, 300);
                            }, 10);
                        }
                    })
                    .catch((error) => {
                        console.error(error.message);
                        alert("Error occurred while retrieving the data");
                    });
            }
            else if (!this.state.loading) {
                this.setState({ callback: false });
                this.setState({ loading: false });
            }
        };

        let handleClearingResults = () => {
            this.setState({ breweries: [] });
            this.setState({ input : ""});
        };

        let init =
            this.state.init ? (this.state.input == null ? (this.setState({ init: false })) : getBreweries()) : null;
        

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

                {init}
            </div>
        );
    }
}

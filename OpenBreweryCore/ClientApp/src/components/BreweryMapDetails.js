import React, { Component } from 'react';
import queryString from 'query-string';
import GoogleMapReact from 'google-map-react';

const MapComponent = ({ text }) => <div>{text}</div>;

const formatNumber = (phoneStr) => {
    let cleaned = ("", phoneStr).replace(/\D/g, "");

    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

    if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }

    return null;
};

export class BreweryMapDetails extends Component {
    displayName = BreweryMapDetails.name
    
    constructor(props) {
        super(props);
        

        let queries = queryString.parse(this.props.location.search);
        this.state = { brewery_id: queries.brewery_id, search_text: queries.search_text, brewery_data: null, loading: false };
    }

    render() {

        let showBreweryDetails = () => {
            if (this.state.brewery_data == null) {

                this.state.loading = true;

                fetch("https://api.openbrewerydb.org/breweries/" + this.state.brewery_id)
                    .then((response) => response.json())
                    .then((data) => {
                        this.setState({ brewery_data: data });
                        setTimeout(showBreweryDetails(), 100);
                    })
                    .catch((error) => {
                        console.error(error.message);
                        alert("Error occurred while retrieving the data.  " + error.message);
                    });
                
                return (<div>loading...</div>);
            }
            else {
                if (this.state.loading) {
                    this.setState({ loading: false });
                    this.forceUpdate();
                }
                return (
                    <div>
                        <input type='hidden' id='lat' value={this.state.brewery_data.latitude} />
                        <input type='hidden' id='lon' value={this.state.brewery_data.longitude} />
                        <div><h3>{this.state.brewery_data.name}</h3></div>
                        <div>
                            {(this.state.brewery_data.street == null ? "N/A" : this.state.brewery_data.street) + ", " + (this.state.brewery_data.city == null ? "N/A" : this.state.brewery_data.city) + ", " + (this.state.brewery_data.state == null ? "N/A" : this.state.brewery_data.state) + " " + (this.state.brewery_data.postal_code == null ? "N/A" : this.state.brewery_data.postal_code)}
                        </div>
                        <div>{ formatNumber(this.state.brewery_data.phone) }</div>
                        <div>
                            {this.state.brewery_data.website_url ? (
                                <a
                                    aria-label='Brewery website'
                                    href={this.state.brewery_data.website_url}
                                    target='_blank'
                                    rel='noreferrer noopener'
                                >
                                    {this.state.brewery_data.website_url}
                                </a>
                            ) : (
                                <span>None</span>
                            )}
                        </div>

                        <div></div>

                        { (this.state.brewery_data.latitude != null && this.state.brewery_data.longitude != null) ?
                            <div style={{ height: '50vh', width: '100%' }}>
                                <GoogleMapReact
                                    bootstrapURLKeys={{ key: "AIzaSyDwGUy2Fn_hjlv2xgsdU5CP2U9V-YtOxlc" }}
                                    defaultCenter={{ lat: Number(this.state.brewery_data.latitude), lng: Number(this.state.brewery_data.longitude) }}
                                    defaultZoom={11}
                                >
                                    <MapComponent
                                        lat={this.state.brewery_data.latitude}
                                        lng={this.state.brewery_data.longitude}
                                        text={this.state.brewery_data.name}
                                    />
                                </GoogleMapReact>
                            </div>
                            : <div><em>Map not available</em></div>
                        }

                    </div>
                );
            }
        }

        let content = showBreweryDetails();

        return (

            <div>
                <h1>Brewery Details</h1>
                <p>This component demonstrates retrieving the brewery details and a map of the brewery.</p>

                <div>
                    <a href={"../?search_text=" + this.state.search_text}>Return to search</a>
                </div>

                <div className='details-container'>
                    <br/>

                    <div id="breweryDetails">{content}</div>
                </div>
            </div>
        );        
    }
}
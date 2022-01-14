import React, { Component } from 'react';
import queryString from 'query-string';
import GoogleMapReact from 'google-map-react';

const MapComponent = ({ text }) => <div>{text}</div>;

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
                        <div>{this.state.brewery_data.name}</div>
                        <div>{this.state.brewery_data.brewery_type}</div>
                        <div>{this.state.brewery_data.longitude}</div>
                        <div>{this.state.brewery_data.latitude}</div>
                        <div>{this.state.brewery_data.phone}</div>
                        <div>{this.state.brewery_data.website_url}</div>

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
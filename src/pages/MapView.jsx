import { useEffect, useState } from 'react';
import { Map, Marker, InfoWindow, NavigationControl } from 'react-bmapgl';

const MapView = ({ it }) => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        if (it?.position?.lng && it?.position?.lat) {
            setIsDataLoaded(true);
        }
    }, [it]);

    if (!isDataLoaded) return <div>Loading map...</div>;

    return (
        <Map center={{ lng: 116.402544, lat: 39.928216 }} zoom="11" style={{ height: 450, width: '100%' }}>
            <Marker position={{ lng: 116.402544, lat: 39.928216 }} />
            <NavigationControl />
            <InfoWindow position={{ lng: 116.402544, lat: 39.928216 }} text="内容" title="标题" />
        </Map>
    );
};

export default MapView;

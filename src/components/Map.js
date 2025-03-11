import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import { defaults as defaultInteractions, MouseWheelZoom } from "ol/interaction";

const apiKey = "ec567accbeb11ff4ea60b8e4859ae821"; // OpenWeatherMap API Key

const OpenLayersMap = ({ latitude, longitude }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Destroy previous map instance before re-rendering
    if (mapInstance.current) {
      mapInstance.current.setTarget(null);
      mapInstance.current = null;
    }

    console.log("Rendering Map at:", latitude, longitude);

    const center = fromLonLat([longitude, latitude]);

    // Create a marker
    const marker = new Feature({
      geometry: new Point(center),
    });

    // Style for the marker
    marker.setStyle(
      new Style({
        image: new Icon({
          anchor: [0.5, 1], // Positioning of the icon
          src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg", // Marker icon
          scale: 0.05, // Adjust icon size
        }),
      })
    );

    // Create vector layer for marker
    const vectorSource = new VectorSource({
      features: [marker],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Initialize the map
    mapInstance.current = new Map({
      target: mapRef.current,
      interactions: defaultInteractions().extend([new MouseWheelZoom({ constrainResolution: true })]), // Enable scrolling
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new TileLayer({
          source: new XYZ({
            url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
          }),
        }),
        new TileLayer({
          source: new XYZ({
            url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
          }),
        }),
      ],
      view: new View({
        center,
        zoom: 5,
      }),
    });

    // Add marker layer
    mapInstance.current.addLayer(vectorLayer);

    return () => {
      mapInstance.current?.setTarget(null);
    };
  }, [latitude, longitude]);

  // **Fix Scrolling Issue After Navigating Back**
  useEffect(() => {
    const handleScroll = (event) => {
      const mapContainer = mapRef.current;
      if (mapContainer && !mapContainer.contains(event.target)) {
        document.body.style.overflow = "auto"; // Enable scrolling when outside the map
      }
    };

    const enableScrolling = () => {
      document.body.style.overflow = "auto"; // Restore scrolling when leaving the page
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeunload", enableScrolling);
    window.addEventListener("popstate", enableScrolling); // Fix when using browser back button

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", enableScrolling);
      window.removeEventListener("popstate", enableScrolling);
    };
  }, []);

  return <div ref={mapRef} className="mappy" />;
};

export default OpenLayersMap;

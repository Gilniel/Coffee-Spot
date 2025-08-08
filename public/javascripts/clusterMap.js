mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'cluster-map',
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/standard',
    config: {
        basemap: {
            theme: 'monochrome',
            lightPreset: 'night'
        }
    },
    center: [-103.5917, 40.6699],
    zoom: 3
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('coffeebars', {
        type: 'geojson',
        generateId: true,
        // Point to GeoJSON data. This example visualizes all M1.0+'coffeebars
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: coffeebars,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'coffeebars',
        filter: ['has', 'point_count'],
        paint: {
            // Monochromatic brown colors for clusters
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#a0522d', // sienna (light brown)
                10,
                '#8b4513', // saddle brown (medium brown)
                30,
                '#5c3317'  // dark brown
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ],
            'circle-emissive-strength': 1
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'coffeebars',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'coffeebars',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff',
            'circle-emissive-strength': 1
        }
    });

    // inspect a cluster on click
    map.addInteraction('click-clusters', {
        type: 'click',
        target: { layerId: 'clusters' },
        handler: (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('coffeebars').getClusterExpansionZoom(
                clusterId,
                (err, zoom) => {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        }
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.addInteraction('click-unclustered-point', {
        type: 'click',
        target: { layerId: 'unclustered-point' },
        handler: (e) => {
            const coordinates = e.feature.geometry.coordinates.slice();
            const text = e.feature.properties.popUpMarkup;
    
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(
                    `${text}`
                )
                .addTo(map);
        }
    });

    // Change the cursor to a pointer when the mouse is over a cluster of POIs.
    map.addInteraction('clusters-mouseenter', {
        type: 'mouseenter',
        target: { layerId: 'clusters' },
        handler: () => {
            map.getCanvas().style.cursor = 'pointer';
        }
    });

    // Change the cursor back to a pointer when it stops hovering over a cluster of POIs.
    map.addInteraction('clusters-mouseleave', {
        type: 'mouseleave',
        target: { layerId: 'clusters' },
        handler: () => {
            map.getCanvas().style.cursor = '';
        }
    });

    // Change the cursor to a pointer when the mouse is over an individual POI.
    map.addInteraction('unclustered-mouseenter', {
        type: 'mouseenter',
        target: { layerId: 'unclustered-point' },
        handler: () => {
            map.getCanvas().style.cursor = 'pointer';
        }
    });

    // Change the cursor back to a pointer when it stops hovering over an individual POI.
    map.addInteraction('unclustered-mouseleave', {
        type: 'mouseleave',
        target: { layerId: 'unclustered-point' },
        handler: () => {
            map.getCanvas().style.cursor = '';
        }
    });
});
require(['jquery', 'bootstrap', 'leaflet'],
function ($){
    $(function(){
        // VARIABLES GLOBALES
        // 1) cartes, groupes de layers
        var map = null;
        var marker = null;
        // 2) Options des cartes et fonds
        var mapOptions = {
            continuousWorld : true,
            markerZoomAnimation : false,
            inertia : false, 
            trackResize: true
        };
        var markerIcon = L.icon({
            //iconUrl: 'https://' + window.location.host + '/investissement-2020/img/marker_investissement3.png',
            iconUrl: 'img/marker_investissement3.png',
            shadowUrl: '',
            iconSize:     [42,49], // size of the icon
            iconAnchor:   [17, 25], // point of the icon which will correspond to marker's location
        });

        var annee = getAnnee();
        
       
       function getAnnee(){
           var lastyear='';
           const urlParams = new URLSearchParams(window.location.search);
           urlParams.has('annee')? lastyear = new URLSearchParams(window.location.search).get('annee'):lastyear=new Date().getFullYear();
           return lastyear;
       }
       
        // CARTE: DECLARATION
       function initMap(){
            // declaration fond tms
            map = L.map('map', mapOptions);
            // Init Map
            var pvciLayer = L.tileLayer(
                "https://public.sig.rennesmetropole.fr/geowebcache/service/wmts?" +
                "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
                "&TILEMATRIXSET=EPSG:3857" +
                "&FORMAT=image/png"+
                "&LAYER=ref_fonds:pvci_simple_gris"+
                "&TILEMATRIX=EPSG:3857:{z}" +
                "&TILEROW={y}" +
                "&TILECOL={x}",
                {
                    attribution: 'Plan de ville communal et intercommunal, Référentiel voies et adresses : Rennes Métropole',
                    id: 1,
                    center: [48.1, -1.67],
                    minZoom : 0,
                    maxZoom : 20
                }
            );
            var orthoLayer = L.tileLayer(
                "https://public.sig.rennesmetropole.fr/geowebcache/service/wmts?" +
                "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
                "&TILEMATRIXSET=EPSG:3857" +
                "&FORMAT=image/jpeg"+
                "&LAYER=raster:ortho2017"+
                "&TILEMATRIX=EPSG:3857:{z}" +
                "&TILEROW={y}" +
                "&TILECOL={x}",
                {
                    attribution: 'Orthophotographie aérienne 2017 sur Rennes Métropole',
                    id: 2,
                    center: [48.1, -1.67],
                    minZoom : 0,
                    maxZoom : 20
                }
            );

            map.addLayer(pvciLayer);
            map.setView([48.1, -1.67], 13);
            var baseMaps = {"Plan de la ville de Rennes": pvciLayer};
            var baseLayers = {
                "Plan de la ville de Rennes": pvciLayer,
                "Vue aérienne 2017": orthoLayer
            };
            L.control.layers(baseLayers).addTo(map);
            displayData();

        }

        // TODO : annee en param
        function displayData(){
            function onEachFeature(feature, layer) {
                layer.on({
                    click: displayModal
                });
            }
            
            //$.getJSON('./data/investissements_2020.json',function(data){
            $.getJSON('./data/'+annee+'/investissements.json',function(data){
                geojson = L.geoJson(data, {
                    pointToLayer: function(feature, latlng) {
                        marker = L.marker(
                            latlng, 
                            { icon: markerIcon,
                              title : feature.properties.resume
                            }
                        );
                        return marker;
                    },
                    onEachFeature: onEachFeature
                }).addTo(map);
            });
            
        }
        function displayModal(e){
            $(".modal-title").html(e.target.feature.properties.resume);
            $(".modal-body").html(formatPopupContent(e.target.feature.properties));
            $("#my-modal").modal("show");
        }
        //CARTE: FORMATTAGE TEXTE POPUP
        function formatPopupContent(content){
            var htmlContent = '<div class="popup">';
            $.each(content, function( index, value ) {
                if(value != null){
                    switch(index){
                        case 'libelle':
                            htmlContent += '<div class="row">';
                            htmlContent += '<div class="col-lg-12">';
                            htmlContent += value;
                            htmlContent += '</div>';
                            htmlContent += '</div>';
                        break;
                        case 'montant':
                            htmlContent += '<div class="row">';
                            htmlContent += '<div class="col-lg-12 montant">';
                            htmlContent += value;
                            htmlContent += '</div>';
                            htmlContent += '</div>';
                        break;
                        case 'photo':
                            if(value != "") {
                                htmlContent += '<div class="row">';
                                //htmlContent += '<div class="col-lg-12"><img src="https://' + window.location.host + window.location.pathname + 'img/';
                                htmlContent += '<div class="col-lg-12"><img src="data/'+annee+'/photos/';
                                htmlContent += value;
                                htmlContent += '"></div>';
                                htmlContent += '</div>';
                            }
                        break;
                    }
                }
            });
        htmlContent += '</div>';
        return htmlContent;
    }
        
        // application
        // rustines bootsrap & IE
        if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
            var msViewportStyle = document.createElement('style')
            msViewportStyle.appendChild(
                document.createTextNode(
                    '@-ms-viewport{width:auto!important}'
                )
            )
            document.querySelector('head').appendChild(msViewportStyle);
        }
        initMap();
    });
});

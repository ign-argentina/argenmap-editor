const defaultPreferences = {
  title: "IGN - Argenmap",
  website: "https://www.ign.gob.ar/",
  logoText: {
    content: "Lorem Ipsum",
    title: "Siempre",
    link: "#"
  },
  logo: {
    src: "https://static.ign.gob.ar/img/logo/Logo-MinDef-IGN-Visores.svg",
    title: "Instituto Geográfico Nacional",
    link: "https://www.ign.gob.ar/",
    // height: "49px",
    // width: "200px",
    // style: "",
    // srcLogoMini: "https://static.ign.gob.ar/img/logo/LogoIGN_Blanco_SinTexto.svg",
    // miniHeight: "",
    // miniWidth: "",
    // ministyle: "",
  },
  mapConfig: {
    center: {
      latitude: -40,
      longitude: -59,
    },
    zoom: {
      initial: 4,
      min: 3,
      max: 21,
    },
  },
  theme: {
    activeLayer: "#33b560",
    bodyBackground: "#0094d4",
    headerBackground: "#157DB9",
    iconBar: "#4f4f4f",
    menuBackground: "#157DB9",
    btnColor: "white",
    textLegendMenu: "white",
    textLegendMenuStyle: "",
    textMenu: "white",
    textMenuStyle: "",
  },
  // metaTags: {
  //   description:
  //     "Visor de mapas desarrollado por el Instituto Geográfico Nacional",
  //   image: "/src/styles/images/argenmap.png",
  //   title: "IGN - Argenmap",
  // },
  onInit: {
    showToolbar: true,
    showLayerMenu: true,
  },
  // analytics_ids: ["G-WPKNSX1QMS"],
  // charts: {
  //   isActive: true,
  // },
  // favicon: "src/config/styles/images/favicon.ico",
  // hillshade: {
  //   addTo: ["argenmap", "argenmap_gris"],
  //   attribution:
  //     "sombra de montaña <a target='_blank' href='https://www.arcgis.com/home/item.html?id=1b243539f4514b6ba35e7d995890db1d'>©Esri</a>",
  //   icon: "src/styles/images/mountains.svg",
  //   name: "hillshade",
  //   switchLabel: "Agregar sombra de montaña Esri",
  //   url:
  //     "https://services.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}.png",
  // },
  // strings: {
  //   basemap_legend_button_text: "Ver leyenda del mapa",
  //   basemap_max_zoom: " y máximo de ",
  //   basemap_min_zoom: "Zoom mínimo de ",
  //   delete_geometry: "Eliminar geometría",
  // },
  showSearchBar: true,
  searchbar: {
    isActive: true,
    background_color: "rgba(255, 255, 255, 0.7)",
    color_focus: "#008dc9",
    strings: {
      placeholder: "Buscar localidad...",
    },
    // left: "40%",
    // top: "5px",
  },
  geocoder: {
    key: "",
    lang: "es",
    limit: 5,
    query: "q",
    search: "search",
    url: "https://api.ign.gob.ar/buscador/",
    url_by_id: "places",
  },
  // geoprocessing: {
  //   availableProcesses: [
  //     {
  //       baseUrl:
  //         "https://imagenes.ign.gob.ar/geoserver/geoprocesos/ows?service=WPS&version=1.0.0",
  //       geoprocess: "contour",
  //       layer: "alos_unificado",
  //       name: "Curvas de Nivel",
  //       namePrefix: "curvas_de_nivel_",
  //       styles: {
  //         d_line_color: "#967529",
  //         d_line_m: 500,
  //         d_weigth: 1,
  //         line_color: "#e0b44c",
  //         line_weight: 0.8,
  //         smoothFactor: 1.7,
  //       },
  //     },
  //     {
  //       baseUrl:
  //         "https://imagenes.ign.gob.ar/geoserver/ows?service=WPS&version=1.0.0",
  //       geoprocess: "waterRise",
  //       layer: "geoprocesos:alos_unificado",
  //       name: "Cota",
  //       namePrefix: "cota_",
  //     },
  //     {
  //       geoprocess: "buffer",
  //       name: "Área de influencia",
  //       namePrefix: "area_de_influencia_",
  //     },
  //     {
  //       geoprocess: "elevationProfile",
  //       name: "Perfil de Elevación",
  //       namePrefix: "profile_",
  //     },
  //   ],
  //   buttonIcon: "fa fa-cog",
  //   buttonTitle: "Geoprocesos",
  //   dialogTitle: "Geoprocesos",
  //   isActive: true,
  //   strings: {
  //     bounds: "Areas a procesar",
  //   },
  // },
  // mainPopup: {
  //   isActive: false,
  //   welcomeSign: "Novedades",
  //   image: "",
  //   text: `<div class='modal-overlay' style='width:100%;height:100%;display:flex;justify-content:center;align-items:center;z-index:1000;'>
  //            <div class='modal-content' style='backdrop-filter: blur(5px) brightness(105%);background-color: #ffffff99;padding:30px;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.2);text-align:center;width:90%;position:relative;'>
  //              <img src='src/styles/images/argenmap-banner.webp' alt='Banner Argenmap' style='max-width:90%;height:auto;'>
  //              <h2 style='color:#333333;margin-bottom:15px;font-size:1.8em;'>¡Explorá la nueva version de Argenmap!</h2>
  //              <p style='color:#555555;line-height:1.6;margin-bottom:25px;font-size:1.1em;'>Conocé la nueva interfaz de Argenmap, más intuitiva y accesible. Sumamos funcionalidades para mejorar tu experiencia.</p>
  //              <button onclick='document.getElementById("nav-help-btn").click();document.getElementById("popupExitBtn").click();document.getElementById("initModalBtnConfirm").click();' target='_blank' style='background-color:#157DB9;color:white;padding:12px 25px;border:none;border-radius:5px;font-size:1.1em;cursor:pointer;text-decoration:none;transition:background-color 0.3s ease;display:inline-block;'>Haz un recorrido por el visor</button>
  //            </div>
  //          </div>`,
  // },
  // table: {
  //   isActive: false,
  //   rowsLimit: 5,
  // },
  referencias: {
    height: "",
    icon: "src/config/styles/images/referencias.png",
    image: "src/config/styles/images/legends/referencias.png",
    show: false,
    width: "",
  },
  excluded_plugins: ["minimap"]
};

export default defaultPreferences;

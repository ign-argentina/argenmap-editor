import Place from "../models/Place.js";

class GeocodeService{

    geoCode = async (params) => {
        try{

            let places = []
            const coords = this.#areCoordinates(params)
           if (coords != false){
            places = this.#reverseGeocode(coords)
           } else {
            places = this.#directGeocode(params)
           }

           return places;
        }catch(error){
            console.log("Error en la capa de Servicio")
        }
    }

    #reverseGeocode = async (coords) => {
        return await Place.getByCoordinates(coords)
    }

    #directGeocode = async (params) => {
        return await Place.getByName(params)
    }

    #areCoordinates = (params) => {
        try{
            const coords = new Coordinates(params.q);
            params.lat = coords.getLatitude();
            params.lon = coords.getLongitude();

            return params;
        } catch(error){
            return false;
        }
    }
}

export default GeocodeService;
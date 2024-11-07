import http from "../http-common";

class PlantDataService {
  getAll() {
    return http.get("/getPlant");
  }

  getDistinctPlants(){
    return http.get("/plants/distinct");
  }

  getAreaByPlant(plantName) {
    return http.get(`/plants/areas?plant=${plantName}`);
  }

  getLineByArea(areaName) {
    return http.get(`/plants/line?area=${areaName}`);
  }

  getStationByLine(lineName) {
    return http.get(`/plants/station?line=${lineName}`);
  }

//   get(id) {
//     return http.get(`/tutorials/${id}`);
//   }

//   create(data) {
//     return http.post("/tutorials", data);
//   }

//   update(id, data) {
//     return http.put(`/tutorials/${id}`, data);
//   }

//   delete(id) {
//     return http.delete(`/tutorials/${id}`);
//   }

//   deleteAll() {
//     return http.delete(`/tutorials`);
//   }

//   findByTitle(title) {
//     return http.get(`/tutorials?title=${title}`);
//   }
}

export default new PlantDataService();
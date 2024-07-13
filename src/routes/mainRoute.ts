

import {Express} from "express"
import homeroute from './homeRoute'


function loadRoutes(app:Express) {
   app.use('/', homeroute)

}

export default loadRoutes;
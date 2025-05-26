import * as {businesses } from './mock.business.js'
import 

function fetchMockData() {

    fetch("../services/contributors.JSON")
    .then(res => res.json())
    .then(data => console.log(data))

}


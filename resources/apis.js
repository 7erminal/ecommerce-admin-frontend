import axios from 'axios'
// import cookie from "react-cookies";

var hosturl = 'https://learn-api.africandigitalsolutions.com';

class Api{
    async POST_(params, endpoint){
        console.log(params)
        console.log("Url: ")
        console.log(`${hosturl}${endpoint}`)

        const controller = new AbortController();

        var token = sessionStorage.getItem('token')

        const config = {
            method: 'post',
            url: hosturl+endpoint,
            // data: formData,
            data: params,
            // timeout: 500000,
            // params: params,
            // params: { firstName: params.firstname, lastName: params.lastname, age: params.age, height: params.height, weight: params.weight, race: params.race, bloodType: params.bloodType, allergies: params.allergies, chronicIllnessStatus: params.chronicIllnessStatus, medicalCondition: params.medicalCondition, status: params.status, treatmentDate: params.treatmentDate }
            headers: {
                // "Authorization": 'Bearer '+ token,
            },
            signal: controller.signal
        }

        try{
            const res = await axios(config);
            console.log("Response is ")
            console.log(res)

            return res
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
                return "REQUEST_CANCELED"
            } else {
                // handle error
                console.log("Error occurred")
                console.log(error)
                return "FAILURE. SOMETHING WENT WRONG"
            }
        }
    }

    async GET_ (endpoint) {
        console.log("GET url: "+hosturl+endpoint)

        const config = {
            method: 'get',
            url: `${hosturl+endpoint}`,
            headers: {
                // "Access-Control-Allow-Origin":"*",
                // 'Ocp-Apim-Subscription-key': "c04b23f4fa6b4c59b1fff012d4cd20a7",
                "Authorization": "Bearer "+sessionStorage.getItem("token")
            }
        }

        try{
            const res = await axios(config);
            console.log("Response is ")
            console.log(res)

            return res
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
                return "REQUEST_CANCELED"
            } else {
                // handle error
                console.log("Error occurred")
                console.log(error)
                return "FAILURE. SOMETHING WENT WRONG"
            }
        }

        return response
       
	}

    async PUT_(params, endpoint){
        console.log(params)
        console.log("Url: ")
        console.log(`${hosturl}${endpoint}`)

        const controller = new AbortController();

        var token = sessionStorage.getItem('token')

        const config = {
            method: 'put',
            url: hosturl+endpoint,
            // data: formData,
            data: params,
            // timeout: 500000,
            // params: params,
            // params: { firstName: params.firstname, lastName: params.lastname, age: params.age, height: params.height, weight: params.weight, race: params.race, bloodType: params.bloodType, allergies: params.allergies, chronicIllnessStatus: params.chronicIllnessStatus, medicalCondition: params.medicalCondition, status: params.status, treatmentDate: params.treatmentDate }
            headers: {
                // "Authorization": 'Bearer '+ token,
            },
            signal: controller.signal
        }

        try{
            const res = await axios(config);
            console.log("Response is ")
            console.log(res)

            return res
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled', error.message);
                return "REQUEST_CANCELED"
            } else {
                // handle error
                console.log("Error occurred")
                console.log(error)
                return "FAILURE. SOMETHING WENT WRONG"
            }
        }
    }
}

export default Api
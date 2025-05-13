import axios from 'axios';

const headers = {
    'Content-Type': 'application/json',
    'x-typesense-api-key': process.env.TYPESENSE_ADMIN_API_KEY
}

function removeAllExistingOverrides (){
    axios.get(`${process.env.TYPESENSE_PROTOCOL}://${process.env.TYPESENSE_HOST}:${process.env.TYPESENSE_PORT}/collections/musicWorks/overrides`,{headers: headers})
    .then(response => {
        response.data.overrides.forEach(function(override){
            console.log(`Deleting ${override.id} override from typesense collection.`);
            axios.delete(`${process.env.TYPESENSE_PROTOCOL}://${process.env.TYPESENSE_HOST}:${process.env.TYPESENSE_PORT}/collections/musicWorks/overrides/${override.id}`,{headers: headers})
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.log('there was an error deleting an override from typesense');
              console.error(error);
              return false;
            });
        })
    })
    .catch(error => {
        console.log('failed to fetch all existing overrides from typesense collection')
        console.error(error);
        return false;
    })

    return true;
}


export default {
    async afterUpdateMany(event) {
        const { data, where, select, populate, state, orderBy, limit, offset } = event.params;
        const updatedWorkIDs: number[] = event.params.where.id.$in;

        // console.log(data);
        // console.log(event);
    },

    async afterUpdate(event) {
        const { data, where, select, populate, state } = event.params;

        removeAllExistingOverrides();
        event.result.sponsoredWork.forEach(function(work){
	   if (work.Category === "Global") {
                const overrideTitle = (work.Category + "-" + work.categoryValue + "-" + work.work.id + "-" + work.position).replace(/\s+/g, '-').toLocaleLowerCase();
                const overridePayload = JSON.stringify({
                    "rule": {
                        "query": "*",
                        "match": "exact"
                       },
                    "includes": [
                        {"id": work.work.id.toString(), "position": work.position}
                    ],
                    "stop_processing": false
                });
                axios.put(`${process.env.TYPESENSE_PROTOCOL}://${process.env.TYPESENSE_HOST}:${process.env.TYPESENSE_PORT}/collections/musicWorks/overrides/${overrideTitle}`, overridePayload, {headers: headers})
                .then(response => {
                  console.log('publishing override to typesense');
                  console.log(response.data);
                })
                .catch(error => {
                    console.log('failed to publish override to typesense collection')
                    console.error(error);
                })
            }
	    else if (work.categoryValue.split(', ') == work.categoryValue) {
                const overrideCategory = work.Category.toLocaleLowerCase();
                const overrideTitle = (work.Category + "-" + work.categoryValue + "-" + work.work.id + "-" + work.position).replace(/\s+/g, '-').toLocaleLowerCase();
                const overridePayload = JSON.stringify({
                    "rule": {
                     //"filter_by": "elements:=[\`"+work.categoryValue+"\`]"
                     "filter_by": overrideCategory+":=[\`"+work.categoryValue+"\`]"
                    },
                      "includes": [
                      {"id": work.work.id.toString(), "position": work.position}
                    ],
                    "stop_processing": true
                });
                axios.put(`${process.env.TYPESENSE_PROTOCOL}://${process.env.TYPESENSE_HOST}:${process.env.TYPESENSE_PORT}/collections/musicWorks/overrides/${overrideTitle}`, overridePayload, {headers: headers})
                .then(response => {
                  console.log('publishing override to typesense');
                  console.log(response.data);
                })
                .catch(error => {
                    console.log('failed to publish override to typesense collection')
                    console.error(error);
                })
            } else {
                const overrideCategory = work.Category.toLocaleLowerCase();
                const overrideCategoryValues = work.categoryValue.split(', ');
                var overrideFilterByStr = ""
                var overrideCategoriesTitle = "";
                overrideCategoryValues.forEach(function(categoryValue){
                    if (categoryValue == overrideCategoryValues.slice(-1)) {
                        //overrideFilterByStr+= "elements:=[\`"+categoryValue+"\`]"
                        overrideFilterByStr+= overrideCategory+":=[\`"+categoryValue+"\`]"
                        overrideCategoriesTitle += categoryValue.replace(/\s+g/, "-");
                    } else {
                        //overrideFilterByStr+= "elements:=[\`"+categoryValue+"\`] && "
                        overrideFilterByStr+= overrideCategory+":=[\`"+categoryValue+"\`] && "
                        overrideCategoriesTitle += categoryValue.replace(/\s+g/, "-")+"-";
                    };
                });
                const overrideTitle = (work.Category + "-" + overrideCategoriesTitle + "-" + work.work.id + "-" + work.position).replace(/\s+/g, '-').toLocaleLowerCase();
                const overridePayload = JSON.stringify({
                    "rule": {
                     "filter_by": overrideFilterByStr.toString()
                    },
                      "includes": [
                      {"id": work.work.id.toString(), "position": work.position}
                    ],
                    "stop_processing": true
                });
                axios.put(`${process.env.TYPESENSE_PROTOCOL}://${process.env.TYPESENSE_HOST}:${process.env.TYPESENSE_PORT}/collections/musicWorks/overrides/${overrideTitle}`, overridePayload, {headers: headers})
                .then(response => {
                  console.log('publishing override to typesense');
                  console.log(response.data);
                })
                .catch(error => {
                    console.log('failed to publish override to typesense collection')
                    console.error(error);
                })
            }
        })
    }
}

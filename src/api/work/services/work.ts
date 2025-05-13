// @ts-nocheck

/**
 * work service
 */

 import { factories } from '@strapi/strapi';
 export type desResponse = {
     timestamp: string;
     email_address: string;
     title: string;
     link_to_score_: string;
     youtube_link: string;
     has_teacher_duet: boolean;
     has_lyrics: boolean;
     measures: number;
     instrumentation: string;
     time_signatures: string;
     key_signature: string;
     notes_for_admin1: string;
     elements: string;
     featured_element1: string;
     featured_element2: string;
     mood: string;
     teaching_tips: string;
     holidays: string;
     student_age: string;
     student_type: string;
     style: string;
     themes: string;
     tempo_indications: string;
     notes_for_admin2: string;
     notes_for_admin3: string;
     strapi_work_id: string;
     alternative_title: string;
     notes_for_admin4: string;
     series: string;
     set: string;
     strapi_element_ids: string;
     strapi_composer_id: string;
     strapi_key_signature_ids: string;
     strapi_time_signature_ids: string;
     strapi_mood_ids: string;
     strapi_theme_ids: string;
     strapi_publisher_ids: string;
     strapi_style_ids: string;
     strapi_student_age_ids: string;
     strapi_student_type_ids: string;
     strapi_series_ids: string;
     strapi_set_ids: string;
     strapi_teaching_tips_ids: string;
 }
 
 export default factories.createCoreService('api::work.work', ({ strapi }): {} => ({
     async processDesResponse(desResponseData: any) {
        desResponseData.strapi_element_ids = await createIdArray(desResponseData.strapi_element_ids);
        desResponseData.strapi_publisher_ids = desResponseData.strapi_publisher_ids ? await createIdArray(desResponseData.strapi_publisher_ids) : [];
        desResponseData.strapi_key_signature_ids = desResponseData.strapi_key_signature_ids ? await createIdArray(desResponseData.strapi_key_signature_ids) : [];
        desResponseData.strapi_time_signature_ids = desResponseData.strapi_time_signature_ids ? await createIdArray(desResponseData.strapi_time_signature_ids) : [];
        desResponseData.strapi_mood_ids = desResponseData.strapi_mood_ids ? await createIdArray(desResponseData.strapi_mood_ids) : [];
        desResponseData.strapi_theme_ids = desResponseData.strapi_theme_ids ? await createIdArray(desResponseData.strapi_theme_ids) : [];
        desResponseData.strapi_style_ids = desResponseData.strapi_style_ids ? await createIdArray(desResponseData.strapi_style_ids) : [];
        desResponseData.strapi_tempo_indication_ids = desResponseData.strapi_tempo_indication_ids ? await createIdArray(desResponseData.strapi_tempo_indication_ids) : [];
        desResponseData.strapi_student_age_ids = desResponseData.strapi_student_age_ids ? await createIdArray(desResponseData.strapi_student_age_ids) : [];
        desResponseData.strapi_student_type_ids = desResponseData.strapi_student_type_ids ? await createIdArray(desResponseData.strapi_student_type_ids) : [];
        desResponseData.strapi_series_ids = desResponseData.strapi_series_ids ? await createIdArray(desResponseData.strapi_series_ids) : [];
        desResponseData.strapi_collection_ids = desResponseData.strapi_collection_ids ? await createIdArray(desResponseData.strapi_collection_ids) : [];
        desResponseData.strapi_set_ids = desResponseData.strapi_set_ids ? await createIdArray(desResponseData.strapi_set_ids) : [];
        desResponseData.strapi_teaching_tips_ids = desResponseData.strapi_teaching_tips_ids ? await createIdArray(desResponseData.strapi_teaching_tips_ids) : [];
        desResponseData.calculated_level = desResponseData.calculated_level;
        //desResponseData.sheetMusicLinks = await createLinksArray(desResponseData.amazon_link, desResponseData.smp_link);
        desResponseData.featured_element_1 = desResponseData.featured_element_1 ? await cleanUpFeaturedElementName(desResponseData.featured_element_1) : null;
        desResponseData.featured_element_2 = desResponseData.featured_element_2 ? await cleanUpFeaturedElementName(desResponseData.featured_element_2) : null;
        desResponseData.instrumentation = desResponseData.instrumentation || null;
        desResponseData.era = desResponseData.era || "none";
        desResponseData.holidays = desResponseData.holidays || "none";
	const entry = await strapi.entityService.create('api::work.work', {
            data: {
                title: desResponseData.title,
                composer: { id: desResponseData.strapi_composer_id },
                elements: desResponseData.strapi_element_ids,
                publishers: desResponseData.strapi_publisher_ids,
                keySignatures: desResponseData.strapi_key_signature_ids,
                timeSignatures: desResponseData.strapi_time_signature_ids,
                moods: desResponseData.strapi_mood_ids,
                styles: desResponseData.strapi_style_ids,
                level: { id: desResponseData.calculated_level }, 
                set: desResponseData.strapi_set_ids,
                teachingTips: desResponseData.strapi_teaching_tips_ids,
                series: desResponseData.strapi_series_ids,
                theme: desResponseData.strapi_theme_ids,
                studentAges: desResponseData.strapi_student_age_ids, 
                studentTypes: desResponseData.strapi_student_type_ids,
                hasLyrics: desResponseData.has_lyrics,
                measureCount: desResponseData.number_of_measures,
                yearPublished: desResponseData.work_published_date,
                Era: desResponseData.era,
                Holiday: desResponseData.holidays,
                videoEmbedCode: desResponseData.youtube_link,
                alternateTitle: desResponseData.alternative_title,
                instrumentation: desResponseData.instrumentation,
                hasTeacherDuet: desResponseData.has_teacher_duet,
		tempoIndications: desResponseData.strapi_tempo_indication_ids,  
                featuredElement1: desResponseData.featured_element_1,
                featuredElement2: desResponseData.featured_element_2,
                collections: desResponseData.strapi_collection_ids,
                notesForAdmin: desResponseData.section_notes_for_admin //TODO: this needs to be concatted by gapp script  
                //sheetMusicLinks: desResponseData.sheetMusicLinks, 
            },
          });

        return entry;

        async function cleanUpFeaturedElementName(element){
	    if (element.length == 0) return null;
            let elementWords = element.split(" ");
            if (elementWords[0] == "1st"){
                elementWords[0] = "First";
            }
            if (elementWords[0] == "8th"){
                elementWords[0] = "Eighth";
            }
            if (elementWords[0] == "16th"){
                elementWords[0] = "Sixteenth";
            }
            let payload = elementWords.join(" ");
            return payload; 
        }
 
        async function createLinksArray(amazonLink, smpLink){
            if (amazonLink.length === 0 && smpLink.length === 0) return 
            else {
                let payload = [];
                let links = [amazonLink, smpLink];
                links.forEach(link => {
                    if (link === "") return;
                    else {
                        let sellerURL = new URL(link);
                        payload.push({__component: "link.sheet-music-link",sellerName: sellerURL.origin, url: link });
                    }
                });
                return payload;
            }
        }

        async function createIdArray(dataArray){
            // console.log(`dataArray is [${dataArray}], it is of length ${dataArray.length}`);
            if (dataArray.length === 0 || dataArray.length === undefined) return []
            else if ( dataArray == dataArray.split(", ") ) {
                return ({"id": dataArray})
            }
            else 
                dataArray = dataArray.split(", ");
            let payload = [];
            dataArray.forEach(element => {
                payload.push({"id": element})
            });
            return payload; 
        }
     }, 

     async processWorkUpdate(updateData: any, id: string) {
        async function createIdArray(dataArray){
            if (dataArray.length == 0) return []
            else
                dataArray = dataArray.split(", ");
            let payload = [];
            dataArray.forEach(element => {
                payload.push(element)
            });
            console.log(payload);
            return payload;
        }

	updateData.strapi_element_ids ? updateData.strapi_element_ids = await createIdArray(updateData.strapi_element_ids) : updateData.strapi_element_ids = [];
        updateData.strapi_publisher_ids ? updateData.strapi_publisher_ids = await createIdArray(updateData.strapi_publisher_ids) : updateData.strapi_publisher_ids = [];
        updateData.strapi_key_signature_ids ? updateData.strapi_key_signature_ids = await createIdArray(updateData.strapi_key_signature_ids) : updateData.strapi_key_signature_ids = [];
        updateData.strapi_time_signature_ids ? updateData.strapi_time_signature_ids = await createIdArray(updateData.strapi_time_signature_ids) : updateData.strapi_time_signature_ids = [];
        updateData.strapi_mood_ids ? updateData.strapi_mood_ids = await createIdArray(updateData.strapi_mood_ids) : updateData.strapi_mood_ids = [];
        updateData.strapi_theme_ids ? updateData.strapi_theme_ids = await createIdArray(updateData.strapi_theme_ids) : updateData.strapi_theme_ids = [];
        updateData.strapi_style_ids ? updateData.strapi_style_ids = await createIdArray(updateData.strapi_style_ids) : updateData.strapi_style_ids = [];
        updateData.strapi_tempo_indication_ids ? updateData.strapi_tempo_indication_ids = await createIdArray(updateData.strapi_tempo_indication_ids) : updateData.strapi_tempo_indication_ids = [];
        updateData.strapi_student_age_ids ? updateData.strapi_student_age_ids = await createIdArray(updateData.strapi_student_age_ids) : updateData.strapi_student_age_ids = [];
        updateData.strapi_student_type_ids ? updateData.strapi_student_type_ids = await createIdArray(updateData.strapi_student_type_ids) : updateData.strapi_student_type_ids = [];
        updateData.strapi_teaching_tips_ids ? updateData.strapi_teaching_tips_ids = await createIdArray(updateData.strapi_teaching_tips_ids) : updateData.strapi_teaching_tips_ids = [];

        updateData.instrumentation = updateData.instrumentation || null;
        updateData.era = updateData.era || "none";
        updateData.holidays = updateData.holidays || "none";
        const entry = await strapi.entityService.update('api::work.work', id, {
            data: {
                title: updateData.title,
                composer: [ updateData.strapi_composer_id ],
                elements: updateData.strapi_element_ids,
                publishers: updateData.strapi_publisher_ids,
                keySignatures: updateData.strapi_key_signature_ids,
                timeSignatures: updateData.strapi_time_signature_ids,
                moods: updateData.strapi_mood_ids,
                styles: updateData.strapi_style_ids,
                level: [ updateData.calculated_level ],
                teachingTips: updateData.strapi_teaching_tips_ids,
                themes: updateData.strapi_theme_ids,
                studentAges: updateData.strapi_student_age_ids,
                studentTypes: updateData.strapi_student_type_ids,
                tempoIndications: updateData.strapi_tempo_indication_ids,
                hasLyrics: updateData.has_lyrics,
                measureCount: updateData.number_of_measures,
                yearPublished: updateData.work_published_date,
                Era: updateData.era,
                Holiday: updateData.holidays,
                videoEmbedCode: updateData.youtube_link,
                alternateTitle: updateData.alternative_title,
                instrumentation: updateData.instrumentation,
                hasTeacherDuet: updateData.has_teacher_duet,
                featuredElement1: updateData.featured_element_1,
                featuredElement2: updateData.featured_element_2,
                notesForAdmin: updateData.admin_notes,
                collections: updateData.strapi_collection_ids
            }
        });
        return entry;
     }
})); 

import axios from 'axios';

export async function syncWorkToTypesense(work) {
  const typesenseWorkData = createTypesenseWorkObj(work);
  return await syncWorkObjToTypesense(typesenseWorkData);
}

export async function batchSyncWorkToTypesense(fieldsToBeUpdated) {
    const headers = {
        'Content-Type': 'application/json',
        'x-typesense-api-key': process.env.TYPESENSE_ADMIN_API_KEY
    };

    try {
        // Wait for all promises to resolve
        const resolvedFields = await Promise.all(fieldsToBeUpdated);
        
        // Filter out any undefined values and convert to JSONL
        const jsonlData = resolvedFields
            .filter(field => field) 
            .map(field => JSON.stringify(field))
            .join('\n');

        const response = await axios.post(
            `${process.env.TYPESENSE_PROTOCOL}://${process.env.TYPESENSE_HOST}:${process.env.TYPESENSE_PORT}/collections/musicWorks/documents/import?action=update`,
            jsonlData,
            { 
                headers: {
                    ...headers,
                    'Content-Type': 'text/plain', // Changed to text/plain for JSONL
                }
            }
        );

        strapi.log.info(`Typesense batch update response: ${JSON.stringify(response.data, null, 2)}`);
        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        strapi.log.error(`Error batch updating works in TypeSense. Error: ${errorMessage}`);
        return false;
    }
}

export async function deleteWorkFromTypesense(workId) {
    const headers = {
        'Content-Type': 'application/json',
        'x-typesense-api-key': process.env.TYPESENSE_ADMIN_API_KEY
    };

    try {
        const response = await axios.delete(
            `${process.env.TYPESENSE_PROTOCOL}://${process.env.TYPESENSE_HOST}:${process.env.TYPESENSE_PORT}/collections/musicWorks/documents/${workId}?ignore_not_found=true`,
            { headers }
        );

        if (response.data?.id) {
            strapi.log.info(`Deleted work from TypeSense. WorkID: ${response.data?.id} `);
            return true;
        } else {
            throw new Error(`Failed to delete work from TypeSense. WorkID: ${workId}`);
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        strapi.log.error(`Error deleting work from TypeSense. Error: ${errorMessage}`);
        return false;
    }
}

export function createTypesenseWorkObj(work) {
  return {
    id: work.id.toString(),
    title: work.title.toString(),
    name: work.composers.filter(c => c.publishedAt !== null)[0]?.name.toString() || null,
    level: work.level?.publishedAt !== null ? work.level?.title : null,
    elements: work.elements?.filter(c => c.publishedAt !== null).map(e => e.name) || [],
    exclude_elements: [],
    era: work.Era || null,
    instrumentation: work.instrumentation || null,
    collections: work.collections?.filter(c => c.publishedAt !== null).map(c => c.title) || [],
    holiday: work.Holiday && work.Holiday !== "None" ? work.Holiday : null,
    measure_count: work.measureCount ? work.measureCount.toString() : null,
    styles: work.styles?.filter(c => c.publishedAt !== null).map(s => s.title) || [],
    publisher: work.publishers?.filter(c => c.publishedAt !== null).map(p => p.name).join(', ') || null,
    moods: work.moods?.filter(c => c.publishedAt !== null).map(m => m.title) || [],
    themes: work.themes?.filter(c => c.publishedAt !== null).map(t => t.title) || [],
    student_ages: work.studentAges?.filter(c => c.publishedAt !== null).map(a => a.title) || [],
    student_types: work.studentTypes?.filter(c => c.publishedAt !== null).map(t => t.title) || [],
    key_signatures: work.keySignatures?.filter(c => c.publishedAt !== null).map(k => k.title) || [],
    time_signatures: work.timeSignatures?.filter(c => c.publishedAt !== null).map(t => t.title) || [],
    has_lyrics: work.hasLyrics === true || null,
    has_teacher_duet: work.hasTeacherDuet === true || null,
    composers: work.composers?.filter(c => c.publishedAt !== null).map(c => c.name) || [],
    year_published: work.yearPublished ? work.yearPublished.toString() : null,
  };
}

async function syncWorkObjToTypesense(work) {
  const headers = {
    'Content-Type': 'application/json',
    'x-typesense-api-key': process.env.TYPESENSE_ADMIN_API_KEY
  };

  try {
    const response = await axios.post(
      `${process.env.TYPESENSE_PROTOCOL}://${process.env.TYPESENSE_HOST}:${process.env.TYPESENSE_PORT}/collections/musicWorks/documents?action=upsert`,
      work,
      { headers }
    );

    if (response.data.id === work.id) {
      strapi.log.info(`Synced work: ${work.title} to TypeSense.`);
      return true;
    } else {
      throw new Error(`Failed to sync work: ${work.title} to TypeSense.`);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    strapi.log.error(`Error publishing work: ${work.title} to TypeSense. Error: ${errorMessage}`);
    return false;
  }
}
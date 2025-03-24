const fetchAndCacheGrist = require("./fetchAndCacheGrist");
const {
  GRIST_DATABASE_FILE_PATH,
} = require("../../../constants/database/grist");
const safeArray = require("../../array/safeArray");
const { writeAsReference } = require("../writeFileIn");
const { mapEntityFields } = require("./mapEntityFields");

/* --------------------------------- Shared --------------------------------- */
const getDatabaseUpdatedAt = async () => {
  const { updatedAt } = await fetchAndCacheGrist({
    routeId: "database",
    filePath: GRIST_DATABASE_FILE_PATH,
  });

  return { updatedAt };
};

/* ------------------------------ Human remains ----------------------------- */

const getHumanRemains = async () => {
  const { records } = await fetchAndCacheGrist({
    routeId: "humanRemains",
    filePath: "/grist/tables/humanRemains.json",
  });
  const rawData = records;

  return rawData;
};

const getHumanRemainsSummary = async () => {
  const { records } = await fetchAndCacheGrist({
    routeId: "humanRemainsSummary",
    filePath: "/grist/tables/humanRemainsSummary.json",
  });
  const { fields } = records[0];

  const data = {
    originalCount: fields.originalCount,
    repatriatedCount: fields.repatriatedCount,
    currentCount: fields.currentCount,
  };

  writeAsReference({
    data,
    filePath: "/grist/transformed/humanRemainsSummary.json",
  });

  return data;
};

/* ------------------------------- Institution ------------------------------ */
const getInstitution = async (filter) => {
  const { records } = await fetchAndCacheGrist({
    routeId: "institution",
    filePath: "/grist/tables/institution.json",
  });

  const data = records.map(({ id, fields }) => {
    return {
      id,
      slug: fields.slug,
      label: fields.label,
      longitude: fields.longitude,
      latitude: fields.latitude,
      currentCount: fields.currentCount,
      address: fields.address,
      city: fields.city,
      continents: safeArray(fields.continents_slug).slice(1),
    };
  });

  writeAsReference({ data, filePath: "/grist/transformed/institution.json" });

  if (filter?.slug) {
    return data.filter((it) => it.slug === filter.slug);
  }

  return data;
};

const getInstitutionSummary = async () => {
  const { records } = await fetchAndCacheGrist({
    routeId: "institutionSummary",
    filePath: "/grist/tables/institutionSummary.json",
  });
  const { fields } = records[0];
  const data = {
    cities: safeArray(fields.cities).slice(1),
    institutionCount: fields.count,
    currentCount: fields.currentCount,
    originalCount: fields.originalCount,
    repatriatedCount: fields.repatriatedCount,
  };

  writeAsReference({
    data,
    filePath: "/grist/transformed/institutionSummary.json",
  });

  return data;
};

const getInstitutionUnderMicroscope = async (filter) => {
  const { records } = await fetchAndCacheGrist({
    routeId: "institutionUnderMicroscope",
    filePath: "/grist/tables/institutionUnderMicroscope.json",
  });


  const data = records.map(({ id, fields }) => {
    return {
      id,
      currentCount: fields.currentCount,
      category: fields.category,
      originCategory: fields.originCategory,
      repatriatedCount: fields.repatriatedCount,
      slug: fields.slug,
      label: fields.label,
      parent: fields.parent,
      institution: {
        slug: fields.institution_slug,
        label: fields.institution_label,
      },
    };
  });

  writeAsReference({
    data,
    filePath: "/grist/transformed/institutionUnderMicroscope.json",
  });

  if (filter?.slug) {
    return data.filter((it) => it.institution.slug === filter.slug);
  }

  return data;
};

const getInstitutionUnderMicroscopeSimple = async () => {
  const { records } = await fetchAndCacheGrist({
    routeId: "institutionUnderMicroscopeSimple",
    filePath: "/grist/tables/institutionUnderMicroscopeSimple.json",
  });
  const rawData = records;

  return rawData;
};

/* --------------------------------- Origin --------------------------------- */
const getOrigin = async () => {
  const { records } = await fetchAndCacheGrist({
    routeId: "origin",
    filePath: "/grist/tables/origin.json",
  });
  const rawData = records;

  return rawData;
};

/* --------------------------------- Origins -------------------------------- */
const getAncestry = async () => {
  const { records } = await fetchAndCacheGrist({
    routeId: "ancestry",
    filePath: "/grist/tables/ancestry.json",
  });

  const data = records.map(({ id, fields }) => {
    return {
      id,
      slug: fields.slug,
      label: fields.label,
      longitude: fields.longitude,
      latitude: fields.latitude,
      currentCount: fields.currentCount,
      // institutions: safeArray(fields.institutions).slice(1),
    };
  });

  writeAsReference({
    data,
    filePath: `/grist/transformed/ancestry.json`,
  });

  return data;
};

const getAncestryInstitution = async (filter) => {
  const entity = "ancestry";
  const routeId = "ancestryInstitution";

  const { records } = await fetchAndCacheGrist({
    routeId,
    filePath: `/grist/tables/${routeId}.json`,
  });

  const data = records.map(({ id, fields }) => {
    return {
      id,
      currentCount: fields.currentCount,
      ...mapEntityFields({
        entity,
        fields,
      }),
      ...mapEntityFields({
        entity: "institution",
        fields,
      }),
    };
  });

  writeAsReference({
    data,
    filePath: `/grist/transformed/${routeId}.json`,
  });

  if (typeof filter?.slug !== "undefined") {
    return data.filter((it) => it[entity]["slug"] === filter["slug"]);
  }

  return data;
};

const getContinent = async () => {
  const { records } = await fetchAndCacheGrist({
    routeId: "continent",
    filePath: "/grist/tables/continent.json",
  });

  const data = records.map(({ id, fields }) => ({
    id,
    slug: fields.slug,
    label: fields.label,
    longitude: fields.longitude,
    latitude: fields.latitude,
    currentCount: fields.currentCount,
  }));

  writeAsReference({
    data,
    filePath: `/grist/transformed/continent.json`,
    // filePath: `/grist/transformed/ancestry.json`,
  });

  return data;
};


const getContinentInstitution = async (filter) => {
  const entity = "continent";
  const routeId = "continentInstitution";

  const { records } = await fetchAndCacheGrist({
    routeId,
    filePath: `/grist/tables/${routeId}.json`,
  });

  const data = records.map(({ id, fields }) => {
    return {
      id,
      currentCount: fields.currentCount,
      ...mapEntityFields({
        entity,
        fields,
      }),
      ...mapEntityFields({
        entity: "institution",
        fields,
      }),
    };
  });
  writeAsReference({
    data,
    filePath: `/grist/transformed/${routeId}.json`,
  });

  if (typeof filter?.slug !== "undefined") {
    return data.filter((it) => it[entity]["slug"] === filter["slug"]);
  }

  return data;
};

const getCountry = async () => {
  const { records } = await fetchAndCacheGrist({
    routeId: "country",
    filePath: "/grist/tables/country.json",
  });

  const data = records.map(({ id, fields }) => ({
    id,
    slug: fields.slug,
    label: fields.label,
    longitude: fields.longitude,
    latitude: fields.latitude,
    currentCount: fields.currentCount,
    // institutions: safeArray(fields.institutions).slice(1),
  }));

  writeAsReference({
    data,
    filePath: `/grist/transformed/country.json`,
  });

  return data;
};

const getCountryInstitution = async (filter) => {
  const entity = "country";
  const routeId = "countryInstitution";

  const { records } = await fetchAndCacheGrist({
    routeId,
    filePath: `/grist/tables/${routeId}.json`,
  });

  const data = records.map(({ id, fields }) => {
    return {
      id,
      currentCount: fields.currentCount,
      ...mapEntityFields({
        entity,
        fields,
      }),
      ...mapEntityFields({
        entity: "institution",
        fields,
      }),
    };
  });
 
  writeAsReference({
    data,
    filePath: `/grist/transformed/${routeId}.json`,
  });

  if (typeof filter?.slug !== "undefined") {
    return data.filter((it) => it[entity]["slug"] === filter["slug"]);
  }

  return data;
};

const getRegion = async () => {
  const { records } = await fetchAndCacheGrist({
    routeId: "region",
    filePath: "/grist/tables/region.json",
  });

  const data = records.map(({ id, fields }) => ({
    id,
    slug: fields.slug,
    label: fields.label,
    longitude: fields.longitude,
    latitude: fields.latitude,
    currentCount: fields.currentCount,
    // institutions: safeArray(fields.institutions).slice(1),
  }));

  writeAsReference({
    data,
    filePath: `/grist/transformed/country.json`,
  });

  return data;
};

const getRegionInstitution = async (filter) => {
  const entity = "region";
  const routeId = "regionInstitution";

  const { records } = await fetchAndCacheGrist({
    routeId,
    filePath: `/grist/tables/${routeId}.json`,
  });

  const data = records.map(({ id, fields }) => {
    return {
      id,
      currentCount: fields.currentCount,
      ...mapEntityFields({
        entity,
        fields,
      }),
      ...mapEntityFields({
        entity: "institution",
        fields,
      }),
    };
  });

  writeAsReference({
    data,
    filePath: `/grist/transformed/${routeId}.json`,
  });

  if (typeof filter?.slug !== "undefined") {
    return data.filter((it) => it[entity]["slug"] === filter["slug"]);
  }

  return data;
};

// We have to use module.exports here
// for interoperability with next.config.js
module.exports = {
  getDatabaseUpdatedAt,
  getHumanRemains,
  getHumanRemainsSummary,
  getInstitution,
  getInstitutionSummary,
  getInstitutionUnderMicroscope,
  getInstitutionUnderMicroscopeSimple,
  getOrigin,
  getAncestry,
  getAncestryInstitution,
  getContinent,
  getContinentInstitution,
  getCountry,
  getCountryInstitution,
  getRegion,
  getRegionInstitution,
};

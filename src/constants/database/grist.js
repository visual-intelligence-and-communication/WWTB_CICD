const GRIST_API_ROUTES = (config = GRIST_CONFIG) => {
  const getTableUrl = getTable(config);
  const { baseUrl, docId } = config;

  return {
    // Shared
    database: `${baseUrl}/docs/${docId}`,
    // Human remains
    humanRemains: getTableUrl("HumanRemains"),
    humanRemainsSummary: getTableUrl("HumanRemains_summary"),
    // Institution
    institution: getTableUrl("Institution"),
    institutionSummary: getTableUrl("Institution_summary"),
    institutionUnderMicroscope: getTableUrl(
      "HumanRemains_summary_ancestry_continent_country_institution_originCategory_region"
    ),
    institutionUnderMicroscopeSimple: getTableUrl(
      "HumanRemains_summary_ancestry_continent_country_institution_region"
    ),
    // Origin
    origin: getTableUrl("Origin"),
    // Origins
    ancestry: getTableUrl("Ancestry"),
    ancestryInstitution: getTableUrl(
      "HumanRemains_summary_ancestry_institution"
    ),
    continent: getTableUrl("Continent"),
    continentInstitution: getTableUrl(
      "HumanRemains_summary_continent_institution"
    ),
    country: getTableUrl("Country"),
    countryInstitution: getTableUrl("HumanRemains_summary_country_institution"),
    region: getTableUrl("Region"),
    regionInstitution: getTableUrl("HumanRemains_summary_institution_region"),
  };
};

const GRIST_DATA_PATH = "/grist";

const GRIST_DATABASE_FILE_PATH = GRIST_DATA_PATH + "/database.json";

const GRIST_CONFIG = {
  baseUrl: process.env.GRIST_BASE_URL ?? "https://docs.getgrist.com/api",
  docId: process.env.GRIST_DOC_ID ?? "jxjNGz9LgRHx",
  apiKey: process.env.GRIST_API_KEY ?? "",
};

const GRIST_HEADERS = ({ apiKey } = GRIST_CONFIG) => {
  return {
    Accept: "application/json",
    "Accept-Encoding": "gzip, deflate, br",
    Authorization: `Bearer ${apiKey}`,
  };
};

const getTable =
  ({ baseUrl, docId }) =>
  (tableId) => {
    return `${baseUrl}/docs/${docId}/tables/${tableId}/records`;
  };

// We have to use module.exports here
// for interoperability with next.config.js
module.exports = {
  GRIST_API_ROUTES,
  GRIST_CONFIG,
  GRIST_DATA_PATH,
  GRIST_DATABASE_FILE_PATH,
  GRIST_HEADERS,
};

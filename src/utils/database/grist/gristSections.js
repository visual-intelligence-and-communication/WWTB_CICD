const Bottleneck = require("bottleneck/es5");
const limiter = new Bottleneck({ maxConcurrent: 3, minTime: 500 });

const { writeAsReference } = require("../writeFileIn");

const {
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
} = require(".");

const getGristIntro = async () => {
  const [institutionSummary, databaseUpdatedAt] = await Promise.all([
    getInstitutionSummary(),
    getDatabaseUpdatedAt(),
  ]);

  const data = { ...institutionSummary, ...databaseUpdatedAt };

  writeAsReference({
    data,
    filePath: `/grist/sections/gristIntro.json`,
  });

  return data;
};

const getGristOriginSelection = async () => {
  const [continents, regions, countries, ancestries] = await Promise.all([
    getContinent(),
    getRegion(),
    getCountry(),
    getAncestry(),
  ]);

  const data = [
    {
      label: "Continent",
      slug: "continent",
      currentCount: continents.reduce((a, b) => a + b.currentCount, 0),
      items: continents,
    },
    {
      label: "Region",
      slug: "region",
      currentCount: regions.reduce((a, b) => a + b.currentCount, 0),
      items: regions,
    },
    {
      label: "Country",
      slug: "country",
      currentCount: countries.reduce((a, b) => a + b.currentCount, 0),
      items: countries,
    },
    {
      label: "Ancestry",
      slug: "ancestry",
      currentCount: ancestries.reduce((a, b) => a + b.currentCount, 0),
      items: ancestries,
    },
  ];

  const { writeAsReference } = require("../writeFileIn");

  writeAsReference({
    data,
    filePath: `/grist/sections/gristOriginSelection.json`,
  });

  return data;
};

const getGristInstitutionUnderMicroscope = async (filter) => {
  const [institution, institutionUnderMicroscope] = await Promise.all([
    getInstitution(filter),
    getInstitutionUnderMicroscope(filter),
  ]);
  
  const connectedContinents = institutionUnderMicroscope
    .filter((it) => it.parent === filter.slug)
    .map((it) => it.slug);

  const missingContinents = institution[0].continents.filter(
    (it) => connectedContinents.indexOf(it) === -1
  );

  const data = [
    {
      id: institution[0].id,
      category: "institution",
      slug: institution[0].slug,
      label: institution[0].label,
      parent: "",
      currentCount: institution[0].currentCount,
      // ...(institution[0].address && {address: institution[0].address}) // dain: add address
    },
    // TODO: fill in continents info
    ...missingContinents.map((it) => ({
      slug: it,
      parent: institution[0].slug,
      label: it,
      category: "continent",
    })),

    ...institutionUnderMicroscope,
  ];

  writeAsReference({
    data,
    filePath: `/grist/sections/gristInstitutionUnderMicroscope.json`,
  });

  return data;
};

const updateDatabaseCache = async () => {
  await Promise.all([
    limiter.wrap(getDatabaseUpdatedAt)(),
    limiter.wrap(getHumanRemains)(),
    limiter.wrap(getHumanRemainsSummary)(),
    limiter.wrap(getInstitution)(),
    limiter.wrap(getInstitutionSummary)(),
    limiter.wrap(getInstitutionUnderMicroscope)(),
    limiter.wrap(getInstitutionUnderMicroscopeSimple)(),
    limiter.wrap(getOrigin)(),
    limiter.wrap(getAncestry)(),
    limiter.wrap(getAncestryInstitution)(),
    limiter.wrap(getContinent)(),
    limiter.wrap(getContinentInstitution)(),
    limiter.wrap(getCountry)(),
    limiter.wrap(getCountryInstitution)(),
    limiter.wrap(getRegion)(),
    limiter.wrap(getRegionInstitution)(),
  ]);
};

// We have to use module.exports here
// for interoperability with next.config.js
module.exports = {
  getGristInstitutionUnderMicroscope,
  getGristIntro,
  getGristOriginSelection,
  updateDatabaseCache,
};

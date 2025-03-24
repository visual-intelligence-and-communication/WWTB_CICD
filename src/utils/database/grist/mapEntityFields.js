const mapEntityFields = ({
  entity,
  fields,
  keys = ["currentCount", "slug", "label", "latitude", "longitude"],
}) => {
  const obj = {};
  keys.forEach((key) => {
    obj[key] = fields[`${entity}_${key}`];
  });
  return { [entity]: obj };
};
exports.mapEntityFields = mapEntityFields;

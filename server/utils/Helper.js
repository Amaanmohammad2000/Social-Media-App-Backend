const convertSnakeCase = require("lodash.snakecase");
const {
  Sequelize: { Op },
  sequelize
} = require("../../database");

const generateWhereCondition = (data) => {
  const where = {};
  const searchConditions = [];
  (data || []).forEach((element) => {
    const { key: KeyCamelCase, ...values } = element;

    if (KeyCamelCase === "searchString" && values.searchString && values.fields?.length) {
      const substrings = values.searchString
        .split(" ")
        .map((s) => s.trim())
        .filter(Boolean);

      const orConditions = substrings.map((word) => ({
        [Op.or]: values.fields.map((field) => {
          const formattedField = field.includes(".") ?
            `$${[...field.split(".").slice(0, -1), convertSnakeCase(field.split(".").at(-1))].join(".")}$`
            : convertSnakeCase(field);

          return {
            [formattedField]: { [Op.iLike]: `%${word}%` }
          };
        })
      }));

      if (orConditions.length === 1) {
        searchConditions.push(orConditions[0]);
      } else if (orConditions.length > 1) {
        searchConditions.push({ [Op.or]: orConditions });
      }

      return;
    }

    const [key1, key2] = KeyCamelCase.split(".");

    const key = convertSnakeCase(key2 || key1);

    const [secondKey] = Object.keys(values);

    let value;

    if (secondKey === "eq") {
      value = { [Op.eq]: values[secondKey] };
    }
    if (secondKey === "in") {
      value = { [Op.in]: values[secondKey] };
    }
    if (secondKey === "nin") {
      value = { [Op.notIn]: values[secondKey] };
    }
    if (secondKey === "neq") {
      value = { [Op.ne]: values[secondKey] };
    }
    if (secondKey === "gt") {
      value = { [Op.gt]: values[secondKey] };
    }
    if (secondKey === "gte") {
      value = { [Op.gte]: values[secondKey] };
    }
    if (secondKey === "lt") {
      value = { [Op.lt]: values[secondKey] };
    }
    if (secondKey === "lte") {
      value = { [Op.lte]: values[secondKey] };
    }
    if (secondKey === "like") {
      value = { [Op.like]: `%${values[secondKey]}%` };
    }

    if (secondKey === "iLike") {
      value = { [Op.iLike]: `%${values[secondKey]}%` };
    }
    if (secondKey === "startsWith") {
      value = { [Op.like]: `${values[secondKey]}%` };
    }
    if (secondKey === "iStartsWith") {
      value = { [Op.iLike]: `${values[secondKey]}%` };
    }

    let KeyValue;

    if (key2) {
      if (!where[key1]) {
        where[key1] = {};
      }
      if (where[key1][key]) {
        KeyValue = where[key1][key];
      }
      where[key1][key] = { ...KeyValue, ...value };
    } else {
      if (where[key]) {
        KeyValue = where[key];
      }
      where[key] = { ...KeyValue, ...value };
    }
  });

  if (searchConditions.length) {
    where[Op.and] = [...(where[Op.and] || []), ...searchConditions];
  }

  return where;
};

const generateOrderCondition = (data) => {
  const order = (data || []).map((element) => {
    const { direction, key } = element;

    return [convertSnakeCase(key), direction];
  });

  return order;
};

module.exports = {
  generateWhereCondition,
  generateOrderCondition
};

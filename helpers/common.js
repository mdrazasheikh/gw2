import _ from "lodash";

export const filterEmpty = (data) => {
    return _.filter(data, (o) => !_.isEmpty(o));
};
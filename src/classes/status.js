const statusType = {
    NOT_POSTED: 'not_posted',
    POSTED: 'posted',
    ON_CARRIAGE: 'on_carriage',
    OUT_OF_DELIVERY: 'out_of_delivery',
    DELIVERED: 'delivered',
    RETURNED: 'returned',
    ERROR: 'error',
};

class StatusItem {
    date;
    description;
    from;
    to;
    lati;
    long;
    icon;
    color;
    type;

    constructor(
        to,
        from,
        description,
        type = statusType.NOT_POSTED,
        icon = '',
        color = '',
        lati = '',
        long = '',
        date = new Date(),
    );
}

module.exports = {
    statusType,
    StatusItem,
};
